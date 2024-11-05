Slug: python-builtin-module-datetime
Date: 20231019
Modified: 20241104

[TOC]


## datetime模块
本文简要介绍datetime模块，更多内容请参看 [官方文档](https://docs.python.org/3.12/library/datetime.html) 。


## datetime对象
一般不用自己从零开始创建一个datetime对象, 不过可以简单看下datetime类的定义:

```
class datetime.datetime(year, month, day[, hour[, minute[, second[, microsecond[, tzinfo]]]]])
```

其中year，month和day是必填参数。

### datetime对象的属性

```
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
```

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

### replace方法
你可以通过replace方法来直接修改某个datetime对象前面提到的那些属性,这种修改是暴力的,比如某月没有31号你强行修改的话会抛异常, 等等违反常识性的操作比如一年只有十二个月,如果发生这种错误程序都会抛异常,所以你最好清楚自己在做什么.

replace方法修改tzinfo时区信息也是暴力的,直接修改不会更改其他属性,如果你希望更改时区并经过一些正确的运算,你可能需要使用 `astimezone` 方法.


### strftime方法
datetime对象可以如下调用 `strftime` 方法或者 `__format__` 方法来得到一个好看的你想要的日期时间字符串格式:

```
>>> from datetime import datetime
>>> d = datetime.now()
>>> d.strftime('%T')
'18:52:39'
>>> d.__format__('%F')
'2015-11-03'
```

常见的这个格式: `2018-12-21 15:39:20` ,其格式代码为: `%Y-%m-%d %H:%M:%S`. 有更多定制需求请参看官方文档.



## timedelta对象
timedelta对象表示一段时间, 一个datetime对象减去一个datetime对象就会返回一个timedelta对象来表示这两个时间点之间的时间间隔.继续你也可以对一个datetime对象加减某个timedelta时间间隔来获得一个新的datetime对象,而且这种加减对月份跨越也有很好的支持.

请参看下面timedelta类的定义,有的时候你可能需要新建一个timedelta对象:

```
class timedelta([days[, seconds[, microseconds[, milliseconds[, minutes[, hours[, weeks]]]]]]])
```

比如 `datetime.timedelta(days=10)` 表示的是10天的间隔.

两个时间间隔timedelta对象之间可以进行加减运算,返回的仍是一个timedelta对象,某些情况下你可能会这样做.

## timezone对象
datetime的tzinfo接受timezone对象来表示时区信息,没有特别的理由后台运算是推荐都统一使用UTC时区: `timezone.utc`. 只有和用户人的习惯相关,和前台展示内容相关才考虑使用其他时区, 不要给自己找麻烦.

你可以如下创建一个其他的时区:

```
timezone_shanghai = timezone(timedelta(hours=8), name='Asia/Shanghai')
```

但如果你真的有时区相关的需要了,那就装上第三方模块 `pytz` 吧.


## 获取一个月最后的一天
利用python的datetime和timedelta对于 `days` 的加减操作是能够很好地支持跨月问题的:

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
