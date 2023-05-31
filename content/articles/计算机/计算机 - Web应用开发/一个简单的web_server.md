Slug: 500lines-simple-web-server
Date: 20201205
Tags: 500lines



[TOC]

## 前言

本文主要是对500lines项目的 [a simple web server](http://aosabook.org/en/500L/a-simple-web-server.html) 这篇文章的学习和讨论，这篇文章写得是极好的，这篇文章弄清楚了，对django或者flask在做一些什么事，就已经有一个大概的眉目了。

关于TCP/IP协议和HTTP协议的一些细节这里就略过讨论了。

我们的web服务器要做的工作如下：

- 占着某个端口号等着某个HTTP请求包发过来
- 你知道的HTTP请求包有一定的格式，具体哪些信息进行parse操作
- 确定该请求要做点什么（分发GET POST）
- 程序做点什么
- 生成返回的数据格式，比如html等。
- 将返回的数据做成HTTP协议要求的响应格式传回去

上面步骤的前两步和最后一步python的 `HTTPServer` 已经帮我们自动做了。现在只需要关注第三四五步。



## 第一个例子

下面代码已针对python3版本进行了修改：

```python
from http.server import HTTPServer, BaseHTTPRequestHandler

class RequestHandler(BaseHTTPRequestHandler):
    """Handle HTTP requests by returning a fixed 'page'."""

    # Page to send back.
    Page = '''\
<html>
<body>
<p>Hello, web!</p>
</body>
</html>
'''

    # Handle a GET request.
    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-Type", "text/html")
        self.send_header("Content-Length", str(len(self.Page)))
        self.end_headers()
        self.wfile.write(self.Page.encode())


if __name__ == '__main__':
    serverAddress = ('', 8080)
    server = HTTPServer(serverAddress, RequestHandler)
    server.serve_forever()
```

`BaseHTTPRequestHandler` 将会分析HTTP请求然后决定调用具体那个方法，比如现在HTTP请求是GET方法，那么将调用本类的 `do_GET` 方法。具体该类内部是如何实现根据不同的HTTP请求方法来调用本类的不同的方法的，感兴趣的可以了解下，相关代码如下所示： 

```python
    mname = 'do_' + self.command
    if not hasattr(self, mname):
        self.send_error(
            HTTPStatus.NOT_IMPLEMENTED,
            "Unsupported method (%r)" % self.command)
        return
    method = getattr(self, mname)
    method()
```

其中 self.command 就是http协议请求头传过来的GET或者POST等，然后 handler类会去找对应的方法，找到了再进行对应的操作。





## 简单的模板输出方案

上面的HTML返回内容可以建立其一种模板输出机制，该文章是基于python字符串format方法来实现的，后面接触到的flask里面的jinja2模板引擎或者django自带的模板引擎等都是类似的过程，只是更复杂更多面手。



## 挂载静态文件

静态文件就是找到对应的文件，然后返回就是了。

```python
import os
from http.server import HTTPServer, BaseHTTPRequestHandler


class ServerException(Exception):
    """For internal error reporting."""
    pass


class RequestHandler(BaseHTTPRequestHandler):
    """Handle HTTP requests by returning a fixed 'page'."""

    Error_Page = """\
        <html>
        <body>
        <h1>Error accessing {path}</h1>
        <p>{msg}</p>
        </body>
        </html>
        """

    def do_GET(self):
        try:
            full_path = os.getcwd() + self.path

            if not os.path.exists(full_path):
                raise ServerException("'{0}' not found".format(self.path))

            elif os.path.isfile(full_path):
                self.handle_file(full_path)

            else:
                raise ServerException("Unknown object '{0}'".format(self.path))

        except Exception as msg:
            self.handle_error(msg)

    def handle_file(self, full_path):
        try:
            with open(full_path, 'rb') as reader:
                content = reader.read()
            self.send_content(content)
        except IOError as msg:
            msg = "'{0}' cannot be read: {1}".format(self.path, msg)
            self.handle_error(msg)

    def handle_error(self, msg):
        content = self.Error_Page.format(path=self.path, msg=msg)
        self.send_content(content.encode(), 404)

    def send_content(self, content, status=200):
        self.send_response(status)
        self.send_header("Content-type", "text/html")
        self.send_header("Content-Length", str(len(content)))
        self.end_headers()
        self.wfile.write(content)


if __name__ == '__main__':
    serverAddress = ('', 8080)
    server = HTTPServer(serverAddress, RequestHandler)
    server.serve_forever()
```

注意这里对文件不存在的异常处理，一个成熟的web server将有自己的一套异常规范。

## 自动挂载index.html

```python
import os
from http.server import HTTPServer, BaseHTTPRequestHandler


class ServerException(Exception):
    """For internal error reporting."""
    pass


class case_no_file(object):
    """File or directory does not exist."""

    def test(self, handler):
        return not os.path.exists(handler.full_path)

    def act(self, handler):
        raise ServerException("'{0}' not found".format(handler.path))


class case_existing_file(object):
    """File exists."""

    def test(self, handler):
        return os.path.isfile(handler.full_path)

    def act(self, handler):
        handler.handle_file(handler.full_path)


class case_directory_index_file(object):
    """Serve index.html page for a directory."""

    def index_path(self, handler):
        return os.path.join(handler.full_path, 'index.html')

    def test(self, handler):
        return os.path.isdir(handler.full_path) and \
               os.path.isfile(self.index_path(handler))

    def act(self, handler):
        handler.handle_file(self.index_path(handler))


class case_always_fail(object):
    """Base case if nothing else worked."""

    def test(self, handler):
        return True

    def act(self, handler):
        raise ServerException("Unknown object '{0}'".format(handler.path))


class RequestHandler(BaseHTTPRequestHandler):
    """Handle HTTP requests by returning a fixed 'page'."""
    Cases = [case_no_file(),
             case_existing_file(),
             case_directory_index_file(),
             case_always_fail()]

    Error_Page = """\
        <html>
        <body>
        <h1>Error accessing {path}</h1>
        <p>{msg}</p>
        </body>
        </html>
        """

    def do_GET(self):
        try:
            self.full_path = os.getcwd() + self.path

            for case in self.Cases:
                if case.test(self):
                    case.act(self)
                    break

        except Exception as msg:
            self.handle_error(msg)

    def handle_file(self, full_path):
        try:
            with open(full_path, 'rb') as reader:
                content = reader.read()
            self.send_content(content)
        except IOError as msg:
            msg = "'{0}' cannot be read: {1}".format(self.path, msg)
            self.handle_error(msg)

    def handle_error(self, msg):
        content = self.Error_Page.format(path=self.path, msg=msg)
        self.send_content(content.encode(), 404)

    def send_content(self, content, status=200):
        self.send_response(status)
        self.send_header("Content-type", "text/html")
        self.send_header("Content-Length", str(len(content)))
        self.end_headers()
        self.wfile.write(content)


if __name__ == '__main__':
    serverAddress = ('', 8080)
    server = HTTPServer(serverAddress, RequestHandler)
    server.serve_forever()

```

现在代码和之前相比多了一个如果是文件夹那么试着自动挂载该文件夹下的index.html文件。然后现在代码结构发生了很大的变化，具体就是定义了一种类，这个类的test方法进行测试，如果如何条件则会执行act动作，否则继续下一个类的测试。

这实际上是一种if-elif的加强版本，针对不同的路径或者当前路径下的不同参数或者当前路径下面临的不同情况采取不同的动作。flask或者django的路由分发就是类似的过程。

也正是这种机制，后面再有各种情况都只是添加一些这种类和动作了。

## 如果文件夹下没有index.html

就是再加上了`case_directory_no_index_file` 和对应的动作。

```python
#!/usr/bin/env python
# -*-coding:utf-8-*-

import os
from http.server import HTTPServer, BaseHTTPRequestHandler


class ServerException(Exception):
    """For internal error reporting."""
    pass


class case_no_file(object):
    """File or directory does not exist."""

    def test(self, handler):
        return not os.path.exists(handler.full_path)

    def act(self, handler):
        raise ServerException("'{0}' not found".format(handler.path))


class case_directory_no_index_file(object):
    """Serve listing for a directory without an index.html page."""

    def index_path(self, handler):
        return os.path.join(handler.full_path, 'index.html')

    def test(self, handler):
        return os.path.isdir(handler.full_path) and \
               not os.path.isfile(self.index_path(handler))

    def act(self, handler):
        handler.list_dir(handler.full_path)


class case_existing_file(object):
    """File exists."""

    def test(self, handler):
        return os.path.isfile(handler.full_path)

    def act(self, handler):
        handler.handle_file(handler.full_path)


class case_directory_index_file(object):
    """Serve index.html page for a directory."""

    def index_path(self, handler):
        return os.path.join(handler.full_path, 'index.html')

    def test(self, handler):
        return os.path.isdir(handler.full_path) and \
               os.path.isfile(self.index_path(handler))

    def act(self, handler):
        handler.handle_file(self.index_path(handler))


class case_always_fail(object):
    """Base case if nothing else worked."""

    def test(self, handler):
        return True

    def act(self, handler):
        raise ServerException("Unknown object '{0}'".format(handler.path))


class RequestHandler(BaseHTTPRequestHandler):
    """Handle HTTP requests by returning a fixed 'page'."""
    Cases = [case_no_file(),
             case_existing_file(),
             case_directory_index_file(),
             case_directory_no_index_file(),
             case_always_fail()]

    Listing_Page = """\
        <html>
        <body>
        <ul>
        {0}
        </ul>
        </body>
        </html>
        """

    Error_Page = """\
        <html>
        <body>
        <h1>Error accessing {path}</h1>
        <p>{msg}</p>
        </body>
        </html>
        """

    def do_GET(self):
        try:
            self.full_path = os.getcwd() + self.path

            for case in self.Cases:
                if case.test(self):
                    case.act(self)
                    break

        except Exception as msg:
            self.handle_error(msg)

    def handle_file(self, full_path):
        try:
            with open(full_path, 'rb') as reader:
                content = reader.read()
            self.send_content(content)
        except IOError as msg:
            msg = "'{0}' cannot be read: {1}".format(self.path, msg)
            self.handle_error(msg)

    def list_dir(self, full_path):
        try:
            entries = os.listdir(full_path)
            bullets = ['<li>{0}</li>'.format(e) for e in entries if not e.startswith('.')]
            page = self.Listing_Page.format('\n'.join(bullets))
            self.send_content(page.encode())
        except OSError as msg:
            msg = "'{0}' cannot be listed: {1}".format(self.path, msg)
            self.handle_error(msg)

    def handle_error(self, msg):
        content = self.Error_Page.format(path=self.path, msg=msg)
        self.send_content(content.encode(), 404)

    def send_content(self, content, status=200):
        self.send_response(status)
        self.send_header("Content-type", "text/html")
        self.send_header("Content-Length", str(len(content)))
        self.end_headers()
        self.wfile.write(content)


if __name__ == '__main__':
    serverAddress = ('', 8080)
    server = HTTPServer(serverAddress, RequestHandler)
    server.serve_forever()
```





## 简单的cgi接口实现

接下来的cgi接口实现代码也是很简单的：

```python
class case_cgi_file(object):
    '''Something runnable.'''

    def test(self, handler):
        return os.path.isfile(handler.full_path) and \
               handler.full_path.endswith('.py')

    def act(self, handler):
        handler.run_cgi(handler.full_path)
        
    def run_cgi(self, full_path):
        cmd = "python " + full_path
        child_stdin, child_stdout = os.popen2(cmd)
        child_stdin.close()
        data = child_stdout.read()
        child_stdout.close()
        self.send_content(data)
```

其核心就是针对某个python脚本文件，启动cgi协议接口，简单来说就是启动一个python解释器运行一下目标脚本文件，然后获取其返回的内容，作为web server的返回内容返回即可。

## 后话

上面挂载静态文件到显示index.html在实践中这部分工作一般是不会扔给python程序的，一般nginx在前面就应该完成这大部分工作。也就是HTTP的各个请求分为很多不同的类别，这些请求很多已经被nginx响应并返回了。具体我们接触的flask或者django框架处理的HTTP请求就是上面的cgi接口部分。

当然不可能一个HTTP请求过来了专门给它运行一个flask进程，那开销太大了。这个时候就要提到[PEP3333](https://www.python.org/dev/peps/pep-3333/) 定义了 Python Web Server Gateway Interface ，叫做python web server 网关协议，简称WSGI协议。我们接触的flask或者django或者其他web server框架在开发的时候都要遵守这个PEP3333规范，也就是遵守WSGI协议规范。

该协议有很多具体技术细节，比如middleware层的设计啊，如何分析path和path上的参数等等啊。这些在具体研究这些web server框架的时候再讨论。