Title: java语言基础
Slug: java-tutorial-one
Date: 2018-07-30
Modified: 2018-08-05
Tags: java,
Status: draft

[TOC]



## java环境安装

下载jdk安装之后，配置windows的这些环境变量：

```
Path  指向jdk/bin
JAVA_HOME 指向jdk
CLASSPATH 指向 jdk/lib
```

这块不赘述了，推荐读者在 慕课网上把 JAVA的基本123免费教程跟着做完。



## 数组

数组如下初始化数据的时候就不能指定长度了：

```
int[] scores = new int[]{1,2,3,4}
```

java.util.Arrays里面有一些便捷操作数组的函数：

- sort 排序，破坏型
- toString 将数组转成字符串型

## 重载

函数或者方法，名字相同，但参数不同（个数、顺序、类型），具体调用也会有所不同，这叫做重载。



## 随机数

```
String.valueOf(1 + (int)(Math.random() * 9));  随机1-9
String.valueOf((int)(Math.random() * 10)); 随机 0-9
```



## format

```
System.out.printf("%03d", count); format 003
```

## 成员变量和局部变量

成员变量可以被本类方法，其他类的方法调用，如果成员变量没有赋初值，那么java会给成员变量一个初始值。

局部变量仅限于定义它的方法内使用。



## 构造方法

在类中，如果某个方法名字和类名相同，那么该方法叫做类的构造方法，也就是new一个类的对象的时候调用的方法。

没有指定类的构造方法，java会自动添加一个无参数的构造方法

如果指定的类的构造方法，java不会自动添加默认的那个无参数的构造方法了。

构造方法也有多态行为。



## 静态变量

static修饰的变量叫静态变量，该类的所有对象（实例）都共享一个变量。某个对象引用该静态变量，修改之，那么所有的对象引用该静态变量的值都将改变。

静态方法可以直接调用同类中的静态变量，但不能调用非静态变量。如果想要在静态方法中调用非静态变量，可以通过创建类的对象（实例），然后调用之。

 非静态方法可以直接访问本类的所有变量。



静态初始化块只能初始化静态变量。

```java
static int num;

static {
    num = 1；
}
```

## 包

声明本包，也就是相当于本类所在模块的前缀，就是代码文件最前面写上：

```
package work.cdwanze;
```

引用某个包则是：

```
import java.io.*;
```

### java相同包下不同类可以直接使用

java相同包下不同类可以直接使用。

## 访问修饰符

访问修饰符中private是只有本类可以访问，默认什么不写是本类本包可以访问，protected是本类，本包，子类可以访问，public是都可以访问。

## 封装

java中的类的私有变量：

```
private float x;
```

对外是不可见的，只能通过定义 getWhat 和 setWhat 方法来控制，这叫做封装。



## 类

### this

this代表当前对象 `this.what ` 。

### super

在对象中使用，代表父类对象。`super.what` 。 

`super()` 是显示调用父类的构造方法，必须写在子类构造方法的第一行。

### Object类

Object类是所有类的父类。如果一个类没有extends某个父类，则它默认是继承自Object类。Object类里面的方法Java里面所有的对象都是可以调用的。

- toString()  打印字符串控制
- equals() 比较两个对象是否相等



## 内部类

一个类定义在另一个类里面，叫做java的内部类，包含内部类的类称为外部类。

### 一般内部类

内部类可以直接访问外部类的所有变量。（NOTICE: 但如果内部类和外部类有相同的变量名，则优先取内部类的，你可以明确 ` Outer.this.name` 来指定要引用外部类的变量。）

外部类要访问内部类的变量，则需要创建一个内部类对象，然后再引用目标变量。

```
        // 创建外部类对象

HelloWorld hello = new HelloWorld();

        // 创建内部类对象

Inner i = hello.new Inner();

```



### 静态内部类

如果内部类加上static修饰符，则是静态内部类了，那么有：

- 记得之前说过，静态方法只能引用本类的静态变量了，同样这里有静态内部类只能调用外部类的静态变量了，如果要引用其他变量，则需要实例化一个外部类对象了。

- ```
  创建静态内部类对象可以直接这样来了：
  Inner i = new Inner();
  ```

### 方法内部类

方法内部类是内部类定义在外部类的方法里面的。方法内部类只在该方法内可见。



## 继承

java的继承是单继承，一个子类只有一个父类（这个和python有区别。）

父类的private变量不会被子类继承。

```java
class Dog extends Animal{
    
}
```

- 先初始化父类再初始化子类
- 先初始化对象的属性，再执行构造方法中的初始化

