Slug: css-core-tutorial
Date: 20191018
Modified: 20231017


[TOC]

## 前言
本文在 [html5核心教程]({filename}./html5核心教程.md) 的讨论的基础上，继续讨论css。

css基本写法如下所示：

```css
p{
  text-indent:2em; /*段落缩进*/
  line-height:180%; /*行间距*/
}
```

第一个元素是css选择器。然后花括号里面就是具体的属性设置，用分号隔开，具体为了美观一般都一个属性占一行吧。

css文件里面的注释如上所示用 `/*...*/` 。

css知识多而杂，目前看来css选择器，css盒子模型，css布局这几个知识点是属于核心知识点，然后一些特别常用的属性设置可以列在本文，其他没有特别理由不应该写在核心教程这里了。


## css选择器
### 基本选择知识
#### 基于html5标签的选择
html5内置的标签都是可以直接引用的，比如body，article，video，table，figure等等。如果你在css中引用section，那么意思就是整个文档的section标签那些元素都被选中了。

#### 基于class名的选择
现在假设有:

```html
<p class="emph">hello</p>
```

那么我们使用 `.emph` 就会将所有class属性为emph的那些标签选中。

#### 基于id名的选择
比如：

```html
<ol>
<li id="hello">a</li>
<li>b</li>
</ol>
```
使用 `#hello` 就会选择有那个id名的那个标签。

#### 选择多个同时应用相同的属性
多个选择器用逗号隔开，这些选择器同时应用相同的属性。
```
h1, h2, p {
  text-align: center;
}
```
#### 后代选择器
`figure p` 其选择的就是所有figure标签元素里面的 **所有** p标签元素。
 
前面谈及的那些标签元素表示方法你都可以用的，比如 `#footer .emph` 选择的就是id为footer的那个标签里面class属性为emph的标签。

### 子选择器
`h1 > strong` ，其只严格选择h1标签下遇到的**第一个**strong标签，这里的 *下* 是严格意义上的父子标签包含关系的下，如果某个strong标签在em标签里面，然后这个em标签在h1标签里面，则该strong元素是不会被这里所谓的严格逐级选择选中的。


### 基于属性值的选择
有href属性的a标签才应用样式:

```
a[href] {
  color:red;
}
```

有href属性和title属性的a标签才应用样式:

```
a[href][title] {
  color:red;
}
```

具体属性是什么值也指定了:

```
a[href="http://www.w3school.com.cn/about_us.asp"] {
  color: red;
}
```

### 伪类选择
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
标签权值为1，子选择器和后代选择器两个标签的1+1=2，类选择器权值为10，id选择器权值为100。权值越大被该属性应用的优先级越高。
```

### css样式层叠优先级

内联样式 > 嵌入样式 > 外部样式

### !important 

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



## css的盒子模型
在讲css的各个属性之前，最好先对css的盒子模型有一个深入的了解，具体要理解很多属性，也要结合css的盒子模型来看。读者可以打开网页浏览器的开发者工具，在元素->样式的侧边栏那里就有一个你当前选中的标签元素的盒子模型展示。比如说设置背景图片是 `background-image` ，但这个背景图片具体是从那里到那里呢，根据观察就知道这个背景图片是不包含margin，也就是本盒子具体的尺寸所在。

其次理解好css的盒子模型也是学好css布局的前提，比如说 `display: inline` 的展示具体到css盒子这边就是本行一个盒子接着一个盒子的排，排不下了就换行。而`display: block` 则是本盒子要占据本行所有空间。

下面这个图片来自 [这个网页](http://www.hicksdesign.co.uk/boxmodel/) 。

![img]({static}/images/2019/html_box_model.png "html_box_model")

[这篇文章](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Box_Model/Introduction_to_the_CSS_box_model) 讲解得很好。

盒子最中心的是content区域，如果该盒子的 `box-sizing` 是默认值的话，那么 `width` 控制的就是content区域的宽度。现在大家一般都会这样设置：
```
* {
  box-sizing: border-box;
}
```
bootstrap这是这样设置的，将 `box-sizing` 设置为 `border-box` ，那么 `width` 对应的就是整个盒子的宽度，也就是本盒子的width宽度也包含本盒子的padding和border。类似的 `height` 是本盒子的高度，说本盒子的高度除了content的高度之外也包含盒子的padding和border部分。

下面讨论假定`box-sizing`都设置为`border-box`了，那么 `min-width` , `min-height` 和 `max-width` , `max-height` 也都有类似的概念，对应的都是本盒子的宽度或高度。

content区域外围是padding区域，padding区域是透明的，padding区域有如下属性来控制上面下面左边右边的长度: `padding-top` , `padding-bottom` , `padding-left` , `padding-right` 。 `padding` 还有一些简便写法如下所示：

```
/* 应用于所有边 */
padding: 1em;

/* 上边下边 | 左边右边 */
padding: 5% 10%;

/* 上边 | 左边右边 | 下边 */
padding: 1em 2em 2em;

