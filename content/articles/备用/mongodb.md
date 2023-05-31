Slug: mongodb
Date: 20190911

[TOC]

## 简介

mongodb作为一款主流的nosql和sql数据库区别还是很大的，虽然有类似的比较，比如mongodb的collection概念大体类似于table，或者其他等等，但最好还是摒弃这种思维。然后mongodb相对sql明显有这两个优点，在开发的时候最好要好好使用，而不要因为之前的sql思维而自我设限。

1.  mongodb是不要求一个collection里面各个文档具有相同的chema或者简单说，相同的key的。
2.  不要把sql的join思维带入进来了，而应该更好地利用mongodb可以字典里面套字典，列表里面塞字典的特性。对于这种数据结构，mongodb有对应的查询语法，速度还是很快的。

```python
user_doc = dbh.users.find_one({"facebook.username":"foofacebook"})
```

你看上面的例子，本来一个doc（mongodb把最小的一条记录叫做doc）大概类似一个字典了，然后我们还可以点着去查询，所以必要的时候，字典里面放字典，放心，对于这种结构速度还是有保证的。



## 安装

本来安装是不想多说了的，但因为历史原因，把以前在ubuntu下的一些东西放在这里吧，可能对读者有帮助。

ubuntu下的安装是：

```bash
sudo apt install mongodb
```

其中mongo命令是client接口，然后mongod命令是服务端接口。默认开启了mongod后台服务，你可以看一下：

```bash
sudo service --status-all
```

mongodb后台服务默认端口是 `27027` ，你可以通过 mongod 来指定数据库的存放位置和具体开启端口号：

```bash
mongod --dbpath ~/mongodb --port 12321
```

默认的mongodb的数据库存放点是 `/var/lib/mongodb` 。

## robomongo

一个不错的图形界面管理mongodb的软件，强烈推荐。基本上在里面可以满足一般的mongo命令需求了，不过下面还是列出来一些东西吧：

-   `show dbs` 显示所有数据库

-   `db` 显示当前数据库名字

-   `use dbname` 切换到某个数据库或者创建某个数据库，要实际新建一个数据库还需要往里面塞点东西。比如:

```
db.users.save({username:'zhangsan'})
```
-   `show collections` 显示当前数据库的所有colletions名字。

-   `exit` 退出mongo



## pymongo

### mongodb的数据类型

使用pymongo之后，很多python中的数据类型都能够对应到某个数据类型中，所以这不是很大的问题，如果有其他数据类型需求，则需要查阅文档了。

值得一提的就是python的datetime模块的datetime对象是可以直接用来作为Date类型被pymongo接受的。

然后 `ObjectId` 如果要查询：

```
find_one({'_id': target['_id']})
```

可以这样直接引用，而如果进一步要执行某个 ObjectId 那么需要如下：

```
from bson import ObjectId
```

### mongodb的数据到json文件

