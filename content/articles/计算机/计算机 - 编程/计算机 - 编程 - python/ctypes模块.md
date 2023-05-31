Date: 20201018

##  ctypes模块

如果你的python程序需要和别人的dll进行交互，那么你就必须了解ctypes模块了。ctypes在linux也可以和c语言的so库进行交互，本文重点讨论的是在windows下和dll交互的问题。

基本的使用如下：

```python
lib_comm = ctypes.windll.LoadLibrary(get_dll_path('your_dll.dll'))
```

假设你的your_dll.dll 里面 helloworld 函数，那么就可以这样调用这个函数了。

```python
lib_comm.helloworld()
```

接下的使用主要就是考虑python的数据类型和dll里面的c语言数据类型的对接问题（可能还会牵涉到字符串编码问题。）

[官方文档](https://docs.python.org/3.7/library/ctypes.html) 的那个数据类型对应表格是必看的。基本类型都还好，主要是指针和结构体这两块要理解清楚。

首先你需要在python脚本中大概类似下面的创建一个对应于C语言的里面定义的结构体：

```python
class YOU_STRUCTURE(ctypes.Structure):
    """
    基础信息结构体
    """
    _fields_ = [
        ('a', ctypes.c_int),  
        ('b', ctypes.c_char * 24), 
        ('c', ctypes.c_char * 40), 
    ]
```

然后实际使用如下：

```python
s = YOU_STRUCTURE()
_ref_s  = ctypes.byref(s)
```

通过 byref 来获取到目标结构体的指针，实际调用dll里面的函数传递对应的结构体数据，就是把对应的指针，即上面的 `_ref_s` 传递过去。

```python
lib_comm.test(_ref_s)
```



## 如何创建c++的dll

下面是我阅读官方 [这篇文章](https://docs.microsoft.com/en-us/cpp/build/walkthrough-creating-and-using-a-dynamic-link-library-cpp?view=vs-2017) 关于如何利用visual studio 2017 创建 基于c++语言的dll的过程整理：

首先是visual studio 要安装 C++的桌面开发环境。

### 新建项目

新建项目选择 c++ 的windows 桌面 里的 windows 桌面向导

点击下一步下一个界面选择 动态链接库 dll

### 添加头文件

源文件里面的dllmain.cpp 一开始不需要做任何修改，然后你需要在头文件哪里新建一个.h文件，具体内容如下：

```c++
#pragma once

#ifdef MATHLIBRARY_EXPORTS
#define MATHLIBRARY_API __declspec(dllexport)
#else
#define MATHLIBRARY_API __declspec(dllimport)
#endif


extern "C" MATHLIBRARY_API int _stdcall test_call();


extern "C" MATHLIBRARY_API int _stdcall test_buf(char* buf, int num, char* outbuf);
```

这里 `MATHLIBRARY` 名字是可以更改的，暂时懒得改了。是关于声明dll对外开放函数的一个修饰符。具体涉及到dll的相关知识，其实就是这样一种写法就是了，不用太深究的，毕竟重点还是c++语言写的函数。

下面的 `_stdcall` ，说是什么标准windows API 调用，其实暂时也不用太深究这个，就是记得头文件和源文件函数定义哪里都加上这个修饰符，然后python那边 ctypes对接的时候要使用 windll，而如果不加则要使用 cdll。

 

### 添加源文件

```c++
#include "stdafx.h"
#include <utility>
#include <limits.h>
#include "MathLibrary.h"


int _stdcall test_call()
{
	return 2;
}


int _stdcall test_buf(char* buf, int num, char* outbuf)
{
	int i = 0;
	for (i = 0; i < num; ++i)
	{	
		outbuf[i] = 'a';
	}
	return num;
}

```



然后点击 生成解决方案就在 debug文件夹下面 生成 dll了。下面讲如何和python项目集成起来。



## 和python项目集成

首先我们新建一个简单的python项目，就是一个最简单的那个python项目即可。

这里主要做的事情就是把前面我们创建的那个生成dll的c++项目在本解决方案中添加进来。

然后在python项目的引用中，把那个项目添加进来。

这样那个生成dll的c++项目点击生成之后dll会输出到本解决方案的debug文件夹下面。

然后python脚本这样引用即可：

```python
import ctypes

dll = ctypes.windll.LoadLibrary('..\Debug\MathLibrary.dll')

print(dll.test_call())

test_buf = dll.test_buf

data_in = ctypes.c_char_p('abcd'.encode())

data_out = ctypes.create_string_buffer(4)

numbytes = ctypes.c_long(4)

res = test_buf(data_in, numbytes, data_out)

print(res)

res2 = data_out.value.decode()

assert str == type(res2)

print(res2)
```

我们看到实际上就是把路径指向上一层的debug文件里面的dll文件，这样python和dll就可以联动调试了。



## 参考资料

- [python ctypes探究](http://www.cnblogs.com/night-ride-depart/p/4907613.html)
- [这篇文章关于ctypes和c++语言之间如何进行字符串沟通说明得很好](https://eli.thegreenplace.net/2008/08/31/ctypes-calling-cc-code-from-python)