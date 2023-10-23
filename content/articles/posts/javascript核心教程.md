Slug: javascript-core-tutorial
Date: 20191018
Modified: 20231021


[TOC]

## 初识JavaScript
javascript就历史起源来说似乎并不是一个主角命，更像是编程语言世界里面一个注定跑跑龙套的。1995年某个公司开发了某个浏览器，然后该公司需要为这个浏览器开发一个脚本语言，就把这个任务丢给了 Brendan Eich ，Brendan Eich很不情愿地接受了这个不喜欢的任务，大概花了10天时间仓促完成了Javascript的设计，而且javascript最开始名字不叫javascript，叫livescript，就连javascript这个名字后面改也有点蹭Java语言的热度的嫌疑。

后面javascript的流行和大热可能是其创始人也料想不到的，实际上就是javascript后面刚发展起来的那几年，大家也只是觉得其主要作为一个前端脚本语言，对其仍然是一种轻视的态度，觉得这个语言也就写写浏览器界面的动态效果之类的。随着node.js的出现和相关生态圈的日益成熟壮大，人们才惊讶地发现javascript已经是编程世界里面最大热的几门语言之一了，继而近几年，随着javascript生态的不断成熟和壮大，再也没有人去质疑javascript作为当今编程世界里面的编程语言的主角地位了，最多只是碎碎念说几句javascript这个语言的一些问题。

虽然JavaScript为人诟病的地方有一些，但其实那些很多都是历史遗留问题，JavaScript语言在不断完善中，最新的es6规范也解决了很多诸如此类的问题，新手学习JavaScript的时候建议及时阅读最新的文档和参考资料。这里就推荐权威文档MDN：[MDN docs](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript) ，有什么问题去那里搜索查看。

html5教程里面已经讲过JavaScript代码放在那里的，这块讨论就略过了。

### javascript代码REPL环境
一般浏览器按键 `F12` 或者右键查看开发者工具可以看到debug控制台，你可以在浏览器的debug控制台上运行javascript代码。

假如你已经安装了node环境，那么输入node命令之后进入REPL环境也是可以的。。


### 代码注释
多行注释如下：

```javascript
/**
 * make() returns a new element
 * based on the passed-in tag name
 */
```

单行注释用 `//` ：

```js
// This is a comment that the computer will ignore. 
```


### 分号
分号在编程语言这里都是表示一行结束。其在一些编程语言中是强制性的，在python和javascript这样的高级编程语言是非强制性的，不过一些编码规范会认为JavaScript语言里面的分号是不推荐加上的。

这方面有一些讨论，都略过了，总之JavaScript语言用分号标记一行结束不是强制性的了，读者愿意加上就加上，不加也行。




## 变量赋值
javascript的变量是区分大小写的。

javascript可以利用关键词 `let` 和 `const` 来声明变量或常量，其中let是声明变量的，const是声明常量的，所谓常量的意思就是这个量后面不会变了，所以const声明的常量后面试着去修改它就会报错。

以前JavaScript大多用var来声明变量，**现代JavaScript编码不推荐使用var了[^1]** 。

```javascript
let x = 1;
const PI = 3.14;
```

变量声明的时候也可以不赋初始值，如下所示，稍后再进行变量赋值：

```javascript
let y;
y = 2;
```

### 全局变量
在网页端有个全局对象 `window` ，var声明的变量就是全局变量，其就是将这个变量作为属性挂载在window对象上的。上面说了已经不推荐使用var来声明变量了，如果读者确实需要声明一个全局变量，那么用var还是可以的。

在nodejs那边全局对象名字叫做 `global` ，现在有标准不管是什么环境，都应该支持 `globalThis` 这个名字来指向这个全局变量。


### 变量命名风格
虽然有的语言会偏好小写字母加下划线风格，有的语言会偏好驼峰风格，具体这块个人认为规定很细是没有意义的，有点像是空格是四格还是两格，鸡蛋从大头吃还是小头吃，唯一的要求就是变量名，某一种类型的变量名应该尽可能保持一种命名风格，这里说的命名风格包括前面说的两种风格，还包括编码者自创的统一前缀，统一后缀风格等等。从而可以让编码者一看就知道这个变量是函数名还是类还是一般变量等等。

变量命名风格的那些讨论很多都是一些规范和建议，读者了解下即可。编程语言关于变量名的死规定就是那些：

