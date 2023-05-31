Slug: python-advanced
Tags: python,
Date: 20191018
Modified: 20211119



[TOC]

## 类

在python中一切皆对象。前面学的那些操作对象都是python程序语言自己内部定义的对象（Object），而接下来介绍的类的语法除了更好的理解之前的那些对象之外，再就是可以创造自己的操作对象。一般面向对象(OOP)编程的基本概念这里不重复说明了，如有不明请读者自己随便搜索一篇网页阅读下即可。

### python中类的结构

python中的类就好像树叶，所有的类就构成了一棵树，而python中超类，子类，实例的重载或继承关系等就是由一种搜索机制实现的：

![img]({static}/images/python/lei-sou-suo-jie-gou.png)

python首先搜索self有没有这个属性或者方法，如果没有，就向上搜索。比如说实例l1没有，就向上搜索C1，C1没有就向上搜索C2或C3等。

实例继承了创造它的类的属性，创造它的类上面可能还有更上层的超类，类似的概念还有子类，表示这个类在树形层次中比较低。

well，简单来说类的结构和搜索机制就是这样的，很好地模拟了真实世界知识的树形层次结构。

上面那副图实际编写的代码如下：

    class C2: ...
    class C3: ...
    class C1(C2,C3): ...
    l1=C1()
    l2=C1()

其中class语句是创造类，而C1继承自C2和C3，这是多重继承，从左到右是内部的搜索顺序（会影响重载）。l1和l2是根据类C1创造的两个实例。

对于初次接触类这个概念的读者并不指望他们马上就弄懂类这个概念，这个概念倒并一定要涉及很多哲学的纯思考的东西，也可以看作一种编程经验或技术的总结。多接触对类的学习更重要，而不是纯哲学抽象概念的讨论，毕竟类这个东西创造出来就是为了更好地描述现实世界的。

最后别人编写的很多模块就是一堆类，你就是要根据这些类来根据自己的情况来编写自己的子类，从而实现对原有类对象的改造。为了更好地利用前人的成果，或者你的成果更好地让别人快速使用和上手，那么你需要好好掌握类这个工具。

### 类的最基础知识

### 类的创建

    class MyClass:
        something

类的创建语法如上所示，然后你需要想一个好一点的类名。类名规范的写法是首字母大写，这样好和其他变量有所区分。

### 根据类创建实例

按照如下语句格式就根据MyClass类创建了一个实例myclass001。

    myclass001=MyClass()

### 类的属性

    >>> class MyClass:
    ...  name='myclass'
    ... 
    >>> myclass001=MyClass()
    >>> myclass001.name
    'myclass'
    >>> MyClass.name
    'myclass'
    >>> myclass001.name='myclass001'
    >>> myclass001.name
    'myclass001'
    >>> MyClass.name
    'myclass'

如上代码所示，我们首先创建了一个类，这个类加上了一个name属性，然后创建了一个实例myclass001，然后这个实例和这个类都有了name属性。然后我们通过实例加上点加上name的这种格式引用了这个实例的name属性，并将其值做了修改。

这个例子简单演示了类的创建，属性添加，实例创建，多态等核心概念。后面类的继承等概念都和这些大同小异了。

### 类的方法

类的方法就是类似上面类的属性一样加上def语句来定义一个函数，只是函数在类里面我们一般称之为方法。这里演示一个例子，读者看一下就明白了。

    >>> class MyClass:
    ...  name='myclass'
    ...  def double(self):
    ...   self.name=self.name*2
    ...   print(self.name)
    ... 
    >>> myclass001=MyClass()
    >>> myclass001.name
    'myclass'
    >>> myclass001.double()
    myclassmyclass
    >>> myclass001.name
    'myclassmyclass'

这里需要说明的是在类的定义结构里面，self代表着类自身（更多self意义细节请参看下面的self意味着什么一小节），self.name代表着对自身name属性的引用。然后实例在调用自身的这个方法时用的是 `myclass001.double()` 这样的结构，这里double函数实际上接受的第一个参数就是自身，也就是myclass001，而不是无参数函数。所以类里面的方法有一个参数self。

### 类的继承

实例虽然说是根据类创建出来的，但实际上实例和类也是一种继承关系，实例继承自类，而类和类的继承关系也与之类似，只是语法稍有不同。下面我们来看这个例子：

    class Hero():
        def addlevel(self):
            self.level=self.level+1
            self.hp=self.hp+self.addhp
    
    class Garen(Hero):
        level=1
        hp=455
        addhp=96
    
    garen001=Garen()
    for i in range(6):
        print('级别:',garen001.level,'生命值：' ,garen001.hp)
        garen001.addlevel()
    
    级别: 1 生命值： 455
    级别: 2 生命值： 551
    级别: 3 生命值： 647
    级别: 4 生命值： 743
    级别: 5 生命值： 839
    级别: 6 生命值： 935

![img]({static}/images/python/lei-de-ji-cheng-shi-li.png)

这里就简单的两个类，盖伦Garen类是继承自Hero类的，实例garen001是继承自Garen类的，这样garen001也有了addlevel方法，就是将自己的level属性加一，同时hp生命值也加上一定的值，整个过程还是很直观的。

### 类的内置方法

如果构建一个类，就只是简单的加上pass语句，什么都不做，python还是会为这个类自动创建一些属性或者方法。

    >>> class TestClass:
    ...  pass
    ... 
    >>> dir(TestClass)
    ['__class__', '__delattr__', '__dict__', '__dir__', '__doc__',
     '__eq__', '__format__', '__ge__', '__getattribute__',
      '__gt__',  '__hash__', '__init__', '__le__', '__lt__',
       '__module__', '__ne__', '__new__', '__reduce__', 
       '__reduce_ex__', '__repr__', '__setattr__', 
       '__sizeof__', '__str__', '__subclasshook__',
        '__weakref__']

这些变量名字前后都加上双下划线是给python这个语言的设计者用的，一般开发者还是不要这样命名变量。

这些内置方法用户同样也是可以重定义他们从来覆盖掉原来的定义，其中特别值得一讲的就是`__init__`方法或者称之为构造函数。

### \_\_init\_\_方法

`__init__`方法对应的就是该类创建实例的时候的构造函数。比如：

    >>> class Point:
    ...  def __init__(self,x,y):
    ...   self.x=x
    ...   self.y=y
    ... 
    >>> point001=Point(5,4)
    >>> point001.x
    5
    >>> point001.y
    4

这个例子重载了`__init__`函数，然后让他接受三个参数，self是等下要创建的实例，x，还有y通过下面的语句给这个待创建的实例的属性x和y赋了值。

### self意味着什么 

self在类中是一个很重要的概念，当类的结构层次较简单时还容易看出来，当类的层次结构很复杂之后，你可能会弄糊涂。比如你现在通过调用某个实例的某个方法，这个方法可能是一个远在天边的某个类给出的定义，就算如此，那个定义里面的self还是指调用这个方法的那个实例，这一点要牢记于心。

比如下面这个例子：

    class Test():
        x = 5
        def __init__(self):
            self.x = 10
    
    test = Test()
    
    >>> test.x
    10
    >>> Test.x
    5

其中self.x就是对应的创建的实例的属性x，而前面定义的x则是类Test的属性x。

### 类的操作第二版

现在我们可以写出和之前那个版本相比更加专业的类的使用版本了。

    class Hero():
        def addlevel(self):
            self.level=self.level+1
            self.hp=self.hp+self.addhp
    
    class Garen(Hero):
        def __init__(self):
            self.level=1
            self.hp=455
            self.addhp=96
            self.skill=['不屈','致命打击','勇气','审判','德玛西亚正义']
    
    garen001=Garen()
    for i in range(6):
        print('级别:',garen001.level,'生命值：' ,garen001.hp)
        garen001.addlevel()
    print('盖伦的技能有：',"".join([x + '  ' for x in garen001.skill]))
    
    级别: 1 生命值： 455
    级别: 2 生命值： 551
    级别: 3 生命值： 647
    级别: 4 生命值： 743
    级别: 5 生命值： 839
    级别: 6 生命值： 935
    盖伦的技能有： 不屈  致命打击  勇气  审判  德玛西亚正义

似乎专业的做法类里面多放点方法，最好不要放属性，不太清楚是什么。但确实这样写给人感觉更干净点，方法是方法，如果没有调用代码就放在那里我们不用管它，后面用了构造函数我们就去查看相关类的构造方法，这样很省精力。

### 类的操作第三版 

    class Unit():
        def __init__(self,hp,atk,color):
            self.hp=hp
            self.atk=atk
            self.color=color
        def __str__(self):
            return '生命值：{0}，攻击力：{1}，颜色：\
            {2}'.format(self.hp,self.atk,self.color)
    
    class Hero(Unit):
        def __init__(self,level,hp,atk,color):
            Unit.__init__(self,hp,atk,color)
            self.level=level
        def __str__(self):
            return '级别：{0},生命值：{1}，攻击力：{2}，\
            颜色：{3}'.format(self.level,self.hp,self.atk,self.color)
    
        def addlevel(self):
            self.level=self.level+1
            self.hp=self.hp+self.addhp
            self.atk=self.atk+self.addatk
    
    class Garen(Hero):
        def __init__(self,color='blue'):
            Hero.__init__(self,1,455,56,color)
            self.name='盖伦'
            self.addhp=96
            self.addatk=3.5
            self.skill=['不屈','致命打击','勇气','审判','德玛西亚正义']
    
    if __name__ == '__main__':
        garen001=Garen('red')
        garen002=Garen()
        print(garen001)
        unit001=Unit(1000,1000,'gray')
        print(unit001)
        for i in range(6):
            print(garen001)
            garen001.addlevel()
        print('盖伦的技能有：',"".join([x + '  ' for x in garen001.skill]))
    
    级别：1,生命值：455，攻击力：56，        颜色：red
    生命值：1000，攻击力：1000，颜色：        gray
    级别：1,生命值：455，攻击力：56，        颜色：red
    级别：2,生命值：551，攻击力：59.5，        颜色：red
    级别：3,生命值：647，攻击力：63.0，        颜色：red
    级别：4,生命值：743，攻击力：66.5，        颜色：red
    级别：5,生命值：839，攻击力：70.0，        颜色：red
    级别：6,生命值：935，攻击力：73.5，        颜色：red
    盖伦的技能有： 不屈  致命打击  勇气  审判  德玛西亚正义

现在就这个例子相对于第二版所作的改动，也就是核心知识点说明之。其中函数参量列表中这样表述`color='blue'`表示blue是color变量的备选值，也就是color成了可选参量了。

