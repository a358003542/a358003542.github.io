Slug: python-module-pytest
Date: 20200909

[TOC]



unittest模块
------------

编写python测试代码，学习pytest模块之前，必须先学习和了解python官方模块 **unitest** 。首先上例子：

```python
import unittest
import math

class TooBigError(Exception):
    pass

def hello(n):
    if n>2:
        raise TooBigError('too big input error')
    else:
        print('hello'*n)

class FirstTest(unittest.TestCase):
    def setUp(self):
        """setUp函数在每个测试单元执行前被执行，其通常用于预先配置
        一些后面测试单元会用到的参数"""
        pass

    def tearDown(self):
        """tearDown函数在每个测试单元执行之后再执行。"""
        pass

    def test_bool(self):
        """具体的测试单元，名字需要以test字符开始"""
        self.assertTrue(True)
        self.assertFalse(False)
        
    def test_equal(self):
        self.assertEqual(1,1)
        self.assertNotEqual(1,2)
        self.assertAlmostEqual(math.pi, 3.1416,4)
        self.assertNotAlmostEqual(math.pi, 3.1415,4)

    def test_raises(self):
        self.assertRaises(TooBigError, hello, 3)
        
if __name__ == '__main__':
    unittest.main()
```

unittest模块的main函数具体实际执行各个测试单元类，这些测试单元类继承自unittest的TestCase类。在这些继承自TestCase的类中，`setUp` 函数和 `tearDown` 函数有特殊的用途，具体见上面代码的说明。然后里面定义的函数test字符串开头的都是所谓的测试单元，其将被逐个执行。

TestCase有很多方法，比如 `assertTrue` ，`assertFalse` 用于断言某个bool值是真或假，然后 `assertEqual` 用来断言某两个值是相等的(==)，类似的还有 `assertNotEqual` 用来断言两个值不相等。这里值得一提的 `assertAlmostEqual` 方法是用来断言某两个float值在多少小数位上是大致相等的，比如上面的例子，
$\pi$ 值具体到小数点4位是3.1416。上面这些方法后面还可以额外接受一个提示字符串参数（Msg参数），用来具体没有断言成功的时的补充信息。

`assertRaises`方法用来断言某个函数在接受某些参数之后必然返回某个异常。该方法第一个参数是期望捕捉到的异常，第二个参数是具体调用的函数，后面的参数将送给这个函数，所以就不能跟之前谈及的Msg参数了。

