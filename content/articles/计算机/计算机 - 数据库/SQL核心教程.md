Slug: sql-core-tutorial
Date: 20230309


[TOC]

推荐参考书籍《SQL必知必会》来阅读本文。

本小节主要结合sqlite3来简要说明sql数据库的一些基本理论知识。至于其他SQL数据库比如mysql，postgresql等具体实现的相关知识本文不会讨论。

## 基本术语
数据库（database）简单的理解就是一个文件柜。然后DBMS（database management system）是数据库管理系统。而所谓的 **table** 表你可以将其看作文件柜里的一个结构化了的文件。在表格里面的数据都是 *按行存储* 的，这个要在头脑中牢记。然后一行数据称之为一个 **记录**  。SQL（Structured Query Language）的意思是结构化查询语言。


sqlite3的安装就不罗嗦了，若有问题请从网络查阅之。


## 第一个例子

sqlite3和postgresql不同，其没有客户端/服务器的概念，就是直接的文件管理，sqlite3的数据库就是一个文件，然后如果连接到某个不存在的文件，就会自动创建对应的数据库文件。删除数据库当然就是删除数据库文件即可，这一块sqlite3很简单。

现在我们往这个数据库里面加入一点东西:

```
wanze@wanze-ubuntu64:~/桌面$ sqlite3 mydb
SQLite version 3.8.2 2013-12-06 14:53:30
Enter ".help" for instructions
Enter SQL statements terminated with a ";"
sqlite> create table mytable(id integer primary key, name text);
sqlite> insert into mytable(id,name) values(1,"Micheal");
sqlite> select * from mytable;
1|Micheal
sqlite> .table
mytable
sqlite> .database
seq  name             file                                                      
---  ---------------  ----------------------------------------------------------
0    main             /home/wanze/桌面/mydb                                   
sqlite> .header on 
sqlite> select * from mytable;
id|name
1|Micheal
```

这个例子首先连接之前创建的mydb数据库，然后通过CREATE TABLE语句来创建database数据库里面的一个表，接下来用INSERT INTO语句来给某个表插入一些数据，然后用SELECT语句来查看这些数据。

然后

- `.database` 列出当前连接的数据库信息
-  `.table` 列出当前表格的信息
- `.header on` 显示SQL表格头
- `.quit` 退出sqlite3命令行
- 你还可以通过 `.help` 来查看更多相关信息。

## CREATE TABLE

如下所示就是创建表格的命令格式:

```
CREATE TABLE mytable(
  id     INTEGER PRIMARY KEY, 
  name   TEXT);
```

这里的mytable就是具体创建的表格名字，然后接下来每一行定义了具体表格的某一个字段或者说某一列。第一个是字段的名字，第二个是字段的数据类型定义，后面可选的还可以跟上其他一些约束词。下面先就字段的数据类型做出一些说明。





##字段数据类型

