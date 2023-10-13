Slug: python-language
Date: 20191018
Modified: 20231013



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


## 引入模块

### import语句

import语句的一般使用方法之前已有接触，比如 `import math` ，然后要使用math模块里面的函数或者类等需要使用这样的带点的变量名结构：math.pi。

此外import语句还有一个常见的缩写名使用技巧，比如import numpy as
np，那么后面就可以这样写了， np.array，而不是numpy.array。

### from语句

from语句的使用有以下两种情况：

```
from this import this
from what import *
```

第一种形式是点名只导入某个变量，第二种形式是都导入进来。我想读者肯定知道这点，使用第二种导入形式的时候要小心变量名覆盖问题，这个自己心里有数即可。

### reload函数

reload函数可以重新载入某个模块，reload函数的优点就是不需要重新启动应用程序，更加合理的动态重载一些模块。reload只能用于python编写的模块，在python3中，reload函数被移到imp模块里面去了，因此首先需要import
imp才能使用了。比如说：

```
from imp import reload
reload(somemodule)
```



time模块
--------

time模块提供了一些和时间相关的函数，更加的底层，不过有些函数可能在某些平台并不适用。类似的模块还有datetime模块，datetime是以类的框架来解决一些时间问题的。所以如果只是需要简单的调用一下时间，那么用time模块，如果是大量和时间相关的问题，推荐使用datetime模块。

### time函数

    >>> import time
    >>> time.time()
    1404348227.07554

time函数返回一个数值，这个数值表示从1970年1月1号0时0分0秒到现在的时间过了多少秒。

### gmtime函数

这个函数可以接受一个参数，这个参数是多少秒，然后返回一个特定格式的时间数组`struct_time`。如果不接受参数，那么默认接受的秒数由time函数返回，也就是从那个特定时间到现在过了多少秒，这样这个特定格式的时间数组对应的就是当前时间。

    >>> time.gmtime()
    time.struct_time(tm_year=2014, tm_mon=7, tm_mday=3, tm_hour=0, 
    tm_min=53, tm_sec=0, tm_wday=3, tm_yday=184, tm_isdst=0)
    >>> time.gmtime(0)
    time.struct_time(tm_year=1970, tm_mon=1, tm_mday=1, tm_hour=0, 
    tm_min=0, tm_sec=0, tm_wday=3, tm_yday=1, tm_isdst=0)

### localtime函数

此外类似的还有**localtime**函数，和gmtime用法和返回完全一模一样，唯一的区别就是返回的是当地的时间。

    >>> time.strftime('%Y-%m-%d %H:%M:%S',time.localtime())
    '2014-07-03 09:19:40'
    >>> time.strftime('%Y-%m-%d %H:%M:%S',time.gmtime())
    '2014-07-03 01:19:49'

### ctime函数

    >>> time.ctime()
    'Thu Jul  3 08:54:54 2014'
    >>> time.ctime(0)
    'Thu Jan  1 07:00:00 1970'

和gmtime类似，不过返回的是字符串格式的时间。我们看到ctime默认设置的时间是根据localtime函数来的。

### strftime函数

接受那个特定格式的时间数组`struct_time`作为参数，然后返回一定字符串格式的时间。具体例子请参看前面的例子。

其中最常用的格式符有：

    %Y，多少年；%m，多少月；%d，多少日；
    %H，多少小时；%M，多少分；%S，多少秒。

`%X` 直接输出09:27:19这样的格式，也就是前面的多少小时多少分多少秒可以用一个%X表示即可。

还有一些，比如：%I表示多少小时，不过是\[0-12\]的形式；%y表示多少年，不过是\[00-99\]的格式，比如2014年就输出14；%p，本地的AM或PM文字。等等。

### sleep函数 

sleep函数有时需要用到，将程序休眠个几秒的意思。需要接受一个数值参数，单位是秒，可以是零点几秒。但sleep函数只是大概休眠几秒的意思，最好不去用来计时，因为它不大精确。

