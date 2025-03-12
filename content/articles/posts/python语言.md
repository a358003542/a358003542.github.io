Slug: python-language
Date: 20191018
Modified: 20231019



[TOC]

有问题，问AI，按照28定律，本文大部分内容一般都是用不到的，python编程学完核心教程即可，本文历史原因放在这里。后面应该会慢慢删减成个人碎片笔记，不再整理成文了。


## bytes类型

### 基本编码知识

具体存储在计算机里面的都是二进制流，而如果要将其正确解析成为对应的字符，是需要建立一定的编码规则的。比如大家熟悉的ASCⅡ编码规则。ACSⅡ编码是Latin-1和utf-8等编码的子集，也就是一连串基于ACSⅡ编码的字符串用utf-8编码也能正确解析。

python2中目前也支持 **bytes** 类型了  。然后python2还有一个
**unicode** 类型。

bytes简单的理解就是没有任何字符含义的二进制字节流。然后如这样 `b'test'`
，在前面加个字符b或者B，其将解析为bytes类型。

```text
>>> x = b'test'
>>> x
b'test'
>>> type(x)
<class 'bytes'>
>>> x[0]
116
>>> x[1]
101
>>> list(x)
[116, 101, 115, 116]
>>> 
```

python在打印时会尽可能打印可见字符，尽管上面的x打印显示出了具体的test这个字符，但我们应该认为x是一连串的数字序列而不具有任何字符串含义，如果我们调用bytes类型的**decode**方法，那么bytes类型解码之后将变成str类型。

```text
>>> y = x.decode('utf-8')
>>> y
'test'
>>> type(y)
<class 'str'>
```

当然具体编码方式是否正确，是否正确解析了原bytes字节流那又是另外一回事了。比如还可能是big5或者GB什么的编码。

此外字符串str类型有个**encode**方法可以进行编码操作从而输出对应编码的bytes字节流。

### 使用方法

我们可以如下看一下str类型和bytes类型具体有那些方法差异:

```text
>>> set(dir('abc')) - set(dir(b'abc'))
{'isdecimal', 'casefold', '__rmod__', 'format_map', 'format', 'encode', '__mod__', 'isnumeric', 'isprintable', 'isidentifier'}
>>> set(dir(b'abc')) - set(dir('abc'))
{'decode', 'fromhex'}
```

我们看到bytes和str几乎拥有相同的功能，所以大部分之前学到的用于str字符串类型的那些方法同样可以用于bytes类型中。这多少有点方法泛滥了，因为bytes是字节流类型，内在是没有字符含义的，可能某些方法并不推荐使用。

比如下面的upper方法和replace方法:

```text
>>> b't'.upper()
b'T'
>>> b'testst'.replace(b'st',b'oo')
b'teoooo'
```

然后字节流的连接可以很方便的用加法或join方法来进行，如下所示:

```text
>>> b't' + b'e'
b'te'
>>> b''.join([b'a',b'c'])
b'ac'
```

但是要*注意*，python2里面不管是加法还是join方法都将丢掉那个b修饰符:

```text
>>> b''.join([b'a',b'c'])
'ac'
>>> b'a' + b'b'
'ab'
```

不过这也无关紧要，因为python2里面我们可以理解str就对应的是python3的bytes类型，然后unicode对应的就是python3的str类型。

### bytearray类型

bytearray和bytes类型类似，而且其内部支持的方法和操作也和bytes类型类似，除了其更像是一个列表，可以原处修改而字符串和bytes是不可变的。python2现在也有bytearray类型了，只是内在的文本和二进制是不分的。


## 文件

文件对象是可迭代对象。

### 写文件

对文件的操作首先需要用**open**函数创建一个文件对象，简单的理解就是把相应的接口搭接好。文件对象的**write**方法进行对某个文件的写操作，最后需要调用**close**方法写的内容才真的写进去了。

    file001 = open('test.txt','w')
    file001.write('hello world1\n')
    file001.write('hello world2\n')
    file001.close()

如果你们了解C语言的文件操作，在这里会为python语言的简单便捷赞叹不已。就是这样三句话：创建一个文件对象，然后调用这个文件对象的wirte方法写入一些内容，然后用close方法关闭这个文件即可。

### 读文件

一般的用法就是用**open**函数创建一个文件对象，然后用**read**方法调用文件的内容。最后记得用**close**关闭文件。

    file001 = open('test.txt')
    filetext=file001.read()
    print(filetext)
    file001.close()

此外还有**readline**方法是一行一行的读取某文件的内容。

### open函数的处理模式

open函数的处理模式如下：

