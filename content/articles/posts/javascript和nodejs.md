Slug: javascript-nodejs
Date: 20231024
Modified: 20231026


## 前言
javascript作为前端的脚本语言是浏览器负责翻译执行的，也就是说javascript的运行是依赖于浏览器的。而nodejs是一个javascript运行时，意思是你的javascript脚本可以类似于在浏览器上在nodejs上运行。事实上nodejs就实现组件结构来说也类似于chrome浏览器，一样是基于chrome的V8 javascript引擎，只是移除了一些和网页显示相关的webkit引擎之类的。

官网为nodejs的定义如下：

> 一个搭建在Chrome JavaScript运行时上的平台，用于构建高速、可伸缩的网络程序。Node.js采用的事件驱动、非阻塞I/O模型，使它既轻量又高效，并成为构建运行在分布式设备上的数据密集型实时程序的完美选择。

V8引擎性能很高，javascript会被直接编译成本地机器码。所以nodejs使用javascript也很高效。因为V8引擎原来处理网页上的javascript脚本就实现上必须是事件驱动，非阻塞IO的，于是到了nodejs服务器这边也是事件驱动的，非阻塞IO编程的。

安装nodejs请到 [这个网站](https://nodejs.dev/en/download/) 下载nodejs。


### CommonJS模块
虽然从nodejs v12开始，nodejs就支持es6的模块系统了，但由于历史原因，我们在网上看到的代码，大多都使用的require也就是CommonJS模块导入语句。electron 要到下个v28版本才支持esm。从长远来说，JavaScript生态圈肯定会逐渐迁移到esm，只是现在还在过渡阶段。所以简单了解下CommonJS模块情况现阶段还是有用的。

js模块文件你希望导出某个变量：

```
exports.what = what;
```

其他地方使用这个变量：

```
const {what} = require('./where.js')
```

如果是安装的第三方模块，可以写为简单的模块名。

CommonJS没有所谓的default概念，当你看到这样的语句时：

```
const path = require('path')
```

和上面的require本质上是一回事，只是用解构变量赋值大多会方便些，也就是require函数返回的就是模块对象。
