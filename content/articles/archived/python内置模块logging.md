Slug: python-builtin-module-logging
Date: 20231019

[TOC]


## logging模块


在软件开发中，两个东西最易被初学者忽视，但实际上却是最有用的工具:
一个是单元测试；一个是日志输出管理。python的官方内置模块logging可以帮助你更好地管理自己的日志汇报系统。一个好的日志汇报系统不仅能够帮助程序员调试debug，用户向专业人员汇报发生错误时候的信息，还可以帮助人们理解程序具体是如何运行的和运行到了那里，在干些什么，这些都是非常有用的。

### 什么时候使用logging

有的时候一些简单的函数调试就可以使用print函数来进行一些输出信息，这在编程早期还是有用的。而后续不管是调试还是编程都推荐使用单元测试的方法。而在大型软件项目中，print函数则是更应该少出现，只有那些程序员希望用户看到的信息才能使用print函数（当然某些经过io重定向的print函数不在这里的讨论范围之内）。

程序员有时想要看看某个大型软件内部具体是如何运作的，丑陋的做法是print，然后注释掉。这样也不是不可以，只是最好程序员做的一切工作都能保存起来拿到台面上，毕竟这都是劳动。logging模块的第一个用途就出来了:
我们可以使用 `logging.info()`
这个函数，来输出某些信息，这些信息只有在你调低了logging等级之后（默认的是
**WARNING** ），才会显示出来。低于 **WARNING** 等级的还有一个函数
`logging.debug()`
。info函数的信息通常是程序员用来确认程序是按照预期运行的，debug函数的信息通常是出现某个bug了，程序员希望有助于他debug的输出信息。

`logging.warn()`
函数用来发出警告信息，并且程序员应该修改程序来避免这个信息出现；
`logging.warning`
函数用来发出警告信息，这种情况程序员表示在我的预料之中，是用户不应该这样做，程序不需要修改，但信息应该被记录。

然后特别重大的错误或异常捕捉，这个使用python的 `try... except...`
语句，或者raise抛出异常，这自不必多说。只是有某些情况，程序员不愿抛出这个异常，而是希望压抑这个错误，则可以使用logging模块的
`error()` 函数或者 `exception()` 函数或者 `critical()` 函数。

具体这些函数的严重等级是:

最简单的一个使用例子如下所示:

    import logging
    
    logging.basicConfig(level=logging.DEBUG)
    
    logging.debug('debug')
    logging.info('info')
    logging.warning('warning')

这里的basicConfig函数对整个日志系统进行一些配置。比如这里设置日志报告等级
`level=logging.DEBUG` ，这样我们将会看到 **DEBUG** 以及 **DEBUG**
以上等级的日志信息；然后如果设置为 `logging.INFO` ，则就只看到 **INFO**
和 **INFO** 以上等级的信息了。

### 将日志信息输出到文件

更专业的做法是将日志输出到文件中去，即使是自己调试，对于大型软件项目来说，日志信息是很多的，将其保存到文件，然后用编辑器或者shell工具或者其他工具查看会更便捷一些。要将这些日志信息都输出到某个文件中很简单，在
**basicConfig** 设置 `filename` 参数即可:

    import logging
    
    logging.basicConfig(filename='test.log', level=logging.DEBUG)
    
    logging.debug('debug')
    logging.info('info')
    logging.warning('warning')

默认的 **filemode** 是 \"a\"
，也就是日志信息一直累积在那里。你可以多运行几次这个小py脚本，来看看具体的效果。
**filemode** 也可以设置为 \"w\" ，则只保存最后那次运行的日志信息。

### logging模块中级教程

logging模块的中级使用需要了解如下几个词汇：loggers, handlers, filters,
and formatters。

#### loggers

**记录器**
之前我们运行logging.info，就是调用的默认的记录器，然后一般我们会针对每个python的模块文件创建一个记录器。

    logger = logging.getLogger(__name__)

这个 `__name__`
只是一种简便的命名方法，如果你勤快或者某种情况下有需要的话完全可以自己手工给记录器取个名字。

