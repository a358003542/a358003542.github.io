Slug: python-tutorial
Tags: python,
Date: 20191018
Modified: 20211119

[TOC]

## 初识python

Python是个成功的脚本语言。它最初由Guido van Rossum开发，在1991年第一次发布。Python由ABC和Haskell语言所启发。Python是一个高级的、通用的、跨平台、解释型的语言。一些人更倾向于称之为动态语言。它很易学，Python是一种简约的语言。它的最明显的一个特征是，不使用分号或括号，Python使用缩进。现在，Python由来自世界各地的庞大的志愿者维护。

python现在主要有两个版本区别，python2和python3。作为新学者推荐完全使用python3编程，本文档完全基于python3。

### 安装和配置

python的安装和配置在linux没什么好说了，windows下的安装主要是编辑好系统环境变量 `PATH` 值，好让读者可以在cmd或者powershell下调用python命令。

![img]({static}/images/computer/python-env-windows.png "python在windows下PATH环境变量的配置")

这个初次安装的时候程序有这个选项的。

### 进入python的REPL环境

在终端中输入python即进入python语言的REPL环境，很多linux系统目前默认的是python2。你可以运行：

    python  --version

来查看默认的python版本号。

要进入python3在终端中输入python3即可。

### python命令行用法

命令行的一般格式就是：

```text
python3  [可选项]  test.py  [可选参数1 可选参数2]
```

同样类似的运行 `python3  --help`
即可以查看python3命令的一些可选项。比如加入**-i**选项之后，python执行完脚本之后会进入REPL环境继续等待下一个命令，这个在最后结果一闪而过的时候有用。

#### python执行脚本参数的传递

上面的命令行接受多个参数都没有问题的，不会报错，哪怕你在py文件并没有用到他们。在py文件中要使用他们，首先导入sys模块，然后sys.argv\[0\]是现在这个py文件在系统中的文件名，接下来的sys.argv\[1\]就是之前命令行接受的第一个参数，后面的就依次类推了。

### 代码注释

python语言的注释符号和bash语言（linux终端的编程语言）一样用的是\#符号来注释代码。然后py文件开头一般如下面代码所示：

    #!/usr/bin/env python3
    #-*-coding:utf-8-*-

其中代码第一行表示等下如果py文件可执行模式执行那么将用python3来编译[^1]，第二行的意思是py文件编码是utf-8编码的，python3直接支持utf-8各个符号，这是很强大的一个更新。

多行注释可以利用编辑器快速每行前面加上\#符号。

#### Unicode码支持

python3是可以直接支持Unicode码的，读者请实验下面这个小例子，这将打印一个笑脸符号：

    #!/usr/bin/env python3
    #-*-coding:utf-8-*-
    print('\u263a')
    
    ☺
    >>> 

上面的数字就是笑脸符号具体的Unicode码（十六进制）。

### 代码多行表示一行

这个技巧防止代码越界所以经常会用到。用反斜线 `\` 即可。不过更常用的是将表达式用圆括号 `()` 括起来，这样内部可以直接换行并继续。在python中任何表达式都可以包围在圆括号中。

#### 一行表示多行

python中一般不用分号，但是分号的意义大致和bash或者c语言中的意义类似，表示一行结束的意思。其中c语言我们知道是必须使用分号的。

### 输入和输出

input函数请求用户输入，并将这个值赋值给某个变量。注意赋值之后类型是字符串，但后面你可以用强制类型转换——int函数（变成整数），float函数（变成实数）——将其转成你想要的数据类型。

print函数就是编程语言中常见的的屏幕显示输出函数。

读者请运行下面的例子：
```
x=input('请输入一个实数：')
string='你输入的这个实数乘以2等于：'+ str(float(x)*2)
print(string)
```
### \_\_main\_\_和\_\_name\_\_

按照[这个网站](http://stackoverflow.com/questions/419163/what-does-if-name-main-do)的讲解，如果当前这个py文件是被执行的，那么`__name__`在本py文件中的值是`__main__`，如果这个py文件是被作为模块引入的，那么`__name__`在那个py文件中的值是本py文件作为模块的模块名。

比如说现在你随便新建一个test.py文件，这个py文件里面就简单打印`__name__`的值，然后我们再打开终端，运行：
```
python test.py
```
这个时候打印的是： `__main__` 。而如果你进入python的REPL环境，再输入：
`import test`

这个时候你会发现`__name__`的值是字符 "test"。

如果是mymodule模块里的mymod.py文件（也就是新建一个mymodule文件夹，里面再新建一个mymod.py文件。），那么mymod.py文件里面其`__name__`的值是 "mymodule.mymod"。



### 从源码编译python

本部分算是偏高级点的知识，这里主要讨论如何在windows系统下从源码编译出python，linux系统下反而会略微直观简单点。

这里笔者并不是闲的没事，从源码编译出python这个过程有助于我们更深入地学习python，而这也是阅读和学习python源码的必由之路。

首先当然是下载CPython的源码，选择一个你喜欢的版本，这里以python3.7为例，那么应该进而下载visual studio 2017。

visual studio2017安装桌面端C++开发环境和python开发环境，然后把python本地开发组件勾选上。

用visual studio打开源码里面 `PCbuild` 里的 `pcbuild.sln` 。你可以使用 `.\build.bat  -p x64` 来编译出64位python，不带`-p` 参数默认编译出32位。一开始可以使用这个来测试下看看能不能编译成功，后面再使用visual studio编译，毕竟后面的重点还是利用visual studio来学习CPython的源码。

`build.bat` 会自动调用 `get_externals.bat` 这个脚本来下载一些第三方组件，建议下执行下这个脚本看看，如果下载实在有问题可以参考 [这个Github项目](https://github.com/python/cpython-source-deps) 。执行后下载内容在 `externals` 文件夹哪里，可以保存起来方便后续使用。

visual studio的`生成->配置管理器`那里可以选择Debug或者Release，win32或者x64等。

这些依赖在linux下编译一样是需要的，如果报错什么 `ssl.h` 找不到或者 `_sqlite3` 找不到就是这些依赖的缺失问题。



## 程序中的操作对象

python和c语言不同，c 是 `int x = 3` ，也就是这个变量是整数啊，字符啊什么的都要明确指定，python不需要这样做，只需要声明 `x ＝ 3` 即可。但是我们知道任何程序语言它到最后必然要明确某一个变量（这里也包括后面的更加复杂的各个结构对象）的内存分配，只是python语言帮我们将这些工作做了。

    ''' 这是一个多行注释
        你可以在这里写上很多废话
    '''
    x = 10
    print(x,type(x))

python程序由各个模块（modules）组成，模块就是各个文件。模块由声明（statements）组成，声明由表达式（expressions）组成，表达式负责创造和操作对象（objects）。在python中一切皆对象。python语言内置对象有：数值、字符串、列表、数组、字典、文件、集合等，这些后面会详细说明之。

### 赋值

python中的赋值语法非常的简单，`x=1` ，就是一个赋值语句了。和c语言不同，c是必须先声明`int x` 之类，开辟一个内存空间，然后才能给这个x赋值。而python的 `x=1` 语句实际上至少完成了三个工作：

1. 判断1的类型（动态类型语言必须要有这步）
2. 把这个类型的对象存储在内存里面
3. 创建x这个名字和将这个名字指向这个内存

#### 序列赋值

    x,y=1,'a'
    [z,w]=['b',10]
    print(x,y,z,w)
    
    1 a b 10
    >>> 

我们记得python中表达式可以加上圆括号，所以这里`x,y`产生的是一个数组`(x,y)`，然后是对应的数组平行赋值，第二行是列表的平行赋值。这是一个很有用的技巧。

在其他语言里面常常会介绍swap函数，就是接受两个参数然后将这两个参数的值交换一下，交换过程通常要用到临时变量。而在python中不需要再创建一个临时变量了，因为序列赋值会自动生成一个临时的右边的序列（其中的变量都对应原来的原始值），然后再赋值（这里强调一一对应是指两边的序列长度要一致。）

##### 交换两个元素

在python中交换两个元素用序列赋值形式是很便捷的：

    >>> x = 1
    >>> y = 2
    >>> x,y = y,x
    >>> print(x,y)
    2 1

这个过程显然不是先执行x=y然后执行y=x，如上所述的，程序首先右边创建一个临时的序列，其中的变量都对应原来的值，即`x,y=(2,1)`，然后再进行序列赋值。

#### 同时赋相同的值

    x=y='a'
    z=w=2
    print(x,y,z,w)
    
    a a 2 2
    >>> 

这种语句形式c语言里面也有，不过内部实现机制就非常的不一样了。python当声明x=y的时候，x和y只是不同的变量名，但都指向同一块内存值。也可以说x和y就是一个东西，只是取的名字不同罢了。

我们用is语句[^2]来测试，显示x和y就是一个东西。

    >>> x=y='a'
    >>> x is y
    True
    >>> x == y
    True

但如果写成这种形式：

    >>> x = 'a'
    >>> y = 'a'
    >>> x is y
    True

x和y还是指向的同一个对象，关于这点python内部是如何实现的我还不太清楚【一个一般的原则是如果右边的这个对象是不可变的，那么python会尽可能让x和y指向同一内存值。】。为了说明is语句功能正常这里再举个例子吧：

    >>> x = [1,2,3]
    >>> y = [1,2,3]
    >>> x == y
    True
    >>> x is y
    False

我们看到这里就有了两个列表对象。

#### 增强赋值语句

`x=x+y` 可以写作 `x += y` 。类似的还有：

```
   +=    &=    >>=
   
   -=    |=    <<=
   
   *=   ^=   **=
   
   /=    %=    //=
```


#### 可迭代对象的迭代赋值

在我们对python语言有了深入的了解之后，我们发现python中迭代思想是深入骨髓的。我们在前面接触了序列的赋值模式之后，发现似乎这种赋值除了临时创建右边的序列之外，还似乎与迭代操作有关，于是我们推测python的这种平行赋值模式可以扩展到可迭代对象，然后我们发现确实如此！

    >>> x,y,z= map(lambda x : x+2,[-1,0,1])
    >>> print(x,y,z)
    1 2 3

最后要强调一点的是确保左边的变量数目和后面的可迭代对象的输出元素数目是一致的，当然进一步扩展的序列解包赋值也是支持的：

    >>> x,y,*z= map(lambda x : x+2,[-1,0,1,2])
    >>> print(x,y,z)
    1 2 [3, 4]

通配赋值，我喜欢这样称呼，通配之后收集的元素在列表里面；而函数参数的通配传递，收集的元素是在元组里面。

最后我们总结到，可迭代对象的赋值就是迭代操作加上各个元素的一对一的赋值操作。

### 数值

python的数值的内置类型有：int，float，complex等[^3]。python的基本算术运算操作有加减乘除（+ - \* /）。然后 `=` 表示赋值，然后是中缀表达式和优先级和括号法则等，这些都是一般编程语言说到烂的东西了。

    print((1+2)*(10-5)/2)
    print(2**100)

#### 进位制

二进制的数字以 `0b`（零比）开头，八进制的数字以 `0o`（零哦）开头，十六进制的数字以 `0x`（零艾克斯）开头。

    0b101010, 0o177, 0x9ff

以二进制格式查看数字使用 `bin` 命令，以十六进制查看数字使用 `hex` 命令。

    >>> bin(42)
    '0b101010'
    >>> hex(42)
    '0x2a'

下面写上一个进制转换小程序：

```python
number=input("请输入一个数字：")
number= eval(number)
#
radix= input('''请输入你想转换的进制系统
2   表示  二进制
8   表示  八进制
16  表示  十六进制
''')
radix =eval(radix)

while True:
    if radix == 2:
        print(bin(number))
        break
    elif radix == 8:
        print(oct(number))
        break
    elif radix == 16:
        print(hex(number))
        break
    else:
        print("sorry you input the wrong radix")
