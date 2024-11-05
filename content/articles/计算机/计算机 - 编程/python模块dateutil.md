Slug: python-module-dateutil
Date: 20190918
Modified: 20241104


[TOC]

## dateutil模块
安装是运行:

```
pip install python-dateutil
```

本文简要介绍python的第三方日期时间处理支持模块dateutil,更多细节参考 [官方文档](https://dateutil.readthedocs.io/en/stable/) .



## relativedelta
python自带的timedelta对某个datetime对象进行加减, 我记得以前似乎是不能很好应对跨月问题, 但最近测试显示是可以的, 至于闰年问题是不是已经很好地解决了不太清楚, 不管怎么说, 还是推荐使用dateutil模块的 relativedelta函数.


```
from dateutil.relativedelta import relativedelta
now = datetime.utcnow()
sdt = now - relativedelta(months=months)
```



## rrule
虽然没有lrule，但根据上面的relativedelta配置的起始时间，然后指定结束时间，通过rrule函数来生成一个时间区间，有时是很方便的。

```
from dateutil.rrule import rrule, MONTHLY

def get_datetime_range(months, tz=timezone.utc):
    """
    返回一系列的datetime object 列表, 从当前时间往前数几个月.

    >>> get_datetime_range(1) # doctest: +SKIP
    [datetime.datetime(2024, 10, 5, 14, 27, 46, tzinfo=datetime.timezone.utc),
    datetime.datetime(2024, 11, 5, 14, 27, 46, tzinfo=datetime.timezone.utc)]

    >>> get_datetime_range(0) # doctest: +SKIP
    [datetime.datetime(2024, 11, 5, 14, 27, 53, tzinfo=datetime.timezone.utc)]

    """
    start_dt = dt_current(tz=tz) - relativedelta(months=months)
    return list(rrule(freq=MONTHLY, dtstart=start_dt, until=dt_current(tz=tz)))

```



## parse
根据给定的日期时间字符串来获得datetime object, 某些简单的情况下用datetime的 `strptime` 够用了, 如果情况较复杂, 你可以看看dateutil提供的 parse函数, 也许能够很好地解决你的问题.

