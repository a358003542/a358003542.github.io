Slug: python-module-dateutil
Date: 20190918

[TOC]

一般能够使用python的内置模块datetime解决的问题或者简单写几个辅助函数就能解决的问题是没必要上 python-dateutil 模块的，但有的时候某些问题，上python-dateutil模块会非常的方便，然后我发现好多有名的模块都默认安装这个模块了。



## relativedelta

某些问题，用datetime的replace将某个值设为0或者什么值，或者用timedelta来减去什么值，大部分都能解决，但有的时候，比如跨月份涉及到要考虑天数不等或者其他等等问题，用relativedelta还是很方便的。

总的说来涉及到datetime的某个跨度的计算问题，还是推荐使用 relativedelta函数。

```
from dateutil.relativedelta import relativedelta
now = datetime.utcnow()
sdt = now - relativedelta(months=months)
```



## rrule

虽然没有lrule，但根据上面的relativedelta配置的起始时间，然后指定结束时间，通过rrule函数来生成一个时间区间，有时是很方便的。

```
from dateutil.rrule import rrule, MONTHLY
list(rrule(freq=MONTHLY, dtstart=sdt, until=now))
```



## parse

dateutil 的 parse函数根据输入日期时间字符串来获得datetime object还是很方便的，不过在某些简单的情况下，可能使用datetime的 strftime  函数就够用了。