Slug: learning-csharp-programming
Tags: csharp,

[TOC]



## 简介

C# 程序运行在.net平台上的，在介绍C#语言之前需要介绍下.net平台。对于.net平台内部的细节和微软的设计雄心之类的我们没必要去深究，简单来说.net平台提供了一个运行时，在这个运行时之下你可以运行.net应用。.net应用五花八门并可以跨多个平台，然后开发.net应用的程序员还需要下载.net sdk。熟悉JAVA语言的对这个运行时和SDK的概念不会很陌生，所不同的是.net平台还封装了一个中间语言层，然后才是上面具体的语言的编译器，也就是.net平台是支持多个编程语言的，当然包括这里谈论的C#语言。

Unity游戏开发就是构建在.net平台之上的，这也是笔者学习C#语言的原因。

笔者还是推荐安装visual studio，然后通过visual studio来安装.net开发环境。具体就是 `.NET桌面开发` 工作负载。有时间和精力的可以折腾dotnet命令行来编译

### .net运行时

前面提到.net平台是支持多个编程语言的，对于C#的编译器来说它们只负责将这些编程语言翻译成那个中间语言，然后.net平台再将这个中间语言翻译成机器码。对于.net运行时来说对于不同的平台有不同的实现，比如.net framework是支持window系统的；.net core支持较多，对windows，linux，macOS都支持；还有Mono+Xamarin了解下是支持IOS和Android。.net framework从4.8版本开始就处于一种待遗弃状态，微软计划以后会将各个.net 平台运行时合并为一个：.net5 。

本文笔者前面都是使用的 `.net core3` ，后面因为了解到Unity 2020LTS底层是 .net framework4.6之后再新建项目的时候会有意设成 `.net framework` 。然后csproj 文件需要加上这样一小段配置【因为visual studio对于.net framework4.6默认的语言版本是C#7】：

```
<PropertyGroup>
  <LangVersion>8.0</LangVersion>
</PropertyGroup>
```

好让visual studio使用的C#语言版本是8.0。

对于本文讨论的内容要是约定C#8的话那么各个平台运行时差异是不会太大的，但我也接触到一个这种差异了，比如说 `System.HashCode` 方法在.net framework 运行时上是没有的。所以对于你的项目，从一开始就控制好.net平台的具体实现和版本，有时会让你规避到很多麻烦的问题的。在查看Unity2020.3.11 LTS的vsproj文件配置：

```
    <TargetFrameworkVersion>v4.7.1</TargetFrameworkVersion>
```

于是决定**本文的代码开发环境是 `.net framework 4.7.1` ，语言版本是c#8，并已全部测试通过了。**

### 本文内容的取舍

本文关于C#编程语言的讨论并不是什么都会加入进来的，除了上面的规定平台是`.net framework 4.7.1` ，语言版本是C#8之外，还会一下内容取舍的考虑：

- 按照Unity官方文档的说明推荐所有语法都遵守.net standard 2.0，因此`Span<T>` 和 `Memory<T>`  和 `Reflection.Emit`不会讨论。
- 按照Unity官方文档的说明Unity的API都是线程不安全的，因此不应该使用async和await任务。也就是关于C#的异步相关讨论将会忽略。
- Unity官方文档有自己的线程解决方案而且是推荐使用它们的接口，因此C#原生的线程方面讨论将会忽略。
- Unity2020.3LTS对于C#8语法有四个不支持的特性，这四个不支持的特性将不会讨论：
  - Default interface methods
  - Indices and ranges
  - Asynchronous streams
  - Asynchronous disposable
- Unity官方文档谈到使用C#的reflection有开销过大的问题，不应该使用 Assembly.GetTypes 和 Type.GetMethods() 这样的方法，暂时C#的reflection将略过讨论。
- 序列化方面会更推荐使用Unity的JSONUtility，这部分内容也略过讨论。
- 网络方面更推荐直接使用Unity提供的网络接口工具，这部分内容也略过讨论。
- 从实践角度考虑会更多地介绍class而忽略struct的讨论，会更多地介绍List而忽略数组array的讨论。

### helloworld

学习任何一门新的编程语言，必然先从打印一串hello world字符串开始。

1. 创建新项目
2. 选择控制台应用(.net framework)
3. 生成->生成解决方案
4. 调试->开始调试

```c#
using System;

namespace ConsoleApp1
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Hello World!");
        }
    }
}
```

- `using` 导入某个命名空间，如果你熟悉python语言的话，这里做的事情有点类似于`from what import *` ；如果你熟悉C++的话那么这里的概念大体类似于C++的命名空间。或者简单来说命名空间就是将变量名放在某个空间之下，然后你在外面要引用的话需要额外加上该命名空间的名字前缀，除非你用using导入那个命名空间。
- `namespace` 定义了一个命名空间
- `class` 声明一个类
- `static void Main...` 这是定义一个类的方法，Main方法比较特殊，为本程序的入口方法
- `string[] args` 这是该方法接受的一个参数，该参数是一个string类型的数组。
- `Console.WriteLine` 调用打印方法 【完整的变量名是 System.Console.WriteLine，该变量名是一个方法，因为你之前使用了using System，所以这里可以省略System的命名空间前缀了。】



## 第二个例子

一般学习一门新的编程语言在hello world之后，第二个例子就是学习该编程语言怎么声明一个变量以及其他一些基本的东西。请看下面这个练习题：

1. 定义一个常数 double pi
2. 定义半径 double r
3. 计算该半径的面积并报告结果。

下面请读者结合下面的内容知识点讲解然后将这个题目做出来。

### 声明变量

```c#
const double pi = 3.14;
```

这是声明了一个常量，常量之后不可修改。

```c#
double x = 5.0;

int y;
y = 5;
```

这是声明了一个变量。

常见的变量类型有：

- string 字符串 `string x = "abc";`
- char 单字符型 `char x = 'a';`
- int 整型 `int x = 1;`
- double 浮点型 `double x = 1.0;`

### 基本的运算符

C#在基本的运算符这块和C++或者说和大部分编程语言来说都差别不大的，下面简单将这些运算符列出来然后大家按照数学常识或者编程常识去使用即可：

```
+ 加
- 减
* 乘
/ 除
% 取模
++ 自增
-- 自减
== 是否等于
!= 是否不等于
> 是否大于
< 是否小于
>= 是否大于等于
<= 是否小于等于
&& 逻辑与
|| 逻辑或
! 逻辑非
& 按位与
| 按位或
^ 按位异或
~ 反码
<< 按位左移
>> 按位右移
+= 即运算后赋值，这类还有 -= /= 等等就不赘述了
condition ? yes-statement : no-statement 即三元运算符
```

### 注释

C#的注释单行是 `//` ，多行是 `/*...*/` 。

### 强制类型转换

低精度到高精度可以自动转没问题，高精度到低精度需要明确强制类型转换：

```c#
int x;
double y = 3.0;
x = (int)y;
```



## 类型系统

下面进入学习一门新编程语言最核心的一个环节，详细熟悉该编程语言的类型系统。这块各个编程语言或多或少都有些差异的。

### 查看变量类型

```
v.GetType();
```



### value type

C#有两种变量类型，value type直接存储变量的值，reference type存储的是对目标数据的引用。value type的值是存储在堆栈stack里面的，具体是什么值就存放的是什么值，value type变量之间的赋值是传递的实际的值；而reference type的值存放在堆栈stack里面的只是对一个堆heap结构的引用地址，也就是具体该对象的值是存储在该堆heap里面的，reference type变量之间的赋值是传递的引用地址，也就是它们实际上都指向的是同一对象【或者说同一内存段内的数据】。

<u>C#的所有变量都是有默认值的</u>，比如reference type变量的默认值是null，比如bool类型默认值是false。该默认值可以用default关键词来表示。

value type变量赋值给另外一个变量，其值是copy过去的。比如说

```
int a = 50;
int b = a;
a = 20; //这个时候a是20而b则是50
```



#### 简单类型

基本类型即使是在所谓的动态高级语言里面也是看得到的。

- sbyte short **int** **long**
- **byte** ushort unit ulong
- **char**
- **float** **double** 
- **decimal** 比double存储位数更多的浮点型，这个在某些编程语言里面可能没有，但其仍然属于浮点型，别误以为其是某种表示精确小数的类型。decimal主要用于金融领域的应用。
- **bool**

C#的数值二进制表示可以写成这样的形式：`0b_0010_1010` ，常见的 `0b00101010` 写法也是支持的，新增这种对人类友好格式的写法的支持还是值得肯定的。



#### 枚举类型

C#的枚举类型和C++的enum class有点接近，但在使用上略有差异。

比如C++的下面语句：

```c++
enum class Color { red, green, blue };
Color color = Color::blue;
```

转成C#应该是：

```c#
enum Color { red, green, blue };
Color color = Color.blue;
```

具体到枚举类型的内部细节，和C语言的枚举类型应该是一脉相承。

#### struct

C#里面的结构体和C++里面的结构体差异巨大，C++里面的结构体概念和C语言的结构体区别不大，只是一种比数组略灵活点的变量类型，专门用来存储呈现一定结构特征的数据用的。而C#里面struct则更接近于class这个概念，有一些小的使用上的区别，其他都大同小异，其中最大的一个区别是struct是类型是value type，而class的类型是reference type。

