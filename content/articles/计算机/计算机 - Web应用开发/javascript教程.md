Slug: javascript-tutorial
Date: 20191018

[TOC]

## 前言

本文在行文上是假设读者已经掌握了一门编程语言了的，所以一些基本的编程语言方面的概念不会做过多的讨论。

javascript就历史起源来说似乎并不是一个主角命，更像是编程语言世界里面一个注定跑跑龙套的。1995年某个公司开发了某个浏览器，然后该公司需要为这个浏览器开发一个脚本语言，就把这个任务丢给了 Brendan Eich ，Brendan Eich很不情愿地接受了这个不喜欢的任务，大概花了10天时间仓促完成了Javascript的设计，而且javascript最开始名字不叫javascript，叫livescript，就连javascript这个名字后面改也有点蹭Java语言的热度的嫌疑。

后面javascript的流行和大热可能是其创始人也料想不到的，实际上就是javascript后面刚发展起来的那几年，大家也只是觉得其主要作为一个前端脚本语言，对其仍然是一种轻视的态度，觉得这个语言也就写写浏览器界面的动态效果之类的。随着node.js的出现和相关生态圈的日益成熟壮大，人们才惊讶地发现javascript已经是编程世界里面最大热的几门语言之一了，继而近几年，随着javascript生态的不断成熟和壮大，再也没有人去质疑javascript作为当今编程世界里面的编程语言的主角地位了，最多只是碎碎念说几句javascript这个语言的一些问题。

## 注释

多行注释推荐如下写法：

```javascript
/**
 * make() returns a new element
 * based on the passed-in tag name
 */
```

单行注释用 `//` ，然后注释都新起一行写，如果是代码块内的注释，则前面空一行：

```js
// This is a comment that the computer will ignore. 

function getType() {
  console.log('fetching type...');

  // set the default type to 'no type'
  const type = this.type || 'no type';

  return type;
}
```

然后就是注释文字具体内容要和注释符号空一空格。

## javascript代码放在那里

javascript的代码一般推荐是放在HTML文档最后面， `</body>` 标签之前，这样能够让浏览器更快地加载页面。至于其他倒没有特别的要求，刚开始简单的javascript代码就直接写上去也是可以的:

```html
<script>
your awesome javascript code
</script>
```

如果javascript代码量有一点了那么当然还是推荐另外单独放在一个js文件上，然后如下引入进来:

```html
<script src="where"></script>
```

## javascript代码REPL环境

一般浏览器按键 `F12` 或者右键查看开发者工具可以看到debug控制台，你可以在浏览器的debug控制台上运行javascript代码。

假如你已经安装了node环境，那么输入node命令之后进入REPL环境也是可以的。。

## 资料查询

学习编程语言将最核心的概念学习完即可，本文档一开始先试着将Javascript语言最核心的内容进行讲解，再后面的内容是个人整理喜好添加进去的，读者可以以后抽时间再阅读或者遇到问题直接搜索。一般来说搜索推荐直接再权威文档MDN上搜索：[MDN docs](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript) 。

## Javascript基础

### 声明常量和变量

javascript的变量是区分大小写的。

javascript可以利用关键词 `var` ， `const` 和 `let` 来声明变量或常量，其中const是声明常量的，var和let是声明变量的。var声明变量是大家在javascript中常用的声明变量关键词，其声明的变量的作用域很不同于其他编程语言，叫做 **函数作用域** 。即你在函数区块内声明的变量整个函数体都是可以使用的，包括哪些花括号结构或任意的嵌套函数。因为程序员对于变量的作用域习惯了块作用域，所以airbnb规范提出不推荐使用 `var` ，而是推荐使用 `let`，因为 `const` 和 `let` 都是块作用域（block-scoped）。

参考mozilla上的相关讨论，变量作用域显得另类是一方面，更糟糕的是因为这个作用域会让变量声明语句可以随意放置，这会造成代码变得混乱和难以理解。**现代javascript编码推荐使用let，最好不用var**。

那么什么时候可以用var呢，请看下面的例子：

```
> var x= 1
< undefined
> let y = 2
< undefined
> console.log(window.x)
< 1
< undefined
> console.log(window.y)
< undefined
< undefined
```

let声明的变量是不能挂载在window上作为全局变量的，如果你确实有意要制造一个全局变量，那么可以使用var来声明之。【但即使是这种情况也可以通过 `window.x=1` 这样的代码来完成，所以**代码里面完全不用var关键词是完全可以的**。】

读者可能会看到某些javascript代码直接写上 `x=1` ，前面没有写上关键词，严格意义上来说这不叫声明变量，而是在全局对象上挂载了x这个属性，从编码规范来说是应该抵制这种写法的。如果你看到 `x=1` 这样的语句那也只是因为之前你已经用 `let x` 声明该变量了。

