Slug: beautifulsoup-module
Tags: python,
Date: 20191018

[TOC]

## 简介

BeautifulSoup模块在python网页分析这一块是很有名的一个模块，其确实让网页分析任务变得轻松而easy了。本文将对bs4模块进行简单的介绍，更多细节请参看 [官方文档](http://www.crummy.com/software/BeautifulSoup/bs4/doc/) 。

### 安装

安装就简单用pip命令安装之:

    sudo pip install beautifulsoup

### 第一个例子

然后在使用上因为python2和python3的urllib相关改动很大，加上urllib在使用上不是很友好，强烈推荐大家直接用requests模块来进行相关操作。然后beautifulsoup的引入语句一般如下所示:

    from bs4 import BeautifulSoup

最简单的和requests的组合使用如下所示:

```python
import requests
from bs4 import BeautifulSoup
res = requests.get("http://www.pythonscraping.com/exercises/exercise1.html")
soup = BeautifulSoup(res.text)
print(soup.title)
```

在上面soup.title返回的是一个标签对象。然后标签对象里面如果有标签的话又可以继续点号索引标签:

    >>> soup.body.h1
    <h1>An Interesting Title</h1>

这时读者一定在想，文档里面相同的p标签有很多，soup会返回什么呢？

```python
import requests
from bs4 import BeautifulSoup
res = requests.get("http://www.crummy.com/software/BeautifulSoup/bs4/doc/")
soup = BeautifulSoup(res.text)
print(soup.p)
```

我们看到soup返回的是第一个p标签，这可以看作下面要讲的find方法的简化css索引形式。

## find方法

如下所示最简单的find定位实际上就类似于 `soup.p` 的用法。但find方法里面有更丰富的内容。

    >>> soup.find('p')
    <p><a class="reference external" href="http://www.crummy.com/software/BeautifulSoup/">Beautiful Soup</a> is a
    Python library for pulling data out of HTML and XML files. It works
    with your favorite parser to provide idiomatic ways of navigating,
    searching, and modifying the parse tree. It commonly saves programmers
    hours or days of work.</p>

find方法如果找不到就返回None，找到则返回目标标签元素。

    >>> soup.test is None
    True

### 过滤器

find方法最常用的形式是接受一个参数，这个参数叫做什么过滤器参数。过滤器可以是字符串或正则表达式或列表组成，其中列表里面的元素基于前面谈及的字符串或正则表达式，然后组成或逻辑，只要符合一个匹配条件就认为是匹配的。

第一个参量也就是name参量是针对tag的操作，通常简单的字符串就够用了，如果是正则表达式的话，则是 `re.compile("^b")` 这样的形式，然后其内是通过正则表达式的 **match** 方法来完成的（稍作测试，我觉得应该对应的re.search。）。

最后要额外一提的就是过滤器 `True` ，其会匹配任何值，比如说 `id=True` ，将会匹配所有有id属性的标签。

### class\_参量

你可以通过 `class_=` 来过滤标签的class属性，注意为了和python的class关键词区分，后面加上了一个下划线，同样是接受一个过滤器。

### id参量

你可以通过 `id=` 来具体定位网页中的某个id，也是接受一个过滤器。

### text参量

对网页各个标签内的字符串进行过滤操作，前面提及的过滤器一样都可以用，不过字符串是精确匹配的我估计用得会比较少。尽可能地用正则表达式。然后如果单独使用text参量

    soup.find_all(text=re.compile('name'))

标签里面的字符串也会被搜索，而且返回也不一定是标准的标签元素对象，这很不好。推荐采用如下形式:

    soup.find_all(True,text=re.compile('name'))

这样返回的必定是标签元素，而且text里面必定只搜索标签的text字符串内容，这更易于人们的理解。

然后搜索完之后你可能定位到的是某个小标签，比如 `<b>` 之类的，然后你可以对目标标签元素使用 `.parent` ，则将返回更高一级的标签元素，这有时会很有用的:

    soup.find_all(True,text=re.compile('name'))[-1].parent

### 其他keywords

其他标签的各个属性都可以类似上面的作为关键词加上过滤器来搜索。比如

    oup.find_all(href=re.compile("elsie"))

### recursive参量

recursive默认是True，也就是检索当前tag的所有子孙节点，如果只想搜索当前tag的第一级子节点，则使用 `recursive=False` 。

### limit参量

这个只对find\_all才有意义，确定返回几个元素。

## find\_all方法

find\_all和find方法API类似，除了find\_all返回的是一系列匹配的标签元素的列表。在这里顺便提一下，find方法和find\_all方法可以接受多个参数作为限定，这些限定条件可以看作逻辑与关系。

## 标签元素对象

具体标签元素的使用见下面例子:

    >>> import re
    >>> soup.find(True,text=re.compile("sister"))
    <span class="s">&lt;p class="story"&gt;Once upon a time there were three little sisters; and their names were</span>
    >>> thetag = soup.find(True,text=re.compile("sister"))
    >>> thetag.name
    'span'
    >>> thetag.text
    '<p class="story">Once upon a time there were three little sisters; and their names were'
    >>> thetag.string
    '<p class="story">Once upon a time there were three little sisters; and their names were'
    >>> type(thetag.string)
    <class 'bs4.element.NavigableString'>
    >>> type(thetag.text)
    <class 'str'>
    >>> thetag['class']
    ['s']

-   **name:** 标签对象的标签名字
-   **string:** 返回NavigableString对象，这里暂时先略过讨论。
-   **text:** 返回标签所包含的文本对象。
-   **get\_text():** 从最新的bs4文档来看，官方文档推荐tag获取其内文本内容都用 `get_text` 方法，而不要使用上面的 `thetag.text` 这种形式了。
-   **['class']:** 属性值索引，上面的"class"属性具体返回的是一个列表，叫做什么多值属性。

## 基于某个标签的附加查找

我们通过 `find` 或 `find_all` 能够找到某个或某些标签对象了，然后bs4还给标签对象加上了一些辅助查找方法，基于这个标签对象来进一步查找，从而返回其他某个或某些标签对象。

### 平行级别上下标签

这里所谓的平行级别上下标签是指如下面这个例子:

    <html>
        <body>
            <a>
                <b>text1</b>
                <c>text2</c>
            </a>
            <d>test3</d>
        </body>
    </html>

<b>标签和<c>标签就是一个html文档缩进深度，它们就属于一个层次的平行标签。而<a>和<d>也是属于平行标签，但<b>和<d>则不是。

#### 平行级别下标签

    find_next_sibling(name, attrs, string, **kwargs)

才外还有返回一些标签对象（对应find\_all方法）的方法:

    find_next_siblings(name, attrs, string, limit, **kwargs)

比如上面的例子我们有:

    >>> [ i for i in soup.a.next_siblings]
    ['\n', <d>test3</d>, '\n']
    >>> [ i for i in soup.b.next_siblings]
    ['\n', <c>text2</c>, '\n']
    >>>

这些方法的用法和前面谈及的 `find` 还有 `find_all` 类似，但多少有点令人沮丧的是，beautifulsoup受到换行符的干扰，在 [这篇网页](https://stackoverflow.com/questions/23241641/how-to-ignore-empty-lines-while-using-next-sibling-in-beautifulsoup4-in-python) 中提到预处理网页将换行符都换成空格，然后将标签之间的各个空格符号都删除的解决方案，虽然不是很完美，但作为解决也是可以接受的，因为网络抓取实际上进来的网页简化预处理是必须要做的一步工作。

#### 平行级别上标签

平行级别上标签类似上面的描述，不过是往上走，这里就不赘述了。

    find_previous_sibling(name, attrs, string, **kwargs)

此外还有返回一些标签对象（对应find\_all方法）的方法:

    find_previous_siblings(name, attrs, string, limit, **kwargs)

### 非平行级别上下标签

find\_parents(name, attrs, string, limit, \*\*kwargs)
find\_parent(name, attrs, string, \*\*kwargs)

find\_all\_next(name, attrs, string, limit, \*\*kwargs)
find\_next(name, attrs, string, \*\*kwargs)
find\_all\_previous(name, attrs, string, limit, \*\*kwargs)
find\_previous(name, attrs, string, \*\*kwargs)
.contents and .children

## select方法

select方法通过CSS选择器来进行标签元素的选择。原则上上面谈论的那些方法已经能够满足我们大部分的需求了，再加上专门针对某个个别网站的个别网页的css布局而进行抓取，这种抓取方法是很不灵活很有局限性的，所以select方法应该作为用户的最后备选方案。

### 移除某个标签

```
s = soup.find('sup')
s.extract()
```

## 标签的修改

### 直接修改本标签

你可以如下直接修改原标签，甚至原标签的tag名字等各个属性都可以修改：

```
tag.name = "blockquote"
tag['class'] = 'verybold'
tag['id'] = 1
```

### 新建一个标签

你可以使用 `new_tag` 方法来新建一个标签，然后附加到原标签上。

```
soup = BeautifulSoup("<b></b>")
original_tag = soup.b

new_tag = soup.new_tag("a", href="http://www.example.com")
original_tag.append(new_tag)
original_tag
# <b><a href="http://www.example.com"></a></b>
```



## 解析部分文档来提升效率

请看到下面这个函数，其用途是将整个webpage的所有a连接有href属性的链接收集起来。

```python
def get_webpage_links(html,baseurl):
    ''' 刷本网页 a标签 有 href 属性的所有 links
    绝对化路径 去除fragment 返回字典值去重
    '''
    soup = BeautifulSoup(html, 'lxml', parse_only=SoupStrainer('a'))
    links = [link.get('href') for link in soup.find_all('a',href=True)]
    links = [to_absolute_url(baseurl,link) for  link in links]
    links = [remove_url_fragment(link) for link in links]
    return set(links)
```

其中:

    soup = BeautifulSoup(html, 'lxml', parse_only=SoupStrainer('a'))

`parse_only` 参数用于控制BeautifulSoup一开始刷文档时创建标签元素对象的时候，就只刷某些标签而进行了过滤操作，从而大大节省了工作量。具体参数是创建一个 `SoupStrainer` 对象，其接受的过滤器语法和前面叙述的一样。
