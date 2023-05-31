Slug: html5-tutorial
Date: 20191018
Summary: 本文讨论了最基础的HTML知识，可作为学习Web开发的第一篇学习文章。


[TOC]

If you are a english reader, I recommend [this article](https://www.websiteplanet.com/blog/html-guide-beginners/ ) for your html5 starting point. 




## 第一个模板

```html
<!DOCTYPE html>
<html lang="zh">
    <head>
    <meta charset="utf-8">
    <title>your awesome title</title>

    </head>

    <body>

    </body>
</html>
```

### doctype声明

现在html5的doctype声明非常简单了，开头加入如下简单一行即可:

    <!DOCTYPE html>

然后进入 **html** 标签，然后进入 **head** 标签，在head标签里面的内容不会显示在网页上，主要是一些关于本网页的配置信息。

### 字符集设置为utf-8

现在html5使用如下更简洁的语法了:

    <meta charset="utf-8">

然后 **body** 标签里面存放这实际要显示的网页内容。

## 第二个例子

```html
<!DOCTYPE html>
<html lang="zh">
    <head>
    <meta charset="utf-8">
    <title>basic html</title>
    </head>

    <body>
        <nav>
            <ul>
                <li><a href="#">Home</a></li>
                <li><a href="#">About</a></li>
                <li><a href="#">Products</a></li>
                <li><a href="#">Contact Us</a></li>
            </ul>
        </nav>

    <header>
        <h1><a href="#">Very Basic Document</a></h1>
        <h2>A tag line might go here</h2>
    </header>

    <section>
        <article>
            <h3><a href="#">First Article Title</a></h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. </p>
        </article>

        <article>
            <h3><a href="#">Second Article Title</a></h3>
            <p>Praesent libero. Sed cursus ante dapibus diam.</p>
            </article>
        </section>

        <aside>
            <h4>Connect With Us</h4>
            <ul>
                <li><a href="#">Twitter</a></li>
                <li><a href="#">Facebook</a></li>
            </ul>
        </aside>

        <footer>
            <p>All rights reserved.</p>
        </footer>
    </body>
</html>
```

html5新加入了很多关于文档结构的标签，这些标签并没有任何布局含义，相当于一个自带名字的div，也就是默认标签的意思。其主要作用就是html内容分组(group)。

下面是常用的这些标签含义，在实际使用中，应该尽量规范使用这些标签。

-   **header:** 一个网页总要有个头，推荐都使用这个标签。
-   **nav:** 一般是目录或者导航菜单。
-   **section:** 一般是本网页的主体信息部分或者主页面——类似于GUI的主要显示窗口。
-   **article:** section下面的某一独立内容部分。
-   **aside:** 和网页主体信息不太相关的其他信息。
-   **footer:** 一般是关于作者，版权或者其他比如脚注等信息。

这些都可以通过div来取代，在实际使用中如果上面的默认标签能够满足需求，那么就应该使用html5的这些默认标签。

上面的例子已经出现了一些标签，然后还有一些很常用的标签，下面承接上面所讲的继续补充说明一些常用html标签清单。

## 常用html标签清单

-   **ul:** 不编号列表，也叫无序列表（Unordered list）。里面的item用 **li** 标签封装。
-   **ol:** 编号列表，也叫有序列表（Ordered list）。里面的item用 **li** 标签封装。
-   **h1,h2,h3 ...** 标题标签，数字表示各个标题的层级。【这里强调一下，标题标签的含义是文档的结构，而不是文字的表现形式，不要因为h3之类的能让文字显得很大就用它，这是极不规范的。】
-   **p:** 段落标签。
-   **b:** 文字加粗
-   **i:** 文字斜体
-   **br** 换行
-   **hr** 水平线
-   **img** 加入图片，其中最常用的属性是 **src** ，指明具体图片引用地址。


### 建立一个链接

**a:** 引用链接标签，其中常用的属性是 `href` ，指明具体的引用地址，`title` 是悬浮的提示文字。

```
<a href="/where" title="go to where">show</a>
```

有的时候一个链接是用来下载文件的，你可以使用 `download`  属性来指定默认的保存文件名。

```
<a href="https://download.mozilla.org/?product=firefox-39.0-SSL&os=win&lang=en-US"
   download="firefox-39-installer.exe">
  Download Firefox 39 for Windows
</a>
```

如果连接有 `target="_blank" ` 属性，那么目标连接将会在浏览器新标签页打开。

创建一个电子邮箱链接：

```
<a href="mailto:nowhere@mozilla.org">Send email to nowhere</a>
```

- `//what` 指向互联网的链接，相当于省略了前面的https。
- `/what` 指向本站点的链接，加入本站点是localhost，则为 `localhost/what`
- `./what` 链接的相对位置路径。 

## 文字强调的html5规范

按照html5提出的规范，并不推荐用 `<b>` 标签作为文字的强调用途（我一般使用的文字加粗是那个词提醒读者这个词需要特别记忆）。其推荐的是 `<em>` 标签作为一级强调，然后 `<strong>` 标签作为更进一步的强调。在默认样式中，`<em>` 是斜体，然后`<strong>`是粗体。显然html5的意思是将表达文字的样式这样的标签`<b><i>`尽可能不用直到废弃，然后对于文字强调都推荐使用`<em>`和`<strong>`标签。其设计思路是html完全成为一个描述文档内容结构的标签系统，而不带有任何内容表现形式的东西。还是推荐按照html5规范来，少用`<b>`标签和`<i>`标签。请参看 [这个网页](http://stackoverflow.com/questions/271743/whats-the-difference-between-b-and-strong-i-and-em) 的讨论。



## 注释

```html
<!-- Make me into a comment. -->
```

## 有序列表里面带无序列表

就是把无序列表嵌套进去即可。

```html
<ol>
    <li>ol li1</li>
    <li>ol li2</li>
    <ul>
        <li>ul li1</li>
        <li>ul li2</li>
    </ul>
</ol>
```

## table

table表格有时也可用于布局，不过不推荐这种风格，因为html标签应该尽可能是文本结构层而非表现形式层。一个完整的table模板如下所示:

```html
<table>
<caption>表格的标题用caption标签</caption>
<thead>
<tr><th>标签</th><th>fullname</th><th>说明</th></tr>
</thead>
<tbody>
<tr><td>tr</td><td>table row</td><td>表格中的一行</td></tr>
<tr><td>th</td><td>table head</td><td>表格的列名</td></tr>
<tr><td>td</td><td>table data</td><td>表格具体要展示的数据</td></tr>
</tbody>
</table>
```

<table>
<caption>表格的标题用caption标签</caption>
<thead>
<tr><th>标签</th><th>fullname</th><th>说明</th></tr>
</thead>
<tbody>
<tr><td>tr</td><td>table row</td><td>表格中的一行</td></tr>
<tr><td>th</td><td>table head</td><td>表格的列名</td></tr>
<tr><td>td</td><td>table data</td><td>表格具体要展示的数据</td></tr>
</tbody>
</table>


大体在html上画表格就如上所示了，其他一些更漂亮的表格制作都是通过css来完成的，这里先略过了。

## div和span

div（division）在html标记语言中主要是区块的意思。我们知道html页面要显示的元素就好比一个个盒子逐步排布下来，而 `div` 可以看作一个这样自定义的盒子。html中有两种显示风格的盒子，一种是块状区块，比如p段落标签；还有一种是inline盒子，比如说em标签，其不会换行。

div标签更确切的表达是块状区块，可以看作其display属性是 `block` （但不一定，不过推荐接受这样的设定）；此外还有所谓的inline区块，用 `span` 标签来表示这样的元素，可以理解为改标签元素的display属性是 `inline` 。



## 表单
这里所谓的表单是指 `form` 标签加上其内包含的 `input` 等元素。这些input元素构成了我们熟知的文本输入框，下拉列表，单选框，复选框等等。

```
<form>

<input> </input>

</form>

```

具体表单元素的类型由input标签的 `type` 元素定义，下面分别详细说明之:

### 单行文本输入

单行文本输入用input标签，type类型为 `text` ，然后具体说明文字推荐用 `label` 标签。

```html
<form>
<label>name:</label>
<input type="text" name="yourname"></input>
</form>
```

然后input的 `name` 属性很重要，其值具体对应该文本输入的值的变量名（比如python就将其刷成 `form.yourname` 这样的引用）。

<form>
<label>name:</label>
<input type="text" name="yourname"></input>
</form>

### 多行文本输入

多行文本输入使用 `textarea` 标签生成的，现在先简单了解下即可。

```html
<textarea rows="5">
the textarea you say something
</textarea>
```

<textarea rows="5">
the textarea you say something
</textarea>

### 加上action

也就是表单form标签上加上action属性，然后表单内定义submit的按钮或者input元素，点击之后将会将数据发送给action那边去，具体方法由method属性定义，默认是GET。

```html
<form action="/where" method="POST">
  <input type="text">
  <button type="submit">submit</button>
</form>
```

### required

加上requird属性，该字段必须填上值。

```html
<input type="text" required>
```

### placeholder

预显示的文字

```html
<input type="text" placeholder="input your name" required>
```

### 按钮

html有好几种方法创建一个按钮，w3school不推荐button标签，而是推荐使用如下所示的input标签的形式:
```html
<form action="https://www.google.com" method="get">
<input type="submit" value="click to google"></input>
</form>
```

<form action="https://www.google.com" method="get">
<input type="submit" value="click to google"></input>
</form>

其 `value` 属性定义了具体按钮上显示的文字。然后具体跳转行为用form标签的 `action` 属性来定义，你还可以定义 `method` 属性来具体定义HTTP的method，比如下面是一个表单提交的例子:

```html
<form action="http://httpbin.org/post" method="post">
<label>name:</label>
<input type="text" name="name" />
<label>password:</label>
<input type="password" name="password" />
<input type="submit" value="提交" />
</form>
```

<form action="http://httpbin.org/post" method="post">
<label>name:</label>
<input type="text" name="name" />
<label>password:</label>
<input type="password" name="password" />
<input type="submit" value="提交" />
</form>

然后我们注意到上面还出现了一个新的type类型 `password` ，其类似单行文本输入，不同的是你是在输入密码，所以不会在屏幕上显示出来。



#### 重置按钮

```
   <input type="reset" value="重置"  />
```

这个按钮将会将表单所有内容清空。



#### 单选按钮

```html
<form action="http://httpbin.org/get" method="get">
<label>Male</label>
<input type="radio" name="Sex" value="Male" checked="checked" />
<label>Female</label>
<input type="radio" name="Sex" value="Female" />
<input type ="submit" value ="提交">
</form>
```

<form action="http://httpbin.org/get" method="get">
<label>Male</label>
<input type="radio" name="Sex" value="Male" checked="checked" />
<label>Female</label>
<input type="radio" name="Sex" value="Female" />
<input type ="submit" value ="提交">
</form>

上面新出现的 `checked` ，默认单选按钮和下面的复选按钮是没有选中的，而设置成为 "checked" 则默认为选中了。

#### 复选按钮

```html
<form action="http://httpbin.org/get" method="get">
<p>你喜欢吃的水果:</p>
<label>apple</label><input type="checkbox" name="fruits" value="apple"/>
<label>banana</label><input type="checkbox" name="fruits" value="banana" />
<label>pear</label><input type="checkbox" name="fruits" value="pear" />
<input type="submit" value="提交" />
</form>


```

<form action="http://httpbin.org/get" method="get">
<p>你喜欢吃的水果:</p>
<label>apple</label><input type="checkbox" name="fruits" value="apple"/>
<label>banana</label><input type="checkbox" name="fruits" value="banana" />
<label>pear</label><input type="checkbox" name="fruits" value="pear" />
<input type="submit" value="提交" />
</form>



### label标签

标签用户说明输入框的一些内容，但还有一个用途，改进鼠标用户的可用性，如果用户点击标签，那么将会聚焦到目标表单对象上，只需要我们如下设置：

```
<label for="控件id名称">
<input id="控件id名称"
```



### html代码规范

本文参考了 [这篇文章](http://codeguide.bootcss.com) 和 [这篇文章](http://alloyteam.github.io/CodeGuide/)  。

需要指出的是这些都是一些代码建议，其中有一些有点大头开蛋还是小头开蛋的意思，比如到底是空四个空格还是两个空格，这些有分歧的我就不写出来了，读者自行决定吧。



#### 总的原则

1.  无论团队人数多少，代码应该看起来就好像一个人写的。——这个原则为大家所公认。
2.  文件名推荐是小写字母加中划线或者下划线。【空格是绝对不推荐的，MDN的[这篇文章](https://developer.mozilla.org/zh-CN/docs/Learn/Getting_started_with_the_web/Dealing_with_files) 推荐用中划线不太推荐下划线，给出的理由是兼顾谷歌搜索引擎分词，这个理由并不是放诸四海皆准而且也很牵强。文件名里面带空格不推荐是因为不管是浏览器还是操作系统还是各个编程语言等等容易出问题的地方太多了，实在不推荐。】



#### html

1.  缩进，这个一个好的编辑器会提供这个自动缩进功能的。
2.  属性名全部小写，用 `-` 隔开。
3.  属性的定义用 **双引号** 包围起来。
4.  `<hr>` `<img src=...>` 这样的不用后面加个 `/` 了【有的地方加了也不算什么大问题，不推荐加是因为加了也没必要。】。
5.  关闭标签不要省略 `<li>...</li>`  这是没有疑问的。
6.  开头格式都是： `<!DOCTYPE html>` 
7.  语言指定遵循规范 ，`<html lang="zh">` 【语言代码推荐参看 [这个网页](https://www.iana.org/assignments/language-subtag-registry/language-subtag-registry)。】
8.  字符编码推荐指定utf8，`<meta charset="utf-8">` 
9.  IE兼容模式，推荐加上这样一行：

```html
<meta http-equiv="X-UA-Compatible" content="IE=Edge">
```

10.  引用css和javascript，如下所示（不要再像以前加上一些杂七杂八的东西，尽可能保持代码简洁。）：

```html
    <!-- External CSS -->
    <link rel="stylesheet" href="code_guide.css">

    <!-- In-document CSS -->
    <style>
    ...
    </style>

    <!-- External JS -->
    <script src="code_guide.js"></script>

    <!-- In-document JS -->
    <script>
    ...
    </script>
```

11.  属性的顺序：
    1.  class
    2.  id name
    3.  data-*
    4.  src for type href value
    5.  title alt 
    6.  role aria-*
    

12.  布尔属性，html规范原文就是：

>   The values "true" and "false" are not allowed on boolean attributes. To represent a false value, the attribute has to be omitted altogether.
>
>   布尔属性存在就表示true，不存在就取值false。


```html
<input type="text" disabled>

<input type="checkbox" value="1" checked>

<select>
<option value="1" selected>1</option>
</select>
```

13. 代码简洁简洁，尽可能减少标签数量。






