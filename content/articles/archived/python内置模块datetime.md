Slug: python-builtin-module-datetime
Date: 20231019

[TOC]


## datetime模块


简单的日期时间操作用time模块里面的一些函数即可，datetime模块是用类的方式来处理的，适合大量处理日期时间的任务。然后值得一提的是mongodb的python接口 `pymongo` 里面（连接mongodb的python第三方模块），日期时间的输入输出都是datetime 对象的，这很是方便。

下面简要介绍之，更多内容请参看 [官方文档](https://docs.python.org/3.4/library/datetime.html) 。

### timedelta对象

通过timedelta函数返回一个timedelta对象，也就是一个表示时间间隔的对象。函数参数情况如下所示:

    class datetime.timedelta([days[, seconds[, microseconds[, milliseconds[, minutes[, hours[, weeks]]]]]]])

其没有必填参数，简单控制的话第一个整数就是多少天的间隔的意思:

    datetime.timedelta(10)

两个时间间隔对象可以彼此之间相加或相减，返回的仍是一个时间间隔对象。而更方便的是一个datetime对象如果减去一个时间间隔对象，那么返回的对应减去之后的datetime对象，然后两个datetime对象如果相减返回的是一个时间间隔对象。这很是方便。

### datetime对象

通过datetime函数可以创建一个datetime对象:

    class datetime.datetime(year, month, day[, hour[, minute[, second[, microsecond[, tzinfo]]]]])

其中year，month和day是必填参数。下面是一个简单的例子:

    >>> db_t = {
    ...  "date": datetime.datetime(1777,07,07)
    ... }
    >>> db_t
    {'date': datetime.datetime(1777, 7, 7, 0, 0)}

其通过pymongo存入mongodb之后是这样的形式:

    ISODate("1777-07-07T00:00:00.000Z")

#### now和utcnow方法

datetime对象有 `now` 和 `utcnow`
这两个*类方法*（classmethod）来返回当前日期时间的datetime对象。utcnow不可以接受参数，now方法可以接受一个tz指定时区的参数，我们可以通过
*pytz* 模块（一个处理时区推荐的第三方模块）来具体指明某个时区。

##### 查看pytz的所有时区

参看[这个网页](http://stackoverflow.com/questions/13866926/python-pytz-list-of-timezones)。

    >>> pytz.all_timezones
    ['Africa/Abidjan', 'Africa/Accra', 'Africa/Addis_Ababa', 'Africa/Algiers', ......

##### 具体给now方法指定一个时区

参看[这个网页](http://stackoverflow.com/questions/2331592/datetime-datetime-utcnow-why-no-tzinfo)。

    import pytz
    datetime.datetime.now(tz = pytz.timezone("Asia/Hong_Kong"))

##### now方法和utcnow方法区别

我们看下面这个例子:

    >>> datetime.now(tz = pytz.timezone("UTC")),datetime.utcnow()
    (datetime.datetime(2015, 7, 11, 9, 25, 20, 266863, tzinfo=<UTC>), datetime.datetime(2015, 7, 11, 9, 25, 20, 266888))

如果我们给now方法指定默认的时区是\"UTC\"，那么我们看到其返回的datetime对象和utcnow返回的datetime对象基本上没什么区别，后面的微秒（$10^{-6}$秒）有点区别完全可以理解。然后我们再看now方法如果不加任何参数会如何:

    >>> now
    datetime.datetime(2015, 7, 11, 16, 34, 43, 144018)
    >>> utcnow
    datetime.datetime(2015, 7, 11, 8, 34, 56, 319108)

这里now显示的时间和本地的时间是一致的，说明now默认的时区是本地的时区参数。谈到这里大家应该就明白了，如果是后台数据库有日期时间输入需求，为了保持时间戳的一致性，推荐都使用utcnow方法来生成时间戳，也就是实际上都以UTC格林威治时区为准。如果到前端需要显示给用户具体的日期时间了，如果要引用前端数据库的日期时间，才需要引入时区的考虑进行必要的转换。然后如果前端需要用python生成实时的时间，那么就用now方法再引入pytz的时区控制。

#### datetime对象的属性

    >>> from datetime import datetime
    >>> d = datetime.now()
    >>> d.year
    2015
    >>> d.month
    11
    >>> d.day
    3
    >>> d.hour
    18
    >>> d.minute
    42
    >>> d.second
    57
    >>> d.tzinfo
    >>> d
    datetime.datetime(2015, 11, 3, 18, 42, 57, 919613)

具体含义如下所示:

year

:   年

month

:   月

day

:   日

hour

:   时

minute

:   分

second

:   秒

microsecond

:   微秒

#### strftime方法

datetime对象可以如下调用 `strftime` 方法或者 `__format__`
方法来得到一个好看的你想要的日期时间字符串格式:

        >>> from datetime import datetime
        >>> d = datetime.now()
        >>> d.strftime('%T')
        '18:52:39'
        >>> d.__format__('%F')
        '2015-11-03'

这里的格式符号python官方文档有所述及，而更实际上是和linux系统下的 `date`
命令的格式符一致的，读者可以用 `date --help`
来看一下，就可以看到如下信息:

        %%      一个文字的 %
        %a      当前locale 的星期名缩写(例如： 日，代表星期日)
        %A      当前locale 的星期名全称 (如：星期日)
        %b      当前locale 的月名缩写 (如：一，代表一月)
        %B      当前locale 的月名全称 (如：一月)
        %c      当前locale 的日期和时间 (如：2005年3月3日 星期四 23:05:25)
        %C      世纪；比如 %Y，通常为省略当前年份的后两位数字(例如：20)
        %d      按月计的日期(例如：01)
        %D      按月计的日期；等于%m/%d/%y
        %e      按月计的日期，添加空格，等于%_d
        %F      完整日期格式，等价于 %Y-%m-%d
        %g      ISO-8601 格式年份的最后两位 (参见%G)
        %G      ISO-8601 格式年份 (参见%V)，一般只和 %V 结合使用
        %h      等于%b
        %H      小时(00-23)
        %I      小时(00-12)
        %j      按年计的日期(001-366)
        %k   hour, space padded ( 0..23); same as %_H
        %l   hour, space padded ( 1..12); same as %_I
        %m   month (01..12)
        %M   minute (00..59)
        %n      换行
        %N      纳秒(000000000-999999999)
        %p      当前locale 下的"上午"或者"下午"，未知时输出为空
        %P      与%p 类似，但是输出小写字母
        %r      当前locale 下的 12 小时时钟时间 (如：11:11:04 下午)
        %R      24 小时时间的时和分，等价于 %H:%M
        %s      自UTC 时间 1970-01-01 00:00:00 以来所经过的秒数
        %S      秒(00-60)
        %t      输出制表符 Tab
        %T      时间，等于%H:%M:%S
        %u      星期，1 代表星期一
        %U      一年中的第几周，以周日为每星期第一天(00-53)
        %V      ISO-8601 格式规范下的一年中第几周，以周一为每星期第一天(01-53)
        %w      一星期中的第几日(0-6)，0 代表周一
        %W      一年中的第几周，以周一为每星期第一天(00-53)
        %x      当前locale 下的日期描述 (如：12/31/99)
        %X      当前locale 下的时间描述 (如：23:13:48)
        %y      年份最后两位数位 (00-99)
        %Y      年份
        %z +hhmm                数字时区(例如，-0400)
        %:z +hh:mm              数字时区(例如，-04:00)
        %::z +hh:mm:ss  数字时区(例如，-04:00:00)
        %:::z                   数字时区带有必要的精度 (例如，-04，+05:30)
        %Z                      按字母表排序的时区缩写 (例如，EDT)

其中的 `%F` 和 `%T` 在python官方文档中并无说明，可见其内部API是和这个
`date` 命令一致的。

#### 支持的时间间隔运算

前面提到了一个datetime对象减去一个timedelta对象返回一个datetime对象，然后一个datetime对象减去一个datetime对象返回一个时间间隔对象。比如此时之前一年的时间可以这样表达
`datetime.datetime.utcnow() - datetime.timedelta(365)`
。然后此时和爱因斯坦的生日时间间隔可以这样表达:

    datetime.datetime.utcnow() - datetime.datetime(1879,03,14)

然后我们可以利用这个时间间隔来进行一些操作和判断。

        >>> delta = datetime.datetime.utcnow() - datetime.datetime(1879,03,14)
        >>> delta
        datetime.timedelta(49792, 35970, 903285)
        >>> delta > datetime.timedelta(120*365)
        True
        >>> delta.days // 365
        136

### `struct_time`` 对象转化成为 datetime 对象

参看[这个网页](http://stackoverflow.com/questions/1697815/how-do-you-convert-a-python-time-struct-time-object-into-a-datetime-object)

    from time import mktime

mktime函数接受time模块的 `struct_time` object，其可以来自time模块的
`gmtime` 、`localtime` 、 `strptime`
这些函数，mktime函数将返回一个时间戳，然后用datetime模块的
`fromtimestamp` 函数可以接受这个时间戳。

总的过程即:

    from time import mktime
    from datetime import datetime
        
    dt = datetime.fromtimestamp(mktime(struct))

### datetime 对象转化为 `time_struct`` 对象

参考了 [这个网页](http://stackoverflow.com/questions/8022161/python-converting-from-datetime-datetime-to-time-time)

    >>> t = datetime.datetime.now()
    >>> t
    datetime.datetime(2011, 11, 5, 11, 26, 15, 37496)
    
    >>> time.mktime(t.timetuple()) + t.microsecond / 1E6
    1320517575.037496




### 获取一个月最后的一天

首先要说的是利用python的datetime和timedelta对于 `days` 的加减操作是能够很好地支持跨月问题的:

```
    >>> from datetime import datetime
    >>> d = datetime.now()
    >>> d
    datetime.datetime(2016, 5, 29, 8, 50, 20, 337204)
    >>> from datetime import timedelta
    >>> d - timedelta(days = 29)
    datetime.datetime(2016, 4, 30, 8, 50, 20, 337204)
    >>> d - timedelta(days = 28)
    datetime.datetime(2016, 5, 1, 8, 50, 20, 337204)
```


但是有的时候你就是需要直接获知某个月份的最后一天是30还是31等等，然后利用replace来获得一个月的最后一天。这个时候你需要利用 calendar 的 `monthrange` 函数。参考了 [这个网页](http://stackoverflow.com/questions/42950/get-last-day-of-the-month-in-python) 。

```
    >>> d.replace(year = 2016,month=4,day = monthrange(2016,4)[-1])
    datetime.datetime(2016, 4, 30, 8, 50, 20, 337204)
```
