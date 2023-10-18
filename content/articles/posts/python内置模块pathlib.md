Slug: python-builtin-module-pathlib
Date: 20231019

[TOC]

## pathlib模块
自python3.4以后起，python3就内置了pathlib模块了。之前的python版本，需要通过pip安装pathlib，后面的使用也差不了太多了。下面的讨论主要参考了python3.4的pathlib模块的官方文档，以其为准。

这个模块主要让我们对系统的路径更加灵活的操作，python取代bash进行系统运维的时候，有大量的对文件名，路径等的操作，pathlib将大大简化我们在这一块的工作量。首先来看一个例子：

    from pathlib import Path
    import os
    
    p1 = Path(os.path.expanduser('~'))
    p2 = Path('.')
    
    print([x for x in p1.glob("*.pdf") if x.is_file()])
    print([x for x in p2.iterdir() if x.is_dir()])

这里Path是可以接受相对路径语法的，所以\".\"和\"..\"都是可用的。然后Path对象有方法glob和iterdir方法，其中glob就是类似linux的glob命令；然后iterdir将遍历当前目录。遍历之后返回了一个可迭代对象（读者可以看一下，是一个生成器对象），展开之后仍然是一个Path对象。然后Path对象有
`is_file` 方法和 `is_dir` 方法来判断该Path对象是不是文件夹或者文件路径。

Path对象有很多便捷的方法，很是好用，比如： **iterdir** ， **exists** ，
**is\_file** ， **is\_dir** ， **parents** ， **cwd**
等等。更多信息请参看官方文档。


marshal模块可以将python的一些变量以二进制的形式读写入文件中，比如jieba分词的词典缓存就是这么做的。

官方文档推荐如果确实有类似的简单存储需求，推荐是使用pickle或者shelve模块，不管怎么说，这个模块简单的使用我们了解下吧。

其支持的对象类型有：

>The following types are supported: booleans, integers, floating point numbers, complex numbers, strings, bytes, bytearrays, tuples, lists, sets, frozensets, dictionaries

简单的使用如下：

```python
with open(cache_file, 'rb') as cf:
    self.FREQ, self.total = marshal.load(cf)

with open(cache_file, 'wb') as temp_cache_file:
    marshal.dump((self.FREQ, self.total), temp_cache_file)
```

load方法加载目标文件对象，返回值是你之前送入的对象。

dump方法是把你想要送进去的对象，送入到某个文件中去。


