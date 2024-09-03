Slug: python-builtin-module-pickle
Date: 20231019

[TOC]

## pickle模块


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