### 全局变量

在网页中有个全局对象 `window` ，如前面的讨论，通过var声明的全局变量就是将这个变量作为属性挂载在window对象上。

在nodejs那边全局对象名字叫做 `global` ，现在有标准不管是什么环境，都应该支持 `globalThis` 这个名字来指向这个全局变量。

### 变量命名风格

虽然有的语言会偏好小写字母加下划线风格，有的语言会偏好驼峰风格，具体这块个人认为规定很细是没有意义的，有点像是空格是四格还是两格，鸡蛋从大头吃还是小头吃，唯一的要求就是变量名，某一种类型的变量名应该尽可能保持一种命名风格，这里说的命名风格包括前面说的两种风格，还包括编码者自创的统一前缀，统一后缀风格等等。从而可以让编码者一看就知道这个变量是函数名还是类还是一般变量等等。

这一点其实也不是编程语言的死规定，编程语言关于变量名的死规定就是那些：

- 只允许字母，数字，`$` 和 下划线
- 不可以是关键词
- 数字开头不行

其他符合条件的都是合法的变量名。但上面讨论的 **某一类型变量命名风格应该统一的原则** 在实践中提供了太多的便利，以至于几乎大部分编程人员慢慢都会将这个作为变量命名的另一法则。

### 分号

分号在编程语言这里都是表示一行或者说一句编程语言结束。其在一些编程语言中是强制性的，在python和javascript这样的高级编程语言是非强制性的，但实际上更确切来说是代码规范角度来说，是推荐不加上的。

