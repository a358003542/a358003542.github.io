Slug: bootstrap-tutorial
Date: 20191018

[TOC]

## 安装bootstrap

本文是如下加载的：
```
<!-- 最新版本的 Bootstrap 核心 CSS 文件 -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">

<!-- 可选的 Bootstrap 主题文件（一般不用引入） -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">

<!-- 最新的 Bootstrap 核心 JavaScript 文件 -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
```


<!-- 最新版本的 Bootstrap 核心 CSS 文件 -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">

<!-- 可选的 Bootstrap 主题文件（一般不用引入） -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">

<!-- 最新的 Bootstrap 核心 JavaScript 文件 -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
## viewport元数据声明

为了确保适当的绘制和触屏缩放，需要加上如下viewport元数据声明:
```
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
```
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

## container类

通过container class的 `div` 来获得一个固定宽度的响应式容器。
```
<div class="container" style="background:#FFF0F5">
我在container类里面。
</div>
```
<div class="container" style="background:#FFF0F5">
我在container类里面。
</div>
## 栅格系统

栅格系统是bootstrap框架里面很有用的一个特性了，其基本思路如下:

1. 每一行 `row` 类都放在上面谈及的 `container` 类里面。
2. 然后在每一行row类里面（这里所谓的什么类实际上就是该类属性的div盒子）再添加行类。

具体行类有很多种，请参看 [这个网页](http://getbootstrap.com/examples/grid/) 和官方文档的 [这里](http://getbootstrap.com/css/#grid) 来具体设计之。

```html
<div class="container" style="background:#FFF0F5">
我在container类里面。
<div class="row" style="background-color:yellow">
<div class="col-md-8" style="background-color:red">
我在col-md-8盒子里面，黄色是row盒子。
</div>
<div class="col-md-4" style="background-color:blue">
我在col-md-4盒子里面，8+4=12，bootstrap最多12列。
</div>
</div>
</div>
```

<div class="container" style="background:#FFF0F5">
我在container类里面。
<div class="row" style="background-color:yellow">
<div class="col-md-8" style="background-color:red">
我在col-md-8盒子里面，黄色是row盒子。
</div>
<div class="col-md-4" style="background-color:blue">
我在col-md-4盒子里面，8+4=12，bootstrap最多12列。
</div>
</div>
</div>

## 其他常规css设置

其他常规css设置比如说h1-h6字体大小啊，等等其他常规标签的字体大小啊颜色啊代码背景的设置啊等等，这些都可以通过浏览器的开发者工具来查看具体的css代码设置，如果觉得默认设置不好则另外再弄个css文件重载也是可以的，这些就不多说了。


bootstrap提供了 `text-lowercase` , `text-uppercase` , `text-capitalize` class:
```
<p class="text-lowercase">HELLO world</p>
<p class="text-uppercase">hello world</p>
<p class="text-capitalize">hello world</p>
```

<p class="text-lowercase">HELLO world</p>
<p class="text-uppercase">hello world</p>
<p class="text-capitalize">hello world</p>
## 控制文本对齐方式
主要作用于p段落盒子的属性支持: <strong>text-left</strong> ,  <strong>text-center</strong> ,  <strong>text-right</strong> ,  <strong>text-justify</strong> , <strong>text-nowrap</strong> 。

具体这些css都很简单:
```
<pre class="pre-scrollable">
    .text-left {
  text-align: left;
}
.text-right {
  text-align: right;
}
.text-center {
  text-align: center;
}
.text-justify {
  text-align: justify;
}
.text-nowrap {
  white-space: nowrap;
}
</pre>
```





## lead盒子

后面都如此约定，所谓的 **lead盒子** 是指class属性为lead的div标签，即:
```html
<div class="lead" style="border:1px solid">
hi ，我在lead盒子里面，边框是额外加上去的。可以用来作为某个特别重要的话的强调。
</div>
```

<div class="lead" style="border:1px solid">
hi ，我在lead盒子里面，边框是额外加上去的。可以用来作为某个特别重要的话的强调。
</div>

## jumbotron盒子
bootstrap提供的jumbotron盒子一般在首页用于展示某个特别重要希望读者阅读的信息。

```html
<div class="jumbotron">
<p>大家好，我在jumbotron盒子里面。</p>
</div>
```

<div class="jumbotron">
<p>大家好，我在jumbotron盒子里面。</p>
</div>



## pull-left和pull-right

bootstrap用这个class属性来左对齐或右对齐某个标签元素。

## tabs的制作

利用bootstrap制作tabs，就是建立一个ul无序列表，然后class属性设置为 **nav nav-tabs** ，这样就制作了一个简单的tabs了。

```html
<ul class="nav nav-tabs">
<li class="active"><a href="#">Features</a></li>
<li><a href="#">Details</a></li>
</ul>
```

<ul class="nav nav-tabs">
<li class="active"><a href="#">Features</a></li>
<li><a href="#">Details</a></li>
</ul>

## pill形状tabs制作
```html
<ul class="nav nav-pills">
<li class="active"><a href="#">Features</a></li>
<li><a href="#">Details</a></li>
</ul>
```

<ul class="nav nav-pills">
<li class="active"><a href="#">Features</a></li>
<li><a href="#">Details</a></li>
</ul>

## list-inline

给ul或ol加上 <strong>list-inline</strong> 属性，来是li列表元素水平inline-block显示，如下所示:
<ul class="list-inline">
<li>第一个li</li>
<li>第二个li</li>
</ul>

## kbd标签

kbd标签用来显示按键组合: <kbd>Ctrl+X</kbd>



## 如何制作一个 `Bootstrap` 风格的带链接的按钮

bootstrap用默认的button来制作标签，如果你需要点击动作的还需要额外的onclick去定制，如果你需要的动作仅仅只是打开某个网页，那么使用a标签会更合适一些，只是我们还需要这个a标签看上去像一个按钮，这样会好看一些，参看 [这个网页](http://stackoverflow.com/questions/19981949/how-to-make-a-button-in-bootstrap-look-like-a-normal-link-in-nav-tabs) ，具体代码如下所示：

```
<a href="https://www.bing.com" target="_blank" role="button" class="btn btn-success btn-large">Click here!</a>
```
<a href="https://www.bing.com" target="_blank" role="button" class="btn btn-success btn-large">Click here!</a>

