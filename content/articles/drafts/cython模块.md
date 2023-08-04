Slug: cython-module
Tags:  python, 
Status: draft


[TOC]

## 找到性能瓶颈所在

首先需要确认脚本或者某个函数具体到底是哪里出现了性能瓶颈：
```
python -m cProfile test.py
```
或者使用jupyter notebook 的timeit 功能，或者自己写 time计时。

目前我知道的循环结构提速很明显，然后指定静态类型会提速。

一般的python代码cython都是支持的，但一般我们是重点去开发那个限速的目标函数，而不会到处优化的。

参考资料1的例子，没有加速，N设置为3000，用时 53.301s，加速之后，用时4.186s。然后没有加速的那个exp运算了很多很多次，大概花了一两秒的样子，所以我们看到原始python代码在循环操作上开销很大。某些关键计算如果循环次数太多，那么就要考虑上c扩展优化了。

在做性能测试的时候有一类耗时较多的操作是不用考虑c代码优化的，这类耗时多的操作就是IO等待型操作，有的是等待数据库IO操作，有的是等待文件读写IO操作，有的是等待网络IO请求等等。这些请求很多都和socket套接字请求相关。

## pyx文件

关于pyx文件的更多请查看cython的官方手册。

下面重点讲一下 python模块包的管理方案，推荐是利用 setuptools 来，

```python
from setuptools import setup, find_packages, Extension
ext1 = Extension("expython.common", ["expython/common.pyx"])

EXTENSIONS = [ext1]

setup(
    zip_safe=False,
    ext_modules=EXTENSIONS,
)
```
这里Extension类：

- 第一个参数name就是你想让这个目标加速模块（python文件就叫模块，多个带__init__.py的叫包）在总模块中叫什么名字，支持点标记。
- 第二个参数 sources，一个列表，把一些文件路径写上就是了。



## 集成原始c代码

有的时候你会写一些原始的c代码，那么怎么利用cython集成进来呢。

```python
from setuptools import setup, find_packages, Extension
from Cython.Distutils import build_ext

ext1 = Extension(name= "expython.wrapped",
                 sources=["expython/clib/cgfun.c", "expython/clib/wrapped.pyx"],
                 libraries = [],
                 include_dirs = [])
                 
EXTENSIONS = [ext1]


setup(
    name='...',
    ...
    packages=find_packages(exclude=['ez_setup', 'examples', 'tests']),
    zip_safe=False,
    cmdclass={"build_ext": build_ext},
    ext_modules=EXTENSIONS,
)
```

setup.py 里面的核心代码如上所示，具体有几个文件: cgfun.c cgfun.h wrapped.pyx 的内容如下所示，然后实际引用的时候你可以在 clib的 `__init__.py` 哪里写上：

```
from expython.wrapped import is_prime, fibonacci, factorial
```

这样你就可以：

```
from expython.clib import is_prime, fibonacci, factorial
```

cgfun.c 的内容如下：

```


int cgcd(int x, int y) {
    int g = y;
    while (x > 0) {
        g = x;
        x = y % x;
        y = g;
    }
    return g;
}


long cfib(long n){
    long i;
    long a=0;
    long b=1;
    long tmp;
    for (i=0; i<n; ++i){
        tmp = b;
        b = a + b;
        a = tmp;
    }
    return a;
}
```

cgfun.h 的内容如下：

```
#ifndef __CGFUN_H__
#define __CGFUN_H__

int cgcd(int a, int b);


long cfib(long n);


#endif
```

wrapped.pyx的内容如下：

```
cimport cython



cdef extern from "cgfun.h":
    int cgcd(int a, int b)
    long cfib(long n)


def gcd(a, b):
    return cgcd(a, b)

def fibonacci(n):
    return cfib(n - 1)


def factorial(int x):
    """
    cython language
    """

    cdef int m = x
    cdef int i

    if x <= 1:
        return 1
    else:
        for i in range(1, x):
            m = m * i
        return m

@cython.boundscheck(False)
@cython.cdivision(True)
def is_prime(int n):
    '''test input integer n is a prime.
>>> is_prime(0)
False
>>> is_prime(-5)
False
>>> is_prime(5)
True
>>> is_prime(123)
False
    '''

    if n == 2:
        return True
    elif n < 2 or (not n & 1):
        return False
    
    cdef int x
    for x in range(3, int(n ** 0.5) + 1, 2):
        if n % x == 0:
            return False
    return True
```

更多高级只是比如集成numpy等等，就需要查看cython官方文档了。







## 参考资料
1. [Cython 入门教程](https://charlesnord.github.io/2017/03/11/cython-tuto/)
2. [github上一个简单的cython样例](https://github.com/thearn/simple-cython-example)
3. [python3 cookbook相关讨论](http://python3-cookbook.readthedocs.io/zh_CN/latest/c15/p10_wrap_existing_c_code_with_cython.html)
