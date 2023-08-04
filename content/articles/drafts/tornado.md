Slug: tornado
Date: 20190405
Status: draft
[TOC]

## 简介

tornado是python的异步的网络框架模块，tornado在应对高并发请求上性能很好。

### 安装

### 第一个例子

```python
import tornado.ioloop
import tornado.web

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.write("Hello, world")

def make_app():
    return tornado.web.Application([
        (r"/", MainHandler),
    ])

if __name__ == "__main__":
    app = make_app()
    app.listen(8888)
    tornado.ioloop.IOLoop.current().start()
```

这是一个同步的webapp框架，可能后面会用的较少，这里主要了解一下tornado编写的webapp的基本结构:

### 开启tornado的事件驱动循环:

```
tornado.ioloop.IOLoop.current().start()
```

这个大体类似于asyncio的:
```
asyncio.get_event_loop().run_forever()
```

从tornado5.0开始，tornado已经自动和asyncio集成起来了，这里所谓的集成指的是：tornado的事件驱动自动挂载到asyncio的主事件驱动循环之上了。

### make a app

我们需要创建一个Application对象，这个Application对象后面再详细讨论:

```python
def make_app():
    return tornado.web.Application([
        (r"/", MainHandler),
    ])
```

然后从上面的代码我们就已经看到，根据不同的URL将分发不同的Handler，这个类似于flask的URL和视图函数分发过程。所以我们也可以把这里的 MainHandler 看作一个视图处理类。

### 编写各个视图处理类:
```python
class MainHandler(tornado.web.RequestHandler):
    def get(self):
         self.write("Hello, world")
```
视图处理类里面很多细节后面再详细讨论之。

### 一个简单的异步例子

```python
import tornado.ioloop
import tornado.web

class MainHandler(tornado.web.RequestHandler):
    async def get(self):
        self.write("Hello, world")

def make_app():
    return tornado.web.Application([
        (r"/", MainHandler),
    ])

if __name__ == "__main__":
    app = make_app()
    app.listen(8888)
    tornado.ioloop.IOLoop.current().start()
```

实际上就是将你需要异步的函数写成asyncio的协程形式即可，因为以前接触过tornado的老版本，不得不承认现在tornado进步很大啊，和asyncio集成之后代码更加的简洁了。

### tornado.gen.coroutine vs asyncio.coroutine

