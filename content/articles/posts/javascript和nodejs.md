Slug: javascript-nodejs
Date: 20231024

我们知道javascript作为前端的脚本语言是浏览器负责翻译执行的，也就是说javascript的运行是依赖于浏览器的。而nodejs是一个javascript运行时，意思是你的javascript脚本可以类似于在浏览器上在nodejs上运行。事实上nodejs就实现组件结构来说也类似于chrome浏览器，一样是基于chrome的V8 javascript引擎，只是移除了一些和网页显示相关的webkit引擎之类的。

官网为nodejs的定义如下：

> 一个搭建在Chrome JavaScript运行时上的平台，用于构建高速、可伸缩的网络程序。Node.js采用的事件驱动、非阻塞I/O模型，使它既轻量又高效，并成为构建运行在分布式设备上的数据密集型实时程序的完美选择。

V8引擎性能很高，javascript会被直接编译成本地机器码。所以nodejs使用javascript也很高效。因为V8引擎原来处理网页上的javascript脚本就实现上必须是事件驱动，非阻塞IO的，于是到了nodejs服务器这边也是事件驱动的，非阻塞IO编程的。

安装nodejs请到 [这个网站](https://nodejs.dev/download/) 下载nodejs。

### 一个最简单的nodejs模块

首先我们新建一个文件夹mymodule，然后里面新建一个 `index.js` 文件。在`index.js` 文件里面定义一个简单的函数：

```
function add2(a,b){
  return a + b;
}
```

然后导出这个函数

```
exports.add2 = add2
```

然后我们在外面新建一个 `test_mymodule.js` 来实际使用mymoudle模块：

```
var mymodule = require('./mymodule')

console.log(mymodule.add2(1,2))
```

然后运行：

```
node test_mymodule.js
```

如果一起正常，那么读者将会看到输出了数字3，恭喜，一个简单的nodejs模块就编写完成了。

一般模块是默认  `index.js` 为模块的入口，你可以在mymodule文件夹下面新建 `package.json` 文件，这一般正式的模块都会定义这个文件的，然后通过设置 `main` 字段来指定目标入口js文件。【读者可以试着将index.js改为main.js然后试下，然后再按照上面的表述编写一个package.json文件来试下。】

还有一种写法：

```js
module.exports.add2 = add2
```

这两个写法区别不是太大，参看官方文档：

> exports shortcut
> 
> Added in: v0.1.16
> 
> The exports variable is available within a module's file-level scope, and is assigned the value of `module.exports` before the module is evaluated.

> It allows a shortcut, so that `module.exports.f = ... `can be written more succinctly as `exports.f = ....` However, be aware that like any variable, if a new value is assigned to exports, it is no longer bound to module.exports:

> module.exports.hello = true; // Exported from require of module
> 
> exports = { hello: false };  // Not exported, only available in the module

简单来说就是如果你总是规范自己采用 `exports.what=what` 这样的语法，那么exports只是`module.exports`的语法糖罢了，不过一定要注意你不能写作 `exports=what`，这样exports这个变量就被污染了。但是你仍然可以写 `module.exports = add2` 这种形式，这样调用语句要改为：

```
var mymodule = require('./mymodule')

console.log(mymodule(1,2))
```

我不太喜欢这种风格，因为require之后从程序员的习惯来说更期待的是引入进来一个某种模块对象的东西，我更喜欢最开始的那种语法，通过exports将模块里面的目标变量作为属性绑定到某种模块对象里面。

NOTICE: 注意nodejs的exports是后端那块的东西，而es6的export是前端的东西，别弄混了。

