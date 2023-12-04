Slug: css
Date: 20231204
Modified: 20231204


## css文件里面引用其他css
你可以如下进一步引用其他的css文件，参考了 [这个网页](http://stackoverflow.com/questions/147500/is-it-possible-to-include-one-css-file-in-another) :

```css
@import url("http://getbootstrap.com/dist/css/bootstrap.min.css");
```


## 背景图片
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

## border属性

border属性可以跟上三个值，分别是: border-width border-style border-color

```
img {
border: 1px solid #4682b4
}
```

border-style情况比较多，常见的有 **solid** 实线 **dashed** 虚线 **double** 双线 **dotted** 点线等，更多请参看 [这个网页](http://www.w3school.com.cn/cssref/pr_border-style.asp) 。

## 控制文本大小写

如下所示，依次为: 大写，首字母大写，小写。

```
h1 {text-transform:uppercase}
h2 {text-transform:capitalize}
p {text-transform:lowercase}
```

## linear-gradient函数
可以和background配合来制造一种渐变的颜色图像。

```
  background: linear-gradient(#55680D, #71F53E, #116C31);
```

## 给盒子增加阴影效果
可以通过 `box-shadow` 设置来给本盒子增加阴影效果。

该属性可设置的值包括阴影的 X 轴偏移量、Y 轴偏移量、模糊半径、扩散半径和颜色。