'r'

:   默认值，read，读文件。

'w'

:   wirte，写文件，如果文件不存在会创建文件，如果文件已存在，文件原内容会清空。

'a'

:   append，附加内容，也就是后面用write方法内容会附加在原文件之后，同样类似w模式，a也可以创建文件。

'b'

:   处理模式设置的选项，'b'不能单独存在，要和上面三个基本模式进行组合，比如'rb'等，意思是二进制数据格式读。

'+'

:   处理模式设置的选项，同样'+'不能单独存在，要和上面三个基本模式进行组合。+是update的意思，因为是更新逻辑，r+ w+ 和 a+ 都可以读和写，如果文件不存在，r+不会新建文件，而w+ 和 a+会新建一个文件。w+和a+在写上面可以参考w和a，一个是截断之后重新写，一个是附加模式写。如果r+用于写的话情况会比较复杂，网上说不会发生截断，而是从头开始写，但这样新内容和旧内容不就混在一起了吗？一般来说应该是不推荐使用r+模式来写吧。

### 用with语句打开文件

类似之前的例子我们可以用with语句来打开文件，这样就不用close方法来关闭文件了。然后with语句来提供了类似try语句的功能可以自动应对打开文件时的一些异常情况。

    with open('test.txt','w') as file01:
        file01.write('hello world1\n')
        file01.write('hello world2\n')
    
    with open('test.txt','r') as file01:
        filetext=file01.read()
        print(filetext)



### 文件操作推荐方式
除了read直接读取整个文件之外，还有readlines将文件读取为一个列表。不过更推荐的采用如下形式：

```
f = open('removeduplicate.py')

for line in f:
    print(line,end='')
```

这种写法更python风格，代码运行也更高效。读取的line的结果等于readlines里面的一行，换行符 `\n` 附在最后，除了最后一行。

上面的代码的一个小细节就是 `end=''` ，意思是取消`\n`，因为原来的行里面已经有`\n`了。

然后代码稍作修改就可以在每一行之前加上`>>>`这个符号了。

```
f = open('removeduplicate.py')

for line in f:
    print('>>>',line,end='')
```

什么？这个输出只是在终端，没有到某个文件里面去，行，加上file参数。然后代码变成如下：

```
import sys

f = open('removeduplicate.py')
pyout=open(sys.argv[1] ,"w")

for line in f:
    print('>>>',line,end='',file=pyout)

pyout.close()
f.close()
```

在上面描述的基础上，可以在新输出行之上再加入一些额外的操作来实现更多样的文件操作工具。



## 类的内置方法

本章节围绕着下面这些内容逐步展开，从而逐步实现对python类的各个行为的深度定制。

1.  内省属性： `__dict__` ， `__class__`

2.  进行某种运算符操作或调用某个常见的方法时的行为重载。

3.  函数装饰器： 函数调用行为的定制

4.  一般属性访问行为定制

5.  特定属性访问时行为定制

6.  类实例创建时行为定制——类装饰器

7.  类对象创建时行为定制——metaclass

### `__dict__``

