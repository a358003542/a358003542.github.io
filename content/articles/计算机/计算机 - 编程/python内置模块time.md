Slug: python-builtin-module-time
Date: 20231019
Modified: 20241104

[TOC]

## time模块
本文简要介绍time模块，更多内容请参看 [官方文档](https://docs.python.org/zh-cn/3/library/time.html) 。

time模块提供了一些和时间相关的函数，更加的底层，不具有平台通用性, 一般应用会优先推荐使用datetime模块和calendar模块或者其他第三方模块,只在必要时使用time模块.


## time函数
返回从 `1970-01-01, 00:00:00 (UTC)` 开始到现在经过的秒数.

## sleep函数 
调用方线程停止执行几秒. 

在使用异步编程的时候如果使用sleep函数整个线程都会暂停,所以线程下面的所有协程流程都会被暂停,如果只是想暂停某个协程的执行流程,应该用异步编程那边推荐的方法.

