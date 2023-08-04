Slug: dataset-module
Date: 20201018
Status: draft
[TOC]

## 简介

dataset模块解决了一个什么痛点，那就是很多时候在项目之初我们没有那么多时间和精力去设计sql数据库模型，或者其他某些原因而更偏好json风格也就是no-sql数据库。这个时候我们可以使用dataset模块来让开发精力更专注于项目的其他方面。

dataset模块的项目在 [这里](https://github.com/pudo/dataset)  ，更多信息请参见官方文档。



## 基本使用

```python
import dataset

db = dataset.connect('sqlite:///:memory:')

table = db['sometable']
table.insert(dict(name='John Doe', age=37))
table.insert(dict(name='Jane Doe', age=34, gender='female'))

john = table.find_one(name='John Doe')
```

官方样例就是这样，看一下即知道怎么使用的了。下面继续就一些细节作出一些说明。

- connect连接使用的sqlalchemy作为连接模块，因此这里的URL写法和sqlalchemy那边`create_engine` 的时候的写法一致的。
- 上面的find_one方法在目标table上进行查找动作，后面跟的参数是一些过滤条件，找不到会返回None，找到一个则返回一个。
- 此外还有find方法，将会返回多个。
- insert是一般的插入动作，注意还有update和upsert方法，其中upsert方法可以设置一些唯一column判断，插入或者更新目标record，很是好用。更多信息请参看官方文档 [api部分](https://dataset.readthedocs.io/en/latest/api.html) 。

所以dataset其提供了一个便捷的sqlalchemy上层建筑，是的我们可以以一种更轻松地方式来使用sql表格，当后面使用了新的字段名字，dataset会自动帮我们配置好。因此后面项目代码稳定了可以试着继续慢慢更改为sqlalchemy连接风格。