/* 上边 | 右边 | 下边 | 左边 */
padding: 5px 1em 0 2em;
```

padding区域外面是border区域，通常我们在网页中看到的一条条边框线就是它了， 用 `border-width` 来控制边框线的宽度：

```
/* 当给定一个宽度时，该宽度作用于选定元素的所有边框 */
border-width: 5px;
/* 当给定两个宽度时，该宽度分别依次作用于选定元素的横边与纵边 */
border-width: 2px 1.5em;
/* 当给定三个宽度时，该宽度分别依次作用于选定元素的上横边、纵边、下横边 */
border-width: 1px 2em 1.5cm;
/* 当给定四个宽度时，该宽度分别依次作用于选定元素的上横边、右纵边、下横边、左纵边（即按顺时针依次作用） */
border-width: 1px 2em 0 4rem;
```


此外还有: `border-top-width` 对应上宽度， `border-bottom-width` 等。

border区域外面就是margin边距区域。其有如下属性，含义大家一看应该就明白了: `margin-top` , `margin-bottom` , `margin-left` , `margin-right` , `margin` 。

```
/* 应用于所有边 */
margin: 1em;

/* 上边下边 | 左边右边 */
margin: 5% auto;

/* 上边 | 左边右边 | 下边 */
margin: 1em auto 2em;

/* 上边 | 右边 | 下边 | 左边 */
margin: 2px 1em 0 auto;
```


## css布局
这个网站专门介绍 [css布局](http://zh.learnlayout.com/) ，深入浅出讲的还是很好的，css布局是css里面很重要的课题，建立认真学习一下。

### display属性
#### block

块级元素，占满自身右边所有行的行空间。 div元素和p默认就是所谓的block元素，也就是display属性默认为 **block** 。

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


## 常用的css设置
### 设置背景颜色
通过 `background-color` 来设置本盒子的背景颜色。

```html
<body style="background-color:yellow">
</body>
```

### 设置背景图片
通过 `background-image` 来设置本盒子的背景图片。
```
background-image:url("https://theurl/tothe/image.jpg");
```

### 设置字体字族
通过 `font-family` 来设置本盒子内容区内文字所使用的字体字族。

这是css一般支持的 [字族信息](http://www.w3.org/TR/CSS21/fonts.html#generic-font-families) 。


```html
<ol>
    <li style="font-family:Arial">Arial</li>
</ol>
```

可以通过逗号隔开来设置多个字体字族，后面的是fallback备选字体字族。

```
h1, h2 {
  font-family: Impact, serif;
}
```


### 设置字体大小
通过 `font-size` 来设置本盒子内容区内字体大小。


```html
<p style="font-size:12pt">paragraph</p>
```

### 设置文字对齐方式

文字在盒子里的对齐方式。可选参数有: left, right, center。

```html
<h3 style="text-align:center">居中对齐的标题</h3>
```

### 块状元素居中对齐
对于 `display:block` 的块状元素来说，其占据一整行，具体该元素在行中的位置，可以通过margin-left和margin-right来调整，如果想要居中，则如下设置：

```
  margin-left: auto;
  margin-right: auto;
```

### 设置字体颜色
通过 `color` 来设置本盒子内容区内字体颜色。

这是css支持的 [color关键词清单](http://www.w3.org/TR/css3-color/#svg-color) 。

```html
<h2 style="color:green">paragraph</h2>
```

当然你还可以rgb, rgba, hsl函数或者`#55680D` 这类写法来引入任意颜色，关于颜色的更多讨论详见css颜色一节。


## css颜色
### rgb函数
将颜色表达为red，green，blue三元色的组合，每个值可以是0-255。比如：

- red rgb(255,0,0)
- green rgb(0,255,0)
- blue rgb(0,0,255)
- white rgb(255,255,255)
- black rgb(0,0,0)

### rgba函数
在rgb函数的基础上增加alpha channel透明度参数，选值从0到1，0是完全透明，1是完全不透明。

### 颜色十六进制表示
颜色十六进制表示本质上仍然是rgb表示，只是将每个对应的参数0-255转换成了十六进制。

### hsl函数
h是基色，s是饱和度，l是亮度。比如： `hsl(186, 76%, 16%)` ，s和l的参数是0%到100%，而基色是该颜色在色环上的角度，0deg是红色，120deg是green，240deg是blue，那个deg度可以省略。



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


## 附录
### 长度单位

css有很多长度单位，这些单位如果你熟悉 $\LaTeX$ 的话你就会对这些单位很眼熟。其中绝对长度单位有：1in = 2.54cm = 25.4mm = 72pt = 6pc ，这些并不推荐使用。[这篇网页](http://www.w3.org/Style/Examples/007/units.en.html) 推荐多使用 `px` ， `em` 和 `%` 这样的长度单位。

- `px` 会随着显示设备不同而不同。

- 百分比%设置值是一个相对值，一般来说是相对于父元素的某个值。

- 1em是当前字体M的宽度，TeX里面的情况，css这边应该也是类似的。

### css代码规范
一个总的原则是一般推荐使用class，只有觉得某些元素需要个别处理的时候才用id属性控制。