参考了 [这个网页](http://www.cnblogs.com/vamei/archive/2012/12/11/2772448.html) 。

首先读者记住class是个类似于def一样的语句，其也管理一个名字空间，然后区块里面的语句逐步执行。然后我们看下面这个例子：

```python
class A():

    def __init__(self, a):
        self.a = a

    def fun2(self, what):
        print('fun', what)

    @property
    def x(self):
        return 1
```


```text
class B(A):

    def __init__(self):
        self.d = 5
    b = 2

    def fun3(self):
        print('fun3')

b = B()

   b.__class__
=> <class 'B'>
   B.__class__
=> <class 'type'>
   b.__dict__
=> {'d': 5}
   B.__dict__
=> mappingproxy({'__module__': 'builtins', '__init__': <function B.__init__ at 0x7f13586057b8>, 'b': 2, 'fun3': <function B.fun3 at 0x7f1358605840>, '__doc__': None})
   A.__dict__
=> mappingproxy({'__module__': 'builtins', '__init__': <function A.__init__ at 0x7f1358605620>, 'fun2': <function A.fun2 at 0x7f13586056a8>, 'x': <property object at 0x7f1358604188>, '__dict__': <attribute '__dict__' of 'A' objects>, '__weakref__': <attribute '__weakref__' of 'A' objects>, '__doc__': None})
```

这个例子很有些东西，首先 `b.__class__` 是查看实例b的类型，大体输出接近于 `type(b)` ，然后我们看到类B的类型是type。后面在将metaclass会讲到这个，目前记住实例是根据类创建的，而类是根据元类也就是这个type创建的。

然后我们看到不管是实例b还是类B或者类A都记忆了一些自己的属性，至于继承来的属性是不需要重复记忆了。

然后类的 `__dict__`是 mappingproxy对象，其是只读的，也就是只有实例b的 `__dict__` 是 dict类型，是可以读写的（参考了[这篇文章](http://pyzh.readthedocs.io/en/latest/python-questions-on-stackoverflow.html#dict)）。

最后通过 `@property` 装饰器修饰的函数，我们会得到一个 property object，这个后面会谈到，这个特定的属性访问行为是可定制的，通过描述符对象。


### 数学运算符号重载

一般应用层面很少有需求去重载这些数学运算符号操作吧。这里稍微了解下即可。

一般加法

:   X + other , `__add__(self,other)`

右侧加法

:   所谓加法是X+other，如果是右侧加法，则为radd，然后公式是：other+X。一般不区分左右的就用上面的一般加法。other +
    X , `__radd__(self,other)`

增强加法

:   X +=other ，`__iadd__(self.other)`

一般减法

:   X - other , `__sub__(self,other)`。同上面情况一样类似的还有rsub和isub。

`*`

:   乘法，`__mul__(self,other)`，下面的类似的都有右侧运算和增强运算，不再赘述了。

`//`

:   整除，`__floordiv__`，下面类似的参数都是self和other，不再赘述了。

`/`

:   除法 ，`__div__`

`%`

:   取余，`__mod__`

`**`

:   开方，`__pow__`

`<<`

:   左移运算，`__lshift__`

`>>`

:   右移运算，`__rshift__`

`&`

:   位与，`__and__`

`|`

:   位或，`__or__`

`^`

:   位异或，`__xor__`

类似的右侧运算名字前面加上r，增强运算名字前面加上i，不赘述了。

### 逻辑运算

### bool函数

bool(X) `__bool__(self)`

### `__eq__`

`__eq__`方法定义了两个对象之间A == B的行为。 比如下面：

```python
def __eq__(self,other):
    if self.__dict__.keys() == other.__dict__.keys():
        for key in self.__dict__.keys():
            if  not self.__dict__.get(key)==other.__dict__.get(key):
                return False
        return True
    else:
        return False
```

定义了这样的`__eq__`方法之后，我们运行==语句，如果两个对象之间内置字典键和值都是一样的，那么就返回True。

    >>> test=GClass()
    >>> test.a=1
    >>> test2=GClass()
    >>> test2.a=1
    >>> test == test2
    True
    >>> test is test2
    False

如果我们不重定义`__eq__`方法，似乎test和test2会从原始的object类继承`__eq__`方法，然后它们比较返回的是False，我想可能是这两个实例内部某些值的差异吧，但应该不是基于id。

### 比较判断操作

类似上面的==比较操作，还有如下比较判断操作和对应的内置方法可以重定义。

-   X != Y ，行为由`__ne__(self,other)`定义。

-   X >= Y ，行为由`__ge__(self,other)`定义。

-   X <= Y ，行为由`__le__(self,other)`定义。

-   X > Y ，行为由`__gt__(self,other)`定义。

-   X < Y ，行为由`__lt__(self,other)`定义。

### in语句

**NOTICE**：不知道是以前记错了还是python3改动了，现在in语句应该用 `__contains__` 来重载。

提供了`what in X` 语句的支持，上面的例子是基于类其内字典的内容而做出的判断。

### 类之间的相等判断

[参考网站](http://www.informit.com/articles/article.aspx?p=453682)。

这里先总结下is语句和==判断和isinstance和id还有type函数，然后再提及python类的内置方法`__eq__`。

python是一个彻头彻尾的面向对象的语言，python内部一切数据都是对象，对象就有类型type的区别。比如内置的那样对象类型：

    >>> type('abc')
    <class 'str'>
    >>> type(123)
    <class 'int'>
    >>> type([1,2,3])
    <class 'list'>

对象除了有type类型之外，还有id属性，id就是这个对象具体在内存中的存储位置。

当我们说lst=\[1,2,3\]的时候，程序具体在内存中创建的对象是\[1,2,3\]，而lst这个变量名不过是一个引用。然后我们看下面的例子：

    >>> x=[1,2,3]
    >>> y=[1,2,3]
    >>> type(x)
    <class 'list'>
    >>> type(y)
    <class 'list'>
    >>> id(x)
    3069975884
    >>> id(y)
    3062209708
    >>> x==y
    True
    >>> x is y
    False

type函数返回对象的类型，id函数返回对象具体在内存中的存储位置，而==判断只是确保值相等，is语句返回True则更加严格，需要对象在内存上（即id相等）完全是同一个东西。

对象之间的类型比较可以用如下语句来进行比较：

    >>> x=10
    >>> type(x) == int
    True
    >>> type(x) == type(0)
    True

不过不是特别好用，比如假设fun是你自己定义的一个函数，用type(fun) ==
function就会出错，然后type比较还要小心NoneType和其他空列表类型不同，而且type比较并没有将类的继承考虑进去。

一般推荐isinstance函数来进行类型比较，请参考[这个网站](http://stackoverflow.com/questions/1549801/differences-between-isinstance-and-type-in-python)的说明。推荐使用types模块的特定名字来判断类型，具体如下：

types.NoneType

:   None这个值的类型

types.TypeType

:   type对象。

types.BooleanType

:   还可以使用**bool**。

types.IntType

:   还可以使用**int**，类似的有**long**，**float**。

types.ComplexType

:   复数类型

types.StringType

:   字符串类型，还可以使用**str**。

types.TupleType

:   元组，还可以使用**tuple**，类似的有**list**，**dict**。

types.FunctionType

:   定义的函数类型，此外还有**types.LambdaType**。

    值得一提的是print等内置函数不是FunctionType而是BuiltinFunctionType。
    
        >>> import types
        >>> isinstance(print,types.FunctionType)
        False
        >>> isinstance(print,types.BuiltinFunctionType)
        True

更多内容请参见[types模块的官方文档](https://docs.python.org/3.4/library/types.html)。

### 强制类型变换

所包含的内置方法有：

```text
__int__(self)   返回整型
__long__(self)  长整型
__float__(self)  浮点型
__complex__(self)  复数型
__str__(self)  字符型
__oct__(self)  八进制
__hex__(self) 十六进制
__index__(self) 切片操作
```

### `len(what)`

`len(what)` 由`__len__(self)`提供支持。

### copy方法和deepcopy方法

X.copy() 由`___copy__(self)`提供。

X.deepcopy() 由`__deepcopy__(self)`提供。

这里就要提一下python的copy模块了，一般很少有人去专门针对某个类单独编写 `__deepcopy__` 方法，可能会有某些特殊的情况吧，其他很多情况使用 `copy.deepcopy(what)` 是够用的。



### with语句支持

按照PEP343的说法：

```text
with VAR = EXPR: 
    BLOCK
    
with EXPR as VAR:
    BLOCK
```

实际上就是：

```text
VAR = EXPR
VAR.__enter__()
try:
    BLOCK
finally:
    VAR.__exit__()
```

比如我们执行 `with open(...) as f` 的这类语句，最终离开就应该调用了文件对象的 `__exit__` 方法：

```
with open(...) as f:
    BLOCK

f = open(...)
f.__enter__()
try: 
    BLOCK
finally:
    f.__exit__()
```

此外在`contextlib` 那里还提供了一个**contextmanager** 装饰器，写法有点差异，但要实现的效果大致是类似的。下面是一个演示例子：

```python
class Mylock():
    def __enter__(self):
    	self.lock = acquire_lock()
        return self.lock
    def __exit__(self):
        self.lock.release()
        
with Mylock() as lock:
    # do something
    

from contextlib import contextmanager
@contextmanager
def get_lock(...):
    lock = acquire_lock()
    try:
        yield lock
    finally:
        lock.release()
        
with get_lock(...) as lock:
    # do something

```



### `__call__`

请看下面的例子：

```python
class Position():
    def __init__(self,x=0,y=0):
        self.x = x
        self.y = y
    def __call__(self,x,y):
        self.x = x
        self.y = y
    def __repr__(self):
        return '('+str(self.x)+ ',' + str(self.y)+')'

>>> p1=Position()
>>> print(p1)
(0,0)
>>> p1(4,5)
>>> print(p1)
(4,5)
>>> 
```

有了`__call__(self,args)`方法，你的实例就好像函数一样可以被调用了。

### `__repr__` 和 `__str__` 的区别

简单来说就是 repr(what) 调用的是 `__repr__` 方法，str(what) 调用的是 `__str__` 方法。然后再简单实验了一下，和print函数和字符串format相关的使用的是 `__str__` 方法，如果你在python的REPL环境下，简单的输入该变量回显使用的是 `__repr__` 方法。如果你不实现`__str__` 方法，print函数或者字符串format相关的使用会调用 `__repr__` 方法，至于 `__repr__` 方法就算你不实现所有python对象都有默认的 `__repr__` 方法的。

### `__new__`

一个类创造出一个实例出来首先是调用 `__new__` 方法，然后才是调用`__init__`方法。其一个应用就是所谓的单例模式，也就是一个类只能创造一个实例，请参看 [这篇文章](https://segmentfault.com/a/1190000008141049) 。【下面代码做了一些修改，python3之后除了`super()` 写法可以简化之外，object的`__new__` 方法是不带参数的。然后python的`__new__` 和 `__init__` 是协作关系，似乎要求参数存在某种一致性，暂时还不太清楚。TODO】

```python
class Singleton(object):
    _instance = None
    def __new__(cls):
        if not cls._instance:
            cls._instance = super().__new__(cls)  
        return cls._instance  

class MyClass(Singleton):  
    a = 1

>>> one = MyClass()
>>> two = MyClass()
>>> one == two
True
>>> one is two
True
>>> id(one), id(two)
(4303862608, 4303862608)
```

这里还有一个点，为什么 `_instance` 在两个类初始化过程中指向同一个对象。因为 `_instance` 是属于类的，而实例是基于类的 `__new__` 和 `__init__` 方法生成出来的，所以假设你是python程序，那个类（class其实和def一样的一种东西）为什么不在内存里编译好了就可以了，后面都引用这个类就行了。那么这个内存编译好了的类里面的 `_instance` 变量当然也封装好了。理解这个过程有助于我们进一步理解类变量的作用范围。

### `__del__`

当对象内存存储被回收时，python最后将执行一个内置方法`__del__`。有的时候你定义的需要管理一些额外的资源，定制这个函数可以确保python程序关闭时目标资源已经自动关闭回收。

### `__getattr__`

如果某个属性不在对象的 `__dict__` 里面，然后python会调用`__getattr__(self,name)` 方法（参考了[这篇文章](http://www.cnblogs.com/vamei/archive/2012/12/11/2772448.html) ）。如果没定义这个方法那么将抛出 AttributeError 。

因为python语言内部是行为是可能发生变化的，这里更确切的表述参考python官方文档是，如果python默认属性查找没有找到，那么将试着调用该对象的 `__getattr__` 方法来查找，还找不到则抛出 `AttributeError` 异常。官方文档还强调，如果按照python默认的属性查找动作，找到目标属性了，也就是之前我们讨论的那些和类继承相关的属性找到等等。那么 `__getattr__` 方法是不会被调用的。所以我们要实现 `__getattr__` 方法加上额外的查找动作代码如下：

```python
    def __getattr__(self, item):
        if self.ref_element:
            if hasattr(self.ref_element, item):
                return getattr(self.ref_element, item)

        raise AttributeError(f'no such attribute in this object')
```



然后还有 `__setattr__(self,name,value)` 和 `__delattr__(self,name)`，这两个方法不管原属性在不在都会对其进行操作，谨慎使用！相关的`__getattribute__` 方法一般不推荐使用，这会干扰python默认的属性查找行为，这是一种很不好的编程实践。



### `__missing__`方法

对于字典或者字典的子类，你可以通过定义 `__missing__` 方法来回避找不到键值而抛出的 `KeyError` ，参考了 [这个网页](http://stackoverflow.com/questions/635483/what-is-the-best-way-to-implement-nested-dictionaries-in-python) 。如下所示:

```python
class NestedDict(collections.UserDict):
    '''
Implement this data structure:
{"section":{},
}
'''
    def __init__(data=None):
        super().__init__(data)

    def __missing__(self, key):
        value = self[key] = dict()
        return value
    
    def update_in_section(self, section, d):
        self[section].update(d)
    
    def get_in_section(self, section,key):
        return self[section].get(key)
    
    def delete_in_section(self,section,key):
        del self[section][key]
    
    def set_in_section(self,section,key,value):
        self[section][key] = value
```



如果找不到该key，则该类会自动赋值一个新的 dict()并作为该key的值。你可能希望使用 `type(self)()` ，但这种风格对json的兼容性不太好，推荐还是都用dict类。


## 类的装饰器

装饰器的作用机制就是对接下来的函数进行进一步的封装，比如：

        @staticmethod
        def what():
            pass
            
        # 其就等价于在类声明语句里写上了这样一句。   
        what = staticmethod(what)

可见装饰器并不是一个什么神秘的难懂的概念，同样你可以定义自己的函数，这个函数处理某个函数对象，并对其进行某种封装。

### 自定义装饰器

    def print1(f):
        print('1',f)
        return f
    
    @print1
    def print3(c):
        print(c)
    
    print3('c')  # print1(print3)('c')

比如上面的print1函数就做成了一个装饰器函数，后面的print3函数可以理解为 `print3=print1(print3)` 。——在这里理解的关键在于理解python中函数名字是无关紧要的，关键是函数对象。比如这里右边的print3是`def print3 ` 时生成的那个函数对象，然后这个函数对象送给print1进行了处理并封装为一个新的函数对象，再把这个函数对象赋值给了变量print3。

### 多个装饰器

    def print1(f):
        print('1',f)
        return f
    
    def print2(f):
        print('2',f)
        return f
    
    @print2
    @print1
    def print4(c):
        print(c)
    
    print4('c')  

多个装饰器的装饰顺序是从下往上的，上面的例子原print4函数对象先经过print1处理，然后再经过print2的处理，最后这个函数对象赋值给了变量print4。

### 装饰器带上参数

在前面的例子中，我们就可以简单将装饰器函数理解为一个接受函数对象返回返回函数对象的函数，这很直观和简单。实际上装饰器也是可以带上自己的参数的，这需要通过函数的闭包结构【也就是函数里面定义函数的结构，这样内部函数是可以使用外部函数的那些参数和变量的】才能完成，如下面的例子所示:

    def print1(f):
        print('1',f)
        return f
    
    def print2(b):
        def test(f):
            print('2',f,b)
            return f
        return test
    
    @print2('b')
    @print1
    def print4(c):
        print(c)
    
    print4('c') 



### 一般装饰器写法

本小节参考了 [这个网页](https://stackoverflow.com/questions/10294014/python-decorator-best-practice-using-a-class-vs-a-function) 。一般书写一个装饰器函数有如下通用写法：

#### 无参数装饰器版本

```python
from functools import wraps

def mydecorator(func):
    @wraps(func)
    def wraper_func(*args, **kwargs):
        # do something
        
        return func(*args, **kwargs)
    return wraper_func

@mydecorator
def test(*args, **kwargs):
    """
    this is test function
    """
    print(args, kwargs)

    
test('test', a=1)
print(test.__doc__)
```

这里使用了 functools 模块的 wraps装饰器，其接受你要装饰的函数作为参数。如果不这样的话，你在原test函数中定义的说明文字将丢失，按照 `test=mydecorator(test)` ，实际上test变量接受的函数对象是 `wraper_func` ，不信你可以查看 `test.__name__` 其是等于 `wraper_func` 的。而如上使用wraps装饰器，你在原test函数中定义的名字和文档都将得到保留。

#### 带参数装饰器版本

```python
from functools import wraps

def mydecorator(arg1, arg2):
    def _mydecorator(func):
        @wraps(func)
        def wraper_func(*args, **kwargs):
            print('i know you pass to decorator parameters:', arg1, arg2)
			# do something
            
            return func(*args, **kwargs)
        return wraper_func
    return _mydecorator

@mydecorator('a', 'b')
def test(*args, **kwargs):
    """
    this is test function
    """
    print(args, kwargs)

    
test('test', a=1)
print(test.__doc__)
```



### 静态方法装饰器

    class Test:
    #    @staticmethod
        def hello():
            print('aaa')
    
    test=Test()
    test.hello()

在上面的例子中，我们希望创造一个函数，这个函数和self实例没有关系（这里指这个函数将不接受self这个默认参数了）。如上所示，hello函数只是希望简单打印一小段字符，如*上面这样的代码是错误*的，如果我们在这个函数上面加上 `@staticmethod` ，那么上面这段代码就不会报错了，

    class Test:
        @staticmethod
        def hello():
            print('aaa')
    
    test=Test()
    test.hello()

这样在类里面定义出来的函数叫做这个类的静态方法，静态方法同样可以继承等等，而静态方法通常使用最大的特色就是不需要建立实例，即可以直接从类来调用，如下所示：

    class Test:
        @staticmethod
        def hello():
            print('aaa')
    
    Test.hello()

静态方法的使用比如pyqt中的

    QtGui.QFileDialog.getOpenFileName(......)

就是一个静态方法，可以通过直接调用这个方法来弹出询问打开文件的窗口，并不需要先实例化一个对象，然后通过self.what等类似的形式来调用。

### 类方法装饰器

还有一个装饰器有时也会用到， `@classmethod`，叫什么类方法装饰器。其和前面的静态方法一样也可以不新建实例，而直接通过类来调用。其和静态方法的区别就是静态方法在调用的时候没有任何默认的第一参数，而类方法在调用的时候默认第一参数就是调用的那个类。

    class Test:
        @classmethod
        def hello(cls):
            print('from class:', cls, 'saying hello')
    
    Test.hello()
    
    from class: <class '__main__.Test'> saying hello

关于classmethod装饰器实际上东西就这么多，然后就是传进去的第一个参数cls看你有什么使用需要了，比如
`cls(...)` 将根据这个类来生成一个实例。




### 类作为装饰器

类作为装饰器就是利用类的 `__call__`内置方法，我把这段代码粘贴在下面了，有时可能看别人的源码有用吧，但装饰器这部分就到此为止吧，没必要弄得这么复杂了。

```
class MyDecorator(object):
    """Decorator example mixing class and function definitions."""
    def __init__(self, func, param1, param2):
        self.func = func
        self.param1, self.param2 = param1, param2

    def __call__(self, *args, **kwargs):
        ...
        #use self.param1
        result = self.func(*args, **kwargs)
        #use self.param2
        return result

def my_dec_factory(param1, param2):
    def decorator(func):
         return MyDecorator(func, param1, param2)
    return decorator
```

前面讲到class声明语句和def语句很类似，def语句是利用缩进区块内的代码（简单理解就是执行编译了一遍，当然应该还有其他处理）构建出一个函数对象，然后将这个函数对象和某个名字绑定起来。class语句也是利用缩进区块内的代码构建出一个类对象，然后将这个类对象和某个名字绑定起来。

那么类装饰器，也就是类上面挂个装饰器，如下所示是什么意思呢：

```
def decorator(C):
    return ProcessedC

@decorator    
class C:
    ....
```

这样我们得到的C是：

```
C = decorator(C)
```

所以函数装饰器相当于函数对象创建过程的深度定制DIY，而类装饰器就相当于类对象创建过程的深度DIY。


## 元类metaclass

所有类都是由元类（type类）创建的，其对应的语句如下：

    class = type(classname, superclasses, attributedict)

type实际调用的是自身的 `__call__` 方法，这个方法将运行type的两个方法：
`__new__` ， `__call__` 。

这样就创造了一个类了，然后之前我们提到： 类还要调用自身的 `__new__` ，
`__call__` ，这样就创造出一个实例来了。

之前提到type的type也是type，type大体可以看作python中类型的最底层的原子结构吧。元类创造类，然后是类创造实例。

### 定义一个元类

    class Meta(type):
        def __new__(meta, classname, supers, classdict):
            # do something
            return type.__new__(meta, classname, supers, classdict)

### 使用一个元类

    class Test(Super, metaclass=Meta):
        pass

元类这里暂时还不深究，就一般的python程序员来说理解元类即可，实在不需要使用元类的。

## 进程
进程的定义是: 一个正在执行的程序实例。每个进程都有一个唯一的进程ID，也就是所谓的 **PID** 。使用`ps`
命令的第一个列就是每个进程的PID属性。在python中你可以使用`os.getpid()`来查看当前进程的PID。

以前只有一个CPU的机器上，多任务操作系统实际上一次也只能运行一个进程，操作系统是通过不断切换各个进程给你一种多任务似乎同时在运行多个程序的感觉的。多CPU机器上是真的可以同时运行多个进程。

### 进程fork

进程fork进行了一些基本代码信息和其他配置以及其他相关信息的复制或注册。这就相当于在当前代码环境下，你有两个分别单独运行的程序实例了。

下面是一个非常简单的小例子，你可以把 `os.fork()`语句移到 `print('before fork')`之前来看看变化。

```python
import os, time

print('before fork ')
os.fork()

print('say hello from', os.getpid())

time.sleep(1)

print('after fork')
```

对于这个程序简单的理解就是，本py文件编译成字节码进入内存经过某些成为一个程序实例了（其中还包含其他一些信息），然后程序具体运行的时候会通过os.fork来调用系统的fork函数，然后复制本程序实例（以本程序实例目前已经所处的状态），因为 `print('before
fork')`已经执行了，所以子进程就不会执行这一行代码了，而是继续os.fork()下面的代码继续执行。此时就相当于有两个程序在运行了，至于后面的打印顺序那是说不准的。

关于操作系统具体如何fork的我们可以暂时不考虑，这两个程序实例里面的变量和运行环境基本上是一模一样的，除了运行的状态有所不同之外。fork可以做出一种程序多任务处理方案吧，不过os模块的fork方法目前只支持unix环境。

### 子进程和父进程分开

请看下面的代码:

```python
import os, time

print('before fork ')
pid = os.fork()
if pid:
    print(pid)
    print('say hello from parent', os.getpid())
else:
    print(pid)
    print('say hello from child', os.getpid())

time.sleep(1)

print('after fork')
```

其运行结果大致如下:

    before fork 
    13762
    say hello from parent 13761
    0
    say hello from child 13762
    after fork
    after fork

我们看到在父进程那一边，pid是本父进程的子进程PID，而在子进程那一边，os.fork()返回的是0。可以利用这点将父进程的操作和子进程的操作分开。具体上面的代码if
pid 那一块是父进程的，else那一块是子进程的。


## 比较大小
### 字符串比较大小

读者可以实验一下python中字符串之间是可以比较大小的：

```
>>> 'abc' > 'ab'
True
>>> 'fabc' > 'abc'
True
>>> '3.04' > '3'
True
```

这个特性有的时候很有用的，具体是如何比较大小的呢？按照python官方文档的描述，采用的是词典编纂顺序。具体描述信息如下：

> 序列之间比较大小是，首先两个序列各自的第一个元素开始比较，如果它们相同，则进行下一个比较，直到任何一个序列被穷尽。如果两个序列各自比较的类型都是相同的，那么整个过程将一直进行下去。如果两个序列是相等的则认为它们是相等的，如果某一个序列是另外一个序列的子序列，则那个短的序列认为比长的序列要小。具体到每一个元素的大小比较，是按照ASCII顺序对其进行比较的。


#### 中文比较大小？

读者这时会想到，既然python中字符串都默认是unicode编码（utf-8），那么中文应该也是能够比较大小的吧，事实确实如此：

```
>>> '章' > '张'
True
>>> '章' < '张'
False
>>> ord('章')
31456
>>> ord('张')
24352
```

感兴趣的读者可以打开字符映射表看一下，'张'对应的unicode编号是U+5F20，你输入0x5f20，返回的正是24352。如果你输入hex(24352)，返回的就是'0x5f20'。



### 元组和列表的比较大小

元组和列表的相等判断还是很好理解的，而对于这样的东西:

    >>> (1,-1) < (2,-2)

确实就有点古怪了。请读者参考[这个网页](http://stackoverflow.com/questions/5292303/python-tuple-comparison))，按照官方文档的说明：

> Tuples and lists are compared lexicographically using comparison of
> corresponding elements. This means that to compare equal, each element
> must compare equal and the two sequences must be of the same type and
> have the same length.

官方文档对于大于小于的情况并没有说得很清楚，然后我们从字里行间大体领会的精神是:

1.  可迭代对象比较大小，是逐个比较的。

2.  可迭代对象比较和相等测试最后一定返回True或False。

3.  逐个比较首先比较是不是相等，如果相等则跳过这个元素的比较，直到遇到某两个不相等的元素，然后返回的就是这两个元素的比较结果。

4.  最后快比较完了（以最小的可迭代对象长度为准），然后如果是相等判断操作，则长度相等就认为两者相等了；而如果是大小判断操作，则认为长度更长的那个对象更大。

下面是一些例子:

    >>> (1,-1) < (2,-2)
    True
    >>> (1,-1) < (-1,-2)
    False
    >>> (1,-1,-3) < (1,-1)
    False
    >>> (1,-1,) < (1,-1,0)
    True


#### ord和chr函数

ord函数接受 一个字符，然后返回其unicode编码，十进制的。chr函数是ord函数的反向，比如你输入24352这个十进制uniocde，就返回了对应的字符。

```
>>> chr(24352)
'张'
```

所以我们可以总结到，python3的字符串比较大小，是基于utf-8编码的。


## 其他
### python class类定义里面的语句会直接执行
python class类定义里面的语句会直接执行，而函数里面定义的语句不会直接执行。


### 列表的del语句支持索引范围
```
>>> my_list = [10, 8, 6, 4, 2]
>>> my_list[1:3]
[8, 6]
>>> del my_list[1:3]
>>> my_list
[10, 4, 2]
```

### python3.6开始字典保留插入顺序
Python 3.6x dictionaries have become ordered collections by default.


In the older versions of Python, i.e., before 3.6.7, the popitem() method removes a random item from a dictionary.

### python3.10开始增加了match语句
```
http_status = 200

match http_status:
    case 200 | 201:
         print('Success')
    case 400:
        print('Not Found')
    case _:
        print('Unknown')
```


### 根据字符串获取模块对象

```
import importlib
importlib.import_module('what.what')
```


### 检查某个变量是不是模块对象

参考了 [这个网页](https://stackoverflow.com/questions/865503/how-to-isinstancex-module)

```python
>>> import os, types
>>> isinstance(os, types.ModuleType)
True
```


