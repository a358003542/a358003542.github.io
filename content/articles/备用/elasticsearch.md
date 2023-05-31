Slug: elasticsearch
Date: 20190918

[TOC]


## 简介

需求：一般的数据库对全文搜索支持不是很好，mongodb的中文全文搜索支持是只有企业版才有的功能，而且我估计中文分词效果等也不会太好，而elasticsearch专注于数据库搜索，所谓术业有专攻，对于这样的搜索需求，有时我们是需要elasticsearch来解决这个问题的。

首先推荐elasticsearch的这个 [中文插件版](https://github.com/medcl/elasticsearch-rtf) ，其集成了很多中文支持插件，elasticsearch官方内置的中文分词效果很是不好，比如其集成了 [ik分词插件](https://github.com/medcl/elasticsearch-analysis-ik) ，其分词效果还是可以的。这个项目能够让新手马上上路，获得一个还算可以的效果，后面有精力再考虑进一步优化吧。

elasticsearch的python接口有官方的 [elasticsearch-py](https://github.com/elastic/elasticsearch-py) ，然后在实际编写代码的时候强烈推荐 [elasticsearch-dsl-py](https://github.com/elastic/elasticsearch-dsl-py) 项目，其也是基于 elasticsearch-py 项目，并提供了更便捷的接口封装。

elasticsearch数据库基本结构有点类似于mongodb，其一条记录也称为一个文档（doc），一个文档大体是一个字典值，可以字典套字典的那种。然后其还有一个索引（index）的概念，大体类似于database，然后其还有一个type概念，大体类似于collections。显然elasticsearch也属于nosql数据库，nosql数据库存储时很重要的一个思路就是，一个文档一个doc对应一个实体。

elasticsearch是基于Lucene的，这我们应该了解下，喝水不忘挖井人吗。

elasticsearch在windows下的安装还是很简单的，下载好代码，解压然后直接运行bin文件夹的 `elasticsearch.bat` 文件即可，当然你需要先安装好java，还有配置好 `JAVA_HOME` 变量。这通过下载安装jdk，然后在PATH里添加那个jdk的bin所在目录即可。

运行之后在 `localhost:9200` 那里可以打开看一下，有文字响应则说明你的elasticsearch运行正常了。

### 有关本文的例子

本文的例子中 `book_info` 是 index，使用的elasticsearch版本是 6.2 ，其默认 doc_type 是 `doc`

## 搜索文档

用elasticsearch不就是为了搜索吗，具体使用后面会更多讨论python api接口，下面简单了解一下elasticsearch的基本搜索操作，有个大体的概念。

### 只是搜索

```
GET /book_info/_search
```

每给出任何搜索关键词，将返回目标index的所有文档。我们可以看到一些有用的信息，这种返回格式现在详细讲讲:

```
{
  "took": 11,
  "timed_out": false,
  "_shards": {
    "total": 5,
    "successful": 5,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": 4223547,
    "max_score": 1,
    "hits": [
      {
        "_index": "book_info",
        "_type": "doc",
        "_id": "5aa2349e7227a6501fba4653",
        "_score": 1,
        "_source": {
          "unique_id": "5aa2349e7227a6501fba4653",
          "name": "史上最强少年阿武",
          "author": "最强绅士物语",
          "book_type": "同人小说",
          "title": "第9章
          ...
          }
      }
  }
}
```

目前我们先关注最核心的hits字段哪里，其内有：

- total 总共找到多少个

- max_score 最大得分

- hits 实际搜索到的记录信息，

  - _index 目标记录的索引
  - _type 目标记录的 doc_type
  - _id 目标记录的id
  - _score 目标记录的搜索得分
  - _source 目标记录的实际内容


### DSL查询表达式

实际我们搜索会使用一种专门的查询语言，DSL（领域特定语言）。这东西支持非常复杂的搜索，当然有的时候查询表达式也非常的复杂。


比如下面就是按照name来搜索，这里需要讲一下，index一开始的数据结构设计很重要，比如content 一开始设计的是 `Text` 字段，然后设置好中文分词之后那么就是全文搜索，再比如name 是 Keyword 字段，那么match搜索则是精确匹配模式。

```json
GET /book_info/_search
{
  "query": {
    "match": {
      "name": "未来之霸气小吃货"
    }
  }
}
```



下面是对content字段使用全文搜索，也是使用的 `match` query词。

```json
GET /book_info/_search
{
  "query": {
    "match": {
      "content": "未来之霸气小吃货"
    }
  }
}
```



### 用from和size进行分页

from 和 size 字段还有 query字段 是DSL语言最靠前的三个字段，后面更复杂的DSL查询语句都是 query字段里面继续字典套字典。

```json
GET /book_info/_search
{
  "query": {
    "match": {
      "content": "未来之霸气小吃货"
    }
  },
  "from": 30,
  "size": 10
}
```



### 高亮搜索结果

和第一级 `query` 是平行关系，可以额外返回一个 highlight 搜索匹配的高亮信息。

```
    "query" : {
        "match": { "content": "kimchy" }
    },
    "highlight" : {
        "fields" : {
            "content" : {}
        }
    }
```



### 一般查询语句

- match_all 什么都没说下的默认查询，通常和过滤操作进行
- match 不管是全文搜索还是精确匹配，match一般都是你所需要的
- multi_match 多字段查询
- range 通常是限定区间内的数字或时间
- term 数字，时间，布尔值或者不分析的文本的精确匹配
- terms 多个候选项的匹配
- exists 查某个字段是否存在

### 关于某个字段查询的Argument

```
        "match": {
            "title": {      
                "query":    "BROWN DOG!",
                "operator": "and"
            }
```

match下指明关于某个字段的查询，是如上结构， `query` 是查询词，然后平行的还可以指定更多的Argument，比如：

- operator 多词查询默认or逻辑，可以设置为and逻辑，也就是要求同时出现
- minimum_should_match 最小匹配度，
- boost 某个字段评分权重加大

### bool组合查询

bool下可有三个字段值（must, must_not, should），其将其形成组合查询逻辑。（must must_not, should对应的逻辑就是 and not or）

```json
'query': {
    'bool':{
        'must': {'match': {'source': 'what',}},
        'must': {'match': {'content': q}}
    }
}
```

比如上面这个例子就是content进行q字段搜索，然后source字段必须是'what'。bool组合查询也可以用于过滤语句。

此外bool还可以加上 `filter` 来执行过滤逻辑，其中查询是参与评分的，而过滤则不参与评分。

DSL 查询语句有的时候很复杂很多是由一些复合查询语句拼成的，bool是一个，dis_max 是一个，还有一些，后面再了解。





### 多字段搜索

用 `multi_match` 来实现对多个字段同时搜索。如下所示，

```json
{
    "query": {
        "multi_match" : {
            "query" : "elasticsearch guide",
            "fields": ["title", "summary"]
        }
    },
}
```

其默认的搜索类型是 `best_fields` 也就是找到得分最高的字段，然后得分就按那个得分最高的来。

```
    "dis_max": {
      "queries": [
        { "match": { "title": "elasticsearch guide" }},
        { "match": { "summary": "elasticsearch guide" }}
      ],
    }
```

其等于一个 `dis_max` 复合查询语句。`dis_max` 就是执行多个查询语句然后考虑 `tie_breaker` 因素，tie_breaker 默认是0，也就是指考虑得分最高的字段查询的得分。

多字段搜索的第二个类型就是 `most_field` ，各个字段的查询得分会相加。

多字段搜索的第三个类型是 `cross_field` ， 其会把多个字段合并在一起然后计算出一个得分。

多字段搜索情况很是复杂，可能默认的某个类型就满足了你的要求，也可能还要你自己怎么写出一个很复杂的复合查询语句。

### 更好的写多字段搜索

本小节主要参考了这篇 [不错的文章](https://www.elastic.co/blog/multi-field-search-just-got-better) 。



## 插入文档

```
PUT /book_info/doc/<id>
{
  "field_one": 1111,
  "field_two": "abcdefg"
}
```

这里 `<id>`  指定目标记录文档的存储 `_id` 。

## 定向id取出某个文档

```
GET /book_info/doc/<id>
```

## 更新文档

```
PUT /book_info/doc/<id>
{
  "field_one": 1111,
  "field_two": "abcdefg"
}
```

和插入文档类型，不同的时候返回的 `_version` 会加1，旧版本文档还是会在哪里，elasticsearch后面会慢慢删除一些旧版本文档。

### 部分更新文档

部分更新文档和上面提到的依靠版本控制更新文档并没有本质区别，只是一个便捷的内部api，其还是更新全部文档和删除旧文档等过程。

```
POST /book_info/doc/<id>/_update
{
   "doc" : {
      "tags" : [ "testing" ],
      "views": 0
   }
}
```

部分更新文档就是和原文档合并，覆盖写上已有的字段和新增新的字段。



## 删除文档

```
DELETE /book_info/doc/<id>
```

删除文档并不会立即删除文档，只是将这个文档标记为已删除，后面es会自动删除这些文档。





## python那边对接

elasticsearch_dsl 刚开始不是很推荐使用，尽可能使用 elasticsearch-py 模块，其内部使用的doc语法和 [官方文档](https://www.elastic.co/guide/cn/elasticsearch/guide/current/index.html)  和一些教程都是一致的，而且原生的查询语句在 kibana上也是很好输入和测试的。就是查询语句多少复杂繁琐点了，这个需要另外开个python脚本文件统一管理。

### 创建索引

elasticsearch 数据库除了有 index 索引的概念，还有一个 doc_type 的概念，然后不使用那个 doc_type ，发现大体也是可以使用的，刚开始我没有考虑 doc_type 概念。

```python
from datetime import datetime
from elasticsearch import Elasticsearch
es = Elasticsearch()

res = es.index(index="test-index")
print(res['created'])
```

elasticsearch数据库默认开启了自动创建索引，删除索引等操作暂时先不涉及吧，所以下面集中精力把搜索和修改数据库弄清楚。

### 忽略某些连接异常

可能你在编程的时候希望能够忽略某些连接异常，加上 `ignore` 参数即可：

```python
from elasticsearch import Elasticsearch
es = Elasticsearch()

# ignore 400 cause by IndexAlreadyExistsException when creating an index
es.indices.create(index='test-index', ignore=400)

# ignore 404 and 400
es.indices.delete(index='test-index', ignore=[400, 404])
```



### 返回内容过滤

search方法可以加上 `filter_path` 参数来指明只需要那些属性。

```python
es.search(index='test-index', filter_path=['hits.hits._id', 'hits.hits._type'])
```



### 搜索

基本的搜索格式如下所示：

```python
res = es.search(index="test-index", body={"query": {"match_all": {}}})
print("Got %d Hits:" % res['hits']['total'])
for hit in res['hits']['hits']:
    print("%(timestamp)s %(author)s: %(text)s" % hit["_source"])
```

### 更新文档

使用 Elasticsearch 对象的 `update` 或 `update_by_query` 方法，具体参数就是：

```
def update(self, index, doc_type, id, body=None, params=None)
```

是的看了下源码，update方法前几个都是必填参数。可以考虑使用 update_by_query：

```
 def update_by_query(self, index, doc_type=None, body=None, params=None)
```

似乎不太方便，同步存储风格可能会更好一点，因为elasticsearch对同一文档有版本控制，旧文档会慢慢自动删除的。

### 同步存储

同步存储用 `elasticsearch-dsl` 模块还是很方便的，官方文档推荐使用 `DocType` ，如下所示：

```python
class Post(DocType):
    title = Text()
    title_suggest = Completion()
    created_at = Date()
    published = Boolean()
    category = Text(
        analyzer=html_strip,
        fields={'raw': Keyword()}
    )

    class Meta:
        index = 'blog'

    def save(self, ** kwargs):
        self.created_at = datetime.now()
        return super().save(** kwargs)
```

 然后连接推荐如下设置默认连接风格：

```python
from elasticsearch_dsl.connections import connections

connections.create_connection(hosts='localhost', timeout=20)
```

你首先需要调用该 DocType 的 `init` 方法：

```
Post.init()
```

然后就是赋值和 `save` 了。



### 指定某个字段为es的_id

本小节参考了 [这个网页](https://stackoverflow.com/questions/38533990/use-existing-field-as-id-using-elasticsearch-dsl-python-doctype) 。

具体就是如下设置 `self.meta.id` 属性：

```
    def save(self, **kwargs):
        """
        自动填充doc创建时间
        自动填充_id 根据unique_id
        """
        self.created_at = datetime.utcnow()
        self.meta.id = self.unique_id

        super().save(**kwargs)
```






## 附录
### 插入点数据

数据库的学习总要先往里面插入点数据，否则再好的戏也出不来。按照 阮一峰的elasticsearch数据库入门教程 描述，其参考的是 [这篇文章](https://www.elastic.co/blog/index-type-parent-child-join-now-future-in-elasticsearch) ，说elasticsearch5目前一个index下可以有多个type，elasticsearch6一个index下只能有一个type，elasticsearch7下将彻底移除type这个概念，这样将更加简单了。我们来看 elasticsearch-dsl-py 项目提供的 插入数据的 有点类似于 model的 这段代码：

```python
class Article(DocType):
    title = Text(analyzer='snowball', fields={'raw': Keyword()})
    body = Text(analyzer='snowball')
    tags = Keyword()
    published_from = Date()
    lines = Integer()

    class Meta:
        index = 'blog'
```

刚开始我没意识到问题，后来开始意识到问题了，那就是这样操作，和网上的 [elasticsearch权威指南](https://www.elastic.co/guide/cn/elasticsearch/guide/cn/index.html) 这本书描述的很不一样，那就是这样定义elasticsearch的数据模型，除了说明下index之外，doctype的名字没看到在哪里定义的，后来发现大部分搜索工作都能正常进行就没管了，一开始还有点不放心，现在放心了，也就是我们以后思考elasticsearch数据库的架构，完全可以丢弃type这个概念了。

但是需要提醒读者的是，这是个逐步移除的过程，所以你可能还是需要仔细核对下你的elasticsearch数据库的返回数据结构信息。



### 自定义插件

现在开始脱离上面提及的elasticsearch中文插件版，使用elasticsearch最新版本6.X，然后初步琢磨下怎么安装个分词插件。JAVA那块我并不是太熟悉，但我们慢慢来吧。

插件有两种安装方法，绿色版的推荐将插件安装放在 `plugins`  文件夹哪里，或者推荐找到你的elasticsearch的bin文件夹，调用 `./bin/elasticsearch-plugin` 命令，大体如下所示：

```
./bin/elasticsearch-plugin install https://github.com/medcl/elasticsearch-analysis-ik/releases/download/v6.2.2/elasticsearch-analysis-ik-6.2.2.zip
```

然后重启elasticsearch服务即可。

### 开启外网端口

程序host的配置在 `config` 的 `elasticsearch.yml` 中配置：

```
network.host: 0.0.0.0
```

正式产品运营是不应该设置为 `0.0.0.0` 的，这样任何人都可以访问的。



### Kibana

kibana是什么，简单来说就是pgadmin之于postgresql，一个非常方便的图形界面查看elasticsearch数据库的工具。其中的 `Dev Tools` 在学习elasticsearch语法是特别有用，更多细节请参看官方文档。



### 查看集群健康

```
GET _cluster/health
```



## 备份

elasticsearch的备份就是建立快照的概念，然后快照是增量备份策略。

### 新建一个快照仓库

```
PUT _snapshot/backup
{
    "type": "fs", 
    "settings": {
        "location": "/path/to/elasticsearch/backup" 
    }
}
```

记得elasticsearch的配置文件 `elasticsearch.yml` 里面配置好：

```
path.repo : ["/path/to/elasticsearch/backup"]
```

### 新建一个快照

```
PUT _snapshot/backup/snapshot_1
```

### 查看已有的快照

```
GET _snapshot/backup/_all
```

### 删除目标快照

```
DELETE _snapshot/backup/snapshot_1
```



## 插件

### 列出插件

```
bin/elasticsearch-plugin list
```

### 安装插件

```
bin/elasticsearch-plugin install [pluginname]
```

### 移除插件

```
bin/elasticsearch-plugin remove [pluginname]
```






## 参考资料

1.  [Elasticsearch: 权威指南](https://www.elastic.co/guide/cn/elasticsearch/guide/current/index.html)
2.  [IT自学教程之Elastic全文检索](http://www.zixuebook.cn/fullsearch/elastic/)
3.  [23个有用的elasticsearch查询例子](https://dzone.com/articles/23-useful-elasticsearch-example-queries)
4.  [elasticsearch入门教程](http://www.ruanyifeng.com/blog/2017/08/elasticsearch.html)

