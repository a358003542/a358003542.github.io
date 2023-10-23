Slug: javascript-language
Date: 20231019
Modified: 20231021


[TOC]

## 数值
### Infinity

表示数值的无穷大概念。

```
> typeof Infinity
< 'number'
```

正无穷大和负无穷大不相同：

```
> Infinity === -Infinity
< false
```

## 字符串的match方法

字符串的match方法可以跟上 RegExp 对象来继续正则表达式匹配操作。


## 命名函数表达式
类似下面这样的东西：
```js
let sayHi = function func(who) {
  alert(`Hello, ${who}`);
};
```
其和
```js
let sayHi = function (who) {
  alert(`Hello, ${who}`);
};
```
的区别是这个函数多了一个局部的函数名字，可以被函数内部自身调用自身使用。之所以不直接使用外部赋值的那个变量，是防止该变量被污染然后导致函数运行出错。


## 立即执行的匿名函数

某个js脚本一整段都被这样一种写法包围着：

```
(function($){…})(jQuery)
```

这是定义了一个匿名函数，其将立即执行，接受了一个jQuery参数，并传递给了匿名函数。

之所以这种写法很常见是因为这样做可以将整个模块的代码都放在一个匿名函数里面，这样模块里面定义的全局变量就成了函数内的局部变量了，这样不会污染全局变量命名空间。这是一种过时的老代码写法。现代JavaScript应该采用类似下面这样的写法：

```javascript
if (document.readyState !== 'loading') {
    your_function()
} else {
    document.addEventListener('DOMContentLoaded', your_function)
}
```

## 类

现代javascript推荐使用class来定义类：

```javascript
//定义类
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return '(' + this.x + ', ' + this.y + ')';
  }
}
```

以前老式的写法如下所示，可以了解下：

```javascript
function Point(x, y) {
  this.x = x;
  this.y = y;
}

Point.prototype.toString = function () {
  return '(' + this.x + ', ' + this.y + ')';
};

var p = new Point(1, 2);
```

### constructor方法
面向对象编程里面常见的概念，即该对象的构造方法，在新建实例化该对象时被调用。

### toString方法
一般自己定义的对象推荐加上一个 `toString` 方法：

```js
class Jedi {
  constructor(options = {}) {
    this.name = options.name ?? 'no name';
  }

  getName() {
    return this.name;
  }

  toString() {
    return `Jedi - ${this.getName()}`;
  }
}
```

```
< jedi = new Jedi()
< jedi.name
> 'no name'
< jedi.toString()
> 'Jedi - no name'
```

上面的 `??` 是空值合并运算符，如果左侧为 `null` 或者 `undefined` 则返回右边的值，否则返回左边的值。现在javascript在处理默认值的问题上推荐使用空值合并运算符而不是逻辑或`||`。

### in语句

判断某个对象时候有某个属性，继承过来的属性也会识别在内。

```js

```

### hasOwnProperty方法

和in语句的区别是 `hasOwnProperty` 只会处理自身属性，不会处理那些继承过来的属性。

```javascript

```

### this

在javascript里面，object里面定义的方法， `this` 指向的就是本对象的实例。因为函数也是一个对象，所以在函数里面也是可以使用this的，如果 `this` 在函数里面：

```
function (){
    this.x = 1;
}
```

那么其代表的是这个函数要运行的时候，具体 **调用** 这个函数的对象。

比如说某个函数将这样被调用： `jquery对象.what` 那么这个函数里面的this就是指定的那个jquery实例，通常也就是网页里面的某个标签元素。


### 属性的get和set

面向对象编程里面这个是自定义对象重要的一个设计点，javascript采用如下`get name()` 这样的写法： 

```javascript
class User {
  constructor(name) {
    this._name = name;
  }

  get name() {
    return this._name;
  }

  set name(value) {
    if (value.length < 4) {
      console.log("Name is too short.");
      return;
    }
    this._name = value;
  }
}

let user = new User("John");
console.log(user.name);
```

### 类的继承

关于面向对象的继承概念这里就不赘述了。

```javascript
class Dog extends Animal{
   //
}
```

### super

类似python语言里面的super概念，引用父类。

### instanceof

类似于python语言中的isinstance函数。

```
obj instanceof Class
```

### toJSON方法
自定义的对象定义了这个方法，则该对象可以被 `JSON.stringify` 正确调用。

比如：
```js
class Test{
  toJSON() {
    return {"a": 1, "b": 2 }
  }
}

t = new Test()
```
```
> JSON.stringify(t)
'{"a":1,"b":2}'
```



## 属性名简写
如下所示：

```
> let name = "bob"
> let age = 28
> let user = {name,age}
> user
{name: 'bob', age: 28}
```
传统的写法是：

```
let user = {
  name:name,
  age:age
}
```

## 对象的原型

JavaScript的对象大多有一个原型对象，其从原型继承属性。可以通过 `Object.prototype` 来引用该对象的原型对象。

要检测一个对象是否是另外一个对象的原型可以使用 `isPrototypeOf` 方法：

```
p.isPrototypeOf(o) // if true then the p is the o's prototype.
```


## Date
[Date MDN 文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date)

## JSON

[JSON MDN 文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/JSON)

JSON支持的对象有：object，array，string，number，boolean 和 null 。

如下所示，下面也演示了利用 `JSON.parse` 来将相应的JSON字符串转成JavaScript对象。

```javascript
> let x = JSON.stringify({ x: 5, y: 6 });
undefined
> x
'{"x":5,"y":6}'
> typeof x
'string'
> let y = JSON.parse(x)
undefined
> y
{ x: 5, y: 6 }
> typeof y
'object'
```



## 其他
### map和filter和reduce

这三个函数是函数编程很重要的几个函数，在数组对象里面可以直接调用这些方法：

```
a.map(function)
```

### 表单提交按钮防止多次点击多次提交

参考了 [这个网页的第一小节](https://www.the-art-of-web.com/javascript/doublesubmit/) ，觉得这个解决方案很是简单，而且有效。对于单页面表单，也就是提交成功了通常切换到另外的网页那边去了的，还是很好地适用的。可能在某些情况下，本解决方案会令人不太满意，因为这个提交按钮只要提交之后就显示按钮一直处于禁用状态。

```html
<form method="POST" action="..." onsubmit="myButton.disabled = true; return true;">
...
<input type="submit" name="myButton" value="Submit">
</form>
```