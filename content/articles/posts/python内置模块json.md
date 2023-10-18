Slug: python-builtin-module-json
Date: 20231019

[TOC]


## json模块


### 什么是json

json全称是JavaScript Object Notation，也就是JavaScript对象表示法。json是一种基于文本的，人类易读的数据存储交互格式。json文件保存使用后缀 `.json` 。虽然json是从javascript语言衍生出来，不过其作为数据存储和交互是独立于语言的。json和xml作为数据存储和交互方案相比有更易读和读写速度更快的特点。

### json存储格式语法

json存储格式的语法很简单，首先是最基本的数字开始，其支持两种数字类型，整数型和浮点型，其对应于python的int和float；字符串在双引号里面，其对应于python的字符串概念；布尔值true和false，其对应于python的True和False，然后还有一个null对应于python的None；json数据用`[]`表示，里面的元素用逗号分隔，其对应的正是python的列表概念；然后json的object对象用`{}` 包围，其内是key:value这样的形式，其正对应于python的字典概念。

python语言已经内置了json模块，所以要读写json文件只需要简单 `import json`即可。

首先让我们小试牛刀，把 `[1,2,3,4,5]` 这组数存( **dump**)进test.json文件里面去。

```python
import json
lst = [1,2,3,4,5]

with open('test.json',mode='w',encoding='utf-8') as f:
    json.dump(lst,f)
```

json不支持元组(tuple)和字节(bytes)类型，bytes类型一般不会去惊扰它，如果有tuple元组你需要存储，那么将其转换成列表即可。

简单的读取是使用的json的 `load` 函数，如下所示：

```python
with open('test.json', mode='r', encoding='utf-8') as f:
    lst2 = json.load(f)
```

这样lst2就被赋值  `[1,2,3,4,5]` 了，方便后面的运算。

### 存储字典值

上面的例子稍作修改即可以存储字典值了：

```python
import json
dict01 = {'a':1,'b':2,'c':[1,2,3]}

with open('test.json', mode='w', encoding='utf-8') as f:
    json.dump(dict01,f)

with open('test.json', mode='r', encoding='utf-8') as f:
    dict02 = json.load(f)

print(dict02)
```



### 存储到文件的一些美化

上面的dump函数那句读者可以考虑加入 `indent` 选项：

```python
json.dump(dict01,f,indent=4)
```

这样我们的test.json文件里面的数据会进行一些缩进，会更好看一些了。

此外 `sort_keys`选项有时会很有用，默认是False，如果设置为True，则输出的文件的key是排序了的 。

此外 `ensure_ascii` 选项默认是True，中文字符保存会变为 `\uabcd` 之类的东西，如果设置为False，则能显示正常的中文字符。

### dumps和loads函数

dumps和loads函数是非文件接口版，简单了解下即可。
