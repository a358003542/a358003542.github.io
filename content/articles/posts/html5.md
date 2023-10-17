Slug: html5
Date: 20231017


[TOC]


## 图片带标题
示例如下：

```html
<figure>
  <img src="/media/cc0-images/elephant-660-480.jpg" alt="Elephant at sunset" />
  <figcaption>An elephant at sunset</figcaption>
</figure>
```

bootstrap官方文档 [这里](https://getbootstrap.com/docs/5.3/content/figures/) 有相关的讨论，有需要的可以看下。

## 单选组和多选组
一个单选组的例子如下：

```html
<form>
  <fieldset>
    <legend>Choose your favorite monster</legend>

    <input type="radio" id="kraken" name="monster" value="K" />
    <label for="kraken">Kraken</label><br />

    <input type="radio" id="sasquatch" name="monster" value="S" />
    <label for="sasquatch">Sasquatch</label><br />

    <input type="radio" id="mothman" name="monster" value="M" />
    <label for="mothman">Mothman</label>
  </fieldset>
</form>
```
fieldset标签将一个单选组包围起来，label的for对应的是input的id，从而用户点击label字符的时候就会选择对应的单选input框。

legend标签的文字说明了本单选组。

单选组里面的所有单选框的name值应该都是一样的，value是具体表单提交的时候给该name变量赋的值，比如假设上面勾选了第一个，那么表单提交的值是： `monster=K` 。

填写 `checked` 则该单选框默认勾选上。

多选组参考单选组，除了type改为`checkbox` 之外，多选组的各个name也是一样的，区别就是可以多选。

单选组和多选组的样式调整请参看bootstrap官方文档的 [这里](https://getbootstrap.com/docs/5.3/forms/checks-radios/) 。



