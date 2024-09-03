Slug: python-builtin-module-itertools
Date: 20231019

[TOC]

## itertools模块 

### repeat函数

其定义函数如下：

    def repeat(object, times=None):
        # repeat(10, 3) --> 10 10 10
        if times is None:
            while True:
                yield object
        else:
            for i in range(times):
                yield object

也就是返回一个可迭代对象，这么封装最大的一个用处是用于填充map函数或者zip函数的某个常数值。因为你填写repeat(5)之后将一个返回一个可迭代对象，不停的返回数字5而不需要你考虑长度问题。

### starmap函数

starmap函数具体定义如下所示：

    def starmap(function, iterable):
        # starmap(pow, [(2,5), (3,2), (10,3)]) --> 32 9 1000
        for args in iterable:
            yield function(*args)

其接受一个可迭代对象，然后逐个将可迭代对象中的元素解包之后送入函数当参数（最后当然函数也执行了）。

### 可迭代对象flatten操作

```
a_list = [[1, 2], [3, 4], [5, 6]]
print(list(itertools.chain.from_iterable(a_list)))
# Output: [1, 2, 3, 4, 5, 6]

# or
print(list(itertools.chain(*a_list)))
# Output: [1, 2, 3, 4, 5, 6]
```




### 利用product函数来遍历组合

product函数在 `itertools` 模块里面，按照官方文档的说明是product(A, B)返回值等价于((x,y) for x in A for y in B)，也就是各种可能的组合情况（类似于笛卡尔积的概念）:

```
>>> list(product(['a','b'],['c']))
[('a', 'c'), ('b', 'c')]
```


此外单一迭代加上 `repeat` 参数也会生成一些很有意思的结果:

```
>>> list(product(['True','False'],repeat=len('abc')))
[('True', 'True', 'True'), ('True', 'True', 'False'), ('True', 'False', 'True'), ('True', 'False', 'False'), ('False', 'True', 'True'), ('False', 'True', 'False'), ('False', 'False', 'True'), ('False', 'False', 'False')]
```


这可以看作:
```
>>> list(product(['True','False'],['True','False'],['True','False']))
[('True', 'True', 'True'), ('True', 'True', 'False'), ('True', 'False', 'True'), ('True', 'False', 'False'), ('False', 'True', 'True'), ('False', 'True', 'False'), ('False', 'False', 'True'), ('False', 'False', 'False')]
```