比如下面这个例子，C#里面的struct一样也可以有自己的构造方法：

```c#
struct Coordinate
{
    public int x;
    public int y;

    public Coordinate(int x, int y)
    {
        this.x = x;
        this.y = y;
    }
}

Coordinate point = new Coordinate(10, 20);
```

但需要注意的是**C#的struct不能再定义无参构造方法**，因为它默认已经有了。当然struct没有继承关系。

完整的struct不能class能的清单如下：

- You can't declare a parameterless constructor. Every structure type already provides an implicit parameterless constructor that produces the [default value](https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/builtin-types/default-values) of the type.
- You can't initialize an instance field or property at its declaration. However, you can initialize a [static](https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/static) or [const](https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/const) field or a static property at its declaration.
- A constructor of a structure type must initialize all instance fields of the type.
- A structure type can't inherit from other class or structure type and it can't be the base of a class. However, a structure type can implement [interfaces](https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/interface).
- You can't declare a [finalizer](https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/classes-and-structs/destructors) within a structure type.



#### null

reference type变量的默认值就是null。一个reference type变量的值为null表示该reference type变量还没有赋值。

判断某个object是否是null以前一般的写法是：

```
if (object != null){

}
```

更推荐的写法是：

```
if (object is null){

}
```

如果你使用is表达式的话，编译器会确保该object的`==` 和 `!=` 运算符没有被重载。这会更严谨些吧。

一般来说value type变量是不能为null的，但如果你类似下面的声明一个value type变量，则其也是可以为null的：

```
int? a;
```



#### Tuple

tuple基本使用如下：

```c#
            (int, string, float) t1 = (1, "t1", 3.14f);

            Console.WriteLine($"{t1.Item1} , {t1.Item2}, {t1.Item3}");

            var t2 = (2, "t2");
            Console.WriteLine($"{t2.Item1} , {t2.Item2}");
```

其一个经常使用场景就是一个tuple作为方法的返回值。

```c#
(int min, int max) FindMinMax(int[] input){
    //
    return (min, max);
}
```

在很多应用场景下，你使用tuple不太喜欢指明数据类型，可以考虑使用 `System.Tuple` ，这个类提供了一些泛型创建Tuple的方法。



### reference type

reference type变量赋值给另外一个变量，它们两个都是指向的同一数据对象。但string情况略有不同，因为string是不可变的，所以string发生变化实际上是又新建了一个string。

#### 检查两个reference type是否是同一个东西

```
ReferenceEquals(object a, object b);
```



#### class

用户自定义一个类，关于面向对象这块更多内容在后面讨论。

#### string

字符串，不可变的reference type类型。值得一提的是C#的字符串不需要以`\0` 结尾。

字符串内插和常用的字符串方法有：

```c#
$"hello {name}";
```

或者使用字符串对象的Format方法：

```
string.Format("{0} + {1} = {2}", a, b, a+b);
```

此外你还可以使用 `"abc" + "def"` 加法来组合字符串。

- Length 属性 返回字符串长度
- TrimStart 方法 去除字符串前面的空格
- TrimEnd 方法 去除字符串后面的空格
- Replace 方法 子字符串替换动作
- ToUpper 方法  英文字母都转成大写
- ToLower 方法 英文字母都转成小写
- Contains 方法 查看某个子字符串是否存在
- StartsWith 方法 字符串是否以某个子字符串开始
- EndsWith 方法 字符串是否以某个子字符串结束

#### object

C# 采用 **统一的类型系统**。 所有 C# 类型（包括 `int` 和 `double` 等基元类型）均直接或间接继承自一个根 `object` 类型。

读者可能会问int不是value type吗，其继承自object，而object则是reference type，这怎么回事。这涉及到 Boxing and Unboxing 的概念。

##### boxing和unboxing

将一个object转成value type称之为unboxing过程，将一个value type变量转成reference type变量称之为boxing过程。value type存储在堆栈stack里面的，reference type实际值是存储在堆heap里面的。boxing过程先需要将value type里的value取出存入heap，然后获得heap的reference指向。而unboxing过程是从heap里面将对应值取出来然后存放入堆栈stack里面。

下面是boxing过程：

```
int i = 123;
object o = i;
```
下面是unboxing过程：
```
o = 123;
i = (int)o;  
```

下面列出一些方法，这些方法是object上定义的，也就是C#的所有对象都可以调用这些方法。

- ToString() 将目标对象转成字符串。
- GetType() 获得目标对象的类型
- Equals() 检查两个对象是否是同一对象【对于value type是检查值相等，对于reference type是检查在heap上的引用指向是否相等】

#### interface

interface主要用来给类提供一些方法或说接口上的规范。C#的interface命名上有个约定是以大写字母I开头。

下面是一个演示例子：

```c#
interface IEquatable<T>
{
    bool Equals(T obj);
}
public class Car : IEquatable<Car>
{
    public string Make {get; set;}
    public string Model { get; set; }
    public string Year { get; set; }

    // Implementation of IEquatable<T> interface
    public bool Equals(Car car)
    {
        return (this.Make, this.Model, this.Year) ==
            (car.Make, car.Model, car.Year);
    }
}
```

#### array

C#的Array不能对比为C语言或C++的数组，和C++的array类有点类似：

在C++里有：

```c++
std::array<int, 3> a2 = {1, 2, 3};
```

上面的写法转成C#是：

```c#
int[] a2 = {1,2,3};
```

但也只是类似，就底层实现细节可以按照传统概念上的数组来思考理解，而就具体程序上来说其是一个对象，还有很多额外的方法支持。

声明一个array如下所示：

```
elementType[] name = new elementType[numberOfElements];
```

```c#
int[] arr1;
int[] arr2 = new int[6];
int[] arr3 = new int[] {1,2,3};
int[] arr4 = {1,2,3};
```

array一旦初始化长度是不可变的，如果你需要可变的array，可以考虑List类。

#### delegate

delegeta的应用场景主要在函数作为函数的参数这块，在这块C++我们知道是通过函数指针来做的，然后因为函数的进出参数类型有时很复杂，是的这块处理不是很优雅，一个勉强可行的做法就是通过typedef来做。

下面是C++对于这个问题的一个演示例子：

```c++
#include <iostream>

using namespace std;

typedef double(*test_func_type)(int);
void estimate(int , test_func_type);
double test_func(int a);


double test_func(int a) {
    double b;
    b = a * 3.14;

    cout << a << " * 3.14 = " << b << endl;
    return b;
}

void estimate(int repeat, test_func_type pf) {
    for (int i=0; i < repeat; i++) {
        (*pf)(3);
    }
}

int main() {
    estimate(10, test_func);
    return 0;
}
```

对于上面的程序写出C#版本：

```c#
  class Program
    {
        public delegate double DMethod(int a);
        public static double TestFunc(int a)
        {
            double b;
            b = a * 3.14;
            Console.WriteLine($"{a} * 3.14 = {b}");
            return b;
        }

        public static void Estimate(int repeat, DMethod m, int a)
        {
            for (int i = 0; i < repeat; i++)
            {
                m(a);
            }
        }

        static void Main(string[] args)
        {
            DMethod handler = TestFunc;
            int a = 3;
            Estimate(10, handler, a);
        }
    }
```

delegate的作用就是定义了这样的方法委托或者更直白点就是C#这边的函数指针类似实现。

### 隐式类型声明

```
var x = 1;
```

C#是强类型语言，上面的语句只是说让编译器来决定该变量的类型。

在很多情境下，var更像是一个提供便捷的语法糖，比如：

```
var x = 0L;
```

后面跟个`L` 那么对应的类型就是long integer类型。如果后面跟个`f` ，那么对应float类型，如果跟个 `d` 那么对应double类型。

### 变量名命名规范

首先是编程语言通用的规范：一般来说只推荐字母加上下划线组成变量名，某些情况下需要带上数字的数字放在后面。下划线一般变量不允许放在前面，只有某些特殊变量才会把下划线放在前面。编程语言自身的保留字不得使用。

下面继续C#特有的一些命名规范：

- C#的变量名总的来说推荐采用驼峰写法，也即是 `AbcAbc` 或者 `abcAbc` 这样的写法。其中类，结构体，枚举，delegate，方法，属性等重要的名字【一般指public变量】都应该以大写字母开头。然后iterface前面要加上大写字母I。这条规范重要性最高，基本上要求所有的C#程序员都遵守。
- 其他不太重要的本地变量【private等】推荐小写字母或者下划线开头。这是必须遵守的，至于再往下讲还有一些更细的规范则重要性就不是那么大了，可遵守也可不遵守，比如 `_` 下划线开头的是哪一类啊，再比如 `s_` 开头的是哪一类，还有的有 `m_` 开头 或者 `k_` 开头的，这些都不是很苛刻地要求遵守的规范了。

### 变量的作用域

类似于C++等语言，C#也有变量作用域这个概念，同样的简单表述就是**块作用域**，具体就是某个花括号块或者方法区块或者类区块，在这些区块类声明的变量，可在本区块内直接访问，区块外则不行。



## 访问权限控制

经常看到 `public int x = 1;` ，这个public就是访问修饰符，控制该变量的访问权限的：

- public 访问权限无限制。
- private 访问权限限于本类，C#中没有访问权限修饰符的变量声明默认是private。
- protected 访问权限限于本类或本类的子类
- internal 访问权限限于本汇编（exe或dll）
- protected internal
- private internal



