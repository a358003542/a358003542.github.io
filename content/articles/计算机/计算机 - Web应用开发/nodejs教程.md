Slug: nodejs-tutorial
Date: 20201121
Tags: javascript, node, npm, yarn

[TOC]

## 何为nodejs

我们知道javascript作为前端的脚本语言是浏览器负责翻译执行的，也就是说javascript的运行是依赖于浏览器的。而nodejs是一个javascript运行时，意思是你的javascript脚本可以类似于在浏览器上在nodejs上运行。事实上nodejs就实现组件结构来说也类似于chrome浏览器，一样是基于chrome的V8 javascript引擎，只是移除了一些和网页显示相关的webkit引擎之类的。

官网为nodejs的定义如下：

> 一个搭建在Chrome JavaScript运行时上的平台，用于构建高速、可伸缩的网络程序。Node.js采用的事件驱动、非阻塞I/O模型，使它既轻量又高效，并成为构建运行在分布式设备上的数据密集型实时程序的完美选择。

V8引擎性能很高，javascript会被直接编译成本地机器码。所以nodejs使用javascript也很高效。因为V8引擎原来处理网页上的javascript脚本就实现上必须是事件驱动，非阻塞IO的，于是到了nodejs服务器这边也是事件驱动的，非阻塞IO编程的。

## 安装nodejs

