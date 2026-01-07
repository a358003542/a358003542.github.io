Slug: javascript-npm
Date: 20231023

[TOC]


## 简介
npm提供了第三方的JavaScript模块服务，一般安装好nodejs之后除了node命令之外就有npm命令了。

项目通过运行 `npm init` ，向导式风格辅助生成本项目的包管理信息配置文件 `package.json` 。

### npm install

```
npm install module_name 
```
如上npm install 会试着安装某个模块，如果没有指定module_name，那么会根据当前文件夹的 `package.json` 文件里面的配置来执行项目初始化安装动作。


你可以通过 `-g` 选项来指明本次操作是针对全局的npm库，但除非有必要，现在是不推荐这样做了。 

`npm install` 还有一些额外的安装选项：

- **默认**是 `--save-prod` 或者 `-P` ，常规依赖包信息会放在 `dependencies` 字段下。一般和项目直接相关的包放在这里。【因为是默认值所以一般很少会打出这个 `--save-prod` ，在npm version 5之前需要额外加个 `--save`大概也是类似的功能。】

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
### npm uninstall 
npm uninstall module_name 移除某个模块 

### npm list
npm list  列出已经安装的模块

### npm update
npm update module_name 更新某个模块 【如果不写上模块名则会自动根据当前的package.json文件来进行模块升级动作】


## package.json文件详解

### name

本模块名字

### version

版本号

### description

简短描述

### main
模块入口

### private

设置为true将禁止本模块上传到npm公共库里面去

### scripts

一系列的命令行入口定义

### dependencies

包依赖

### devDependencies

开发包依赖

### homepage

模块主页

### license

版权协议

### keywords

描述关键字，示例：

```
"keywords": [
    "latex",
    "math"
  ],
```

### author

作者信息，示例： 

```
 "author": {
   "name": "Joe",
   "email": "joe@whatever.com",
   "url": "https://whatever.com"
 }
```

### repository

模块仓库，示例：

```
  "repository": {
  "type": "git",
  "url": "https://github.com/whatever/testing.git"
  }
```

### engine

nodejs等版本依赖，示例：

```
  "engines": {
  "node": ">= 6.0.0",
  "npm": ">= 3.0.0",
  "yarn": "^0.13.0"
  }
```

## 利用mocha进行单元测试

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





## 发行你自己的npm包

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