不过javascript似乎在某些情况下会存在识别困难，比如[现代javascript教程这一小节](https://zh.javascript.info/structure#semicolon) 提到的下面的情况：

```
alert("Hello")

[1, 2].forEach(alert);
```

这里javascript引擎会出现识别困难，将语句识别成了：

```
alert("Hello")[1, 2].forEach(alert);
```

这种情况似乎一定要加分号，但上面的写法更多的是为了制造错误而制造错误的代码，通过改变写法一样可以完成同样的事情而且不需要加分号的。

```
alert("hello")

let x = [1,2]
x.forEach((v,i) => alert(v))
```

说到识别困难，[参考资料5的1.4小节](https://wangdoc.com/javascript/types/object.html) 提到了另外一个情况：

```
{ foo: 123 }
```

这将被识别为对象还是花括号包围的语句，Javascript引擎会将其识别为代码块，编码人员应该避免这样的代码出现，这样一个随机漂浮的对象也是没有意义的，如果要新建一个对象则应该将值赋值给某个变量。

```
let x = {foo : 123}
```

### 程序中的操作对象

#### 简介

javascirpt的数据类型分为两类，一类是原始类型：数值、字符串和布尔值；另一类是对象类型。此外javascript还有两个特殊的值：`null` 和 `undefined` 。javascript除了数值、字符串、布尔值、null、undefined之外就都是对象了。比如后面提到的数组，函数也都是对象，只不过其是javascipt内部定义的对象。

#### typeof操作符

查看某个对象的对象类型，typeof操作符只可能返回以下六种结果：

- number
- string
- object
  - function
  - array
  - date
  - regexp
- boolean
- null
- undefined
- symbol (new in es6)

```javascript
typeof x
"undefined"
typeof 1
"number"
```

#### null和undefined

javascript的 `null` 。其是一个特殊值。类似于python的 `None` ，然后还有一个什么 `undefined` 。比如函数没有明确return值就会默认返回 `undefined` ，感兴趣的可能查一下这两个的区别，我看了一下，觉得挺无聊的。 `==` 和 `===` 的区别在这里就体现出来了，如果用 `===` ，则 `undefined` 是不等于 `null` 的，如果用 `==` ，则javascript会额外做一些类型转换工作，这两个会看作相等的。

ECMA-262 规定：

```
null == undefined; -> return true
```

比较操作的时候一律推荐使用 `===`  和 `!==`  ，而不要使用 `==` 和 `!=` 。

#### 布尔值(boolean)

javascript的布尔值是 `true` 和 `false` 。在进行比较判断操作时，如果你是希望比较值的话，类似python的比较判断 `==` 符号，在javascript中对应的是 `===` 。三个等号，这不是什么别出心裁，也没有任何实际的好处，就是javascript的历史遗留问题罢了。

```
=== Equal to
!== Not equal to
```

boolean值的判断遵循以下规则：

1. `false` `0`  空字符串 `""`  `NaN`  `null`  `undefined` 都被视作false
2. 其他都被视作true

```js
> Boolean({})
true
```

#### 数值(number)

**javascript不区分整数值和浮点数值**，javascript中所有数字都用浮点数值表示，这是javascript和其他编程语言的很大不同。然后数值型那些运算，比如加减乘除之类的就不用多说了。其中 `%` 和python一样也是求余操作。在python3中有 `5//2` 是求商的概念，javascript没有这个概念，我们需要如下来获得类似的效果。

```
parseInt(5/2)
```

##### parseInt()

将字符串转成整数型。

```js
> parseInt('2.5')
2
```

parseInt第二个参数表示输入字符串的进制：

```
> parseInt('0xff', 16)
< 255
```

##### NaN

表示不是有效数值概念。

如果我们执行 `parseInt('abc')` ，那么将返回 `NaN` ，判断是否是NaN如下所示：

```js
> Number.isNaN('a')
false
> Number.isNaN(1)
false
> Number.isNaN(NaN)
true
```

**注意：** javascript还有一个全局函数`isNaN` ，其和Number.isNaN行为不太一样，一般推荐使用 `Number.isNaN` 。Number.isNaN意思很明显就是判断是否是NaN这个值，而全局的isNaN更像是在说输入的这个东西是不是一个数值或者能不能转成一个数值，true则不能，false则能。

```
> typeof NaN
< 'number'
```

##### Infinity

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

##### parseFloat

将一个字符串转成浮点数。

```
> parseFloat('3.1415')
< 3.1415
```

#### 字符串(string)

javascript同python一样**单引号和双引号都是可以的**。

```js
const name = 'Capt. Janeway';
```

你可以通过 `+` 来实现一些简单的字符串拼接工作，也可以如下进行字符串模板操作。

```js
`How are you, ${name}?`
```

javascript的字符串类型和python非常类似，比如 `string[0]` 是支持的【这种写法不支持负数索引】。然后不可以这样用string[0:2]，幸运的是javascript提供了类似python中的那种切片概念，就是使用 `slice` 方法

```
> "hello".slice(0,2)
'he'
> [1,3,4,5].slice(0,2)
[ 1, 3 ]
```

不过javascript的slice方法和python的切片操作还是有点区别的，其只有 `(start,end)` 两个参数，然后其也有负数从末尾算起的概念，slice方法只有从start到end的切片方向，比如你从-1切到-2则内容是空的，slice方法的end参数不填写则就是指一直切到最后。具体请参看 [这里](http://www.w3school.com.cn/jsref/jsref_slice_string.asp) 。

##### length属性

该字符串的长度

```
> "hello".length
< 5
```

##### 字符串的其他方法

这里简单提一下，有需要则查下对应的 [文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String) 。

- **toUpperCase:** 变成大写
- **toLowerCase:** 变成小写
- **indexOf:** 返回子字符串出现的索引位置，index索引编号规则和python相同。
- **substring:** 返回子字符串，如果熟悉python的那种切片规则的话，那么推荐就直接使用 `slice` 方法。
- **replace:** 替换操作 
- **split:**  分割操作



#### 对象

本文将作为数据结构的对象和作为面向对象编程中的对象这两个对象概念进行了区别，也许这个东西在javascript中就是一个东西，但这无关紧要。

对象是一个整合了数据和函数的集合。

```javascript
> let x = {}
undefined
> x = {'a':1}
{ a: 1 }
```

下面演示了对象如何整合函数（或者叫做方法）的例子：

```javascript
let x= {
  'data': [1,2,3,4],
  'length': function(){return this.data.length}
}

console.log(x.length())
```

我们大概能够猜测出一些javascript底层如何实现的细节，但这对于目前阶段学习和使用这个编程语言来说是没有裨益的。前面在介绍typeof的时候提到数组，函数都是对象。

新建一个数组的完整写法是： `new Array()` ；新建一个对象的完整写法是：`new Object()` 。新建一个类的写法如下所示：

```javascript
class Rectangle {
  constructor(height, width) {
    this.height = height;
    this.width = width;
  }
}

let p = new Rectangle();
```

因为后面有class这样的概念，我是推荐将这些出现的对象看作类似python中字典的概念，一个键值对映射集合。从编程概念上讲也是需要这样一个数据类型的。然后数组，这里的对象，函数，用户自定义的类等用typeof去查看都是object，他们都属于object。这个object是否就是这里的Object，从实现层面上我还不大确切，但这不是重点，就算是，从编程概念上来说也是应该有所区分的。一个是实用的数据类型，一个是很抽象的面向对象编程概念上的底层表述。

##### in语句

判断某个对象时候有某个键。

```js
'name' in xiaoming;

> var d = {}
undefined
> d['a'] = 1
1
> d
Object {a: 1}
> 'a' in d
true
> 1 in [1,2,3]
true
```

##### hasOwnProperty方法

和in语句的区别是 `hasOwnProperty` 只会处理自身属性，不会处理那些继承过来的属性，在这里不会考虑继承问题，所以基本上是没有区别的。

```javascript
d = {'a':1}
d.hasOwnProperty('a')
true
```

##### delete语句

其对应的就是python的del语句。然后我们看到javascript的 `delete` 语句删除不存在键也不会报错。

```js
> d
Object {a: 1}
> delete(d.b)
true
> d
Object {a: 1}
> delete(d.a)
true
> d
Object {}
```
##### 计算属性
如果对象的属性用方括号括起来，这个叫做计算属性：

```
> let x = "a"

> let obj = {
    [x] : 1
}

> obj
{a: 1}
```
意思是这个属性的属性名是由方括号其内的变量计算得到的。对象初始化之后该属性名就不会变动了，即使你后面再去修改那个变量的值。可以看到计算属性在某些情况下是一个很有用的属性名定义方法，在那些情况下恰当地使用即可。









#### 数组

javascript的数组（array）其本质也是一个类似上面讨论的对象，只不过其key默认为 `"0","1"` ，从而保留了元素的次序。所以如果你使用语句：

```
> 0 in ["a"]
true
```
所以不要用in语句来判断array是否含有某个元素，那是错误的，而应该使用array的 `includes` 方法：
```
> ["a"].includes("a")
true
```

##### 构建一个数组

```js
let array1 = []
let array2 = new Array()
const items = [1, 2, 3.14, 'Hello', null, true]
```

其索引index编号法则也和python一致。

##### length属性

该数组的长度

##### 数组的一些方法

这里简单提一下，有需要则继续查阅 [相关文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array) 。

- **indexOf:** 返回数组某个子元素的索引位置
- **slice:** 切片操作，类似于python的 `lst[0:2]` 那种表达方法。slice方法不接受参数就默认返回该列表所有引用，也就是通常所说的 *浅拷贝* 。浅拷贝简单来说就是复制一个字典或者数组（或者其他复杂对象），根据第一层key赋值第一层value，如果第一层key是另外一个对象的引用，那么拷贝前对象和拷贝后对象都会指向统一对象，深拷贝就是进一步深入递归拷贝。
- **push:** 末尾添加一个元素
- **pop:** 最后一个元素删除
- **unshift:** 数组头部添加一个或多个元素，返回新数组的长度
- **shift:** 数组头部删除一个元素
- **sort:** 排序，破坏型。值得一提的是对于数字排序并不是按照从大到小的顺序来的，不太清楚为何:

```
> var lst = [1,5,2,3,51,4,45,545,541,48,77]
> undefined
> lst.sort()
> [ 1,
> 2,
> 3,
> 4,
> 45,
> 48,
> 5,
> 51,
> 541,
> 545,
> 77 ]
```

在python中最多说字符串就这样，但这里是number类型啊。然后要正常排序，我们需要如下操作（参看 [这个网页](http://www.w3school.com.cn/jsref/jsref_sort.asp) ）:

```js
var lst = [1,5,2,3,51,4,45,545,541,48,77]
function sortNumber(a,b){
return a - b
}
lst.sort(sortNumber)
alert(lst)
```

这里sort方法接受一个函数参数，这个函数接受两个参量，用来判断a和b的值大小，如果返回值小于0，则a放在前面。如果返回值大于0，则a放在后面。这种排序方法也支持数字字符串的情况。javascript在处理这种 `字符串 - 字符串` 的情况是会尝试做转换成number类型的才做。

- **reverse:** 反转，破坏型。
- **splice:** 从指定的索引删除某些元素，然后在此处添加某些元素，相当于update更新了。

```js
> var arr = ['Microsoft', 'Apple', 'Yahoo', 'AOL', 'Excite', 'Oracle'];
> undefined
> arr.splice(2, 3, 'Google', 'Facebook');
> ["Yahoo", "AOL", "Excite"]
> arr
> ["Microsoft", "Apple", "Google", "Facebook", "Oracle"]
```

参数意思是从索引2开始删除3个元素，然后添加后面的元素。从上面的例子可以看出splice方法是破坏型的方法，然后其返回的是删除了的那是那个元素。

splice方法也可以用于只删除不添加也就是纯删除操作，或只添加不删除的纯添加操作。

```
// 只删除,不添加:
arr.splice(2, 2);
// 只添加,不删除:
arr.splice(2, 0, 'Google', 'Facebook');
```

- **concat:** 连接两个数组，非破坏型。

```
> var lst1 = [1,2,3]
> undefined
> var lst2 = ['a','b','c']
> undefined
> lst1.concat(lst2)
> [1, 2, 3, "a", "b", "c"]
```

- **join:** 类似于python字符串的join方法，如下所示:

```
var arr = ['A', 'B', 'C', 1, 2, 3];
arr.join('-'); // 'A-B-C-1-2-3'
```

- **fill:** 数组用某个值来填充

#### 显示类型转换
- Number 转成数值型 `Number("a")` ，转换总不会报错，不是数值的会返回NaN。
- String 转成字符串型
- Boolean 转成布尔型



### 函数

一个简单的函数对象定义如下所示：

```javascript
let greeting = function(name){
    console.log(`hello, ${name}.`);
}
greeting('world')
```

上面的写法对于匿名函数来说某些情况下也许会用到，但一般定义函数还是采用如下写法：

```js
function abs(x){
    if (x >= 0) {
      return x;
    } else {
      return -x;
    }
}
```

这两种定义风格是完全等价的。这里值得一提的是如果函数没有确定return值，则返回的是 `undefined` 。

#### 默认参数

和python的写法相同：

```
function temperature(n = "25")
{
  console.log(`${n} degree.`)
}
```

```
> temperature()
25 degree.
```

如果不是类似上面的给定默认参数，则参数会默认填写 `undefined` 。

#### arguments用法

javascript的函数内部可以直接使用 `arguments` 这个变量，其不是一个数组，会有一些区别，但一般类似数组那样使用是没有问题的:

```
arguments[0]
arguments.length
```

其会接受传入函数的所有参量。

#### 不定参数
提到不定参数就要讲到javascript的spread语法，比如：

```
> function sum(x, y, z) {
  return x + y + z;
}

> const numbers = [1,2,3]

> sum(...numbers)
6
```
javascript的不定参数就是用spread语法来是实现的：

```js
function func(a,b,...rest){
    console.log(rest);
}
```
```
> func(1,2,3,4,5)
[ 3, 4, 5 ]
```

这个rest名字是随意的。再比如 `Object.assign` 接受的参数为 `Object.assign(target, ...sources)` ，

```
{
let o1 = {a: 1 }
let o2 = {b : 2}
let o3 = {c : 3, a: 5}

Object.assign(o1, o2, o3)
}
```
```
{ a: 5, b: 2, c: 3 }
```
上面实现了不定数目对象的merge动作。

#### 箭头函数

简单来说箭头函数就是 lambda 表达式的更简洁写法，只是说在javascript语境下其和一般function的区别是：<u>其没有this绑定</u>。

```js
(param1, param2, …, paramN) => { statements }
```

#### 闭包

在lisp语言那边会有一个自由变量的概念，其他一些函数编程语言会将这个概念叫做闭包，闭包的作用原理就是基于变量的块作用域和该编程语言的函数执行代码块。

请看下面这个例子：

```js
function report()
{
  let count = 0
  function add1()
  {
    count++
  }
  for (let i=0;i<3;i++)
  {
    add1()
  }
  console.log(count)
}
```

最终将打印数字3，这个count就是所谓的闭包变量或者自由变量。如果读者已经很深入理解了编程语言的函数执行代码块和各个变量内存管理和作用域的概念，那么闭包是没有什么新鲜的东西的。

### 程序中的逻辑

这一块如果读者熟悉一门编程语言的话，粗略地了解下扫一遍基本上就掌握了javascript相关语句知识。下面本小节也不会过多地讨论，只是就某些应用上常见的知识点做出一些说明。

#### 条件判断结构

条件判断结构，和python大同小异，除了那些圆括号（记住这个圆括号必须加上）和花括号。

```js
let feedback = 10
if (feedback > 8) {
    console.log("Thank you! We should race at the next concert!")
} else {
    console.log("I'll keep practicing coding and racing.")
}
```

虽然javascript不像python那样强制缩进风格，但还是推荐用缩进来增强你的代码可读性和逻辑清晰性，如:

```js
let age = 20
if (age < 6) {
    console.log('kid')
} else if (age >= 18) {
    console.log('adult')
} else {
console.log('teenager')
}
```

javascript有switch语句，作为我们pythoner你懂的，用多个else if语句也是可以的。

#### switch语句

```javascript
function set_choice() {
  choice = 'second'
  switch (choice) {
    case 'first':
      console.log('first');
      break;
    case 'second':
      console.log('second');
      break;
    default:
      console.log('default');
  }
}
```

#### 三元运算符

```
> let b = null
< undefined
> b = b ? b : 2
< 2
```

如果b为true则返回b的值，否则取后面的值。

#### while语句

下面语句从数字0打印到数字4，共打印5次。语句用花括号包围起来让整个片段语句总不会影响外围，自身运行逻辑也总不受影响。

```js
{
let i = 0
let count = 5
while (i < count) {
  console.log(i)
  i++
}
}
```

还有do while 语句

```js
{
  let i = 0
  let count = 5
  do {
    console.log(i)
    i++
  }while(i < count)
}
```

#### for语句

一般来说很多循环语句任务while语句和for语句彼此都是能做的。不过在很多应用场景下，比如一些短小的循环任务、遍历任务等，是推荐使用for语句的，因为for语句在那些应用场景下编程语句会更简练一些。

```js
for (let i=0, count=5; i < count; i++){
   console.log(i);
}
```
##### for遍历字符串
```js
for (let c of "abc"){
  console.log(c)
}
```
```
a
b
c
```

##### for遍历数组

如下利用for语句来遍历数组的值：

```js
{
  let s = ""
  for (let v of ['a','b','c']) 
  {
    s += v
    s += ','  
  }
  console.log(s)
}
```

上面的例子最后的逗号我们希望能够不打印出来，这需要判断最后一个索引值：

```js
{
  let s = ""
  let array = ['a','b','c']
  for (const [i, v] of array.entries()) 
  {
    s += v
    if (!(i === array.length - 1))
    {
      s += ','  
    }
  }
  console.log(s)
}
```

此外遍历数组还可以使用forEach方法，了解下：

```js
> let a = ['a', 'b', 'c']
< a.forEach(function(value, index){
    console.log(value, index);
})
> a 0
> b 1
> c 2
```

##### for遍历对象

如下用for语句来递归遍历对象的key:

```js
for (let i in {'a':1,'b':2}) {
    console.log(i)
}
```
```
a
b
```

#### break和continue

大体类似于python里面的break和continue语句逻辑，break语句是跳出外围循环，continue是结束本轮循环，然后开始下一轮循环。

#### 异常处理

类似于python的 `try...except...` ，javascript有：

```js
try {
    throw （new Error("Invalid Parameters"));
}catch (e) {
    console.log(e);
}finally {
    //always do something.
}
```

### 面向对象编程

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

#### constructor方法
面向对象编程里面常见的概念，即该对象的构造方法，在新建实例化该对象时被调用。

#### toString方法
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

#### in语句

判断某个对象时候有某个属性，继承过来的属性也会识别在内。

```js

```

#### hasOwnProperty方法

和in语句的区别是 `hasOwnProperty` 只会处理自身属性，不会处理那些继承过来的属性。

```javascript

```

#### this

在javascript里面，object里面定义的方法， `this` 指向的就是本对象的实例。因为函数也是一个对象，所以在函数里面也是可以使用this的，如果 `this` 在函数里面：

```
function (){
    this.x = 1;
}
```

那么其代表的是这个函数要运行的时候，具体 **调用** 这个函数的对象。

比如说某个函数将这样被调用： `jquery对象.what` 那么这个函数里面的this就是指定的那个jquery实例，通常也就是网页里面的某个标签元素。


#### 属性的get和set

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

#### 类的继承

关于面向对象的继承概念这里就不赘述了。

```javascript
class Dog extends Animal{
   //
}
```

#### super

类似python语言里面的super概念，引用父类。

#### instanceof

类似于python语言中的isinstance函数。

```
obj instanceof Class
```

#### toJSON方法
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


------------

下面的内容不是javascript语言核心了，读者有时间再阅读之。

## 字符串

### 字符串的match方法

字符串的match方法可以跟上 RegExp 对象来继续正则表达式匹配操作。


## 集合

javascript中的集合Set大体也和python中的集合概念相近。

var s1 = new Set(); // 空Set
var s2 = new Set([1, 2, 3]); // 含1, 2, 3

然后其也有 `add` 方法用于添加一个元素。用 `delete` 方法来删除某个元素。

## 函数
### 命名函数表达式
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

### 函数装饰器


### 立即执行的匿名函数

我们常见到某个js脚本一整段都被这样一种写法包围着：

```
(function($){…})(jQuery)
```

这是定义了一个匿名函数，其将立即执行，接受了一个jQuery参数，并传递给了匿名函数。

之所以这种写法很常见是因为这样做可以将整个模块的代码都放在一个匿名函数里面，这样模块里面定义的全局变量就成了函数内的局部变量了，这样不会污染全局变量命名空间。

## 对象
#### 获取对象的keys数组

```
> Object.keys({"a":1,"b":2})
[ 'a', 'b' ]
```

#### 获取对象的values数组
```
> Object.values({"a":1,"b":2})
[ 1, 2 ]
```

#### 获取对象的entries数组

```
> Object.entries({"a":1,"b":2})
[ [ 'a', 1 ], [ 'b', 2 ] ]
```

### 属性名简写
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

### 构造函数
### Symbol


### 对象的原型

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
## Reg对象

## DOM操作
所谓DOM操作就是用Javascript来操作修改页面内容，这基本上是client端javascript的主要工作内容。

如果熟悉python的beautifulsoup或者lxml之类的分析网页的模块，那么对Javascript的这些DOM操作概念都不会太陌生。我这里就不做太多抽象的术语上的讨论了，下面的讨论会更加注重实践方面的东西。

### document
document就是html文档的主对象，document.body就是对应着body这个标签对象。这里所说的标签对象在javascript的DOM这边对应的是Element类。在Javascript的实现中Element类并不是最底层的类，Element类继承自Node类。一般在html文档这边我们能看到的标签都是Element类，实际上通过Element类和它提供的便捷方法一般就能够完成DOM的大部分操作任务。

比如下面这个例子：

```javascript
let e = document.createElement('li')
let t = document.createTextNode('this is text.')
e.append(t)
```

读者可以试一下，从这些方法的名字可以直接看出来，第一行就是创建了一个Element对象，具体就是创建了一个li标签。第二行是创建了一个文本节点。第三行是在Element最后一个子节点之后插入一个Node对象或DOMString对象【这就是MDN文档的原话】。最终结果就是：

```
'<li>this is text.</li>'
```

但具体获得上面这个字符串要使用 `e.outerHTML` 。

这个例子只是演示目的，实际操作只需要：

```
e.textContent = 'new text'
```
根本不需要了解文本节点这个概念，当然Element类的 `textContent` 这个属性调用的底层实现肯定是基于文本节点来的。再比如属性有一个属性节点的概念，同样类似上面文本节点的讨论，一般通过Element类及其提供的方法就能完成DOM的绝大部分操作，如果有代码出现了文本节点或者属性节点等概念，但是代码的具体工作通过Element类的某个方法就能够完成，那么我们应该说这个代码是有问题的，是故意写的晦涩难懂。


#### 查找目标标签
如果目标标签有id那么自然就直接根据id来。 

```
let e = document.getElementById('test')
```
返回的是找到的目标标签或者说Element对象。不用带 `#` 符号。

现在已经不推荐使用getElementsByTagName之类的方法了，querySelector和querySelectorAll已经足够强大和好用，不需要那些杂七杂八的方法了。

querySelectorAll和querySelector的区别是其返回的是所有匹配的结果而不是第一个匹配项，所以返回的是一个类似Array的对象。虽然不是数组但一般方法操作length，for语句之类的都有。

querySelector的语法使用如果熟悉css那种匹配规则的话那么立马就可以写出对应标签的匹配语句了：
```
let e = document.querySelector('.class')
```

具体MDN的官方文档直接说明了其是一个 **CSS选择器字符串** ，所有有匹配问题实在不清楚的查阅css选择器书写规则即可。

匹配到的Element对象如果还想继续查找的话可以继续调用该Element对象的 `querySelector` 和 `querySelectorAll` 方法。注意上面的表述里面 **没有 `getElementById` ** 。

因为querySelector和querySelectorAll最常用，现代Javascript教程里有一段指出，querySelector和querySelectorAll其返回的是 **静态的集合**。也就是这两个方法是立即调用立即查找，结果封存不变，这个了解一下。


#### 标签之间的关系
document不是Element对象，`document.documentElement` 才是Element对象，其对应的是html这个标签。

再实践中推荐采用下面的属性来实现纯元素导航。

- children 返回本标签下面的子标签 【没有并不是返回的null，用childElementCount来判断。】
- parentElement  返回本标签上面的父标签 【没有则返回null】
- firstElementChild 本标签下面的第一个子标签 【没有则返回null】
- lastElementChild  本标签下面的最后一个子标签 【没有则返回null】
- previousElementSibling 本标签上面的兄弟标签 【没有则返回null】
- nextElementSibling 本标签下面的兄弟标签 【没有则返回null】




#### matches
```
Element.matches(css)
```
返回布尔值，该标签是否匹配给定的css选择器。





#### setAttribute

`Element` 对象可以调用这个 `setAttribute` 方法来设置标签内的属性值。

```
element.setAttribute(name, value);
```

#### dataset

查询到的元素如果div则是更具体的HTMLdivElement等等，其继承自HTMLElement，HTMLElement有一些专门的方法。比如这个dataset，其是可以只读属性，对应html中的`data-*` 这样的属性值，比如说 `data-name` 将变成dataset的`{'name': 'what'}` 。

#### classList

类似上面的讨论也是HTMLElement的一个属性，表示class属性数组。


#### textContent

之前提到querySelector查到某个Element之后想要取出其文本内容可以调用 `textContent` 属性，document和Element都能这样做只是因为它们继承自Node对象，具体textContent这个属性的定义是在Node对象这里。

#### parentElement

返回本节点的父节点

```
parentElement = node.parentElement
```

#### removeChild

移除本节点的某个子节点

```
node.removeChild(child);
```


### setInterval

```
setInterval(func, 1000)
```

启动一个计时器，第二个参数是时间间隔，每个那个时间间隔将会执行一次目标函数，默认单位是ms。

### setTimeout

类似setInterval，启动一次性任务。

### location

该窗口的Location对象

### history

该窗口的History对象


### 事件

Element对象继承自EventTarget从而获得了这些方法： `addEventListener` ， `removeEventListener` 和 `dispatchEvent` ，这几个方法都是和事件处理相关的。

熟悉GUI桌面程序的话会对事件有个大致的理解，大体类似于QT里面的信号。

#### CustomEvent

自定义一个事件，第二个参数可以是任意的信息。

```
  new CustomEvent(name, { bubbles: true, cancelable: false })
```

#### dispatchEvent

程序触发某个Element元素上监听的事件

```javascript
target.dispatchEvent(
      new CustomEvent(name, { bubbles: true, cancelable: false })
);
```

#### addEventListener

给某个元素增加一个事件监听

#### removeEventListener

移除某个元素上的事件监听

#### event.target和event.currentTarget的区别

事件响应到调用函数那边，通过event.target或者event.currentTarget可以引用触发事件的浏览器对象，不过它们是有一点区别的。

首先说一下事件的冒泡机制，当某个元素触发了某个事件，其会触发本元素上事件响应处理程序，然后该事件会继续冒泡到本元素的父元素之上，再触发父元素的事件响应处理程序。

event.target是引用那个最开始触发事件的那个目标元素，而event.currentTarget是引用那个实际处理事件的元素。比如说某个div里面有一个button，你给div绑定了事件监听处理函数，然后那个事件监听处理函数里面调用 `event.currentTarget` 则会指向那个div，而如果你调用 `event.target` 则会引用最开始触发click事件的那个元素，也就是button。

在一个目标button里面处理click事件使用event.target或者event.currentTarget是没有区别的。


## 模块
一个模块就是一个js文件。

通过import export来实现模块间对象的互相调用。

TODO



## no-jquery

更多相关知识请参阅参考资料四，即 [这个Github项目](https://github.com/nefe/You-Dont-Need-jQuery/blob/master/README.zh-CN.md) 。下面就一些重点知识做出一些整理。

### 选择

jquery的选择是该库很核心的一个功能，现代JavaScript提供了 `document.querySelector()` 和 `document.querySelectorAll()` 来作为替代。然后原来的 `document.getElementById()`  ， `document.getElementByClassName()` 或 `document.getElementByTagName()` 性能更好。

```
// jQuery
$('selector');

// Native
document.querySelectorAll('selector');
```

#### 选择class

```
// jQuery
$('.class');

// Native
document.querySelectorAll('.class');

// or
document.getElementsByClassName('class');
```

#### 选择id

```
// jQuery
$('#id');

// Native
document.querySelector('#id');

// or
document.getElementById('id');
```

### ajax

更多信息请查看mozilla关于 [fetch函数的介绍](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API) 。

```javascript
fetch("http://localhost:8080").then(
  function(response) {
    console.log("请求状态: " + response.status);
    return response.text();
  }
).then(function(text){
  console.log("返回文本：" + text);
})
```

fetch将请求一个URL，然后调用后面的函数。其中`response.text()` 返回的是一个Promise对象，什么是Promise对象，可以类比作python异步编程里面的协程，继续调用then才能获得内容。

如果你请求的是JSON api接口，那么可以直接调用 response.json来处理返回结果：

```javascript
fetch("http://localhost:8080").then(
  function(response) {
    return response.json();
  }
).then(function(result){
  console.log(result);
})
```

## 其他

### 严格模式

[现代javascript教程该小节](https://zh.javascript.info/strict-mode) 提到如果代码写在 `class` 或者 `module` 里面的时候，会自动开启严格模式，这个值得了解下。 


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

## 参考资料

1. Javascript权威指南 David Flanagan著.
2. [mozilla docs](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript)
3. [现代javascript教程](https://zh.javascript.info/)
4. [you donot need jquery](https://github.com/nefe/You-Dont-Need-jQuery/blob/master/README.zh-CN.md)
5. [Javascript教程](https://wangdoc.com/javascript/index.html)