按照 [sqlite3官方文档](https://www.sqlite.org/datatype3.html) 的介绍 ，其就支持五种数据类型：


- NULL 空值
- INTEGER 整型
- REAL 浮点型
- TEXT 字符串型
- BLOB 字节流型

然后sqlite3关于你的类型声明字符串还建立了一套语法糖规则，具体语法糖规则如下所示:


- 如果没有类型声明，则视为none affinity;
- 如果在声明字符串中看到"int"（不区分大小写）这个子字符串，那么就视为integer affinity；
- 继续，接下来如果找到"char"或者"clob"或者"text"，则视为text affinity；所以varchar(80)会被简单视为text affinity;
- 继续，接下来如果找到"blob"，则视为blob，如果没数据类型声明，则视为none affinity;
- 继续，接下来如果找到"real"或者"floa"或者"doub"，则视为float affinity;
- 然后其他的都视为numeric affinity。

这里什么affinity是sqlite特有的概念，比如text affinity和前面的内置TEXT字符串型是不同的，其可能对应的是NULL，TEXT或BLOB。然后如果输入的数值则会自动将其转换成为字符串型。然后NUMERIC会自动分配成为INTEGER或REAL型，如果输入的字符串还负责转化。等等，总之我们在心里知道sqlite3在类型声明上是很灵活的就行了，具体使用还是严格按照自己喜欢的一套类型声明即可，比如这五个:  `null int float text blob` 或者 `null integer float varchar blob` 等等。

##字段约束词

请看下面这个例子:
```
sqlite> CREATE TABLE products(
   ...>   id  int PRIMARY KEY,
   ...>   name text NOT NULL,
   ...>   quantity  int NOT NULL DEFAULT 1,
   ...>   price real NOT NULL);
```


###PRIMARY KEY
一个表格只能有一个PRIMARY KEY，被PRIMARY KEY约束的字段值必须唯一且不为空，从而使其能够成为本表格中各个记录的唯一标识。表格中可以有一个列或者几个列被选定为primary key。值得一提的是 `integer primary key` 自动有了自动分配的属性，也就是大家清楚的id那一列，即使不赋值，也会自动添加。

### NOT NULL

约束该字段不可取空值，也就是该字段必须赋值的意思。

### DEFAULT

指定该字段的默认值。



### 创建表格如果表格不存在

```
create table if not exists department
 (dept_id int primary key,
  name varchar not null
 );
```



## 更改表格属性

sqlite3更改表格属性的功能是很有限的，就只有两个，一个是更改表格名字，还一个是新建一个字段。所以sqlite3主要还是靠CREATE TABLE的时候就把各个字段属性设置好（因为后面有迁移需要则需要单独写脚本）。具体使用就是使用 `ALTER TABLE` 语句，如下所示:

```
ALTER TABLE tablename RENAME TO new_tablename;
ALTER TABLE tablename ADD COLUMN column_name column_datatype;
```

## 删除表格

删除前请慎重。

```
DROP TABLE tablename;
```

## 插入记录

插入一条记录如前所示使用 `INSERT INTO` 语句，具体如下所示：

```
INSERT INTO products (product_no, name, price) VALUES (1, ’Cheese’, 9.99);
```

这是推荐的风格，后面圆括号跟着的列名不一定是按照顺序来，只是和后面的值一一对应，而且一条记录里面的所有列也不需要都列出来，不写的会按照默认值来处理。INSERT INTO语句是通用的。

如果只是需要简单插入新的一行的数据那么可以直接使用之前的insert into语句。
```
sqlite> insert into mytable(age) values(6);
sqlite> select * from mytable;
id          name        age
----------  ----------  ----------
1           Alice
2           Betty
3           Cassie
4           Doris
5           Emily
6           Abby
7           Bella
8                       6
```

### 不重复插入

只有主键值不重复才插入：

```
insert or ignore into department (dept_id, name)
values (1, 'Operations');
insert or ignore into department (dept_id, name)
values (2, 'Loans');
insert or ignore into department (dept_id, name)
values (3, 'Administration');
```

## 更新记录

下面的语句用于更新某个特定的表格的数据：

```
sqlite> update mytable set age=18 where id =1;
sqlite> select * from mytable;
id          name        age
----------  ----------  ----------
1           Alice       18
2           Betty
3           Cassie
4           Doris
5           Emily
6           Abby
7           Bella
8                       6
```



## 删除记录

```
DELETE FROM products WHERE price = 10;
DELETE FROM products;
```


注意：第二个语句表内所有记录都将被删除！ DELETE FROM 语句是通用的。

## 查询记录

为了后面讲解方便，这里根据前面的第一个例子简单创建一个数据库，具体代码如下：

```
~$ sqlite3 test.db

sqlite> CREATE TABLE mytable(id INTEGER PRIMARY KEY, name TEXT);
sqlite> INSERT INTO mytable(id,name) values(1,'Alice');
sqlite> INSERT INTO mytable(id,name) values(2,'Betty');
sqlite> INSERT INTO mytable(id,name) values(3,'Cassie');
sqlite> INSERT INTO mytable(id,name) values(4,'Doris');
sqlite> INSERT INTO mytable(id,name) values(5,'Emily');
sqlite> .header on
sqlite> .mode column
sqlite> SELECT * FROM mytable;
id          name
----------  ----------
1           Alice
2           Betty
3           Cassie
4           Doris
5           Emilyv
```


检索的基本语法如下：
```
sqlite> SELECT id FROM mytable;
```

想要显示多个列则写上多个列名，列名之间用逗号隔开。检索所有列就是列名处用通配符 \verb+*+ 来匹配所有列。

### 排序

用SELECT语句默认情况是没有排序的，如果需要排序则需要使用ORDER BY字句。现在又插入几个新名字：
```
sqlite> INSERT INTO mytable(id,name) values(6,'Abby');
sqlite> INSERT INTO mytable(id,name) values(7,'Bella');
```


如果我们需要输入结果按照name来排序则：
```
sqlite> SELECT id,name FROM mytable ORDER BY name;
id          name
----------  ----------
6           Abby
1           Alice
7           Bella
2           Betty
3           Cassie
4           Doris
5           Emily
```

### 按多个列排序

首先更新之前的表格的一些数据。
```
sqlite> ALTER TABLE mytable ADD COLUMN age int;
sqlite> UPDATE mytable set age=18 WHERE id=1;
sqlite> update mytable set age=20 where id =2;
sqlite> update mytable set age=6 where id =3;
sqlite> update mytable set age=25 where id =4;
sqlite> update mytable set age=30 where id =5;
sqlite> update mytable set age=66 where id =6;
sqlite> update mytable set age=20 where id =7;
sqlite> INSERT INTO mytable(id,name,age) values(8,'Alice',20);
sqlite> SELECT * FROM mytable;
id          name        age
----------  ----------  ----------
1           Alice       18
2           Betty       20
3           Cassie      6
4           Doris       25
5           Emily       30
6           Abby        66
7           Bella       20
8           Alice       20
```


现在开始按多个列排序：
```
sqlite> SELECT * FROM mytable ORDER BY name , age;
id          name        age
----------  ----------  ----------
6           Abby        66
1           Alice       18
8           Alice       20
7           Bella       20
2           Betty       20
3           Cassie      6
4           Doris       25
5           Emily       30
```


我们看到首先按name排序，如果名字相同则按age排序。

### 降序排序

ORDER BY字句默认排序是升序，如果想要其为降序则使用DESC关键词，如下所示:
```
sqlite> SELECT * FROM mytable ORDER BY name , age DESC;
id          name        age
----------  ----------  ----------
6           Abby        66
8           Alice       20
1           Alice       18
7           Bella       20
2           Betty       20
3           Cassie      6
4           Doris       25
5           Emily       30
```


DESC关键词要放在想要降序排序的列的后面。如果想要多个列降序排序，则那些列 \uline{都要加上DESC关键词} 。

### 过滤数据

SQL用WHERE字句来达到查询时过滤数据的功能，如果同时有WHERE字句和ORDER BY字句，则ORDER BY字句要放在后面。

一个简单的例子如下所示:
```
sqlite> SELECT * FROM mytable WHERE age < 30;
id          name        age       
----------  ----------  ----------
1           Alice       18        
2           Betty       20        
3           Cassie      6         
4           Doris       25        
7           Bella       20        
8           Alice       20
```


如果后面的值是字符串则需要加上单引号，如:  'string' ，这些比较符号的含义都是一目了然的，如: = , <> , != , < , <= , !< , > , >= ,!> 。此外还有  BETWEEN 在两个值之间， IS NULL 判断是否为NULL值。

BETWEEN的使用如下:
```
SELECT prod_name, prod_price
FROM Products
WHERE prod_price BETWEEN 5 AND 10;
```

NULL 无值，它与字段包含0，空字符串等不同。 IS NULL 用法如下:
```
SELECT prod_name
FROM Products
WHERE prod_price IS NULL;
```



## 外键引用

外键引用在sqlite3中必须加上这一行设置:
```
PRAGMA foreign_keys = ON;
```


然后后面加入外键引用的语法和mysql有点类似，除了没有 `constraint pk_product_type` 这一描述外。然后sqlite3里面并没有 \textbf{date} 类型的，其内部会自动处理为text,int或real等类型。但我们在声明的时候还是可以这样写的，然后值得一提的是sqlite3里面有一些date相关函数支持。

关于外键引用更多信息请参看 [官方文档的这里](https://www.sqlite.org/foreignkeys.html) 。

```
PRAGMA foreign_keys = ON;

create table if not exists employee
 (emp_id int  primary key,
  fname varchar not null,
  lname varchar not null,
  start_date date not null,
  end_date date,
  superior_emp_id int ,
  dept_id int ,
  title varchar,
  assigned_branch_id int ,
    foreign key (superior_emp_id) references employee (emp_id),
    foreign key (dept_id) references department (dept_id),
    foreign key (assigned_branch_id) references branch (branch_id)
 );
```

## SQL关系模型浅谈

### 内部联接

关于联接的抽象理论讨论还是很有必要的，这里我也谈论一些，但具体还是需要读者自己沉思。我们把一个SQL表格看作一个对应外部世界的模型，你可以将其看作柏拉图所谈论的理念。然后就作为外部世界各个模型来说，彼此之间有两种关系: 第一种是继承关系，第二种是组合关系。所谓继承关系是指对于每一个苹果实体来说，它有各种各样的属性，我们不可能将其装入一个数据库中，比如说本苹果实体的供应商信息，本苹果的重量颜色信息等等。更合理的做法是我们将描述苹果（或者所有产品）供应商信息单独放入一个模型，然后将描述苹果重量颜色等信息也单独放入一个模型，除此之外还有水果店信息等等。我们在实际处理的时候，常常各个衍生模型都有一个 `parent_id` 类似这样的字段属性来描述本衍生模型的该记录所对应的实际母体parent是谁，从而将多个衍生模型在一个实体对象上统一起来，从而形成表的联接。你可以看作表的联接的最终成果就是你心目中所想的那个超大型SQL表格，对应的是苹果这个模型，里面存放着所有一切和该苹果相关的属性信息。然后你用SELECT语句查一下即可。

第二个组合关系就是苹果由苹果皮和苹果肉等部分组成，各子部分和母体一样具有某种实体性，这个时候我们应该在苹果这个模型上加入如同 `pingguopi_id` 和 `pingguorou_id` 这样的字段属性，然后约定其他以 `_id` 结尾的都视作本苹果的组成部分，不是的都视作非其他组成部分独独为我苹果模型所有的属性。这个组合关系也很重要，在后面再谈及，下面主要谈论表格的联接，而这里表格的联接主要在描述模型之间的继承关系。

具体语法如下所示:
```
SELECT name,price,weight
FROM Supplier,Info
WHERE Supplier.parent_id = Info.parent_id
```

这里我们约定Supplier和Info这两个衍生模型内存储的 `parent_id` 具体就应该Pingguo这个模型中的记录号。然后记录号相等就代表着同一个苹果实体。然后将这同一个苹果实体的name, price, weight 等属性列出来。

如果不使用WHERE字句会执行笛卡尔乘积操作，各个字段属性随意组合，没有任何现实意义了。

按照SQL规范，已经不推荐使用这样的WHERE字句表达了，上面的内部联接（INNER JOIN）语句更推荐的是写成这样的形式:
```
SELECT name,price,weight
FROM Supplier INNER JOIN Info
ON Supplier.parent_id = Info.parent_id
```


SQL语法里面有一个专门的术语来形容上面的这个SELECT语句，叫做内部联接。注意WHERE变成了ON，然后使用关键词INNER JOIN。SQL联接默认方式就是内部联接。

## 视图

视图是虚拟的表，其自身并不包含数据，更确切来说只是一种检索手段。视图可以嵌套视图，但需要注意的是视图因为不包含数据，依赖于检索，所以过多使用视图会很降低性能。