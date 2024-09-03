Slug: python-builtin-module-sys
Date: 20231019

[TOC]

## sys模块
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


### 获取本模块对象

如下所示，可以获取本模块内的变量。

```python
import sys
current_module = sys.modules[__name__]
```
