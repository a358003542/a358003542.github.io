Slug: python-module-diskcache
Date: 20201018

[TOC]

## 简介

diaskcache模块解决了一个什么问题，其提供了一种本地文件式存储的缓存解决方案。当然也不一定局限在缓存解决方案上，一些简单的不是很重要的临时数据存储也可以利用这个模块来实现。具体其文件存储采用的sqlite数据库，而在使用上我们不需要考虑sql数据库哪一些东西，就可以将其看做一个升级版的具有不错速度的类shelve的解决方案。

diskcache很好用，而且速度还挺快的。项目Github地址在 [这里]( https://github.com/grantjenks/python-diskcache/ ) 。虽然项目星数不是特别多，但从个人使用体验来说，基本上满足了个人的需求了。比如速度快，和python各个数据类型对接方便，更复杂的数据类型没有试过，也没必要，就一般的python数据类型来说，比如列表，字典，字符串之类的，基本上是无缝对接。然后一般缓存需要的过期时间功能它也是有的，所以基本上是一个不错的模块了。

具体使用很方便和简单，建议简单看下[官方tutorial](http://www.grantjenks.com/docs/diskcache/tutorial.html) 即可，下面也简单说明一下。

## 基本使用

首先是建立一个cache对象：

```python
from diskcache import Cache
cache = Cache(cache_path)
```

这个cache对象是线程安全的，上面cache_path就是你想要的缓存存放所在地。

比如windows一般软件数据放在：

```python
user_data_path = os.path.expanduser(os.path.join('~', 'AppData', 'Roaming', APP_NAME))

if not os.path.exists(user_data_path):
    os.mkdir(user_data_path)

cache_path = os.path.join(user_data_path, 'cache')
```

cache对象的使用如下所示：

```python
def set_cache(key, value):
    """
    过期时间 10天
    :param key:
    :param value:
    :return:
    """
    cache.set(key, value, expire=864000)
    
def get_cache(key):
    return cache.get(key)
```

虽然推荐使用 `cache.close()` 方法，但是并不推荐精确到程序元操作级别，get会自动的open cache，但频繁的open开销太大了。一般推荐将这个cache作成更全局的变量，程序结束的时候可以考虑执行 `cache.close` 方法。如果是单线程单进程操作，甚至不调用close也问题不大。但是如果程序是多线程式的，那么就一定要保证及时的close或者如下使用 with 语句：

```
>>> with Cache(cache.directory) as reference:
...     reference.set('key', 'value')
```

如上所示cache的数据也是可以加上过期时间的，即 `expire` 参数，单位是秒。

diskcache还提供了其他功能和类等，就简单的使用介绍就是上面这些了。