## 编写方法

C#有点特殊，因为其一切皆对象的设定，按照程序界的标准术语，那么在C#就没有所谓的编写函数，而只有编写方法这个说法了。

```
accessModifier returnType methodName(parameterType parameterName){
    // do something
}
```

访问修饰符如果省略类似于变量声明那边，默认是private。

### 可选参数

和C++格式一样。

```
public void ExampleMethod(int required, string optionalstr = "default string",
    int optionalint = 10)
```



### 按照参数名字赋值

```
static void PrintOrderDetails(string sellerName, int orderNum, string productName){
    //
}

PrintOrderDetails(productName: "Red Mug", sellerName: "Gift Shop", orderNum: 31);
```

### 不定参数

params关键词，参数类型一维数组，后面不能再带参数了。

```
    public static void UseParams(params int[] list)
    {
        for (int i = 0; i < list.Length; i++)
        {
            Console.Write(list[i] + " ");
        }
        Console.WriteLine();
    }
```





## 程序结构

在程序结构这块，和其他编程语言大同小异的下面就不赘述了，下面主要讨论一些C#看起来不太一样的东西。

### switch语句

switch语句在C#这边和C++那边差异很大，C++的switch语句的目标测试变量必须是整型或者枚举类型或者能够转成整型或枚举类型的对象。而C#那边之前支持的类型就很多，现在是**任何非null表达式**都行。比如下面就是直接对字符串是否相等然后进行switch，这在C++那边是不行的。

```c#
            string x = "xxxx";
            switch (x)
            {
                case "hello":
                    Console.WriteLine("HELLO");
                    break;
                default:
                    Console.WriteLine("default");
                    break;
            }
```

C#switch语句和C++还有一个不同，那就是它从语法层面是禁止这种写法的：

```
                case "hello":
                    Console.WriteLine("HELLO");

                case "world":
                    Console.WriteLine("world");
                    break;
```

C++那边也不推荐这种写法，但并没有禁止，如果这样写的话，C++那边hello的case激活之后没有break会继续下面的case语句执行，这确实很不好，即使是C++也应该避免这种写法。




### foreach语句

C#的foreach语句在C++那边可以类比for range语句或者就是python的for语句：

在C++那边有：

```C++
for (int x: {1,2,3}){
    cout << x;
}
```

C#的foreach语句写法是：

```c#
foreach (var x in new int[] { 1, 2, 3 }){
    Console.WriteLine(x);
}
```

C#的foreach可以迭代的对象除了上面演示的array之外，C#常用的Collection库里面的对象也都是可以迭代的。

### lambda表达式

```
(input-parameters) => expression
```

labmda表达式就是程序界为大家熟知的匿名函数的概念，因为C#这边没有所谓的函数对象，所以C#lambda表达式其实就是一个delegate对象，这个delegate对象一开始就绑定了这个匿名函数定义的行为，或者其他什么对象

