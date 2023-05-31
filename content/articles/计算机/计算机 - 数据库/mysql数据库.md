Slug: mysql-database

[TOC]


# 简介

本文已经假设读者对sql有一个初步的认识了，然后更加具体的讨论mysql的相关细节。安装在ubuntu下就简单用apt-get安装之，如下所示，不赘述了。

```bash
sudo apt-get  install mysql-server mysql-client
```

# mysql入门

本小节的代码依次演示了第一个例子，好让读者对mysql有个初步的认识。

## 登录

以root用户登录

    mysql -u root -p
具体密码是多少要根据你安装mysql时的情况来，若没有设置密码则直接按Enter。



## mysql数据库配置

mysql除了在 `/etc` 那边 my.conf 的一些配置外，很多和自身相关的配置在一个名叫mysql的数据库里面。



## 列出数据库

```mysql
show databases;
```



## 切换数据库

我们先切换到那个mysql数据库看一下。

```mysql
use mysql;
```



## 列出表格

```mysql
show tables;
```

上面描述的这些过程你也可以用GUI程序（比如 **emma** 等）来点开看一下。我们先看到user这个表格，这个表格里面存储着mysql用户的一些信息。



## 简单检索某个表格

```mysql
select * from user;
```

因为内容较多，可能显示效果不太好。



## 创建用户

给user表格插入一条记录实际上就是新建一个新的mysql用户，如下所示:

```mysql
insert into user(host,user,password,select_priv,insert_priv)
values('localhost','wanze',password('123456'),'Y','Y');
```



## 删除用户

给user表格删除一条记录就是删除某个mysql用户，让我们把前面创建的这个用户删除了:

```mysql
delete from user where user = 'wanze';
```

好吧，继续再把那个用户加进去，然后我们注意到之前只给了那个用户select和insert的权限的，现在让我们再多给他几个权限。



## 更新记录

```mysql
mysql> update user
    -> set update_priv = 'Y',
    -> delete_priv = 'Y',
    -> create_priv = 'Y',
    -> drop_priv = 'Y'
    -> where user = 'wanze';
```

现在这个用户又新加上了update，delete，create和drop权限了。然后我们看到用户还有很多其他权限设置，

## 用户访问权限管理

除了上面直接修改mysql的user数据库方法之外，推荐用户访问权限管理用下面的语句：

```mysql
GRANT ALL PRIVILEGES ON test.* to 'username'@'localhost';
```

-   这里的test是具体的database name，后面带个 `*` 表示所有表格，如果你想要用户可以访问所有的database，那么可以写 `*.*` 。

-   第二个username是用户名，然后localhost是本地连接。然后我们再来看下面这个例子：

    ```
    GRANT ALL PRIVILEGES ON *.* to wanze@'%' IDENTIFIED BY '123455'; 
    ```

    这里 `%` 表示所有远程连接，你也可以写只是某个host。然后后面跟上 `IDENTIFIED BY` 来设置用户的登录密码。

    



## 创建数据库

我们先创建一个新的数据库:

```mysql
create database test;
```



### 创建数据库指定字符集

```
create database database_name character set utf8 collate utf8_unicode_ci;
```



## 创建表格

```mysql
mysql> create table test(x int,y integer,z integer);
```

这里就简单创建了一个名叫test的表格，然后定义表头为三个整数，integer和int是一个意思。



## 插入数据

插入数据和其他sql数据库一样还是insert into这样的语句格式。

```mysql
mysql&gt; insert into test(x,y,z) values(1,2,3) ;
```

第一个例子就到这里了，简单了解了一下mysql的情况，下面继续详细的讨论。

## 删除table

```mysql
drop table test;
```

## 删除database

```mysql
drop database test;
```

至此我们新建的那个数据库的所有信息都被删除了，下面进入第二个例子，我们将建立更具有现实意义的数据库。

# mysql进阶

首先创建learning\_example database。然后创建一个student用户，其对learning\_example database拥有所有的权限。

```mysql
mysql -u root
mysql> create database learning_example;
mysql> grant all privileges on learning_example.* to 'student'@'localhost';
```

## 创建表格

写好sql语句文件然后刷进去，如下所示:

    mysql -u student learning_example < mysql_learning_example.sql

