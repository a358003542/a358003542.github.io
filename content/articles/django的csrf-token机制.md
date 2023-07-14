# 基本原理
django的csrf token机制对于django的学习新手来说还是很头疼的，因为这个时候还没有太多精力去深究这里面的东西，但有时常常对新手的一些测试开发工作造成困扰。

通过debug和简单阅读django的源码之后，下面简单介绍下csrf token的基本作用原理。

其是一个django中间件，每个请求来了都会试着读取cookie里面的csrftoken这个值。

```
Cookie: csrftoken=?????
```

这个只是要在request.META里面装载一个值，对后面的流程没有影响。

具体起作用的是进入每个视图函数之前 `process_view` ，这里面逻辑还有有一些，下面择重点说一下。

如果是GET之类安全的方法会直接放行。

POST方法首先看POST对象带没带csrfmiddlewaretoken这个值，这是走页面表单，那个隐含标签，然后POST过来的时候自带的。

如果没有则可能走AJAX的，会试着读取X-CSRFToken这个HEADER。

综合上面两个总要获取到一个值，这个值要和Cookie里面的csrftoken这个值是对应上的。对应上就通过了，对应不上或者为空则csrf token核对失败。


![img]({static}/images/2023/csrf_token_1.png)


# 安全问题？
看了一下默认的csrftoken的有效期是一年，因为csrftoken还有同源判断，这可能是django将这个有效期设置得这么长的原因吧。

cookie里面的那个sessionid有效期就短得多了，那个sessionid如果泄露了，黑客就可以让服务器相信这个请求是另外一个人了。当然了django默认的sessionid加密只要不泄露，还是很安全的，你要说黑客已经物理入侵了，那黑客早就已经攻破防线了，而不是django的这个机制不够安全的问题了。JWT等加强版token更安全无非是token有效期时间更短等等。

就我们这种可以打开开发者工具的这种，已经是物理级别的暴露了，任何加密方式，目标请求都是可以伪造出去的。毕竟HTTP协议请求的机制就摆在那里的。

