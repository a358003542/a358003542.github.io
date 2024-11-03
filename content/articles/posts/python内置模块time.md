Slug: python-builtin-module-time
Date: 20231019

[TOC]

## time模块

time模块提供了一些和时间相关的函数，更加的底层，不过有些函数可能在某些平台并不适用。类似的模块还有datetime模块，datetime是以类的框架来解决一些时间问题的。所以如果只是需要简单的调用一下时间，那么用time模块，如果是大量和时间相关的问题，推荐使用datetime模块。

### time函数

    >>> import time
    >>> time.time()
    1404348227.07554

time函数返回一个数值，这个数值表示从1970年1月1号0时0分0秒到现在的时间过了多少秒。

### gmtime函数

这个函数可以接受一个参数，这个参数是多少秒，然后返回一个特定格式的时间数组`struct_time`。如果不接受参数，那么默认接受的秒数由time函数返回，也就是从那个特定时间到现在过了多少秒，这样这个特定格式的时间数组对应的就是当前时间。

    >>> time.gmtime()
    time.struct_time(tm_year=2014, tm_mon=7, tm_mday=3, tm_hour=0, 
    tm_min=53, tm_sec=0, tm_wday=3, tm_yday=184, tm_isdst=0)
    >>> time.gmtime(0)
    time.struct_time(tm_year=1970, tm_mon=1, tm_mday=1, tm_hour=0, 
    tm_min=0, tm_sec=0, tm_wday=3, tm_yday=1, tm_isdst=0)

### localtime函数

此外类似的还有**localtime**函数，和gmtime用法和返回完全一模一样，唯一的区别就是返回的是当地的时间。

    >>> time.strftime('%Y-%m-%d %H:%M:%S',time.localtime())
    '2014-07-03 09:19:40'
    >>> time.strftime('%Y-%m-%d %H:%M:%S',time.gmtime())
    '2014-07-03 01:19:49'

### ctime函数

    >>> time.ctime()
    'Thu Jul  3 08:54:54 2014'
    >>> time.ctime(0)
    'Thu Jan  1 07:00:00 1970'

和gmtime类似，不过返回的是字符串格式的时间。我们看到ctime默认设置的时间是根据localtime函数来的。

### strftime函数

接受那个特定格式的时间数组`struct_time`作为参数，然后返回一定字符串格式的时间。具体例子请参看前面的例子。

其中最常用的格式符有：

    %Y，多少年；%m，多少月；%d，多少日；
    %H，多少小时；%M，多少分；%S，多少秒。

`%X` 直接输出09:27:19这样的格式，也就是前面的多少小时多少分多少秒可以用一个%X表示即可。

还有一些，比如：%I表示多少小时，不过是\[0-12\]的形式；%y表示多少年，不过是\[00-99\]的格式，比如2014年就输出14；%p，本地的AM或PM文字。等等。

### sleep函数 

sleep函数有时需要用到，将程序休眠个几秒的意思。需要接受一个数值参数，单位是秒，可以是零点几秒。但sleep函数只是大概休眠几秒的意思，最好不去用来计时，因为它不大精确。

更多内容请参见[官方文档](https://docs.python.org/3/library/time.html)。