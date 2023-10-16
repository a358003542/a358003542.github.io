Slug: jquery
Date: 20191018

[TOC]

## jquery基本操作

### 基本用法

jquery的基本用法就是:

```js
$(selector).action()
```

 `$(selector)` 返回的是找到的对象的数组，而进行某个action的时候是对所有找到的对象都进行如此动作。

### 文档初始化之后执行的动作

```js
$(document).ready(function(){
   // jQuery methods go here...
});
```

此外我们还常见到一种简化的写法：

```
$(function(){});
```

### 选择元素

一般按照css语法选择元素并没什么好讲的，很是直观，简单看下即可。

#### 特殊符号的元素选择

目前我遇到的情况是 `fn:1` 这个按照jquery是选择不了的，实际上这个用document.querySelect也选择不了，里面有个非法符号`:` ，不过 `document.getElementById` 可以正常选择。

一定要使用jquery的话需要如下加上两个转义符号。

```
$('#fn\\:1')
```

#### 选择多个元素之后迭代

```
$('.footnote-ref').each(function(){

    // $(this)

}
```

在迭代过程里面的那个匿名函数里面调用 `$(this)` 就是目标元素。

### 当前节点选择子元素

```
$('sup',this)
```

第二个参数写上 `this` 就是在当前节点下继续选择某个子元素。

#### 选中父元素

```
$('#target1').parent().css('background-color','red');
```

即调用parent方法。

#### 选中子元素

```
$('#right-well').children().css('color','orange');
```

即调用children方法。

#### 选中元素的第几个

```
$('.target:nth-child(2)').addClass('animated bounce');
```

```
$('.target:even').addClass('animated shake');  # 选中元素的偶数个，0 2 4...
```

这个语法实际上来自css的选择语法。

### 获取文本和修改文本

```
$('div').text()  # 获取文本
$('div').text('new text') # 修改文本
```

此外还有 `html()` 方法，其可以写上html标签。

如果使用JavaScript原生的document.querySelect之类的方法，获取到的元素想要看文本可以调用 `textContent` 属性。

### 删除某个元素

```
$('sup',this).remove();
```

即调用remove方法。

### 修改元素的某个属性

```
$(this).attr('data-toggle','popover');
```

### 移除元素的某个属性

```
$(this).removeAttr('href');
```

### class属性修改

#### 添加class

```
div.addClass('highlight'); // 添加highlight这个class
```

#### 删除class

```
div.removeClass('highlight'); // 删除highlight这个class
```

#### 修改css

    $('div').css('background-color', '#ffd351');

### 获取表单value值或修改

```
$('input').val()  # 获取值
$('input').val('new value') # 修改值
```

### 让按钮变为不可选

prop方法设置或返回被选元素的属性。

```
$("button").prop('disabled', true)
```

### 事件绑定动作

```
$(selector).click(function)
```

#### 鼠标事件

- **click:** 鼠标单击时触发；
- **dblclick:** 鼠标双击时触发；
- **mouseenter:** 鼠标进入时触发；
- **mouseleave:** 鼠标移出时触发；
- **mousemove:** 鼠标在DOM内部移动时触发 （接受e ，e.pageX是鼠标x值，e.pageY是鼠标Y值）
- **hover:** 鼠标进入和退出时触发两个函数，相当于mouseenter加上mouseleave。

#### 键盘事件

键盘事件仅作用在当前焦点的DOM上，通常是 `<input>` 和 `<textarea>` 。

- **keydown:** 键盘按下时触发；
- **keyup:** 键盘松开时触发；
- **keypress:** 按一次键后触发。

#### 取消某个事件绑定

```
a.off('click', hello);
```

### 获取屏幕的宽度和高度

```js
var width = $(window).width()
var height = $(window).height()
```

这两个方法更确切的描述是返回所选元素的宽度或高度。此外还有 `innerWidth` 和 `innerHeight` 方法（包含内边距）， `outerWidth` 和 `outerHeight` 包含内边距和边框。

### hide方法

实际上就是css设置 `display:none` 。

```js
$('#test').hide()
```

这样将隐藏所有id为test的元素。

### jquery 动画效果

#### 面板展开和隐藏

```html
<script> 
$(document).ready(function(){
  $(".slidepanel").click(function(){
    $("#panel-one").slideToggle("slow");
  });
});
</script>

<div class="slidepanel" style="background-color:#efefef; padding:5px">滑动面板</div>
<div id="panel-one" style="border:solid 1px #efefef; padding:5px">just jquery it.</div>
```

<div class="slidepanel" style="background-color:#efefef; padding:5px">滑动面板</div>
<div id="panel-one" style="border:solid 1px #efefef; padding:5px">just jquery it.</div>
<script> 
$(document).ready(function(){
  $(".slidepanel").click(function(){
    $("#panel-one").slideToggle("slow");
  });
});
</script>

## ajax

jquery是基于 `XMLHttpRequest` 的，不得不承认jquery的ajax这块写得实在是太好了。

### get

```js
$("button").click(function(){
        $.get("/try/ajax/demo_test.php",function(data,status){
            alert("数据: " + data + "\n状态: " + status);
        });
```

回调函数接受两个参数，传回来的data和状态码。其等价于：

```js
$.ajax({
  url: url,
  data: data,
  success: callback,
  dataType: dataType
});
```

get请求上面的data将附加到url上。

### getJSON

等价于：

```
$.ajax({
  url: url,
  data: data,
  success: callback,
  dataType: json
});
```

注意dataType设置为json

### post

```js
jQuery.post(url,data,success(data, textStatus, jqXHR),dataType)
```

等价于：

```js
$.ajax({
  type: 'POST',
  url: url,
  data: data,
  success: callback,
  dataType: dataType
});
```

上面的data是发送请求发送给服务器的数据。dataType可选，会智能判断服务器响应的数据。

### 跨域问题

参看了 [js跨域](https://segmentfault.com/a/1190000006146207) 这篇文章， `XMLHttpRequest` 是不能跨域的。我们通常所说jsonp，就是一种实现跨域的解决方案，具体我不想太深究，因为一般restful api都是采用的json格式，而除了jsonp之外，服务端如下加上响应头也是可以的：

```
header('Access-Control-Allow-Origin:*');//允许跨域请求的域名，允许全部设为*
header('Access-Control-Allow-Methods:POST,GET');
```

## 其他

### 先网络加载jquery或者本地加载

这里代码的意思应该是先网络加载jquery，如果没有则本地找找看。

```
<script src="https://code.jquery.com/jquery-{{JQUERY_VERSION}}.min.js"></script>

<script>window.jQuery || document.write('<script src="js/vendor/jquery-{{JQUERY_VERSION}}.min.js"><\/script>')</script>
```