#### 构造函数的继承和重载

上面例子很核心的一个概念就是`__init__`构造函数的继承和重载。比如我们看到garen001实例的创建，其中就引用了Hero的构造函数，特别强调的是，比如这里 `Hero.__init__(self,1,455,56,color)` 就是调用了Hero类的构造函数，这个时候需要把self写上，因为self就是最终创建的实例garen001，而不是Hero，而且调用Hero类的构造函数就必须按照它的参量列表形式来。这个概念需要弄清楚！

理解了这一点，在类的继承关系中的构造函数的继承和重载就好看了。比如这里Hero类的构造函数又是继承自Unit类的构造函数，Hero类额外有一个参量level接下来也要开辟存储空间配置好。

#### \_\_str\_\_函数的继承和重载

第二个修改是这里重定义了一些类的`__str__`函数，通过重新定义它可以改变默认print某个类对象是的输出。默认只是一段什么什么类并无具体内容信息。具体就是return一段你想要的字符串样式即可。



## 类的高级知识


首先说下python2和python3的兼容性，如果读者在python2.7环境下，那么推荐定义class的时候都如下跟上object：

    class Test(object):
        pass

本章节围绕着下面这些内容逐步展开，从而逐步实现对python类的各个行为的深度定制。

1.  内省属性： `__dict__` ， `__class__`

2.  进行某种运算符操作或调用某个常见的方法时的行为重载。

3.  函数装饰器： 函数调用行为的定制

4.  一般属性访问行为定制

5.  特定属性访问时行为定制

6.  类实例创建时行为定制——类装饰器

7.  类对象创建时行为定制——metaclass

### \_\_dict\_\_

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

### \_\_getitem\_\_

`__getitem__(self, key)` 方法定义了实例的这种形式 `Class['key']`的行为。

```python
class Test():
    a = 1
    def __getitem__(self,key):
        print('i accpeted: {0}'.format(key))
        return self.a

t = Test()

>> t['a']
i accpeted: a
=> 1
```

**默认一般的类是不支持这种 Test['x'] 这种写法。**  然后 `__setitem__(self, key, value)` 方法 对应 `t['x']=3` 这样的赋值形式；还有 `__delitem(self, key)__` 方法对应这样的运算符号表示： `del t['x']`。

按照python官方文档的介绍：在实现这个方法的时候，有几个异常规范：

- TypeError 当key是不恰当类型抛出
- IndexError 如果给定的值超出了序列的索引范围则应该抛出这个异常
- KeyError 如果没有这个key则应该抛出这个异常。



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

### \_\_eq\_\_

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



### \_\_call\_\_

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

### \_\_new\_\_

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

### \_\_del\_\_

当对象内存存储被回收时，python最后将执行一个内置方法`__del__`。有的时候你定义的需要管理一些额外的资源，定制这个函数可以确保python程序关闭时目标资源已经自动关闭回收。

### \_\_getattr\_\_

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



### python中类继承的顺序

我们知道python中类的搜索顺序是从左到右的，比如：

```
class D(A,B): pass
```

D的属性是先从A找，然后再从B找。但从类的继承概念上来说，如果A类和B类之间没有层次关系，那么他们顺序随便都没问题，但如果B类是更底层的Base类，那么其是应该放在最右边的。这在关于Mixin类中写法是要严格如下所示的：

```
class MyClass(Mixin2, Mixin1, BaseClass):
    pass
```

## 迭代器和生成器