更多内容请参见[官方文档](https://docs.python.org/3/library/time.html)。

sys模块
-------

sys模块有一些功能很常用，其实在前面我们就看到过一些了。

### sys.argv

在刚开始说明python执行脚本参数传递的问题时就已经讲了sys.argv这个变量。这是一个由字符串组成的列表。

    import sys
    
    print(sys.argv)
    for i in range(len(sys.argv)):
        print(sys.argv[i])

比如新建上面的一个test.py文件，然后执行：

    python3 test.py test1 test2
    ['test.py', 'test1', 'test2']
    test.py
    test1
    test2

我们可以看到sys.argv\[0\]就是这个脚本的文件名，然后后面依次是各个参数。

### exit函数

这个我们在编写GUI程序的时候经常看到，在其他脚本程序中也很常用。如果不带参数的话那么直接退出程序，还可以带一个字符串参数，返回错误提示信息，或者带一个数字，这里的详细讨论略过。

    >>> import sys
    >>> sys.exit('出错了')
    出错了
    wanze@wanze-ubuntu:~$ 

### sys.platform

返回当前脚本执行的操作系统环境。

Linux 返回字符串值：linux；Windows返回win32；Mac OS X 返回darwin。

### sys.path

一连串字符串列表，是python脚本模块的搜索路径，所以我们自定义的python模块，只需要在sys.path这个列表上新加一个字符串路径即可。

### 标准输入输出错误输出文件

sys.stdin，sys.stdout，sys.stderr这三个文件对象对应的就是linux系统所谓的标准输入标准输出和错误输出文件流对象。

### sys.version

sys.version输出当前python的版本信息和编译环境的详细信息。

sys.version\_info\[0\]
返回当前python主版本的标识，比如python3就返回数字3。

### sys.maxsize

返回当前计算环境下整数(int)类型的最大值，32位系统是$2**31-1$。

    >>> 2**31-1
    2147483647
    >>> import sys
    >>> sys.maxsize
    2147483647

### sys.stdin.isatty()

测试输入流是不是终端。如果是终端，则返回True。

更多内容请参见[官方文档](https://docs.python.org/3/library/sys.html)。

subprocess模块
--------------

我想大家都注意到了现在的计算机都是多任务的，这种多任务的实现机制就是所谓的多个进程同时运行，因为计算机只有一个CPU（现在多核的越来越普及了。）所有计算机一次只能处理一个进程，而这种多进程的实现有点类似你人脑（当然不排除某些极个别现象），你不能一边看电影一边写作业，但是可以写一会作业然后再看一会电影（当然不推荐这么做），计算机的多进程实现机制也和这个类似，就是一会干这个进程，一会儿做那个进程。

计算机的一个进程里面还可以分为很多个线程，这个较为复杂，就不谈了。比如你编写的一个脚本程序，系统就会给它分配一个进程号之类的，然后cpu有时就会转过头来执行它一下（计算机各个进程之间的切换很快的，所以才会给我们一种多任务的错觉。）而你的脚本程序里面还可以再开出其他的子进程出来，
python的subprocess模块主要负责这方面的工作。

### call函数

    import subprocess
    
    # Command with shell expansion
    subprocess.call(["echo", "hello world"])
    subprocess.call(["echo", "$HOME"])
    subprocess.call('echo $HOME',shell=True)
    
    hello world
    $HOME
    /home/wanze

其中使用shell=True选项后用法较简单较直观，但网上提及安全性和兼容性可能有问题，他们推荐一般不适用shell=True这个选项。

如果不使用shell=True这个选项的，比如这里`$HOME`这个系统变量就无法正确翻译过来，如果实在需要home路径，需要使用os.path的expanduser函数。

### getoutput函数

取出某个进程命令的输出，返回的是字符串形式。

    import subprocess
    
    name=subprocess.getoutput('whoami')
    print(name)

### getstatusoutput函数

某个进程执行的状态。

### Popen类

根据Popen类创建一个进程管理实例，可以进行进程的沟通，暂停，关闭等等操作。前面的函数的实现是基于Popen类的，这是较高级的课题，这里暂时略过。

更多内容请参见[官方文档](https://docs.python.org/3/library/subprocess.html)。

shutil模块
----------

相当于os模块的补充，shutil模块进一步提供了一些系统级别的文件或文件夹的复制，删除，移动等等操作。

### 复制文件

    shutil.copyfile(src, dst)
    shutil.copy(src, dst)
    shutil.copy2(src, dst)

其中**copyfile**的src和dst两个参量都是完整文件路径名，第一个参量是待复制的文件，第二个参量是复制后的文件名；而**copy**函数的第一个参量是待复制的文件，但是第二个参量是目标文件夹路径；**copy2**函数和copy函数类似，不同的是它能尝试保留文件的所有元信息metadata（模块开头有说明是理论上但不尽然）。

### 复制文件夹

    shutil.copytree(src, dst)

**copytree**函数第一个参量是待复制的文件夹路径名，第二个参量是目标文件夹路径名，其将被创建不应该存在。

### 删除整个目录

    shutil.rmtree(path)

**rmtree**函数用于删除整个文件夹，path就是目标文件夹的路径名。

### 移动文件夹

    shutil.move(src,dst)

**move**函数把一个文件或者一个文件夹移动到一个文件夹内。

### chown函数

    shutil.chown(path, user=None, group=None)

**chown**函数类似的linux系统下的chown函数，这个函数基于os.chown函数，不过接口更友好。

### which函数

    shutil.which(cmd)

**which**函数类似的linux系统下的which函数。

更多shutil模块内容请参见[官方文档](https://docs.python.org/3.4/library/shutil.html)。

os模块
------

### getcwd函数

不管你在终端运行python还是运行某个python脚本，总有一个变量存储着当前工作目录的位置。你可以通过getcwd命令来查看当前工作目录。

    import os
    print(os.getcwd())

上面是通过LaTeX文件运行的python小脚本，当你以python命令来运行某个脚本的时候，你调用python命令的地方就是当前的工作目录。然后加载的其他模块的各个py文件运行时的当前工作目录和主py文件脚本的当前目录是一样的，都是你运行python命令的地方。

如果是终端调用python就是你终端的当前工作目录所在，你可以用pwd命令来查看。如下所示：

    =>pwd
    /home/wanze
    =>python3
    >>> import os
    >>> print(os.getcwd())
    /home/wanze

### mkdir函数

新建一个文件夹。

    os.mkdir(str)

### chdir函数

os模块里有一个chdir函数来更改当前工作目录所在地。

可以使用*.*和*..*语法，也可以使用简单的\"test\"调转到test文件夹。

    >>> os.chdir('/home/wanze/pymf')
    >>> print(os.getcwd())
    /home/wanze/pymf

### 删除文件

os.remove(path)

支持相对路径表达。如果路径是目录将会抛出一个OSError异常。

### os.rename

    os.rename(src, dst)

第一个参数是目标文件或目录，第二个参数是要替换成为的名字。这个命令一方面可以重命名文件，此外可以移动文件。

支持相对路径语法表达，rename在windows下不一定替换原文件，repalce一定替换文件。

### os.repalce

    os.replace(src, dst)

rename在windows下不一定替换原文件，repalce一定替换文件。

支持相对路径语法表达。

### 删除空目录

os.rmdir(path)

支持相对路径语法表达，只能删除空目录。如果要删除整个目录，请使用shutil.rmtree(path)。

### listdir命令

    os.listdir(path='.')

相当于简单的ls命令，将返回一个字符串列表，其内包含本path下所有的文件和文件夹名（包括链接文件）。

可以结合前面介绍的os.path模块的isfile等函数新建一个函数listdir\_file，listdir\_dir和listdir\_link，将普通文件，目录和链接文件区分开来。

    import os
    
    def listdir_dir(path='.'):
        '''os的listdir函数加强，只返回文件夹。'''
        return [dir for dir in os.listdir(path) if os.path.isdir(dir) ]
    def listdir_file(path='.'):
        '''os的listdir函数加强，只返回普通文件'''
        return [file for file in os.listdir(path) if os.path.isfile(file)
         and  not os.path.islink(file)]
    def listdir_link(path='.'):
        '''os的listdir函数加强，只返回链接文件'''
        return [link for link in os.listdir(path) if os.path.islink(link) ]

### 遍历目录树

    os.walk('.')

产生一个生成器对象，具体数值含义如下：（dirpath, dirnames,
filenames），其中dirpath和filenames可以合并出本目录下所有文件的具体文件名路径，而dirpath和dirnames可以合并出本目录下所有目录的具体路径名。

根据这个os.walk函数我写了一个`gen_file`
函数，其是一个生成器函数，会遍历目录树，并返回本目录下的文件信息。具体代码如下所示:

```python
def gen_file(startpath='.',filetype=""):
    '''利用os.walk 遍历某个目录，收集其内的文件，返回
    (文件路径列表, 本路径下的文件列表)
    比如:
    (['shortly'], ['shortly.py'])
(['shortly', 'templates'], ['shortly.py'])
(['shortly', 'static'], ['shortly.py'])

    第一个可选参数 startpath  默认值 '.'
    第二个参数  filetype  正则表达式模板 默认值是"" 其作用是只选择某些文件
    如果是空值，则所有的文件都将被选中。比如 "html$|pdf$" 将只选中 html和pdf文件。
    '''
    for root, dirs, files in os.walk(startpath):
        filelist = []
        for f in files:
            fileName,fileExt = os.path.splitext(f)
            if filetype:
                if re.search(filetype,fileExt):
                    filelist.append(f)
            else:
                filelist = files
        if filelist:#空文件夹不加入
            dirlist = root.split(os.path.sep)
            dirlist = dirlist[1:]
            if dirlist:
                yield (dirlist, filelist)
            else:
                yield (['.'], filelist)
```

这个函数可以帮助你管理本目录下（可以通过正则表达式过滤）你感兴趣的文件，都刷一边。然后继续必要的操作，比如查找等等之类的。

### environ函数

os.environ，返回一个字典值，这个字典值里面存储着当前shell的一些变量和值。比如系统中"HOME"所具体的路径名是：

    import os
    print(os.environ['HOME'])
    
    /home/wanze
    >>> 

### getpid函数

os.getpid函数，返回当前运行的进程的pid。

### stat函数

返回文件的一些信息。比如st\_size是文件的大小，单位是字节。

#### st\_size属性

    import os
    import glob
    
    print([os.path.abspath(f) for f in glob.glob('*.py')])
    
    print([f for f in glob.glob('*.py') if os.stat(f).st_size > 400])
    
    ['/home/wanze/桌面/test.py', '/home/wanze/桌面/flatten.py']
    ['flatten.py']

下面这个例子进行了文件大小输出单位的优化:

    import os
    import sys
    
    filename = sys.argv[1]
    filesize = os.stat(filename).st_size
    
    for unit in ['字节','KB','MB','GB','TB']:
        if filesize > 1024:
            filesize = filesize/1024
        else:
            break
    
    print(filename + '大小是' +str(int(filesize)) + unit)

这个python小脚本自动输出合适的单位，具体程序逻辑还是很简单的。

#### st\_mtime属性

最后文件修改的时间。

#### st\_ctime属性

最后文件创建的时间，在windows下是严格的最初文件创建时间，在unix下是最后文件metadata的改变时间。

### 给进程发送信号

可以通过os模块的kill函数来给某个进程发送某个信号。

    os.kill(pid, sig)

函数第一个参数是进程的pid，第二个参数是具体发送的信号。比如:

    os.kill(pid, signal.SIGSTOP)

就是暂停某个进程，然后

    os.kill(pid, signal.SIGCONT)

是继续某个进程。然后**killpg**函数能够对某个进程包括其子进程发送某个信号，参考了[这个网页](http://kernelcheck.blogspot.com/2009/07/pausestop-process-in-python.html)。

除此之外还有 **SIGINT** （正常终止进程信号）和 **SIGKILL**（强制终止进程信号）等等，更多信号请参看关于unix信号那块，比如[这个wiki页面](http://en.wikipedia.org/wiki/Unix_signal)。

更多os模块内容请参见[官方文档](https://docs.python.org/3.4/library/os.html)。



os.path模块
-----------

前面提到sys.argv只能返回当前python脚本的文件名，而我们常常需要这个python脚本在系统中的具体位置。前面如os.getcwd等也能获得当前python脚本的所在目录，不过os.path模块的一个优点就是跨平台特性支持很好，也就是一般我们通过其他方式获得的path路径都会用这个模块的函数辅助处理一下。

我们来看下面的例子：

    import os
    
    print(os.path.abspath(__file__))
    print(os.path.dirname(os.path.abspath(__file__)))
    
    print(os.path.basename(__file__))
    print(os.path.basename(os.environ['HOME']))
    
    /home/wanze/桌面/test.py
    /home/wanze/桌面
    test.py
    wanze

其中`__file__`表示当前脚本文件所在的路径。

### abspath函数

abspath函数接受一个path路径值然后返回一个正规的普适的路径地址。具体效果类似于执行了:
`normpath(join(os.getcwd(), path))` 。

再看下面的例子演示了空字符串默认当前工作目录，然后也接受绝对路径等。

    >>> import os
    >>> os.path.abspath('')
    '/home/wanze'
    >>> os.path.abspath('test')
    '/home/wanze/test'
    >>> os.path.abspath('/test')
    '/test'
    >>> os.path.abspath('test/')
    '/home/wanze/test'

我们看到如果abspath接收的是空字符串，其定位是当前脚本的工作目录，那么是引用的模块里面的`os.path.abspath('')`，具体对应的也是当前脚本的工作目录。然后os.path.abspath(\".\")返回的是当前脚本工作目录。

### dirname函数

dirname函数接受一个路径值然后返回这个路径除开最后一个元素的前面的路径值。比如上面的例子，路径指向文件，那么dirname函数返回的是除开这个文件名的前面的路径；而如果接受的路径指向目录，那么返回的是除开最后一个文件夹名的前面的路径值。

### basename函数

如上面例子所示，basename函数接受一个路径值然后返回路径的最后一个元素，如果路径指向文件，那么返回的是文件名；如果路径指向目录，那么返回的是最后那个目录的文件夹名。比如下面实现了从绝对路径提取出文件名的功能。

    >>> import os.path
    >>> string = '/home/wanze/test.txt'
    >>> fileName,fileExtension = os.path.splitext(os.path.basename(string))
    >>> fileName
    'test'

### split函数

将路径path字符串分割，可以视作dirname和basename的组合。

    >>> os.path.split('/usr/local/bin/test.txt')
    ('/usr/local/bin', 'test.txt')
    >>> os.path.dirname('/usr/local/bin/test.txt')
    '/usr/local/bin'
    >>> os.path.basename('/usr/local/bin/test.txt')
    'test.txt'

### splitext函数

将某个路径path的后缀分开，这里主要是针对文件名为输入的时候，那么第一个为该文件的名字，输出数组的第二个值是该文件的后缀。这个函数在提取文件名后缀和前面的名字的时候很有用，方便组合出新的文件名。

    >>> import os
    >>> fileName, fileExtension = os.path.splitext('/path/to/somefile.ext')
    >>> fileName
    '/path/to/somefile'
    >>> fileExtension
    '.ext'

### join函数

用于连接多个路径值合并成一个新的路径值，同样相对于简单的字符串拼接，用这个函数处理路径组合具有操作系统普适性和灵活性。

    >>> os.path.join(os.path.expanduser('~'),'test','lib')
    '/home/wanze/test/lib'

上面join函数多个参数生成的新path在windows下又是不同的输出的。

### expanduser函数

    >>> import os
    >>> os.path.expanduser('~')
    '/home/wanze'
    >>> os.path.expanduser('~/pymf')
    '/home/wanze/pymf'
    >>> os.path.join(os.path.expanduser('~'),'pymf','mymodule')
    '/home/wanze/pymf/mymodule'

`~`这个符号可以在这里使用，从而展开为以/home/wanze为基础的绝对路径，兼容大部分系统（在windows下也可以使用。）

同时我们看到join函数可以接受很多不定量的参数，然后将他们组合成为一个新的路径，而且不用你费心是`/`还是`\`，你不需要写这些了，用join函数自然料理好一切。

### exists函数

os.path.exists(path)：测试路径或文件等是否存在。如果存在返回True，否则返回False。

### isfile和isdir还有islink

os.path.isfile(path)：接受一个字符串路径变量，如果是文件那么返回True，否则返回False（也就是文件不存在或者不是文件是文件夹等情况都会返回False）。

类似的有isdir和islink函数。

### samefile函数

`os.path.samefile(path1,path2)`

如果两个文件或路径相同则返回True，否则返回False。

### getmtime函数

`os.path.getmtime(path)`

返回文件的最后修改时间，返回值是多少多少秒，可用time模块的ctime或localtime函数将其转换成 `time.struct_time` 对象，然后使用strftime来进行更好的格式输出。

### getctime函数

类似getmtime，返回文件的最后创建时间。在unix系统中是指最后文件的元信息更改的时间。

更多内容请参见[官方文档](https://docs.python.org/3/library/os.path.html)。






shelve模块
----------

shelve模块是基于pickle模块的，也就是只有pickle模块支持的对象它才支持。之前提及pickle模块只能针对一个对象，如果你有多个对象要处理，可以考虑使用shelve模块，而shelve模块就好像是自动将这些对象用字典的形式包装起来了。除此之外shelve模块的使用更加简便了。

### 存入多个对象

    import shelve
    from Hero import Garen
    
    if __name__ == '__main__':
        garen1=Garen()
        garen2=Garen('red')
        garen3=Garen('yellow')
        db=shelve.open('test.db')
        for (key,item) in [('garen1',garen1),('garen2',garen2),('garen3',garen3)]:
            db[key]=item
        db.close()

我们看到整个过程的代码变得非常的简洁了，然后一个个对象是以字典的形式存入进去的。

### 读取这些对象

读取这些对象的代码也很简洁，就是用shelve模块的open函数打开数据库文件，open函数会自动返回一个字典对象，这个字典对象里面的数据就对应着之前存入的键值和对象。

同时通过这个例子我发现，如果自己定义的类，将他们提取出来放入另外一个文件，那么shelve模块读取文件时候是不需要再引入之前的定义。这一点值得我们注意，因为shelve模块内部也采用的是pickle的机制，所以可以猜测之前pickle的那个例子类的定义写在写入文件代码的里面，所以不能载入数据库；而如果将这些类的定义放入一个文件，然后这些类以模块或说模块载入的形式引入，那么读取这些对象就可以以一种更优雅的形式实现。如下所示：

    import shelve
    
    if __name__ == '__main__':
        db=shelve.open('test.db')
        for key in sorted(db):
            print(db[key])
        db.close()

我们看到就作为简单的程序或者原型程序的数据库，shelve模块已经很好用而且够用了。

更多内容请参见[官方文档](https://docs.python.org/3/library/shelve.html)。



pickle模块
----------

pickle模块可以将某复杂的对象永久存入文件中，以后再导入这个文件，这样自动将这个复杂的对象导入进来了。

### 将对象存入文件

    import pickle
    
    class Test:
        def __init__(self):
            self.a=0
            self.b=0
            self.c=1
            self.d=1
    
        def __str__(self):
            return str(self.__dict__)
    
    if __name__ == '__main__':
        test001=Test()
        print(test001)
        testfile=open('data.pkl','wb')
        pickle.dump(test001,testfile)
        testfile.close()

### 从文件中取出对象

值得一提的是从文件中取出对象，原来的类的定义还是必须存在，也就是声明一次在内存中的，否则会出错。

    import pickle
    
    class Test:
        def __init__(self):
            self.a=0
            self.b=0
            self.c=1
            self.d=1
    
        def __str__(self):
            return str(self.__dict__)
    
    if __name__ == '__main__':
        testfile=open('data.pkl','rb')
        test001=pickle.load(testfile)
        print(test001)
        testfile.close()

pickle模块的基本使用就是用dump函数将某个对象存入某个文件中，然后这个文件以后可以用load函数来加载，然后之前的那个对象会自动返回出来。

更多内容请参见[官方文档](https://docs.python.org/3/library/pickle.html)。



pathlib模块
-----------

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





logging模块
-----------

在软件开发中，两个东西最易被初学者忽视，但实际上却是最有用的工具:
一个是单元测试；一个是日志输出管理。python的官方内置模块logging可以帮助你更好地管理自己的日志汇报系统。一个好的日志汇报系统不仅能够帮助程序员调试debug，用户向专业人员汇报发生错误时候的信息，还可以帮助人们理解程序具体是如何运行的和运行到了那里，在干些什么，这些都是非常有用的。

### 什么时候使用logging

有的时候一些简单的函数调试就可以使用print函数来进行一些输出信息，这在编程早期还是有用的。而后续不管是调试还是编程都推荐使用单元测试的方法。而在大型软件项目中，print函数则是更应该少出现，只有那些程序员希望用户看到的信息才能使用print函数（当然某些经过io重定向的print函数不在这里的讨论范围之内）。

程序员有时想要看看某个大型软件内部具体是如何运作的，丑陋的做法是print，然后注释掉。这样也不是不可以，只是最好程序员做的一切工作都能保存起来拿到台面上，毕竟这都是劳动。logging模块的第一个用途就出来了:
我们可以使用 `logging.info()`
这个函数，来输出某些信息，这些信息只有在你调低了logging等级之后（默认的是
**WARNING** ），才会显示出来。低于 **WARNING** 等级的还有一个函数
`logging.debug()`
。info函数的信息通常是程序员用来确认程序是按照预期运行的，debug函数的信息通常是出现某个bug了，程序员希望有助于他debug的输出信息。

`logging.warn()`
函数用来发出警告信息，并且程序员应该修改程序来避免这个信息出现；
`logging.warning`
函数用来发出警告信息，这种情况程序员表示在我的预料之中，是用户不应该这样做，程序不需要修改，但信息应该被记录。

然后特别重大的错误或异常捕捉，这个使用python的 `try... except...`
语句，或者raise抛出异常，这自不必多说。只是有某些情况，程序员不愿抛出这个异常，而是希望压抑这个错误，则可以使用logging模块的
`error()` 函数或者 `exception()` 函数或者 `critical()` 函数。

具体这些函数的严重等级是:

最简单的一个使用例子如下所示:

    import logging
    
    logging.basicConfig(level=logging.DEBUG)
    
    logging.debug('debug')
    logging.info('info')
    logging.warning('warning')

这里的basicConfig函数对整个日志系统进行一些配置。比如这里设置日志报告等级
`level=logging.DEBUG` ，这样我们将会看到 **DEBUG** 以及 **DEBUG**
以上等级的日志信息；然后如果设置为 `logging.INFO` ，则就只看到 **INFO**
和 **INFO** 以上等级的信息了。

### 将日志信息输出到文件

更专业的做法是将日志输出到文件中去，即使是自己调试，对于大型软件项目来说，日志信息是很多的，将其保存到文件，然后用编辑器或者shell工具或者其他工具查看会更便捷一些。要将这些日志信息都输出到某个文件中很简单，在
**basicConfig** 设置 `filename` 参数即可:

    import logging
    
    logging.basicConfig(filename='test.log', level=logging.DEBUG)
    
    logging.debug('debug')
    logging.info('info')
    logging.warning('warning')

默认的 **filemode** 是 \"a\"
，也就是日志信息一直累积在那里。你可以多运行几次这个小py脚本，来看看具体的效果。
**filemode** 也可以设置为 \"w\" ，则只保存最后那次运行的日志信息。

### logging模块中级教程

logging模块的中级使用需要了解如下几个词汇：loggers, handlers, filters,
and formatters。

#### loggers

**记录器**
之前我们运行logging.info，就是调用的默认的记录器，然后一般我们会针对每个python的模块文件创建一个记录器。

    logger = logging.getLogger(__name__)

这个 `__name__`
只是一种简便的命名方法，如果你勤快或者某种情况下有需要的话完全可以自己手工给记录器取个名字。

然后这个 `getLogger`
函数如果你后面指定的名字之前已经定义了（这通常是指在其他第三方模块下定义了），那么你通过这个
`getLogger`
然后指定目标名字就会得到对应的该记录器。这通常对于DIY某个第三方模块的日志记录器有用。

记录器可以挂载或者卸载某个处理器对象或过滤器对象：

-   logger.addHandler()

-   logger.removeHandler()

-   logger.addFilter()

-   logger.removeFilter()

记录器通过 `setLevel()`
方法来设置最小记录级别，这个和后面的Handler级别是协作关系。

记录器的propagate参数这里值得详细说下，记录器的名字自己定义也好，还是用
`__name__`
这样python自带的模块结构语法也好，其有个上层和下层的关系，比如说
`main.test` 这个记录器是属于 `main` 这个记录器的。而这里讨论的
`propagate` 参数，默认是True，也就是发送给 `main.test`
记录器的信息也会传递给其上层 `main`
记录器上去。如果设置为False则不会往上传递了。

#### handlers

**处理器**负责分发日志信息到目标地去。这里主要介绍这几个Handler类：

StreamHandler

:   将信息以流的形式输出，这通常指输出到终端

FileHandler

:   将信息写入到某个文件中去

RotatingFileHandler

:   将信息写入某个文件，如果文件大小超过某个值，则另外新建一个文件继续写。

TimeRotatingFileHandler

:   将信息写入某个文件，每隔一段时间，比如说一天，就会自动再新建一个文件再往里面写。

处理器对象也有 `setLevel` 方法，这个前面也提及了，和记录器的 `setLevel`
是协作关系，更详细的描述是，信息先记录器处理并分发给对应的处理器对象，然后再处理器处理再分发到目的地。

处理器可以挂载 **格式器** 对象和 **过滤器** 对象。

-   handler.setFormatter()

-   handler.addFilter()

-   handler.removeFilter()

#### filters

**过滤器**

#### formatters

**格式器**，具体信息的格式定义。

这里的format涉及到的一些参数设置如下所示:

    -   %(levelname)s 类似'DEBUG'这样的logging level
    -   %(message)s 具体输出的信息
    -   %(asctime)s 具体时间，默认是'2003-07-08 16:49:45,896'，你可以通过 **datefmt** 选项来进一步设置格式，格式设置和strftime命令类似。
    -   %(filename)s 文件名，更简洁的表达是模块名。
    -   %(module)s 模块名
    -   %(funcName)s 函数名
    -   %(lineno)d 具体logging代码在第几行
    
    -   %(name)s logger的名字，默认是'root'。
    -   %(process)d 进程号
    -   %(processName)s 进程名
    -   %(thread)d 线程号
    -   %(threadName)s 线程名

### 字典统一配置

django的setting.py就会有这样的配置，具体含义还是很明显的，就是定义处理器，格式器，记录器等。

    LOGGING = {
        'version': 1,
        'disable_existing_loggers': False,
        'formatters': {
            'simple': {
                'format': "%(asctime)s %(name)s [%(levelname)s] %(thread)d %(module)s %(funcName)s %(lineno)s: %(message)s"
            }
        },
        'handlers': {
            'log_file': {
                'class': 'sdsom.common.log.DedupeRotatingAndTimedRotatingFileHandler',
                'filename': config.get('web', 'log_path'),
                'when': 'midnight',
                'maxBytes': int(config.get('web', 'log_max_bytes')),
                'interval': 1,
                'backupDay': int(config.get('web', 'log_backup_days')),
                'dedupetime': int(config.get('web', 'log_dedupe_time')),
                'formatter': 'simple'
            },
        },
        'loggers': {
            'django.request': {
                'handlers': ['log_file'],
                'level': config.get('web', 'log_level'),
                'propagate': True,
            },
        }
    }




json模块
--------

### 什么是json

json全称是JavaScript Object Notation，也就是JavaScript对象表示法。json是一种基于文本的，人类易读的数据存储交互格式。json文件保存使用后缀 `.json` 。虽然json是从javascript语言衍生出来，不过其作为数据存储和交互是独立于语言的。json和xml作为数据存储和交互方案相比有更易读和读写速度更快的特点。

### json存储格式语法

json存储格式的语法很简单，首先是最基本的数字开始，其支持两种数字类型，整数型和浮点型，其对应于python的int和float；字符串在双引号里面，其对应于python的字符串概念；布尔值true和false，其对应于python的True和False，然后还有一个null对应于python的None；json数据用`[]`表示，里面的元素用逗号分隔，其对应的正是python的列表概念；然后json的object对象用`{}` 包围，其内是key:value这样的形式，其正对应于python的字典概念。

python语言已经内置了json模块，所以要读写json文件只需要简单 `import json`即可。

首先让我们小试牛刀，把 `[1,2,3,4,5]` 这组数存( **dump**)进test.json文件里面去。

```python
import json
lst = [1,2,3,4,5]

with open('test.json',mode='w',encoding='utf-8') as f:
    json.dump(lst,f)
```

json不支持元组(tuple)和字节(bytes)类型，bytes类型一般不会去惊扰它，如果有tuple元组你需要存储，那么将其转换成列表即可。

简单的读取是使用的json的 `load` 函数，如下所示：

```python
with open('test.json', mode='r', encoding='utf-8') as f:
    lst2 = json.load(f)
```

这样lst2就被赋值  `[1,2,3,4,5]` 了，方便后面的运算。

### 存储字典值

上面的例子稍作修改即可以存储字典值了：

```python
import json
dict01 = {'a':1,'b':2,'c':[1,2,3]}

with open('test.json', mode='w', encoding='utf-8') as f:
    json.dump(dict01,f)

with open('test.json', mode='r', encoding='utf-8') as f:
    dict02 = json.load(f)

print(dict02)
```



### 存储到文件的一些美化

上面的dump函数那句读者可以考虑加入 `indent` 选项：

```python
json.dump(dict01,f,indent=4)
```

这样我们的test.json文件里面的数据会进行一些缩进，会更好看一些了。

此外 `sort_keys`选项有时会很有用，默认是False，如果设置为True，则输出的文件的key是排序了的 。

此外 `ensure_ascii` 选项默认是True，中文字符保存会变为 `\uabcd` 之类的东西，如果设置为False，则能显示正常的中文字符。

### dumps和loads函数

dumps和loads函数是非文件接口版，简单了解下即可。



itertools模块 
-------------

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





inspect模块
-----------

更多信息请参看 [官方文档](https://docs.python.org/3.4/library/inspect.html) 。

### getfile函数

传入python object，返回定义该object具体是在那个文件中的。可以如下获取该文件的系统绝对路径地址:

    os.path.abspath(inspect.getfile(func))

值得一提的是，如果该模块被安装进入系统了，那么实际该文件的地址应该是类似这样的形式:

    /usr/local/lib/python3.4/dist-packages/infome-15.10.30-py3.4.egg/infome/web/youdao.py



### getcallargs函数

如下所示:

    params = inspect.getcallargs(func,*args,**kargs)

相当于模拟执行了func函数，然后返回如果执行func函数时其接受的参数字典值（包括必填参数和可选参数）。





functools模块
-------------

### partial类

functools模块定义了一个partial类，其输入参数如下所示:

        functools.partial(func, *args, **keywords)

其将返回一个partial对象，其有 `__call__`
方法，也就是其可以类似函数进行调用。然后其有 **func**
属性，作为未来函数的调用； **args** 属性，作为未来函数的参数；
**keywords** 属性，作为未来函数的可选参数。
简单来说就是partial对原函数对象func进行了封装（所以其特别适合做装饰器），
`newfun=partial(func,args,keywords)`
，使得调用这个newfun对象就好像调用原func一样，只是加上了额外的参数，其中args非可选参数是类似列表append形式，而keywords可选参数或说关键字参数是类似字典update形式。

下面是一个简单的演示例子:

    import functools
    
    def fun1(a,b=2):
        print('called fun1 with',a,b)
    
    def show_details(name,f,is_partial=False):
        print(name)
        print(f)
        if is_partial:
            print(f.func)
            print(f.args)
            print(f.keywords)
        else:
            print(f.__name__)
    
    show_details('fun1',fun1)
    
    fun1('fun1 a')
    
    p1 = functools.partial(fun1,'p1 a',b=99)
    show_details('p1',p1,True)
    
    p1()

其输出如下:

        fun1
        <function fun1 at 0xb705880c>
        fun1
        called fun1 with fun1 a 2
        p1
        functools.partial(<function fun1 at 0xb705880c>, 'p1 a', b=99)
        <function fun1 at 0xb705880c>
        ('p1 a',)
        {'b': 99}
        called fun1 with p1 a 99

这里的逻辑是首先正常执行fun1，然后将fun用partial封装成p1，新增参数字符串'p1
a'和b=4，后面我们可以看到这个p1的参数都加进去了。然后执行这个p1我们看到了参数的变化。



datetime模块
------------

简单的日期时间操作用time模块里面的一些函数即可，datetime模块是用类的方式来处理的，适合大量处理日期时间的任务。然后值得一提的是mongodb的python接口 `pymongo` 里面（连接mongodb的python第三方模块），日期时间的输入输出都是datetime 对象的，这很是方便。

下面简要介绍之，更多内容请参看 [官方文档](https://docs.python.org/3.4/library/datetime.html) 。

### timedelta对象

通过timedelta函数返回一个timedelta对象，也就是一个表示时间间隔的对象。函数参数情况如下所示:

    class datetime.timedelta([days[, seconds[, microseconds[, milliseconds[, minutes[, hours[, weeks]]]]]]])

其没有必填参数，简单控制的话第一个整数就是多少天的间隔的意思:

    datetime.timedelta(10)

两个时间间隔对象可以彼此之间相加或相减，返回的仍是一个时间间隔对象。而更方便的是一个datetime对象如果减去一个时间间隔对象，那么返回的对应减去之后的datetime对象，然后两个datetime对象如果相减返回的是一个时间间隔对象。这很是方便。

### datetime对象

通过datetime函数可以创建一个datetime对象:

    class datetime.datetime(year, month, day[, hour[, minute[, second[, microsecond[, tzinfo]]]]])

其中year，month和day是必填参数。下面是一个简单的例子:

    >>> db_t = {
    ...  "date": datetime.datetime(1777,07,07)
    ... }
    >>> db_t
    {'date': datetime.datetime(1777, 7, 7, 0, 0)}

其通过pymongo存入mongodb之后是这样的形式:

    ISODate("1777-07-07T00:00:00.000Z")

#### now和utcnow方法

datetime对象有 `now` 和 `utcnow`
这两个*类方法*（classmethod）来返回当前日期时间的datetime对象。utcnow不可以接受参数，now方法可以接受一个tz指定时区的参数，我们可以通过
*pytz* 模块（一个处理时区推荐的第三方模块）来具体指明某个时区。

##### 查看pytz的所有时区

参看[这个网页](http://stackoverflow.com/questions/13866926/python-pytz-list-of-timezones)。

    >>> pytz.all_timezones
    ['Africa/Abidjan', 'Africa/Accra', 'Africa/Addis_Ababa', 'Africa/Algiers', ......

##### 具体给now方法指定一个时区

参看[这个网页](http://stackoverflow.com/questions/2331592/datetime-datetime-utcnow-why-no-tzinfo)。

    import pytz
    datetime.datetime.now(tz = pytz.timezone("Asia/Hong_Kong"))

##### now方法和utcnow方法区别

我们看下面这个例子:

    >>> datetime.now(tz = pytz.timezone("UTC")),datetime.utcnow()
    (datetime.datetime(2015, 7, 11, 9, 25, 20, 266863, tzinfo=<UTC>), datetime.datetime(2015, 7, 11, 9, 25, 20, 266888))

如果我们给now方法指定默认的时区是\"UTC\"，那么我们看到其返回的datetime对象和utcnow返回的datetime对象基本上没什么区别，后面的微秒（$10^{-6}$秒）有点区别完全可以理解。然后我们再看now方法如果不加任何参数会如何:

    >>> now
    datetime.datetime(2015, 7, 11, 16, 34, 43, 144018)
    >>> utcnow
    datetime.datetime(2015, 7, 11, 8, 34, 56, 319108)

这里now显示的时间和本地的时间是一致的，说明now默认的时区是本地的时区参数。谈到这里大家应该就明白了，如果是后台数据库有日期时间输入需求，为了保持时间戳的一致性，推荐都使用utcnow方法来生成时间戳，也就是实际上都以UTC格林威治时区为准。如果到前端需要显示给用户具体的日期时间了，如果要引用前端数据库的日期时间，才需要引入时区的考虑进行必要的转换。然后如果前端需要用python生成实时的时间，那么就用now方法再引入pytz的时区控制。

#### datetime对象的属性

    >>> from datetime import datetime
    >>> d = datetime.now()
    >>> d.year
    2015
    >>> d.month
    11
    >>> d.day
    3
    >>> d.hour
    18
    >>> d.minute
    42
    >>> d.second
    57
    >>> d.tzinfo
    >>> d
    datetime.datetime(2015, 11, 3, 18, 42, 57, 919613)

具体含义如下所示:

year

:   年

month

:   月

day

:   日

hour

:   时

minute

:   分

second

:   秒

microsecond

:   微秒

#### strftime方法

datetime对象可以如下调用 `strftime` 方法或者 `__format__`
方法来得到一个好看的你想要的日期时间字符串格式:

        >>> from datetime import datetime
        >>> d = datetime.now()
        >>> d.strftime('%T')
        '18:52:39'
        >>> d.__format__('%F')
        '2015-11-03'

这里的格式符号python官方文档有所述及，而更实际上是和linux系统下的 `date`
命令的格式符一致的，读者可以用 `date --help`
来看一下，就可以看到如下信息:

        %%      一个文字的 %
        %a      当前locale 的星期名缩写(例如： 日，代表星期日)
        %A      当前locale 的星期名全称 (如：星期日)
        %b      当前locale 的月名缩写 (如：一，代表一月)
        %B      当前locale 的月名全称 (如：一月)
        %c      当前locale 的日期和时间 (如：2005年3月3日 星期四 23:05:25)
        %C      世纪；比如 %Y，通常为省略当前年份的后两位数字(例如：20)
        %d      按月计的日期(例如：01)
        %D      按月计的日期；等于%m/%d/%y
        %e      按月计的日期，添加空格，等于%_d
        %F      完整日期格式，等价于 %Y-%m-%d
        %g      ISO-8601 格式年份的最后两位 (参见%G)
        %G      ISO-8601 格式年份 (参见%V)，一般只和 %V 结合使用
        %h      等于%b
        %H      小时(00-23)
        %I      小时(00-12)
        %j      按年计的日期(001-366)
        %k   hour, space padded ( 0..23); same as %_H
        %l   hour, space padded ( 1..12); same as %_I
        %m   month (01..12)
        %M   minute (00..59)
        %n      换行
        %N      纳秒(000000000-999999999)
        %p      当前locale 下的"上午"或者"下午"，未知时输出为空
        %P      与%p 类似，但是输出小写字母
        %r      当前locale 下的 12 小时时钟时间 (如：11:11:04 下午)
        %R      24 小时时间的时和分，等价于 %H:%M
        %s      自UTC 时间 1970-01-01 00:00:00 以来所经过的秒数
        %S      秒(00-60)
        %t      输出制表符 Tab
        %T      时间，等于%H:%M:%S
        %u      星期，1 代表星期一
        %U      一年中的第几周，以周日为每星期第一天(00-53)
        %V      ISO-8601 格式规范下的一年中第几周，以周一为每星期第一天(01-53)
        %w      一星期中的第几日(0-6)，0 代表周一
        %W      一年中的第几周，以周一为每星期第一天(00-53)
        %x      当前locale 下的日期描述 (如：12/31/99)
        %X      当前locale 下的时间描述 (如：23:13:48)
        %y      年份最后两位数位 (00-99)
        %Y      年份
        %z +hhmm                数字时区(例如，-0400)
        %:z +hh:mm              数字时区(例如，-04:00)
        %::z +hh:mm:ss  数字时区(例如，-04:00:00)
        %:::z                   数字时区带有必要的精度 (例如，-04，+05:30)
        %Z                      按字母表排序的时区缩写 (例如，EDT)

其中的 `%F` 和 `%T` 在python官方文档中并无说明，可见其内部API是和这个
`date` 命令一致的。

#### 支持的时间间隔运算

前面提到了一个datetime对象减去一个timedelta对象返回一个datetime对象，然后一个datetime对象减去一个datetime对象返回一个时间间隔对象。比如此时之前一年的时间可以这样表达
`datetime.datetime.utcnow() - datetime.timedelta(365)`
。然后此时和爱因斯坦的生日时间间隔可以这样表达:

    datetime.datetime.utcnow() - datetime.datetime(1879,03,14)

然后我们可以利用这个时间间隔来进行一些操作和判断。

        >>> delta = datetime.datetime.utcnow() - datetime.datetime(1879,03,14)
        >>> delta
        datetime.timedelta(49792, 35970, 903285)
        >>> delta > datetime.timedelta(120*365)
        True
        >>> delta.days // 365
        136

### struct\_time 对象转化成为 datetime 对象

参看[这个网页](http://stackoverflow.com/questions/1697815/how-do-you-convert-a-python-time-struct-time-object-into-a-datetime-object)

    from time import mktime

mktime函数接受time模块的 `struct_time` object，其可以来自time模块的
`gmtime` 、`localtime` 、 `strptime`
这些函数，mktime函数将返回一个时间戳，然后用datetime模块的
`fromtimestamp` 函数可以接受这个时间戳。

总的过程即:

    from time import mktime
    from datetime import datetime
        
    dt = datetime.fromtimestamp(mktime(struct))

### datetime 对象转化为 time\_struct 对象

参考了 [这个网页](http://stackoverflow.com/questions/8022161/python-converting-from-datetime-datetime-to-time-time)

    >>> t = datetime.datetime.now()
    >>> t
    datetime.datetime(2011, 11, 5, 11, 26, 15, 37496)
    
    >>> time.mktime(t.timetuple()) + t.microsecond / 1E6
    1320517575.037496




re模块 
------

re模块提供了python对于正则表达式的支持，对于字符串操作，如果之前在介绍字符串类型的一些方法（比如split，replace等等），能够用它们解决问题就用它们，因为更快更简单。实在需要动用正则表达式理念才考虑使用re模块，而且你要克制写很多或者很复杂的（除非某些特殊情况）正则表达式的冲动，因为正则表达式的引入将会使得整个程序都更加难懂和不可捉摸。

更多内容请参见[官方文档](https://docs.python.org/3/library/re.html)。

### re模块中的元字符集

`.`

:   表示一行内的任意字符，如果如果通过re.compile指定**re.DOTALL**，则表示多行内的任意字符，即包括了换行符。此外还可以通过字符串模板在它的前面加上**(?s)**来获得同样的效果。

`*`

:   对之前的字符匹配或者多次。

`+`

:   对之前的字符匹配或者多次。

`?`

:   对之前的字符匹配或者。

`{m}`

:   对之前的字符匹配()m次。

`{m,n}`

:   对之前的字符匹配m次到n次，其中n次可能省略，视作默认值是无穷大。

`^`

:   表示字符串的开始，如果加上**re.MULTILINE**选项，则表示行首。此外字符串模板加上**(?m)**可以获得同样的效果。

`$`

:   表示字符串的结束，同`^`类似，如果加上**re.MULTILINE**选项，则表示行尾，可以简单理解为`\n`换行符。此外字符串模板加上**(?m)**可以获得同样的效果。`$`符号在re.sub函数中可以被替换为另外一个字符串，其具体效果就是原字符串尾加上了这个字符串，类似的`^`被替换成某个字符串，其具体效果就是原字符串头加上了这个字符串。这里显然`^`和`$`在字符串中都不是真实存在的字符，而没有这个所谓的标记，所以这种替换总给人怪怪的感觉。

`[]`

:   \[abc\]字符组匹配一个字符，这个字符是a或者b或者c。类似的\[a-z\]匹配所有的小写字母，`[\w]`匹配任意的字母或数字，具体请看下面的特殊字符类。

`|`

:   相当于正则表达式内的匹配或逻辑。

`()`

:   圆括号包围的部分将会记忆起来，方便后面调用。这个后面在谈及。

### re模块中的特殊字符类

    \w  任意的字母或数字  [a-zA-Z0-9_]  (meaning word)
    \W  匹配任何非字母非数字 [^a-zA-Z0-9_]
    \d   [0-9]   (digit) 数字
    \D  [^0-9] 非数字
    \s   匹配任何空白字符   [ \t\n\r\f\v] 。
    \S  匹配任何非空白字符
    匹配中文:[\u4e00-\u9fa5]
    \b  文档说严格的定义是\w 和\W 之间的边界，反之亦然。粗略的理解可以看作是英文单词头或者尾。

其中`^`在方括号\[\]里面，只有在最前面，才表示排除型字符组的意思。

### 转义问题

正则表达式的转义问题有时会比较纠结。一个简单的原则是以上谈及的有特殊作用的字符有转义问题，如果python中的字符都写成`r''`这种形式，也就是所谓的raw string形式，这样`\n`在里面就可以直接写成`\n`，而`\section`可以简单写为`\\section`即可，也就是`\`字符需要转义一次。

然后字符组的方括号内\[\]有些字符有时是不需要转义的，这个实在不确定就转义吧，要不就用正则表达式工具测试一下。

### re模块的使用

compile方法生成regular expression object这一条线这里略过了，接下来的讨论全部基于（原始的）字符串模板。

字符串模板前面提及`(?m)`和`(?s)`的用法了，然后`**(?i)**`表示忽略大小写。

#### 匹配和查找

search，match方法简单地用法就是：

    re.search(字符串模板, 待匹配字符串)
    re.match(pattern, string)

它们将会返回一个match object或者none，其中match
object在逻辑上就是真值的意思。match对字符串的匹配是必须从一开始就精确匹配，这对于正则表达式多少0有点突兀。推荐使用search方法，如果一定要限定行首，或者字符串开始可以用前面讨论的正则表达式各个符号来表达。请看下面的例子。

    import re
    string = '''this is test line.
    this is the second line.
    today is sunday.'''
    
    match = re.search('(?m)^today',string)
    
    if match:
        print('所使用的正则表达式是：',match.re)
        print('所输入的字符串是：',match.string)
        print('匹配的结果是：',match.group(0))
        print('匹配的字符串index',match.span())
    else:
        print('return the none value')

前面说道圆括号的部分将会记忆起来，作为匹配的结果，默认整个正则表达式所匹配的全部是group中的第0个元素，然后从左到右，子group编号依次是1，2，3\...\...。

    所使用的正则表达式是： re.compile('(?m)^today', re.MULTILINE)
    所输入的字符串是： this is test line.
    this is the second line.
    today is sunday.
    匹配的结果是： today
    匹配的字符串index (44, 49)

具体这些信息是为了说明情况，实际最简单的情况可能就需要判断一下是不是真值，字符串模板是不是匹配到了即可。

#### 分割操作

re模块的split函数可以看作字符串的split方法的升级版本，对于所描述的任何正则表达式，匹配成功之后都将成为一个分隔符，从而将原输入字符串分割开来。

请参看下面的例子并理解其做了什么工作。

    import re
    
    def zwc(string):
        #中英文常用标点符号
        lst = re.split('([\u4e00-\u9fa5\s，。；])',string)
        #去除 空白
        #去除\s 中英文常用标点符号
        lst = [i for i in lst if not  i in
        [""," ","\n","\t","\r","\f","\v","；","，","。"]]
        print(lst)
    
    if __name__ == '__main__':
        string='''道可道，非常道。名可名，非常名。無名天地之始，有名萬物之母。
        故常無欲，以觀其妙；常有欲，以觀其徼。此兩者同出而異名，
        同謂之玄，玄之又玄，眾妙之門。 '''
        zwc(string)



#### 替换操作

基于正则表达式的替换操作非常的有用，其实前面的search方法，再加上具体匹配字符串的索引值，然后修改原字符串，然后再search这样循环操作下去，就是一个替换操作了。re模块有sub方法来专门解决这个问题。

#### 非最长匹配

本小节参考了 python cookbook 的 2.7 小节，比如说：

    re.compile(r'"(.*)"')

这将匹配两个双引号之间的内容，其默认是最长匹配，也就是多个双引号组成的句子都会匹配进去，你可以如下要要求最短匹配：

    re.compile(r'"(.*?)"')

#### 非捕获组

看下面的正则表达式， `(?:...)` 这个括号的组是非捕获组，也就是不会进入
.group 里面去。

    re.search(r'((?:.|\n)*)',text2)

然后默认 `.` 是不会匹配换行符号的，如果要引入换行符则要如上所示加上。



argparse模块
------------

下面简要介绍了python3的官方文档argparse模块的用法，用于快速制作一个可以刷参数的python脚本。

首先看下面这个简单的情况:

    import argparse
    usage = '''
    this is a example to show argparse usage
    '''
    parser = argparse.ArgumentParser(usage=usage)
    
    args = parser.parse_args()

这是简单的一个例子了，现在脚本还不可以接受任何参数，只可以用 `-h` 或
`--help` 来查看一些信息，如下所示。

    wanze@wanze-ubuntu64:~/桌面$ python3 hello.py -h
    usage: 
    this is a example to show argparse usage
     [-h]
    
    optional arguments:
      -h, --help  show this help message and exit

其首先是新建一个parser，上面ArgumentParser的usage是可选参数，就是命令行的一些描述信息。然后需要调用parser的
`parse_args` 方法，其就是具体将命令行接受的一些参数刷进去。

### 简单添加一个参数

上面的例子太简单了，现在开始简单添加一个参数。

    import argparse
    usage = '''
    this is a example to show argparse usage
    '''
    parser = argparse.ArgumentParser(usage=usage)
    
    parser.add_argument('--config',help="the config file path")
    
    args = parser.parse_args()
    
    print(args)

这样命令行的帮助信息就变成如下所示了:

    wanze@wanze-ubuntu64:~/桌面$ python3 hello.py -h
    usage: 
    this is a example to show argparse usage
    
    optional arguments:
      -h, --help       show this help message and exit
      --config CONFIG  the config file path

如果我们如下输入则有:

    wanze@wanze-ubuntu64:~/桌面$ python3 hello.py --config='config.cfg'
    Namespace(config='config.cfg')

我们看到 `parse_args` 方法返回的是Namespace对象，推荐用 `vars`
函数来将其处理成为字典值，这样会更好地方便后面的使用。

    import argparse
    usage = '''
    this is a example to show argparse usage
    '''
    parser = argparse.ArgumentParser(usage=usage)
    parser.add_argument('-c','--config',help="the config file path")
    args = vars(parser.parse_args())
    
    print(args)
    
    wanze@wanze-ubuntu64:~/桌面$ python3 hello.py -h
    usage: 
    this is a example to show argparse usage
    python3 hello.py
    
    optional arguments:
      -h, --help            show this help message and exit
      -c CONFIG, --config CONFIG
                            the config file path
    wanze@wanze-ubuntu64:~/桌面$ python3 hello.py --config='config.cfg'
    {'config': 'config.cfg'}

上面代码稍作修改，在长名字可选参数前面还可以加上短名字可选参数支持，然后我们看到
`parse_args` 方法经过 `vars`处理之后返回的是字典值。该字典的key默认对应的是长名字可选参数。你还可以自己设置目标参数名:

### 添加参数的其他选项设置

下面演示了如何设置目标参数在脚本中具体对应的变量名:

    import argparse
    usage = '''
    this is a example to show argparse usage
    '''
    parser = argparse.ArgumentParser(usage=usage)
    parser.add_argument('-c','--config',dest="configpath",help="the config file path")
    args = vars(parser.parse_args())
    
    print(args)

然后我们看到字典输入如下:

    wanze@wanze-ubuntu64:~/桌面$ python3 hello.py --config='config.cfg'
    {'configpath': 'config.cfg'}

当然一般就默认设置成为和长名字可选参数一致，没必要这么折腾。类似的你还可以继续用
`add_argument` 方法来添加其他的可选参数，然后 `add_argument`
还有如下一些选项配置:

required=True

:   该参数一定要输入值，否则报错

help

:   描述信息，前面已经看到了。

default

:   该参数的默认值，默认是None，你可以选择设置成另外一个值。

type

:   目标参数的数据类型，默认是字符串，可以设置为int或float。注意设置格式如下，不是字符串的那种设置形式:
​    `parser.add_argument('--delay',type=int)`

必填参数的添加如下所示，除了这个\"target\"名字前面没有 `--`
之外，和可选参数用法大致类似，其刷入args字典之后的key就是\"target\"这个名字。

    parser.add_argument('target',help="必填参数")

不过必填参数和可选参数在某些细节上还是有点差异的，后面会提及。

#### nargs选项设置

nargs设置之后该参数在脚本中具体对应的变量将是一个列表。其中nargs可以设置为一个数字，比如
`nargs=4` ，则脚本对该参数将接受4个输入值，然后将其收集进一个列表里面。

此外还有:

`nargs='*'`

:   这通常是对可选参数进行设置，当然也可以作用于必填参数，但这让必填参数失去意义了。其将收集任意多的输入参数值，而如果多个可选参数之间这样使用星号是可以的，具体请参看官方文档。

`nargs='+'`

:   这通常作用于必填参数，其意义有点类似于正则表达式里面的'+'号，和上面的'\*'号比起来其必须有一个输入值，否则将报错。

`nargs='?'`

:   这个'?'号具体使用情况挺复杂的，我不太喜欢，而且其和nargs其他的一些设置比较起来显得有点格格不入。首先其对应的变量值不是列表而是单个值！其次其改变了默认值的行为。如果该参数不输入，比如`--foo` 这个东西完全不输入在命令行里面，那么foo默认取default的值，如果加入了​  `--foo` 这个东西但是后面又不跟值，则foo取 **const** 选项赋的值。不太喜欢这个东西。

下面给出一个完整的例子:

```python
import argparse
usage = '''
resize the image
'''

def main():
    parser = argparse.ArgumentParser(usage=usage)
    parser.add_argument('-c','--config',dest="configpath",help="the config file path")
    parser.add_argument('inputimg',help="the input image",nargs='+')
    parser.add_argument('--width',help="the input image",type=int)

    args = vars(parser.parse_args())

    configpath = args['configpath']
    width = args['width']
    inputimg = args['inputimg']

    for inputimg in args['inputimg']:
        print('resize image')
        print('the input image is {}'.format(inputimg))
        print('the target width is {}'.format(width))
if __name__ == '__main__':
    main()
```

具体运行情况如下所示:

    wanze@wanze-ubuntu64:~/图片$ python3 resizeimg.py --help
    usage: 
    resize the image
    
    positional arguments:
      inputimg              the input image
    
    optional arguments:
      -h, --help            show this help message and exit
      -c CONFIGPATH, --config CONFIGPATH
                            the config file path
      --width WIDTH         the input image
    
    wanze@wanze-ubuntu64:~/图片$ python3 resizeimg.py --width=300 *.png
    resize image
    the input image is 2015-01-27 13:16:46 的屏幕截图.png
    the target width is 300
    resize image
    the input image is 2015-05-03 18:17:19屏幕截图.png
    the target width is 300
    resize image
    the input image is 2015-05-03 18:20:45屏幕截图.png
    the target width is 300
    ....

### 命令行选项关联其他动作

parser的 `add_argument` 方法的 `action`
参数就是用来控制命令行选项关联的动作的，一般都不需要设置，就是默认的
`store` ，也就是存储值。类似的有 `store_const` , `store_true` 和
`store_false` 。

#### store\_const

如果是默认的store，则通常是需要指明具体值的，如果设置action为
`store_const` 了:

    parser.add_argument('--foo', action='store_const', const=42)

那么如下就会自动设置该值，这和default默认值的区别是这个选项的值要求是某个常量值。

    >> python3 test2.py --foo
    Namespace(foo=42)

#### store\_true 和 store\_false

如果写为:

    parser.add_argument('--foo', action='store_true')

则其存储的就是 `True` 值:

    >> python3 test2.py --foo 
    Namespace(foo=True)

这里主要是要讲定义自己的动作，就是类似 `--version`
这样的用法，是一种影响程序整个工作流的选项，官方文档推荐通过子类化
`argparse.Action` 的方法，还是有点麻烦的。然后发现 *click*
模块非常好（一个解决创建命令行脚本工具问题推荐使用的第三方模块），处理这个问题也很容易:

```python
import click

def print_version(ctx, param, value):
    if not value or ctx.resilient_parsing:
        return
    click.echo('Version 1.0')
    ctx.exit()

def quick(ctx,param,value):
    print(ctx,param,value)
    ctx.exit()

@click.command()
@click.option('--version', is_flag=True, callback=print_version,
              expose_value=False, is_eager=True)
@click.option('--quick',callback=quick,is_flag=True)
def hello():
    while True:
        userinput = input('input:')
        click.echo(userinput)

        if userinput == 'exit':
            break
if __name__ == '__main__':
    hello()
```

这里的ctx和param到click模块那边再细讲吧，我们看到整个过程比argparse美观多了。






configparser模块
----------------

简单的配置文件管理就用python的内置模块configparser。python2对应的模块名字叫 ConfigParser 。

python3之后configparser的使用更加简单了，具体就分为如下几步:

### 新建一个configparser对象

    import configparser
    config = configparser.ConfigParser()

### 读取某个config文件

调用read方法具体读取某个config文件。

    config.read('test.cfg')

### 如同字典一般操作configparser对象

然后接下来就是如同字典一般操作这个configparser对象。其中 'DEFAULT'
是特殊的section，大致如下这样表达:

    config['DEFAULT'] = {'ServerAliveInterval': '45',
                         'Compression': 'yes',
                         'CompressionLevel': '9'}
    config['bitbucket.org'] = {}
    config['bitbucket.org']['User'] = 'hg'
    config['topsecret.server.com'] = {}

### 调用write方法写入

    with open('example.ini', 'w') as configfile:
        config.write(configfile)

### 不默认更改大小写

具体请参看 [这个网页](http://stackoverflow.com/questions/19359556/configparser-reads-capital-keys-and-make-them-lower-case) ，configparser模块默认把 option name 也就是每个section的key
name改成小写，我不太喜欢这种风格，因为将configparser刷成字典值时，我们通常认为字典的key大小写是区分的，可以如下改动，然后就不自动进行小写操作了:

    self.cfg = configparser.ConfigParser()
    self.cfg.optionxform = str## not auto make it lowercase

### configparse处理特殊字符

configparse对于某些特殊字符可能会报错，参考了 [这个问题](https://stackoverflow.com/questions/14340366/configparser-and-string-with) ，推荐使用 `RawConfigParser` ，这样就可以解决问题。

## csv模块

csv模块的使用主要是 `reader` 和 `writer` 两个函数，此外还提供了 `DictReader` 和 `DictWriter` 两个基于 reader和 writer的两个辅助类。reader和writer是接受的文件对象，具体使用参见官方的样例：

```python
import csv

with open('eggs.csv', 'w', newline='') as csvfile:
    spamwriter = csv.writer(csvfile, delimiter=' ',
                            quotechar='|', quoting=csv.QUOTE_MINIMAL)
    spamwriter.writerow(['Spam'] * 5 + ['Baked Beans'])
    spamwriter.writerow(['Spam', 'Lovely Spam', 'Wonderful Spam'])

with open('eggs.csv', newline='') as csvfile:
    spamreader = csv.reader(csvfile, delimiter=' ', quotechar='|')
    for row in spamreader:
        print(', '.join(row))
```

reader和writer两个函数后面接受的参数根据你的需要定制，具体就是所谓的csv方言格式。首先你可能不需要做任何修改，默认是采用的excel格式的csv方言：


```python
class excel(Dialect):
    """Describe the usual properties of Excel-generated CSV files."""
    delimiter = ','
    quotechar = '"'
    doublequote = True
    skipinitialspace = False
    lineterminator = '\r\n'
    quoting = QUOTE_MINIMAL
```

下面就这些字段的含义作出说明：

- **delimiter**  分隔符，这个意义很明显。
- **lineterminator**  换行符，这个意义也很明显，目前主要就两种： `\r\n`  和 `\n` 。
- **skipinitialspace**  默认是False，其主要是对于如果你将空格设置为分隔符时有意义，这样后面字符开始的空格将会被忽略，其他情况设置为True或者False区别不大。
- **quoting**  设置quote规则
- csv.QUOTE_MINIMAL 意思是只有在需要的情况下才加上双引号，比如逗号在字符串里面，双引号在字符串里面，换行符号在字符串里面等等。
  
- csv.QUOTE_ALL 意思是都加上双引号，即使是数字。
  
- csv.QUOTE_NONNUMERIC 数字不加，字符串都加上双引号。（只有在这种情况下csv模块才会正确将数字解析为float类型）
  
- csv.QUOTE_NONE 都不加（此时需要设置好escapechar选项）
- **quotechar** 设置quote具体的字符，一般设置为双引号。
- **doublequote** 用来处理双引号在字符串中的情况，默认是True，字符串将会双引号之外再加上双引号，如果设置为False，会前面加上一个 `escapechar` 。

如果你对csv的输出格式并没有太多要求或者和excel格式是一致的，那么简单的csv文件的读写如下所示，是不需要太多参数的：

```python
import csv

with open('eggs.csv', 'w', newline='', encoding='utf8') as csvfile:
    spamwriter = csv.writer(csvfile)
    spamwriter.writerow(['Spam'] * 5 + ['Baked Beans'])
    spamwriter.writerow(['Spam', 'Lovely Spam', 'Wonderful Spam'])

with open('eggs.csv', newline='', encoding='utf8') as csvfile:
    spamreader = csv.reader(csvfile)
    for row in spamreader:
        print(', '.join(row))
```




### 编写自己的csv方言


如之前所示你可以指定一些csv方言的选项，或者如下所示定义一个你的csv方言类：

```python
import csv

class YourDialectCSV(csv.Dialect):
    delimiter = ',' # 分隔符
    quotechar = '"' # quote符号
    doublequote = True # 双引号在字符中的情况
    skipinitialspace = True # 分隔符后空白忽略
    lineterminator = '\n' # 换行符
    quoting = csv.QUOTE_MINIMAL # 最小quote

csv.register_dialect("YourDialectCSV", YourDialectCSV)
```

这样后面你使用csv模块的reader和writer函数加上 `dialect='YourDialectCSV'`  即可。

### DictReader和DictWriter类

对于开头一行是字段名的csv文件，推荐使用DictReader和DictWriter两个类，两个类初始实例化的时候同样可以接受dialect选项或其他参数，这些参数会原封不动传递给reader

```python
class DictReader:
    def __init__(self, f, fieldnames=None, restkey=None, restval=None,
                 dialect="excel", *args, **kwds):
		self.reader = reader(f, dialect, *args, **kwds)

class DictWriter:
    def __init__(self, f, fieldnames, restval="", extrasaction="raise",
                 dialect="excel", *args, **kwds):
		self.writer = writer(f, dialect, *args, **kwds)
```

所以之前的讨论同样使用，具体使用很简单，如下看下官方样例即可：

```python
with open('names.csv', 'w', newline='', encoding='utf8') as csvfile:
    fieldnames = ['first_name', 'last_name']
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

    writer.writeheader()
    writer.writerow({'first_name': 'Baked', 'last_name': 'Beans'})
    writer.writerow({'first_name': 'Lovely', 'last_name': 'Spam'})
    writer.writerow({'first_name': 'Wonderful', 'last_name': 'Spam'})

with open('names.csv', newline='', encoding='utf8') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        print(row['first_name'], row['last_name'])
```



## tempfile模块

tempfile模块用于创建临时文件或者临时文件夹，这个模块在所有系统平台上都能正常工作，有时还是很有用的。

比如windows系统下的临时文件夹所在：
```python
>>> import os
>>> os.name
'nt'
>>> import tempfile
>>> tempfile.gettempdir()
'C:\\Users\\a3580\\AppData\\Local\\Temp'
```
最核心的两个函数是 `mkstemp` 和 `mkdtemp` 。



## mkstemp

mkstemp函数用于新建一个临时文件

```python
fd, fpath = tempfile.mkstemp(dir=tmpdir)
with os.fdopen(fd, 'wb') as temp_cache_file:
    marshal.dump((self.FREQ, self.total), temp_cache_file)
```

返回的第二个参数就是目标临时文件的路径名，第一个文件参数比较特殊，是操作系统级别的文件句柄（应该是C语言那边的文件句柄吧），要转成一般使用的python文件对象如上所示，使用 `os.fdopen` 来打开。



## textwrap模块

textwrap模块实现了编辑器常见的换行显示功能。默认 `width=70`  。

```python
from textwrap import fill
wrapped = fill(output)
```

fill函数等于：

```text
"\n".join(wrap(text, ...))
```



## 拾遗

### 可迭代对象flatten操作

```
a_list = [[1, 2], [3, 4], [5, 6]]
print(list(itertools.chain.from_iterable(a_list)))
# Output: [1, 2, 3, 4, 5, 6]

# or
print(list(itertools.chain(*a_list)))
# Output: [1, 2, 3, 4, 5, 6]
```

### 利用abc模块来实现抽象基类

abc模块帮助你实现抽象基类，有点类似于java中抽象类的概念。

具体实现如下所示：

```python
from abc import abstractmethod
from abc import ABC 

class Graph(ABC):
    """
    一般图
    """
    DIRECTED = None

    @abstractmethod
    def nodes(self):
        """
        :return:
        """
        raise NotImplementedError("Not Implement nodes methods")

```

抽象类不可实例化，实例化将会报错。继承于它的类，如果如上定义了抽象方法，那么继承它的类必须定义好对应方法的实现，否则将会报错。

抽象类里面也可以定义不是抽象方法的其他实际动作的方法。

抽象类里面还可以定义抽象属性。

### 在logging中使用pprint

参考了 [这个网页](https://stackoverflow.com/questions/11093236/use-logging-print-the-output-of-pprint) 。

有的时候logging的输出我们希望调用pprint从而输出打印更加美观些，可以调用pformat函数来达到这个效果：

```python
from pprint import pprint, pformat
ds = [{'hello': 'there'}]
logging.debug(pformat(ds))
```



### 利用itertools模块的product函数来遍历组合

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




### 利用collections模块的deque数据结构

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



### 查找多个最大最小元素的情况

如果只是想要获知某些数据的一个最大值或者一个最小值，那么当然用 `max` 或 `min` 方法就可以了。这里讨论的情况是如果你想要获知某些数据的多个最大值或多个最小值。一般想到的就是先对这些数据进行排序，然后进行切片操作。参考资料2的第一章第四节讨论的方法实际上是利用最小堆结构进行堆排序然后提出最大或最小的那个几个元素。

大体过程就是:
```
lst = [1, 8, 2, 23, 7, -4, 18, 23, 42, 37, 2]
import heapq
heapq.heapify(lst)
heapq.nlargest(3,lst)
heapq.nsmallest(3,lst)
```

### 利用collections模块的Orderdict类

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

### 利用collections模块的namedtuple

collections模块里面的namedtuple函数将会产生一个有名字的数组的类（有名数组），通过这个类可以新建类似的实例。比如：

    from collections import namedtuple
    
    Point3d=namedtuple('Point3d',['x','y','z'])
    p1=Point3d(0,1,2)
    print(p1)
    print(p1[0],p1.z)
    
    Point3d(x=0, y=1, z=2)
    0 2

### 构建一个dataclass类

python3.7新加入的dataclass类是一个很有用的特性，对于代码中的某些函数之间彼此传输的特定数据，可以如下构建一个dataclass类：

```
@dataclass
class InventoryItem:
    '''Class for keeping track of an item in inventory.'''
    name: str
    unit_price: float
    quantity_on_hand: int = 0
```

其大致效果等于：

```
def __init__(self, name: str, unit_price: float, quantity_on_hand: int=0):
    self.name = name
    self.unit_price = unit_price
    self.quantity_on_hand = quantity_on_hand
```

编写这样的dataclass类主要是让你的项目代码数据定义更加清晰化。



### configparse处理特殊字符

configparse对于某些特殊字符可能会报错，参考了 [这个问题](https://stackoverflow.com/questions/14340366/configparser-and-string-with) ，推荐使用 `RawConfigParser` ，这样就可以解决问题。

### 利用collections模块的ChainMap定义搜索过程

将多个字典组合成为一个map字典，想到的一个应用就是配置字典流，利用ChainMap定义搜索路径流，先搜索到的配置优先取用。

```python
from collections import ChainMap
d1 = {'a':1,'b':2}
d2 = {'a':2,'d':3}
d3 = ChainMap(d1, d2)
```



### typing.NamedTuple

这个类添加于python3.6，与 collections.namedtuple 非常类似。

```python
from typing import NamedTuple
class Car(NamedTuple):
    color: str
    mileage: float
    automatic: bool
car1 = Car(color='red',mileage=3512.5, automatic=True)
car1.color
```

总的说来我不赞同达恩·巴德尔的观点——推荐使用typing.NamedTuple ，因为namedtuple有比较优势和区分的是相对于字典，其有两个特点：一，key不可变；二，轻量级。在某些情况下使用namedtuple优于字典。但是如果采用类的写法，那么就换了一个情景了，我认为在这个情境下，NamedTuple和dict都不太合适，而类应该成为第一公民。

### queue.PriorityQueue

queue.PriorityQueue 内部实现是基于heapq堆排序的，只是额外做了一些处理，从而保证操作是线程安全的。一般来说如果要实现一个优先级队列，推荐使用 PriorityQueue：

```python
from queue import PriorityQueue
q = PriorityQueue()
q.put((2, 'code'))
q.put((1, 'eat'))
q.put((3, 'sleep')) 
while not q.empty():
    print(q.get())
```

```
(1, 'eat')
(2, 'code')
(3, 'sleep')
```

### queue.Queue

这个是线程安全的先进先出【队列操作】数据结构。

```
from queue import Queue
q = Queue()
q.put('a')
q.put('c')
print(q.get())
print(q.get())
```

```
a
c
```



### queue.LifoQueue

这个是线程安全的后进先出【栈操作】的数据结构。

```
from queue import LifoQueue
q = LifoQueue()
q.put('a')
q.put('c')
print(q.get())
print(q.get())
```

```
c
a
```

### multiprocessing.Queue

跨进程的先进先出队列数据结构：

```
from multiprocessing import Queue
q = Queue()
q.put('a')
q.put('c')
print(q.get())
print(q.get())
```

```
a
c
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








### 基本结构

- `Doc` 文档
- `Grammar` 计算机可理解的语言定义
- `Include` C的头文件
- `Lib` 用python写的python内置模块部分
- `Mac` macOs支持
- `Misc` 杂项
- `Modules` 用C写的python内置模块部分
- `Objects` 核心对象和类
- `Parser`  python解析器
- `PC` 对windows系统旧版本的编译支持
- `PCBuild` 对windows系统的编译支持
- `Programs` python命令行程序
- `Python` CPython解释器
- `Tools` 单独的一些有用的工具
- `m4` 定制脚本用于自动配置makefile

### 一个简单的C语言扩展

如上面所示，CPython首先是一个C语言实现的解释器，其次是由C语言写的核心对象和类，再就是用C写的内置模块，最后就是用python写的内置模块。python写的模块源码是直接可以拿来阅读的，而C语言写的内置模块这就是本小节要展示。下面将通过C语言来编写一个最简单的python模块。

`ctest.c` 文件内容如下：

```c
#define PY_SSIZE_T_CLEAN
#include <Python.h>
#include <stdio.h>

static PyObject *
ctest_hello(PyObject *self, PyObject *args) {
    char *str;

    /* Parse arguments */
    if(!PyArg_ParseTuple(args, "s", &str)) {
        return NULL;
    }

    printf("hello %s\n", str);

    return Py_None;
}

static PyMethodDef CtestMethods[] = {
    {"hello", ctest_hello, METH_VARARGS, "a simple say hello function."},
    {NULL, NULL, 0, NULL}
};


static struct PyModuleDef ctestmodule = {
    PyModuleDef_HEAD_INIT,
    "ctest",
    "a simple python module writing in c",
    -1,
    CtestMethods
};

PyMODINIT_FUNC PyInit_ctest(void) {
    return PyModule_Create(&ctestmodule);
}
```

setup.py 是用来编译该模块的：

```python
from distutils.core import setup, Extension


def main():
    setup(
        ext_modules=[
            Extension("my_python_module.ctest", ["src/ctest/ctest.c"])]
    )


if __name__ == "__main__":
    main()
```

读者可能注意到了，该模块是作为my_python_module的子模块引入进来的。然后正常打包安装：

```
python -m build
pip install dist\***.whl
```

```
>>> import my_python_module.ctest
>>> my_python_module.ctest.hello("world")
hello world
```

因为这里不是C语言教程，所以这里不会就C语言作过多讨论，而上面的ctest.c先请读者简单看一下，熟悉一下，后面我们再慢慢学习熟悉这其中的细节。



### 基础知识

python解释器的工作不是将你输入的python代码编译为机器码，而是一种中间语言：`bytecode` 。`.pyc`文件下存储的就是这样的字节码。

python语言规范使用的是EBNF（Extended-BNF）规范。

- `*` 重复
- `+` 至少重复一次
- `[]` 可选部分
- `|` 可供选择的部分
- `()` grouping