请参看官方文档的 [这里](http://www.tornadoweb.org/en/stable/guide/coroutines.html) ，实际上我试了一下，将 `@gen.coroutine` 替换为 `@asyncio.coroutine` webapp也是可以正常运行的。

正如官方文档所说，这里主要是兼容性的考虑，Tornado的coroutine runner更通用，可以适应其他框架，而asyncio的coroutine runner并不接受其他框架的corotine。一般还是推荐使用tornado提供的装饰器 `@gen.coroutine` 吧。





## tornado的全局变量

tornado的某些代码只希望运行一次，可让目标对象成为全局变量，如果是Handler级别的全局变量，那么可以直接将全局变量申请放在Handler类里面。

而如果你想某个全部变量多个Handler之间共用，也就是该全局变量是Application级别的，那么可以 [这个网页](<https://stackoverflow.com/questions/25067916/python-tornado-updating-shared-data-between-requests>) 提供的解决方案。

大致就是各个Hanlder接收字典参数，然后在 `initialize` 方法初始化时将变量赋值过来：

```python
class PageTwoHandler(tornado.web.RequestHandler):
    def initialize(self, configs):
        self.configs = configs

    def get(self):
        self.write(str(self.configs) + "\n")


class Application(tornado.web.Application):
    def __init__(self):
        handlers = [('/pageone', PageOneHandler, {'configs' : configs}),
                ('/pagetwo', PageTwoHandler, {'configs': configs})]
        settings = dict(template_path='/templates',
                    static_path='/static', debug=False)
        tornado.web.Application.__init__(self, handlers, **settings)

```



## 如何正确的关闭tornado进程

因为有的时候需要定制tornado关闭动作，然后和supervisor配合有时会出现端口无法正常释放，加上希望tornado能够温和的关闭重启而不杀死正在进行的动作保证数据的完整和安全，这个问题在网上已经看到很多人提及了，经过一番搜索之后，感觉github仓库下的 [这个issue](<https://github.com/tornadoweb/tornado/issues/1791>)【20190606还open着的】可能下面的描述更值得我们细看一下。

这里面我获得的一个背景知识是，server.stop() 是只停止接收新的请求，但是那些keepalive的请求是无效的。

然后supervisor默认发送的信号是 `signal.SIGTERM` ，可能有其他关闭信号是 `signal.SIGINT` 。

```python
async def shutdown():
    periodic_task.stop()
    http_server.stop()
    for client in ws_clients.values():
        client['handler'].close()
    await gen.sleep(1)
    ioloop.IOLoop.current().stop()

def exit_handler(sig, frame):
    ioloop.IOLoop.instance().add_callback_from_signal(shutdown)

...
if __name__ == '__main__':
    signal.signal(signal.SIGTERM, exit_handler)
    signal.signal(signal.SIGINT,  exit_handler)
```

也许应该注意关闭动作里面的休眠时间使用的是 gen.sleep 。有待进一步观察。

## Application对象

    tornado.web.Application(handlers=None, default_host='', transforms=None, **settings)

### url分发部分

上面的handlers参数主要进行url分发工作，其是一个列表，里面是一些所谓的 `URLSpec` 对象:

    tornado.web.URLSpec(pattern, handler, kwargs=None, name=None)

-   pattern就是一个匹配url分发的正则表达式
-   handler是 `RequestHandler` 的子类，定义了具体url分发过来之后做些什么。
-   kwargs，字典值，这个值将传递给handler的 `initialize` 方法，这个后面再说。
-   name，确切来说是给这个url分发规则取个名字，等下可以用 `Application.reverse_url(name,*args)` 来解析出具体的某个url，这个大体类似于flask的 url\_for 和 endpoint的概念。

然后pattern正则表达式我们知道有那个圆括号包围起来的group的概念，比如:

    r"/story/([0-9]+)"

这里group匹配到的参数，将作为入口参数传递个 `RequestHandler` 对象的 HTTP method，也就是 `get` `post` 等。

然后我们看到 `Application.reverse_url(name,*args)` 其后接受的一些参数也对应这里的正则表达式匹配，其反向解析url将进行匹配子group的替换操作。

然后kwargs这个字典值，传递给 `initialize` 方法大致如下所示:

```python
class StoryHandler(RequestHandler):
    def initialize(self, db):
        self.db = db

    def get(self, story_id):
        self.write("this is story %s" % story_id)

app = Application([
    url(r"/story/([0-9]+)", StoryHandler, dict(db=db), name="story")
    ])
```





### 配置部分

`settings` 收集一系列的有关Application的配置信息，具体有很多，不一而足，下面列出一些:

-   **debug:** 是否开启debug模式
-   **template\_path:** 定义模板文件夹所在位置
-   **static\_path:** 定义静态文件夹所在位置

### listen方法

为这个application开启一个HTTP Server，然后指定监听端口。

## RequestHandler对象

每一个请求过来都将创建一个 `RequestHandler` 对象，然后其将执行 `initialize` 方法；然后其将执行 `prepare` 方法，prepare方法是HTTP协议具体方法无关的；然后其将执行具体某个HTTP协议的方法，比如 `get` `post` `put` 等等，url正则表达式匹配的子group也将作为参数传进去，这个前面有所提及的；然后其将执行 `on_finish` 方法。

## 单元测试

tornado的单元测试样例如下:

这是 `api.py` 文件:

```python
import tornado
import logging
from tornado.web import RequestHandler
import time


class AnalyticsBWSpecificHour(RequestHandler):
    def get(self):
        return self.write({'message':'no get method'})


class Application(tornado.web.Application):
    def __init__(self,**kwargs):
        api_handlers = [
            (r"/", AnalyticsBWSpecificHour),
        ]

        logging.debug(api_handlers)

        super(Application, self).__init__(api_handlers, **kwargs)
```

这是 `test_api.py` 文件:

```python
from api import Application

from tornado.testing import AsyncHTTPTestCase
import tornado
import logging
logging.basicConfig(level=logging.DEBUG)
import unittest

class ApiTestCase(AsyncHTTPTestCase):
   def get_app(self):
        self.app = Application()
        return self.app

    def test_status(self):
        response = self.fetch('/',method='GET')
        self.assertEqual(response.code,200)

if __name__ == '__main__':
    unittest.main()
```

请参看 [这个网页](http://stackoverflow.com/questions/36928232/how-to-do-unit-test-on-tornado) ，这里讲到 `self.fetch` 方法已经默认会进行 `self.get_url` 操作了。

## tornado异常输出完全json风格化

tornado app 如果发生异常了，其会调用对应的 RequestHandler 的 `write_error` 方法，你可以自定义这个方法，从而使其返回 json 格式的信息。更多信息请参看 [这个网页](http://nanvel.name/2014/12/handle-errors-in-tornado-application) 。

## 附录

## 参考资料

1.  [官方文档](http://www.tornadoweb.org/en/stable/index.html) ，其他的中文翻译版本可能有点过时了。
2.  [tornado简介一书](http://docs.pythontab.com/tornado/introduction-to-tornado/)

