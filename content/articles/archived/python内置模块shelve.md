Slug: python-builtin-module-shelve
Date: 20231019

[TOC]

## shelve模块


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
