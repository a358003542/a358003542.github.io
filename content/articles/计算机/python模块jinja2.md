Slug: python-module-jinja2
Date: 20230309


[TOC]

## Jinja2模板引擎

jinja2模板引擎在flask和pelican中都有使用，而且就是在django框架中，模版语法也大体类似，所以jinja2模板引擎还是很值得一学的。

jinja2模板引擎作为python的模块简单的使用如下所示：

```python
from jinja2 import Template
template = Template(template_content)
content = template.render(link_data=link_data)
```

这里的render函数就是将一些参数变量渲染进去，从而得到目标文本内容。

本文接下来的简要讨论下如何在flask或者pelican中编写模板文件，更详细的内容请参见 [官方文档模板设计者文档一章](http://docs.jinkan.org/docs/jinja2/templates.html) 。



### 注释

注释写法如下所示，之所以这个放在最前面是因为模板引擎里面注释有时很有用，但很不同于其他编程语言里面的注释写法。

```jinja2
{# this is a comment #}
```

### 变量
如下所示，里面包含某个变量，jinja2渲染模板的时候会解析这些变量。

```jinja2
{{ variable_name }}
```
然后 `object.a` 这样的dot法引用，或者 `object['a']` 这样的写法，甚至是调用实例的某个方法 `object.func()` 也是可以的，如果这个方法返回某个字符串的话。

有的时候我们需要debug一些变量一般是如上将这个变量值显示出来。

### if语句

条件分支主要用于有条件的显示某些内容。

```jinja2
{% if user %}
Hello, {{ user }}!
{% else %}
Hello , stranger!
{% endif %}
```

此外还有elif语句的支持：

```jinja2
{% if kenny.sick %}
    Kenny is sick.
{% elif kenny.dead %}
    You killed Kenny!  You bastard!!!
{% else %}
    Kenny looks okay --- so far
{% endif %}
```



### for语句

for语句结构如下所示:

```jinja2
<ul>
{% for user in users %}
  <li>{{ user.username }}</li>
{% endfor %}
</ul>
```

```jinja2
<dl>
{% for key, value in my_dict.iteritems() %}
    <dt>{{ key|e }}</dt>
    <dd>{{ value|e }}</dd>
{% endfor %}
</dl>
```

此外在本循环区块中你还可以使用这些特殊的变量：

- loop.index 循环记数，从1开始
- loop.index0 循环记数，从0开始
- loop.first 是否是第一次迭代
- loop.last 是否是最后一次迭代

还有一些这里就不赘述了，请参看官方文档For语句部分。



### 过滤器

变量可以进一步加上某个过滤器来进行进一步的处理。过滤器是有点类似于linux系统的管道作业风格，多个过滤器可以叠加，如： `{{ var | striptags | title }}` 。

下面列出一些过滤器的功能，更多过滤器参见官方文档的内置过滤器清单一小节。

- `safe` 渲染值不转义
- `capitalize` 值首字母大写 其他字母小写
- `lower` 字母都小写
- `upper` 字母都大写
- `title` 值每个单词首字母大写
- `trim`值首尾空格去除
- `striptags` 渲染之前把所有HTML标签去掉

关于safe过滤器请参看下面讨论的特殊符号的问题。

### html特殊符号问题

如果你的变量有这些html的特殊符号:

```
<  >  &  "
```

jinja2模板系统默认是不做处理的，比如：

```text
>>> from jinja2 import Template
>>> t = Template('test {{ x }}')
>>> t.render(x = '<h1>abc</h1>')
'test <h1>abc</h1>'
```

如上输出在html中是有html效果的，你可以使用 **escape** 过滤器来转义这些特殊符号:

```text
>>> t = Template('test {{ x|escape }}')
>>> t.render(x = '<h1>abc</h1>')
'test &lt;h1&gt;abc&lt;/h1&gt;'
```

转义之后的输出在html中只是单纯的显示 `< > ` 等等这些符号，并不具有html效果了。

**flask是设置为全局auto escape的**，这一般是满足人们的需求的。但是如果你确实有某些html标签就希望是html标签的形式显示出来，而不经过escape，那么可以采用 **safe** 过滤器【参考了[这个网页](http://stackoverflow.com/questions/3206344/passing-html-to-template-using-flask-jinja2)】 。

```
>>> t = Template('test {{ x|safe }}')
>>> t.render(x = '<h1>abc</h1>')
'test <h1>abc</h1>'
```

`escape` 过滤器有的模板作者会更喜欢使用别名缩写，一个小写字母 `e` 。

### 模板文件继承机制

jinja2的模板文件有一种继承机制，可以让你基于某个模板文件来建构出另外一个模板文件。具体使用是在父模板（模板文件的模板文件）构建一些block区块，如下所示:

```jinja2
<title>{% block title %} {% endblock %}</title>
```

这里构建了一个title区块。

然后子模板首先继承父模板所有的内容:

```jinja2
{% extends "base.html" %}
```

然后一些需要定制的部分，比如说这里的title部分，做成block之后，子模板文件可以重新定义这个title block:

```jinja2
{% extends "base.html" %}
{% block title %}the awesome title{% endblock %}
```

此外子模块在block重载的时候，你还可以用

```jinja2
{{ super() }}
```

来加载父模块在该block中的一些定义。

本模板里面的块还可以如下重复打印使用：

```jinja2
{{ self.title() }}
```




### 宏

宏和python的函数类似，遇到即将其展开。

```jinja2
{% macro render_comment(comment) %}
<li>{{ comment }}</li>
{% endmacro %}

<ul>
{% for comment in comments %}
{{ render_comment(comment) }}
{% endfor %}
</ul>
```

外部宏文件 引入

```jinja2
{% import 'macros.html' as macros %}

<ul>
{% for comment in comments %}
{{ macros.render_comment(comment) }}
{% endfor %}
</ul>
```

import 的模板是不会传递当前上下文的，你可以如下要求上下文也传递给引入进来的模板：

```jinja2
{% from 'forms.html' import input with context %}
```



### include

宏文件是推荐使用import，模板文件已经有继承机制了，那么这个include语句主要有什么用呢？

某个模板代码片段被多次反复使用推荐使用include语句，该模板代码片段默认是可以访问外围的上下文的：

```jinja2
{% include 'common.html' %}
```

当然你明确要求包含上下文或者不包含上下文都是可以：

```jinja2
{% include 'header.html' with context %}
{% include 'header.html' without context %}
```



### 其他技巧


#### 列表排序

参考了 [这个网页]( https://stackoverflow.com/questions/1959386/how-do-you-sort-a-list-in-jinja2 ) ：

```jinja2
{% for movie in movie_list|sort(attribute='rating') %}
{% for movie in movie_list|sort(attribute='rating', reverse = True) %}
```

#### 移除块前后的空白

这里所谓的空白指 空格，制表符，换行符等，jinja2这块有全局配置选项。或者可以如下手工配置，大体意思加上 `-` 表示这里要跟上一个 `trim_blocks` 操作。

```jinja2
{% for item in seq -%}
    {{ item }}
{%- endfor %}
```