参考了 [这个网页](http://stackoverflow.com/questions/16586180/typeerror-objectid-is-not-json-serializable) ，比如说你想要mongodb里面的数据读出来然后存到json文件中，那么你可能会遇到这个错误：

```
TypeError: ObjectId('') is not JSON serializable
```

关于这种json文件的读入和写入操作，推荐的风格如下所示：

```
>>> from bson import Binary, Code
>>> from bson.json_util import dumps
>>> dumps([{'foo': [1, 2]},
... {'bar': {'hello': 'world'}},
... {'code': Code("function x() { return 1; }")},
... {'bin': Binary("••••")}])

```

额外要提醒读者的是，这个bson模块，你在安装pymongo的时候就自动安装了。然后在 `bson.json_util` 里面有 dumps loads 很有用，然后 `bson` 里面提供了很多mongodb的数据类型支持，如前面提及的 `ObjectId Binary Code` 等。



### 连接数据库

下面的代码我想能够说明一切了，repset是连接mongodb集群的写法。

```python
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure

def get_mongodb_client(host='localhost', dbport=27017, repset=None):
    dbport = int(dbport)

    try:
        if repset is None:
            mongodb_client = MongoClient('mongodb://{}/'.format(host),
                                         port=dbport)
        else:
            mongodb_client = MongoClient('mongodb://{}/'.format(host),
                                         replicaset=repset,
                                         port=dbport)
        return mongodb_client
    except ConnectionFailure as ex:
        logging.warning(ex)
```



### 查找数据

在实际pymongo的写法中，我们一般喜欢定位到具体的某个collection，然后再进行一些操作：

```
db = client['dbname']
collection = db['collection_name']
```

具体查找数据有 `find` 和 `find_one` 这两个方法，其中find_one 是只找一个目标记录（doc），而find则是找到很多。

具体就是使用过滤器语法来进行查找工作，下面简单介绍一些：

#### 过滤器语法

首先是最简单的如下直接写上一些你希望目标记录有的属性，

```
q = {
"firstname" : "jane",
"surname" : "doe"
}
```

这个说的专业点叫做各个语句and连接，不管怎么说就理解为目标doc的属性符合这些条件吧。

然后就是对属性使用操作符，比如下面：

```
q = {
"score" : { "$gt" : 0 }
}
```

就是查询得分大于0的。

类似的还有很多过滤操作符，如 `$or` 或 `$exists` 等等，这个后面慢慢了解之。

-   `$exists` 

```
"email": {"$exists":True}
```



#### 排序

find之后后面可以继续跟着 `sort` 方法来进行排序，默认是升序（pymongo.ASCENDING）。

```
for doc in collection.find().sort([
    ('field1', pymongo.ASCENDING),
    ('field2', pymongo.DESCENDING)]):
    print(doc)

```



### 插入文档



```
col.insert_one()
col.insert_many()
```



### 更新文档




```
replace_one(filter, replacement, upsert=False)
update_one(filter, update, upsert=False)
update_many(filter, update, upsert=False)
```

`upsert` 设为True是如果用过滤器找到则更新数据，否则执行插入操作。 `replace_one` 是直接用一个新文档替换旧文档，而 `update_one` 是用 更新修饰符 来操作的。

### 更新修饰符

更新修饰符大体有下面这些：

-   `$inc` doc的某个属性数值加上多少，比如 `"$inc":{"score":1}` 是 score 属性加1。
-   `$set` doc的某个属性设为多少。
-   `$unset` 删除属性
-   `$push` 列表append操作
-   `$pop` 列表右边最后一个元素删除
-   `$pull` 列表中某个元素将被删除
-   `$pullAll` 一次删除多个
-   `$rename` 属性名更改
-   `$addToSet` 给某个列表添加元素，有则不加，没有则加上。

### 删除文档

```
col.delete_one(filter)
col.delete_many(filter)
```

### 长时间查询丢失cursor

有的时候你写一个脚本，因为数据库数据比较大，find可能会执行很长时间，然后会返回一个cursor 找不到的错误，这是因为mongodb自动关闭了那个cursor，你需要在find方法上加上选项： `no_cursor_timeout=True` 。

PS: 之前我设置这个选项了，后来还是有时候会出现这个异常，后来确定的原因是因为目前我操作的文档doc记录文本较大，所以需要设置 `batch_size`  ，默认是 4M ， 最多只能设置到 16M。

```
col.find({}, no_cursor_timeout=True).batch_size(16)
```



### doc的创建时间

不要写什么 `created_time` 了，mongodb的 ObjectId 是有该doc的创建时间含义的：

```python
from bson import ObjectId
id = ObjectId("5a505b643004c52888489b02")
id.generation_time
datetime.datetime(2018, 1, 6, 5, 15, 16, tzinfo=<bson.tz_util.FixedOffset object at 0x0000022CEDC414E0>)
```

### 原生mongo命令

```
比如 update_many 对应的是 updateMany ，在pymongo那边很多命令都是对应的。
```


## 索引

很多初学mongodb的人用了一段时间就会抱怨，mongodb很慢，实际上mongodb不慢，这其中很大一部分原因是，他们没有进行创建索引操作。

mongodb的记录 `_id` 字段默认是会创建索引的，然后可能会有某些字段，如果你的程序里面会频繁查询使用，那么当你的文档记录很多了之后，是一定要加上索引的，否则你的程序会很慢很慢。

```
db.COLLECTION_NAME.ensureIndex({KEY:1})
```

然后某些查询会涉及到多个字段，那么推荐创建一个多值索引（或者叫复合索引？）：

```
db.getCollection('clean').ensureIndex({'name':1,'author':1,'chapter_id':1})
```






## 备份和还原

mongo命令可能你平时不是特别需要了，不过 `mongodump` 和 `mongorestore` 这两个命令有时还是需要的，其一个是进行mongodb的备份操作，一个是进行还原操作。

```
mongodump
mongorestore dump
```

最简单的流程如上，这里的备份文件就放在dump文件夹下。更多选项请读者自行了解之。比如下面：

```bash
mongodump --host=atlas-04 --db=mls06085 -o mongodump_2015-07-29
```

`--db` 指定数据库名， `-o` 指定导出文件夹名。



## 连接数据库

### windows下连接数据库

请参看 [这个网页](https://stackoverflow.com/questions/18216712/cannot-authenticate-into-mongo-auth-fails) ，使用 `-u` `-p` 输入用户名和密码之后不知道怎么还是连不上，最后查询发现还需要加上 admin，不太清楚为什么（现在有点清楚清楚了，这个在linux对应的选项是 `-authenticationDatabase`  ， 也就是你管理认证相关的数据库名字）。

```
mongo admin -u admin -p SECRETPASSWORD
```



### 连接mongodb集群

```
mongo --host=inors0504/redstone:27019,ltprod01:27108,innoali02:27018
```



## 查询只显示某些字段

```
db.getCollection('qidian_book_info').find({},{'bookInfo.updTime':1}).sort({'updated_time':-1})
```






## 参考资料

1.  mongodb and python, Author:Niall O’Higgins, year:2011
2.  mongodb - the definitive guide, Author:Kristina Chodorow, May 2013:Second Edition
3.  MongoDB Basics , Author:David Hows, Peter Membrey etc. year: 2014