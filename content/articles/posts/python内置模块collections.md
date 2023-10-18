Slug: python-builtin-module-collections
Date: 20231019

[TOC]

## collections模块
### deque数据结构

本小节主要参考了 [这个网页](http://python3-cookbook.readthedocs.io/zh_CN/latest/c01/p03_keep_last_n_items.html) 。

我想读者可能已经接触过queue结构了吧，queue结构是一端进data，然后另一端出data，这样形成了先进先出的数据流。而deque结构两端都可以进两端都可以出，这看上有点古怪，如果你只使用一端的话，那么其好像一个堆栈结构，是先进后出的；而如果一端只是进，另一端只是出，其又好像一个queue结构。那么其有什么优势呢？deque结构最大的优势，也就是我们需要使用它的原因是: 其两端插入元素和删除元素的时间复杂度是O(1)，是一个常数级，而列表开头插入或删除元素的时间复杂度是O(N)，所以如果我们需要一个类似列表的数据存储结构，而这个数据结构中，开头的几个元素和末尾的几个元素都比较重要，经常被访问，那么就应该使用deque结构。

上面的网页介绍了这么一个函数，用来返回一个文件最后的几行:

```python
from collections import deque
def tail(filename, n=10):
    'Return the last n lines of a file'
    with open(filename) as f:
        return deque(f, n)
```


其是利用了deque还有一个size定长的概念，输入的队列进入deque时较老的元素会被丢弃。我不太清楚这种做法效率如何，不过这种写法还是很优雅的。

### Orderdict类

字典一般没有排序的需求吧，就是有也可以输出的时候再排序，再说OrderedDict和一般字典比较起来存储开销大了一倍，能不用就不用吧。不过在某些情况下，用这个类确实能带来一些便利。我第一次遇到这种情况大体是在bilibili的api对接那里，其计算密钥需要将所有参数排序然后urlencode为字符串然后再基于这个字符串进行一些计算。

```
    params = OrderedDict(sorted(params.items(), key=lambda t: t[0]))
    string = urlencode(params)
```


大体在某些情况下，总是要求某个字典值变量按照某个顺序输出，那么用OrderedDict还是很便利的。其顺序就是按照其插入顺序来的，所以进入之前我们还是要做字典排序工作，所以我们可以看作这是一个自动进行了某种操作的便捷对象吧。


##Counter类

Counter类是真有用，而且还不是一般的好用。下面的例子来自参考资料2，不多说，看看代码大体就了解了:

```
    words = [
        'look', 'into', 'my', 'eyes', 'look', 'into', 'my', 'eyes',
        'the', 'eyes', 'the', 'eyes', 'the', 'eyes', 'not', 'around', 'the',
        'eyes', "don't", 'look', 'around', 'the', 'eyes', 'look', 'into',
        'my', 'eyes', "you're", 'under'
    ]
    from collections import Counter
    word_counts = Counter(words)
    # 出现频率最高的3个单词
    top_three = word_counts.most_common(3)
    print(top_three)
    # Outputs [('eyes', 8), ('the', 5), ('look', 4)]
```


Counter 对象是字典的子类，所以字典的一般方法它都有，下面就不赘述了。然后 `update` 方法我们应该理解为同key之间的加法， 此外还有 `subtract` 方法可以看作同key之间的减法。此外你还可以做:

这种加减运算和上面提及的 update 方法和 subtract 方法还是有点区别的，加法大体类似，主要是减法将会自动去掉计数小于等于零的项，而 `subtract` 方法不会。

```
    >>> a = Counter(words)
    >>> b = Counter(morewords)
    >>> a
    Counter({'eyes': 8, 'the': 5, 'look': 4, 'into': 3, 'my': 3, 'around': 2,
    "you're": 1, "don't": 1, 'under': 1, 'not': 1})
    >>> b
    Counter({'eyes': 1, 'looking': 1, 'are': 1, 'in': 1, 'not': 1, 'you': 1,
    'my': 1, 'why': 1})
    >>> # Combine counts
    >>> c = a + b
    >>> c
    Counter({'eyes': 9, 'the': 5, 'look': 4, 'my': 4, 'into': 3, 'not': 2,
    'around': 2, "you're": 1, "don't": 1, 'in': 1, 'why': 1,
    'looking': 1, 'are': 1, 'under': 1, 'you': 1})
    >>> # Subtract counts
    >>> d = a - b
    >>> d
    Counter({'eyes': 7, 'the': 5, 'look': 4, 'into': 3, 'my': 2, 'around': 2,
    "you're": 1, "don't": 1, 'under': 1})
    >>>
```


这个数据结构最为人们数值的统计频数了，通过调用 `most_common(n)` 方法，n是排行榜的前n名。

### namedtuple

collections模块里面的namedtuple函数将会产生一个有名字的数组的类（有名数组），通过这个类可以新建类似的实例。比如：

    from collections import namedtuple
    
    Point3d=namedtuple('Point3d',['x','y','z'])
    p1=Point3d(0,1,2)
    print(p1)
    print(p1[0],p1.z)
    
    Point3d(x=0, y=1, z=2)
    0 2




### ChainMap

将多个字典组合成为一个map字典，想到的一个应用就是配置字典流，利用ChainMap定义搜索路径流，先搜索到的配置优先取用。

```python
from collections import ChainMap
d1 = {'a':1,'b':2}
d2 = {'a':2,'d':3}
d3 = ChainMap(d1, d2)
```
