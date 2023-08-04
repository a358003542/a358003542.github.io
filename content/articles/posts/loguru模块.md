Slug: loguru-module
Tags:  python, 
Date: 20190911



keep it simple , keep it stupid . loguru模块大概是符合这一精神的，其让你把精力从一些日志的调配的琐碎事情上抽离出来，好让你有更多的精力去解决核心问题。基本上使用过之后，就好像使用了python的新特性 `f-string` 一样，you just can not stop to use it. 你会忍不住想要使用它。

就最简单的使用：

```
from loguru import logger
```

接触过logging的马上就知道这个logger是个什么东西了，然后就想通常那样 `logger.info('what')` 之类的去打日志即可。默认的logger的日志格式就已经非常好了。

通常这个就已经够用了，实际上容器化了的应用或者某些应用场景，是要求你的日志都打印在默认终端上的，还有某些专门管理日志的工具，也要求你的应用就打印在默认终端。

某些情况下你可能需要将日志同时打印到文件中：

```
logger.add('<filename>.log')
```

此外还支持这样带时间戳的文件名：

```
logger.add('file_{time}.log')
```



文件控制更高级的用法如下：

```
logger.add("file_1.log", rotation="500 MB")    # 文件过大自动开启新的日志文件
logger.add("file_2.log", rotation="12:00")     # 每天12:00 开启新的文件
logger.add("file_3.log", rotation="1 week")    # 一周的时间之后开启新的文件

logger.add("file_X.log", retention="10 days")  # 10天之后清除旧日志

logger.add("file_Y.log", compression="zip")    # 压缩日志
```

loguru还有很多高级用法，这个以后再看，现在最关键的一个问题是如何兼容别的logger，比如说tornado或者django有一些默认的logger。

经过研究，最好的解决方案是参考官方文档的，完全整合logging的工作方式。比如下面将所有的logging都用loguru的logger再发送一遍消息。

```python
class InterceptHandler(logging.Handler):
    def emit(self, record):
        # Retrieve context where the logging call occurred, this happens to be in the 6th frame upward
        logger_opt = logger.opt(depth=6, exception=record.exc_info)
        logger_opt.log(record.levelno, record.getMessage())

logging.basicConfig(handlers=[InterceptHandler()], level=0)
```

这个 `depth=6` 大有讲究，似乎只有设置为6才能正确追踪原日志代码所在地，因为我们是日志信号再发送了的。

然后上面的 `record.levelno` 我发现可能换成 `record.levelname` 也是不错的。

这样原logging的日志流就和loguru整合起来了。