然后这个 `getLogger`
函数如果你后面指定的名字之前已经定义了（这通常是指在其他第三方模块下定义了），那么你通过这个
`getLogger`
然后指定目标名字就会得到对应的该记录器。这通常对于DIY某个第三方模块的日志记录器有用。

记录器可以挂载或者卸载某个处理器对象或过滤器对象：

-   logger.addHandler()

-   logger.removeHandler()

-   logger.addFilter()

-   logger.removeFilter()

记录器通过 `setLevel()`
方法来设置最小记录级别，这个和后面的Handler级别是协作关系。

记录器的propagate参数这里值得详细说下，记录器的名字自己定义也好，还是用
`__name__`
这样python自带的模块结构语法也好，其有个上层和下层的关系，比如说
`main.test` 这个记录器是属于 `main` 这个记录器的。而这里讨论的
`propagate` 参数，默认是True，也就是发送给 `main.test`
记录器的信息也会传递给其上层 `main`
记录器上去。如果设置为False则不会往上传递了。

#### handlers

**处理器**负责分发日志信息到目标地去。这里主要介绍这几个Handler类：

StreamHandler

:   将信息以流的形式输出，这通常指输出到终端

FileHandler

:   将信息写入到某个文件中去

RotatingFileHandler

:   将信息写入某个文件，如果文件大小超过某个值，则另外新建一个文件继续写。

TimeRotatingFileHandler

:   将信息写入某个文件，每隔一段时间，比如说一天，就会自动再新建一个文件再往里面写。

处理器对象也有 `setLevel` 方法，这个前面也提及了，和记录器的 `setLevel`
是协作关系，更详细的描述是，信息先记录器处理并分发给对应的处理器对象，然后再处理器处理再分发到目的地。

处理器可以挂载 **格式器** 对象和 **过滤器** 对象。

-   handler.setFormatter()

-   handler.addFilter()

-   handler.removeFilter()

#### filters

**过滤器**

#### formatters

**格式器**，具体信息的格式定义。

这里的format涉及到的一些参数设置如下所示:

    -   %(levelname)s 类似'DEBUG'这样的logging level
    -   %(message)s 具体输出的信息
    -   %(asctime)s 具体时间，默认是'2003-07-08 16:49:45,896'，你可以通过 **datefmt** 选项来进一步设置格式，格式设置和strftime命令类似。
    -   %(filename)s 文件名，更简洁的表达是模块名。
    -   %(module)s 模块名
    -   %(funcName)s 函数名
    -   %(lineno)d 具体logging代码在第几行
    
    -   %(name)s logger的名字，默认是'root'。
    -   %(process)d 进程号
    -   %(processName)s 进程名
    -   %(thread)d 线程号
    -   %(threadName)s 线程名

### 字典统一配置

django的setting.py就会有这样的配置，具体含义还是很明显的，就是定义处理器，格式器，记录器等。

    LOGGING = {
        'version': 1,
        'disable_existing_loggers': False,
        'formatters': {
            'simple': {
                'format': "%(asctime)s %(name)s [%(levelname)s] %(thread)d %(module)s %(funcName)s %(lineno)s: %(message)s"
            }
        },
        'handlers': {
            'log_file': {
                'class': 'sdsom.common.log.DedupeRotatingAndTimedRotatingFileHandler',
                'filename': config.get('web', 'log_path'),
                'when': 'midnight',
                'maxBytes': int(config.get('web', 'log_max_bytes')),
                'interval': 1,
                'backupDay': int(config.get('web', 'log_backup_days')),
                'dedupetime': int(config.get('web', 'log_dedupe_time')),
                'formatter': 'simple'
            },
        },
        'loggers': {
            'django.request': {
                'handlers': ['log_file'],
                'level': config.get('web', 'log_level'),
                'propagate': True,
            },
        }
    }


### 在logging中使用pprint

参考了 [这个网页](https://stackoverflow.com/questions/11093236/use-logging-print-the-output-of-pprint) 。

有的时候logging的输出我们希望调用pprint从而输出打印更加美观些，可以调用pformat函数来达到这个效果：

```python
from pprint import pprint, pformat
ds = [{'hello': 'there'}]
logging.debug(pformat(ds))
```
