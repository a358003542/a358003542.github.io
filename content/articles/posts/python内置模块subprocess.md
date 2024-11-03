Slug: python-builtin-module-subprocess
Date: 20231019

[TOC]

## subprocess模块


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