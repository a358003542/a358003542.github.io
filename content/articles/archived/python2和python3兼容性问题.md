Slug: python2-python3
Tags: python
Date: 20191018

[TOC]

## 2to3内置模块

python有个 **2to3** 内置模块可以自动进行python2脚本到python3脚本的移植工作，不过我感觉最好是不要过分依赖这个工具，这只是适合初学者的。因为python2和python3很多地方不一样了。如果你对这个模块有很深的了解，可能自己手工进行修改会更合适一些（其中可能会涉及到新的编写思路）。具体模块的使用请参看官方文档。

## `//` 和 `/`

在python2中，两个整数相除会返回一个整数，也就是python3的 `//`。
```
>>> 5/2
2
```

### 兼容方案
在文件头上加上一行：

```
from __future__ import division
```


这样就都是使用python3的语法规则，即:  `/` 表示常规除法， `//` 表示整除——返回商。

## print函数
这是最常见的错误了，推荐第一步就在文档里面进行find print这个字符串操作，然后将所有：

```
    print ...
```


这样的形式都换成：
```
    print(...)
```


这是目前python2和python3都兼容的形式了，所以没有什么好犹豫的，大胆的修改就是了。

其中python2 
```
    print 1, 2,
```


似乎还有点小复杂，简单的理解就是对应到python3的
```
    print(1, 2, end=' ')
```


然后python2支持这样的重定向语法 
```
print >>sys.stderr, 1, 2, 3
```


其对应python3的就是file选项： 
```
print(1, 2, 3, file=sys.stderr)
```

### 兼容性方案

目前推荐在模块最上面写上:
```
from __future__ import print_function
```

然后使用python3的语法来使用print函数。这样python2里面也能正常运行。

## unicode字符串问题
首先说一下Unicode字符串问题的历史由来，因为python2诞生的比Unicode字符串（宽字符解决编码方案的统称）要早，所以python2早期是基于ASCII编码的，ASCII编码是8位值编码，那个时候比较单纯，python2就是一个str类型既表示8位字符又表示二进制数据。后来python2才引入unicode字符类型，其就是对应的宽字符文本。

后来python2为了兼容python3也引入了bytes类似和bytearray类型。但只是为了兼容性考虑。目前python2和python3代码兼容上最大的一个坑就是python2的str类型是8位文本和二进制数据的统称，也就是在某些默认是ASCII编码的情况下，可能不知不觉，比如系统的默认编码默认是ASCII，然后这些8位值数据你不知道其到底是不是文本。（python3的str是默认的UTF-8编码，其既支持8位文本也支持宽字符文本，这样其就真的是文本的含义了。）

首先我们要看到大家都同意python3的新分类是很好的： str 文本， bytes 字节流。后面的编程都应该一律采用这种思维。

然后我们现在写python2代码都推荐在文件头上写上：
```
from __future__ import unicode_literals
```

如上面写了之后python2中随便定义的字符串

```
>>>"test"
u'test'
```
返回的将是unicode类型，可以对应于python3的str类型。程序员在 （\cite{高质量python代码}） 编码时应该更多地考虑业务逻辑而不是考虑具体字符是什么编码什么二进制形式存放的。

简单起见字符串都只是简单认为是字符串（或者说文本），然后程序员一般也不会考虑编码问题，只是确实到了某个点，需要直接操作字符的bytes形式，确实有需要，然后再考虑进行转换操作。

具体的转换：

```
# python2
def to_unicode(unicode_or_str):
    if isinstance(unicode_or_str, str):
        value = unicode_or_str.decode('utf-8')
    else:
        value = unicode_or_str
    return value
    
def to_str(unicode_or_str):
    if isinstance(unicode_or_str, unicode):
        value = unicode_or_str.encode('utf-8')
    else:
        value = unicode_or_str
    return value
```

而对于那些历史遗留的代码，非常遗憾，考虑到python2和python3在这一块如此巨大的裂痕，更加详细的阅读和修改甚至重写代码恐怕是避免不了的了。


​    

## input和raw_input

在python2中的raw_input函数对应的就是python3的input函数。然后python2还有一个input函数，具体在python3中对应的是eval(input())，这个函数推荐被废弃掉。

### 兼容方案

```
from builtins import input

name = input('What is your name? ')
```



## 所有的类都继承自object
python3中所有的类都默认是object的子类。

### 兼容方案

兼容方案是引入从builtns引入object，然后都明确指明继承自object。
```
from builtins import object

class Upper(object):
    def __init__(self, iterable):
        self._iter = iter(iterable)
    def __next__(self):      # Py3-style iterator interface
        return next(self._iter).upper()  # builtin next() function calls
    def __iter__(self):
        return self
```




## execfile函数

在python2中execfile是个内置函数，可以直接运行，用来执行某个python脚本。

```
execfile(join(dirname(__file__), 'openerp', 'release.py'))  # Load release variables
lib_name = 'openerp'


exec(compile(open(join(dirname(__file__), 'openerp', 'release.py')).read(), join(dirname(__file__), 'openerp', 'release.py'), 'exec')) 
 lib_name = 'openerp'
```

### 兼容方案

```
exec(compile(open('myfile.py').read()))
```

## <>替换为 !=

不等于号<>被废弃了，推荐用!=，这样python2和python3都是兼容的。



## 模块包的导入问题

python2到python3模块包的结构很多地方也发生了变动，实际上即使是python3，随着版本升级，内置模块包内部也在发生着变动，比如新加入的函数类等等。这是不可避免的，同时python2一些模块包已经被官方提醒要被废弃了，这也是值得引起我们的注意的。这一块，当然还是自己平时多阅读官方文档（通常这些变动官方文档都会有所说明的）。