请到 [这个网站](https://nodejs.dev/download/) 下载nodejs。

## 一个最简单的nodejs模块

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

## nodejs和npm

正如前面所说，nodejs是一个平台，因为nodejs在作这个平台的时候内置了很多官方的js模块。比如说我们随便从网上找了一个最简单的nodejs入门样例web server程序：

```js
var http = require('http');

http.createServer(function (request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end('Hello World\n');

}).listen(8888);

console.log('Server running at http://127.0.0.1:8888/');
```

其最开始的语句 `require('http')` 就是在引入nodejs的官方内置js模块http。

既然有了官方模块那当然就有第三方模块和模块管理工具了。一般安装好nodejs之后除了node命令之外还有npm命令，最新的nodejs现在还提供npx命令。

首先说一下npx命令有什么用，在本地安装一个npm包之后，该包提供了一个命令，如果你希望调用这个命令，以前的做法则可能需要修改 `package.json` 的 scripts 字段：

```
  "scripts": {
    "start": "electron .",
   }
```

然后你通过 `npm start` 来达到效果。现在你可以如下直接调用 `electron` 命令了。

```
npx electron .
```

然后我们继续往下说，上面提到的 `package.json` 是npm用于包管理的很重要的一个配置信息文件。你可以手工创建一个，或者通过 `npm init` 命令来生成一个。

在你想要新建的模块的根目录下运行 `npm init` ，程序会交互问一些问题，然后创建 `package.json` 文件。

### npm的基本使用

- npm install  module_name  安装某个模块 【如果不写上模块名则会自动根据当前的package.json文件来进行安装动作】
- npm uninstall module_name 移除某个模块 
- npm list  列出已经安装的模块
- npm update module_name 更新某个模块 【如果不写上模块名则会自动根据当前的package.json文件来进行模块升级动作】

你可以通过 `-g` 选项来指明本次操作是针对全局的npm库，但除非有必要，现在是不推荐这样做了。 

`npm install` 还有一些额外的安装选项：

- **默认**是 `--save-prod` 或者 `-P` ，常规依赖包信息会放在 `dependencies` 字段下。一般和项目直接相关的包放在这里。【因为是默认值所以一般很少会打出这个 `--save-prod` ，在npm version5之前需要额外加个 `--save`大概也是类似的功能。】

- `--save-dev` 或者 `-D` ，开发包信息会放在 `devDependencies` 。和开发调试封装打包等相关的包信息推荐放在这里，比如electron官方会提示我应该放在 **devDependencies** 那里。

- `--save-optional` 或者 `-O` ，可选的包信息：`optionalDependencies` 。

- `--no-save` 含义很明显，就是不写入包依赖信息了。

包信息后面的版本有一些特殊符号，其含义是：

- 符号 `^` 表示之后的版本都可以
- 符号 `~` 表示是允许小版本内的升级

更多关于npm版本号细节请参看官方文档的 [这里](https://nodejs.dev/learn/semantic-versioning-using-npm) 。

### npm run

前面提到过 `npm start` 启动某个命令，其只是 `npm run start` 的别名。你定义的 `scripts` 字段里面的命令行列表都可以通过 `npm run what` 来调用：

```
{
  "scripts":{
    "what": "command line"
  }
}
```

### npx

前面提到了一点npx命令，如果只是自己编写的模块命令，似乎意义不大，通过npm run一样可以做到，而npx的用处就是对于第三方模块提供的what命令也是可以 `npx what` 这样调用的，一般模块都是安装在本地的，第三方的模块可执行命令在 `node_modules/.bin` 文件夹下，这在操作系统来说那些命令是不能直接在终端调用的，而如果输入 `./node_modules/.bin/what` 这又麻烦了，npx命令的好处就是在这种情况下简单输入 `npx what` 即可。

### package.json文件详解

#### name

本模块名字

#### version

版本号

#### description

简短描述

#### main

模块入口

#### private

设置为true将禁止本模块上传到npm公共库里面去

#### scripts

一系列的命令行入口定义

#### dependencies

包依赖

#### devDependencies

开发包依赖

#### homepage

模块主页

#### license

版权协议

#### keywords

描述关键字，示例：

```
"keywords": [
    "latex",
    "math"
  ],
```

#### author

作者信息，示例： 

```
 "author": {
   "name": "Joe",
   "email": "joe@whatever.com",
   "url": "https://whatever.com"
 }
```

#### repository

模块仓库，示例：

```
  "repository": {
  "type": "git",
  "url": "https://github.com/whatever/testing.git"
  }
```

#### engine

nodejs等版本依赖，示例：

```
  "engines": {
  "node": ">= 6.0.0",
  "npm": ">= 3.0.0",
  "yarn": "^0.13.0"
  }
```

### 利用mocha进行单元测试

首先是安装mocha

```
npm install --save-dev mocha
```

然后新建一个test文件夹，里面是你的用于测试的js文件。

然后package.json配置：

```
  "scripts": {
    "test": "mocha",
  },
```

然后运行 `npm test` 即用mocha执行了单元测试。

具体单元测试的js代码简要介绍如下：

```js
var assert = require('assert');

describe('Array', function() {
    describe('#indexOf()', function() {
      it('should return -1 when the value is not present', function() {
        assert.equal([1, 2, 3].indexOf(4), -1);
      });
    });
  });
```

这上面的：

```js
describe('Array', function() {
...
  });
```

和 

```
      it('should return -1 when the value is not present', function() {
        ...
      });
```

就是mocha的一些输出信息调配，比如上面的输出信息为：

```
  Array
    #indexOf()
      ✔ should return -1 when the value is not present
```

熟悉单元测试的知道最核心的就是那个 `assert.equal()` ，至于那个describe和it，跟着那么用就是了。





### 发行你自己的npm包

首先你需要在 `npmjs.com` 上申请个用户名：

```
npm adduser
```

或者以前adduser过了那么运行：

```
npm login
```

然后：

```
npm publish
```

默认发送公开的模块，npm付费用户可以发布私有模块。

## 附录

### 配置npm国内源
如果读者遇到npm安装报错，这很可能是因为有些包下载动作太慢了就报错，这个时候建议将npm源更换为国内的源：

```
npm config set registry npm_url 
```

这个配置对后面提到的yarn也是一样有效的。

国内npm源有：

- cnpm http://registry.cnpmjs.org 
- 腾讯云 http://mirrors.cloud.tencent.com/npm/
- 淘宝云 https://registry.npm.taobao.org

## 附录

### yarn

很多人都推荐使用yarn而不是npm，yarn一方面是基于npm包的，然后和npm比较起来有很多优点，比如并发的网络请求，对依赖版本的处理优化等。

yarn在windows下也提供了安装包，去 [官网](https://classic.yarnpkg.com/zh-Hans/docs/install) 上下载即可。

#### yarn的基本使用

- `yarn init` 对应于 `npm init` ，适用于初始化一个新项目的，如果你的项目已经有`package.json` 这个文件了，那么你应该使用 `yarn install` 。
- `yarn add` 对应于 `npm install` ，yarn add 不加上选项将安装到dependencies哪里， 然后 `--dev` 对应npm的 `--save-dev`  ，`--optional` 对应npm的 `--save-optional` 。此外yarn还多了一个 `--peer` 选项，其控制的字段是 `peerDependencies` ，这是一种特殊的依赖，叫做同伴依赖，在发布包的时候需要。
- `yarn upgrade` 升级包
- `yarn remove` 移除包
- `yarn install` 安装项目所有依赖

假设你自定义了npm start这个命令，那么通过 yarn start也是一样可以调用的。

### 参考资料

其他官方文档就不赘述了。

1. node.js实战 图灵设计丛书 Node.js in action
2. [阮一峰的npm文章](http://javascript.ruanyifeng.com/nodejs/npm.html) 
3. [理解exports这篇文章](https://www.sitepoint.com/understanding-module-exports-exports-node-js/) 
4. [npx使用教程](https://www.ruanyifeng.com/blog/2019/02/npx.html)