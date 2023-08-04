Slug: python-modules
Tags: python,
Date: 20191018

[TOC]

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