- 只允许字母，数字，`$` 和 下划线
- 不可以是本编程语言的关键词
- 数字开头不行


### 解构赋值
解构赋值在现代吗JavaScript，比如react框架里面等，用的是越来越多了。读者如果是初学者，建议学习下数组和对象的概念再来阅读本小节。

解构赋值的用途不是说要同时赋多个值，而是说数组有多个值，或者对象里有多个属性的时候，你只需要其中的某几个，那个时候用解构赋值是很合适的。比如说模块导入的时候模块对象有多个属性，但是你只需要某几个，那么这个时候就需要用到解构赋值。

#### 数组的解构赋值
```
> let x;
> let y;
> [x, y] = [3,4,5]
> x
< 3
> y
< 4
```

注意上面我故意把变量的声明和解构赋值语句分开了，为的就是让这个概念更清晰，通常我们不会写的这么啰嗦：

```
let [x, y] = [3, 4, 5]
```

上面还有一个注意的点就是右边的数组可以比左边的变量多，x和y分别只取数组的第零个和第一个。

#### 对象的解构赋值
```
> let a;
> let b;
> {a, b} = {a:1, b:2, c:3}
> a
< 1
> b
< 2
```




## JavaScript数据类型
javascirpt的数据类型分为两类，一类是原始类型：数值、字符串和布尔值；另一类是对象类型。此外javascript还有两个特殊的值：`null` 和 `undefined` 。javascript除了数值、字符串、布尔值、null、undefined之外就都是对象了。比如后面提到的数组，函数也都是对象，只不过其是javascipt内部定义的对象。

### typeof操作符

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
> typeof x
< "undefined"
> typeof 1
< "number"
```

### null和undefined
如果一个变量声明了但还没有赋值，那么该变量目前的值是 `undefined` 。

如果一个函数没有明确定义return某个值那么会默认返回 `undefined` 。

javascript的 `null` 则表示空值的意思，意思是编码人员明确说明该变量是空值。



## 数值(number)
**javascript不区分整数值和浮点数值**，javascript中所有数字都用浮点数值表示，这是javascript和其他编程语言的很大不同。然后数值型那些运算，比如加减乘除之类的就不用多说了。

此外还有 `%` 是求余或者说取模操作：
```
> 5 % 2
< 1
```


### 求商
看到上面说的求余运算可能有的读者好奇JavaScript的求商运算是什么：

```javascript
> parseInt(5/2)
< 2
> parseInt(2.5)
< 2
```
JavaScript并没有专门的求商运算符，这个parseInt函数只是一个去整操作。而且这个parseInt函数也不是为了去整而编写的，而是为了将字符串转成整数的。

```
> parseInt('2.5')
< 2
```

这种转换甚至还支持不同的进制参数，parseInt第二个参数表示输入字符串的进制：
```
> parseInt('0xff', 16)
< 255
```

那如果我们执行这样的语句呢： `parseInt('abc')` ，其将返回 `NaN` 。

### NaN
NaN表示不是有效数值。

判断是否是NaN如下所示：

```js
> Number.isNaN('a')
false
> Number.isNaN(1)
false
> Number.isNaN(NaN)
true
```

显然parseInt函数一开始会用Number.isNaN来判断下，只有输入字符串是有效数值才会继续执行parseInt后面的程序逻辑。

那么如果读者想要将某个字符串转成浮点数而不是整数，这个时候就可以用parseFloat函数。


### parseFloat
将一个字符串转成浮点数。

```
> parseFloat('3.1415')
< 3.1415
```



## 布尔值(boolean)
javascript的布尔值是 `true` 和 `false` 。

在进行比较判断操作时，如果读者希望判断值是否相等，**现代JavaScript编码都推荐使用三个等号[^2]**。

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


## 字符串(string)

javascript表示字符串 **单引号和双引号都是可以的**。

```js
const name = 'Capt. Janeway';
```

你可以通过 `+` 来实现一些简单的字符串拼接工作，也可以如下进行字符串模板操作。

```js
`How are you, ${name}?`
```

字符串可以这样 `string[0]` 来索引第一个字符，如果你要索引最后一个字符则可以： `string[string.length - 1]` 。


### length属性
该字符串的长度

```
> "hello".length
< 5
```

### 字符串的其他方法

这里简单提一下，有需要则查下对应的 [文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String) 。

- **toUpperCase:** 变成大写
- **toLowerCase:** 变成小写
- **indexOf:** 返回子字符串出现的索引位置，index索引编号规则和python相同。
- **substring:** 返回子字符串
- **replace:** 替换操作 
- **split:**  分割操作
- **slice:** 切片取子字符串



## 数组
如下构建一个数组：

```js
let array1 = []
let array2 = new Array()
const items = [1, 2, 3.14, 'Hello', null, true]
```
数组也类似字符串一个可以索引取值，比如上面的items数组

```
> items[2]
< 3.14
```

数组也类似字符串一样通过 `array.length` 来获得该数组的长度。
```
> items.length
< 6
```

### push
数组末尾添加一个**或者多个**元素

```
> let arr = [1];
> arr.push(2, 3)
> arr
< [ 1, 2, 3 ]
```

### pop
数组末尾元素移除，方法返回被移除的那个元素。

```
> arr
< [ 1, 2, 3 ]
> let popItem = arr.pop()
> popItem
< 3
> arr
< [ 1, 2 ]
```
### shift
类似于pop方法，只是针对的是数组的首个元素。

```
> arr
< [ 1, 2 ]
> let shiftItem = arr.shift()
> shiftItem
< 1
> arr
< [ 2 ]
```
### unshift
类似于append方法，只是针对的是数组的头部。

```
> arr
< [ 2 ]
> arr.unshift(3)
> arr.unshift(4, 5)
> arr
< [ 4, 5, 3, 2 ]
```

### join
对列表中的各元素执行字符串拼接操作，可以设置连接符。
```
var arr = ['A', 'B', 'C', 1, 2, 3];
arr.join('-'); // 'A-B-C-1-2-3'
```


### includes
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




### 数组的其他方法

这里简单提一下，有需要则继续查阅 [相关文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array) 。

- **indexOf:** 返回数组某个子元素的索引位置
- **slice:** 切片操作，类似于python的 `lst[0:2]` 那种表达方法。slice方法不接受参数就默认返回该列表所有引用，也就是通常所说的 *浅拷贝* 。浅拷贝简单来说就是复制一个字典或者数组（或者其他复杂对象），根据第一层key赋值第一层value，如果第一层key是另外一个对象的引用，那么拷贝前对象和拷贝后对象都会指向统一对象，深拷贝就是进一步深入递归拷贝。
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







## 集合

javascript中的集合Set大体也和python中的集合概念相近。

var s1 = new Set(); // 空Set
var s2 = new Set([1, 2, 3]); // 含1, 2, 3

然后其也有 `add` 方法用于添加一个元素。用 `delete` 方法来删除某个元素。



## 函数

一个简单的函数对象定义如下所示：

```javascript
function greeting(name){
    console.log(`hello, ${name}.`);
}

