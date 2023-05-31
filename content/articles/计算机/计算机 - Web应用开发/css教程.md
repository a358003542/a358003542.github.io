Slug: css-tutorial
Date: 20191018

[TOC]

## 两种css设置方式

### 最直接的inline css

css属性可以通过inline css模式直接在html标签中通过 **style** 属性来加上。

```html
<p style="font-size:12pt">paragraph</p>
```

### 引入外部css文件

有一种说法，是将放在html `<head>` 标签里面的css和具体外部的css文件引用区分开来，在我看来区别不大吧。然后网络上还有一种说法认为html `<head>` 标签里面应该多用id的css定义，而外部css文件应该只用class定义好做到普适性，在我看来也有点削足适履了。

在具体使用的时候一个总的原则是一般推荐使用class，只有觉得某些元素需要个别处理的时候才用id属性控制。

放在`<head>` 标签里面的css大致如下格式引入进来:

```html
<style>
这里的格式和外部css文件格式完全一致
</style>
```

引入外部文件css如下:

```html
<link rel="stylesheet"  href="main.css" >
```

然后在外部css文件里面你还可以如下进一步引用其他的css文件【参考了 [这个网页](http://stackoverflow.com/questions/147500/is-it-possible-to-include-one-css-file-in-another) 。】:

```css
@import url("http://getbootstrap.com/dist/css/bootstrap.min.css");
```

## css基本写法

前面谈到的inline css因为肯定是作用于本标签，所以写法就简化了，style引入之后后面加入一些属性即可。然后前面谈到的外部css，其写法都是如下所示:

```css
p{
text-indent:2em; /*段落缩进*/
line-height:180%; /*行间距*/
}
```

第一个元素我们可以简单称之为css选择器，在网络抓取中也有类似的概念。然后花括号里面就是类似inline css 一样的格式了，用分号隔开，换行不换行都是无所谓的，具体为了美观一般都一个属性占一行吧。

## css选择器

这里以html5为例，html5内置的标签都是可以直接引用的，比如body，article，video，table，figure等等。如果你在css中引用section，那么意思就是整个文档的section标签那些元素被选中了。

我们知道html5中可以通过 **class** 属性来将某个元素归于某一类，现在假设有:

```html
<p class="emph">hello</p>
```

那么我们使用 `p.emph` 其意思就是将选中p标签然后class属性为emph的那些标签。

我们在css中经常看到这样的形式：

```html
.hightlight
```

其完整形式为 `*.hightlight` ，也就是所有class属性为hightlight的元素都将被选中。

然后id属性可用来定义某个标签的唯一id，一般就用 `#idname` 选中那个标签即可。

### 子选择器

  `h1 > strong` ，其只严格选择h1标签下遇到的**第一个**strong标签，这里的下是严格意义上的父子标签包含关系的下，如果某个strong标签在em标签里面，然后这个em标签在h1标签里面，则该strong元素是不会被这里所谓的严格逐级选择选中的。

### 后代选择器

 `figure p` 其选择的就是所有figure标签元素里面的 **所有** p标签元素。前面谈及的那些标签元素表示方法你都可以用的，比如 `#footer .emph` 选择的就是id为footer的那个标签里面class属性为emph的标签。

更多css选择信息请参看w3school的 [css元素选择详解部分](http://www.w3school.com.cn/css/css_selector_type.asp) ，但这一块最好不要弄得太复杂。实际上这样的选择逻辑弄得越复杂后面css代码的维护就越困难，最好的实践还是用 **class** 和 **id** 来管理各个css属性。

### 带上其他属性选择

有href属性的a标签才应用样式:

```
a[href] {color:red;}
```

有href属性和title属性的a标签才应用样式:

```
a[href][title] {color:red;}
```

具体属性是什么值也指定了:

```
a[href="http://www.w3school.com.cn/about_us.asp"] {color: red;}
```

### 伪类选定

带个:冒号后面跟着该标签的伪类，主要是值该标签的某种特殊状态，最常见的是a标签的各个状态，如下所示:

```
a:link {color: #FF0000} /* 未访问的链接 */
a:visited {color: #00FF00} /* 已访问的链接 */
a:hover {color: #FF00FF} /* 鼠标移动到链接上 */
a:active {color: #0000FF} /* 选定的链接 */
```

#### first-child伪类

```
p:first-child {
color: red;
}
```

只有是父标签的第一个子标签元素才会被选定。

#### nth-child伪类

```
p:nth-child(2) {
color: red;
}
```

是父标签的第几个子标签元素才会被选定。

### css选择权值

如果某个标签被多个css语句选定，那么具体权值如下：

```
标签权值为1 子选择器和后代选择器两个标签的1+1=2 类选择器权值为10 id选择器权值为100
```

### css样式层叠优先级

内联样式 > 嵌入样式 > 外部样式

### !important 用法

css设置有时不可避免会发生样式重叠覆盖，当然一般是尽可能统一css设置，但有时嫌麻烦懒得弄了，你可以用 `!important` 来手工提高某个css设置的优先级(参考了 [这个网页](http://www.cnblogs.com/qieqing/articles/1224085.html) 。)。如下所示：

```css
table, th, td
{
margin:0 auto;
min-width:2em;
text-align:center !important ;
padding: 5px;
}
```

上面严格控制表格各项都居中对齐。

## css的长度单位

css有很多长度单位，这些单位如果你熟悉 $\LaTeX$ 的话你就会对这些单位很眼熟。其中绝对长度单位有：1in = 2.54cm = 25.4mm = 72pt = 6pc ，这些并不推荐使用。[这篇网页](http://www.w3.org/Style/Examples/007/units.en.html) 推荐多使用 `px` ， `em` 和 `%` 这样的长度单位。其中`px`和`%`是css特有的，其会根据显示屏而变动，然后1em我们知道就是当前字体M的宽度（TeX里面的情况）。其中px值得引起我们的注意，其会根据显示设备而有很好的调整，更多信息请参看上面提到的那个参考网页。

## css的盒子模型

html的显示布局和 $\TeX$ 的显示布局一样也是采用的浮动盒子模型，从上到下，从左到右，一个个盒子排下来，只是 $\TeX$ 更复杂，还有一个分页算法。简言之就是每一个标签元素都是一个盒子(我还不太确定一个个字是不是一个盒子，在 $\TeX$ 里面一个个字都是一个盒子。) 。

下面这个图片来自 [这个网页](http://www.hicksdesign.co.uk/boxmodel/) 。

![img]({static}/images/前端开发/html_box_model.png "html_box_model")

[这篇文章](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Box_Model/Introduction_to_the_CSS_box_model) 讲解得很好，下面简要介绍之，下面放在短代码环境的都是可以用作css属性的。盒子最中心的是content区域，如果该盒子的 `box-sizing` 是默认值的话，那么 `width` 控制的就是content区域的宽度。如果将 `box-sizing` 设置为 `border-box` ，那么 `width` 对应的就是整个盒子的宽度。这个只是一点简单的数学加减法把戏罢了，没什么大不了的。

然后类似的 `height` 默认是控制content区域的高度，然后有 `min-width` , `min-height` 来控制盒子content区域的最小宽度和最小高度，然后有 `max-width` , `max-height` 来控制盒子content区域的最大宽度和最大高度，类似的这几个属性如果 `box-sizing` 设置为 `border-box` ，那么对应的都是整个盒子的宽度或高度。

content区域外围是padding区域，padding区域是透明的，如果整个盒子设置 `background-color` 或 `backgroud-image` ，这是你会看到他们。padding区域有如下属性来控制上面下面左边右边的长度: `padding-top` , `padding-bottom` , `padding-left` , `padding-right` 。 还有一个简便的写法 `padding` ，这种写法设置一个值控制上面四个量还是很方便的，但其还可以接多个值，有一定顺序，不太喜欢这种用法。

padding区域外面是border区域，通常我们在网页中看到的一条条边框线就是它了， 用 `border-width` 来控制边框线的宽度。这实际上是一个简写，类似上面的 `padding` ，可以跟四个值:

上，右，下，左:

```
border-width: 1px 2em 0 4rem;
```

或者三个值:

上，右和左，下:

```
border-width: 1px 2em 1.5cm;
```

或者两个值:

上下，左右:

```
border-width: 2px 1.5em;
```

此外还有: `border-top-width` 对应上宽度， `border-bottom-width` 等。

border区域外面就是margin边距区域。其有如下属性，含义大家一看应该就明白了: `margin-top` , `margin-bottom` , `margin-left` , `margin-right` , `margin` 。

### border属性

border属性可以跟上三个值，分别是: border-width border-style border-color

```
img {
border: 1px solid #4682b4
}
```

border-style情况比较多，常见的有 **solid** 实线 **dashed** 虚线 **double** 双线 **dotted** 点线等，更多请参看 [这个网页](http://www.w3school.com.cn/cssref/pr_border-style.asp) 。

## 字体配置

### font-size

字体大小

```html
<p style="font-size:12pt">paragraph</p>
```

### color

字体颜色， 这是css支持的 [color关键词清单](http://www.w3.org/TR/css3-color/#svg-color) 。

```html
<h2 style="color:green">paragraph</h2>
```

### font-family

字族， 这是css一般支持的 [字族信息](http://www.w3.org/TR/CSS21/fonts.html#generic-font-families) 。

```html
<ol>
    <li style="font-family:Arial">Arial</li>
</ol>
```

一般有文字的标签都可以用上面的三个属性来控制其内文字的大小，颜色和字族。虽然现在都推荐用css来控制，但思路顺序应该是优先inline css，太过普遍多次出现的情况下才考虑单独css控制。

## 布局盒子的背景颜色

如果读者熟悉LaTeX排版系统的，那么我们都清楚LaTeX排版很核心的一个概念就是盒子。在html这里，我们也可以把一个个标签看作一个个排版用的盒子。然后这里的background-color就是控制这一个盒子的背景颜色。

```html
<body style="background-color:yellow">
</body>
```

## 文字对齐方式

文字在标签盒子里的对齐方式。可选参数有: left, right, center。

```html
<h3 style="text-align:center">居中对齐的标题</h3>
```

## 设置背景图片

```
background-image:url("https://theurl/tothe/image.jpg");
```

### 设置背景图片位置

设置背景图片位置，可能的值有top，center，right，left，top，bottom等，如下所示:

```
top left
top center
top right
center left
center center
center right
bottom left
bottom center
bottom right
```

如果只给出一个值，则第二个值是默认值center。

```
background-position: center center;
```

### 设置背景图片是否重复

默认是repeat，如下设置为 `no-repeat` ，则背景图片不会重复以铺满整个背景了。

    background-repeat: no-repeat;

### 设置背景图片不随页面滚动

    background-attachment:fixed;

### 设置背景图片尺寸

如下设置为 `cover` ，则背景图片会拉伸到足够大，以覆盖整个区域，图片某些部位可能不会显示在背景中。

    background-size: cover;

如果设置为 `contain` ，则背景图片会拉伸至最大长度或最大宽度不超过背景为止。

此外还可以如下指定宽高比，下面是宽100px，高150px: 

    background-size:100px 150px;

## 控制文本大小写

如下所示，依次为: 大写，首字母大写，小写。

```
h1 {text-transform:uppercase}
h2 {text-transform:capitalize}
p {text-transform:lowercase}
```

## 边框画一个圆

这样边框就成为一个圆了。

```
<div style="border:1pt solid blue;border-radius:50%;width:100px;height:100px;margin:auto;"></div>
```

<div style="border:1pt solid blue;border-radius:50%;width:100px;height:100px;margin:auto;"></div>
## z-index属性

css中某个标签盒子设置z-index属性，将影响这些标签盒子的堆叠顺序。比如说如下将header标签的 `z-index` 属性设置为1，而其他的都不设置，则保证header网页头部分总是第一个先堆放。:

```
header{
z-index:1;
}
```

## 响应式布局

提示：现在推荐使用bootstrap来进行响应式设计，下面的内容有助于我们来理解bootstrap内部是如何实现响应式布局的。

请读者先阅读 [这篇文章](http://www.ruanyifeng.com/blog/2012/05/responsive_web_design.html) 。这篇刚开始 Ethan Marccote 给出的那个例子有个非常重要的信息，那就是设备的像素分级:

- 大于1300像素
- 600到1300像素
- 400到600像素
- 小于400像素

这个像素分级可以为后面我们要根据不同的设备进行css进行设置提供了参考。

然后一般网页都要加上这一行:

```
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

意思是网页默认宽度为设备宽度，原始缩放比为1。

然后就是各个元素宽度最好不要有 `width: xxx px` 这样写死了的css设置，而是 `%` 或者 `auto` 。字体的大小也都推荐使用 `em` 这样的相对大小。

h1 默认大小是 1.5em 。

```
h1 {
  font-size: 1.5em;
}
```

small 默认是 0.875em 。

```
small {
  font-size: 0.875em;
}
```

流动式布局，各个区块的位置都是浮动的，有些情况下会需要使用 `position: absolute` ，这会带来很多麻烦，尽量少用。

根据屏幕响应式多个css配置适应: 【因为css有很多通用配置是多设备皆适用的，下面这些根据屏幕响应的css应该放在css文件的最后面。】

参看 [这篇文章](http://learn.shayhowe.com/advanced-html-css/responsive-web-design/) ，其提到了现在流行的 mobile-first 设计思路，也就是有限照顾手机小屏幕设备的设计流程。先写好通用css配置，然后css文件最后面如下设置这些屏幕响应css设置。从最小的屏幕照顾起:

```css
@media screen and (min-width: 400px) {}
@media screen and (min-width:600px){}
@media screen and (min-width:1000px){}
@media screen and (min-width:1400px){}
```

这里 min-width 是指设备宽度至少要大于那个值，此外还有 max-width 是指设置宽度要小于那个值。上面的例子，假设设备750px，那么第一个第二个配置都满足，但因为css覆盖配置，后面如果你定制了那么将生效后面的，这就是先调手机端的mobile-first思路。

图片的自适应，如下设置最大宽度。

```
img { max-width: 100%;}
```

## css布局

这个网站专门介绍 [css布局](http://zh.learnlayout.com/) ，深入浅出讲的还是很好的，css布局是css里面很重要的课题，建立认真学习一下。

### display属性

#### block

块级元素，占满自身右边所有行的行空间。 div元素和p默认就是所谓的block元素，display属性为 **block** 。

```css
display:block;
```

#### inline

span元素默认是 **inline** 。

```css
display:inline;
```

就占据我需要的宽度，其他盒子元素可以继续填满这一行。

比如:

```css
li{
    display:inline;
}
```

这样你的无序列表和有序列表的各个item不会另起一行了。其默认的是 `display:list-item;` 。

#### inline-block

inline-block的意思是块级元素还是块级元素，只是几个块级元素对外排布是 inline 模式排布的，这是css较新的一个特性。如果对块状元素设置display属性为 **inline** ，则这些块状元素都会失去自己内部的尺寸布局，这可能不是你想要的。

#### none

```css
display:none
```

该元素不会显示。和 `visibility:hidden` 的区别是其本该显示的空间不会保留了。

### float属性

元素居右放置

```
float:right;
```

### clear属性

两侧都不能出现浮动元素

```
clear:both;
```

### position属性

css布局控制中，positon是一个很关键的属性。参考了 [这个网页](http://zh.learnlayout.com/position.html) 和 [这个网页](http://www.cnblogs.com/polk6/p/3214847.html) 。position属性有如下四个值可以设置:

#### static

static是默认值，没有什么其他额外的位置调整行为，表示它不会被"positioned"。

#### relative

relative和static类似，除非你还有其他的属性设置。比如 `top` , `right` , `bottom` , `left` 这些属性来调整，具体相对的含义是相对于原本它应该在的地方。相对调整之后留下来的地方会被保留下来，没有后续处理动作了。

#### fixed

fixed的应用就是将某个元素总是显示在页面上，比如说某些弹窗广告。 `top` , `right` , `bottom` , `left` 这些属性可以辅助来调整这个弹窗具体的位置。

#### absolute

absolute类似于fixed，不过其不是相对于视窗固定，而是相对于页面固定。比如下面这个aside设置:

```html
aside {
margin-left: -200px;
width: 181px;
position: absolute;
background-color:#FDF6E3;
}
```

这个aside是个目录，就放在正文的左边的，如果不用absolute布局的话，右边空间就不会释放出来。请参看 [这个网页的那个nav标签元素](http://zh.learnlayout.com/position-example.html) 。