```

程序运行的情况如下所示：

```text
请输入一个数字：20
请输入你想转换的进制系统
2   表示  二进制
8   表示  八进制
16  表示  十六进制
8
0o24
```

此外字符串的format方法也提供了类似的功能。

#### 不要用eval

上面的例子用了eval这个函数，这非常的不好，非常的不安全，总的来说不应该使用eval函数。如果在某些情况下，你确实想要使用eval，那么也应该使用ast模块的`literal_eval` 函数。如下所示，这个函数试着接受一个字符串，将其转成python里面的对象：

    import ast
    def str2pyobj(val):
        '''str to python obj or not changed'''
        try:
            val = ast.literal_eval(val)
        except Exception:###
            pass
        return val

支持的python object有: strings, bytes, numbers, tuples, lists, dicts, sets, booleans, and None.

比如 "1"， "3.14"， "[1,2,3]" 将分别转化成为integer，float，和list。

#### int函数比你想的更强大

int函数用于强制类型转换的时候，可以将一个类数值字符串变成integer，但这个函数还隐藏了一个强大的功能，那就是其还有第二个可选参数，进位制。

```python
>>> int('a', base=16)
10
>>> int('0xa', base=16)
10
```

上面的效果就是将一个十六进制的字符按照十六进制处理之后再输出一个十进制的数值。

#### 进制转换问题总结

当我们说一个数在计算机里面，它都是以二进制形式存储的，也正是这个根源就一般数值类型来说实际上是实现不了我们预想的那种四舍五入操作的函数的，最多只能实现一种近似的版本。而在python这边我们说 `number=10` 或者 `number=0xa` ，number最终是存储了一个数值，当我们要求输出显示number的时候其都是以十进制的形式显示，于是就有了 `bin` ，`oct` 和 `hex` 这三个函数来获得另外进制输出显示的效果。

因为这个过程是将一个数值类型转成字符串类型，或者format方法也提供了这样的功能支持，具体对应关系如下：

```
f'{number:b}'  bin(number)
f'{number:o}'  oct(number)
f'{number:d}'  number
f'{number:x}'  hex(number)
```

format方法的输出没有进制标识前缀。

前面的例子我们说输入10，input获得的值都会保存为字符串。然后我们说eval成python内部的对象，也就是整型。eval或者literal_eval函数的一个好处就是你写上 `"0xa"`，其转成python对象自动将其转成十进制数值了。这个操作过程更确切的定义是将一个字符串类型转换成integer整型，而这恰好就是int函数负责的部分，于是我们发现这个过程用int函数处理会更合适，并继而我们发现int函数原来也可以很好地处理不同进制的字符串的输入问题，不过需要你额外指明该字符串代表的数值的进制。

```
number = int(number, input_radix)
```

于是上面的进制转换小程序改写如下：

```python

user_input = input("请输入一个数字和该数字的进制，以空格分开。")
number, in_radix = user_input.split()

number = int(number, int(in_radix))

out_radix = input('''请输入你想转换的进制系统
2   表示  二进制
8   表示  八进制
16  表示  十六进制
''')
out_radix = int(out_radix)

while True:
    if out_radix == 2:
        print(bin(number))
        break
    elif out_radix == 8:
        print(oct(number))
        break
    elif out_radix == 16:
        print(hex(number))
        break
    else:
        print("sorry you input the wrong radix")
```



#### 数学幂方运算

$x^y$，x的y次方如上面第二行所述就是用`x**y`这样的形式即可。此外pow函数作用是一样的，`pow(x,y)`。

#### 数值比较

数值比较除了之前提及的 >，<，==之外，\>=，<=，!=也是有的（大于等于，小于等于，不等于）。此外python还支持连续比较，就是数学格式 $a<x<b$ ，x在区间 $(a,b)$ 的判断。在python中可以直接写成如下形式：`a<x<b`。这实际实现的过程就是两个比较操作的进一步与操作。虽然python支持这种写法，但个人建议写成 `x < b && x > a` 这样会更具有编程语言上的通用性。

#### 相除取商或余

就作为正整数相除使用 `x//y` 得到的值意义还是很明显的就是**商**。相关的还有**取余**数，就是`x%y`，【这个百分号在其他编程语言里面对应那个mod函数，也就是取模操作，在数学上就是取余数的含义。】这样就得到x除以y之后的余数了。

#### 复数

python直接支持复数，复数的写法是类似`1+2j`这样的形式，然后如果z被赋值了一个复数，这样它就是一个复数类型，那么这个类具有两个属性量，**real**和**imag**。也就是使用`z.real`就给出这个复数的实数部。imag是imaginary number的缩写，虚数，想像出来的数。

#### abs函数

大家都知道abs函数是绝对值函数，这个python自带的，不需要加载什么模块。作用于复数也是可以的：

    z=3+4j
    print(z.real,z.imag)
    print(abs(z))

这个和数学中复数绝对值的定义完全一致，也就是复数的模：
$\left| z \right| =\sqrt { a^{ 2 }+b^{ 2 } }$

#### round函数

    >>> round(3.1415926)
    3
    >>> round(3.1415926,0)
    3.0
    >>> round(3.1415926,1)
    3.1
    >>> round(3.1415926,2)
    3.14
    >>> round(3.1415926,4)
    3.1416

第二个参数接受0或者负数多少有点没意义了，一般使用还是取1或大于1的数吧，意思就是保留几位小数。

round函数初看起来似乎是实现了数学上的四舍五入取整，但实际上并不确切。比如：

```
>>> round(0.5)
0
>>> round(1.5)
2
>>> round(2.5)
2
>>> round(3.5)
4
>>> round(4.5)
4
>>> round(5.5)
6
>>> round(6.5)
6
```

round函数返回的是距离该浮点数最近的那个整数，但计算机里面并没有那种所谓的确切的小数，请看下面这个例子：

```
>>> 0.1+0.1+0.1 == 0.3
False
>>> round(0.1+0.1+0.1,20) == round(0.3,20)
False
>>> round(0.1+0.1+0.1,15) == round(0.3,15)
True
```

计算机表示浮点数比如0.3都是用二进制来表示的，所以只可能获得一个无限接近于0.3的数值而不是十进制里面的那个确切的0.3。这也就是上面round函数对于1.5或者2.5等中间值没有采用一致策略的原因，因为round函数如上所示设计的目的不是用来实现数学上的四舍五入的，而是用来判断计算机世界里面浮点数是否近似相等的。