首先推荐 [这篇文章](https://foofish.net/iterators-vs-generators.html)，对本小节概念的理清帮助很大。下面我们慢慢来说。

![迭代器和生成器的关系](http://img2.foofish.net/relationships.png)

首先Iterable叫做可迭代对象，Iterator叫做迭代器。在collections里面有这两个类，可以做出判断：

    from collections import Iterable,Iterator
    isinstance(obj, Iterable)
    isinstance(obj, Iterator)

然后我们再来看官方文档的词语解释：

> iterable -- 可迭代对象
>
> 能够逐一返回其成员项的对象。可迭代对象的例子包括所有序列类型（例如 [`list`](https://docs.python.org/zh-cn/3/library/stdtypes.html#list)、[`str`](https://docs.python.org/zh-cn/3/library/stdtypes.html#str) 和 [`tuple`](https://docs.python.org/zh-cn/3/library/stdtypes.html#tuple)）以及某些非序列类型例如 [`dict`](https://docs.python.org/zh-cn/3/library/stdtypes.html#dict)、[文件对象](https://docs.python.org/zh-cn/3/glossary.html#term-file-object) 以及定义了 [`__iter__()`](https://docs.python.org/zh-cn/3/reference/datamodel.html#object.__iter__) 方法或是实现了 [Sequence](https://docs.python.org/zh-cn/3/glossary.html#term-sequence) 语义的 [`__getitem__()`](https://docs.python.org/zh-cn/3/reference/datamodel.html#object.__getitem__) 方法的任意自定义类对象。
>
> 可迭代对象被可用于 [`for`](https://docs.python.org/zh-cn/3/reference/compound_stmts.html#for) 循环以及许多其他需要一个序列的地方（[`zip()`](https://docs.python.org/zh-cn/3/library/functions.html#zip)、[`map()`](https://docs.python.org/zh-cn/3/library/functions.html#map) ...）。当一个可迭代对象作为参数传给内置函数 [`iter()`](https://docs.python.org/zh-cn/3/library/functions.html#iter) 时，它会返回该对象的迭代器。这种迭代器适用于对值集合的一次性遍历。在使用可迭代对象时，你通常不需要调用 [`iter()`](https://docs.python.org/zh-cn/3/library/functions.html#iter) 或者自己处理迭代器对象。`for` 语句会为你自动处理那些操作，创建一个临时的未命名变量用来在循环期间保存迭代器。参见 [iterator](https://docs.python.org/zh-cn/3/glossary.html#term-iterator)、[sequence](https://docs.python.org/zh-cn/3/glossary.html#term-sequence) 以及 [generator](https://docs.python.org/zh-cn/3/glossary.html#term-generator)。
>
> iterator -- 迭代器
>
> 用来表示一连串数据流的对象。重复调用迭代器的 [`__next__()`](https://docs.python.org/zh-cn/3/library/stdtypes.html#iterator.__next__) 方法（或将其传给内置函数 [`next()`](https://docs.python.org/zh-cn/3/library/functions.html#next)）将逐个返回流中的项。当没有数据可用时则将引发 [`StopIteration`](https://docs.python.org/zh-cn/3/library/exceptions.html#StopIteration) 异常。到这时迭代器对象中的数据项已耗尽，继续调用其 `__next__()` 方法只会再次引发 [`StopIteration`](https://docs.python.org/zh-cn/3/library/exceptions.html#StopIteration) 异常。迭代器必须具有 [`__iter__()`](https://docs.python.org/zh-cn/3/reference/datamodel.html#object.__iter__) 方法用来返回该迭代器对象自身，因此迭代器必定也是可迭代对象，可被用于其他可迭代对象适用的大部分场合。一个显著的例外是那些会多次重复访问迭代项的代码。容器对象（例如 [`list`](https://docs.python.org/zh-cn/3/library/stdtypes.html#list)）在你每次向其传入 [`iter()`](https://docs.python.org/zh-cn/3/library/functions.html#iter) 函数或是在 [`for`](https://docs.python.org/zh-cn/3/reference/compound_stmts.html#for) 循环中使用它时都会产生一个新的迭代器。如果在此情况下你尝试用迭代器则会返回在之前迭代过程中被耗尽的同一迭代器对象，使其看起来就像是一个空容器。

生成器函数区别一般函数是使用了yield语句返回，具体这块和python的异步相关，后面再说。然后还有生成器表达式：

```
test1 = (i+1 for i in range(5))
isinstance(test1, Iterator)
>>> True
isinstance(test1, Iterable)
>>> True
```

其都是生成器，生成器是某种简化版的迭代器，迭代器一定是可迭代对象。而某个可迭代对象经过 iter 函数处理就成了 迭代器了。就一般而言简单理解，认为某个对象具有 `__iter__` 方法，那么它就是一个可迭代对象，如果某个对象具有 `__next__` 方法，那么它就是一个迭代器。

常见的for遍历的过程如下所示：

```python
>>> list=[1,2,3]
>>> iter=iter(list)
>>> while True:
...    try:
...        x=next(iter)
...    except StopIteration:
...        break
...    print(x)
... 
1
2
3
```

iter函数是调用目标对象的 `__iter__` 方法（决定了该对象是可迭代对象的方法），就一般而言的简单情况是，`__iter__` 方法返回的目标对象自身，因为目标对象自身已经定义了 `__next__` 方法。

而就迭代器来说，其迭代过程就是调用自身的 `__next__` 方法来获取下一个值，遇到 `StopIteration` 异常停止获取。

上面提到的for语句，还有map zip 之类的函数是将这个过程自动做了的。包括iter函数处理和捕获终止异常。

比如文件对象本身就是可迭代的，调用`__next__`方法就返回文件中下一行的内容，到达文件尾也就是迭代越界了返回：**StopIteration**异常。

next函数比如next(f)等价于`f.__next__()` 。

    >>> for line in open('removeduplicate.py'):
    ...  print(line,end='')
    ... 
    #!/usr/bin/env python3
    #-*-coding:utf-8-*-
    #此处一些内容省略。
        
    >>> f=open('removeduplicate.py')
    >>> next(f)
    '#!/usr/bin/env python3\n'

所以你可以通过定义类的 `__next__` 方法来获得这个类对于next函数时的反应。

序列（列表，元组，字典，ranges对象）等是可迭代对象，不是迭代器。其经过iter函数处理就成了迭代器了。

除了上面提及的常规操作，通过 `__iter__` 返回自身，然后通过构建 `__next__` 方法来定制迭代器行为外：

```python
class Test(object):
    def __init__(self):
        self.count = 0
    def __iter__(self):
        return self
    def __next__(self):
        self.count += 1
        if self.count >= 3:
            raise StopIteration
        return self.count
```

```
isinstance(t, Iterator)
>>> True
list(t)
>>> [1, 2]
```

你也可以直接通过定义 `__iter__`方法返回一个生成器对象（generator object），这因为生成器总是迭代器。

下面这个例子通过重新定义字典类的`__iter__`方法来获得一个新类，这个类用iter函数处理之后的迭代器返回的是经过排序的字典的键。

```python
class SortedDict(dict):
    def __init__(self,dict={}):
        super().__init__(dict)

    def __iter__(self):
        self._keys = sorted(self.keys())
        for i in self._keys:
            yield i

dict02 = SortedDict()
dict02['a'] = 1
dict02['b'] = 1
dict02['d'] = 1
dict02['c'] = 1
```

```
for i in dict02:
    print(i)
```

```
a
b
c
d
```

但是要注意上面的例子，只在for语句直接迭代目标对象时才会调用 `__iter__` 方法的。

### 深入理解python的迭代操作

在python中一般复杂的代码运算效率就会低一点，如果完成类似的工作但你可以用更简单的语句那么运算效率就会高一点。当然这只是python的一个设计理念，并不尽然，但确实很有意思。

程序结构中最有用的就是多个操作的重复，其中有迭代和递归还有一般的循环语句。递归函式感觉对于某些特殊的问题很有用，然后一般基于数据结构的不是特别复杂的操作重复用迭代语句即可，最后才考虑一般循环语句。

迭代语句中for语句运算效率最低，然后是map函数（不尽然），然后是列表解析。所以我们在处理问题的时候最pythonic的风格，运算效率最高的就是列表解析了，如果一个问题能够用列表解析解决那么就用列表解析解决，因为python的设计者的很多优化工作都是针对迭代操作进行的，然后python3进一步深化了迭代思想，最后python中的迭代是用c语言来实现的。

可是让我们反思一下为什么列表解析在问题处理的时候如此通用？比如说range函数或者文件对象或者列表字符串等等，他们都可以称之为可迭代对象。可迭代对象最大的特色就是有一系列的元素，然后这一系列的元素可以逐个调出来，而列表解析就是对这些调出来的元素进行了某个表达式操作，然后将其收集起来。这是什么？我们看下面这张图片：

![img]({static}/images/python/lie-biao-jie-xi.png)

这张图片告诉我们列表解析和数学上所谓的集合还有函数的定义非常的类似，可迭代对象就好像是一个集合（有顺序或者没顺序都行），然后这些集合中的所有元素经过了某个操作，这个操作似乎就是我们数学中定义的函数，然后加上过滤条件，某些元素不参加运算，这样就生成了第二个可迭代对象（一般是列表也可以是字典什么的。）

有一个哲学上的假定，那就是我们的世界一切问题都可以用数学来描述，而一些数学问题都可以用函数即如上的信息操作过滤流来描述之。当然这不尽然，但我们可以看到列表解析在一般问题处理上是很通用的思想。

不过我们看到有限的元素的集合问题适合用迭代，但无限元素的集合问题也许用递归或者循环更适合一些。然后我们又想到集合的描述分为列举描述（有限个元素的列举）和定义描述。比如说 `1<x<10` ，x属于整数，这就定义了一个集合。那么我们就想到python存在这样的通过描述而不是列举（如列表一样）的集合吗？range函数似乎就是为了这样的目的而生的，比如说 `range(10)` 就定义了 `[0,10)`这一系列的整数集合，range函数生成一个range对象，range对象是一个可迭代对象，我们可以把它看作可迭代对象中的描述集合类型吧。这时我们就问了，既然 `0<=x<10`这样的整数集合可以通过描述来实现，那么更加复杂的函数描述可不可以实现呢？我们可不可以建立更加复杂的类似range对象的描述性可迭代对象呢？

### map和filter函数

按照之前的迭代模式的描述，虽然使用常见的列表解析格式(for语句)就可以完成对某个集合中各个元素的操作或者过滤，不过python中还有另外两个函数来实现类似的功能，map对应对集合中各个元素进行某个函数操作（可以接受lambda函式），而filter则实现如上所述的过滤功能。然后值得一提的是python3之后map函数和filter函数返回都是一个可迭代对象而不是列表，和range函数等其他可迭代对象一样可用于列表解析结构。

### map函数

这里列出一些例子：

```
>>> map(abs, [-2,-1,0,1,2])
<map object at 0xb707dccc>
>>> [x for x in map(abs, [-2,-1,0,1,2])]
[2, 1, 0, 1, 2]
>>> [x for x in map(lambda x : x+2, [-2,-1,0,1,2])]
[0, 1, 2, 3, 4]
```

map函数还可以接受两个可迭代对象的协作参数模式，这个学过lisp语言的会觉得很眼熟，不过这里按照我们的理解也是很便捷的。具体就是第一个可迭代对象取出一个元素作为map的函数的第一个参数，然后第二个可迭代对象取出第二个参数，然后经过函数运算，得到一个结果，这个结果如果不列表解析的话就是一个map对象（可迭代对象），然后展开以此类推。值得一提的是两个可迭代对象的*深度由最短的那个决定*，请看下面的例子：

```
>>> [x for x in map(lambda x,y : x+y, [-2,-1,0,1,2],[-2,-1,0,1,2])]
[-4, -2, 0, 2, 4]
>>> [x for x in map(lambda x,y : x+y, [-2,-1,0,1,2],[-2,-1,0,1])]
[-4, -2, 0, 2]
```

### filter函数

同样和上面的谈及的类似，filter函数过滤一个可迭代对象然后产生一个可迭代对象。类似的功能可以用列表解析的后的if语句来实现。前面谈到map函数的时候提及一般还是优先使用列表解析模式，但filter函数这里有点不同，因为列表解析后面跟个if可能有时会让人困惑，这时推荐还是用filter函数来进行可迭代对象的过滤操作。

filter函数的基本逻辑是只有 `return True`（用lambda表达式就是这个表达式的值为真) 的时候元素才被收集起来，或者说是过滤出来。

请参看下面的例子来理解：

```
>>> [x for x in filter(lambda x:x&1,[1,2,3,5,9,10,155,-20,-25])]
[1, 3, 5, 9, 155, -25]
>>> [x for x in filter(lambda x:not x&1,[1,2,3,5,9,10,155,-20,-25])]
[2, 10, -20]
```

当然你也可以传统的编写函数：

```
>>> def even(n):
...    if n % 2 ==0:
...         return True

>>> [x for x in filter(even,[1,2,3,5,9,10,155,-25])]
[2, 10]
```

### zip函数

这里就顺便把zip函数也一起提了，zip函数同样返回一个可迭代对象，它接受任意数目的可迭代对象，然后逐个取出可迭代对象元素构成一个元组成为自己的一个元素。和map函数类似*迭代深度由最短的那个可迭代对象决定*。

```
>>> zip(['a','b','c'],[1,2,3,4])
<zip object at 0xb7055e6c>
>>> [x for x in zip(['a','b','c'],[1,2,3,4])]
[('a', 1), ('b', 2), ('c', 3)]
>>> list(zip(['a','b','c'],[1,2,3,4]))
[('a', 1), ('b', 2), ('c', 3)]
>>> dict(zip(['a','b','c'],[1,2,3,4]))
{'c': 3, 'b': 2, 'a': 1}
```

### 列表到字典

这个例子似乎使用价值不大，只是说明zip函数接受任意数目参数的情况。y.items()解包之后是4个参数传递给zip函数，而zip函数的封装逻辑就是如果有人问我，我就把你们这些迭代对象每个取出一个元素，然后用元组包装之后返回。

```
x1 = ['a','b','c','e']
x2 = [1,2,3,4]
y = dict(zip(x1,x2))
print('列表到字典：',y)
new_x1,new_x2 = zip(*y.items())
print(new_x1,new_x2)

列表到字典： {'b': 2, 'c': 3, 'a': 1, 'e': 4}
('b', 'c', 'a', 'e') (2, 3, 1, 4)
```

这个例子如果到更加复杂的情况，我们可以跳过字典形式，来个数据映射对：

```
>>> x1 = ['a','b','c','e']
>>> x2 = ['red','yellow','red','blue']
>>> x3 = [1,2,3,4]
>>> list(zip(x1,x2,x3))
[('a', 'red', 1), ('b', 'yellow', 2), ('c', 'red', 3), ('e', 'blue', 4)]
>>> new_x1,new_x2,new_x3 = zip(*list(zip(x1,x2,x3)))
>>> new_x1
('a', 'b', 'c', 'e')
>>> new_x2
('red', 'yellow', 'red', 'blue')
>>> new_x3
(1, 2, 3, 4)
```

当然对于多属性数据问题一般还是推荐使用类来处理，不过某些情况下可能不需要使用类，就这样简单处理之。

值得一提的是这种数据存储形式和sql存储是一致的，而且不知道你们注意到没有，这似乎实现了矩阵的转置功能。



## 装饰器

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



### 属性装饰器

其他编程语言的开发者可能会在类里定义一些针对某些属性的get和set之类的方法，这并不是Pythonic的风格，对于某些特定名字的属性，一般利用属性装饰器来构建，如下所示：

    class Apple():
        def __init__(self):
            self._color = 'red'
    
        @property
        def color(self):
            return self._color
    
    apple = Apple()

这样将给这个类定义个属性，具体调用这个属性就用这样的点号引用即可，然后实际执行的就是
`@property` 装饰的那个函数。 现在这个color属性只可读，不可更改。

    >>> apple.color
    'red'
    >>> apple.color = 'yellow'
    Traceback (most recent call last):
      File "<stdin>", line 1, in <module>
    AttributeError: can't set attribute

请参看
[这个网页](http://stackoverflow.com/questions/17330160/how-does-the-property-decorator-work)
，这里讲到了 `@color.setter`
装饰器，来装饰某个函数之后，通过这个函数来修改color属性。然后还有
`@color.deleter`
装饰某个函数之后，来通过这个函数来删除某个属性。这里deleter的使用可能较少，一般
`@property` 就能满足大部分需求了，有的觉得需要修改某个属性则定义setter。

一个简单的setter例子如下所示：

    class Apple():
        def __init__(self):
            self._color = 'red'
    
        @property
        def color(self):
            return self._color
    
        @color.setter
        def color(self, color):
            self._color = color
    
    apple = Apple()
    
    print(apple.color)
    apple.color = 'yellow'
    print(apple.color)



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

## 多重继承的顺序问题

我们来看下面这个例子：

```
class B1():x='B1'
class B2():x='B2'
class B3():x='B3'
class B(B1,B2,B3):x='B'
class A1():x='A1'
class A2():x='A2'
class A(A1,A2):x='A'
class D(B,A):x='D'
test=D()
print(test.x)
```

![多重继承示意图]({static}/images/python/duo-chong-ji-cheng.png)

你可以测试一下上面这个例子，首先当然结果是D自己的x被先查找，然后返回D ，如果你把类D的x定义语句换成pass，结果就是B。这说明这里程序的逻辑是如果test实例找不到x，那么再找D，D找不到再接下来找D继承自的父类，首先是B，到目前为止，没什么新鲜事发生。

然后我们再把B的x赋值语句换成pass，这时的结果是B1，也没什么好惊讶的。然后类似的一致操作下去，我们会发现python的值的查找顺序在这里是：D，B，B1，B2，B3，A，A1，A2。

于是我们可以总结道：恩，类的多重继承就是 **深度优先法则** ，先把子类或者子类的子类都查找完，确认没有值之后再继续从左到右的查找。

一般情况来说这么理解是没有问题的，但是在编程界多重继承中有个有名的问题——菱形难题。

### 菱形难题

参考资料：[维基百科菱形难题](http://en.wikipedia.org/wiki/Multiple_inheritance#The_diamond_problem)

![菱形难题]({static}/images/python/ling-xing-nan-ti.png )

菱形难题即在如上的类的继承中，如果C和A都有同名属性x，那么D会调用谁的呢？读者测试下面的例子：

```
class A():
    x = 'A'

class B(A):
    x = 'B'

class C(A):
    x = 'C'

class D(B, C):
    x = 'D'


test = D()
print(test.x)
```

然后我们会发现python的查找顺序是D，B，C，A。

实际上这个查找顺序python2和python3都是存在差异的，请参考 Guido 写的 [这篇文章](http://python-history.blogspot.com/2010/06/method-resolution-order.html) 。结论就是现在python3的MRO算法过程如下：

1. 搜索树会被预计算
2. 之前我们观察的深度优先算法大体是正确的，不同的是重复出现的类的处理逻辑是 **只保留最后的那个**。【因此上面的例子首先是D，B，A，C，A然后规约为了D，B，C，A】



### super如何面对菱形难题

super是引用父类动作，简单的情况就不说了，接下来请看下面这个例子：

```python
class Base():
    def __init__(self):
        print('Base')


class A(Base):
    def __init__(self):
        super().__init__()
        print('A')


class B(Base):
    def __init__(self):
        super().__init__()
        print('B')


class C(B, A):
    def __init__(self):
        super().__init__()
        print('C')


t = C()

```

这里例子刁钻就刁钻在其还多次调用了super这个函数，我一开始也以为类B那里引用super会指向Base。首先说一下这个例子的输出把：

```
Base
A
B
C
```

C那里的super引用B这没问题，B那里的super引用的是A这是我没想到的。具体原因是这个super引用逻辑还是调用的前面提到的MRO算法的预处理树，其搜索树为：C，B，A，Base。第二次调用会引用A。然后A那里super再引用Base。

最后我们的初始化动作就上面的例子来说是各个类的`__init__` 都执行了一遍。

## 描述器

本小节参考了[这个网页](http://pyzh.readthedocs.io/en/latest/Descriptor-HOW-TO-Guide.html) 。

上面谈及的属性装饰器，其实际上是调用的property函数，

    property(fget, fset, fdel, descrition) 

而这个函数返回的是一个描述器对象（Desriptor）。那么什么是一个描述器对象呢，简单来说这个对象里面定义了三个方法（最基本的是必须把
`__get__`方法定义了）。

现在让我们把思路再理一下，首先是某个instance.a这个表达，python将视图从
`__dict__` 里面去找这个属性，找得到那么一般 instance\['a'\]
这个表达也是可以获得值的（类的属性继承这里先不涉及），如果 `__dict__`
里面没有这个属性，那么python会去找 `__getattr__(self,name)`
方法，如果找不到那么就会报错。

在上面找属性的过程中，查找描述器的行为是很靠前的。如果找到的属性是一个描述器，那么python会根据这个描述器对象来决定如何提取这个属性，如何修改这个属性等的行为。

然后理解property这个函数返回的是一个怎样的描述器，看下面的python代码等价实现是最直观的了：

    class Property(object):
        "Emulate PyProperty_Type() in Objects/descrobject.c"
    
        def __init__(self, fget=None, fset=None, fdel=None, doc=None):
            self.fget = fget
            self.fset = fset
            self.fdel = fdel
            self.__doc__ = doc
    
        def __get__(self, obj, objtype=None):
            if obj is None:
                return self
            if self.fget is None:
                raise AttributeError, "unreadable attribute"
            return self.fget(obj)
    
        def __set__(self, obj, value):
            if self.fset is None:
                raise AttributeError, "can't set attribute"
            self.fset(obj, value)
    
        def __delete__(self, obj):
            if self.fdel is None:
                raise AttributeError, "can't delete attribute"
            self.fdel(obj)
    
        def getter(self, fget):
            return type(self)(fget, self.fset, self.fdel, self.__doc__)
    
        def setter(self, fset):
            return type(self)(self.fget, fset, self.fdel, self.__doc__)
    
        def deleter(self, fdel):
            return type(self)(self.fget, self.fset, fdel, self.__doc__)

## 缓存属性

下面这个例子灵感来自python官方装饰器 `@property`
的源码，稍作修改使得某个对象的属性具有记忆特性。

    import time
    import logging


```python
class memorized_property(property):

    def __init__(self, *args, **kwargs):
        super(memorized_property, self).__init__(*args, **kwargs)
        self.name = '_{}'.format(self.fget.__name__)

    def __get__(self, obj, objtype=None):
        if obj is None:
            return self
        if self.fget is None:
            raise AttributeError("unreadable attribute")

        if self.name in obj.__dict__:
            logging.debug('from memory--------------------')
            return obj.__dict__[self.name]
        else:
            logging.debug('from computing##########')
            value = obj.__dict__[self.name] = self.fget(obj)
            return value

    def __set__(self, obj, value):
        if self.fset is None:
            raise AttributeError("can't set attribute")
        obj.__dict__[self.name] = value

    def __delete__(self, obj):
        if self.fdel is None:
            raise AttributeError("can't delete attribute")
        del obj.__dict__[self.name]
```


```python
class Test(object):

    def __init__(self):
        pass

    @memorized_property
    def x(self):
        return time.time()

    @x.setter
    def x(self, value):
        pass

    @x.deleter
    def x(self):
        pass

if __name__ == '__main__':
    logging.basicConfig(level=logging.DEBUG)
    t = Test()
    print(t.x)
    print(t.x)
```



## 什么是metaclass

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

## 进程和线程

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

### 线程入门

线程的内部实施细节其实比进程要更加复杂，可以看做是对于进程fork动作的更加轻量化实现解决方案。对于操作系统来说那怕是同一程序而来的不同的进程从程序员的角度来说可以看做完全不同的两个程序都是没有问题的，但是同一进程下的不同线程则不能这么看，首先是操作系统层面各个线程是共享进程的大部分资源，也就是这些线程对于系统资源的使用是彼此竞争关系；其次从程序员的角度来看各个线程之间也可能存在某些公有变量是各个线程之间共享的。

python操作线程的主要模块是**threading**模块，简单的使用就是新建一个线程对象(Thread)，然后调用**start**方法来启动它，具体线程要做些什么由本线程对象的**run**确定，你可以重定义它，如果是默认的就是调用本线程Thread类新建是输入的**target**参数，这个target参数具体指向某个函数。下面是一个简单的例子:

    import random, threading
    
    result = []
    
    def randchar_number(i):
        number_list = list(range(48,58))
        coden = random.choice(number_list)
        result.append(chr(coden))
        print('thread:', i)
    
    for i in range(8):
        t = threading.Thread(target = randchar_number, args=(i,))
        t.start()
    
    print(''.join(result))
    
    thread: 0
    thread: 1
    thread: 2
    thread: 3
    thread: 4
    thread: 5
    thread: 6
    thread: 7
    22972371

**注意: 控制参数后面那个逗号必须加上。**

我不太喜欢这种风格，因为线程对接的那个函数实际上并不能return什么值，而且其保存的值也依赖于前面的定义，并不能称之为真正意义上的函数（一个定义很好的函数必须复用特性很强）。所以线程还是如下类的风格编写。下面代码参考了[这个网页](http://www.ibm.com/developerworks/aix/library/au-threadingpython/index.html)。

```python
import random, threading

threads = []

class MyThread(threading.Thread):
    def __init__(self):
        threading.Thread.__init__(self)
        self.result = ''
    def run(self):
        number_list = list(range(48,58))
        coden = random.choice(number_list)
        self.result = chr(coden)
    def getvalue(self):
        return self.result
```


    for i in range(8):
        t = MyThread()
        t.start()
        t.join()
        threads.append(t)
    
    result = ''
    for t in threads:
        result += t.getvalue()
    print(result)
    
    05649040
    >>> 

上面调用线程对象的 **join**方法是确保该线程执行完了，其也可能返回异常。上面的做法不太标准，更标准的做法是单独写一行 `t.join` 代码:

    for t in threads:
        t.join()

来确保各个线程都执行完了，如之前的形式并不能达到多任务并行处理的效果。

上面的例子对线程的执行顺序没有特殊要求，如果有的话推荐使用python的queue模块，这里就略过了。

### 后台线程

下面的函数实现了一个后台警报线程，不会阻塞主程序。

```python
def beep(a,b):
    '''make a sound , 
    ref: http://stackoverflow.com/questions/16573051/
        python-sound-alarm-when-code-finishes
    you need install  ``apt-get install sox``

    :param a: frenquency
    :param b: duration

    create a background thread,so this function does not block
    '''
    def _beep(a,b):
        import os
        os.system('play --no-show-progress --null --channels 1 \
            synth %s sine %f' % (b,a))
    from threading import Thread
    thread = Thread(target=_beep,args=(a,b))
    thread.daemon = True
    thread.start()
```

如上所示，原beep函数调用系统的play命令制造一个声音，其中b是声音持续的时间，所以其是阻塞的。我们将其作为一个线程调用之后，然后其就没有阻塞主程序了。这里的`daemon` 的意思是让这个线程成为一个后台线程，请参看 [这个网页](http://stackoverflow.com/questions/190010/daemon-threads-explanation) ，其说道后台线程可以不用管了，后面会随着主程序自动关闭。

### 多线程: 一个定时器

这个例子主要参考了[这个网页](https://mail.python.org/pipermail/tutor/2004-November/033333.html)。

```python
import time
import threading

class Timer(threading.Thread):
    def __init__(self,interval, action=lambda:print('\a')):
        threading.Thread.__init__(self)
        self.interval = interval
        self.action = action

    def run(self):
        time.sleep(self.interval)
        self.action()

    def set_interval(self,interval):
        self.interval = interval

#timer = Timer(5)
#timer.start()

class CountDownTimer(Timer):
    def run(self):
        counter = self.interval
        for sec in range(self.interval):
            print(counter)
            time.sleep(1.0)
            counter -= 1
        ##
        self.action()

#timer = CountDownTimer(5)
#timer.start()

def hello():
    print('hello\a')

timer = CountDownTimer(5, action = hello)
timer.start()
```

具体还是很简单的，这里之所以使用线程就是为了timer.sleep函数不冻结主程序。

### 多线程下载大文件

本小节参考了 [这个网页](http://stackoverflow.com/questions/13973188/requests-with-multiple-connections) 和 [这个网页](http://stackoverflow.com/questions/16694907/how-to-download-large-file-in-python-with-requests-py) 。

下面的 `get_content_tofile`函数在目标内容大小大于1M的时候将启动多线程下载方法。其中`guess_url_filename`
函数是根据url来猜测可能的目标下载文件名字，还只是一个尝试版本。

注意下面使用requests.get函数的时候加上了`stream=True`参数，这样连接目标url的时候只是获得头文件信息而不会进一步下载content内容。这方便我们早期根据headers里面的信息做出一些判断。

接下来根据HTTP头文件的 `content-length`来判断要下载内容的大小，如果没有这个属性，那么目标url是没有content内容的，本函数将不会对这一情况做出反应，这通常是单网页url，使用requests的get方法获取网页文本内容即可。

然后如果目标长度小于1M，那么就直接打开文件，使用requests模块里response对象的`iter_content`方法来不断迭代完content内容。

如果目标长度大于1M，则采用一种多线程下载方法。首先是`get_content_partly`这个函数，接受url和index，这个index是一个简单的索引，具体多少bytes后面还需要计算。关于多线程操作和具体多少bytes的计算细节这里略过讨论了。唯一值得一提的就是HTTP协议的Range属性，begin-end，对应具体的范围0-1024，还包括1024位，所以实际上有1025个bytes，为了获得和我们python中一致的体验，我们让其end为begin+1024-1。这样就有1024个bytes位，然后定位是(0,1024)，即和python中的一样，不包括1024位。

然后还有一个小信息是，HTTP协议返回的头文件中的**content-range**属性，如果你请求Range越界了，那么将不会有这个属性。那么begin没有越界，end越界的请求如何呢？HTTP协议处理得很好，这种跨界情况都只返回最后那点content内容。

最后写文件那里降低内存消耗，使用了下面的语句来强制文件流写入文件中，好释放内存，否则你的下载程序内存使用率是剧增的。

```python
f.flush()
os.fsync(f.fileno())

import re
def guess_url_filename(url):
    '''根据url来猜测可能的目标文件名，'''
    response = requests.get(url, stream=True)##还有一个content-type信息可以利用
    s = urlsplit(url)
    guess_element = s.path.split('/')[-1]
    guess_pattern = re.compile(r'''
    (.png|.flv)
    $           # end of string
    ''', re.VERBOSE | re.IGNORECASE)

    if re.search(guess_pattern,guess_element):
        filename = guess_element
    else:
        filename = guess_element + '.html'
    return filename

import threading
import os
class DownloadThread(threading.Thread):
    def __init__(self, url,begin,chunk_size = 1024*300):
        threading.Thread.__init__(self)
        self.url = url
        self.begin = begin
        self.chunk_size = chunk_size
        self.result = b''
    def run(self):
        headers = {'Range':'bytes={begin}-{end}'.format(begin = str(self.begin),
            end = str(self.begin + self.chunk_size-1))}

        response = requests.get(url, stream=True, headers = headers)

        if response.headers.get('content-range') is None:
            self.result = 0##表示已经越界了
        else:
            self.result = response.content
            print('start download...', self.begin/1024, 'KB')

    def getvalue(self):
        return self.result

def get_content_partly(url, index):
    threads = []
    content = b''
    chunk_size = 1024*300# 这个不能设置太大也不能设置太小
    block_size = 10*chunk_size# 具体线程数

    for i in range(10):
        t = DownloadThread(url, index * block_size + i*chunk_size )
        t.start()
        threads.append(t)

    for i,t in enumerate(threads):
        t.join()

    for t in threads:
        if  t.getvalue():
            content += t.getvalue()

    return content

import os
def get_content_tofile(url,filename = ''):
    '''简单的根据url获取content，并将其存入内容存入某个文件中。
    如果某个内容size 小于1M 1000000 byte ，则采用多线程下载法'''

    if not filename:
        filename = guess_url_filename(url)

    # NOTE the stream=True parameter
    response = requests.get(url, stream=True)
    if not response.headers.get('content-length'):
        print('this url does not have a content .')
        return 0
    elif response.headers.get('content-length') < '1000000':
        with open(filename, 'wb') as f:
            for chunk in response.iter_content(chunk_size=1024):
                if chunk: # filter out keep-alive new chunks
                    f.write(chunk)
                    f.flush()
                    os.fsync(f.fileno())
    else:
        with open(filename, 'wb') as f:
            for i in range(1000000):##very huge
                content = get_content_partly(url, i)
                if content:
                    f.write(content)
                    f.flush()
                    os.fsync(f.fileno())
                else:
                    print('end...')
                    break
```



### 线程锁

python有两种类型线程锁 `Lock` 和 `RLock` ，其都是通过 `acquire` 来获取锁和 `release` 来释放锁。当一个线程试着访问某个unlocked的锁，`acquire` 将立即返回；如果访问的是locked的锁，那么该线程将阻塞，直到一个 `release` 释放了该锁。

RLock和Lock的区别是RLock可以被相同的线程acquire多次，RLock人们也称之为递归锁，如果你的某个（递归）函数在某个线程中多次访问资源，而这时被允许的，那么你应该使用RLock。

RLock常和with语句一起使用：

```
lock = threading.RLock()
with lock:
    do something...
```



## 网络编程

下面只讨论TCP套接字编程，UDP协议暂不讨论。整个TCP套接字编程的过程如下所述:

### 套接字编程

1.  客户机负责发起连接，其将新建一个套接字对象（在python中是通过**socket**函数来创建的），就好比在一个封闭的黑箱子里开了一个门，在创建这个套接字对象的过程中，你需要指定具体要连接的那个服务器的IP地址和端口号（**connect**方法）。

2.  接下来是进行TCP的三路握手过程，具体在传输层最底层的东西，客户机应用程序还是服务器应用程序都不用操心，其应该是是操作系统程序负责的。服务器程序需要关心的是在这三路握手期间，其类似于听到了敲门声，其需要开出一个门出来。服务器程序要听到这个敲门声，其应该处于监听该端口的状态。首先服务器程序需要创建一个套接字对象，然后**bind**某个端口号，然后调用**listen**方法开始监听这个端口。

3.  然后服务器那边的监听套接字调用**accept**方法，并形成阻塞，接下来就是听到了敲门声，这个敲门声是TCP三路握手第一路信号发送过来了，这后面TCP三路握手还有两路，这我们暂时不需要太关心了。等到TCP三路握手完成了，服务器之前的那个accept方法将创建一个套接字对象。这个套接字对象称之为*连接套接字*。我们在这里把服务器那边的连接套接字调用accept方法可以理解为接受了客户机的敲门，如果一切顺利的话，其将为客户机新开一个套接字，也就是一个新门。

4.  对于客户机那边只有一个套接字，情况稍微简单点，其往套接字里面塞信息（**sendall**方法）就是发送信息过去了，然后从套接字那里读（**recv**方法），就是读信息了。而服务器那边，实际上和客户机对等的来看的话，第二个新建的连接套接字可以看作看作类似客户机那边的第一个套接字，往里面读就是读信息，往里面写就是发送信息。之所以服务器那边要新开一个套接字，我们可以猜到，是因为服务器要同时处理多个客户机请求，可以把第一个监听套接字理解为总大门，然后后面开启的连接套接字理解为小门，其才是真正和具体那个客户机的一对一管道连接。

上面的简要描述太过于抽象，我们再来看一个最简单的实际代码，其就是python官方文档socket模块的第一个例子，可能有些地方稍作改动。

下面是服务器端 `server.py` 的代码:

    import socket
    
    HOST = 'localhost'
    PORT = 50007
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.bind((HOST, PORT))
    s.listen(1)
    conn, addr = s.accept()
    print('Connected by', addr)
    while True:
        data = conn.recv(1024)
        if not data:break
        conn.sendall(data)
    conn.close()

首先我们运行server.py，如前所述，其首先需要根据socket函数来创建一个监听套接字，这个套接字具体监听的端口由bind方法指定，然后这个监听套接字开始监听（调用listen方法）。然后调用这个监听套接字的accept方法，其如果收到TCP连接请求，其将返回一个连接套接字，这里是conn。然后程序进入主循环，在这里连接套接字用recv方法来读，然后用sendall方法来写。最后是通过close方法来关闭本连接套接字。

下面是客户机端 `client.py` 的代码:

    import socket
    
    HOST = 'localhost'
    PORT = 50007
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.connect((HOST, PORT))
    s.sendall(b'Hello, world')
    data = s.recv(1024)
    s.close()
    print('Received', repr(data))

这里客户机那边首先新建一个套接字，这个套接字可以直接用connect方法来拨号某个服务器，然后用sendall方法来写，用recv方法来读。整个过程大抵如此。

最后以一副图画来加深对本小节的印象把。

![img]({static}/images/python/tao-jie-zi-bian-cheng.png)

下面我们将更深入讨论套接字编程，并用python的socket模块来介绍具体编码的细节问题。

### socket模块

### host主机名

host最简单就是人们熟知的IP地址，然后就是由本地hosts文件解析或者网络DNS系统解析的名字。比如
`localhost` 或者 `python.org` 等。socket模块里面有 `gethostbyname`
函数，可以获取该hostname具体对应的IP地址。

    >>> socket.gethostbyname('python.org')
    '104.130.43.121'

不过gethostbyname函数只支持IPv4地址，现在推荐使用 `getaddrinfo`
函数，其同时支持IPv4和IPv6地址。其参数设置如下:

    socket.getaddrinfo(host, port, family=0, type=0, proto=0, flags=0)

port可以填写80或者'http'这样的形式，或者设置为None。然后后面的family是地址族，type是套接字类型等，这些这里先暂时略过讨论。

这个函数的返回值是一个列表，其内元素有如下结构:

    (family, type, proto, canonname, sockaddr)

具体如下所示:

    >>> socket.getaddrinfo('www.github.com','https')
    [(<AddressFamily.AF_INET: 2>, <SocketType.SOCK_STREAM: 1>, 6, '', ('192.30.252.131', 443)),
    (<AddressFamily.AF_INET: 2>, <SocketType.SOCK_DGRAM: 2>, 17, '', ('192.30.252.131', 443)), 
    (<AddressFamily.AF_INET: 2>, <SocketType.SOCK_STREAM: 1>, 6, '', ('192.30.252.128', 443)), 
    (<AddressFamily.AF_INET: 2>, <SocketType.SOCK_DGRAM: 2>, 17, '', ('192.30.252.128', 443))]

这里的 `AF_INET`
地址族是创建socket套接字对象时的默认地址族，其就是对应的IPv4地址。然后套接字类型
`SOCK_STREAM` 也是创建套接字对象的默认值，其是字节流套接字。

getaddrinfo函数返回的 `family,type,proto`
这三个参数可以传递给socket函数用于具体创建一个套接字对象。canonname比较冷门，然后
`sockaddr` 可以传递给套接字对象的 `connect`
方法来具体进行套接字连接操作。

我们来用下面这个脚本试一下:


    import socket
    socket.setdefaulttimeout(10)


    addrinfos = socket.getaddrinfo('www.baidu.com', 'http')
    
    for addrinfo in addrinfos:
        socket_parameter = addrinfo[:3]
        print(socket_parameter)
        addr = addrinfo[-1]
        print(addr)
    
        s = socket.socket(*socket_parameter)
        try:
            s.connect(addr)
            print('connected')
            print('peername',s.getpeername())
            print('hostname',s.getsockname())
        #except socket.timeout:
            #print('socket timeout')
        except Exception as e:
            print(e)

读者还可以用其他域名来试一下。

### 地址族

AF\_INET

:   IPv4地址

AF\_INET6

:   IPv6地址

此外还有一些冷门的地址族: AF\_UNIX ， AF\_NETLINK ， AF\_TIPC

### 套接字类型

SOCK\_STREAM

:   字节流套接字

SOCK\_DGRAM

:   数据报套接字

上面这两个套接字类型是全平台适用的。此外还有一些冷门的套接字类型:
SOCK\_RAW ， SOCK\_RDM ， SOCK\_SEQPACKET

### 传输协议

传输协议 `proto` 一般设置为0。也可以明确指定某个传输协议:

IPPROTO\_CP

:   TCP传输协议

IPPROTO\_UDP

:   UDP传输协议

IPPROTO\_SCTP

:   SCTP传输协议

### timeout

    socket.settimeout(None)
    socket.settimeout(0)
    socket.settimeout(sec)

-   如果设置为None，则套接字为阻塞模式

-   如果设置为0，则套接字为非阻塞模式

-   如果设置具体某个sec秒，则套接字会等待多少sec秒，然后抛出
    `socket.timeout` 异常。

此外还有 `setdefaulttimeout`
函数可以全局设置后面所有创建的socket对象的timeout。

    socket.setdefaulttimeout(10)

阻塞模式还可以如下设置：

    socket.setblocking(True)
    socket.setblocking(False)

### listen方法

服务器端套接字具体开始监听。

    socket.listen([backlog])

从python3.5开始，backlog参数为可选参数了。这个backlog的意思是最大等待连接数（如果超过这个数，新的连接将被拒绝）。这个数以前一般设置为5，因为那个时候系统最大也才允许是5，但现在可能需要再提高一点了，现在python3.5起，这个数成为可选参数了，文档上说会自动设置一个合适的数，所以就不需要我们操心了。

更多细节请参看官方文档。

## 异步编程

常规的所谓同步(synchronous)编程就是大家平时编程一般使用的模型，顺序结构，阻塞式，多个函数逐个执行，一个执行完才能执行下一个，如下图所示:

![img]({static}/images/python/tong-bu-bian-cheng-mo-xing.png)


此外还有一种线程并发模型:

![img]({static}/images/python/xian-cheng-bing-fa-mo-xing.png)

python有所谓的GIL概念，很多人对其有指责，而实际上那些支持多线程并发的语言，怕因为这个便利而带来的是更多的困扰吧。想一想我们人脑思考问题同一时间也只能做一件事，也许python的GIL限制并不是一种限制。实际上如果要用多线程并发，人们需要建立好模型，比如最终多个分支线路互不干扰，然后结果平行放入一个列表中等等约束，然后才能放心的使用多线程并发。而在这个约束模型下，python的
**multiprocess** 模块似乎也能很好地胜任这种类型的工作。

继续讨论异步编程模型:
![img]({static}/images/python/yi-bu-bian-cheng-mo-xing.png)


*异步编程*还有一个名字叫做*非阻塞编程*，我们看到上面主程序建立事件循环之后，主事件循环过程并没有阻塞其他的程序过程，而是允许其插入其中来执行。实际上这有点类似于我们看到的GUI程序的主设计理念------事件驱动循环机制，所以异步编程还有一个名字叫做*事件驱动编程*。

下面开始通过一些例子来学习吧。

### 低效的诗歌服务器

本例子来自参考资料 [@twisted与异步编程入门] ，我将其改成了python3版本
`slowpoetry.py` 。

    #!/usr/bin/env python3
    # -*- coding: utf-8 -*-
    
    import argparse, os, socket, time
    
    def parse_args():
        usage = """usage: %prog [options] poetry-file
    
    This is the Slow Poetry Server, blocking edition.
    Run it like this:
    
      python3 slowpoetry.py ecstasy.txt
    
    """
    
        parser = argparse.ArgumentParser(usage)
    
        help = "The port to listen on. Default to a random available port."
        parser.add_argument('-p','--port', type=int, help=help)
    
        help = "The interface to listen on. Default is localhost."
        parser.add_argument('--iface', help=help, default='localhost')
    
        help = "The number of seconds between sending bytes."
        parser.add_argument('--delay', type=float, help=help, default=.1)
    
        help = "The number of bytes to send at a time."
        parser.add_argument('--num-bytes', type=int, help=help, default=20)
    
        parser.add_argument('poetry_file')
    
        args = vars(parser.parse_args())
    
        poetry_file = args['poetry_file']
        if not poetry_file:
            parser.error('No such file: %s' % poetry_file)
    
        return args


    def send_poetry(sock, poetry_file, num_bytes, delay):
        """Send some poetry slowly down the socket."""
    
        inputf = open(poetry_file)
    
        while True:
            bytes = inputf.read(num_bytes).encode()
    
            if not bytes:
                sock.close()
                inputf.close()
                return 'end'
    
            print('Sending %d bytes' % len(bytes))
    
            try:
                sock.sendall(bytes)
            except socket.error:
                sock.close()
                inputf.close()
                return 'error'
    
            time.sleep(delay)



    def serve(listen_socket, poetry_file, num_bytes, delay):
        while True:
            sock, addr = listen_socket.accept()
    
            print('Somebody at %s wants poetry!' % (addr,))
    
            result = send_poetry(sock, poetry_file, num_bytes, delay)
    
            if result == 'end':
                print('sending complete')
            elif result == 'error':
                print('error, sending stopped')
    
    def main():
        args= parse_args()
        poetry_file = args['poetry_file']
        port = args['port']
        iface = args['iface']
        num_bytes = args['num_bytes']
        delay = args['delay']
    
        sock = socket.socket()
        sock.bind((iface, port or 0))
        sock.listen(5)
        print('Serving %s on port %s.' % (poetry_file, sock.getsockname()[1]))
    
        serve(sock, poetry_file, num_bytes, delay)
    
        sock.close()


    if __name__ == '__main__':
        main()

下面是对应的获取诗歌的client端程序 `get_poetry.py` 。

    #!/usr/bin/env python3
    # -*- coding: utf-8 -*-
    
    import datetime, argparse, socket
    
    def parse_args():
        usage = """usage: %prog [options] [hostname]:port ...
    
    This is the Get Poetry Now! client, blocking edition.
    Run it like this:
    
      python3 get_poetry.py port1 port2 port3 ...
    
    """
    
        parser = argparse.ArgumentParser(usage)
        parser.add_argument('port',nargs='+')
    
        args = vars(parser.parse_args())
        addresses = args['port']
    
        if not addresses:
            print(parser.format_help())
            parser.exit()
    
        def parse_address(addr):
            if ':' not in addr:
                host = '127.0.0.1'
                port = addr
            else:
                host, port = addr.split(':', 1)
    
            if not port.isdigit():
                parser.error('Ports must be integers.')
    
            return host, int(port)
    
        return map(parse_address, addresses)


    def get_poetry(address):
        """Download a piece of poetry from the given address."""
    
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.connect(address)
    
        poem = b''
    
        while True:
            data = sock.recv(1024)
    
            if not data:
                sock.close()
                break
            else:
                print(data.decode('utf-8'),end='')
    
            poem += data
    
        return poem


    def format_address(address):
        host, port = address
        return '%s:%s' % (host or '127.0.0.1', port)


    def main():
        addresses = parse_args()
        elapsed = datetime.timedelta()
    
        for i, address in enumerate(addresses):
            addr_fmt = format_address(address)
            print('Task %d: get poetry from: %s' % (i + 1, addr_fmt))
            start = datetime.datetime.now()
    
            poem = get_poetry(address)
    
            time = datetime.datetime.now() - start
            msg = 'Task %d: got %d bytes of poetry from %s in %s'
            print(msg % (i + 1, len(poem), addr_fmt, time))
    
            elapsed += time
    
        print('Got %d poems in %s' % (len(list(addresses)), elapsed))


    if __name__ == '__main__':
        main()

读者可以利用上面的两个脚本来具体测试一下效果。上面的两个脚本，客户端和服务器端都是阻塞式的。我们先开一个服务器端:

    python3 slowpoetry.py -p 10000 ecstasy.txt

然后开两个终端，同时刷如下命令，我们就能看到其中后执行的那个终端的获取文本是被阻塞了的------这是服务器阻塞了。

    python3 slowpoetry.py -p 10000 ecstasy.txt

然后我们在开一个服务器端:

    python3 slowpoetry.py -p 10001  fascination.txt

然后一个客户端运行如下:

    python3 get_poetry.py 10000 10001

然后我们看到这个客户端获取文本是一个个来的，这是客户端阻塞了。

这种一个个来，一个任务做完才能进行下一个的模式是很好理解的，但进程间的通信可以不是这样，请看下面的select风格I/O复用的讨论。

### Select风格的诗歌服务器

#### Unix五种I/O模型

首先讨论一下Unix的五种I/O模型：

1.  阻塞式I/O ，默认的就是阻塞式I/O。

2.  非阻塞式I/O，应用程序持续轮询内核看看某个操作是否准备就绪。

3.  I/O复用，通过select或poll这样的多文件描述符来管理I/O。

4.  信号驱动式I/O

5.  异步I/O

这五种I/O模型中，最直接的阻塞式I/O模型，而非阻塞I/O轮询机制太过于浪费资源，然后信号驱动I/O和异步I/O应用很少，真正用的最多就是这里的
**I/O复用模型**
。python中的twisted模块和python3.4之后新出来的**asyncio**
模块里面的事件循环都是基于 然后再建立起来的类异步I/O概念。

下面将重点结合python的selectors模块来分析这种I/O复用模型。selectors模块从python3.4开始才有，其建构在select模块之上。其有如下五种内置的Selector:

    -   SelectSelector
    -   PollSelector
    -   EpollSelector
    -   DevpollSelector
    -   KqueueSelector

不过我们实际使用就使用 `DefaultSelector`
即可，python会自动选择当前平台最好的Selector。

具体创建一个Selector对象如下所示:

    sel = selectors.DefaultSelector()

#### 监控文件读写事件

Selector对象有个register方法，如下所示：

    register(fileobj, events, data=None)

其中fileobj为某文件对象（在Linux中一切皆文件，所以套接字也可以视为一个文件。）。

这里可以监控的事件有:

-   **EVENT\_READ** 可读事件，具体可读的定义按照参考资料
    [@Unix网络编程卷1] 是这样描述的:

    1.  该套接字接受缓冲区中的数据字节数大于等于套接字接受缓冲区低水平标记的当前大小。对这样的套接字的读是不会阻塞的，其将返回一个大于0的值（也就是具体读入的字节数）。我们可以使用
        `SO_RCVLOWAT`
        套接字选项来设置该套接字低水平标记，TCP和UDP套接字的默认值是1。【这个很好理解，就是1个字节，如果接受了1个字节或者更多的字节那么就有了可读事件了。】

    2.  该连接的读半部关闭，这样的套接字的读操作将不阻塞并返回0（也就是返回EOF）。【这里就是套接字对面关闭了，那么也将是可读的，我们可以用
        'if read' 这样的判断来进行读结束的后续处理。】

    3.  该套接字是一个监听套接字且已完成连接数不为0。【这主要是指服务器端一开始创建的那个监听套接字，其一般accept不会阻塞的，
        `conn, addr = s.accept()`
        ，也就是客户端那边有敲门了，就会有一个可读事件，就会批准自动创建一个监听套接字，除非已完成连接数为0------这个已完成连接数具体含义我还不清楚。】

    4.  上面的情况中，有一个套接字错误待处理，对这样的套接字读操作将不阻塞并返回-1。【这里细节暂时还不清楚。】

-   **EVENT\_WRITE** 可写事件，具体可写的定义按照参考资料
    [@Unix网络编程卷1] 是这样描述的:

    1.  该套接字发送缓冲区中的可用空间字节数大于等于套接字发送缓冲区低水平标记的当前大小，并且该套接字已连接（或者该套接字不需要连接，比如UDP套接字）。如果我们把这样的套接字设置为非阻塞，那么写操作将返回一个正值（具体传输层接受到的字节数）。我们可以使用
        `SO_SNDLOWAT`
        套接字选项来设置该套接字的可写低水平标记，TCP和UDP套接字默认值是2048。【如果套接字是阻塞的，那么写操作应该会因为套接字另一端recv的阻塞而阻塞，这是我的一个猜测。然后这里和上面可读实际上是个反的，可读是相当于数据量超过某个标记，也就是往里面送一点点数据是不行的，还需要送到一定的量，才可读；而可写是送一点点数据都是可写的，只有送的数据量很大之后，
        *可用的* 缓冲区空间 *小于* 某个标记之后，就不可写了。】

    2.  该连接的写半部关闭。对这样的套接字进行写操作将产生SIGPIPE信息。【我试过，后续程序会出错。对于服务器主动发动数据的模式，都应该考虑这种情况和捕捉好这个可能的异常。】

    3.  非阻塞连接的套接字已连接或连接已失败。【非阻塞连接初次连接成功可写很好理解，但为什么连接失败也可写？可能这里非阻塞初次连接失败被处理为连接半部关闭的情况了，也就是上面的哪一条。】

    4.  上面的情况中，有一个套接字错误待处理，对这样的套接字写操作将不阻塞并返回-1。

更多的内容请参看 selectors 模块的官方文档。

下面的例子将之前那个诗歌服务器写成了Select风格的异步版本
`select_slowpoetry.py`:

    #!/usr/bin/env python3
    # -*- coding: utf-8 -*-


    import argparse
    import os
    import socket
    import time
    import selectors
    
    sel = selectors.DefaultSelector()


    def parse_args():
        usage = """usage: %prog [options] poetry-file
    
      python3 select_slowpoetry.py ecstasy.txt
    
    """
    
        parser = argparse.ArgumentParser(usage)
    
        help = "The port to listen on. Default to a random available port."
        parser.add_argument('-p', '--port', type=int, help=help)
    
        help = "The interface to listen on. Default is localhost."
        parser.add_argument('--iface', help=help, default='localhost')
    
        help = "The number of seconds between sending bytes."
        parser.add_argument('--delay', type=float, help=help, default=.1)
    
        help = "The number of bytes to send at a time."
        parser.add_argument('--num-bytes', type=int, help=help, default=20)
    
        parser.add_argument('poetry_file')
    
        args = vars(parser.parse_args())
    
        poetry_file = args['poetry_file']
        if not poetry_file:
            parser.error('No such file: %s' % poetry_file)
    
        return args


    def send_poetry(sock, poetry_file, num_bytes, delay, inputf):
        """Send some poetry slowly down the socket."""
    
        bytes = inputf.read(num_bytes)
    
        if not bytes:
            sel.unregister(sock)
            sock.close()
            inputf.close()
            print('sending complete')
            return True
    
        try:
            sock.sendall(bytes)
        except socket.error:
            sel.unregister(sock)
            sock.close()
            inputf.close()
            print('some error, sending stoped')
            return False
    
        time.sleep(delay)


    def serve(listen_socket, poetry_file, num_bytes, delay):
        sock, addr = listen_socket.accept()
        print('Somebody at %s wants poetry!' % (addr,))
        sock.setblocking(False)
    
        inputf = open(poetry_file, 'rb')
        sel.register(sock, selectors.EVENT_WRITE,
                     data={'callback': send_poetry, 
                            'args': [poetry_file, num_bytes, delay, inputf]})


    def main():
        args = parse_args()
        poetry_file = args['poetry_file']
        port = args['port']
        iface = args['iface']
        num_bytes = args['num_bytes']
        delay = args['delay']
    
        sock = socket.socket()
        sock.bind((iface, port or 0))
        sock.listen(100)
        sock.setblocking(False)
        print('Serving %s on port %s.' % (poetry_file, sock.getsockname()[1]))
    
        sel.register(sock, selectors.EVENT_READ,
                     data={'callback': serve, 'args': [poetry_file, num_bytes, delay]})
    
        while True:
            events = sel.select()
            for key, mask in events:
                callback = key.data['callback']
                callback(key.fileobj, *key.data['args'])
    
        sock.close()


    if __name__ == '__main__':
        main()

客户端的编写要更加简单一点，具体代码如下所示 `select_get_poetry.py`:

    #!/usr/bin/env python3
    # -*- coding: utf-8 -*-
    
    import datetime
    import argparse
    import socket
    
    import selectors
    sel = selectors.DefaultSelector()


    def parse_args():
        usage = """usage: %prog [options] [hostname]:port ...
    
      python3 select_get_poetry.py port1 port2 port3 ...
    
    通过select I/O复用来建立一个异步诗歌下载客户端，可以同时面向多个诗歌服务器来进行下载。
    """
    
        parser = argparse.ArgumentParser(usage)
        parser.add_argument('port', nargs='+')
    
        args = vars(parser.parse_args())
        addresses = args['port']
    
        if not addresses:
            print(parser.format_help())
            parser.exit()
    
        def parse_address(addr):
            if ':' not in addr:
                host = '127.0.0.1'
                port = addr
            else:
                host, port = addr.split(':', 1)
    
            if not port.isdigit():
                parser.error('Ports must be integers.')
    
            return host, int(port)
    
        return map(parse_address, addresses)


    def download_poetry(sock, infile):
        """Download a piece of poetry from the given address."""
    
        bstring = sock.recv(1024)
    
        if not bstring:  # end fo reading
            sel.unregister(sock)
            infile.close()
            print('end of reading')
            return True
        else:
            print('writing to {}'.format(infile.name))
            infile.write(bstring)


    def connect(address):
        """Connect to the given server and return a non-blocking socket."""
        sock = socket.socket()
        sock.connect(address)
        sock.setblocking(False)
        return sock


    def format_address(address):
        host, port = address
        return '%s:%s' % (host or '127.0.0.1', port)


    def main():
        addresses = parse_args()
        elapsed = datetime.timedelta()
        sockets = map(connect, addresses)
    
        for sock in sockets:
            filename = str(sock.getpeername()[1]) + '.txt'
            infile = open(filename, 'wb')
            sel.register(sock, selectors.EVENT_READ,
                         data={'callback': download_poetry,
                               'args': [infile]})
    
        while True:
            events = sel.select()
            for key, mask in events:
                callback = key.data['callback']
                callback(key.fileobj, *key.data['args'])


    if __name__ == '__main__':
        main()

这里主要的改动有两点:

1.
客户端同时开启几个sock，然后这些sock和可读时间绑定了download\_poetry方法，只要有数据可读了，那么就会执行该操作。
2.
具体下载行为就是对目标fileobj进行write，把接受到的字节流给写进去即可。

### Asyncio风格的诗歌服务器

通过Selectors模块，不仅现在我们的程序是高效的异步模式了，而且之前代码中那几个丑陋的
`while True`
给压缩到只有一个了，对于追求代码美观的程序员来说他们会对这一进步会感到很满意。而程序刚开始那个
`while True`
人们也有点看不习惯它了。人们慢慢的构建出\"**reactor**\"这个术语来取代这个主循环，如下图所示:

reactor

在twisted模块中实际上就有这么一个reactor变量，来对应这个主Selector事件驱动。而asyncio模块里面也有类似的eventloop概念:

    import asyncio
    eventloop = asyncio.get_event_loop()

在进行事件驱动编程之前还需要强调一点，上图这个 *事件循环*
的概念是事件驱动编程的核心概念，实际上在前面的select风格异步编程中，我们就已经看到这点影子了，那就是开启事件循环之后，剩下的工作就是挂载一些函数，这些函数里面会涉及到另外一些函数的挂载和取消挂载操作等，我们可以在脑海中想象中间一个事件循环大圈，然后四周八围挂载着各种函数各种操作，这就是事件驱动编程风格了。实际上事件驱动编程会让很多工作变得简单，其没有让事情变得复杂，关键是我们的头脑要习惯这种编程风格，脑海里还熟悉这种事件驱动模型。

#### 常规eventloop版

下面是Asyncio风格的诗歌服务器第一版，关于asyncio模块有不懂的读者请参看该模块的官方文档。

    #!/usr/bin/env python3
    # -*- coding: utf-8 -*-
    
    import argparse
    import os
    import socket
    import time
    import asyncio


    def parse_args():
        usage = """usage: %prog [options] poetry-file
    
      python3 asyncio_slowpoetry.py ecstasy.txt
    
    """
    
        parser = argparse.ArgumentParser(usage)
    
        help = "The port to listen on. Default to a random available port."
        parser.add_argument('-p', '--port', type=int, help=help)
    
        help = "The interface to listen on. Default is localhost."
        parser.add_argument('--iface', help=help, default='localhost')
    
        help = "The number of seconds between sending bytes."
        parser.add_argument('--delay', type=float, help=help, default=.1)
    
        help = "The number of bytes to send at a time."
        parser.add_argument('--num-bytes', type=int, help=help, default=20)
    
        parser.add_argument('poetry_file')
    
        args = vars(parser.parse_args())
    
        poetry_file = args['poetry_file']
        if not poetry_file:
            parser.error('No such file: %s' % poetry_file)
    
        return args


    def send_poetry(eventloop, sock, poetry_file, num_bytes, delay, inputf):
        """Send some poetry slowly down the socket."""
    
        bytes = inputf.read(num_bytes)
    
        if not bytes:
            eventloop.remove_writer(sock)
            sock.close()
            inputf.close()
            print('sending complete')
            return True
    
        try:
            sock.sendall(bytes)
        except socket.error:
            eventloop.remove_writer(sock)
            sock.close()
            inputf.close()
            print('some error, sending stoped')
            return False
    
        time.sleep(delay)


    def serve(eventloop, listen_socket, poetry_file, num_bytes, delay):
        sock, addr = listen_socket.accept()
        print('Somebody at %s wants poetry!' % (addr,))
        sock.setblocking(False)
    
        inputf = open(poetry_file, 'rb')
        eventloop.add_writer(sock, send_poetry, eventloop, sock,
                             poetry_file, num_bytes, delay, inputf)


    def main():
        args = parse_args()
        poetry_file = args['poetry_file']
        port = args['port']
        iface = args['iface']
        num_bytes = args['num_bytes']
        delay = args['delay']
    
        sock = socket.socket()
        sock.bind((iface, port or 0))
        sock.listen(100)
        sock.setblocking(False)
        print('Serving %s on port %s.' % (poetry_file, sock.getsockname()[1]))
    
        eventloop = asyncio.get_event_loop()
        eventloop.add_reader(sock, serve, eventloop, sock,
                             poetry_file, num_bytes, delay)
    
        try:
            eventloop.run_forever()
        finally:
            eventloop.close()
    
        sock.close()


    if __name__ == '__main__':
        main()

这里也将之前的诗歌获取客户端写成asyncio版本。代码如下所示，改动不是很大。

    #!/usr/bin/env python3
    # -*- coding: utf-8 -*-
    
    import datetime
    import argparse
    import socket
    import asyncio


    def parse_args():
        usage = """usage: %prog [options] [hostname]:port ...
    
      python3 select_get_poetry3.py port1 port2 port3 ...
    
    """
    
        parser = argparse.ArgumentParser(usage)
        parser.add_argument('port', nargs='+')
    
        args = vars(parser.parse_args())
        addresses = args['port']
    
        if not addresses:
            print(parser.format_help())
            parser.exit()
    
        def parse_address(addr):
            if ':' not in addr:
                host = '127.0.0.1'
                port = addr
            else:
                host, port = addr.split(':', 1)
    
            if not port.isdigit():
                parser.error('Ports must be integers.')
    
            return host, int(port)
    
        return map(parse_address, addresses)


    def download_poetry(eventloop, sock, infile):
        """Download a piece of poetry from the given address."""
    
        bstring = sock.recv(1024)
    
        if not bstring:  # end fo reading
            eventloop.remove_reader(sock)
            sock.close()
            infile.close()
            print('end of reading')
            return True
        else:
            print('writing to {}'.format(infile.name))
            infile.write(bstring)


    def connect(address):
        """Connect to the given server and return a non-blocking socket."""
        sock = socket.socket()
        sock.connect(address)
        sock.setblocking(False)
        return sock


    def format_address(address):
        host, port = address
        return '%s:%s' % (host or '127.0.0.1', port)


    def main():
        addresses = parse_args()
        sockets = map(connect, addresses)
        eventloop = asyncio.get_event_loop()
    
        for sock in sockets:
            filename = str(sock.getpeername()[1]) + '.txt'
            infile = open(filename, 'wb')
    
            eventloop.add_reader(sock, download_poetry, eventloop, sock, infile)
    
        try:
            eventloop.run_forever()
        finally:
            eventloop.close()


    if __name__ == '__main__':
        main()

值得一提的是这里的读完毕的判断逻辑:

        if not bstring:##end fo reading
            eventloop.remove_reader(sock)
            sock.close()
            infile.close()
            print('end of reading')
            return True

如果读半部关闭，则将返回0，所以可以如上来判断读操作是否完毕了。

#### 自定义协议版

asyncio模块还提供了很多功能可以让读者不用使用socket模块，而直接更高层的基于协议来编写网络程序。下面是
诗歌服务器第二版，本例子参考了
[这个网页](http://www.getoffmalawn.com/blog/playing-with-asyncio)
然后修改而成。

    #!/usr/bin/env python3
    # -*- coding: utf-8 -*-
    
    import argparse
    import os
    import time
    import asyncio


    def parse_args():
        usage = """usage: %prog [options] poetry-file
    
      python3 asyncio_slowpoetry3.py ecstasy.txt
    
    """
    
        parser = argparse.ArgumentParser(usage)
    
        help = "The port to listen on. Default to a random available port."
        parser.add_argument('-p', '--port', type=int, help=help)
    
        help = "The interface to listen on. Default is localhost."
        parser.add_argument('--iface', help=help, default='127.0.0.1')
    
        help = "The number of bytes to send at a time."
        parser.add_argument('--num-bytes', type=int, help=help, default=20)
    
        parser.add_argument('poetry_file')
    
        args = vars(parser.parse_args())
    
        poetry_file = args['poetry_file']
        if not poetry_file:
            parser.error('No such file: %s' % poetry_file)
    
        return args


    class PoetryServeProtocol(asyncio.Protocol):
    
        def __init__(self, inputf, num_bytes):
            self.inputf = inputf
            self.num_bytes = num_bytes
    
        def connection_made(self, transport):
            self.transport = transport
            print(self.transport)
    
        def data_received(self, data):
            if data == b'poems':
                poem = self.inputf.read(self.num_bytes)
                if poem:
                    self.transport.write(poem)
                else:
                    self.transport.write_eof()


    def main():
        args = parse_args()
        poetry_file = args['poetry_file']
        num_bytes = args['num_bytes']
        port = args['port']
        iface = args['iface']
    
        inputf = open(poetry_file, 'rb')
    
        eventloop = asyncio.get_event_loop()
    
        print(iface, port)
        coro = eventloop.create_server(
            lambda: PoetryServeProtocol(inputf, num_bytes), iface, port)
    
        server = eventloop.run_until_complete(coro)
        print(server)
    
        try:
            eventloop.run_forever()
        finally:
            eventloop.close()


    if __name__ == '__main__':
        main()

代码变得简单得可怕了。首先我们看到这个 `create_server`
方法。通过这个方法，我们可以基于自己定义的某个协议来创建一个TCP
server（返回的是协程对象）。下面主要看到具体创建的那个协议对象。

自定义的协议继承自Protocol类，然后定义一些方法:

connection\_made

:   这个callback继承自Protocol类，逻辑是如果一个连接建好了，那么执行该函数。其接受一个参数transport。也就是具体协议的传输层。

data\_received

:   这个callback继承自Protocol类，如果某个数据传进来了，那么该函数将被执行。其接受一个参数就是传进来的data。

eof\_received

:   数据结束完毕是调用。你可以在另外一端用transport发送写入结束信号
    `write_eof()` 。

配套的获取诗歌客户端如下所示:

    #!/usr/bin/env python3
    # -*- coding: utf-8 -*-
    
    import datetime
    import argparse
    import asyncio


    def parse_args():
        usage = """usage: %prog [options] [hostname]:port ...
    
      python3 select_get_poetry3.py port1 port2 port3 ...
    
    """
    
        parser = argparse.ArgumentParser(usage)
        parser.add_argument('port', nargs='+')
    
        args = vars(parser.parse_args())
        addresses = args['port']
    
        if not addresses:
            print(parser.format_help())
            parser.exit()
    
        def parse_address(addr):
            if ':' not in addr:
                host = '127.0.0.1'
                port = addr
            else:
                host, port = addr.split(':', 1)
    
            if not port.isdigit():
                parser.error('Ports must be integers.')
    
            return host, int(port)
    
        return map(parse_address, addresses)


    class PoetryClientProtocol(asyncio.Protocol):
    
        def __init__(self, infile):
            self.infile = infile
    
        def connection_made(self, transport):
            print(transport.get_extra_info('peername'))
            self.transport = transport
            self.transport.write(b'poems')
    
        def data_received(self, data):
            if data:
                print(data)
                print('writing to {}'.format(self.infile.name))
                self.infile.write(data)
                self.transport.write(b'poems')
    
        def eof_received(self):
            print('end of writing')
            self.infile.close()


    def main():
        addresses = parse_args()
        eventloop = asyncio.get_event_loop()
    
        for address in addresses:
            host, port = address
            filename = str(port) + '.txt'
            infile = open(filename, 'wb')
            coro = eventloop.create_connection(
                lambda: PoetryClientProtocol(infile), host, port)
            t, p = eventloop.run_until_complete(coro)
            print(t, p)
    
        try:
            eventloop.run_forever()
        finally:
            eventloop.close()


    if __name__ == '__main__':
        main()



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


#### ord和chr函数

ord函数接受 一个字符，然后返回其unicode编码，十进制的。chr函数是ord函数的反向，比如你输入24352这个十进制uniocde，就返回了对应的字符。

```
>>> chr(24352)
'张'
```

所以我们可以总结到，python3的字符串比较大小，是基于utf-8编码的。