这里的 `-u` 接用户名，然后后面跟要操作的database名字。

现在这个文件就简单写上这么一句:

```mysql
create table department
 (dept_id smallint unsigned not null auto_increment,
  name varchar(20) not null,
  constraint pk_department primary key (dept_id)
 );
```

这里前面的意思是很明显的，就是新建department这个table，然后定义一列dept\_id ，其为 `smallint` ， `unsigned` （就是从0到65535），然后 `not null` 说这列不能为空，然后 `auto_increment` 说这列的数值自动增加（主要是主键id需要这个）；然后name这一列是 `varchar(20)` ，是变长字符串，最大长度20，类似的还有 `char(20)` ，其为定长字符串，后面都会 <span class="underline">自动填充空格</span> ，同样not null限定非空。然后后面的约束语句需要额外说一下。

`constraint` 是约束的意思，然后后面跟pk\_department（这个名字貌似是随意的）指约束department这个table的primary key，后面跟上primary key (dept\_id) ，即约束table department的主键值为 `dept_id` 这一列。

```mysql
create table if not exists department
 (dept_id smallint unsigned not null auto_increment,
  name varchar(20) not null,
  constraint pk_department primary key (dept_id)
 );

 create table if not exists branch
 (branch_id smallint unsigned not null auto_increment,
  name varchar(20) not null,
  address varchar(30),
  city varchar(20),
  state varchar(2),
  zip varchar(12),
  constraint pk_branch primary key (branch_id)
 );
```

注意前面的创建department表格语句那里加上了 `if not exists` ，这样如果表格不存在才会新建该table，从而避免了sql文件重复刷的时候出错。下面那个新建branch表格的sql语句并没有增加新的东西，所以我们继续往下看。

值得一提的是mysql的date类型只能存储公元前1000年到公元9999年之间的date。

接下来重点讲一下 `foreign key` 约束的写法。

    constraint fk_e_emp_id
      foreign key (superior_emp_id) references employee (emp_id),

这里fk\_e\_emp\_id这个名字带有一定的随意性，大致表达出fk\_然后某个table下的某一列即可。然后 foreign key 外键值 (superior\_emp\_id) 即这一列是外键值，具体references 引用自 employee 这个表格的(emp\_id) 这一列。总的意思就是superiro\_emp\_id这一列是一个外键值约束列，其值只可能取自employee表格的emp\_id这一列，因为这里具体的逻辑含义就是其值引用自它。比如说雇员张三在这里的id是3，张三的上司是张三丰，其id是4。那么张三如果要修改自己的上司值，就必须是本雇员列表已经有了的id号的其他雇员。（外键引用主要用于SQL表格中所谓的one to many 或者 many to one 的情况，具体就是用内连接查询，这样该外键值约束列的可能对应取值是另外一个表格的很多列，这个后面再详细讨论。）

继续刷下去，强烈推荐读者用emma或者其他什么GUI程序来实时查看一下:

```mysql

 create table if not exists customer
 (cust_id integer unsigned not null auto_increment,
  fed_id varchar(12) not null,
  cust_type_cd enum('I','B') not null,
  address varchar(30),
  city varchar(20),
  state varchar(20),
  postal_code varchar(10),
  constraint pk_customer primary key (cust_id)
 );

```

这里值得一讲的有:

    cust_type_cd enum('I','B') not null,

mysql的枚举类型，在这里cust\_type\_cd这一列只能取'I'和'B'这两个值。

## 插入数据

现在我们加入如下代码:

```mysql
insert into department (dept_id, name)
values (null, 'Operations');
insert into department (dept_id, name)
values (null, 'Loans');
insert into department (dept_id, name)
values (null, 'Administration');
```

department的dept\_id已经打开了auto\_increment特性，那么简单的给这一列赋值 `null` 即可，其会自动添加一个主键数字。

