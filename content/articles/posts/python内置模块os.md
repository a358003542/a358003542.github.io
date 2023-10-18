Slug: python-builtin-module-os
Date: 20231019

[TOC]

## os模块


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