更多信息请参看该模块的 [官方文档](https://docs.python.org/3/library/unittest.html) ，大概简单了解下unittest模块即可，实践中推荐使用pytest模块。



## pytest模块

pytest模块是站在unittest基础上的，你之前通过 unittest 写的测试案例，全部都不用更改照样有用，接下来你要写一个新的测试，不需要再新建一个 `unittest.TestCase` 类了（如果你希望多个测试在一个类里面，就新建一个类即可，这个类不需要继承自任何类了。）。

具体使用如下简单的写测试函数即可，也不需要类似unittest那种很多assert方法，就是最简单的 `assert` 确认返回为 True 即可。

```python
def test_prime():
    assert prime(4) == 7
```

这样确实简单方便了不少。下面继续讨论编写单元测试代码中的知识。


## 确认抛出某个异常

把官方的例子copy过来了，看一下就懂了。

```python
import pytest
def f():
    raise SystemExit(1)

def test_mytest():
    with pytest.raises(SystemExit):
        f()
```

## 确认两个数字大约近似

```
assert i == pytest.approx(j, rel=0.1)
assert i == pytest.approx(j, abs=10)
```

默认采用的是rel相对偏差小于 $1e^{-6}$ 。abs是绝对偏差。

## fixture

pytest提出了一个fixture概念，这个fixture非常的有用。最简单的一个使用如下所示：

```python
import pytest

@pytest.fixture
def sample_config():
    return {'a': 1}

def test_config_read(sample_config):
    assert sample_config['a'] == 1
```

也就是你的测试函数里面可以带上那个经过fixture装饰的函数名字，其实一个参数，这个参数的值就是之前fixture装饰的那个函数的返回值，然后这个参数你在测试函数里面是可以直接使用的。

你可以如上将fixture和测试函数写在一起，但更加推荐的做法是：在 `tests` 文件夹下面新建一个 `conftest.py` 文件，你在里面定义的pytest的fixture是全局可共用的。

## setup和teardown怎么实现

结合上面的fixture你可以实现一种全局setup配置和teardown的配置。比如说我的测试用例需要生成一个临时的文件夹，在这个临时文件夹下面做一些操作，然后测试完之后希望删除这个临时文件夹。可以编写如下fixture：

```python

import pytest
import os
import tempfile
import shutil


@pytest.fixture
def tempfolder():
    cwd = os.getcwd()
    t = tempfile.mkdtemp()

    shutil.copytree(os.path.join(cwd, 'tests/test_images'),
                    os.path.join(t, 'test_images'))

    os.chdir(t)
    try:
        print(f'pytest auto-create tempfolder {t}')
        yield t
    finally:
        os.chdir(cwd)
        try:
            shutil.rmtree(t)
        except (OSError, IOError):  # noqa: B014
            pass

```

这里面的一个核心概念是fixture `yield` 后面的动作都属于teardown动作，如果是return的话则没有这个概念。其他测试函数可以直接调用哪个临时测试文件夹参数 `tempfolder` ，然后上面的一个额外动作是将一些文件复制到临时的测试文件夹，方便在临时的测试文件夹下做一些动作。最后teardown的动作就是删除临时文件夹。

## 测试过一次下次不测试了

如果你希望测试函数之前测试过一次了，然后后面就不用测试了，那么就在这个函数上面加上如下装饰器。

```
@pytest.mark.skip(reason="i have test it")
```


## 自己写的python模块和pytest集成

推荐安装的有：`pytest` 和 `pytest-runner` 。然后新建 `setup.cfg` 文件，里面的内容是：

```
[aliases]
test=pytest
```

以后你要测试就输入：
```
python setup.py test
```

这样做的好处是，其是直接利用本地修改的源码，也就是一边修改源码一边实时测试。

这样写的话记得要给pytest传递参数需要加上 `--addopts=` 选项，比如打印更多的信息：

```
python setup.py test --addopts="-v"
```

可能每次写 `--addopts="-v"` 有点麻烦，在 `setup.cfg` 上加上这样一句吧：
```
[tool:pytest]
addopts = --verbose
```

好了，就是：
```
python setup.py test
```
然后专心一边测试一边写代码吧。



## 自动发现测试文件

pytest是支持自动发现测试文件的，所有的 `test_*.py` 和 `*_test.py` 文件都被认为是测试文件。

此外你还可以更明确地新建一个 `pytest.ini` 文件，里面的内容是：

```
[pytest]
testpaths = tests
```

这样pytest就只处理这个tests文件夹下的测试文件了。



## doctest集成

doctest在python源码那边能够立刻起到大概说明这个函数在做什么事情，还是很方便的。这里假设读者已经初步了解了doctest的基本用法了，如果没有请参看官方文档doctest相关部分，接下来的讨论是在这个基础之上，传统写法是不需要做什么改变的。

使用pytest来集成doctest有以下好处，一是python模块文件后面不需要跟上：

```
if __name__ == "__main__":
    import doctest
    doctest.testmod()
```

二是pytest可以自动搜索目标python文件来实现批量doctest，最后就是pytest的原有传统unittest过程不受影响。

你在自动发现测试文件的配置上需要进行做一些调整了：

```
[pytest]
testpaths = tests my_python_module
```

也就是将你的原tests文件夹和你的python模块文件夹都加入搜索目录。

然后你还需要加上这个选项：

```
addopts = --doctest-modules --doctest-continue-on-failure
```

其中 `--doctest-modules` 是开启pytest的doctest，然后 `--doctest-continue-on-failure` 是另外一个选项了，个人推荐加上。


## mock

在写单元测试时，涉及到网络，套接字等编程问题，必然有这个需求，那就是你希望伪造一些数据，拦截某些函数或类的返回值，从而将整个测试从大型软件框架中抽离出来，这个时候就必须要了解mock模块了。mock模块是unittest模块的子模块，即使是使用上pytest，这个mock子模块也是很有用的。

```
from unittest import mock
```

使用mock模块最关键性的问题是理解mock在做什么。mock模块里面最核心的概念是 `Mock` 类 ，我们看到官方文档的这个例子：

```
from unittest import mock
class Test(): pass
t = Test()
t.method = Mock(return_value=3)
t.method = mock.Mock(return_value=3)
t.method()
3
t.method(1,2,3)
3
```

简单来啊就是伪造一个python对象，然后通过定制某些特别的属性和方法来实现你的单元测试代码中你想要的那个python对象。在实践中推荐使用 `MagicMock` ，MagicMock继承自Mock，然后实现了很多python对象的magic method【也就是那一大堆`__what__` 的方法】。








## patch

实际编码中我们可能有这样的需求，那就是需要Mock的对象很复杂，最好是贴近某个真实对象，但是呢又需要做一些修改，这个时候我们就需要使用patch了：

```python
    @mock.patch('users.views.WXAPPAPI.jscode2session', \
                return_value={"openid": "o1ZL90Ble54545ylei7sBhjkjhtG7PLM", "session_key": "4XXDVTc0e4nuDjgjghhfCIcOg==","expires_in": 7200})
    def test_login(self, mock_jscode2session):
        data = {'js_code': '003xXUd30hnknF15454ua5e30xXUdr'}
        
        response = self.client.get(reverse('mini-login'), data)

        # for next testcase
        self.our_session_key = response.data.get('our_session_key')
    
        self.assertEqual(response.status_code, status.HTTP_200_OK)
```


如何理解上面的代码？当这段测试代码运行的时候，它的变量名字空间被patch给污染了，比如上面的 `users.views.WXAPPAPI.jscode2session` 这个函数，被污染成为一个 Mock 对象了，这个Mock对象传递给了这个函数的第二个参数（额外的的这个参数哪怕你后面不用也必须写上） `mock_jscode2session` 。

然后代码在运行的时候遇到`jscode2session` 总会返回上面给出的值，这样你就不用考虑数据库啊，网络情况之类的问题了。上面还有一些小技巧和django框架相关，比如 `self.client.get(reverse('mini-login'), data)` 是直接利用自己django，然后自己请求自己的url获得什么响应，这个和django相关，在这里就不多说了。