greeting('world')
```

### 参数
下面定义了temperature函数，接受一个参数，同时还设置了这个参数的默认值。

```js
function temperature(n = "25"){
  console.log(`${n} degree.`)
}
```

```
> temperature()
25 degree.
```

### 不定参数
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

这个rest名字是随意的。

### 函数内变量的作用域
在es6引入let和const之后，JavaScript的函数内变量的作用域规则和其他编程语言是一致的了，就是所谓的块作用域。如果读者还没有学习过任何一门编程语言，那么请学习了解编程语言中变量作用域的相关概念。这块内容讨论我暂时省略了。


### arguments

javascript的函数内部可以直接使用 `arguments` 这个变量，其不是一个数组，会有一些区别，但一般类似数组那样使用是没有问题的:

```
arguments[0]
arguments.length
```

其会接受传入函数的所有参量。

### 箭头函数

简单来说箭头函数就是 lambda 表达式的更简洁写法，只是说在javascript语境下其和一般function的区别是：<u>其没有this绑定</u>。

```js
(param1, param2, …, paramN) => { statements }
```

### 闭包
所谓闭包就是函数里面再嵌套一个函数，内层函数是可以调用外层函数中定义的变量的。

请看下面这个例子：
```js
> function report(){
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
> report()
< 3
```
上面这个例子将会打印数字3，因为内层函数调用count一直是外层函数定义的那个count。


## 程序中的逻辑

### 条件判断

条件判断结构：

```js
let feedback = 10
if (feedback > 8) {
    console.log("Thank you! We should race at the next concert!")
} else {
    console.log("I'll keep practicing coding and racing.")
}
```


### switch
如下所示是一个switch的例子，下面也演示了默认选项的写法。

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

如果有多个选项共用相同的行为则可以如下写：

```js
let result = "";
switch (val) {
  case 1:
  case 2:
  case 3:
    result = "1, 2, or 3";
    break;
  case 4:
    result = "4 alone";
}
```

### 三元运算符

```
> let b = null
< undefined
> b = b ? b : 2
< 2
```

如果b为true则返回b的值，否则取后面的值。

### while循环

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

### for循环

一般来说很多循环语句任务while语句和for语句彼此都是能做的。不过在很多应用场景下，比如一些短小的循环任务、遍历任务等，是推荐使用for语句的，因为for语句在那些应用场景下编程语句会更简练一些。

```js
for (let i=0, count=5; i < count; i++){
   console.log(i);
}
```

#### for遍历数组
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

因为字符串类似于数组，也可以这样来遍历字符串：
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

当然你也可以使用传统的for循环写法，某些情况下可能需要：

```js
let arr= [1,2,3]
for (let i=0; i< arr.length; i++){
  console.log(arr[i])
}
```

#### for遍历对象

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

### break和continue

大体类似于python里面的break和continue语句逻辑，break语句是跳出外围循环，continue是结束本轮循环，然后开始下一轮循环。


## 对象
对象是一个存储key-value键值对的数据类型。

```javascript
> let data = {}
> data = {'a':1, b: 2, c: [23]}
< { a: 1, b: 2, c: [ 23 ] }
> data.a
< 1
> data['c']
< [ 23 ]
> data.b=5
< 5
> data
< { a: 1, b: 5, c: [ 23 ] }
```

上面例子演示了如何初始化声明一个对象，如果索引对象的值和如何修改对象的值。

用如上修改对象的属性，如果该属性名不存在，那么该属性会自动添加：

```
> data.e = 6
< 6
> data
< { a: 1, b: 5, c: [ 23 ], e: 6 }
```

要删除一个属性则使用delete语句，如下所示，我们看到delete语句删除不存在的键是不会报错的。

```js
> data
< { a: 1, b: 5, c: [ 23 ], e: 6 }
> delete data.e
< true
> data
< { a: 1, b: 5, c: [ 23 ] }
> delete data.e
< true
> data
< { a: 1, b: 5, c: [ 23 ] }
```

### 判断键是否存在
判断某个对象时候有某个键可以如下使用in语句或者调用对象的hasOwnProperty方法。

```js
> data = {}
> data['a'] = 1
> 'a' in data
< true
> data.hasOwnProperty('a')
< true
> data.hasOwnProperty('b')
< false
```

和in语句的区别是 `hasOwnProperty` 只会处理自身属性，不会处理那些继承过来的属性，到了class类那里才可能有继承问题，所以这里认为基本上是没有区别的。




### keys

```
> Object.keys({"a":1,"b":2})
[ 'a', 'b' ]
```

### values
```
> Object.values({"a":1,"b":2})
[ 1, 2 ]
```

### entries

```
> Object.entries({"a":1,"b":2})
[ [ 'a', 1 ], [ 'b', 2 ] ]
```


### 对象方法
下面演示了对象如何定义自己的方法：

```javascript
let x= {
  'data': [1,2,3,4],
  'length': function(){return this.data.length}
}

console.log(x.length())
```

### 计算属性
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




## 异常

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


## 模块
一个模块就是一个js文件。

通过import export来实现模块间对象的互相调用。



## 网页端
所谓DOM操作就是用Javascript来操作修改页面内容，这基本上是client端javascript的主要工作内容。

如果熟悉python的beautifulsoup或者lxml之类的分析网页的模块，那么对Javascript的这些DOM操作概念都不会太陌生。我这里就不做太多抽象的术语上的讨论了，下面的讨论会更加注重实践方面的东西。


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


### 查找目标标签
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


### 标签之间的关系
document不是Element对象，`document.documentElement` 才是Element对象，其对应的是html这个标签。

再实践中推荐采用下面的属性来实现纯元素导航。

- children 返回本标签下面的子标签 【没有并不是返回的null，用childElementCount来判断。】
- parentElement  返回本标签上面的父标签 【没有则返回null】
- firstElementChild 本标签下面的第一个子标签 【没有则返回null】
- lastElementChild  本标签下面的最后一个子标签 【没有则返回null】
- previousElementSibling 本标签上面的兄弟标签 【没有则返回null】
- nextElementSibling 本标签下面的兄弟标签 【没有则返回null】




### matches
```
Element.matches(css)
```
返回布尔值，该标签是否匹配给定的css选择器。





### setAttribute

`Element` 对象可以调用这个 `setAttribute` 方法来设置标签内的属性值。

```
element.setAttribute(name, value);
```

### dataset

查询到的元素如果div则是更具体的HTMLdivElement等等，其继承自HTMLElement，HTMLElement有一些专门的方法。比如这个dataset，其是可以只读属性，对应html中的`data-*` 这样的属性值，比如说 `data-name` 将变成dataset的`{'name': 'what'}` 。

### classList

类似上面的讨论也是HTMLElement的一个属性，表示class属性数组。


### textContent

之前提到querySelector查到某个Element之后想要取出其文本内容可以调用 `textContent` 属性，document和Element都能这样做只是因为它们继承自Node对象，具体textContent这个属性的定义是在Node对象这里。

### parentElement
返回本节点的父节点

```
parentElement = node.parentElement
```

### removeChild
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



Element对象继承自EventTarget从而获得了这些方法： `addEventListener` ， `removeEventListener` 和 `dispatchEvent` ，这几个方法都是和事件处理相关的。

熟悉GUI桌面程序的话会对事件有个大致的理解，大体类似于QT里面的信号。

### CustomEvent

自定义一个事件，第二个参数可以是任意的信息。

```
  new CustomEvent(name, { bubbles: true, cancelable: false })
```

### dispatchEvent

程序触发某个Element元素上监听的事件

```javascript
target.dispatchEvent(
      new CustomEvent(name, { bubbles: true, cancelable: false })
);
```

### addEventListener

给某个元素增加一个事件监听

### removeEventListener

移除某个元素上的事件监听

### event.target和event.currentTarget的区别

事件响应到调用函数那边，通过event.target或者event.currentTarget可以引用触发事件的浏览器对象，不过它们是有一点区别的。

首先说一下事件的冒泡机制，当某个元素触发了某个事件，其会触发本元素上事件响应处理程序，然后该事件会继续冒泡到本元素的父元素之上，再触发父元素的事件响应处理程序。

event.target是引用那个最开始触发事件的那个目标元素，而event.currentTarget是引用那个实际处理事件的元素。比如说某个div里面有一个button，你给div绑定了事件监听处理函数，然后那个事件监听处理函数里面调用 `event.currentTarget` 则会指向那个div，而如果你调用 `event.target` 则会引用最开始触发click事件的那个元素，也就是button。

在一个目标button里面处理click事件使用event.target或者event.currentTarget是没有区别的。


### fetch

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

## nodejs

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




## npm服务

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

### no-jquery

更多相关知识请参阅参考资料四，即 [这个Github项目](https://github.com/nefe/You-Dont-Need-jQuery/blob/master/README.zh-CN.md) 。下面就一些重点知识做出一些整理。

#### 选择

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


### javascript编码规范


### 参考资料
1. Javascript权威指南 David Flanagan著.
2. [mozilla docs](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript)
3. [现代javascript教程](https://zh.javascript.info/)
4. [you donot need jquery](https://github.com/nefe/You-Dont-Need-jQuery/blob/master/README.zh-CN.md)
5. [Javascript教程](https://wangdoc.com/javascript/index.html)
6. node.js实战 图灵设计丛书 Node.js in action
7. [阮一峰的npm文章](http://javascript.ruanyifeng.com/nodejs/npm.html) 
8. [理解exports这篇文章](https://www.sitepoint.com/understanding-module-exports-exports-node-js/) 
9. [npx使用教程](https://www.ruanyifeng.com/blog/2019/02/npx.html)

### 脚注
[^1]: var声明的变量的作用域很不同于其他编程语言，叫做 **函数作用域** ，即你在函数区块内声明的变量整个函数体都是可以使用的，包括哪些花括号结构或任意的嵌套函数。因为程序员对于变量的作用域习惯了块作用域，这常常造成一些代码的bug。此外var声明变量语句可以随意放置，这也会造成代码变得混乱和难以理解。

[^2]: 三个等号，这不是什么别出心裁，也没有任何实际的好处，就是javascript的历史遗留问题罢了。因为之前JavaScript的两个等于在比较的时候会进行额外的类型转换，结果是这并不合乎大多数程序语言的习惯，因此后面引入了三个等号的严格值相等判断。一个典型的例子就是 `null == undefined` 会返回true 。
