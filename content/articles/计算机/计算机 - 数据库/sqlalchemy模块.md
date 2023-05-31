Slug: sqlalchemy-module
Tags:  orm, database
Date: 20201018

[TOC]

## 前言

本文分为两个部分，sqlalchemy的非ORM部分和ORM部分。一般使用是推荐使用ORM，这将让你的代码更python，更易读易懂。但ORM部分要用好，很多非ORM部分知识是需要的,下面根据笔者的实践列出一些非ORM部分非常常用的一些知识部分：

- 创建Engine 理解创建Engine部分将有助于你在很多地方理解如何配置sqlalchemy的数据库连接
- 列的属性 列的数据类型 这两个是必看的，你在定义ORM模型的时候必然要参考这个
- select语句和理解RowProxy对象 帮助你理解如何在query中编写select语句和出来的结果如何使用



### 安装

sqlalchemy的安装简单用pip命令安装之即可:

    pip install sqlalchemy

### 引用惯例

在后面都默认有如下引用:

    from sqlalchemy import *

后面将不会再提及，也就是凡是 `from sqlalchemy import what` 的所有语句也都归于如上一条引用。实践中并不推荐这种的全局引用。

## 简介

通过sqlalchemy连接具体的某个数据库，前面有一些准备工作要做，参考 [sqlalchemy architecture](http://www.aosabook.org/en/sqlalchemy.html) 一文的描述:

![img]({static}/images/python/layers.png "SQLAlchemy layer diagram")

和数据库直接相连的是我们熟悉的那些DBAPI接口模块，比如: sqlite3, pymysql, psycopg2等，然后中间的核心层有Engine，连接池，方言，SQL表达语言和类型系统。core层很重要，实际上有些模块是完全建构在core层之上的，不一定要用ORM方法。

## 非ORM风格

### 创建Engine

创建一个 `Engine` 对象实际上对应的就是和数据库的连接操作。具体是通过 `create_engine` 函数创建的Engine对象，其一开始并没有实际连接数据库，只有具体要求某个操作的时候才会去连接。

#### 连接sqlite3
连接sqlite3 in-memory

    engine = create_engine('sqlite://')

但是推荐采用如下写法:

    engine = create_engine('sqlite:///:memory:')

这样后面谈及的sqlalchmy\_utils的 `database_exists` 函数也能正常工作。

连接sqlite3 on-disk

    engine = create_engine('sqlite:///sqlite3_learning_example.db')

上面的db文件是创建在命令行当前工作目录下的，也就是相对路径表达。此外还可以如下写上绝对路径表达:

    engine = create_engine('sqlite:////absolute/path/to/foo.db')

在三个斜杠线的基础上还需要加上一个斜杠线。作为这种形式的通用表达，前面必定有两个斜杠线，然后第二个斜杠线和第三个斜杠线之间是登录信息的描述，因为sqlite3没有这些信息，所以空了，如下所示:

    dialect://username:password@host:port/database

或者某个方言系统再加上某个驱动:

    dialect+driver://username:password@host:port/database

这里的方言可以有:

-   **sqlite:** 默认的driver的官方的 **sqlite3** 模块，这个应该不需要改动。
-   **mysql:** 默认的dirver是 **mysql-python** ，但推荐使用 **pymysql** ，你需要用pip安装之。

    engine = create_engine('mysql+pymysql://root@localhost/test')

-   **postgresql:** 默认的driver是 **psycopg2** ，这个还行。
-   **oracle:** 默认的driver是 **cx\_oracle** 。
-   **mssql:** 默认的driver是 **pyodbc** 。

#### 连接mysql

    engine = create_engine('mysql+pymysql://localhost/mysql_db')

确保你安装了pymysql:

    pip install pymysql

#### 连接postgresql

    engine = create_engine('postgres://rick:foo@localhost:5432/pg_db')

### MetaData对象

MetaData对象你可以看作比Table层更高一级的抽象，里面存放着Table对象的一些metadata描述信息。一个简单的理解是将一个MetaData对象看作sqlalchemy内部的database概念。

#### 创建一个unbound MetaData对象

通过 `MetaData()` 默认创建的就是一个unbound MetaData对象。

    metadata = MetaData()

#### bind一个Engine对象

你可以如下将一个unbound MetaData对象具体 `bind` 一个Engine对象。

    engine = create_engine('sqlite://')
    metadata = MetaData()
    metadata.bind = engine

或者在上面创建的时候就指定:

    engine = create_engine('sqlite://')
    metadata = MetaData(engine)

或者你还可以直接engine的URL表达来后台自动创建一个engine，于是有:

    metadata = MetaData('sqlite://')

对于初学者用的最多的还是 `BoundMetaData` ，通过上面谈及的方法创建了一个 `BoundMetaData` 对象之后，某个Table对象关联了该 `BoundMetaData` 对象，然后该Table对象就可以直接通过:

    table.create()

来创建自身了。

#### 测试数据库是否存在

这里关于 `sqlalchemy_utils` 的想法来自 [这个网页](http://stackoverflow.com/questions/6506578/how-to-create-a-new-database-using-sqlalchemy) 。

```python
from sqlalchemy import *
from sqlalchemy_utils import database_exists, create_database


def init_sqlalchemy(dburl,echo=True):
    engine = create_engine(dburl,echo=echo)

    if not database_exists(engine.url):###确保目标数据库是存在的。
        create_database(engine.url)

    metadata = MetaData(bind = engine)
    return metadata

metadata = init_sqlalchemy('sqlite:///test.db')
```

这里的 `sqlalchemy_utils` 需要额外安装，在这里主要是利用其 `database_exists` 函数来检测某个数据库是否存在，然后如果不存在的话则用 `create_database` 函数创建之。

上面的 `init_sqlalchemy` 函数最重要的一个参数就是那个 `dburl` ，具体其细节前面已有所叙述，正是照它来创建的Engine，并基于这个Engine对象来创建的MetaData对象，一般将这个MetaData对象bind之前的那个engine，然后返回该metadata即可，后面主要需要使用这个metadata。

然后后面实际操作就以创建一个Table对象开始了，其他database的操作，建议如同上面处理的一样，都提到顶层用sqlalchemy\_utils模块来处理之。类似的还有 **drop\_database** : 删除database，参数如create\_database也是某个Engine对象的url。

### 创建一个Table对象

下面是一个完整的例子，最后创建了一个Table表格。这里的 `db` 也就是前面谈及的MetaData对象，我们看到在创建Table对象的时候第一个参数是具体创建的SQL表格的名字，第二个就是该表格bind的某个MetaData对象，也可以简单理解为该表格对象存入该MetaData对象代表的database中。然后后面调用 `db.create_all()` ，所有这些bind到该db上的表格都将创建。你还可以用 `users.create()` 来单独创建某个表格。

```python
from sqlalchemy import *
from sqlalchemy_utils import database_exists, create_database


def init_sqlalchemy(dburl,echo=True):
    engine = create_engine(dburl,echo=echo)

    if not database_exists(engine.url):###确保目标数据库是存在的。
        create_database(engine.url)

    metadata = MetaData(bind = engine)
    return metadata

db = init_sqlalchemy('sqlite:///test.db')

users = Table('users', db,
    Column('user_id', Integer, primary_key=True),
    Column('name', String(40)),
    Column('age', Integer),
    Column('password', String),
)

db.create_all()
```

### 利用已存在的Table

如果某个数据库的某个Table已经存在了，那么你就没有必要如上去创建一个Table对象了，只需要如下做就可以获得该Table对象了:

    users = Table('users',db,autoload=True)

具体就是将 `autoload` 设置为True即可。这里的db就是所谓的metadata，然后这里必须是bind了的metadata对象，若还未bind，则还需要加上autoload\_with参数。

### 实际在数据库中创建表格

具体可以整个metadata对象，调用 `create_all` 方法来创建所有表格（其也有 `checkfirst` 参数。）:

    db.create_all()

或者该Table对象具体调用 `create` 方法来自我创建之。在应用推荐加上 `checkfirst=True` 设置，这样就算数据库中该表格已经存在也不会报错。如下所示:

    users.create(checkfirst=True)

类似的还有如下用法用于安装删除某个表格，即使该表格不存在也不会报错:

    users.drop(checkfirst=True)

这里代码改成了这个样子了:

```python
try:
    users = Table('users',db,autoload=True)
except sqlalchemy.exc.NoSuchTableError:
    users = Table('users', db,
    Column('user_id', Integer, primary_key=True),
    Column('name', String(40)),
    Column('age', Integer),
    Column('password', String),
)
```

注意这个 `NoSuchTableError` ，如果通过 `autoload=True` 来获取该Table对象而其在数据库中并不存在，则将抛出这个异常。

### 列的属性设置

创建表格对象后面一系列的参数就是具体各个列Column对象，其第一个参数是具体列的名字，然后第二个参数该列所存储的值的类型，后面还可以跟其他一些可选项作为属性的进一步修饰。具体如下所示:

-   **primary\_key:** 设置该列为主键列或者称之为主键约束
-   **unique:** 该列加上唯一约束，即该列的值不可重复。主键约束是一种特殊的唯一约束。
-   **nullable:** 该列可不可为空
-   **default:** 该列的默认值设置
-   **index:** 该列是否加入索引
-   **auto\_increment:** Integer的列数值自动递增
-   **ForeignKey('brand.id'):** 设置外键约束
-   **CheckConstraint('amount > 0'):** 设置Check约束
-   **onupdate:** 最常见的用法如下:

    onupdate=datetime.utcnow

应该意思是若update了则调用某个callable对象吧。

### 列的数据类型声明

下面对各个列存储的值的可能类型描述详细介绍之，更多信息请参看文档查看之。

<table>


<colgroup>
<col  class="org-left">

<col  class="org-left">

<col  class="org-left">

<col  class="org-left">
</colgroup>
<thead>
<tr>
<th scope="col" class="org-left">Class name</th>
<th scope="col" class="org-left">Python Type</th>
<th scope="col" class="org-left">SQL Type (for SQLitedriver)</th>
<th scope="col" class="org-left">Arguments</th>
</tr>
</thead>

<tbody>
<tr>
<td class="org-left">String</td>
<td class="org-left">string</td>
<td class="org-left">TEXT or VARCHAR</td>
<td class="org-left">length</td>
</tr>


<tr>
<td class="org-left">Integer</td>
<td class="org-left">int</td>
<td class="org-left">INTEGER</td>
<td class="org-left">none</td>
</tr>


<tr>
<td class="org-left">SmallInteger</td>
<td class="org-left">int</td>
<td class="org-left">SMALLINT</td>
<td class="org-left">none</td>
</tr>


<tr>
<td class="org-left">Numeric</td>
<td class="org-left">float,Decimal</td>
<td class="org-left">NUMERIC</td>
<td class="org-left">precision=10, length=2</td>
</tr>


<tr>
<td class="org-left">Float</td>
<td class="org-left">float</td>
<td class="org-left">NUMERIC</td>
<td class="org-left">precision=10</td>
</tr>


<tr>
<td class="org-left">DateTime</td>
<td class="org-left">datetime.datetime</td>
<td class="org-left">TIMESTAMP</td>
<td class="org-left">none</td>
</tr>


<tr>
<td class="org-left">time</td>
<td class="org-left">datetime.time</td>
<td class="org-left">TIME</td>
<td class="org-left">none</td>
</tr>


<tr>
<td class="org-left">Date</td>
<td class="org-left">datetime.date</td>
<td class="org-left">DATE</td>
<td class="org-left">none</td>
</tr>


<tr>
<td class="org-left">Binary</td>
<td class="org-left">byte string</td>
<td class="org-left">BLOB</td>
<td class="org-left">length</td>
</tr>


<tr>
<td class="org-left">Boolean</td>
<td class="org-left">bool</td>
<td class="org-left">BOOLEAN</td>
<td class="org-left">none</td>
</tr>


<tr>
<td class="org-left">Unicode</td>
<td class="org-left">unicode</td>
<td class="org-left">TEXT or VARCHAR</td>
<td class="org-left">length</td>
</tr>
</tbody>
</table>

大致就这些，然后sqlalchemy还有一些类名大致和上面的某个等同，只是多了一个使用上的名字。 

-   **FLOAT:** 等同于 Numeric
-   **TEXT:** 等同于 String
-   **DECIMAL:** 等同于 Numeric
-   **INT:** 等同于 Integer
-   **INTEGER:** 等同于 Integer
-   **TIMESTAMP:** 等同于 DateTime
-   **DATETIME:** 等同于 DateTime
-   **CLOB:** 等同于 String
-   **VARCHAR:** 等同于 String
-   **CHAR:** 等同于 String
-   **NCHAR:** 等同于 Unicode
-   **BLOB:** 等同于 Binary
-   **BOOLEAN:** 等同于 Boolean

#### mysql方言的额外类型

<table>


<colgroup>
<col  class="org-left">

<col  class="org-left">

<col  class="org-left">

<col  class="org-left">
</colgroup>
<thead>
<tr>
<th scope="col" class="org-left">Class name</th>
<th scope="col" class="org-left">Python type</th>
<th scope="col" class="org-left">SQL type</th>
<th scope="col" class="org-left">Arguments</th>
</tr>
</thead>

<tbody>
<tr>
<td class="org-left">MSEnum</td>
<td class="org-left">string</td>
<td class="org-left">ENUM</td>
<td class="org-left">values</td>
</tr>


<tr>
<td class="org-left">MSTinyInteger</td>
<td class="org-left">int</td>
<td class="org-left">TINYINT</td>
<td class="org-left">length</td>
</tr>


<tr>
<td class="org-left">MSBigInteger</td>
<td class="org-left">int</td>
<td class="org-left">BIGINT</td>
<td class="org-left">length</td>
</tr>


<tr>
<td class="org-left">MSDouble</td>
<td class="org-left">float</td>
<td class="org-left">DOUBLE</td>
<td class="org-left">length=10,precision=2</td>
</tr>


<tr>
<td class="org-left">MSTinyText</td>
<td class="org-left">string</td>
<td class="org-left">TINYTEXT</td>
<td class="org-left">none</td>
</tr>


<tr>
<td class="org-left">MSMediumText</td>
<td class="org-left">string</td>
<td class="org-left">MEDIUMTEXT</td>
<td class="org-left">none</td>
</tr>


<tr>
<td class="org-left">MSLongText</td>
<td class="org-left">string</td>
<td class="org-left">LONGTEXT</td>
<td class="org-left">none</td>
</tr>


<tr>
<td class="org-left">MSNVarChar</td>
<td class="org-left">unicode</td>
<td class="org-left">NATIONAL VARCHAR</td>
<td class="org-left">length</td>
</tr>


<tr>
<td class="org-left">MSTinyBlob</td>
<td class="org-left">byte string</td>
<td class="org-left">TINYBLOB</td>
<td class="org-left">none</td>
</tr>


<tr>
<td class="org-left">MSMediumBlob</td>
<td class="org-left">byte string</td>
<td class="org-left">MEDIUMBLOB</td>
<td class="org-left">none</td>
</tr>


<tr>
<td class="org-left">MSLongBlob</td>
<td class="org-left">byte string</td>
<td class="org-left">LONGBLOB</td>
<td class="org-left">none</td>
</tr>


<tr>
<td class="org-left">MSBinary</td>
<td class="org-left">byte string</td>
<td class="org-left">BINARY</td>
<td class="org-left">length</td>
</tr>


<tr>
<td class="org-left">MSVarBinary</td>
<td class="org-left">byte string</td>
<td class="org-left">VARBINARY</td>
<td class="org-left">length</td>
</tr>


<tr>
<td class="org-left">MSSet</td>
<td class="org-left">set</td>
<td class="org-left">SET</td>
<td class="org-left">set values</td>
</tr>


<tr>
<td class="org-left">MSYear</td>
<td class="org-left">int</td>
<td class="org-left">YEAR</td>
<td class="org-left">length</td>
</tr>


<tr>
<td class="org-left">MSBit</td>
<td class="org-left">long</td>
<td class="org-left">BIT</td>
<td class="org-left">length</td>
</tr>
</tbody>
</table>

#### postgresql额外的类型

<table>


<colgroup>
<col  class="org-left">

<col  class="org-left">

<col  class="org-left">

<col  class="org-left">
</colgroup>
<thead>
<tr>
<th scope="col" class="org-left">Class name</th>
<th scope="col" class="org-left">Python type</th>
<th scope="col" class="org-left">SQL type</th>
<th scope="col" class="org-left">Arguments</th>
</tr>
</thead>

<tbody>
<tr>
<td class="org-left">PGArray</td>
<td class="org-left">any TypeEngine</td>
<td class="org-left">type engine[]</td>
<td class="org-left">TypeEngine</td>
</tr>


<tr>
<td class="org-left">PGBigInteger</td>
<td class="org-left">int,long</td>
<td class="org-left">BIGINT</td>
<td class="org-left">none</td>
</tr>


<tr>
<td class="org-left">PGInet</td>
<td class="org-left">none</td>
<td class="org-left">INET</td>
<td class="org-left">none</td>
</tr>


<tr>
<td class="org-left">PGInterval</td>
<td class="org-left">none</td>
<td class="org-left">INTERVAL</td>
<td class="org-left">none</td>
</tr>
</tbody>
</table>

#### Oracle额外的类型

<table>


<colgroup>
<col  class="org-left">

<col  class="org-left">

<col  class="org-left">

<col  class="org-left">
</colgroup>
<thead>
<tr>
<th scope="col" class="org-left">Class name</th>
<th scope="col" class="org-left">Python type</th>
<th scope="col" class="org-left">SQL type</th>
<th scope="col" class="org-left">Arguments</th>
</tr>
</thead>

<tbody>
<tr>
<td class="org-left">Oracle</td>
<td class="org-left">byte string</td>
<td class="org-left">RAW</td>
<td class="org-left">length</td>
</tr>
</tbody>
</table>



### JSON支持

这个现在特别值得提一下，现在主流数据库已经都开始支持JSON数据了。sqlalchemy有JSON这个字段类型了，然后postgresql很早就支持了，mysql版本 > 5.7.5 也是支持的了，现在估计大多已经超过这个版本了。

很是好用，强烈推荐读者去了解下：

```
json_data_field = Column(JSON)
```



### insert语句

上面谈及的Table对象调用 `insert` 方法即可产生一个临时表达语句对象（大概类似的东西，这个词是我杜撰的。），比如在执行 `i = users.insert()` 之后:

    >>> type(i)
    <class 'sqlalchemy.sql.dml.Insert'>
    >>> str(i)
    'INSERT INTO users (user_id, name, age, password) VALUES (?, ?, ?, ?)'
    >>>

这个i临时表达语句对象有 `execute` 方法，其可以接受一些参数，比如如下所示:

    i = users.insert()
    i.execute(name='Mary', age=30, password='secret')

这个语句执行之后，该数据就被插入进数据库了。你还可以用execute方法来插入多个值，如下所示:

    i.execute({'name': 'John', 'age': 42},
              {'name': 'Susan', 'age': 57},
              {'name': 'Carl', 'age': 33})

然后如果我们需要使用 `insert ignore` 这样的语句，则需要这样处理:

    i = users.insert().prefix_with('or ignore')
    'INSERT or ignore INTO users (user_id, name, age, password) VALUES (?, ?, ?, ?)'
    >>>

上面的例子是sqlite的情况，mysql那边则需要写成 `.prefix_with('ignore')` 这样的形式。

然后额外值得一提的是: 要真正做到重复刷，primary\_key，也就是这里的 `user_id` 需要具体指定为多少，因为这里的ignore的逻辑就是基于主键列不重复的。

### delete语句

delete语句的使用也类似上面insert语句所谈及的，除了根据SQL delete语句的实际情况，其为第一个可选参数为where过滤字句，如下所示:

    d = users.delete(users.c.password == None)
    >>> str(d)
    'DELETE FROM users WHERE users.password IS NULL'

我们注意到上面 `users.c.password` 的用法，这里的细节后面再讨论，大体意思就是users这个表格的password这一列其值等于None（对应NULL），然后python中的 `is None` 这种写法试了一下并不行。

上面的delete语句是将users表格中password为空的行都删除，然后如果在构建delete语句时，不填任何where语句，则是表格所有记录都将被删除。

    d = users.delete()

### update语句

然后是update语句，下面来更新那几个user的password。 `update` 语句的参数设置如下:

    update(whereclause=None, values=None, inline=False, **kwargs)

我们可以看到其第一个可选参数和delete一样是 `whereclause` where过滤字句，然后第二个values要跟一个字典值，用来表示具体设置的某些值。下面演示逐步构建update语句的风格，这种风格同样适用于 `insert` , `update` , `select` 语句的构建。

    u1 = users.update()
    u2 = u1.where(users.c.name == 'John').values(password='123456')
    >>> str(u1)
    'UPDATE users SET user_id=?, name=?, age=?, password=?'
    >>> str(u2)
    'UPDATE users SET password=? WHERE users.name = ?'

这里str显示参数并没有给打进去，我们 `u2.execute()` 执行的话就会看到实际效果了。

### select语句

select语句和前面谈论的 `insert` 等语句的构建过程类似，只是因为SQL中select语句情况较为复杂，然后select语句还需要考虑具体查询的返回值问题，所以东西很多。

首先我们看下面这个函数:

```python
def show_squery(squery):
    res = squery.execute()
    for r in res:
        print(r)
```

select语句执行之后的返回结果叫做什么 `ResultProxy` 对象，其可以直接用for语句来迭代。不带任何参数的select语句返回Table的所有行:

    >>> show_squery(users.select())
    (1, 'Mary', 30, 'secret')
    (2, 'John', 42, '123456')
    (3, 'Susan', 57, None)
    (4, 'Carl', 33, None)

或者:

    >>> show_squery(users.select(users.c.name=='John'))
    (2, 'John', 42, '123456')

这是 `and_` 或 `&` 的用法:

    >>> show_squery(users.select(and_(users.c.age < 40 , users.c.name != 'Mary')))
    (4, 'Carl', 33, None)
    
    >>> show_squery(users.select((users.c.age < 40) & (users.c.name != 'Mary')))
    (4, 'Carl', 33, None)

类似的还有 `or_` 或 `|` 做逻辑或的意思 ; 或者 `not_` 或 "~" 做逻辑非的意思。

此外还有 `startswith` , `like` , `endswith`

    users.select(users.c.name.startswith('M'))

还有 `between` , `in_` :

    users.select(users.c.age.between(30,39))
    
    users.select(users.c.name.in_('Mary', 'Susan'))

### ResultProxy对象

select语句执行后返回的ResultProxy对象除了可以直接迭代外还有如下这些方法。

-   **fetchone:** 取一行，具体是所谓的 `RowProxy` 对象，其可用api后面会描述之。
-   **fetchmany:** 取多行，具体返回的是一个列表，其内装着 `RowProxy` 对象。
-   **fetchall:** 取所有行，如果fetchmany不指定size则等同于取所有行，返回的是一个列表，其内装着 `RowProxy` 对象。
-   **scalar:** 

-   **keys:** 

-   **rowcount:** 

-   **close:** 

### RowProxy对象

对ResultProxy对象进行迭代，或者fetchone，fetchmany，fetchall方法，就可以获得RowProxy对象，其对应的就是数据库的一行记录。该对象api操作很是灵活，具体你可以像操作一个字典来操作它，也可以类似操作namedtuple般的来操作它，还可以如同列表一般用这样 `[0]` 的索引方法提取某一列，如下所示:

    s = users.select()
    rs = s.execute()
    row = rs.fetchone()
    
    >>> row[0]
    1
    >>> row.name
    'Mary'
    >>> row['password']
    'secret'

## 多表连接

现在代码情况如下所示:

```python
import sqlalchemy
from sqlalchemy import *
from sqlalchemy_utils import database_exists, create_database


def init_sqlalchemy(dburl,echo=True):
    engine = create_engine(dburl,echo=echo)

    if not database_exists(engine.url):###确保目标数据库是存在的。
        create_database(engine.url)

    metadata = MetaData(bind = engine)
    return engine,metadata

engine,db = init_sqlalchemy('sqlite:///test.db')

try:
    users = Table('users',db,autoload=True)
except sqlalchemy.exc.NoSuchTableError:
    users = Table('users', db,
    Column('id', Integer, primary_key=True),
    Column('name', String(40)),
    Column('age', Integer),
    Column('password', String),
)

users.create(checkfirst=True)


insert_query = users.insert().prefix_with('or ignore')
insert_query.execute(id=1,name='Mary', age=30, password='secret')
insert_query.execute({'id':2,'name': 'John', 'age': 42},
    {'id':3,'name': 'Susan', 'age': 57},
    {'id':4,'name': 'Carl', 'age': 33})

delete_query = users.delete()

update_query = users.update()
update_query = update_query.where(users.c.name == 'John').values(password='123456')
update_query.execute()

def run(query):
    query.execute()

def show_squery(squery):
    res = squery.execute()
    for r in res:
        print(r)

try:
    emails = Table('emails',db,autoload=True)
except sqlalchemy.exc.NoSuchTableError:
    emails = Table('emails', db,
    Column('id', Integer, primary_key=True),
    Column('address', String),
    Column('user_id', Integer,ForeignKey('users.id')),
)

emails.create(checkfirst=True)

insert_query = emails.insert().prefix_with('or ignore')
insert_query.execute(
    {'address': 'mary@example.com', 'user_id': 1},
    {'address': 'john@nowhere.net', 'user_id': 2},
    {'address': 'john@example.org', 'user_id': 2},
    {'address': 'carl@nospam.net', 'user_id': 4},
)
```

### 交叉连接或笛卡尔积

下面是交叉连接的情况:

    >>> show_squery(select([users,emails]))
    2015-10-28 20:27:21,721 INFO sqlalchemy.engine.base.Engine SELECT users.id, users.name, users.age, users.password, emails.id, emails.address, emails.user_id 
    FROM users, emails
    2015-10-28 20:27:21,721 INFO sqlalchemy.engine.base.Engine ()
    (1, 'Mary', 30, 'secret', 1, 'mary@example.com', 1)
    (1, 'Mary', 30, 'secret', 2, 'john@nowhere.net', 2)
    (1, 'Mary', 30, 'secret', 3, 'john@example.org', 2)
    (1, 'Mary', 30, 'secret', 4, 'carl@nospam.net', 4)
    (2, 'John', 42, '123456', 1, 'mary@example.com', 1)
    (2, 'John', 42, '123456', 2, 'john@nowhere.net', 2)
    (2, 'John', 42, '123456', 3, 'john@example.org', 2)
    (2, 'John', 42, '123456', 4, 'carl@nospam.net', 4)
    (3, 'Susan', 57, None, 1, 'mary@example.com', 1)
    (3, 'Susan', 57, None, 2, 'john@nowhere.net', 2)
    (3, 'Susan', 57, None, 3, 'john@example.org', 2)
    (3, 'Susan', 57, None, 4, 'carl@nospam.net', 4)
    (4, 'Carl', 33, None, 1, 'mary@example.com', 1)
    (4, 'Carl', 33, None, 2, 'john@nowhere.net', 2)
    (4, 'Carl', 33, None, 3, 'john@example.org', 2)
    (4, 'Carl', 33, None, 4, 'carl@nospam.net', 4)

### 内连接

下面是内连接的情况:

    >>> show_squery(select([users,emails],users.c.id == emails.c.user_id))
    2015-10-28 20:39:09,173 INFO sqlalchemy.engine.base.Engine SELECT users.id, users.name, users.age, users.password, emails.id, emails.address, emails.user_id 
    FROM users, emails 
    WHERE users.id = emails.user_id
    2015-10-28 20:39:09,173 INFO sqlalchemy.engine.base.Engine ()
    (1, 'Mary', 30, 'secret', 1, 'mary@example.com', 1)
    (2, 'John', 42, '123456', 2, 'john@nowhere.net', 2)
    (2, 'John', 42, '123456', 3, 'john@example.org', 2)
    (4, 'Carl', 33, None, 4, 'carl@nospam.net', 4)

sqlalchemy还有一种更智能的内连接用法:

    >>> show_squery(join(users, emails).select())
    2015-10-28 20:40:17,502 INFO sqlalchemy.engine.base.Engine SELECT users.id, users.name, users.age, users.password, emails.id, emails.address, emails.user_id 
    FROM users JOIN emails ON users.id = emails.user_id
    2015-10-28 20:40:17,502 INFO sqlalchemy.engine.base.Engine ()
    (1, 'Mary', 30, 'secret', 1, 'mary@example.com', 1)
    (2, 'John', 42, '123456', 2, 'john@nowhere.net', 2)
    (2, 'John', 42, '123456', 3, 'john@example.org', 2)
    (4, 'Carl', 33, None, 4, 'carl@nospam.net', 4)

### 外连接

外连接如下所示，和写入顺序有关。具体是第一个连接第二个，满足过滤条件的则data收进来，没有的则用NULL填充。

    >>> show_squery(outerjoin(users, emails).select())
    2015-10-28 20:41:16,610 INFO sqlalchemy.engine.base.Engine SELECT users.id, users.name, users.age, users.password, emails.id, emails.address, emails.user_id 
    FROM users LEFT OUTER JOIN emails ON users.id = emails.user_id
    2015-10-28 20:41:16,610 INFO sqlalchemy.engine.base.Engine ()
    (1, 'Mary', 30, 'secret', 1, 'mary@example.com', 1)
    (2, 'John', 42, '123456', 3, 'john@example.org', 2)
    (2, 'John', 42, '123456', 2, 'john@nowhere.net', 2)
    (3, 'Susan', 57, None, None, None, None)
    (4, 'Carl', 33, None, 4, 'carl@nospam.net', 4)
    
    >>> show_squery(outerjoin(emails, users).select())
    2015-10-28 20:43:56,590 INFO sqlalchemy.engine.base.Engine SELECT emails.id, emails.address, emails.user_id, users.id, users.name, users.age, users.password 
    FROM emails LEFT OUTER JOIN users ON users.id = emails.user_id
    2015-10-28 20:43:56,590 INFO sqlalchemy.engine.base.Engine ()
    (1, 'mary@example.com', 1, 1, 'Mary', 30, 'secret')
    (2, 'john@nowhere.net', 2, 2, 'John', 42, '123456')
    (3, 'john@example.org', 2, 2, 'John', 42, '123456')
    (4, 'carl@nospam.net', 4, 4, 'Carl', 33, None)

## ORM风格

sqlalchemy模块的面向对象封装部分改动较大，参考资料1和2里面的内容很多都过时了，没办法只好看嚼官方文档了。

首先我们看到下面这段代码:

```python
import sqlalchemy
from sqlalchemy import *
from sqlalchemy_utils import database_exists, create_database
from sqlalchemy.ext.declarative import declarative_base

engine = create_engine('sqlite:///:memory:',echo=True)

if not database_exists(engine.url):###确保目标数据库是存在的。
    create_database(engine.url)

metadata = MetaData(bind = engine)
Base = declarative_base(bind=engine)

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer,primary_key=True)
    name = Column(String)
    fullname = Column(String)
    password = Column(String)

    def __init__(self,name,fullname,password):
        self.name = name
        self.fullname = fullname
        self.password = password
    def __repr__(self):
        return '<User {}>'.format(self.name)
```

我们调用 `User` 类的 `__table__` ，其实质就是前面no-orm风格提及的Table对象。

    >>> User.__table__
    Table('users', MetaData(bind=Engine(sqlite:///:memory:)), Column('id', Integer(), table=<users>, primary_key=True, nullable=False), Column('name', String(), table=<users>), Column('fullname', String(), table=<users>), Column('password', String(), table=<users>), schema=None)
    >>>

ORM层是通过Session对象来和数据库进行会话的:

```python
from sqlalchemy.orm import *
Session = sessionmaker(bind=engine)
session = Session()
```

下面先将如何通过session进行数据库的CRUD（CREATE RETRIEVE UPDATE DELETE）操作分别说明一下:

### 通过orm层创建数据库

或者引入orm对象之后，调用其 `__table__` Table对象，然后像之前的调用 `create` 方法即可。

```
UserInfo.__table__.create(bind =engine) 
```

**Warning:** 单表这样创建必须没有外键关系，有则会失败。

或者如官方教程推荐的：

```
Base.metadata.create_all(engine)
```

### 增加记录

如下来给某个表格增加一条记录:

    admin = User('admin','administor','admin')
    session.add(admin) # 此外还有 add_all 方法可以一次性添加多个orm对象
    session.commit()

当session `add` 了某一条记录，这种更改称之为on-fly更改，后面谈及的其他基于python对象的操作从而对具体某个记录的某个属性的更改也是如此，都是on-fly模式。也就是只有在执行了 `session.commit()` 之后，所有的更改才会实际刷入数据库，而之前的更改虽然没有实际刷入数据库，但后面代码的查询等等操作都是基于这种改动之后新的（可以看作以某种形式的基于内存的）数据库的。

如果你了解SQL的transaction的概念，就清楚SQL数据库的实现通过transaction来实现数据提交的安全保障——如果一次transaction提交失败，那么将会rollback回滚之，从而保证SQL数据库不会mess up。session有 `rollback` 方法可以主动回滚，这样on-fly的没有commit的所有transaction都会被丢弃。当session `commit` 之后，这次的transaction成功提交了就完成了，下次又是另外一个新的transaction。

### 查询记录

同之前谈及的no-orm风格中提到的select语句查询不同，orm风格的查询语句更加的精简了，但仍然没有脱离select语句查询的本质，熟悉SQL的select语句能够帮助我们更好地学习下面的查询语句。

查询的起步是:

    session.query(User)

其返回的是orm子模块里面的Query对象。User是具体要查询的某个类（对应某个表格）。简单的理解是将这个 `query` 方法看作select操作的 `select * from User` 。 这个Query对象是个可迭代对象，迭代过程中上面返回的就是 User 对象。

若写成这样的形式:

    session.query(User.name, User.fullname)

则大致对应的是 `select name,fullname from User` 。

具体如下所示:

    >>> for i in session.query(User):
    ...  print(i)
    ... 
    <User admin>
    
    >>> guest = User('guest','guest','123456')
    >>> session.add(guest)
    >>> for name,fullname in session.query(User.name,User.fullname):
    ...  print(name,fullname)
    ... 
    admin administor
    guest guest

在学习SQL的select语句的时候我们学到在 `select what from what` 语句之后还可以跟上where字句，order by字句等等。sqlalchemy的orm封装同样支持这样的额外操作，具体就是在上面的query语句的基础上进一步操作。经过这些额外的操作返回的同样还是Query对象，也就是你可以写上 `session.query(User).filter_by(what).filter(what).order_by(what)` 。这样看上去有点长的语句，只要你熟悉SQL语句，并知道在做些什么，那么是完全没有问题的。

#### 过滤排序等操作

-   **filter方法:** filter方法对应select语句的where字句。下面是官方文档的一些例子，复制到这里看看熟悉一下即可，大多是什么含义一般都是清楚的:
```
    query.filter(User.name == 'ed')
    query.filter(User.name != 'ed')
    query.filter(User.name.like('%ed%'))
    query.filter(User.name.in_(['ed', 'wendy', 'jack']))
    query.filter(~User.name.in_(['ed', 'wendy', 'jack']))#not in
    query.filter(User.name == None)
    query.filter(User.name != None)
    query.filter(and_(User.name == 'ed', User.fullname == 'Ed Jones'))
    query.filter(or_(User.name == 'ed', User.name == 'wendy'))
```
- **filter_by方法:** filter_by方法类似filter方法，除了如上面的User.name要写成name，也就是直接引用表格的列名。

```
query.filter_by(name = 'ed')
```

- **order_by方法:** 对应select语句的order by字句。
```
    order_by(User.id)[1:3]
```
然后上面还揭示了 Query 对象很重要的一个特性，其支持python的切片操作。

#### 返回结果

Query对象还可以通过下面这些方法还获得返回结果:

-   **all():** 返回一个列表，包含所有的结果。

-   **first():** 返回第一个结果。如果没有结果则返回None。

-   **one():** 严格只有一个结果，如果有多个结果，将抛出 MultipleResultsFound 异常，如果没有结果，将抛出 NoResultFound 异常。

-   **scalar():** 参考了 [这个网页第五条](http://alextechrants.blogspot.com/2013/11/10-common-stumbling-blocks-for.html) ，执行查询，如果有多条记录命中，则抛出MultipleResultsFound 异常，如果没有命中，则返回None，如果命中数为一条记录，则返回该记录的 <span class="underline">第一列</span> 的值。
-   **count():** 返回命中记录数。

### 更多的查询例子

```
session.query(Game).filter(Game.release_date >= '1999-01-01')
```





#### text函数

text函数用于支持 `filter` 和 `order_by` 方法支持原生的SQL语句表达。大致如下所示，了解下即可:

    from sqlalchemy import text
    session.query(User).filter(text("id<224")).order_by(text("id"))

### 更改记录

更改记录经过ORM封装之后变得很简单了，就是查询之后获得对应的python对象，然后直接修改即可。

```
game = session.query(Game).get(1)
game.name = 'Super Mario Brothers'
session.commit()
```



### 删除记录

    session.delete(jack)

### 批量修改或删除

```
session.query(Game).filter_by(category="RPG").update({"category": "ARPG"})
session.query(Game).filter_by(category="ARPG").delete()
```





## ORM层的关系

SQL表格有四种关系，one-to-one, one-to-many, many-to-one, many-to-many，它们实际上都是基于SQL的外键约束和join查询。其中one-to-many和many-to-one是最需要了解清楚的关系模型，在这之上many-to-many，三个SQL表格搭建起来的关系模型也就很好理解了。推荐读者阅读 [这篇文章](http://code.tutsplus.com/articles/sql-for-beginners-part-3-database-relationships--net-8561) 来更好地理解SQL表格的这四种关系模型。因为one-to-one实际上是one-to-many的特殊情形，而many-to-one实际上是one-to-many模型的反向，所以我们首先需要重点了解one-to-many模型。

### one-to-many模型

sqlalchemy的orm层对one-to-many关系进行了高度封装，使得你不需要考虑SQL的join连接语法细节，只需要声明好外键约束和关系约束（可以看作sqlalchemy新加入了关系约束），然后就可以神奇的使用SQL表格one-to-many的全部特性了。

首先让我们用ORM层的join方法来暂时SQL表格的这些relationship的建立细节，然后再来具体讨论更实用的ORM层的relationship建立的写法。

这是示例代码:

```python
import sqlalchemy
from sqlalchemy import *
from sqlalchemy_utils import database_exists, create_database
from sqlalchemy.ext.declarative import declarative_base

engine = create_engine('sqlite:///test.db',echo=True)

if not database_exists(engine.url):
    print('create new database')
    create_database(engine.url)

metadata = MetaData(bind = engine)
Base = declarative_base(bind=engine)

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer,primary_key=True)
    name = Column(String)
    password = Column(String)

    def __init__(self,name,password):
        self.name = name
        self.password = password
    def __repr__(self):
        return '<User {}>'.format(self.name)

class Email(Base):
    __tablename__ = 'emails'

    id = Column(Integer,primary_key=True)
    email = Column(String)
    user = Column(Integer,ForeignKey('users.id'))

    def __init__(self,email,user):
        self.email = email
        self.user = user
    def __repr__(self):
        return '<Email {}>'.format(self.email)

Base.metadata.create_all(checkfirst=True)### create table

from sqlalchemy.orm import *
Session = sessionmaker(bind=engine)
session = Session()

admin = User('admin','admin')
session.add(admin)
session.add_all([User('Mary','secret'),
    User('John','123456'),
    User('Susan','123456'),
    User('Carl','123456')])

session.add_all([Email('mary@example.com',2),
    Email('john@nowhere.net',3),
    Email('john@example.org',3),
    Email('carl@nospam.net',4)])

session.commit()
```

然后用sqliteman观察数据库情况如下:


![img]({static}/images/python/users_table.png "users_table")

![img]({static}/images/python/emails_table.png "emails_talbe")

`session.query(User,Email)` 返回的是笛卡尔积的形式:

    >>> session.query(User,Email).all()
    [(<User admin>, <Email mary@example.com>), (<User admin>, <Email john@nowhere.net>), (<User admin>, <Email john@example.org>), (<User admin>, <Email carl@nospam.net>), (<User Mary>, <Email mary@example.com>), (<User Mary>, <Email john@nowhere.net>), (<User Mary>, <Email john@example.org>), (<User Mary>, <Email carl@nospam.net>), (<User John>, <Email mary@example.com>), (<User John>, <Email john@nowhere.net>), (<User John>, <Email john@example.org>), (<User John>, <Email carl@nospam.net>), (<User Susan>, <Email mary@example.com>), (<User Susan>, <Email john@nowhere.net>), (<User Susan>, <Email john@example.org>), (<User Susan>, <Email carl@nospam.net>), (<User Carl>, <Email mary@example.com>), (<User Carl>, <Email john@nowhere.net>), (<User Carl>, <Email john@example.org>), (<User Carl>, <Email carl@nospam.net>)]

然后调用Query对象的 **join** 方法执行了内连接:

    >>> session.query(User,Email).join(Email).all()
    [(<User Mary>, <Email mary@example.com>), (<User John>, <Email john@nowhere.net>), (<User John>, <Email john@example.org>), (<User Susan>, <Email carl@nospam.net>)]
    >>>

从这里我们就可以看出一点one-to-many的影子了，注意John对应了两个Email对象。

然后我们稍加过滤条件:

    >>> session.query(User,Email).join(Email).filter(User.name == 'John').all()
    [(<User John>, <Email john@nowhere.net>), (<User John>, <Email john@example.org>)]

或者更明确的查询email:

    >>> session.query(User,Email.email).join(Email).filter(User.name == 'John').all()
    [(<User John>, 'john@nowhere.net'), (<User John>, 'john@example.org')]

此外还有这种形式:

    >>> session.query(Email,User).join(User).all()
    [(<Email mary@example.com>, <User Mary>), (<Email john@nowhere.net>, <User John>), (<Email john@example.org>, <User John>), (<Email carl@nospam.net>, <User Susan>)]
    
    >>> session.query(Email,User).join(User).filter(User.name == 'John').all()
    [(<Email john@nowhere.net>, <User John>), (<Email john@example.org>, <User John>)]

由于内连接虽然输出一行具体输出内容根据你的 `select what` 不同而不同，但具体行数和对于内容的描述上实际上就是一回事。上面是另外一种内连接顺序。然后我们利用这个反向查询某个邮箱的User也是可以的，这就是many-to-one数据模型了。

此外Query对象当然还有 **outerjoin** 方法，因为这里是要描述各关系模型，就略过了。下面介绍ORM层更实用的关系定义方法:

```python
import sqlalchemy
from sqlalchemy import *
from sqlalchemy.orm import *
from sqlalchemy_utils import database_exists, create_database
from sqlalchemy.ext.declarative import declarative_base

engine = create_engine('sqlite:///test.db',echo=True)

if not database_exists(engine.url):
    print('create new database')
    create_database(engine.url)

metadata = MetaData(bind = engine)
Base = declarative_base(bind=engine)

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer,primary_key=True)
    name = Column(String)
    password = Column(String)
    email = relationship("Email",backref=backref('user'))

    def __init__(self,name,password):
        self.name = name
        self.password = password
    def __repr__(self):
        return '&lt;User {}&gt;'.format(self.name)

class Email(Base):
    __tablename__ = 'emails'

    id = Column(Integer,primary_key=True)
    email = Column(String)
    user_id = Column(Integer,ForeignKey('users.id'))

    def __init__(self,email,user_id):
        self.email = email
        self.user_id = user_id
    def __repr__(self):
        return '&lt;Email {}&gt;'.format(self.email)

Base.metadata.create_all(checkfirst=True)### create table


Session = sessionmaker(bind=engine)
session = Session()

admin = User('admin','admin')
session.add(admin)
session.add_all([User('Mary','secret'),
    User('John','123456'),
    User('Susan','123456'),
    User('Carl','123456')])

session.add_all([Email('mary@example.com',2),
    Email('john@nowhere.net',3),
    Email('john@example.org',3),
    Email('carl@nospam.net',4)])

john = session.query(User).filter(User.name == 'John').one()
e1 = session.query(Email).filter(Email.email == 'john@example.org').one()
```

然后我们就可以这样使用了:

    >>> john.email
    [<Email john@nowhere.net>, <Email john@example.org>]
    >>> e1.user
    <User John>

这确实很好用，而这里具体的模型就是one（user）对应many（email）的one-to-many模型。

下面重点介绍一下 **relationship** 这一行具体干了些什么:

    email = relationship("Email",backref=backref('user'))

1.  给User email属性，如上你可以这样 `john.email` 这样调用了。
2.  指定Email对应（many）端（可以理解为这里针对Email执行了内连接操作，当然sqlalchemy具体如何处理的内部细节我还不清楚，但应该差不多就是这个过程。），这样的话具体User.email的值就通过某种机制大概如下所示
```
    >>> session.query(User,Email).join(Email).filter(User.name == 'John').all()
    >>> [(<User John>, <Email john@nowhere.net>), (<User John>, <Email john@example.org>)]
```
这样获得了User John所回应的几个Email对象。具体过程不清楚，但用上面这样的语句来理解应该已经八九不离十了。

### one-to-one模型

one-to-one模型就是one-to-many模型的特例，所以这里先讲了，和上面比较起来区别很小的。

    class User(Base):
        __tablename__ = 'users'
    
        id = Column(Integer,primary_key=True)
        name = Column(String)
        password = Column(String)
        email = relationship("Email",backref=backref('user'),uselist=False)
    
        def __init__(self,name,password):
            self.name = name
            self.password = password
        def __repr__(self):
            return '<User {}>'.format(self.name)
    
    class Email(Base):
        __tablename__ = 'emails'
    
        id = Column(Integer,primary_key=True)
        email = Column(String)
        user_id = Column(Integer,ForeignKey('users.id'))
    
        def __init__(self,email,user_id):
            self.email = email
            self.user_id = user_id
        def __repr__(self):
            return '<Email {}>'.format(self.email)

就加上了 `uselist=False)` 这一句，这样将直接返回某个Email对象。

### many-to-one模型

many-to-one模型实际上和one-to-many模型就是一回事，而且如果我们如同上面的把 `backref` 设置好，针对多个Email对象实际上就可以直接找到某个User对象了，所以为了简单起见，我们可以就直接用one-to-many模型来理解之。

### many-to-many模型

many-to-many模型有点复杂和难于理解，这是因为其还要求有一个额外的Table来管理原两个表格之间的元素的映射关系，幸好sqlalchemy官方文档专门有一小节对这个做出了一些说明。其描述的一个应用场景就是一篇博文有多个标签，然后一个标签有多篇博文（我们可以简单构建出这样一个功能，单击一个标签按钮，然后弹出所有有这些标签的文章出来）。一个博文有多个标签这很简单，一个one-to-many模型就解决了，大概就是 `blog.tags` ，就弹出一个list，里面装着一些标签对象。所以关键性的问题是如何实现出 `tag.blogs` ，就弹出一个list，里面装着一些博文对象。而在 [这篇文章](http://code.tutsplus.com/articles/sql-for-beginners-part-3-database-relationships--net-8561) 的这幅图片中:

![img]({static}/images/python/many_to_many.png ""many-to-many模型")

于是现在的情况变成这样的了，blog one-to-many，但to many的是一个中间表格，而tag one-to-many，这个many也是一个中间表格。我们知道所谓的many一方存储着外键约束值，所以这个中间表格就两列，左列外键引用blog，右列外键引用tag，具体每一个映射关系都要写一条记录上去。不管怎么说，看下面这个例子吧:

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sqlalchemy
from sqlalchemy import *
from sqlalchemy.orm import *
from sqlalchemy_utils import database_exists, create_database
from sqlalchemy.ext.declarative import declarative_base

engine = create_engine('sqlite:///test2.db',echo=True)

if not database_exists(engine.url):
    print('create new database')
    create_database(engine.url)

metadata = MetaData(bind = engine)
Base = declarative_base(bind=engine)

blog_tags = Table('blog_tags',Base.metadata,
    Column('blog_id',Integer,ForeignKey('blogs.id')),
    Column('tag_id',Integer,ForeignKey('tags.id')))

class Blog(Base):
    __tablename__ = 'blogs'

    id = Column(Integer,primary_key=True)
    title = Column(String)
    body = Column(String)

    tags = relationship("Tag",secondary=blog_tags,backref=backref('blogs'))

    def __init__(self,title,body):
        self.title = title
        self.body = body
    def __repr__(self):
        return '<BLog {}>'.format(self.title)

class Tag(Base):
    __tablename__ = 'tags'

    id = Column(Integer,primary_key=True)
    tag = Column(String)

    def __init__(self,tag):
        self.tag = tag
    def __repr__(self):
        return '<Tag {}>'.format(self.tag)

Base.metadata.create_all(checkfirst=True)### create table

Session = sessionmaker(bind=engine)
session = Session()

blog1 = Blog('learning mysql','how to learning mysql')
tag1 = Tag('python')
blog2 = Blog('learning sqlalchemy','how to learning sqlalchemy')
tag2 = Tag('sql')
tag3 = Tag('sqlalchemy')
tag4 = Tag('mysql')

blog1.tags.append(tag2)
blog1.tags.append(tag4)

blog2.tags.append(tag1)
blog2.tags.append(tag2)
blog2.tags.append(tag3)

session.add_all([blog1,blog2,tag1,tag2,tag3,tag4])

session.commit()
```

然后生成的表格如下所示:

![img]({static}/images/python/tags_table.png "tags\_table")

![img]({static}/images/python/blogs_table.png "blogs\_table")

![img]({static}/images/python/blog_tags_table.png "blog\_tags\_table")

然后执行结果如下:

    >>> blog1
    <BLog learning mysql>
    >>> blog1.tags
    [<Tag sql>, <Tag mysql>]
    >>> blog2
    <BLog learning sqlalchemy>
    >>> blog2.tags
    [<Tag python>, <Tag sql>, <Tag sqlalchemy>]
    >>> tag1
    <Tag python>
    >>> tag1.blogs
    [<BLog learning sqlalchemy>]
    >>> tag2.blogs
    [<BLog learning mysql>, <BLog learning sqlalchemy>]

这里的关键就是建立这样一个中间表格:

    blog_tags = Table('blog_tags',Base.metadata,
        Column('blog_id',Integer,ForeignKey('blogs.id')),
        Column('tag_id',Integer,ForeignKey('tags.id')))

然后建立一个这样的relationship:

    tags = relationship("Tag",secondary=blog_tags,backref=backref('blogs'))

其中 **secondary** 参数指定你新建的那个中间表格，然后这个中间表格任何数据都不需要你操心了，只需要如上直接对 `blog1.tags` 这个属性（应该是一个列表）操作就行了。

具体利用ORM层来实现很简单，但我不敢想像sqlalchemy底层到底做了多少工作，不得不承认，这真是sqlalchemy Great的地方。然后值得一提的地方是原来的两个表格都没有外键约束了，可以说这个关系连接的工作完全抽象成为一个表格了。

总之，类似one-to-many一样，在one那里管理某个many方的表格，然后回引backref让many方那个对象也可以使用某个属性，然后定义一个中间表格就行了。many-to-many数据模型还是很有用的。

#### 删除动作

manytomany前面的例子已经说明了如何append一个元素，如果要删除一个元素，调用remove方法即可：

```
blog.tags.remove(the_tag_object)
```



## 高级议题

### cascade

定义基于关系的删除行为

    items = relationship("Item", cascade="all, delete-orphan")

默认值是 save-update  merge

-   save-update

指一个对象 Session.add() 进入之后，和它有关的其他对象都应加进去。

-   merge

和Session.merge行为有关

此外用的最多的是 all 和 delete-orphan

all 指 save-update  merge  refresh-expire  expunge delete

-   delete

和Session.delete行为有关，默认没加delete，则子对象只是parent\_id那里只是赋空值，加了之后子对象也将删除。

-   delete-orphan

增加delete 的删除行为，不仅子对象将被删除，而且子对象也将执行Session delete标记，也就是后面的子子对象也将删除如何和delete一起配合使用的话。

### 自我引用表达树状结构

用一个SQL表格就可以表达出这样的树状层级结构的（这在很大程度上弥补了python语言对于这样的树状结构的应付能力不足）:

    root --+---> child1
           +---> child2 --+--> subchild1
           |              +--> subchild2
           +---> child3

具体写法如下所示:

```python
class Folder(db.Model):
    __tablename__ = 'folders'

    id = db.Column(db.Integer,primary_key=True)
    name = db.Column(db.String(400),nullable=False)
    description = db.Column(db.String(800))
    parent_id = db.Column(db.Integer,db.ForeignKey('folders.id'))
    children = db.relationship("Folder",
        backref=db.backref('parent',remote_side=[id]))
```

具体就是认为 `parent_id` 是NULL的认为是最高级节点，然后每一个子节点都需要描述自己的 `parent_id` 是谁。这里的children是引用的自己，大体类似 `one-to-many` 的写法，也就是一个节点有多个子节点，这个前面将过来。唯一的区别就是设置 `remote_side=[id]` ，似乎这种写法也是可以的 `remote_side=id` ，意思是parent\_id是本地local端的，然后id列是remote端的。更多信息请参看 [官方文档的这里](http://docs.sqlalchemy.org/en/latest/orm/self_referential.html) 。

### 面向ORM的内省机制

如果原数据库表格已经存在，在前面提及可以如下:

    users = Table('users',db,autoload=True)

来自动内省某个表格，而在面向ORM写法中，也是可以的。具体请参看 [官方文档的这里](http://docs.sqlalchemy.org/en/latest/orm/extensions/automap.html) 。其中最核心的代码是:

    engine = create_engine('sqlite:///session.db')
    from sqlalchemy.ext.automap import automap_base
    AutoBase = automap_base(bind = engine)
    
    class OldTable(AutoBase):
        __tablename__ = NewTable.__tablename__

但是具体schema并不是可以任意改动的，一般是继续扩展SQL数据库，然后搭建各种关系，实在有改动schema的必要，推荐采用migrate机制。下面是我写的一个简单的migrate脚本:

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from __future__ import print_function
from __future__ import unicode_literals

import sqlalchemy
from sqlalchemy import *
from sqlalchemy.orm import *
from sqlalchemy_utils import database_exists, create_database
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.ext.declarative import declarative_base

new_engine = create_engine('sqlite:///new_session.db')
Base = declarative_base(bind = new_engine)
old_engine = create_engine('sqlite:///session.db')

class User(Base):
    __tablename__ = 'user'
    id = Column(Integer,primary_key=True)
    username = Column(String(80),unique=True)
    password = Column(String(80))

    def __init__(self,username,password,**kwargs):
        '''kwargs用于收集其他废参数'''
        self.username = username
        self.password = password
    def __repr__(self):
        return '&lt;User {}&gt;'.format(self.username)


def migrate_database(NewTable,fromdb,todb):
    if not database_exists(fromdb.url):
        raise Exception
    else:
        NewTable.__table__.create(checkfirst=True)### create table

    AutoBase = automap_base(bind = fromdb)

    class OldTable(AutoBase):
        __tablename__ = NewTable.__tablename__

    AutoBase.prepare(fromdb, reflect=True)

    Session = sessionmaker(bind=fromdb)
    old_session = Session()

    Session = sessionmaker(bind=todb)
    new_session = Session()

    for q in old_session.query(OldTable).all():
        add_one = NewTable(**q.__dict__)
        new_session.add(add_one)
        new_session.commit()

    print('done')


if __name__ == '__main__':
    migrate_database(User,old_engine,new_engine)
```

但是如果有多个表格加上关系之后情况变得更复杂了，上面的脚本

    AutoBase.prepare(fromdb, reflect=True)

就是建立内省的模型和关系的，所以如果多个表格的话，这句话应该再放到后面些。然后后面添加新的数据因为sqlalchemy有自动处理相关关系对象的功能，这里倒问题不大，但也可能会有问题。也有其他一些模块是专门处理这个迁移数据库的问题的，但也绝不是一件轻松的事。总之SQL表格尽量设计好和可扩展性好，将自己的太多精力花在这上面是很浪费的。

### 面向ORM的数据继承机制

有时间补上。





### 额外的属性支持

所谓的额外的属性并不是基于SQL表格的某一列的属性，而是在ORM之上建立起来的额外的属性，其一般是基于SQL表格的某一列或某些列的，是ORM封装之上提供的更加便利的属性接口。

```python
class EmailAddress(Base):
    __tablename__ = 'email_address'

    id = Column(Integer, primary_key=True)

    _email = Column("email", String)

    @hybrid_property
    def email(self):
        """Return the value of _email up until the last twelve
        characters."""

        return self._email[:-12]

    @email.setter
    def email(self, email):
        """Set the value of _email, tacking on the twelve character
        value @example.com."""

        self._email = email + "@example.com"
```

### 某一列的额外的别名

这里所谓的某一列额外的别名指并没有创建额外的列，而是在ORM层针对某一列可以用额外的别名来做类似的操作。

```python
from sqlalchemy.ext.declarative import synonym_for

class MyClass(Base):
    __tablename__ = 'my_table'

    id = Column(Integer, primary_key=True)
    status = Column(String(50))

    @synonym_for("status")
    @property
    def job_status(self):
        return "Status: " + self.status
```

其等于:

```python
class MyClass(Base):
    __tablename__ = 'my_table'

    id = Column(Integer, primary_key=True)
    status = Column(String(50))

    @property
    def job_status(self):
        return "Status: " + self.status

    job_status = synonym("status", descriptor=job_status)
```

也就是具体该列在ORM层可以通过 `status` 或者 `job_status` 来操作。具体参考 [这里](http://docs.sqlalchemy.org/en/latest/orm/mapped_attributes.html) 。

### 多列组合唯一性约束

请参看 [这个网页](http://stackoverflow.com/questions/10059345/sqlalchemy-unique-across-multiple-columns) 。

如果是ORM层，则是:

    class Location(Base):
        __tablename__ = 'locations'
        id = Column(Integer, primary_key = True)
        customer_id = Column(Integer, ForeignKey('customers.customer_id'), nullable=False)
        location_code = Column(Unicode(10), nullable=False)
        __table_args__ = (UniqueConstraint('customer_id', 'location_code', name='_customer_location_uc'),
                         )

上面flask\_sqlalchemy的话可以使用 `db.UniqueConstraint` 。 比如:

    __table_args__ = (
        db.UniqueConstraint("main_directory", "sub_directory","filename",
            "filext"),
        )

如果是Core层，则是:

    mytable = Table('mytable', meta,
        # ...
        Column('customer_id', Integer, ForeignKey('customers.customer_id')),
        Column('location_code', Unicode(10)),
    
        UniqueConstraint('customer_id', 'location_code', name='uix_1')
        )

### ORM层的内省

Table层直接利用已经存在的数据库表格就是 `reflect` 的概念，因为ORM层多了很多额外的东西，其中最关键的是 relationship 的概念，而sqlalchemy的Automap这一章主要就是解决ORM层内省这个问题的。更详细的讨论请参看 [官方文档](http://docs.sqlalchemy.org/en/rel_1_0/orm/extensions/automap.html) 。

最基本的应用就是 建立一个 `automap_base` 对象: 

    from sqlalchemy.ext.automap import automap_base
    
    Base = automap_base()

然后运行其 `prepare` 方法进行内省:

    Base.prepare(engine, reflect=True)

然后对应的sqlalchemy ORM层的那些类就可以如下获得了:

    User = Base.classes.user
    #或 Base.classes.get('user')

对于一般的属性引用，这是没有问题的。就是relationship可能还是有问题，那么我们可以预先定义一些属性，在 `prepare` 之前，那么预先定义的那些东西也将覆盖后面的自动reflect那部分定义，这可以起到矫正的作用。然后预先定义的那个类就是后面要使用的类了，就不要用 `Base.classes.what` 这种风格再获取了。



### 分表策略

当某个表格数据量过大的时候，那么就需要建立分表策略，具体是根据某个值取模来确定表名，先看例子吧，本例子参考了 [这个网页](https://www.cnblogs.com/carlo/p/4630943.html) 。

```python
class NovelChapter(object):
    _mapper = {}

    @staticmethod
    def model(book_id):
        table_index = book_id % 100
        class_name = 'NovelChapter_{0}'.format(table_index)

        ModelClass = NovelChapter._mapper.get(class_name, None)
        if ModelClass is None:
            ModelClass = type(class_name, (Base,), {
                '__module__': __name__,
                '__name__': class_name,
                '__tablename__': 'bh_novel_chapter_{0}'.format(table_index),

                'id': Column(Integer, primary_key=True),
                # 这里继续填写目标Model的字段定义
            })
            NovelChapter._mapper[class_name] = ModelClass

        return ModelClass

```

上面提供了 `.model` 方法，核心就是利用type函数来生成一个类，也就是人们说的元类编程，具体参数如下：

```
class = type(classname, superclasses, attributedict)
```

至于 `_mapper` 不过是本对象的一个类对象的缓存罢了，免得重复创建。

本例子中最关键的是 `__tablename__` 的差异化定制。



## 附录

### datetime数据类型

sqlalchemy中DateTime 数据类型的默认值可以跟着 datetime.datetime.utcnow
如下所示:
```
    created_date = Column(DateTime, default=datetime.datetime.utcnow)
```

[参考网页](http://stackoverflow.com/questions/13370317/sqlalchemy-default-datetime)

## 如何测试

[参考网页](http://alextechrants.blogspot.fi/2013/08/unit-testing-sqlalchemy-apps.html)

## 参考资料

1.  essential sqlalchemy ; author: Rick copeland ;press:O'REILLY
2.  [a step by step sqlalchemy tutorial](http://www.rmunn.com/sqlalchemy-tutorial/tutorial.html)
3.  [sqlalchemy-essential-tutorial-and-techniques](http://www.pysnap.com/sqlalchemy-essential-tutorial-and-techniques/)
4.  [面向django orm用户的sqlalchemy教程](https://blog.csdn.net/scdxmoe/article/details/73294179)