读者可进一步参考阅读 [Delegates and lambdas | Microsoft Docs](https://docs.microsoft.com/en-us/dotnet/standard/delegates-lambdas) ，该文章中提到lambda表达式就是另外一种定义delegate对象的方式，delegate对象其实也是有匿名delegate这个说法的：

```c#
          delegate (int no)
          {
              return (no % 2 == 0);
          }
```

不过考虑到lambda表达式这个概念在程序界很早就已经为人们熟知了，而且经常是以编程语言中的第一公民身份出现的，所以一般匿名函数还是推荐写成C#这边的lambda表达式形式：

```c#
no => no % 2 == 0 
```

### 异常捕捉

这一块因为和python那边很是类似，估计很多编程语言也差不多的，所以这里就没有太多赘述异常捕捉的一些基本知识。

```c#
try{
  // do something
}catch (Exception ex){
	Console.WriteLine(ex);
}finally{

}
```

更精细的捕捉异常：

```c#
try
{
  // do something
}
catch (ArgumentNullException){}
catch (IOException){}
catch (Exception ex)
{
	Console.WriteLine(ex);
}
finally
{
	// always do something.
}
```

#### 自定义异常类型

下面这种写法是C#官方文档的推荐实现：

```c#
public class MyCustomException: Exception
{
	public MyCustomException(){}
	
	public MyCustomException(string message): base(message)
	{
		
	}
	public MyCustomException(string message, Exception inner): base(message, inner)
	{
		
	}
}
```





## class面向对象编程

C#的class类**只允许单继承**，也就是最多只能继承自一个父类。基本类的使用如下所示：

```c#
public class Character: BaseClass
{
    public string name;
    public int exp = 0;

    public Character(string name)
    {
        this.name = name;
    }
}

Character hero = new Character("lucy");
```

上面演示了如何声明一个class，这个class继承自某个父类，class类都有默认的无参构造方法，这里再给该class类定义了一个接受参数的构造方法，然后演示了this关键词，最后演示了如何实例化一个class类。

### 构造方法允许重载

如下所示构造方法还允许重载并使用this关键词。

```c#
public class Character: BaseClass
{
    public string name;
    public int exp = 0;

    public Character(string name)
    {
        this.name = name;
    }
    public Character(string name, int exp): this(name)
    {
        this.exp = exp;
    }
}

Character hero = new Character("lucy");
```

### 单例类

类的构造方法可以是private的，这个类的生成可以通过本类下面的某个static方法来获得，一个经典应用就是实现单例类：

```c#
public sealed class Singleton
{
    private static readonly Singleton s_Instance = new Singleton();

    static Singleton()
    {
    } // Make sure it's truly lazy

    private Singleton()
    {
    } // Prevent instantiation outside

    public static Singleton Instance { get { return s_Instance; } }
}
```



### this

this关键词类似于python里面的self，和C++上的this大体含义也是一样的，是一个指向本类实例的指针。同样在本类里面定义的方法下面都默认带入了this这个参数，也就是在各个方法里面直接使用即可。静态类或静态方法里面是没有this关键词的，因为默认是不实例化，当然就没有this这个关键词了。



### 属性

```c#
    private string _name;
    public string Name{
    get {
        return _name;
    }
    set {
        _name = value;
    }
    }
```

如果是上面没啥动作的get和set属性方法那么完全可以用下面这种默认的自动属性实现写法：

```C#
public string Name { get; set; }
```

在实践中推荐采用如下自动属性写法：

```
public string Name { get; }
```

Name可访问，如果访问都不希望访问则直接使用private变量即可。构造方法可修改，但不能编写其他方法来修改Name。

```
public string Name { get; private set; }
```

Name可访问，构造方法可修改，可以如下另外编写其他方法来修改Name值。

```
public void SetName(string newName) => Name = newName
```



```
public string Name { get; set; }
```

Name可直接访问可直接修改。

### static

C#类里面定义的静态变量和C++类里面定义的静态变量有很多差异，从底层实现角度来说static静态变量两门语言含义都是一样的，意思都是该静态变量进行了额外的静态存储管理，而不是交给编译器的自动存储管理，其在程序运行期间都是存在在内存里面的。但就编程角度来说，C++显得很是松散，而C#对这些变量的使用进行了一些规范，具体来说就是将这些变量定义为为类class所拥有的变量，C++并没有这样的限定，比如C++里面你仍然可以 `sw1.NoOfInstances` 来引用这个静态变量，而在C#这边是不行的，你只能通过 `StopWatch.NoOfInstances` 来引用。请看下面这个例子：

```c#
using System;

namespace cs_project1
{

	public class StopWatch
	{
		public static int NoOfInstances = 0;

		public StopWatch()
		{
			StopWatch.NoOfInstances++;
		}
	}

    class Program
    {
        
        static void Main(string[] args)
        {
			StopWatch sw1 = new StopWatch();
			StopWatch sw2 = new StopWatch();
			Console.WriteLine(StopWatch.NoOfInstances);

			StopWatch sw3 = new StopWatch();
			StopWatch sw4 = new StopWatch();
			Console.WriteLine(StopWatch.NoOfInstances);
		}
    }
}

```

如果一个class被声明为static，那么其内的所有成员都必须是static的。静态类不可被其他类继承，因为其内成员必须是静态的，所以一个常见的用法是一组工具调用性质的方法封装为静态类供其他类直接调用。

总之C#的static即使仅仅就类的作用域这块来看和C++的static仍然区别很大，其更加接近于python语言里面的 `@staticmethod` 的概念。但其实也没有那么复杂，就简单理解为这些属性为class所有，不需要实例化就可以直接调用就行了。

### readonly

readonly修饰属性字段和const的区别是，const初始化时必须给定初始值，而readonly声明时不强求给定初始值，也就是赋初始值的动作可以往后面放一放，

### 静态构造方法

静态构造方法对于每个type只执行一次而不是每个实例。如下静态构造方法：

```
class SimpleClass
{
    // Static variable that must be initialized at run time.
    static readonly long baseline;

    // Static constructor is called at most one time, before any
    // instance constructor is invoked or member is accessed.
    static SimpleClass()
    {
        baseline = DateTime.Now.Ticks;
    }
}
```

静态构造方法不接受参数，也没有访问权限修饰符，其被运行时自动调用，主要的作用就是对 `static readonly` 的变量进行初始值计算和设定【const和static是不能共存的】。具体该构造方法调用是在非静态类实例化之前或者静态类第一次属性访问之前。

### ref和in和out

默认方法参数传递是按值传递，C#可以用ref关键词标记某个参数为按引用传递。

```C#
void Method(ref int refArgument)
{
    refArgument = refArgument + 44;
}

int number = 1;
Method(ref number);
Console.WriteLine(number);
// Output: 45
```

这底层用的应该是类似C++引用变量的概念。

in关键词大体可以类似于 `readonly ref` 这样的作用机制。

out关键词大体类似于ref除了它不要求初始化，主要是用于如下应用场景【方法进行一些动作，然后将动作的结果存储在out变量上】：

```c#
void OutArgExample(out int number)
{
    number = 44;
}

int initializeInMethod;
OutArgExample(out initializeInMethod);
Console.WriteLine(initializeInMethod);     // value is now 44
```

现在out接受变量可以直接被声明了，比如说上面的例子，可以直接简写为：

```c#
OutArgExample(out int initializeInMethod);
Console.WriteLine(initializeInMethod);     // value is now 44
```

如果out出来的变量你是不需要的，则可以用 `_` 忽略掉。

```
Split("a b c", out string a, out _ , out _);
```

### 定义索引语法

让你的自定义对象支持类似字典 `d["a"]` 这样的索引语法：

```c#
public string this [int index]
{
    get {// do your retrieve work; }
    set {// what = value;}
}
```

### 继承

C#就继承和C++的继承有一个很大的区别：**C#的继承子类允许有一个父类** 。

下面演示了一个新东西，这在C++那边也是没有的，也就是 **base**关键词对父类的引用。虽然C++那边没有base这个关键词，但如下构造方法根据父类的构造方法进行简化操作的写法在C++那边也是有的，在C++那边具体叫做成员初始化列表写法，大体可以理解为：`Character(name)` ，说的再细一点这个name参数是直接来自 `Paladin(string name)` 接收到的name参数的。

```c#
public class Paladin : Character
{
    public Paladin(string name): base(name)
    {
    
    }

}
```

C#对于多重继承应用场景可以利用接口interface来做到类似的效果，C#的类虽然只能继承自一个父类，但可以继承自多个接口。

上面还演示了对于构造方法来说，并没有重载这个概念，因为构造方法并不是类的属性，子类最多只能基于父类的构造方法来做一些修改。

#### interface

关于interface前面提到过，其定义了一个接口，类继承了这个接口，那么就需要实现接口里面声明的方法或者属性等其他内容。

对于属性的接口声明如下：

```C#
interface IPoint
{
   // Property signatures:
   int X{get;set;}

   double Distance{get;}
}
```

需要注意的是这些属性在接口里面并没有自动实现，而需要在后续类里面实现：

```C#
class Point : IPoint
{
   // Constructor:
   public Point(int x, int y)
   {
      X = x;
      Y = y;
   }

   // Property implementation:
   public int X { get; set; }

   public int Y { get; set; }

   // Property implementation
   public double Distance =>
      Math.Sqrt(X * X + Y * Y);

}
```

C#7的interface的功能只支持

- 方法
- 属性
- Indexers
- Events

static方法也是不支持的。

#### abstract和sealed

abstract和sealed这两个关键词都可以用来修饰class：

```
public abstract class A
{
    // Class members here.
}
public sealed class D
{
    // Class members here.
}
```

其中sealed class含义较好理解，其标记了这个class不能再被其他类继承了。也因此sealed class不能用于子类，也不能用于abstract class抽象类。

abstract class抽象类如果在其他编程语言里面接触过抽象基类这个概念那么会很快理解这是个什么东西，简单来说abstract标记了这个class是一个抽象基类，抽象基类不可实例化。抽象基类至少要有一个抽象成员，或者抽象方法或者抽象属性等都行。继承自抽象基类的类必须实现那些抽象成员。

下面的Shape抽象基类声明了一个抽象方法GetArea，Square就必须实现这个GetArea方法。

```C#
abstract class Shape
{
    public abstract int GetArea();
}

class Square : Shape
{
    int side;

    public Square(int n) => side = n;

    // GetArea method is required to avoid a compile-time error.
    public override int GetArea() => side * side;

    static void Main()
    {
        var sq = new Square(12);
        Console.WriteLine($"Area of the square = {sq.GetArea()}");
    }
}
// Output: Area of the square = 144
```

再了解抽象基类和interface之后，大家应该觉察到interface和抽象基类在作用上似乎有某种相似性，就对父类的某些规范上确实如此，但除此之外两个是完全不同的变量类型了。抽象基类说到底其仍然是一个class，只是说被限定不能实例化，原class里面可以做的事情都是可以做的。而interface则完全是一个声明规范了，里面不能有实现【C#8略有变动】。然后前面谈到C#的单继承，一个类只能继承一个抽象基类，但它可以继承多个interface。

此外抽象基类在写法上如下注意点：

1. 抽象基类的abstract成员不用写上virtual关键词了，因为它已经暗含virtual了。
2. 子类实现abstract成员需要加上override关键词。

#### 类型转换

如果是子类对象要求向上强制转成父类对象，子类对象没有发生变化，还是指向原来的子类对象。就好比你要将香蕉转成水果，香蕉本来就是水果了，没什么好转的。

但是如果是父类转子类则情况就较复杂了，还可能会失败。

### 多态（virtual+override）

C++就多态这个议题从C++11开始也有virtual和override这两个关键词了，不过都不是强制性的，正因为不是强制性的，所以引出很多问题。比如不使用virtual，如果你的子类声明的时候采用的是子类引用变量或者子类指针，那么使用的方法都将是基类的。而引入virtual这个关键词会根据实例的类型来决定使用的方法。override在C++那边更多的是一个规避bug的写法，表明你的子类的这个方法是要重载基类的某个方法，因为有时一不注意，参数类型没对上，重载行为就会无意跳过去。

在C#这边virtual和override用来描述OOP面向对象编程的多态概念是推荐的标准写法了。

简单来说就是基类的方法要加上virtual，子类的方法要加上override表明这里有重载行为。

```c#
    // base class
    public virtual void printStatusInfo()
    {
        Debug.LogFormat("Hero: {0} - {1} EXP", this.name, this.exp);
    }
    
    // derived class
    public override void printStatusInfo()
    {
        Debug.LogFormat("Paladin: {0} - take up your weapon: {1}", this.name, this.weapon.name);
    }
```

上面的讨论主要是在说方法，属性同样也适用上面关于多态的讨论。

#### 隐藏继承来的成员

如果子类直接定义一个和父类同名的成员则就直接隐藏覆盖继承来的成员了，不过编译器可能会报警说你隐藏了继承来的成员，你是有意要这样做吗，可以加个new关键词。

```c#
public class A 
{
    public int a = 1;
}
public class B:A
{
    public new int a = 2;
}
```

这个new和new一个object没有任何关系，这里new的意思只是告诉编译器我是有意要隐藏继承来的成员。

virtual-override和这里讨论的隐藏new一个成员的区别是，override会影响基类的行为，当override之后基类调用这些成员的行为和子类是一致的。

#### base

base调用父类的构造方法这个前面说过了，此外base还有一个用法那就是调用被override的父类的成员：

```c#
public class House: Asset
{
    public override decimal Liability => base.liability + Mortgage;
}
```

所以base的含义就是总是调用父类，而不会管隐藏继承或者override。

#### 运算符重载

对于基本运算符的重载声明必须是public的static的。具体重载格式如下：

```
        public static Complex operator +(Complex a, Complex b)
        {
            return new Complex(a.Real + b.Real, a.Imaginary + b.Imaginary);
        }
```

#### 重载ToString方法

C#的所有class和struct都继承自Object，因此它们都有ToString方法。一般自定义的class和struct都推荐通过重载ToString方法来提供本类或结构体的一些打印信息。

```c#
public override string ToString(){
    
}
```

### 解构方法

给你的类定义一个Deconstruct方法，然后你的类可以如下解构了：

```c#
    public class Complex
    {
        public double Real { get; private set; }
        public double Imaginary { get; private set; }

        public Complex(double real = 0, double imaginary = 0)
        {
            this.Real = real;
            this.Imaginary = imaginary;
        }
        
        public void Deconstruct(out double real, out double imaginary)
        {
            real = Real;
            imaginary = Imaginary;
        }
    }
    
    ////////
    
    Complex test = new Complex(1,2);
    var (a, b) = test;
    Console.WriteLine($"a = {a}, b = {b}");
```

上面的写法更简洁，大概等价于：

```
            double a, b;
            test.Deconstruct(out a, out b);
```



### 做点练习题温习下

下面我们做几个经典的练习题来温习下前面学过的内容吧。

1. 编写经典的C系的swap_int函数，请使用ref关键词来实现。
2. 编写一个QuickSort类，其内的sort方法将接受一个一维int数组，按照数值大小排序之后打印出来。并不要求处理输入问题，毕竟这不是这里的重点。
3. 编写经典的复数Complex类，实现基本打印功能，并实现复数的加减运算，相等判断运算等。



下面是第一题：

```c#
    class Program
    {
        static void SwapInt(ref int a, ref int b)
        {
            int temp;
            temp = a;
            a = b;
            b = temp;
        }
        
        static void Main(string[] args)
        {
            int x = 1;
            int y = 2;
            Console.WriteLine($"origin x, y = {x}, {y}");
            SwapInt(ref x, ref y);
            Console.WriteLine($"Swaped x, y = {x}, {y}");
        }
    }
```

第二题参考维基百科快速排序的伪代码然后写为如下：

```c#
    class QuickSort
    {
        public static void SwapInt(ref int a, ref int b)
        {
            int temp;
            temp = a;
            a = b;
            b = temp;
        }

        public static int Partition(int[] arr, int low, int high)
        {
            /*
             * 本函数的用途就是取末尾元素然后将比末尾元素小的元素放入前面
             * 留下来的比末尾元素大的在后面
             * 索引位置i最后是原末尾元素
             */
            int pivot = arr[high]; 
            int i = low; 

            for (int j = low; j <= high; j++)
            {
                if (arr[j] < pivot)
                {
                    SwapInt(ref arr[i], ref arr[j]);
                    i++;
                }
            }
            SwapInt(ref arr[i], ref arr[high]);
            return i;
        }

        public static void _Sort(int[] array, int low, int high)
        {
            if (low < high)
            {
                int pi = Partition(array, low, high);

                _Sort(array, low, pi - 1);
                _Sort(array, pi + 1, high);
            }
        }

        public static void Sort(int[] array)
        {
            int low = 0;
            int high = array.Length - 1;
            _Sort(array, low, high);
        }

    }
```

第三题主要练习下运算符的重载。

```c#
 class Complex
    {
        public double Real { get; private set; }
        public double Imaginary { get; private set; }

        public Complex(double real=0, double imaginary = 0)
        {
            this.Real = real;
            this.Imaginary = imaginary;
        }

        public override string ToString() => $"{this.Real} + {this.Imaginary}i";

        public static Complex operator +(Complex a, Complex b)
        {
            return new Complex(a.Real + b.Real, a.Imaginary + b.Imaginary);
        }

        public static Complex operator -(Complex a, Complex b)
        {
            return new Complex(a.Real - b.Real, a.Imaginary - b.Imaginary);
        }

        public override bool Equals(object obj)
        {
            return Real.Equals(((Complex)obj).Real) && Imaginary.Equals(((Complex)obj).Imaginary);
        }

        public override int GetHashCode()
        {
            return new { this.Real, this.Imaginary }.GetHashCode();
        }

        public static bool operator ==(Complex a, Complex b)
        {
            return (a.Real == b.Real) && (a.Imaginary == b.Imaginary);
        }

        public static bool operator !=(Complex a, Complex b)
        {
            return (a.Real != b.Real) || (a.Imaginary != b.Imaginary);
        }

```





练习题并没有刻意找一个练习继承的习题，实际上现代编程程序界设计模式的一个守则是：**多用合成，少用继承**。不要刻意为了继承而继承，确实你的建模分析需要有继承才能更好地模拟反映研究对象才去用继承。



## generic泛型编程

C#的泛型编程让你编写类，接口，结构体，方法的时候不局限某一具体类型之上。

一个泛型类演示例子如下：

```c#
public class GenericDemo<T>
{
    public T Value{get; private set;}

    public GenericDemo(T value)
    {
        Value = value;
    }
}
```

如上所示，所谓泛型类就是指在该类的作用域下你都可以使用这个 `T` 来泛指某一个类型，该类后面使用的时候需要指定具体某个类型：

```c#
var obj1 = new GenericDemo<int>(10);
var obj2 = new GenericDemo<string>("hello world.");
```

此外泛型接口，泛型结构体，泛型方法等都有类似的写法和概念。

泛型并不局限在一个泛指类型上，你也可以指定多个类型：

```c#
class Pair<T, U>
{
    public T Item1 {get; private set;}
    public U Item2 {get; private set;}
    
    public Pair(T item1, U item2)
    {
        Item1 = item1;
        Item2 = item2;
    }
}
var p1 = new Pair<int, double>(1, 3.14);
```

### 泛型类型限定

默认泛型类型可以为任意类型，你可以如下加入类型限定：

```
public class GenericList<T> where T : Employee
{
```

上面限定了GenericList泛型T只能是Employee类或者其子类。

泛型类型限定可以是多个：

```
class EmployeeList<T> where T : Employee, IEmployee, System.IComparable<T>, new()
{
    // ...
}
```

这其中有些是默认的表达：

- where T: struct   T必须是value type，但不能是null。
- where T: class     T必须是reference type。
- where T: new()    T必须有一个public的默认构造方法

还有一些这里就不赘述了，请参看C#文档的 [这里](https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/generics/constraints-on-type-parameters)。



## Collection库

### List

C#的List类型与C++的vector类更接近，其仍然要求内部存储的元素为相同的类型，所以不能对标python的列表。因为和array相比list可以更加灵活地增删元素所以很多情况下会更好用，使用它需要加载 `System.Collection.Generic` 。

```c#
using System;
using System.Collections.Generic;

namespace ConsoleApp1
{
    class Program
    {
        static void Main(string[] args)
        {
            List<int> nums = new List<int>();

            nums.Add(1);
            nums.Add(2);
            nums.Add(5);

            nums.ForEach((num) => Console.WriteLine(num));
        }
    }
}
```

此外还有Insert方法，RemoveAt和Remove方法等。

此外这种集合类型初始化语法了解下：

```c#
 new List<string>(){
                    "New York",
                    "London",
                    "Mumbai",
                    "Chicago"                    
                };
```



- `.Count` 返回List的元素数
- Clear 清空
- Contains
- IndexOf  search and return the item index

### Stack

也就是堆栈，后进先出。

```
Stack<string> numbers = new Stack<string>();
numbers.Push("one");
numbers.Push("two");
```

Pop方法弹出元素，Count属性返回所含元素数。Clear方法堆栈清空。

### Queue

队列，先进先出。

```
Queue<string> numbers = new Queue<string>();
numbers.Enqueue("one");
numbers.Enqueue("two");
```

Dequeue队列出元素，Count属性返回所含元素数，Clear方法队列清空。

### Dictionary

Dictionary类型声明语句如下所示，就是类似于python语言的dict类型。

```
Dictionary<keyType, valueType> name = new Dictionary<keyType, valueType>();
```

```c#
using System;
using System.Collections.Generic;

namespace ConsoleApp1
{
    class Program
    {
        static void Main(string[] args)
        {
            Dictionary<string, int> dict = new Dictionary<string, int>();

            dict.Add("a", 1);
            dict.Add("b", 2);
            dict.Add("c", 3);

            foreach (KeyValuePair<string, int> item in dict)
            {
                Console.WriteLine($"{item.Key}: {item.Value}");
            }
        }
    }
}
```

Dictionary引用值和修改值语句：`dict["a"]` 或者 `dict["a"]=3` ，这种引用值写法如果分配一个key原字典没有则会新增。

此外还有 ContainsKey方法来确认某个key是否存在。

还有Remove方法用于删除某个key。

### HashSet

大体是数学上的集合概念数据结构。

```
HashSet<int> evenNumbers = new HashSet<int>();
evenNumbers.Add(2);
```

此外还有Remove方法移除某个元素，Clear方法清空集合等。

此外集合和集合之间有特有的交集，互集和差集操作等：

```
s1.IntersectWith(b);  // 交集
s1.UnionWith(b);  // 互集
s1.ExceptWith(b); // s1-b 差集
```

上面谈论的这些Collection都是线程不安全的，如果你需要在多线程上使用它们则需要加外部锁，而更推荐的做法是使用 `Sysytem.Collections.Concurrent` 里面的对象，里面的对象是线程安全的，也就是C#内部将这些锁的问题解决了，内部锁机制效率会高一点。

### Collection类打印

```
string.Join(" ", set);
```





## delegate和event

在前面我们大体了解了delegate实现了关于某类函数的指针或者说委托，说的再白话点就是delegate这个对象定义了一种函数类型，具体指向这种函数类型的某个函数实现还不确定，也是可以修改的，若这个delegate指向了func1，那么你可以通过这个delegate来调用func1，若这个delegate指向了func2，那么你可以通过这个delegate来调用func2。

首先请看下面这个例子：

```c#

namespace cs_project1
{
    public enum Status { Started, Stopped};
    public delegate void StatusChange(Status status);

    class Engine
    {
        private StatusChange statusChangeHandler;

        public void RegisterStatusChangeHandler(StatusChange handler)
        {
            statusChangeHandler += handler;
        }

        public void UnregisterStatusChangeHandler(StatusChange handler)
        {
            statusChangeHandler -= handler;
        }

        public void Start()
        {
            statusChangeHandler?.Invoke(Status.Started);
        }

        public void Stop()
        {
            statusChangeHandler?.Invoke(Status.Stopped);
        }

    }
}

namespace cs_project1
{
    class Program
    {

        static void Main(string[] args)
        {
            Engine engine = new Engine();
            engine.RegisterStatusChangeHandler(OnEngineStatusChanged);
            engine.RegisterStatusChangeHandler(OnEngineStatusChanged2);

            engine.Start();
            engine.Stop();

            engine.UnregisterStatusChangeHandler(OnEngineStatusChanged2);
            engine.Start();
            engine.Stop();
        }

        private static void OnEngineStatusChanged(Status status)
        {
            Console.WriteLine($"Engine is now {status}");
        }
        private static void OnEngineStatusChanged2(Status status)
        {
            Console.WriteLine($"Report2: Engine is now {status}");
        }

    }
}
```

值得注意的是C#的delegate类型是支持绑定多个函数指向的，多播delegate这种行为模式的存在证明了C#的delegate是一个功能强大的类型对象而不简单只是一个函数指针。其内部随着加法和减法来维护这一个分配了的委托列表。

关于C#的event是个什么东西，请看上面例子的event版本：

```c#

namespace cs_project1
{
    public enum Status { Started, Stopped};
    public delegate void StatusChange(Status status);

    class Engine
    {
        public event StatusChange statusChanged;

        public void Start()
        {
            statusChanged?.Invoke(Status.Started);
        }

        public void Stop()
        {
            statusChanged?.Invoke(Status.Stopped);
        }

    }
}


namespace cs_project1
{
    class Program
    {

        static void Main(string[] args)
        {
            Engine engine = new Engine();
            engine.statusChanged += OnEngineStatusChanged;
            engine.statusChanged += OnEngineStatusChanged2;

            engine.Start();
            engine.Stop();

            engine.statusChanged -= OnEngineStatusChanged2;
            engine.Start();
            engine.Stop();
        }

        private static void OnEngineStatusChanged(Status status)
        {
            Console.WriteLine($"Engine is now {status}");
        }
        private static void OnEngineStatusChanged2(Status status)
        {
            Console.WriteLine($"Report2: Engine is now {status}");
        }

    }
}
```

大家一下就看出来了这个C#的event和delegate似乎就是一个东西，但如果完全一样C#为何要多次一举弄出event这个关键词呢。这两个例子最大的一个关键点是event它敢让自己public，而你绝对不敢让delegate变成public。event敢变成public是因为它比直接使用delegate多了一层封装，现在event只能Add和Remove delegate这两个操作，然后它绑定的delegate是私有的。event敢变成public的好处就是抽象出一个事件属性的概念，从而可以如上编程的那样直接增减事件的调用。

### 事件驱动编程

事件驱动编程模式或者说委托代理模式，其将构建一个事件通道作为第三中间人，事件发送方只负责告诉该第三人事件发生了，事件发送方并不关心这个第三人等下要将这些事件通知给谁。而事件接收方也不知道事件发送方是谁，它只管听第三人也就是事件通道的，事件通道说事件触发了，然后事件接收方再决定做某些事情。

此外编程上还有一个观察模式，观察模式的事件发送方和事件接受方彼此是知道的，事件发生了事件发送方会直接通知各个事件接收方事件发生了。参考了 [这篇文章](https://hackernoon.com/observer-vs-pub-sub-pattern-50d3b27f838c) 。

按照上面的说法，我们最好是构建出一个EventChannel类，由这个EventChannel来负责触发事件，由这个EventChannel负责传递函数参数和通知事件接收方事件发生了。

在实践中的一个编码规范是参数最好把事件的发送人和发送的参数作为两个参数。大概如下：

```
public delegate void EventHandler<TEventArgs>(object? sender, TEventArgs e);
```

是的，C#就定义了这个EventHandler委托，于是利用这个EventHandler我们就可以如下定义事件了：

```
public event EventHandler<SomeEventArgs> someEvent;
```

下面是定义该事件的参数传递规范：

```c#
    public class SomeEventArgs : EventArgs
    {
        public int x { get; private set; }
        public int y { get; private set; }

        public SomeEventArgs(int x, int y){
            this.x = x;
            this.y = y;
        }
    }
```

下面定义了一个事件通道基类：

```c#
    public enum Status { Started, Stopped };

    public class BaseEventChannel<T>
    {
        public event EventHandler<T> Event;

        public void RaiseEvent(object sender, T args)
        {
            Event?.Invoke(sender, args);
        }

        public void AddHandler(EventHandler<T> handler)
        {
            Event += handler;
        }
        public void RemoveHandler(EventHandler<T> handler)
        {
            Event -= handler;
        }
    }
```

```c#
public class SomeEventArgs : EventArgs
    {
        public Status status { get; private set; }

        public SomeEventArgs(Status status)
        {
            this.status = status;
        }
    }
    public class SomeEventChannel : BaseEventChannel<SomeEventArgs>
    {
    }

    class Engine
    {
        public SomeEventChannel someEventChannel = new SomeEventChannel();

        protected virtual void OnSomeEvent(SomeEventArgs args)
        {
            someEventChannel.RaiseEvent(this, args);
        }

        public void Start()
        {
            OnSomeEvent(new SomeEventArgs(Status.Started));
        }

        public void Stop()
        {
            OnSomeEvent(new SomeEventArgs(Status.Stopped));
        }

    }
```

具体调用程序大体如下：

```c#
 class Program
    {

        static void Main(string[] args)
        {
            Engine engine = new Engine();
            engine.someEventChannel.AddHandler(OnEngineStatusChanged);
            engine.someEventChannel.AddHandler(OnEngineStatusChanged2);

            engine.Start();
            engine.Stop();

            engine.someEventChannel.RemoveHandler(OnEngineStatusChanged2);
            engine.Start();
            engine.Stop();
        }

        private static void OnEngineStatusChanged(object sender, SomeEventArgs args)
        {
            Console.WriteLine($"{sender} is now {args.status}");
        }

        private static void OnEngineStatusChanged2(object sender, SomeEventArgs args)
        {
            Console.WriteLine($"Report2: {sender} is now {args.status}");
        }

    }
```

就上面这个程序小片段没这个问题，但对于稍大点的应用程序，则需要保证某一特定事件通道的唯一性。有以下做法，并没有那种优于那种一说：

- 一是靠程序员自我编码规范，比如事件和组件是特有的绑定关系，这样你在编码的时候就会很少犯错，因为你总是在想这个组件实体触发了什么事件，自然会做好组件实体的唯一性和对目标事件的引用。
- 让事件通道成为全局变量从而全局唯一。
- 从事件通道的编码上实现单例模式
- 将你的事件通道和外部的数据文件等建立某种唯一关系等。

### 单例模式示例

本小节单例模式实现主要参考了 [这个网页](https://csharpindepth.com/articles/singleton) 。

```c#
    public sealed class SomeEventChannel : BaseEventChannel<SomeEventArgs>
    {
        private static readonly SomeEventChannel instance = new SomeEventChannel();
        static SomeEventChannel() { } // Make sure it's truly lazy
        private SomeEventChannel() { } // Prevent instantiation outside

        public static SomeEventChannel Instance { get { return instance; } }

    }
```

具体在引用的时候要如下这样使用了：

```
        public SomeEventChannel someEventChannel = SomeEventChannel.Instance;
```

### 和组件绑定的事件

在实践中有一种情况，那就是事件是和某一个组件是绑定的一对一关系，那么自然这个事件就是单例的。而这个事件作为某个组件的属性在单例的处理上就会稍微简单一点，这个组件事件也没必要发送sender这个参数了，因为事件发起人肯定是本组件this。出于代码简洁的考虑，可以引入组件事件的概念：

```
namespace System
{
    public delegate void VoidComponentEventHandler();
    public delegate void ComponentEventHandler<TEventArgs>(TEventArgs e);
}

public class ComponentEventBase<T>
{
    public event ComponentEventHandler<T> Event;

    public void RaiseEvent(T args)
    {
        Event?.Invoke(args);
    }

    public void AddHandler(ComponentEventHandler<T> handler)
    {
        Event += handler;
    }
    public void RemoveHandler(ComponentEventHandler<T> handler)
    {
        Event -= handler;
    }
}


public class VoidComponentEvent
{
    public event VoidComponentEventHandler Event;

    public void RaiseEvent()
    {
        Event?.Invoke();
    }

    public void AddHandler(VoidComponentEventHandler handler)
    {
        Event += handler;
    }
    public void RemoveHandler(VoidComponentEventHandler handler)
    {
        Event -= handler;
    }
}

```

```
public VoidComponentEvent myEvent1 = new VoidComponentEvent();
public VoidComponentEvent myEvent2 = new VoidComponentEvent();
```



## LINQ

LINQ ( Language Integrated Query) 

首先长话短说，C#的LINQ大概类似于python的列表解析式那一块讨论的领域：

```
>>> [i for i in range(10) if i % 2 == 0]
[0, 2, 4, 6, 8]
```

具体来说就是针对可迭代对象进行的一系列流式操作。

当然上面只是一个类比，到C#这边是对实现了 `IEumerable<T>` 接口的类执行的一系列流式的查询操作。

类似上面的python语句的C#语句是：

```c#
int[] array = new int[] {0,1,2,3,4,5,6,7,8,9};

var query = from num in array where (num % 2) ==0 select num;

foreach (var i in query){
	Console.WriteLine(i);
}
```

我们看到C#的LINQ语法有点类似于SQL语句，然后LINQ的查询和具体查询的执行是分开的。上面query的类型写明的话是 `IEumaerable<int>` 。query可以通过 `ToList` 或 `ToArray` 方法来立即执行：

```c#
int[] array = new int[] {0,1,2,3,4,5,6,7,8,9};

var query = from num in array where (num % 2) ==0 select num;

List<int> list = query.ToList();

foreach (var i in list){
	Console.WriteLine(i);
}
```

要使用C#的LINQ，需要加载：

```
using System.Linq;
```



然后你可能还会看到如下的method语法：

```c#
int[] array = new int[] {0,1,2,3,4,5,6,7,8,9};

var query = array.Where(num => (num % 2) ==0);

foreach (var i in query){
	Console.WriteLine(i);
}
```



类似python的可迭代对象，c#这边的LINQ应该也是惰性查询的，既然说到流式操作编程模式，当然LINQ是支持 `.what.what` 这样的操作。这些后面有时间会慢慢再列举一些相关例子，但总的来说LINQ是让你的C#程序在某些地方上用的更灵活更优美，这部分内容其实已经算不上C#语言的核心，而只是个让C#更好用的组件，所以这里的讨论能够从简就从简了。



### 检查元素是否在array中

```
using System.Linq;

string[] fruits = { "apple", "banana", "mango", "orange", "passionfruit", "grape" };

string fruit = "mango";

bool hasMango = fruits.Contains(fruit);
```

### Range方法

类似python的 `range(10)` 的实现：

```
int[] array = Enumerable.Range(0,10).ToArray();
```

第一个参数是起始值，第二个参数是输出数个数。



## C#8的新特性

Unity2019用的是C#7，Unity2020用的是C#8，本小节主要讨论C#8新增的然后Unity2020也是支持的新特性，剩下那四个Unity2020还不支持的就暂时略过讨论了。

### nullable reference types

这个更多的是一个防止出现 `NullReferenceException` 的一个手段，加上Unity那边情况又有所不同，个人不怎么考虑使用这个特性了。

默认情况下visual studio也没有开启这个特性，也就是默认认为reference type的默认值是null，都是可能为null的。



### switch语句更紧凑

这里主要是指的switch语句的更紧凑版本，这个更紧凑的版本可以让那些if elseif 格式的狂热爱好者也来看上一眼并喜欢上switch语句了。前面提到到 c#7的时候switch语句的那个评估表达式就可以是任意非空的表达式了，而在c#8则有了这样的更紧凑版本：

```c#
public static RGBColor FromRainbow(Rainbow colorBand) =>
    colorBand switch
    {
        Rainbow.Red    => new RGBColor(0xFF, 0x00, 0x00),
        Rainbow.Orange => new RGBColor(0xFF, 0x7F, 0x00),
        Rainbow.Yellow => new RGBColor(0xFF, 0xFF, 0x00),
        Rainbow.Green  => new RGBColor(0x00, 0xFF, 0x00),
        Rainbow.Blue   => new RGBColor(0x00, 0x00, 0xFF),
        Rainbow.Indigo => new RGBColor(0x4B, 0x00, 0x82),
        Rainbow.Violet => new RGBColor(0x94, 0x00, 0xD3),
        _              => throw new ArgumentException(message: "invalid enum value", paramName: nameof(colorBand)),
    };
```

其相当于以前的写法是：

```c#
public static RGBColor FromRainbowClassic(Rainbow colorBand)
{
    switch (colorBand)
    {
        case Rainbow.Red:
            return new RGBColor(0xFF, 0x00, 0x00);
        case Rainbow.Orange:
            return new RGBColor(0xFF, 0x7F, 0x00);
        case Rainbow.Yellow:
            return new RGBColor(0xFF, 0xFF, 0x00);
        case Rainbow.Green:
            return new RGBColor(0x00, 0xFF, 0x00);
        case Rainbow.Blue:
            return new RGBColor(0x00, 0x00, 0xFF);
        case Rainbow.Indigo:
            return new RGBColor(0x4B, 0x00, 0x82);
        case Rainbow.Violet:
            return new RGBColor(0x94, 0x00, 0xD3);
        default:
            throw new ArgumentException(message: "invalid enum value", paramName: nameof(colorBand));
    };
}
```

但是在以前的写法基础上，还增加了更多灵活的属性匹配，数组对匹配等。

### using语句更好用

using语句大概类似python里面的with语句，本来using语句是这样的：

```
using (FileStream fs = File.Open(path, FileMode.Open))
{
}
```

或者其他类似的对象实现了 `IDisposable` 接口。

现在可以直接这样写了：

```
{
    using FileStream fs = File.Open(path, FileMode.Open);
} // Dispose
```

不要担心Dispose方法没有调用，Dispose方法会在下一次遇到的花括号之后再执行的。

### Disposable ref structs

### readonly struct member

现在结构体的成员可以加上readonly修饰符了。

```c#
public readonly override string ToString() =>
    $"({X}, {Y}) is {Distance} from the origin";
```

比如结构体的方法加上readonly之后编译器会检查这个方法，强制要求这个方法不能修改结构体内的属性字段，否则编译器将会报错。

### Null-coalescing assignment

【null合并赋值】之前就有了 `??` 符号，意思是如果左边不是null，则返回左边的值，否则计算右边的表达式的值，然后返回该值。
现在C#8 新增了下面的写法：

```
list ??= new List<string>();
```
而上面 `??=` 的意思是如果list不会null则什么都不做，如果list为null则执行右边表达式的值并赋值给list。

### Unmanaged constructed types

### Static local functions

从c#7开始方法里面还可以再定义一个函数了，这个函数叫做local function。现在C#8开始local function可以是static的了。一个static的local function不能捕捉本地变量和实例状态了【规范术语叫做enclosing scope里面的变量，local function里面叫做local scope，再外面就是enclosing scope，然后就是global scope】。

这个一般能用lambda表达式就用lambda表达式，实在确实感觉需要这个再说吧。



## 文件读写

### File类

- File.Exists  判断文件是否存在
- File.Copy 文件复制动作，第三个参数设为true则允许覆写目标文件，否则抛出异常。
- File.Create 创建一个空白的临时文件，如果指定文件名已存在则会覆写。返回FileStream对象
- File.CreateText 创建一个空白的UTF8的空白文本文件，如果指定文件名已存在则会覆写。返回FileStream对象。
- File.Delete 删除某个文件
- File.Move 文件移动动作，源文件不存在或者目标文件已经存在都会抛出异常，需要做好判断。
- File.ReadAllText 打开某个文件，读取文本内容，然后关闭该文件，然后返回读取到的string内容。如果找不到源文件会抛出异常。
- File.WriteAllText 创建一个新的文件，如果目标文件已经存在，则会被覆写，然后将内容写入该文本文件中，然后关闭该文件。



## 程序诊断



## 资源管理

### IDisposable

```c#
using (FileStream fs = new FileStream(path, FileMode.Open))
{
}
```

等价于：

```c#
FileStream fs = new FileStream(path, FileMode.Open);
try{

}finally{
    if (fs != null) ((IDisposable)fs).Dispose();
}
```

using语句会确保退出的时候调用Dispose方法来进行一些资源的清理释放工作。

自定义的类对接IDisposable接口首先Dispose方法之后也可以类似的使用。

### 自动垃圾回收

CLR会自动进行垃圾回收。

在自动垃圾回收之前，类的Finalizer函数会被执行，在C++那边叫做析构函数。

```
class Test
{
~Test(){

}
}
```

一般来说不推荐编写析构函数，如果一定要编写你需要对析构函数里面的每一行代码具体在做什么为什么要这么做很清楚，然后还有以下规则：

- 析构函数要很快执行
- 析构函数不要Block
- 不用引用其他finaliable object
- 不要抛出异常

### 内存泄露

#### 记得退订事件监听

参考资料3里面讲了这个例子：

```c#
class Host
{
    public event EventHandler Click;
}
class Client
{
    Host _host;
    public Client (Host host)
    {
        _host = host;
        _host.Click += HostClicked;
    }
    void HostClicked(object sender, EventArgs e){}
}

class Test
{
    static Host _host =new Host();
    
    public static void CreateClient()
    {
        Client[] clients = Enumerable.Range(0,1000)
        .Select(i=> new Client(_host)).ToArray();
        //
    }
}
```

上面的一千个client不会被正确地垃圾回收，因为它们里面还都有_host的Click事件监听，必须释放之后这些client才会被正确垃圾回收。

```
public void Dispose() {_host.Click -= HostClicked;}

Array.ForEach(clients, c=>c.Dispose());
```

####  忘记回收Timer

System.Timer 如果忘记调用它的 `Dispose` 方法也会出现内存泄露问题。



## Debug手段

### 条件编译

```
#define DEBUG

#if DEBUG
Console.WriteLine("info");
#endif
```

上面的打印信息语句只有define DEBUG之后才会进入编译，否则将会被注释掉。

觉得每次写上这样一段太麻烦了，于是编写一个方法：

```c#
public static class Debug{

public static void Log(string info)
{
	#if DEBUG
	Console.WriteLone($"{info}");
	#endif
}
}
```

但后来人们觉得还是太麻烦了，于是有了条件属性。

### 条件属性

```c#
[Conditional("DEBUG")]
public static class Debug{

public static void Log(string info)
{
	Console.WriteLone($"{info}");
}
}
```

条件属性的意思是这一整个类或者方法都被 `#if DEBUG ... #endif` 包围了，如果没有define DEBUG，则整个类或者方法都可以认为是空的。

### Debug类

C#已经有类似上面讨论的Debug类了，都封装了 `[Conditional("DEBUG")]`

```
Debug.WriteLine("Data");
```

也就是这些打印信息只在DEBUG这个define之后才会打印出来。

Unity里面的Debug类应该也是类似的，不过Unity里面的Debug类功能更多，此外Debug信息都会被打印入日志。

## 单元测试

C#项目在visual studio上很方便创建一个对应的单元测试项目，在目标public函数上右键创建一个单元测试即可。



## 正则表达式

这块后面有需求遇到了再补上。

## 拾遗

### 扩展方法

比如说给string类型扩展一个方法：

```c#
static class StringExtensions
{
	public static string Reverse(this string s)
	{
	    var charArray = s.ToCharArray();
	    Array.Reverse(charArray);
	    return new string(charArray);
	}
}
```

如上所示，在一个static class里面定义一个static method，然后第一个参数前面加上关键字 `this` ，表示本方法是一个扩展方法，这个this参数就是目标扩展的类型。然后就可以如下使用：

```
var text = "abc";
var res = text.Reverse();
```

### 枚举类型的Flags属性标记

编程中常见的Flags属性表示问题，可以如下方便用带Flags属性标记的枚举类型来实现，有 `HasFlag` 方法支持，如下所示可以用 `|` 运算符很方便地表示出多个flag。

```c#
using System;

[Flags] public enum DinnerItems {
   None = 0,
   Entree = 1,
   Appetizer = 2,
   Side = 4,
   Dessert = 8,
   Beverage = 16,
   BarBeverage = 32
}

public class Example
{
   public static void Main()
   {
      DinnerItems myOrder = DinnerItems.Appetizer | DinnerItems.Entree |
                            DinnerItems.Beverage | DinnerItems.Dessert;
      DinnerItems flagValue = DinnerItems.Entree | DinnerItems.Beverage;
      Console.WriteLine("{0} includes {1}: {2}",
                        myOrder, flagValue, myOrder.HasFlag(flagValue));
   }
}
// The example displays the following output:
//    Entree, Appetizer, Dessert, Beverage includes Entree, Beverage: True
```

## 其他

### 表达式形式定义

C#允许采用如下形式对成员通过表达式来进行定义。

```
member => expression;
```

```c#
public override string ToString() => $"{fname} {lname}".Trim(); // 这是定义方法
public string Name => locationName;  //这是定义属性
```

### null判断运算符

```
a?.x
a?[x]
```

访问对象a的成员x，如上写法，意思是如果a是null则返回null，如果a不是null则返回 `a.x` 或者 `a[x]` 。

### default

之前在介绍C#类型的时候提到C#的类型都是有默认值的，你可以用default关键词来表示这个默认值。

然后还可以这样来获得不同类型的默认值： 

````
default(int);
````

### initializer

#### object initializer

首先object initializer和类的构造方法初始化类是两回事，object initializer是一个便捷的初始化对象各个字段值的方法。其完整的写法是：

```c#
Cat cat = new Cat() { Age = 10, Name = "Fluffy" };
```

然后一般简写为：

```c#
Cat cat = new Cat { Age = 10, Name = "Fluffy" };
```

完整的写法表示object initializer调用的是该类的无参构造方法，默认假设你没有给该类编写构造方法则自动会有一个默认的。但如果你给该类编写了构造方法，则还需要写个简单的无参构造方法然后才能使用object initializer：

```
    public Cat()
    {
    }
```



#### collector initializer

collector initializer是对于实现了IEnumerable接口的类【比如Collection库里面的那些对象】然后其有Add方法，则可以用来快速初始化一些值。

```c#
List<int> digits = new List<int> { 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 };  
```

字典因为支持`d["a"]` 和 `d["a"] = 1` 这样的索引写法，所以collector initializer还支持这样的写法：

```c#
var moreNumbers = new Dictionary<int, string>
{
    {19, "nineteen" },
    {23, "twenty-three" },
    {42, "forty-two" }
};
```



### array和list的选用

【本小节所说的list就是C#的List类。】

如果你确切知道你的array不会发生变动了，那么就使用array。

如果你不太确定，那么推荐使用list。

网上对array和list的performance分析文章都是针对大量数据的情况，一般日常遇到的都是一些小型数据的情况，那么怎么好用怎么用，谁也不能批评什么。一般来说list会使用上简单一些，所以一般推荐使用list，但对于那些有微优化喜好的程序员，在确知你的数组不会发生变动了那么使用array当然更好。

这个大量数据的评判标准参考 [这个网页](https://stackoverflow.com/questions/454916/performance-of-arrays-vs-lists) ：

```
List/for: 1971ms (589725196)
Array/for: 1864ms (589725196)
List/foreach: 3054ms (589725196)
Array/foreach: 1860ms (589725196)
```

可以看到亿以上的数据array和list才开始慢慢速度效率拉开了一点，不得不承认C#的list效率优化得很好，似乎python的list和C语言的数组比较在效率上很快就会拉开差距【说句公道话，那是因为python的list里面的元素不要求同样的类型。】，亿以上的数据，日常应用场景，放心的使用list吧。



###  可折叠代码区块

```
            #region
            int a = 1;
            #endregion
```

如上所示，就是为了提高代码可读性，这块代码可以折叠，代码该执行还是会执行的。



### struct和class的选择问题

参考 [这篇网页](https://docs.microsoft.com/en-us/dotnet/standard/design-guidelines/choosing-between-class-and-struct) 。在没有特别的理由的情况下一般来说是推荐使用class，如果你的类型很小，存在时间很短，一般是嵌入在其他对象里面的那么可以考虑使用struct，但使用情况也必须满足下面四个条件，否则还是用class。

1. 该类型和基本类型比如整数等在行为上很相似
2. 它的大小在16字节以下（这个条件挺苛刻的，一个整型现在就四个字节，超过四个整型就不行了）
3. 它必须是不可变的
4. 它不应该经常boxed，也就是转成reference type。

从上面的描述来看，建议使用struct的情况非常非常的少，日常使用几乎绝大部分情况应该都是推荐使用class。



### partial class

类的定义分散在两个或更多的源码文件里面，程序编译时这些部分代码会合并起来。

### as运算符

```
E as T
```

执行E表达式，然后将结果转成类型T，此过程不会抛出异常，如果转换失败则会返回null。

### Func delegate

C#定义了一系列的Func delegate用来表示不同的函数类型从而来定义函数参数：

```
T Applay<T> (T a, T b, Func<T, T, T> f){
    return f(a,b);
}
```

上面的Func delegate调用的是：

```
public delegate TResult Func<in T1,in T2,out TResult>(T1 arg1, T2 arg2);
```

此外还有：

```
public delegate TResult Func<out TResult>();
public delegate TResult Func<in T,out TResult>(T arg);
.......
```

无参函数直到接受16个参数的函数。

### Action delegate

C#还定义了一系列的Action delegate委托，从无参直到接受16个参数的函数，和Func的唯一不同就是这些函数没有返回值。一般Action delegate在上面讨论的事件驱动编程那边应用较多。

### 获取本类的名字

```
this.GetType().Name
```

### using static

该类下的所有静态方法将可以直接使用：

```
using static System.Console;

WriteLine("Hello World.");
```

### XML注释文档

#### summary

```
/// <summary>
/// 这里放着对该方法的一些说明文字 
///</summary>
public void Method(){

}
```

#### param

```
/// <param name="what">这里放着对某个参数的描述</param>
```

#### return

```
/// <returns>
/// The sum of two integers.
/// </returns>
```

### 定义自己的可迭代对象

这个可迭代对象术语不知道正不正确，但不管怎么说意思就是你的类实现了IEumeratable接口之后，该类可以用foreach来迭代了。它需要你返回一个 IEumerator对象。

```c#
    IEnumerator IEnumerable.GetEnumerator()
    {
        return (IEnumerator)GetEnumerator();
    }

    public SerializableDictionaryEnum<TKey, TValue> GetEnumerator()
    {
        return new SerializableDictionaryEnum<TKey, TValue>(m_keys, m_values);
    }

```

然后定义IEumerator对象需要定义Current，MoveNext和Reset三个方法即可。写法大体类似下面所示：

```c#
public class SerializableDictionaryEnum<TKey, TValue> : IEnumerator
{
    private List<TKey> m_keys;

    private List<TValue> m_values;

    private int position = -1;

    public SerializableDictionaryEnum(List<TKey> m_keys, List<TValue> m_values)
    {
        this.m_keys = new List<TKey>(m_keys);
        this.m_values = new List<TValue>(m_values);
    }

    object IEnumerator.Current
    {
        get
        {
            return Current;
        }
    }

    public KeyValuePair<TKey, TValue> Current
    {
        get
        {
            try
            {
                return new KeyValuePair<TKey, TValue>(m_keys[position], m_values[position]);
            }
            catch (IndexOutOfRangeException)
            {
                throw new InvalidOperationException();
            }
        }
    }

    public bool MoveNext()
    {
        position++;
        return (position < m_keys.Count);
    }

    public void Reset()
    {
        position = -1;
    }
}
```



### LINQpad工具

一个很方便地快速测试C#表达式和LINQ表达式或者C#片段小程序的工具：[https://www.linqpad.net](https://www.linqpad.net/)



## 参考资料

1. [microsoft docs: a tour of csharp](https://docs.microsoft.com/en-us/dotnet/csharp/tour-of-csharp/)
2. learning C# programming by Marius Bancila and Raffaele Rialdi and Ankit Sharma
3. c# 8.0 in a nutshell by Joseph Albahari and Eric Johannsen 
4. c# in depth forth edition by Jon Skeet