具体取整上的round策略有很多种，请参见 [这篇文章](https://realpython.com/python-rounding/)。 比如一种近似的四舍五入函数：

```
def round_half_up(n, decimals=0):
    multiplier = 10 ** decimals
    return math.floor(n*multiplier + 0.5) / multiplier
```

但正如前面谈论了，如果你想要实现的那个精确的四舍五入，那么上面这个函数也是有错误的。最好还是采用python的decimal来表达精确的小数。

```
>>> round_half_up(2.5)
3.0
>>> round(2.5)
2
```

round_half_up这个函数之所以能够部分有效，是因为2.5精度以下的偏差通过0.5的残余精度下的数值得到了修补。但如果：

```
>>> round_half_up(2.4999999999999999)
3.0
>>> round_half_up(2.499999999999999)
2.0
```

所以round_half_up只是说在浮点数精度下能够实现大致的四舍五入效果了。



#### min，max和sum函数

min，max函数的用法和sum的用法稍微有点差异，简单起见可以认为min，max，sum都接受一个元组或者列表，然后返回这个元组或者列表其中的最小值，最大值或者相加总和。此外min和max还支持 `min(1,2,3)` 这样的形式，而sum不支持。

    >>> min((1,6,8,3,4))
    1
    >>> max([1,6,8,3,4])
    8
    >>> sum([1,6,8,3,4])
    22
    >>> min(1,6,8,3,4)
    1

#### 位操作

python支持位操作的，这里简单说一下：位左移操作 `<<` ，位与操作 `&` ，位或操作 `|` ，位异或操作` ^` 。

    >>> x=0b0001
    >>> bin(x << 2)
    '0b100'
    >>> bin(x | 0b010)
    '0b11'
    >>> bin(x & 0b1)
    '0b1'
    >>> bin(x ^ 0b101)
    '0b100'

#### math模块

在`from math import *`之后，可以直接用符号 `pi` 和 `e` 来引用圆周率和自然常数。此外math模块还提供了很多数学函数，比如：

sqrt

:   开平方根函数，sqrt(x)。

sin

:   正弦函数，类似的还有cos，tan等，sin(x)。

degrees

:   将弧度转化为角度，三角函数默认输入的是弧度值。

radians

:   将角度转化位弧度，radians(30)。

log

:   开对数，log(x,y)，即$\log_y x$，y默认是e。

exp

:   指数函数，exp(x)。

pow

:   扩展了内置方法，现在支持float了。pow(x,y)

这里简单写个例子：

    >>> from math import *
    >>> print(pi)
    3.141592653589793
    >>> print(sqrt(85))
    9.219544457292887
    >>> print(round(sin(radians(30)),1))#sin(30°)
    0.5

更多内容请参见[官方文档](http://docs.python.org/3/library/math.html)。

#### random模块

random模块提供了一些函数来解决随机数问题。

random

:   random函数产生0到1之间的随机实数（包括0）。
​    random()-\>\[0.0, 1.0)。

uniform

:   uniform函数产生从a到b之间的随机实数（a，b的值指定，包括a。）。
​    uniform(a,b)-\>\[a.0, b.0)。

randint

:   randint函数产生从a到b之间的随机整数，包含a和b。
​    randint(a,b)-\>\[a,b\]

choice

:   choice随机从一个列表或者字符串中取出一个元素。

randrange

:   randrange函数产生从a到b之间的随机整数，步长为c（a，b，c的值指定，相当于choice(range(a,b,c))。整数之间就用randint函数吧，这里函数主要是针对range函数按照步长从而生成一些整数序列的情况。

sample(p,k)

:   sample函数从p中随机选取唯一的元素（p一般是range(n)或集合之类的，这里所谓的唯一的意思就是不放回抽样的意思，但如果p样品里面有重复的元素，最后生成的列表还是会有重复的元素的。）然后组成k长度的列表返回。

下面是一个简单的例子：

    >>> from random import *
    >>> print(random())
    0.36882919781549717
    >>> print(uniform(1,10))
    2.771065174892699
    >>> print(randrange(1,6))
    1
    >>> print(randint(1,10))
    3
    >>> print(choice('abcdefghij'))
    j
    >>> print(choice(['1','2','3']))
    2

作为随机实数，所谓开始包含的那个临界值可能数学意义大于实际价值，你可以写一个类似下面的小脚本看一下，随机实数是很难随机到某个具体的数的。

    from random import *
    i = 0
    while True:
        x = uniform(0,2)
        if x == 0:
            print(i)
            break
        else:
            print(x)
            i += 1

从上一个例子我们看到，虽然我不确定具体随机到某个实数的概率是不是永远也没有可能，但肯定很小很小。所以如果我们要解决某个问题，需要某个确定的概率的话还是用随机整数好一些。

更多内容请参见[官方文档](http://docs.python.org/3/library/random.html)。

### 序列

字符串，列表，元组（tuple，这里最好翻译成元组，因为里面的内容不一定是数值。）都是序列（sequence）的子类，所以序列的一些性质他们都具有，最好在这里一起讲方便理解记忆。

#### len函数

len函数返回序列所含元素的个数：

    string001='string'
    list001=['a','b','c']
    tuple001=(1,2,3,4)
    
    for x in [string001,list001,tuple001]:
        print(len(x))
    
    6
    3
    4
    >>> 

#### 调出某个值

对于序列来说后面跟个方括号，然后加上序号（程序界的老规矩，从0开始计数。），那么调出对应位置的那个值。还以上面那个例子来说明。

    string001='string'
    list001=['a','b','c']
    tuple001=(1,2,3,4)
    
    for x in [string001,list001,tuple001]:
        print(x[2])
    
    r
    c
    3
    >>> 

#### 倒着来

倒着来计数-1表示倒数第一个，-2表示倒数第二个。依次类推。

    string001='string'
    list001=['a','b','c']
    tuple001=(1,2,3,4)
    
    for x in [string001,list001,tuple001]:
        print(x[-1],x[-2])
    
    g n
    c b
    4 3

#### 调出多个值

前面不写表示从头开始，后面不写表示到达尾部。中间加个冒号的形式表示从那里到那里。看来python区间的默认含义都是包头不包尾。这样如果你想要最后一个元素也进去，只有使用默认的不写形式了。

    string001='string'
    list001=['a','b','c']
    tuple001=(1,2,3,4)
    
    for x in [string001,list001,tuple001]:
        print(x[1:3],x[-2:-1],x[:-1],x[1:],x[1:-1])
    
    tr n strin tring trin
    ['b', 'c'] ['b'] ['a', 'b'] ['b', 'c'] ['b']
    (2, 3) (3,) (1, 2, 3) (2, 3, 4) (2, 3)

用数学半开半闭区间的定义来理解这里的包含关系还是很便捷的。

1.  首先是数学半开半闭区间，左元素和右元素都是之前叙述的对应的定位点。左元素包含右元素不包含。

2.  其次方向应该是从左到右，如果定义的区间是从右到左，那么将产生空值。

3.  如果区间超过，那么从左到右包含的所有元素就是结果，。

4.  最后如果左右元素定位点相同，那么将产生空值，比如：`string001[2:-4]`，其中2和-4实际上是定位在同一个元素之上的。额外值得一提的列表插入操作可以通过`list001[a:b]= [1]` 这种形式来实现，如果a,b是某一个定位点的话，结果相当于在a定位点之前插入目标列表 ，请参看列表的插入操作这一小节。

#### 序列反转

这是python最令人叹为观止的地方了，其他的语言可能对列表反转要编写一个复杂的函数，我们python有一种令人感动的方法。

    string001='string'
    list001=['a','b','c']
    tuple001=(1,2,3,4)
    
    for x in [string001,list001,tuple001]:
        print(x[::-1])
    
    gnirts
    ['c', 'b', 'a']
    (4, 3, 2, 1)

之前在range函数的介绍时提及序列的索引和range函数的参数设置很是类似，这是我们可以参考理解之，序列（列表，字符串等）的索引参数 `[start:end:step]` 和range函数的参数设置一样，第一个参数是起步值，第二个参数是结束值，第三个参数是步长。这里end不填都好理解，就是迭代完即可，不过如果step是负数，似乎起点不填默认的是-1。

然后range函数生成的迭代器对象同样接受这种索引参数语法，看上去更加的怪异了：

    >>> range(1,10,2)
    range(1, 10, 2)
    >>> range(1,10,2)[::-2]
    range(9, -1, -4)
    
    >>> list(range(1,10,2))
    [1, 3, 5, 7, 9]
    >>> list(range(1,10,2)[::-2])
    [9, 5, 1]

我们可以看到对range函数进行切片操作之后返回的仍然是一个range对象，经过了一些修正。似乎这种切片操作和类的某个特殊方法有关，和python的slice对象有关。

#### 序列的可更改性

字符串不可以直接更改，但可以组合成为新的字符串；列表可以直接更改；元组不可以直接更改。

#### 序列的加法和减法

两个字符串相加就是字符串拼接了。乘法就是加法的重复，所以一个字符串乘以一个数字就是自己和自己拼接了几次。列表还有元组和字符串一样大致情况类似。

    print('abc'+'def')
    print('abc'*3)
    print([1,2,3]+[4,5,6])
    print((0,'a')*2)
    
    abcdef
    abcabcabc
    [1, 2, 3, 4, 5, 6]
    (0, 'a', 0, 'a')

### 字符串

python语言不像c语言，字符和字符串是不分的，用单引号或者双引号包起来就表示一个字符串了。单引号和双引号并没有什么特别的区别，只是如果字符串里面有单引号，那么就使用双引号，这样单引号直接作为字符处理而不需要而外的转义处理------所谓转义处理和其他很多编程语言一样用\\符号。比如要显示`'`就输入`\'`。

#### 三单引号和三双引号

在单引号或者双引号的情况下，你可以使用`\n`来换行。此外还可以使用三单引号 `"'` 或者三双引号 `"""` 来包围横跨多行的字符串，其中换行的意义就是换行。

    print('''\
    这是一段测试文字
      this is a test line
          其中空白和    换行都所见所得式的保留。''')

#### startswith方法

    >>> x = 'helloABC'
    >>> x
    'helloABC'
    >>> x.startswith('hello')
    True
    >>> x.endswith('ABC')
    True

startswith

:   测试字符串是否以某个子字符串开始

endswith

:   测试某个字符串是否以某个子字符串结束

#### find方法

字符串的find方法可用来查找某个子字符串，没有找到返回-1，找到了返回字符串的偏移量。用法就是：`s.find('d')`。

#### replace方法

字符串的replace方法进行替换操作，接受两个参数：第一个参数是待匹配的子字符串，第二个参数是要替换成为的样子。

    >>> print('a b 11 de'.replace('de','ding'))
    a b 11 ding
    >>> print('1,1,5,4,1,6'.replace('1','replaced'))
    replaced,replaced,5,4,replaced,6

#### upper方法

将字符串转换成大写形式。

    >>> str='str'
    >>> str.upper()
    'STR'

类似的还有：

lower

:   都变成小写

capitalize

:   首字母大写，其它都小写。

#### isdigit方法

isdigit

:   测试是不是数字

isalpha

:   测试是不是字母

isalnum

:   测试是不是数字或字母



#### split方法

字符串的split方法可以将字符串比如有空格或者逗号等分隔符分割而成，可以将其分割成子字符串列表。默认是空格是分隔符。

    >>> string='a=1,b=2,c=3'
    >>> string.split(',')
    ['a=1', 'b=2', 'c=3']

##### splitline方法

把一个字符串按照行分开。这个可以用上面的split方法然后接受`\n`参数来实现，所不同的是splitline方法不需要接受参数：

    >>> string
    'this is line one\nthis is line two\nthis is line three'
    >>> string.splitlines()
    ['this is line one', 'this is line two', 'this is line three']
    >>> string.split('\n')
    ['this is line one', 'this is line two', 'this is line three']

#### join方法

字符串的join方法非常有用，严格来说它接受一个迭代器参数，不过最常见的是列表。将列表中的多个字符串连接起来，我们看到他采用了一种非常优雅的方式，就是只有两个字符串之间才插入某个字符，这正是我们所需要的。具体例子如下所示：

    >>> list001=['a','b','c']
    >>> "".join(list001)
    'abc'
    >>> ','.join(list001)
    'a,b,c'

#### strip方法

##### rstrip方法

字符串右边的空格都删除。换行符也会被删除掉。

##### lstrip方法

类似rstrip方法，字符串左边的空格都删除。换行符也会被删除掉。

#### format方法

字符串的format方法方便对字符串内的一些变量进行替换操作，其中花括号不带数字跟format方法里面所有的替换量，带数字0表示第一个替换量，后面类推。此外还可以直接用确定的名字引用。

    >>> print('1+1={0}，2+2={1}'.format(1+1,2+2))
    1+1=2，2+2=4
    >>> print('my name is {name}'.format(name='Jim T Kirk'))
    my name is Jim T Kirk

#### 转义和不转义

`\n    \t  `这是一般常用的转义字符，换行和制表。此外还有`\\`输出\\符号。

如果输出字符串不想转义那么使用如下格式：

    >>> print(r'\t \n \test')
    \t \n \test

#### count方法

统计字符串中某个字符或某一连续的子字符串出现的次数。

    >>> string = 'this is a test line.'
    >>> string.count('this')
    1
    >>> string.count('t')
    3

#### r什么的方法

rfind rindex rjust rsplit
，这些方法有时会很有用，而具体其含义的理解就对应于： find index ljust
split。

我想大家应该看一下就知道了，区别就是从右往左了。

### 列表

方括号包含几个元素就是列表。

#### 列表的插入操作 

字符串和数组都不可以直接更改所以不存在这个问题，列表可以。其中列表还可以以一种定位在相同元素的区间的方法来实现插入操作，这个和之前理解的区间多少有点违和，不过考虑到定位在相同元素的区间本来就概念模糊，所以在这里就看作特例，视作在这个插入吧。

    list001=['one','two','three']
    list001[1:-2]=['four','five']
    print(list001)
    
    ['one', 'four', 'five', 'two', 'three']

extend方法似乎和列表之间的加法重合了，比如 `list.extend([4,5,6])`就和 `list=list+[4,5,6]`是一致的，而且用加法表示还可以自由选择是不是覆盖原定义，这实际上更加自由。

insert方法也就是列表的插入操作：

    >>> list = [1,2,3,4]
    >>> list.insert(0,5)
    >>> list
    [5, 1, 2, 3, 4]
    >>> list.insert(2,'a')
    >>> list
    [5, 1, 'a', 2, 3, 4]

#### append方法

python的append方法就是在最后面加**一个元素**，如果你append一个列表那么这一个列表整体作为一个元素。然后append方法会永久的改变了该列表对象的值。

<u>记住，append等等原处修改列表的方法都是没有返回值的。</u>

```text
>>> list = [1,2,3,4]
>>> list.append(5)
>>> list
[1, 2, 3, 4, 5]
```

如果你希望不改动原列表的附加，请使用加法来操作列表。

#### reverse方法

reverse方法不接受任何参数，直接将一个列表翻转过来。如果你希望不改变原列表的翻转，有返回值，请如下使用或者使用 `reversed`函数：

    >>> list
    [1, 2, 3, 4, 5]
    >>> listNew = list[::-1]
    >>> list
    [1, 2, 3, 4, 5]
    >>> listNew
    [5, 4, 3, 2, 1]

#### copy方法

copy方法复制返回本列表。其是浅复制，也就是里面如果有引入别处的变量的话，那么新复制出来的列表里面的该元素变量仍然指向原来的内存值。

##### sort方法

也就是排序，改变列表。默认是递增排序，可以用**reverse=True**来调成递减排序。

默认的递增排序顺序如果是数字那么意思是数字越来越大，如果是字符那么（似乎）是按照ACSII码编号递增来排序的。如果列表一些是数字一些是字符会报错。

    >>> list = ['a','ab','A','123','124','5']
    >>> list.sort()
    >>> list
    ['123', '124', '5', 'A', 'a', 'ab']

sort方法很重要的一个可选参数**key=function**，这个function函数就是你定义的函数（或者在这里直接使用lambda语句。），这个函数只接受一个参数，就是排序方法（在迭代列表时）接受的当前的那个元素。下面给出一段代码，其中tostr函数将接受的对象返回为字符，这样就不会出错了。

    def tostr(item):
        return str(item)
    
    list001 = ['a','ab','A',123,124,5]
    
    list001.sort(key=tostr)
    
    print(list001)
    
    [123, 124, 5, 'A', 'a', 'ab']

#### sorted函数

sorted函数在这里和列表的sort方法最大的区别是它返回的是而不是原处修改。其次sorted函数的第一个参数严格来说是所谓的可迭代对象，也就是说它还可以接受除了列表之外的比如等可迭代对象。至于用法他们两个差别不大。

    >>> sorted((1,156,7,5))
    [1, 5, 7, 156]
    >>> sorted({'andy':5,'Andy':1,'black':9,'Black':55},key=str.lower)
    ['Andy', 'andy', 'black', 'Black']

上面第二个例子调用了**str.lower**函数，从而将接受的item，这里比如说'Andy'，转化为andy，然后参与排序。也就成了对英文字母大小写不敏感的排序方式了。



#### reversed函数

前面提到过序列反转可以这样做:

    lst[::-1]

不过更加推荐的做法是直接用reversed函数来做，reversed函数返回的是个可迭代对象。

    string001='string'
    list001=['a','b','c']
    tuple001=(1,2,3,4)
    
    for x in [string001,list001,tuple001]:
        print(list(reversed(x)))
    
    ['g', 'n', 'i', 'r', 't', 's']
    ['c', 'b', 'a']
    [4, 3, 2, 1]

然后我们马上就想到，列表有 `reverse`
方法，其是破坏型的方法，然后类似的还有 `sort`
方法，破坏型的，其对应非破坏型方法有 `sorted`
。一般使用没有特别需求时都应该使用非破坏型方法，reversed，sorted等等。

#### 删除某个元素

-   赋空列表值，相当于所有元素都删除了。

-   pop方法：接受一个参数，就是列表元素的定位值，然后那个元素就删除了，方法并返回那个元素的值。如果不接受参数默认是删除最后一个元素。

-   remove方法：移除第一个相同的元素，如果没有返回相同的元素，返回错误。

-   del函数：删除列表中的某个元素。
```
    >>> list001=['a','b','c','d','e']
    >>> list001.pop(2)
    'c'
    >>> list001
    ['a', 'b', 'd', 'e']
    >>> list001.pop()
    'e'
    >>> list001
    ['a', 'b', 'd']
    >>> list001.remove('a')
    >>> list001
    ['b', 'd']
    >>> del list001[1]
    >>> list001
    ['b']
```
#### count方法

统计某个元素出现的次数。

    >>> list001=[1,'a',100,1,1,1]
    >>> list001.count(1)
    4

#### index方法

index方法返回某个相同元素的偏移值。

    >>> list001=[1,'a',100]
    >>> list001.index('a')
    1

#### 列表解析

我们来看下面这个例子：

    def square(n):
        return n*n
        
    print(list(map(square,[1,2,3,4,5])))
    print([square(x) for x in [1,2,3,4,5]])
    
    [1, 4, 9, 16, 25]
    [1, 4, 9, 16, 25]

map函数将某个函数应用于某个列表的元素中并生成一个map对象（可迭代对象），需要外面加上list函数才能生成列表形式。第二种方式更有python风格，是推荐使用的列表解析方法。

在python中推荐多使用迭代操作和如上的列表解析风格，因为python中的迭代操作是直接用c语言实现的。

##### 列表解析加上过滤条件

for语句后面可以跟一个if子句表示过滤条件，看下面的例子来理解吧：

    >>> [s*2 for s in ['hello','abc','final','help'] if s[0] == 'h']
    ['hellohello', 'helphelp']

这个例子的意思是列表解析，找到的元素进行乘以2的操作，其中过滤条件为字符是h字母开头的，也就是后面if表达式不为真的元素都被过滤掉了。

##### 完整的列表解析结构

下面给出一个完整的列表解析结构，最常见的情况一般就一两个for语句吧，这里if外加个括号是可选项的意思。

    [ expression for var1 in iterable1 [if condition1 ]
                        for var2 in iterable2 [if condition2 ]
                        ........
                                ]

这里的逻辑是从左到右第一个for语句就是最先执行的for语句，然后是第二个for语句跟着执行。

这里的iterable1是指某个可迭代对象，也就是说那些能够返回可迭代对象的函数比如map，filter，zip，range等函数都可以放进去。不过我们要克制自己在这里别写出太过于晦涩的程序了。还有for循环语句也别嵌套太多了，这样极容易出错的。

下面这个程序大家看看：

    >>> [x+str(y) for x in ['a','b','c'] for y in [1,2,3,4,5,6] if y & 1]
    ['a1', 'a3', 'a5', 'b1', 'b3', 'b5', 'c1', 'c3', 'c5']
    >>> [x+str(y) for x in ['a','b','c'] for y in [1,2,3,4,5,6] if not  y & 1]
    ['a2', 'a4', 'a6', 'b2', 'b4', 'b6', 'c2', 'c4', 'c6']



##### 列表解析的好处

在熟悉列表解析的语句结构之后，一两个for语句不太复杂的情况下，还是很简单明了的。同时语法也更加精炼，同时运行速度较for循环要至少快上一倍。最后python的迭代思想深入骨髓，以后python的优化工作很多都围绕迭代展开，也就是多用列表解析会让你的代码以后可能运行的更快。

有这么多的好处，加上这么cool的pythonic风格，推荐大家多用列表解析风格解决问题。

##### 元组的生成

这个时候需要明确加个括号表示这是一个元组对象。

    >>> [(x,x**2) for x in range(5)]
    [(0, 0), (1, 1), (2, 4), (3, 9), (4, 16)]

#### for语句中列表可变的影响

一般情况for迭代某个可迭代对象就是可迭代对象返回一个值然后利用这个值赋值并进行下面的操作，但是列表却是一个可变的东西，如果列表在操作中被修改了，情况会怎样呢？

    lst = [1,2,3,4,5]
    index = 0
    for x in lst:
        lst.pop(index)
        print(x)
    
    1
    3
    5

具体这个过程的细节我不清楚，但确定的是在这里for语句并没有记忆原列表，而只是记忆了返回次数或者偏移值。在实践中不要写出类似上面的变动的迭代循环风格，这样很容易出bug。

#### 列表元素替换

推荐用列表解析方法来实现列表元素的替换功能。

    def replace(x,a,b):
        if x == a:
            return b
        else:
            return x
    
    lst=[1,5,4,1,6]
    
    >>> [replace(i,1,'replaced') for i in lst]
    ['replaced', 5, 4, 'replaced', 6]

#### 列表元素去重

列表元素去重推荐用后来的set集合对象来处理之，其会自动去除重复的元素。

    >>> lst = [1,2,3,4,5,1,2,3,4,5]
    >>> [i for i in set(lst)]
    [1, 2, 3, 4, 5]

### 元组

圆括号包含几个元素就是元组(tuple)。元组和列表的不同在于元组是不可改变。元组也是从属于序列对象的，元组的很多方法之前都讲了。而且元组在使用上和列表极其接近，有很多内容这里也略过了。

值得一提的是如果输入的时候写的是*x,y*这样的形式，实际上表达式就加上括号了，也就是一个元组了*(x,y)*。

#### 生成器表达式

类似列表解析，如果元组在这里解析也是返回的元组吗？这里并不是如此，前面谈到python中一般表达式的圆括号是忽略了的，所以这里的元组解析表示式有个更专门的名字叫做生成器表达式，它返回的是生成器对象，和生成器函数具体调用之后返回的对象是一样的。生成器对象具有`__next__`方法，可以调用next函数。

    >>> x = [i for i in [1,2,3]]
    >>> x
    [1, 2, 3]
    >>> y = (i for i in [1,2,3])
    >>> y
    <generator object <genexpr> at 0xb70dbe8c>

### 字典

与列表一样字典是可变的，可以像列表一样引用然后原处修改，del语句也适用。

并非所有对象都可以做字典key，在python中所有的内置不可变对象都是可散列的，所有的可变对象都是不可散列的。而只有可散列的才可以做字典的key。可散列的对象具有：

- 具有 `__hash__` 方法，这样可以比较大小
- 具有 `__eq__` 方法，这样可以判断相等。

这里值得一提的就是元组是可以做字典的key的。首先说一下元组是如何比较大小的：

#### 元组和列表的比较大小

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
#### 创建字典

字典是一种映射，并没有从左到右的顺序，只是简单地将键映射到值。字典的声明格式如下：

    dict001={'name':'tom','height':'180','color':'red'}
    dict001['name']

或者创建一个空字典，然后一边赋值一边创建对应的键：

    dict002={}
    dict002['name']='bob'
    dict002['height']=195

##### 根据列表创建字典

如果是 `[['a',1],['b',2],['c',3]]` 这样的形式，那么直接用dict函数处理就变成字典了，如果是 `['a','b','c']`和 `[1,2,3]` 这样的形式那么需要用zip函数处理一下，然后用dict函数处理一次就变成字典了：

    >>> lst
    [['a', 1], ['b', 2], ['c', 3]]
    >>> dict001=dict(lst)
    >>> dict001
    {'a': 1, 'b': 2, 'c': 3}



#### 字典里面有字典

和列表的不同就在于字典的索引方式是根据"键"来的。

    dict003={'name':{'first':'bob','second':'smith'}}
    dict003['name']['first']

#### 字典遍历操作

字典特定顺序的遍历操作的通用做法就是通过字典的keys方法收集键的列表，然后用列表的sort方法处理之后用for语句遍历，如下所示：

    dict={'a':1,'c':2,'b':3}
    dictkeys=list(dict.keys())
    dictkeys.sort()
    for key in dictkeys:
        print(key,'->',dict[key])

**警告**：上面的例子可能对python早期版本并不使用，保险起见，推荐使用sorted函数，sorted函数是默认对字典的键进行排序并返回键的值组成的列表。

    dict={'a':1,'c':3,'b':2}
    >>> for key in sorted(dict):
    ...   print(key,'->',dict[key])
    ... 
    a -> 1
    b -> 2
    c -> 3

如果你对字典遍历的顺序没有要求，那么就可以简单的这样处理：

    >>> for key in dict:
    ...     print(key,'->',dict[key])
    ... 
    c -> 2
    a -> 1
    b -> 3

##### keys方法

收集键值，返回。

##### values方法

和keys方法类似，收集的值，返回。

    >>> dict001.values()
    dict_values([3, 1, 2])
    >>> list(dict001.values())
    [3, 1, 2]

##### items方法

和keys和values方法类似，不同的是返回的是(key,value)对的。

    >>> dict001.items()
    dict_items([('c', 3), ('a', 1), ('b', 2)])
    >>> list(dict001.items())
    [('c', 3), ('a', 1), ('b', 2)]

嗯，python2上面的三个方法是直接返回的列表，python3返回可迭代对象更节省计算资源些。



#### 字典的in语句

可以看到in语句只针对字典的键，不针对字典的值。

    >>> dict001={'a':1,'b':2,'c':3}
    >>> 2 in dict001
    False
    >>> 'b' in dict001
    True

#### 字典对象的get方法

get方法是去找某个键的值，为什么不直接引用呢，get方法的好处就是某个键不存在也不会出错。

    >>> dict001={'a':1,'b':2,'c':3}
    >>> dict001.get('b')
    2
    >>> dict001.get('e')

#### update方法

感觉字典就是一个小型数据库，update方法将另外一个字典里面的键和值覆盖进之前的字典中去，称之为更新，没有的加上，有的覆盖。

    >>> dict001={'a':1,'b':2,'c':3}
    >>> dict002={'e':4,'a':5}
    >>> dict001.update(dict002)
    >>> dict001
    {'c': 3, 'a': 5, 'e': 4, 'b': 2}

#### 字典按值排序

同样类似的有字典按值排序的方法 【参考了 [这个网页](http://www.cnpythoner.com/post/266.html) 】：

    >>> sorted({'andy':5,'Andy':1,'black':9,'Black':55}.items(),key=lambda i: i[1])
    [('Andy', 1), ('andy', 5), ('black', 9), ('Black', 55)]

这个例子先用字典的items方法处理返回(key,value)对的可迭代对象，然后用后面的lambda方法返回具体接受item的值，从而根据值来排序。

#### pop方法

pop方法类似列表的pop方法，不同引用的是键，而不是偏移地址，这个就不多说了。

#### 字典解析 

这种字典解析方式还是很好理解的。

    >>> dict001={x:x**2 for x in [1,2,3,4]}
    >>> dict001
    {1: 1, 2: 4, 3: 9, 4: 16}

##### zip函数创建字典

可以利用zip函数来通过两个可迭代对象平行合成一个配对元素的可迭代对象，然后用dict函数将其变成字典对象。

    >>> dict001=zip(['a','b','c'],[1,2,3])
    >>> dict001
    <zip object at 0xb7055eac>
    >>> dict001=dict(dict001)
    >>> dict001
    {'c': 3, 'b': 2, 'a': 1}

#### 深入理解字典的寻址

```python
t = {True: 'yes', 1: 'no', 1.0: 'maybe'}
t
Out[3]: {True: 'maybe'}
```

造成这样的结果首先是python的字典的key相同的判断机制，比如是 值相同 而且是 hash 值相同 才认为是 key相同。

其次是认为key相同key就不做改变了，而值是取最新的。也正是因为这样，下面的字典更新语句写法是可行的：

```
x = {'a':1, 'b':2}
y = {'b':3}
z = {**x, **y}
```

```
z
Out[8]: {'a': 1, 'b': 3}
```

而且这也是最快的字典更新方式。



### 集合

python实现了数学上的无序不重复元素的集合概念，在前面讨论列表去重元素的时候我们提到过正好可以利用集合的这一特性。

    >>> list001=[1,2,3,1,2,4,4,5,5,5,7]
    >>> {x for x in list001}
    {1, 2, 3, 4, 5, 7}
    >>> set(list001)
    {1, 2, 3, 4, 5, 7}

用集合解析的形式表示出来就是强调set命令可以将任何可迭代对象都变成集合类型。当然如果我们希望继续使用列表的话使用list命令强制类型转换为列表类型即可，不过如果我们在应用中确实一直需要元素不重复这一特性，就可以考虑直接使用集合作为主数据操作类型。

集合也是可迭代对象。关于可迭代对象可以进行的列表解析操作等等就不啰嗦了。下面介绍集合的一些操作。

#### 集合添加元素

**警告**：值得一提的是集合只能包括不可变类型，因此列表和字典不能作为集合内部的元素。元组不可变，所以可以加进去。

    >>> set001=set()
    >>> set001.add(1)
    >>> set001
    {1}
    >>> set001.add(2)
    >>> set001
    {1, 2}
    >>> set001.add(1)
    >>> set001
    {1, 2}

我们看到用集合的**add**方法添加，那些重复的元素是添加不进来的。

或者使用update方法一次更新多个元素：

    >>> set001=set('a')
    >>> set001.update('a','b','c')
    >>> set001
    {'b', 'a', 'c'}

#### 集合去掉某个元素

有两个集合对象的方法可以用于去掉集合中的某个元素，discard方法和remove方法，其中discard方法如果删除集合中没有的元素那么什么都不会发生，而remove方法如果删除某个不存在的元素那么会产生KeyError。

    >>> set001=set('hello')
    >>> set001.discard('h')
    >>> set001
    {'e', 'o', 'l'}
    >>> set001.discard('l')
    >>> set001
    {'e', 'o'}

remove方法与之类似就不做演示了。

#### 两个集合之间的关系

##### 子集判断

集合对象有一个issubset方法用于判断这个集合是不是那个集合的子集。

    >>> set001=set(['a','b'])
    >>> set002=set(['a','b','c'])
    >>> set001.issubset(set002)
    True

还有更加简便的方式比较两个集合之间的关系，那就是>，<，>=，<=，==这样的判断都是适用的。也就是set001是set002的子集，它的元素set002都包含，那么 `set001<=set002` ，然后真子集的概念就是 `set001<set002` 即不等于即可。

#### 两个集合之间的操作

下面的例子演示的是两个集合之间的交集：*&*，并集：*\|*，差集：*-*。

```text
>>> set001=set('hello')
>>> set002=set('hao')
>>> set001 & set002 #交集
{'o', 'h'}
>>> set001 | set002 #并集
{'h', 'l', 'a', 'e', 'o'}
>>> set001 - set002 #差集
{'e', 'l'}
```

类似的集合对象还有intersection方法，union方法，difference方法：

```text
>>> set001=set('hello')
>>> set002=set('hao')
>>> set001.intersection(set002) #交集
{'h', 'o'}
>>> set001.union(set002) #并集
{'e', 'a', 'h', 'o', 'l'}
>>> set001.difference(set002) #差集
{'e', 'l'}
```

#### clear方法

将一个集合清空。

#### copy方法

类似列表的copy方法，制作一个集合copy备份然后赋值给其他变量。

#### pop方法

无序弹出集合中的一个元素，直到没有然后返回KeyError错误。

### bytes类型

#### 基本编码知识

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

#### 使用方法

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

### 文件

文件对象是可迭代对象。

#### 写文件

对文件的操作首先需要用**open**函数创建一个文件对象，简单的理解就是把相应的接口搭接好。文件对象的**write**方法进行对某个文件的写操作，最后需要调用**close**方法写的内容才真的写进去了。

    file001 = open('test.txt','w')
    file001.write('hello world1\n')
    file001.write('hello world2\n')
    file001.close()

如果你们了解C语言的文件操作，在这里会为python语言的简单便捷赞叹不已。就是这样三句话：创建一个文件对象，然后调用这个文件对象的wirte方法写入一些内容，然后用close方法关闭这个文件即可。

#### 读文件

一般的用法就是用**open**函数创建一个文件对象，然后用**read**方法调用文件的内容。最后记得用**close**关闭文件。

    file001 = open('test.txt')
    filetext=file001.read()
    print(filetext)
    file001.close()

此外还有**readline**方法是一行一行的读取某文件的内容。

#### open函数的处理模式

open函数的处理模式如下：

'r'

:   默认值，read，读文件。

'w'

:   wirte，写文件，如果文件不存在会创建文件，如果文件已存在，文件原内容会清空。

'a'

:   append，附加内容，也就是后面用write方法内容会附加在原文件之后。

'b'

:   处理模式设置的选项，'b'不能单独存在，要和上面三个基本模式进行组合，比如'rb'等，意思是二进制数据格式读。

'+'

:   处理模式设置的选项，同样'+'不能单独存在，要和上面三个基本模式进行组合，比如'r+'等，+是updating更新的意思，也就是既可以读也可以写，那么'r+'，'w+'，'a+'还有什么区别呢？区别就是'r+'不具有文件创建功能，如果文件不存在会报错，然后'r+'不会清空文件，如果'r+'不清空文件用write方法情况会有点复杂；而'w+'具有文件创建功能，然后'w+'的write方法内容都是重新开始的；而'a+'的write方法内容是附加在原文件上的，然后'a+'也有文件创建功能。

#### 用with语句打开文件

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


## 函数

函数也是一个对象，叫函数对象。函数名和变量名一样都是引用，函数名后面带个括号才真正实际执行。比如下面不带括号就只是返回了对这个函数对象的引用地址。

    >>> print
    <built-in function print>

要理解函数也是一个对象，比如在下面的例子中，fun刚开始是一个函数列表，然后在for的迭代语句里，意思具体就是multiply这个函数对象，然后接下来又是plus这个函数对象。整个过程是对x\*a然后再加上b。即$a*x +b$

    x = 3
    
    def multiply(x,a):
        return x*a
    
    def plus(x,b):
        return x+b
    
    fun = [multiply , plus]
    para = [3,2]
    for fun,para in zip(fun,para):
        x = fun(x,para)
    print(x)



### 自定义函数

定义函数用def命令，语句基本结构如下：

    def yourfunctionname(para001,para002...):
        do something001
        do something002

### 参数传递问题

函数具体参数的值是通过赋值形式来传递的，这有助于理解后面的不定变量函数。而函数的参数名是没有意义的，这个可以用lambda函式来理解之，def定义的为有名函数，有具体的引用地址，但内部作用原理还是跟lambda无名函式一样，形式参数名是x啊y啊都无所谓。为了说明这点，下面给出一个古怪的例子：

    y=1
    def test(x,y=y):
        return x+y
    print(test(4))

输出结果是5。我们看到似乎函数的形式参数y和外面的y不是一个东西，同时参数的传递是通过赋值形式进行的，那么具体是怎样的呢？具体的解释就是函数的形式参数y是这个函数自己内部的**本地变量**y，和外面的y不一样，更加深入的理解请看下一节（变量作用域问题）。

然后还有：

    >>> x=[1,2,3]
    >>> for x in x:
    ...  print(x)
    ... 
    1
    2
    3

我们知道for语句每进行一次迭代之前也进行了一次赋值操作，所以for语句里面刚开始定义的这个x和外面的x也不是一个东西，刚开始定义的x也是for语句内部的**本地变量**。

想到这里我又想起之前编写removeduplicate函数遇到的一个问题，那就是for语句针对列表这个可变的可迭代对象的工作原理是如何的？具体请看下面的例子：

    >>> lst=[1,2,3,4]
    >>> for x in lst:
    ...  print(x,lst)
    ...  del lst[-1]
    ... 
    1 [1, 2, 3, 4]
    2 [1, 2, 3]

可迭代对象的惰性求值内部机制在我看来很神奇，目前还不太清楚，但从这个例子看来列表的惰性求值并没有记忆内部的数值，只是记忆了（合情合理），然后如果迭代产生了StopIteration异常就终止。

### 变量作用域问题

python的变量作用域和大部分语言比如c语言或lisp语言的概念都类似，就是函数里面是局部变量，一层套一层，里面可以引用外面，外面不可以引用里面。

具体实现机制是每个函数都有自己的命名空间，（和模块类似）就好像一个盒子一样封装着内部的变量。所谓的本地变量和函数有关，或者其他类似的比如for语句；所谓的全局变量和模块有关，更确切的表述是和文件有关，比如说在现在这个文件里，你可以通过导入其他模块的变量名，但实际上模块导入之后那些变量名都引入到这个文件里面来了。

具体实现和类的继承类似也是一种搜索机制，先搜索本地作用域，然后是上一层(def，lambda，for)的本地作用域，然后是全局作用域，然后是内置作用域。更加的直观的说明如下图所示：

![img]({static}/images/python/python-bian-liang-zuo-yong-yu.png)

简单来说python的变量作用域问题就是：盒子套盒子，搜索是从盒子最里面然后往外面寻找，里面可以用外面的变量，外面的不可以用里面的。

#### 内置作用域

内置作用域就是由一个`__builtin__`模块来实现的，python的作用机制最后会自动搜索这个内置模块的变量。这个内置模块里面就是我们前面学习的那些可以直接使用的函数名，比如print，range等等之类的，然后还有一些内置的异常名。

所以我们想到即使对于这些python的内置函数我们也是可以覆盖定义的，事实确实如此：

    >>> abs(-3)
    3
    >>> def abs(x):
    ...  print(x)
    ... 
    >>> abs(3)
    3
    >>> abs(-3)
    -3

以后学习单元测试会接触到mock的概念，其作用机制大体也与之类似就是覆盖掉之前定义的某个对象。

#### global命令

如果希望函数里面定义的变量就是全局变量，在变量声明的时候前面加上**global**命令即可。

通常不建议这么做，除非你确定需要这么做，然后你需要写两行代码才能实现，意思也是不推荐你这么做。

    def test():
        global var
        var= 'hello'
    test()
    print(var)
    
    hello

而且就算你这样做了，这个变量也只能在本py文件中被引用，其他文件用不了。推荐的做法是另外写一个专门用于配置参数的config.py文件，然后那些全局变量都放在里面，如果某个文件要用，就import进来。而对与这个config.py文件的修改会影响所有的py文件配置，这样让全局变量可见可管可控更加通用，才是正确的编程方式。

#### nonlocal命令

nonlocal命令python3之后才出现，这里实现的概念有点类似于lisp语言的闭包(closure技术)，就是如果你有某个需要，需要函数记忆一点自己的状态，同时又不想这个状态信息是全局变量，也不希望用类的方式来实现，那么就可以用nonlocal命令来简单地完成这个任务。

global意味着命名只存在于一个嵌套的模块中，而nonlocal的查找只限于嵌套的def中。要理解nonlocal首先需要理解函数里面嵌套函数的情况------也就是所谓的工厂函数，一个函数返回一个函数对象。比如说

    def add(x):
        x=x
        def action(y):
            return x+y
        return action
    
    >>> add1=add(1)
    >>> add1(5)
    6
    >>> add2=add(2)
    >>> add2(5)
    7

这里的return action是返回一个函数对象，这样add1的实际接口是`def action`那里。熟悉lisp语言的明白，action外面的那个函数的变量叫做自由变量，不过嵌套函数在这里可以引用自由变量。如果我们声明`nonlocal x`，那么就可以修改嵌套函数外面声明的变量了。

    def add(x):
        x=x
        def action(y):
            nonlocal x
            x=x+1
            return x+y
        return action
    
    >>> add2=add(2)
    >>> add2(5)
    8
    >>> add2(5)
    9
    >>> add2(5)
    10

然后我们看到这个生产出来的函数具有了运行上的状态性，实际上通过类也能构建出类似的效果，不过对于某些问题可能闭包方式处理显得更适合一些。

下面给出一个稍微合理点的例子：

    def myrange(n):
        i=n
        def action():
            nonlocal i
            while i>0:
                i=i-1
                return i
        return action
    
    >>> myrange5=myrange(5)
    >>> myrange5()
    4
    >>> myrange5()
    3
    >>> myrange5()
    2
    >>> myrange5()
    1
    >>> myrange5()
    0
    >>> myrange5()
    >>> 

下面给出类似的类的实现方法：

    class myrange:
        def __init__(self,n):
            self.i=n
        def action(self):
            while self.i > 0:
                self.i -= 1
                return self.i
    
    >>> myrange5=myrange(5)
    >>> 
    >>> myrange5.action()
    4
    >>> myrange5.action()
    3
    >>> myrange5.action()
    2
    >>> myrange5.action()
    1
    >>> myrange5.action()
    0
    >>> myrange5.action()
    >>> 

我们看到从编码思路上基本上没什么差异，可以说稍作修改就可以换成类的实现版本。推荐一般使用类的实现方法。但有的时候可能用类来实现有点不伦不类和大材小用了。这里就不做进一步讨论了，闭包思想是函数编程中很重要的一个思想，学习了解一下也好。

### 参数和默认参数

定义的函数圆括号那里就是接受的参数，如果参数后面跟个等号，来个赋值语句，那个这个赋的值就是这个参数的默认值。比如下面随便写个演示程序：

    def test(x='hello'):
        print(x)
    test()
    test('world')
    
    hello
    world

### 不定参量函数

我们在前面谈到sum函数只接受一个列表，而不支持这样的形式：sum(1,2,3,4,5)。现在我们设计这样一个可以接受不定任意数目参量的函数。首先让我们看看一种奇怪的赋值方式。

#### 序列解包赋值

**NOTICE:**
python2不支持本小节讨论的序列解包赋值。不过python2的函数定义中是支持
`*args` 这种写法的。

    >>> a,b,*c=1,2,3,4,5,6,7,8,9
    >>> print(a,b,c,sep=' | ')
    1 | 2 | [3, 4, 5, 6, 7, 8, 9]
    >>> a,*b,c=1,2,3,4,5,6,7,8,9
    >>> print(a,b,c,sep=' | ')
    1 | [2, 3, 4, 5, 6, 7, 8] | 9
    >>> *a,b,c=1,2,3,4,5,6,7,8,9
    >>> print(a,b,c,sep=' | ')
    [1, 2, 3, 4, 5, 6, 7] | 8 | 9

带上一个星号\*的变量变得有点类似通配符的味道了，针对后面的序列（数组，列表，字符串），它都会将遇到的元素收集在一个列表里面，然后说是它的。

for语句也支持序列解包赋值，也是将通配到的的元素收集到了一个列表里面，如：

    for (a,*b,c) in [(1,2,3,4,5,6),(1,2,3,4,5),(1,2,3,4)]:
        print(b)
    
    [2, 3, 4, 5]
    [2, 3, 4]
    [2, 3]

#### 函数中的通配符

    >>> def test(*args):
    ...  print(args)
    ... 
    >>> test(1,2,3,'a')
    (1, 2, 3, 'a')

我们看到类似上面序列解包赋值中的带星号表通配的概念，在定义函数的时候写上一个带星号的参量（我们可以想象在函数传递参数的时候有一个类似的序列解包赋值过程），在函数定义里面，这个args就是接受到的参量组成的*元组*。

#### mysum函数

    def mysum(*args):
        return sum(args[:])
    
    print(mysum(1,2,3,4,5,6))
    
    21

这样我们定义的可以接受任意参数的mysum函数，如上所示。具体过程就是将接受到的args（已成一个元组了），然后用sum函数处理了一下即可。

#### 任意数目的可选参数

在函数定义的写上带上两个星号的变量\*\*args，那么args在函数里面的意思就是接受到的可选参数组成的一个字典值。

    >>> def test(**args):
    ...  return args
    ... 
    >>> test(a=1,b=2)
    {'b': 2, 'a': 1}

我们看到利用这个可以构建出一个简单的词典对象生成器。

#### 解包可迭代对象传递参数

之前\*args是在函数定义中，然后通配一些参数放入元组中。这里是在函数调用中，针对可迭代对象，可以用一个\*星号将其所包含的元素迭代出来，然后和参数一一对应赋值。

    >>> map = map(lambda x:x+2,[1,2,3])
    >>> print(*map)
    3 4 5
    >>> print(*[1,2,3])
    1 2 3

##### 最简单的打印文件命令

前面说到文件也是一个可迭代对象，然后如果在这里解包文件对象将是一个最简单的打印文件命令，简单得惊天地泣鬼神了\...

    print(*open('test.py'))

#### 解包字典成为关键字参数

和上面的类似，通过\*\*args语法可以将某个字典对象解包成为某个函数的关键字参数。还是以上面那个函数f为例子：

    >>> def f(a,b,c=3):
    ...  print(a,b,c)
    >>> f(**{'c':6,'b':4,'a':2})
    2 4 6
    >>> f(1,2,5)
    1 2 5

这个例子也告诉我们不是可选参数的a和b同样也可以通过这种字典形式复制。

### 参数的顺序

老实说一般参数，可选参数（关键字参数），任意（通配）参数，任意（通配）关键字参数所有这些概念混在一起非常的让人困惑。就一般的顺序是：

1.  一般参数，这个如果有 ，然后通过位置一一对应分配参数。

2.  关键字参数，匹配一些关键字参数。

3.  通配一般参数，其他额外的非关键字的参数分配到\*args元组里面。

4.  通配关键字参数，其他额外的关键字参数分配到\*\*kwargs字典里面， 。

具体如下所示：

    def test(x, y, c=1, d=1, *args, **kwargs):
        print(x, y, c, d, args, kwargs)

这种写法也是python2和python3兼容的。然后python3又新加入了一个keyword-only参数（读者记住这不是关键字参数就行了），如下所示：

    def test(x, y, c=1, d=1, *args, z=None ,**kwargs):
        print(x, y, c, d,args, kwargs,z)

首先强调一点，python2里面没有这个东西，所以要考虑python2和python3兼容性的不用太关注这个东西了。看上面的例子，这个keyword-only参数是个极容易和keyword参数或者我们常说的关键字参数混淆的东西，这个keyword-only参数也确实是类似关键字参数，但它不能像常规的关键字参数那样按照位置赋值，而必须明确的指定名字赋值。

这个keyword-only参数的标志就是跟在那个星号后面。如下所示，你也别把那个z认为是个一般参数了，它只是一个还没有赋予默认值的keyword-only参数。

    def test(x, y, c=1, d=1, *args, z ,**kwargs):
        print(x, y, c, d,args, kwargs,z)

然后有的人就只想用keyword-only参数，对具体通配一般参数根本不感兴趣，会这样写：

    def test(x, y, c=1, d=1, *, z ,**kwargs):
        print(x, y, c, d,args, kwargs,z)

这样写的话就没有通配一般参数了，这样上面这个函数最多只能接受4个不指定名字的参数，x，y两个，c和d这两个关键字参数也可以匹配两个。

#### keyword-only参数的用处

keyword-only的参数的用处就是其是一个不能通过不指定名字而赋值的关键字参数，或者说如果你需要某个关键字参数在后面的使用中必须明确给出名字来使用，那么就可以使用keyword-only参数。

只是有一点，python2不支持这个东西，python2要实现类似的效果要通过
`**kwargs` 还有后面写上一些甚至很多行代码才行，如下所示：

    def test(x, y, **kwargs):
        a = kwargs.pop('a')
        b = kwargs.pop('b', False) # 第二个参数得到默认参数的效果
        
        if kwargs:
            raise TypeError(Unexpected kwargs: {0}'.format(kwargs))

异常信息随便写的，在这里不是重点。

### 生成器函数

一般函数的定义使用return语句，如果使用yield语句，我们可以构建出一个生成器函数，

```text
>>> def test(x):
...    for i in range(x):
...        yield 2*i+ 1
... 
>>> test(3)
<generator object test at 0xb704348c>
>>> [x for x in test(3)]
[1, 3, 5]
>>> [x for x in test(5)]
[1, 3, 5, 7, 9]
```

生成器函数返回的是生成器对象（generator object），通过yield这样的形式定义出来的生成器函数返回了一个生成器对象和range对象类似，都是描述性可迭代对象，里面的元素并不立即展开，而是请求一次运算一次，所以这种编程风格对内存压力很小，主要适合那些迭代元素特别多的时候的情况吧。

上面的test函数我们就可以简单理解为 `2x+1` ，其中` 0<=x<n`（赋的值）。

下面给出一个问题作为练习：描述素数的生成器函数。
这是网上流行的素数检验函数，效率还是比较高的了。

    def isprime(n):
        if n ==2:
            return True
        #按位与1，前面一定都是0个位数如果是1则
        #是奇数则返回1则真则假，如果是偶数则返回
        #0则假则真
        elif n<2 or not n & 1:
            return False
        #埃拉托斯特尼筛法...
    #查一个正整数N是否为素数，最简单的方法就是试除法，
    #将该数N用小于等于N**0.5的所有素数去试除，
    #若均无法整除，则N为素数
        for x in range(3,int(n**0.5)+1,2):
            if n % x == 0:
                return False
        return True

然后我们给出两种形式的素数生成器函数，其中prime2的意思是范围到（to）那里。而prime(n)的意思是到第几个素数。我们知道生成器函数是一种惰性求值运算，然后yield每迭代一次函数运算一次（即产生一次yield），但这种机制还是让我觉得好神奇。

    def prime2(n):
        for x in range(n):
            if isprime(x):
                yield x
    
    def prime(n):
        i=0
        x=1
        while i<n:
            if isprime(x):
                i +=1
                yield x
            x +=1

在加载这些函数之后我们可以做一些检验：

    >>> isprime(479)
    True
    >>> [x for x in prime2(100)]
    [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, ........]
    >>> [x for x in prime2(1000) if 100< x < 200]
    [101, 103, 107, 109, 113, 127, 131, 137, 139, 149, .......]
    >>> len([x for x in prime2(10000) if -1 < x < 3572])
    500
    >>> [x for x in prime(1)]
    [2]
    >>> [x for x in prime(2)]
    [2, 3]

### 递归函式 

虽然递归函式能够在某种程度上取代前面的一些循环或者迭代程序结构，不过不推荐这么做。这里谈及递归函式是把某些问题归结为数学函数问题，而这些问题常常用递归算法更加直观（不一定高效）。比如下面的菲波那奇函数：

    def fib(n):
        if n==0:
            return 1
        if n==1:
            return 1
        else:
            return fib(n-1)+fib(n-2)
            
    for x in range(5):
        print(fib(x))
    
    1
    1
    2
    3
    5

我们可以看到，对于这样专门的数学问题来说，用这样的递归算法来表述是非常简洁易懂的。至于其内部细节，我们可以将上面定义的fib称之为函式，函式是一种操作的模式，然后具体操作就是复制出这个函式（函数或者操作都是数据），然后按照这个函式来扩展生成具体的函数或者操作。

下面看通过递归函式来写阶乘函数，非常的简洁，我以为这就是最好最美的方法了。

    def fact(n):
        if n == 0:
            return 1
        else:
            return n*fact(n-1)
            
    print(fact(0),fact(10))
    
    1 3628800

#### 什么时候用递归？

最推荐使用递归的情况是这样的情况，那就是一份工作（或函数）执行一遍之后你能够感觉到虽然所有的工作没有做完，但是已经做了一小部分了，有了一定的进展了，就好比是蚂蚁吞大象一样，那么这个时候你就可以使用递归思想了。其次有的时候有那么一种情况虽然表面上看似乎并没有什么进展，但事情在发展，你能感受到有一个条件最终将会终止程序从而得到一个输出，那么这个时候就可以用递归。

递归思想最核心的两个概念就是一做了一小部分工作，你能感觉到做着做着事情就会做完了；二有一个终止判断最终将会起作用。

其实通过递归函式也可以实现类似for的迭代结构，不过我觉得递归函式还是不应该滥用。比如下面通过递归函式生成一种执行某个操作n次的结构：

    def dosomething(n):
        if n==0:
            pass
        elif n==1:
            print('do!')
        else:
            print('do!')
            return dosomething(n-1)
    
    print(dosomething(5))
    
    do!
    do!
    do!
    do!
    do!
    None

可以看到，如果把上面的print语句换成其他的某个操作，比如机器人向前走一步，那么这里dosomething换个名字向前走(5)就成了向前走5步了。

#### lisp的car-cdr递归技术

在lisp语言中，
car-cdr递归技术是很重要的一门技术，它的特长就是遍历随意嵌套的列表结构可以同一对列表中的每一个元素执行某种操作。

首先我们来看下面的例子，一个把任意嵌套列表所有元素放入一个列表中的函数：

    lst = [[1,2,[3]],[4,[5,[[[[10],11]]]],(1,2,3)],[{'a','b','c'},8,9]]
    
    def is_list(thing):
        return isinstance(thing, list)
    
    def flatten(iter):
        templst = []
        for x in iter:
            if not is_list(x):
                templst.append(x)
            else:
                templst += flatten(x)
        return templst
    
    print(flatten(lst))
    
    [1, 2, 3, 4, 5, 10, 11, (1, 2, 3), {'c', 'b', 'a'}, 8, 9]

这个函数的逻辑是如果是最小元素对象不是列表，那么收集进列表；如果不是，那么把它展开，这里就是调用的原函数继续展开函式。

上面的例子严格意义上来讲还不算lisp的经典car-cdr递归技术，下面给出一个典型的例子，就是复制任意嵌套结构的列表。当然列表的copy方法就可以做这个工作，这里主要通过这个例子来进一步深入car-cdr技术。

    def is_list(thing):
        return isinstance(thing, list)
    
    def copy_list(lst):
        if  not  is_list(lst):
            return lst
        elif lst == []:
            return []
        else:
            return [copy_list(lst[0])] + copy_list(lst[1:])
    
    print(copy_list([1,[2,6],3]))

这种嵌套列表的复制以及后面的修改等等操作，最合适的就是lisp的car-cdr技术了，但我不得不承认，这种递归写法是递归函式里面最难懂的了。

不管怎么严格，在这个基础之上，因为第一个if
not的语句中传递下来的lst实际上已经是非列表的其他元素了，然后我们可以进行一些其他修改操作，这样在保持原列表的复杂嵌套的基础上，等于遍历的对列表中的所有元素进行了某种操作。

比如所有元素都平方：

    def square(x):
        return x**2
    
    def square_list(lst):
        if  not  is_list(lst):
            return square(lst)
        elif lst == []:
            return []
        else:
            return [square_list(lst[0])] + square_list(lst[1:])
    
    print(square_list([1,[2,6],3]))

我们可以想像更加复杂功能的函数作用于列表中所有的元素同时又不失去原列表复杂的嵌套结构，lisp的car-cdr这种技术了解一下吧，但是不是一定要使用复杂的嵌套结构呢？也许没有必要吧。。

### lambda函式

python中的函数作为一个对象一般是通过 `def` 语句来定义的，定义之后该函数对象和函数名变量已经绑定在一起了。但实际上python中的函数作为一个对象名字不是那么重要的：

```
def add(x,y):
...     return x+y
... 
add
<function add at 0x000001B952B770D0>

add2 = add
del add
add2(1,2)
3
add
Traceback (most recent call last):
  File "<input>", line 1, in <module>
NameError: name 'add' is not defined
add2.__name__
'add'
```

而lambda λ表达式可以简单理解为没有名字的函数对象：

```
add = lambda x,y: x+y
add
<function <lambda> at 0x000001B952B77378>
add.__name__
'<lambda>'
add(1,2)
3
type(add)
<class 'function'>
type(add2)
<class 'function'>
```

如上所示我们看到，不管是通过def定义的函数还是lambda函式在python里面都是函数对象，或者说都属于function class。具体调用和使用也很类似，除了lambda函数定义的函数对象那个 `__name__` 只是默认的 `<lambda>` 。

lambda函数在某些地方会用到，一般是在将函数作为参数传递的情况下，某些简短的函数动作没必要另外再想个函数名字的应用场景。

### print函数

print函数接受任意的参量，逐个打印出来。然后它还有一些关键字参数：

- **sep**：默认值是 `' '` ，也就是一个空格，如果修改为空字符串，那么逐个打印出来的字符之间就没有间隔了。
- **end**：默认值是 `'\n'` ，为print函数执行完打印的字符，默认是打印一个换行符。
- **file**默认值是 `sys.stdout` ，也就是在终端显示，你可以修改为某个文件变量，这样直接往某个文件里面输出内容。

## 逻辑

### 布尔值

boolean类型，和大多数语言一样，就两个值：**True**，**False**。然后强制类型转换使用函数**bool**。

#### 其他逻辑小知识

在python中，有些关于逻辑真假上的小知识，需要简单了解下。

-   数0、空对象或者其他特殊对象None值都认为是假

-   其他非零的数字或非空的对象都认为是真

-   前面两条用bool函数可以进行强制类型转换

-   比较和相等测试会递归作用在数据结构中

-   比较和相等测试会返回True或False

上面最后两条在说个什么东西，读者请参看之前的元组和列表比较大小一小节。

#### None

有些函数没有return的值就会返回None值，None值是NoneType对象中的一个值，和列表的空值等是不同的，它和其他任何值都不一样的。比如re.search如果没有找到匹配就会返回None值。这个时候需要知道的是None值在逻辑上是逻辑假，not
None是逻辑真。

    >>> def f():
    ...  pass
    ... 
    >>> y = f()
    >>> y
    >>> type(y)
    <class 'NoneType'>

### if条件判断

python中的条件语句基本格式如下：

    if  test:
        条件判断执行区块

也就是if命令后面跟个条件判断语句，然后记住加个冒号，然后后面缩进的区块都是条件判断为真的时候要执行的语句。

    if  test:
        do something001
    else :
        do something002

这里的逻辑是条件判断，如果真，do something001；如果假，do something002。

    if  test001:
        do something001
    elif test002:
        do something002

显然你一看就明白了，elif是else和if的结合。

#### 逻辑与或否

and表示逻辑与，or表示逻辑或，not表示逻辑否。

下面编写一个逻辑，判断一个字符串，这个字符串开头必须是a或者b，结尾必须是s，倒数第二个字符不能是单引号'。在这里就演示一下逻辑。。

    x='agais'
    if ((x[0] == 'a' or x[0] == 'b')
        and x[-1] =='s'
        and (not x[-2] =="'")):
        print('yes it is..')
    
    yes it is..

#### 稍复杂的条件判断

现在我们了解了if，elif和else语句，然后还了解了逻辑与或非的组合判断。那么在实际编程中如何处理复杂的条件逻辑呢？

首先能够用逻辑语句"与或非"组合起来的就将其组合起来，而不要过分使用嵌套。如下面代码所示，如果一个情况分成两部分，那么就用if\...else\...语句，

    x=-2
    if x>0:
        print('x大于0')
    else:
        print('x小于0')

而如果一个情况分成三部分，那么就用if\...elif\...else语句。同一深度的这些平行语句对应的是"或"逻辑，或者说类似其他编程语言的switch语句。

    x=2
    if x>0:
        print('x大于0')
    elif x<0:
        print('x小于0')
    else:
        print('x等于0')

我们再看一看下面的代码，这个代码是*错误的*，两个if语句彼此并不构成逻辑分析关系。

    x=2
    if x>0:
        print('x大于0')
    if x<0:
        print('x小于0')
    else:
        print('x等于0')

然后我们看到下面的代码，这个例子演示的是在加深一个深度的条件判断语句它当时处于的逻辑判断情况，这个语句的条件判断逻辑是本语句的判断逻辑再和左边（也就是前面）的判断逻辑的"与"逻辑，或者说成是"交集"。比如说 `print('0<x<2')` 这个语句就是本语句的判断逻辑 `x<2`和上一层判断逻辑 `x>0` 的"交集"，也就是 `0<x<2`。

    x=-2
    if x>0:
        print('x大于0')
        if x>2:
            print('x>2')
        elif x<2:
            print('0<x<2')
        else:
            print('x=2')
    elif x<0:
        print('x小于0')
    else:
        print('x等于0')

整个过程的情况如下图所示：

![img]({static}/images/python/fu-za-tiao-jian-pan-duan.png "复杂条件判断")

为了在编程的时候对处于何种判断逻辑之下有一个清晰的认识，强烈建议读者好好思考一下。毕竟磨刀不误砍柴功。

#### try语句捕捉错误

try语句是编程中用来处理可能出现的错误或者已经出现但并不打算应付的错误最通用的方式。比如一个变量你预先想的是接受一个数值，但是用户却输入了一个字符，这个时候你就可以将这段语句包围在try里面；或者有时你在编程的时候就发现了这种情况，只是懒得理会他们，那么简单的把这块出错的语句包围在try里面，然后后面跟个except语句，打印出一个信息"出错了"，即可。用法如下所示：

    while True:
        x=input('请输入一个数，将返回它除以2之后的数值\n输入"quit"退出\n')
        if x=='quit':
            break
        try :
            num=float(x)
            print(num/2)
        except:
            print('出错了')

##### 异常处理完整语句

    try:
        yourCode
    except yourError:
        do something
    except yourError2:
        do something2
    ......
    else:
        do somethingN
    finally:
        do the funallystuff

这个语句的逻辑是试着执行try区块下的语句，如果出现异常，那么看是不是异常yourError，如果是则执行do
something，如果是yourError2，则执行do something2
\...\...等等，如果没有异常，则执行else字句: do
somethingN，如果还有异常，则这个异常将会返回（更上面的控制程序）。

那么finally语句的作用是什么呢，finally语句实际上和整个语句中异常判断情况没有关系，不管有没有异常发生，最后它都将被执行。和简单地不缩进直接写在下面的语句比起来，finally语句的特点就是就算程序发生异常了，它也会先被执行，然后将异常上传给上面的控制程序。

else语句和finally语句是可选的，根据具体情况来看。

##### for里面放try语句的情况

for语句里面放上try语句还需要细讲一下。

具体try语句相关逻辑前面说过了，这里的问题是for语句的继续执行问题。首先是第一个情况，try字句里面使用return，这在函数里面是会跳出for语句的，也就是执行多次只要成功一次就会被跳出。然后错误捕捉，如果错误捕捉里面再放入一个raise语句，再抛出一个错误，这个时候for语句是会被中止的。然后抛出这个异常。然后是else字句，其逻辑是try多次没有错误，那么将会执行else字句，但是如果你try一次，然后else语句里面加入break命令，则会跳出for语句的。

这里面情况稍微有点复杂，目前我接触到的有如下两种应用:

这是一个mongodb的安全调用的函数装饰器。其在试图调用mongodb的时候，如果发生AutoReconnect异常，那么将会sleep一秒然后再去try
之前的那个调用函数。如果成功了，那么进入return，然后自然就跳出for语句了。

    def safe_mongocall(call):
        '''mongodb replica set assistant'''
        def _safe_mongocall(*args, **kwargs):
            for i in xrange(100):#
                try:
                    return call(*args, **kwargs)
                except pymongo.AutoReconnect:
                    import time
                    time.sleep(1)
                    print("try to connect mongodb again...")
        return _safe_mongocall

第二个例子较为常用，就是在重复做某件事的时候可能会发生错误，然后捕捉这个错误，然后继续执行。然后捕捉的时候计了一下数。

    def test():
        failcount = 0
    
        for i in range(src_count):
            try:
                do something
            except Exception as ex:
                failcount += 1
    
        sucess_count = src_count - failcount
        return sucess_count

其实我们还可以想到另外一种程序结构，那就是try和else在for语句里面构成逻辑分支。当你试着做某件事的时候，try，如果正常则执行else字句然后break，如果发生某个异常则执行异常中的字句，就是try里面的内容不被执行。这有点反常规，但联系实际生活，我们确实也存在这样的逻辑，那就是假想如何如何，发生错误不行则执行else字句，就是假想try里面的内容不实际执行。

#### in语句

in语句对于可迭代对象都可以做出是否某个元素包含在某个对象之中的判断。

```text
>>> 'a' in ['a',1,2]
True
>>> dict
{'a': 1, 'c': 2, 'b': 3, 'd': 4}
>>> 'e' in dict
False
>>> '2' in dict
False
```

从上面例子可以看到，一般的列表判断元素是否存在和我们之前预料的一致，关于字典需要说的就是in语句，不判断值。

### for迭代语句

一般有内部重复操作的程序可以先考虑for迭代结构实现，实在不行才考虑while循环结构，毕竟简单更美更安全。

python的for迭代语句有点类似lisp语言的dolist和dotimes函数，具体例子如下：

    for x in 'abc':
        print(x)
    
    a
    b
    c

in后面跟的是**序列**类型，也就是字符串，列表，数组都是可以的。这个语句可以看作先执行x='a'或者类似的匹配赋值操作，然后执行缩进的区块，后面依次类推。

#### else分句

    for x in 'abc':
        if x == 'b':
            print(x)
            break
    else:
        print('test')

for语句加上else分句这种形式，如果for迭代完了就会执行else分句。但如果for语句还在迭代过程中，break或者return出来了，那么else分句将不会被执行。

#### range函数

range函数常和for迭代语句一起使用，其返回一个可迭代对象。

    range(1,10,2)

range函数的用法如上，表示从1开始到10，步长为2，如果用list函数将其包裹，将会输出\[1,3,5,7,9\]。如果不考虑步长的话。所以range(10)就可以看作\[0,10)，range(1,10)就可以看作\[1,10)。但是在这里再加上步长的概念和区间的概念又有所不同了。

    for x in range(-10,-20,-3):
        print(x)
    
    -10
    -13
    -16
    -19

上面例子还演示了range的负数概念，这里如果用区间概念来考察的话，是不能理解的，之所以行得通，是因为它的步长是负数，如果不是负数，那么情况就会和之前讨论的结果类似，将是一个空值。

#### 迭代加上操作

迭代产生信息流并经过某些操作之后生成目标序列。

    >>> squares=[x**2 for x in [1,2,3,4,5]]
    >>> squares
    [1, 4, 9, 16, 25]

#### enumerate函数

enumerate函数返回一个enumerate对象，这个对象将偏移值和元素组合起来，成为一个可迭代对象了。

    >>> enu = enumerate('abcd')
    >>> [i for i in enu]
    [(0, 'a'), (1, 'b'), (2, 'c'), (3, 'd')]

### while循环

while语句用法和大多数编程语言类似，就是条件控制，循环结构。

    while test:
        do something
    else :
        do something

值得一提的是else语句和while语句属于一个整体，通常情况下while执行完了然后执行下面的语句似乎不需要加上else来控制。不过else语句的一个功用就是如果while循环的时候遇到break那么else语句也不会执行而是直接跳过去了，见下面。

#### break命令

break跳出最近的while或者for循环结构。前面谈到了else和while语句构成一个整体的时候，break可以跳过else语句。

#### continue命令

continue命令接下来的循环结构的执行区块将不执行了，跳到条件判断那里看看是不是继续循环。如果是，那么继续循环。同样在for语句中continue命令的意思也是一样的。

#### pass命令

pass命令就是什么都不做。pass命令即可用于循环语句也可用于条件语句。

pass命令什么都不做似乎没有什么意义，不过作为一个空占位符还是很有用的。比如你编写一个大型的GUI程序，信号－槽机制都构思好了，只是对应的函数暂时还没写好，这个时候你可以将对应的函数，只是空的函数名加上pass语句写上，这样整个程序就可以继续边编写边调试了。


## 补充

### assert语句

assert语句简单的理解就是 `assert True` ，正常刷过去，而 `assert False` 将抛出`AssertionError` 。

assert语句实际上是非常重要的一个语句，程序员在编码的时候需要形成一种防御型编码风格，注意这不是所谓的编码规范，而是重要性更高一等级的编码风格，是一种思维方式。

那么什么是防御型编码风格，简言之就是你在编码的时候，你对于你即将面对的各个数据类型的预期。比如说 `is_even` 函数是一个判断输入的整数是否是偶数的函数，那么你预期输入的数值就是一个整数，这个时候你就可以加上`assert  isinstance(x, int)` ，来防御输入的x参数类型。那么假如程序运行过程中抛出了这个地方的assert异常，这个函数实际上在说，不是我的问题，是你给我的参数出问题了，是调用我的那个方法出了问题。

防御型编码风格就是一种去耦合思维，它和你编写各个函数的去耦合思维是一致的，所以不要把防御型编码风格当成某种规范，当作某种额外的约束工作，它就是和你正在编写各种函数时候的思维方式是一致的。如果你去观察那些没有防御型编码风格的初学者，你会发现他们的函数分离工作做得很不好，经常看到大段的代码，各个参数全局变量局部变量都乱七八糟的，整个代码文件混乱不堪。而他们还会嬉笑道，不就是防御型编码吗，我知道，我学过。

assert语句和相关条件判断等抛异常语句片段都属于防御型编码风格，那么什么时候用assert语句，什么时候抛出异常呢。实际上assert语句也是在抛异常，但assert语句和抛异常语句有一个很大的不同：**那就是assert语句可以通过设置python编译器来全局跳过，这个需要注意下。所以对于那些必须要做的校验，是应该使用异常语句的。** 所以一般来说项目早期的话可以写上很多assert语句，但后面时间充裕了很多assert语句是要替换为抛异常语句的。





### locals和globals

python的 `locals()` 返回本函数内的局部变量字典值，而 `globals()` 则返回本模块文件的全局变量。 `locals` 是只读的，而 `globals()` 不是，我们可以利用`globals()` 对脚本文件玩出一些新花样。

### and or not的运算优先级

一般是推荐用括号清晰表达，然后not我们知道优先级是最高的。我们再看下面这个例子:

```
>>> True or True and False
True
```

这个例子很好地说明了and和or的优先级顺序，具体就是 and的优先级比or的要高 。

### all和any关键词

这是python语言里面的关键词函数，源码很简单，下面列出来，看一下就清楚了:

```
def all(iterable):
    for element in iterable:
        if not element:
            return False
    return True

def any(iterable):
    for element in iterable:
        if element:
            return True
    return False
```


如果用语言表述的话是:

- all，都是True，则返回True，否则返回False
- any，只要有一个True则返回True，否则返回False。





### 三元运算符

也就是类似这样的结构:

```
loop = loop if loop is not None else get_event_loop()
```

通常我们在处理函数的入口参数实现默认值的情况的时候会用到，比如上面一般函数参数那里写着 `loop=None` ，用上面这种一行形式更简洁一些。而我们不直接在函数定义的那里采用默认值可能有两种情况，一是该默认值并不方便作为默认值，而最好默认为None；还有一种情况是默认值是需要通过某个函数等运算得到的。

### 属性管理的函数

hasattr，setattr，getattr，delattr，这些函数都属于关于python中各个对象的属性管理函数，其都是内置函数。

其中hasattr(object, name)检测某个对象有没有某个属性。其实际调用的还是getattr方法，然后稍作封装。

setattr(object, name, value)用于设置某个对象的某个属性为某个值，`setattr(x,a,3)` 对应 `x.a = 3` 这样的语法。

getattr(object, name[, default])用于取某个对象的某个属性的值，对应 `object.name` 这样的语法。

delattr(object,name)用于删除某个对象的某个属性，对应 `del object.name` 这样的语法。




### `__name__` 和 `__file__`

这里所谓脚本被引入是指用import或者from语句被另外一个脚本引入进去，而这里所谓的脚本被执行是指直接如 `python test.py` 这样的形式执行该py脚本。

这两种形式很有一些区别，下面慢慢谈论:


- `__name__` 的区别。这个大家应该很熟悉了。如果脚本是被引入的，`__name__` 的值是该引入的脚本文件名，比如引入的是 `test.py` ，那么该脚本被引入，对于这个test.py文件来说，其内的 `__name__` 的值就是 `test` ，也就是 **模块名**  ；而如果是作为脚本被执行，则该 `__name__` 是 `__main__` 。
- `__file__` 的区别。如果脚本是被执行的，假设该脚本文件是 `hello.py` ，那么在这个被执行脚本中， `__file__` 的值是 `hello.py` ，也就是 **文件名** 。如果是被引用的，那么对于那个被引入的脚本来说， `__file__` 的值是该被引入脚本相对系统来说的 **完整文件名** ，比如是 `/home/wanze/桌面/hello.py` 。


### format函数

format函数或者说字符串的format方法，一般的使用还是很简单的，但是有的时候有些特殊的高级需求，下面渐渐收集之。

更多关于python中format函数使用的信息请参考 [pyformat.info](https://pyformat.info/) 。

#### 等宽数字

```
 {:0>2d} 
```

目标数字宽度为两位，左边填充0 ， `>` 表示左边填充， `0>` 表示左边填充0，此外还有 `>` 表示右边填充。

#### 花括号的问题

花括号因为是特殊字符，要显示花括号，需要如下输入两次：

```
>>> print(f'{{----}}')
{----}
```



### f-string

python3.6加入进来的特性。基本情况如下：

python新的format字符串

```
f"hello. {name}"
```

等价于

```
"hello. {name}".format(name=name)
```

一个变量还好，多个变量的时候这种f-string的写法的好处就很明显了，当时环境下你前面已经定义好的变量名是可以直接使用的，我只能用一句话来形容，太好用了，用上了你就会停不下来。


## 附录

### python虚拟环境

Virtualenv模块的主要作用就是建立一个封闭独立的python开发环境，因为一个python项目的开发通常会涉及到多个模块，而你激活virtualenv环境之后，通过pip命令安装的模块是安装在本项目文件夹内的，这样就建立了单独的固定某个模块版本的开发环境。

一般来说绝大部分项目都推荐开始之前就建立专属于自己的虚拟环境，除非是那种临时的测试项目。而一个项目运行时间越长，维护时间越长，虚拟环境所带来的好处就越大。


安装虚拟环境：

```text
python -m venv venv_folder_name
```

#### 激活虚拟环境

一般简单使用直接调用 `Script` 文件夹下的python解释器即可，但如果有多行命令，或者你后面使用了本python模块的可执行程序等，那么推荐还是激活下虚拟环境再进行后面的动作。

linux下如果是bash终端：

```text
source venv/bin/activate
```

windows下如果是cmd：

```
.\venv\Scripts\activate.bat
```

windows下如果是powershell：

```
.\venv\Scripts\Activate.ps1
```

powershell可能会提示无执行权限错误，则你需要给当前用户以执行权限。请参看提示信息中的 [那个网页](https://docs.microsoft.com/zh-cn/powershell/module/microsoft.powershell.core/about/about_execution_policies?view=powershell-7.2)。







### python编码规范

PEP8代码风格规范是每个python程序员都应该了解的内容，其具体内容官方文档在 [这里](https://www.python.org/dev/peps/pep-0008/) 。

关于空白和其他一些格式现在的编辑器加上插件都可以做到自动pep8格式调整，比如 autopep8 模块等，这一块就不多说了。

这里主要简单地说一下变量名的命名规范 【高质量python代码】：


- 字母都大写的变量，我们一般认为它是模块文件级别的常量，各单词用下划线隔开。

- 首字母大写的我们一般认为它是类或者异常名字，多个单词的用驼峰写法表示。

- 其他一律是小写字母，用下划线隔开。
- 一般开发者不应该命名下划线开头的变量，你若这样写你必须知道自己在干什么。




#### 其他编码风格推荐

- 不要使用带两个以上for语句的列表解析。
- 用生成器表达式改写数据量较大的列表解析。
```
it = (len(x) for x in open('/tmp/myfile.txt'))
```


- 不要在for和while循环后面写上else语句。这个建议有利于程序的简洁直观，可以接受。

- 函数的返回值是你需要的返回值才有意义，如果不是，而只是某些特殊的情况，那么最好抛出异常。



#### python哲学

参考了 [这个网页的翻译](https://github.com/oldratlee/translations/tree/master/python-philosophy) 。

<ol>
<li>美优于丑。</li>
<li>直白优于隐晦。</li>
<li>简单优于复杂。 </li>
<li>复杂优于纠结。 </li>
<li>扁平优于嵌套。 </li>
<li>稀疏优于稠密。 </li>
<li>可读性是有重要价值的。</li>
<li>特例可以有，但不能特例到打破规则。
<ul>
<li>尽管在纯粹性和实用性之间倾向的是实用性。</li>
</ul>
</li>
<li>出错决不能无声无息地忽略。
<ul>
<li>除非明确地说明了是无声无息的。</li>
</ul>
</li>
<li>面对二义性情况时，要拒绝任何猜的诱惑。</li>
<li>一件事应该一种做法 —— 并且宁愿只有一种做法 —— 一种显而易见的做法。
<ul>
<li>尽管在刚开始的时候这个做法可能不是那么显而易见，毕竟你不是荷兰人。 </li>
</ul>
</li>
<li>『现在』优于『决不』。 
<ul>
<li>尽管『决不』常常优于『<strong><em>马上</em></strong>』。 </li>
</ul>
</li>
<li>如果一个实现难于解释清楚，那它是个差的想法。</li>
<li>如果一个实现很容易解释清楚，那它可能是个好的想法。</li>
<li>命名空间是个拍案叫绝的想法 — 放手多多用起来吧！</li>
</ol>


### 其他小技巧

#### 获取本模块对象

如下所示，可以获取本模块内的变量。

```python
import sys
current_module = sys.modules[__name__]

old_module_dict = copy(current_module.__dict__)


# for k, v in old_module_dict.items():
#     if k == 'case_base':
#         pass
#     elif k.startswith('case_'):
#         if issubclass(v, case_base):
#             URL_CASES.append(v)
```

#### 根据字符串获取模块对象

```
import importlib
importlib.import_module('what.what')
```



#### 检查某个变量是不是模块对象

参考了 [这个网页](https://stackoverflow.com/questions/865503/how-to-isinstancex-module)

```python
>>> import os, types
>>> isinstance(os, types.ModuleType)
True
```




#### 获取一个月最后的一天

首先要说的是利用python的datetime和timedelta对于 `days` 的加减操作是能够很好地支持跨月问题的:

```
    >>> from datetime import datetime
    >>> d = datetime.now()
    >>> d
    datetime.datetime(2016, 5, 29, 8, 50, 20, 337204)
    >>> from datetime import timedelta
    >>> d - timedelta(days = 29)
    datetime.datetime(2016, 4, 30, 8, 50, 20, 337204)
    >>> d - timedelta(days = 28)
    datetime.datetime(2016, 5, 1, 8, 50, 20, 337204)
```


但是有的时候你就是需要直接获知某个月份的最后一天是30还是31等等，然后利用replace来获得一个月的最后一天。这个时候你需要利用 calendar 的 `monthrange` 函数。参考了 [这个网页](http://stackoverflow.com/questions/42950/get-last-day-of-the-month-in-python) 。

```
    >>> d.replace(year = 2016,month=4,day = monthrange(2016,4)[-1])
    datetime.datetime(2016, 4, 30, 8, 50, 20, 337204)
```


### 参考资料

- python入门教程，python官网上的tutorial。原作者：Guido van Rossum  Fred L. Drake ；中文翻译：刘鑫等；版本：2013-10-28；pdf下载链接：[python入门教程](https://drive.google.com/open?id=0ByWxOeitx54PSW40bU5zNVhuMlU&authuser=0)  。
- learning python，主要python语言参考，我主要参看了python学习手册（第四版）。原作者：Mark Lutz，中文翻译：李军，刘红伟等。
- programming python，作者Mark Lutz对python编程的进阶讨论；版本：第四版。
- python [官网上的资料](https://docs.python.org/3/) 。
- dive into python3 [english version](http://www.diveintopython3.net/index.html) , 这是[中文版](http://sebug.net/paper/books/dive-into-python3/index.html) 。
- A Guide to Python's Magic Methods，作者：Rafe Kettler ,版本：2014-01-04，[Github 地址](https://github.com/RafeKettler/magicmethods) .
- Foundations of Python Network Programming ，python网络编程基础，[美] John Goerzen 著，莫迟等译 。这是 [中文在线阅读网页](http://likebeta.gitbooks.io/twisted-intro-cn/content/zh/index.html) ，这是 [english version](http://krondo.com/?page_id=1327) 。
- Unix网络编程卷1: 套接字联网API , Author: W. R. Stevens , Bill Fenner 等著 , version: 第三版 
- 计算机网络自顶向下方法 , Author: James F. Kurose , Keith W. Ross ,陈鸣译 。这本书作为入门了解有关计算机网络相关知识还是很不错的。
- 流畅的python, Luciano Ramalho著, 安道 吴珂译
- 深入理解python特性, 达恩·巴德尔著
- CPython Internals, REALPYTHON.com




## 脚注


[^1]: 也就是用chmod加上可执行权限那么可以直接执行了。第一行完整的解释是什么通过*env*程序来搜索python的路径，这样代码更具可移植性。这个问题还可以多说一点，后面会谈到virtualenv这个模块，类似上面这种引用python的写法是可以确保调用的是python虚拟环境下的python解释器。
[^2]: is语句用来测试对象的同一性，就是真正是内存里的同一个东西，而不仅仅是值相同而已。==只是确保值相同。
[^3]: 这些int、float等命令都是强制类型转换命令