也就是先执行父类的属性初始化，再执行父类的构造方法，再执行子类的属性初始化，再执行子类的构造方法。



## 类引用的多态

父类引用可以指向本类的对象：

```
Animal dog1 = new Dog();
```

多态除了上面声明情况外，其他其实正常理解具体java程序的行为是可以猜到的。比如上面虽然引用说是Animal实际是Dog的一个对象；但是需要注意的，如果你声明的是Animal，如上声明，而方法在Animal里面是没有的，那么这个方法也是没有的。也就是方法根据继承重载规则来，但如果声明的Animal父类没有这个方法，则就没有这个方法了，哪怕Dog里面你定义了目标方法。（子类独有的方法不可引用）

上面谈论的简单来说一句话：父类引用声明子类是可行的——这也叫做自动类型转换。



## 抽象类

abstract 修饰符修饰的类为抽象类

抽象类是父类用来约束子类必须有哪些方法；或者抽象类作为子类的模板，从而避免子类设计的随意性。

```java
public abstract class Telphone{
    public abstract void call();
}
```



## 接口

接口可以理解为一种特殊的类，由全局变量和公共的抽象方法组成。接口是类必须要遵守的规范。看起来和上面的抽象类有点类似，当然还是有点小区别，但实际使用最大的区别在于类可以有多个接口。

```
[修饰符] interface [extends 父接口1 父接口2]{
    常量定义
    抽象方法定义
}
```

接口中的常量默认就有 `public static final` 这几个修饰符。

接口中的方法都是抽象方法，默认就有 `public abstract` 修饰符。

接口实际使用如下：

```
[修饰符] class 类名 extends 父类 implements 接口1 接口2 {
    	
}
```



## final

java里面final的修饰符让目标变量（这里所谓的变量是指广义上的变量，包括一般变量，方法，类等等。）不可被修改。一般常数值要加个final修饰符。

**NOTICE:** final 修饰类，该类不可被继承了。如果final修饰了方法，则该方法不可被重载了。

**NOTICE:** final 修饰类的某个属性值，默认自动创建的无参构造方法会自动进行初始化，但现在那个属性是不可初始化了。 



## 泛型

先用下面这个经典的例子来说明为什么我们需要泛型：

```java
import java.util.Arrays;

public class HelloWorld {
    public static void main(String []args) {
       System.out.println("Hello World!");
		
		HelloWorld hello = new HelloWorld();
		hello.echo("abc");
		hello.echo(123);
		
		Integer[] a = {1,2,3};
		hello.echo_array(a);
		String[] b= {"a","ab","abc"};
		hello.echo_array(b);
    }

	  public <T> void echo(T x){
		  System.out.println(x);
	  }
	
	  public <T> void echo_array(T[] x){
		  System.out.println(Arrays.toString(x));
	  }
}
```

泛型就好比一个类型参数，用尖括号括起来的，然后在后面的代码块里面，那个类型标识就代表具体的那个类型了。其中

类的泛型写法是：

  ```
  public class 类名 <T> {}
  ```

方法泛型的写法是：

  ```
  public <T> 返回类型 函数名() {} 
  ```

  如上面例子所示，有点类似于实现了python这样的动态语言模式，当然是有局限性的那种。现在在java里面也可以随便输入一个数据类型，然后进行一些处理了。

一般写的时候优先使用泛型方法。



### 有界泛型 

我们会看到这种代码，其实现了所谓的有界泛性：

```
<T extends Comparable<T>>
```

上面泛型声明的含义是，接下来T是一个泛型表示，然后有约定T接受的类型参数只能是Comparable类或其子类的实例。

 

### List接受泛型

java.util.List的源码定义是

```
public interface List<E> extends Collection<E> {
```

所以你在使用List的时候，需要传递一个类型参数进去：

```
List<String>
```

 



## 可变长度参数

我们看到如下代码

```
public void test(int... numbers){}
```

这在java语言中，如果你看到某个类型后面跟上三个点，那么其表示将接受0到多个这种类型的参数，如上例子将送入numbers中作为整数数组。



## 异常

 异常大家还是比较熟悉了，具体做什么就不多啰嗦了，看例子吧：

```
try{

} catch (Exception e){

}

```

```
try{

} catch (Exception  e){

} finally {

}
```



### 主动抛异常

```
throw new Exception();
```

### 方法定义抛出异常给上层处理

```
public void compute() throws Exception{

}
```

###自定义异常

```java
public class MyException extends Exception {

    public MyException(){}

    public MyException(String message){
    super(message);

}
}
```





 

