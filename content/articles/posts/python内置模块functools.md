Slug: python-builtin-module-functools
Date: 20231019

[TOC]


## functools模块


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
