Slug: lxml-module
Tags:  python, 



## 前言

本来之前是将lxml模块归于爬虫那块的，但现在是算作python第三方好伙伴，一个通用模块了。当然lxml模块目前应该主要应用领域还是在爬虫那块，然后就作为实际功能是类似于beautifulsoup专注于xml或者html等结构文档的分析工作。但如下的讨论，我也看到了lxml模块更加通用的应用的可能性。





你就会发现xpath语句才是正确的从xml或html中抽取信息的标准流程化语言，而即使是功能还算强大的css selector选择器，其实也不过是xpath语句的精简版。这样lxml模块开始受到我的重视了，因为lxml对xpath语句有着很好的支持。

```python
from lxml import etree
selector = etree.HTML(html)
html_e = selector.xpath('//title')
```

此外lxml还可以很方便的去构建一个xml或者lxml文本：

```python
from lxml import etree

root = etree.Element('root')
child_1 = etree.SubElement(root, 'child_1')
child_1.set('a', '1')
child_1.text = 'this is a text'
child_2 = etree.SubElement(root, 'child_2')
print(etree.tostring(root, pretty_print=True))
```

实际上xml几乎是可以表达任何结构信息的，从简单的html到复杂的语法树。而基于xpath我们可以实现对于非常复杂的结构信息的精准信息搜索定位等操作。

关于xml谁是element谁是属性并没有特别的标准了，很可能实际上完全是两个相同的结构信息会有不同的xml结构表达，这方面各个具体实现领域有不同的考量，但在实践上还是有很多参考指导建议的，这个感兴趣的可以看下[这个网页](https://www.ibm.com/developerworks/library/x-eleatt/) 。

lxml类似于beautifulsoup也提供了find和find_all方法，但还是推荐读者使用xpath方法，实际上据说lxml里面的find和find_all方法也是基于lxml的xpath方法的，推荐读者多多使用xpath方法，熟悉xpath语法。

xpath方法一般会返回一个列表，不过如果你xpath语句使用 `string` 包装了的话，就会返回一个字符串，这个要注意下。

关于具体的使用下面有时间慢慢写上一些。



## 如何按照xpath删除元素

参考了 [这个网页](https://stackoverflow.com/questions/7981840/how-to-remove-an-element-in-lxml) 。

```python
def remove_tag_by_xpath(tree, xpath):
    for bad in tree.xpath(xpath):
        bad.getparent().remove(bad)
    return tree
```



## xpath简明教程

下面主要通过各个例子简要介绍xpath语法之，参考了 [阮一峰的这篇文章](http://www.ruanyifeng.com/blog/2009/07/xpath_path_expressions.html) 和菜鸟教程的xpath教程。

**[xpath参考手册提供了更多的使用样例](https://devhints.io/xpath)**



基本东西简单了解下即可，然后多看例子吧。

```
/what   基本路径表达，下个节点
//what  基本路径表达，任意位置的下个节点
```

这里 `/` 表示在下个节点中匹配， `//` 下个或所有子节点匹配。 

```text
//div[@id='what']   根据id定位
//div[@id='what']/a[1] 根据id定位后找下面的第一个a标签
//div[@id='what']/a[*] 根据id定位后找下面的所有a标签
```

这里 `*` 表示所有的意思。

```text
//div[@name]   找具有name属性的div标签

//div[@name='what'] 找name属性等于what的div标签 

//*[contains(@class,'what')] 找某个标签class属性有 what NOTICE: 这里的意思是有，多个class属性也是可以匹配的 class="what what_what"
//div[@class='what'] 那个目标标签的class属性就是what，也就是匹配的是 class="what"

//*[@id="list"]//dd[*]/a[@href and @title] 找id=list的标签下面的所有dd标签下面的a标签，a标签必须有href和title属性。
```



```text
//title[@*]  选择title，随意属性，但title标签必须有属性
```



### 选择title

```text
//title
```

这是选择到了文档中任意位置的 title 标签， `/` 开头的话会选择根节点，这不太好用。

### 选择title包含的文本

```text
//title/text()
```

### 按照id选择

```text
//div[@id='post-date']/text()
```

上面例子的意思是选择一个div标签，其有id属性 `post-date` ，如果div改为 `*` 则为随便什么标签名字。

### 继续往下选

```text
//*[@id='js_profile_qrcode']/div/p[1]/span/text()
```

### 选择目标标签的属性

```text
////*[@id='js_profile_qrcode']//a/@href
```



### string

对于选择的节点（注意如果返回的是节点集 nodeset将只取第一个），将所有的节点（也就是包括子节点）的文本抽取出来并合并。

```text
string(//div[@class="lemma-summary"])
```

如果你想提取本element节点下所有的问题：

```text
e.xpath('string(.)')
```

这里 `.` 的意思是选取当前节点，而 `..` 是选取当前节点的父节点。