在前面创建表格的时候有if not exists逻辑，这样sql脚本可以重复刷都没有问题，那么插入数据也有这样的if not exists逻辑吗？请参看 [这个网页](http://bogdan.org.ua/2007/10/18/mysql-insert-if-not-exists-syntax.html) 。我们可以使用 `insert ignore` 语句来避免重复插入，这是插入语句改成这个样子了:

```mysql
insert ignore into department (dept_id, name)
values (1, 'Operations');
insert ignore into department (dept_id, name)
values (2, 'Loans');
insert ignore into department (dept_id, name)
values (3, 'Administration');
```

注意这里id直接赋值了，因为其为primarykey，如果设置为null这里的语句还是会重复插入，只有primarykey重复了，这个insert语句才不会继续插入了。

然后我们看到下面这句:

```mysql
insert ignore into employee (emp_id, fname, lname, start_date,
  dept_id, title, assigned_branch_id)
values (1, 'Michael', 'Smith', '2001-06-22',
  (select dept_id from department where name = 'Administration'),
  'President',
  (select branch_id from branch where name = 'Headquarters'));
```

## 子查询

SQL有三种类型的表: 一种是大家常见的实际存储的那种SQL表格；第二种是临时表格，也就是子查询返回的表格；还有一种就是虚拟表，比如视图。

所谓的子查询实际上就是一个select语句其将返回一个临时的SQL表格，最简单的应用就是直接跟在另一个select语句的from语句后面，然后还有一种用法常用于表格多列值的复制转移操作，也就是所谓的 `insert select` 语句，其是由一个insert语句和一个select语句组合而成。如下所示<sup><a id="fnr.1" class="footref" href="#fn.1">1</a></sup>:

    INSERT INTO Customers (CustomerName, Country)
    SELECT SupplierName, Country FROM Suppliers;

这个SQL语句将把Suppliers表格里面的SupplierName和Country这两列的值都复制到Customers这个表格中去，具体是对应的CustomerName和Country这两列。

而上面的例子就是第三种用法，其是一个select语句然后 <span class="underline">用括号()括起来了</span> 。其需要返回一列值，然后像上面的情况必须是只有一个值，而这个值将提取出来被insert into语句作为value使用，然后也有返回多个值的情况，比如过滤条件where what in (select &#x2026;) ，这种子查询就可以返回多个值。

我们继续往下看:

```mysql
create temporary table emp_tmp as
select emp_id, fname, lname from employee;

update employee set superior_emp_id =
 (select emp_id from emp_tmp where lname = 'Smith' and fname = 'Michael')
where ((lname = 'Barker' and fname = 'Susan')
  or (lname = 'Tyler' and fname = 'Robert'));
```

这里的 `create temporary table` 语句是根据某个select语句创建了一个临时表格，临时表格只有当前的session看得到，退出session之后该临时表格会自动drop掉。

update语句基本格式我们是熟悉的，关键是理解where字句这个过滤条件。该SQL语句的意思是:将employee表格中Barker Susan和Tyler Robert这两个伙计的上司设置为Michael Smith的emp\_id。这里的过滤条件or逻辑还有and逻辑我想熟悉编程的都很清楚了，这里就不赘述了。



## 交叉连接

接下来的这个语句显得更加复杂了:

```mysql
insert ignore into account (account_id, product_cd, cust_id, open_date,
  last_activity_date, status, open_branch_id,
  open_emp_id, avail_balance, pending_balance)
select 1, a.prod_cd, c.cust_id, a.open_date, a.last_date, 'ACTIVE',
  e.branch_id, e.emp_id, a.avail, a.pend
from customer c cross join
 (select b.branch_id, e.emp_id
  from branch b inner join employee e on e.assigned_branch_id = b.branch_id
  where b.city = 'Woburn' limit 1) e
  cross join
 (select 'CHK' prod_cd, '2000-01-15' open_date, '2005-01-04' last_date,
    1057.75 avail, 1057.75 pend union all
  select 'SAV' prod_cd, '2000-01-15' open_date, '2004-12-19' last_date,
    500.00 avail, 500.00 pend union all
  select 'CD' prod_cd, '2004-06-30' open_date, '2004-06-30' last_date,
    3000.00 avail, 3000.00 pend) a
where c.fed_id = '111-11-1111';
```

该SQL语句主体是insert select语句，然后显得复杂的部分就是那个select语句是有customer（别名c）和一个子查询语句生成的表格（别名e）和另外一个子查询语句生成的表格（别名a）的 `cross join` 而成的一个复杂的表格。

这里我们需要理解cross join这个概念，不知道读者之前接触过inner join，内连接的概念没有，如果接触过那么一定了解了SQL表格在join的时候不加任何过滤条件其生成的表格就是所谓的这两个SQL表格的笛卡尔积。所谓的笛卡尔积就是，假设一个表格有三行，a行b行c行，然后假设另外一个表格有两行，1行和2行，那么这两个表格的笛卡尔积就是生成一个大表格，具体是(a1行a2行b1行b2行c1行c2行)，一共3\*2=6行。

而所谓的cross join交叉连接实际上就是多个表格之间进行笛卡尔积运算之后组合成为一个更大的表格。

## 内连接

我们又看到上面的例子中第一个子查询语句里面还有 `inner join` 关键词，其是所谓的内连接。内连接可以看作是在交叉连接生成的表格的基础上进一步加上了某些过滤条件从而将某些行给删除掉了。

我们首先来看一下:

    select b.branch_id, e.emp_id, e.assigned_branch_id from branch b cross join employee e ;

branch表格有4条记录，branch有18条记录，所以cross join之后将组合出72条记录。

然后我们再来看这个查询:

    select b.branch_id, e.emp_id from branch b inner join employee e on e.assigned_branch_id = b.branch_id;

通常两个SQL表格cross join之后出来的大SQL表格里面有些数据组合是实际可能并不存在的，而上面inner join通过on关键词过滤将使得生成的大SQL表格更具有现实意义。比如这里每一个雇员只可能在某一个分公司，而cross join让每个雇员都有可能在四个分公司了，这里的inner join加上on主要就是控制雇员具体分配的那个分公司正是连接的那个分公司号。这样实现更有现实意义的连接。我们也可以这样理解，雇员的分公司属性id为1，那么在连接分公司表格的时候，只有确定了这个，才能保证分公司表格的其他属性也是属于该雇员的。

现在我们进行到这里了:

    mysql> select b.branch_id, e.emp_id,b.city from branch b inner join employee e on e.assigned_branch_id = b.branch_id;
    +-----------+--------+---------+
    | branch_id | emp_id | city    |
    +-----------+--------+---------+
    |         1 |      1 | Waltham |
    |         1 |      2 | Waltham |
    |         1 |      3 | Waltham |
    |         1 |      4 | Waltham |
    |         1 |      5 | Waltham |
    |         1 |      6 | Waltham |
    |         1 |      7 | Waltham |
    |         1 |      8 | Waltham |
    |         1 |      9 | Waltham |
    |         2 |     10 | Woburn  |
    |         2 |     11 | Woburn  |
    |         2 |     12 | Woburn  |
    |         3 |     13 | Quincy  |
    |         3 |     14 | Quincy  |
    |         3 |     15 | Quincy  |
    |         4 |     16 | Salem   |
    |         4 |     17 | Salem   |
    |         4 |     18 | Salem   |
    +-----------+--------+---------+
    18 rows in set (0.00 sec)

然后通过  where b.city = 'Woburn' 这实际上就限定为具体某一个分公司了。

    mysql> select b.branch_id, e.emp_id,b.city from branch b inner join employee e on e.assigned_branch_id = b.branch_id where b.city='Woburn';
    +-----------+--------+--------+
    | branch_id | emp_id | city   |
    +-----------+--------+--------+
    |         2 |     10 | Woburn |
    |         2 |     11 | Woburn |
    |         2 |     12 | Woburn |
    +-----------+--------+--------+
    3 rows in set (0.00 sec)

然后后面跟了 `limit 1` 这样将只返回一条记录了。然后我们注意到最终cross join生成的大表格还加上了过滤条件 

    where c.fed_id = '111-11-1111';

由于每一个顾客的fed\_id都是唯一的，所以实际上custom表格真正交叉连接的也只有一条记录，这样这个三个表格cross join这个复杂的情况就等同于前面两个表格一条记录属性都加上，再cross 第三个表格，第三个表格有三条记录，这样最终的大表格有三条记录。

## union all

`union all` 将多个数据集进行合并。此外还有一种 `union` 的用法，其中 `union`  会删除重复项，而union all只是单纯的合并。如下所示:

    mysql> select 'CHK' prod_cd, '2000-01-15' open_date, '2005-01-04' last_date,
        ->     1057.75 avail, 1057.75 pend union all
        ->   select 'SAV' prod_cd, '2000-01-15' open_date, '2004-12-19' last_date,
        ->     500.00 avail, 500.00 pend union all
        ->   select 'CD' prod_cd, '2004-06-30' open_date, '2004-06-30' last_date,
        ->     3000.00 avail, 3000.00 pend;
    +---------+------------+------------+---------+---------+
    | prod_cd | open_date  | last_date  | avail   | pend    |
    +---------+------------+------------+---------+---------+
    | CHK     | 2000-01-15 | 2005-01-04 | 1057.75 | 1057.75 |
    | SAV     | 2000-01-15 | 2004-12-19 |  500.00 |  500.00 |
    | CD      | 2004-06-30 | 2004-06-30 | 3000.00 | 3000.00 |
    +---------+------------+------------+---------+---------+
    3 rows in set (0.01 sec)


# 别名

前面说了select字句是不仅可以运算列，还可以重新构建一个列，这些列mysql会自动为其创建默认名字，你也可以明确指定该名字，用如下 **as** 关键词，如下所示:

    select emp_id, 'ACTIVE' as status, emp_id * 3.1415926 as empid_x_pi, upper(lname) as last_name_upper from employee;

**as** 关键词可以省略，表达仍然有效，但还是推荐加上 **as** 关键词，这样SQL语句可读性更高。

# 去除重复的行

如下所示加入 **distinct** 关键词来让select字句过滤掉重复的行。

    select distinct cust_id from account;


# 备份和还原

mysql的备份操作就是使用 `mysqldump` 命令，其将生成一个sql文件，然后还原实际上就是加载这个sql文件即可。

## 还原

过程如下所示:

    mysql -u root -p newdatabase < dump.sql
## 备份
使用 `mysqldump` 命令：

    mysqldump -u user -h 127.0.0.1 -P 8888 -p -v olddatabase > dump.sql

-   **`-u`:** 设置登录用户名
-   **`-h`:** 要连接的数据库服务器地址
-   **`-P`:** 要连接的数据库服务器端口
-   **`-v`:** 显示聒噪信息
-   **`-p`:** 和mysql命令类似，等下输入密码

其后必填参数是你想要dump的某个database名字。

### 备份还加上查询语句

```
mysqldump --tables article --where="created_at > '2017-11-19';"  --databases wxarticles  -u root  -p123456
```



## 重命名数据库

将备份和还原过程组合起来就是重命名数据库了。然后按照 [hendrasaputra](https://stackoverflow.com/questions/67093/how-do-i-quickly-rename-a-mysql-database-change-schema-name)  介绍，如下做可以降低I/O。

```
mysqladmin -u username -p create newdatabase
mysqldump -u username -v olddatabase -p | mysql -u username -p -D newdatabase
```

推荐扩展略读这篇文章，关于mysqlworkbench的相关备份还原和重命名操作：

[mysqlworkbench实现数据库的重命名](https://mp.weixin.qq.com/s/13c5lipEzmLkIynttM3v2g)



# python连接

django连接mysql默认是用的 mysql-python，我更喜欢使用pymysql，你需要在你的 `manage.py`前面加上这样两句： 

```
import pymysql
pymysql.install_as_MySQLdb()
```

参考了 [这个网页](https://stackoverflow.com/questions/34777755/how-to-config-django-using-pymysql-as-driver) 。





## 附录

### server has gone away错误

这个错误可能原因很多，我遇到的情况是mysql的可允许包大小设定得太小了：

```
max_allowed_packet = 16M
```





### 参考资料

1.  本网页主要参考了《SQL学习指南》一书，第二版，Alan Beaulieu著，张伟超，林青松译。

<div id="footnotes">
<h2 class="footnotes">Footnotes: </h2>
<div id="text-footnotes">
<div class="footdef"><sup><a id="fn.1" class="footnum" href="#fnr.1">1</a></sup> <div class="footpara">参考了<a href="http://www.w3schools.com/sql/sql_insert_into_select.asp">这个网页</a>。</div></div>


</div>
</div>