Slug: postgresql
Date: 20201018

[TOC]

## 安装和配置

在ubuntu下可以这样简单安装之：

```sh
sudo  apt-get install postgresql
```

centos下如下安装：

```sh
sudo yum install postgresql-server postgresql-contrib
```

centos下继续运行以下命令：

```sh
sudo postgresql-setup initdb
```

这样安装之后，你需要牢记一点的是，新安装的PostgreSQL数据库还只有 **postgres** 这个用户有新建role（或说用户）和新建数据库的权限。你需要通过 postgres 这个用户来执行 `createuser` 或 `createdb` 命令。这里我们先不急着学习SQL语句，因为postgresql里面关于用户群组权限的设置稍微有点复杂，而要使用postgresql，这一块是必须有个基本的了解的。

## 用户群组权限管理

postgresql处理我们通常所谓的登录用户或者其他用户概念的术语是Rules，后面都称之为用户（rules），可以理解为为这个用户确立的一系列访问修改数据库的规则。然后rules是可以包含其他rules的，这个包含其他rules的rules我们通常称之为群组（group rules），然后群组也可以包含群组，但一般都推荐简单分为用户（rules）和群组用户（group rules）这两类。然后用户如果有登录权限的话则可以称之为登录用户（login rules），群组用户也可以赋予登录权限，但出于简单的考虑没谁这么做。所以现在rules简单的划分就分为这三类:

1.  一般用户，这里主要指没有登录权限的一般用户。
2.  登录用户，或叫做一般登录用户，其属于一般用户，但有登录权限。
3.  群组用户，包含一般用户的rules。

此外postgresql还提供 **superuser** 超级用户这一类型，其默认不能登录，但对于数据库几乎拥有所有的权限——比如创建数据库，创建用户，对于数据库的查增删改等。实际上superuser也可以加上 `login` 属性，但非常不推荐这么做，最好是不使用超级用户，而是对于具体的用户具体的数据库权限进行分配。

默认创建的postgres这个用户是可以连接的，而且我们看到其至少对postgres这个数据库具有所有权限，但是我还不太确定其是不是superuser，因为其可能对其他数据库并没有权限，这个后面再谈。

### 修改postgres的密码

    sudo -u postgres psql postgres
    
    postgres=# \password postgres
    Enter new password: 
    Enter it again:

这里需要强调一点的是这里通过psql来进行连接（postgres）然后输入 `\password` 修改postgres的密码是具体通过 TCP/IP 方式连接postgresql数据库的密码，不是系统passwd管理的那个密码。

### postgres这个用户

postgres这个用户的一些信息如下所示:

    postgres:x:121:131:PostgreSQL administrator,,,:/var/lib/postgresql:/bin/bash

然后还有新建的postgres这个群组:

    postgres:x:131:

这里的121是uid，131是gid，然后后面 `/var/lib/postgresql` 这个文件夹就是postgres该用户的主文件夹，你的关于postgresql的一些配置和数据都放在这里面的。你可能会遇到保存 `.psql_history` 这个文件的权限问题，参看 [这个网页](http://dba.stackexchange.com/questions/68705/could-not-save-history-to-file-var-lib-postgresql-psql-history-no-such-file) ，这个时候需要确认该文件夹的所有用户和所有群组都是postgres。

### 查看当前有多少用户

按照 [这篇网页](http://stackoverflow.com/questions/32151288/how-is-there-a-pg-roles-table-in-postgres-before-a-database-is-created) 的介绍， `pg_roles` 是一个view视图，其只是一个对 `pg_authid` 的简单可读的视图封装，如下面所示，两者目前来说没有差异，然后我们看到postgres其是为superuser，也是login user。

    select rolname,rolsuper,rolcreaterole,rolcreatedb,rolcanlogin from pg_roles;
     rolname  | rolsuper | rolcreaterole | rolcreatedb | rolcanlogin 
    ----------+----------+---------------+-------------+-------------
     postgres | t        | t             | t           | t
     wanze    | t        | t             | t           | t
    
    select rolname,rolsuper,rolcreaterole,rolcreatedb,rolcanlogin from pg_authid;
    
     rolname  | rolsuper | rolcreaterole | rolcreatedb | rolcanlogin 
    ----------+----------+---------------+-------------+-------------
     postgres | t        | t             | t           | t
     wanze    | t        | t             | t           | t

### 新建用户

新建一个用户:

    create role the_name;

但最起码要有登录login权限吧:

    create role the_name login;

在使用postgresql时，如果某个用户不存在，那么PostgreSQL将会报错: 

    createdb: could not connect to database template1: FATAL:  role "wanze" does not exist

### 删除用户

    drop role the_name;

或者该用户名不存在也不会报错的写法:

    drop role if exists the_name;

### 改变用户的权限

如下所示就改变一个用户的权限了。

    alter role the_name createdb;

参照手册，后面的关键词有:

    SUPERUSER | NOSUPERUSER
    CREATEDB | NOCREATEDB
    CREATEROLE | NOCREATEROLE
    CREATEUSER | NOCREATEUSER
    INHERIT | NOINHERIT
    LOGIN | NOLOGIN
    REPLICATION | NOREPLICATION

### 改变用户密码

在新建用户的时候，我们可以如下:

    create role the_name password "the_password";

后面也可以通过 `alter role` 来:

    alter role the_name password "the_password";
### 新建一个群组

    CREATE ROLE royalty INHERIT;

给群组用户增加登录用户

    GRANT royalty TO leo;
    GRANT royalty TO regina;

### pg_hba.conf

很多连接问题就是因为这个文件没有配置好，下面详细研究这个文件之。

```
#
# local      DATABASE  USER  METHOD  [OPTIONS]
# host       DATABASE  USER  ADDRESS  METHOD  [OPTIONS]
# hostssl    DATABASE  USER  ADDRESS  METHOD  [OPTIONS]
# hostnossl  DATABASE  USER  ADDRESS  METHOD  [OPTIONS]
```

-   local 是指本地连接

-   host 是指plain或者ssl加密的TCP套接字连接（一般指http和https）

-   hostssl 是指ssl加密的TCP套接字连接

-   hostnossl 是指plain 简单的TCP套接字连接

-   DATABASE 设置要连接的数据库，常见的all

-   ADDRESS 有 127.0.0.1/32 也就是本地连接ipv4，或者 0.0.0.0/0 指所有的ipv4外网。这是一种网域段表示法。

-   METHOD 有trust，reject，md5（加密的密钥），password（明文密钥）
    让人困惑的peer方法查阅文档解释如下：

    >   The peer authentication method works by obtaining the client's operating system user name from the kernel and using it as the allowed database user name (with optional user name mapping). This method is only supported on local connections.
    >
    >   peer认证方法获取客服端操作系统的用户名，然后将其作为允许数据库的用户名。这个方法只适用于local连接。


ident方法如果是本地连接的话就会使用peer方法，官方文档在解释上字面也很相同，区别就在 `an ident server ` ,一个是from kernel， 一个是from ident server， 这个暂时不懂？




## psql

这里参考了 [这个网页](http://dba.stackexchange.com/questions/1285/how-do-i-list-all-databases-and-tables-using-psql) 。

-   **`\l` 或 `\list`:** 列出所有的数据库
-   **`\du`:** 列出所有的用户
-   **`\dt *`:** 列出当前数据库所有的表格
-   **`\c` 或者 `\connect`:** 切换数据库



## 数据库操作基础

### 创建数据库

    CREATE DATABASE mydb;

有 CREATEDB 权限的用户可以新建数据库。

然后创建一个数据库，并指定这个数据库的owner。

    CREATE DATABASE mydb WITH owner = mydb_admin;

然后以mydb\_admin登录开始进行数据库的其他操作。

### 备份和还原

两个backup方法  pg\_dump 和 pg\_dumpall
用pg\_restore 来还原，

### 改变某个数据库的所有者

首先你需要以postgres的身份连接postgres数据库，因为你要进行更改某个数据库的所有者，就必须是目前该数据库的所有者。

    wanze@wanze-ubuntu:~$ sudo -u postgres psql postgres
    psql (9.3.8)
    Type "help" for help.
    
    postgres=# ALTER DATABASE mydb OWNER TO learner;
    ALTER DATABASE
    postgres=# \q

这里ALTER DATABASE语句里面 mydb 是具体你要更改的数据库名字，然后后面的learner是具体更改为的所有者名字。

类似上面谈及的，还有 **dropdb** 用于删除数据库， **dropuser** 用于删除用户。

CREATE TABLE语句我们都熟悉了，不过具体到数据类型上，还需要详细讨论一番。

### postgresql字段数据类型

int , smallint , real , double precision ,
char( N ) , varchar( N ) , date , time , timestamp , and interval ,

而postgresql支持的数据类型就多了，有：int，smallint，real，boolean，date，time，integer，text，char(N)，varchar(N) 甚至还有json。这个可以后面慢慢了解，更多细节请具体参看官方文档第八章 Data Types，这是 [版本9.3的网页链接](http://www.postgresql.org/docs/9.3/static/datatype.html) 。

其中对于整数简单的就用integer，字符串简单的就用text，然后小数简单的就用real，布尔值就用boolean，此外还有一些特殊用途的数据类型值得引起我们的注意，如uuid，json，arrays，money，bytea，还有日期和时间的date，time；几何类型支持的point，line等等



## Cookbook

### 修改某列为unique

参考了 [这个网页]( https://stackoverflow.com/questions/469471/how-do-i-alter-a-postgresql-table-and-make-a-column-unique ) 。

```sql
ALTER TABLE the_table ADD CONSTRAINT constraint_name UNIQUE (thecolumn);
```

### 删除基于某列重复值的重复行

参考了 [这个网页]( https://stackoverflow.com/questions/6583916/delete-duplicate-records-in-postgresql ) 。

```sql
DELETE FROM dupes T1
    USING   dupes T2
WHERE   T1.id < T2.id  -- delete the older versions
    AND T1.key  = T2.key;  -- add more columns if needed
```

USING语句有点古怪，具体要参看postgresql的delete一章，里面就介绍了如下语法：

```
DELETE FROM [ ONLY ] table_name [ * ] [ [ AS ] alias ]
    [ USING using_list ]
    [ WHERE condition | WHERE CURRENT OF cursor_name ]
    [ RETURNING * | output_expression [ [ AS ] output_name ] [, ...] ]
```

```
using_list
A list of table expressions, allowing columns from other tables to appear in the WHERE condition. This is similar to the list of tables that can be specified in the FROM Clause of a SELECT statement; for example, an alias for the table name can be specified. Do not repeat the target table in the using_list, unless you wish to set up a self-join.
```

```
DELETE FROM films USING producers
  WHERE producer_id = producers.id AND producers.name = 'foo';
```

这个using和select里面的using有点区别，这里的using更像是引用了某个表，让其可以在后面的where语句中使用。

### 理解postgresql的timestamptz字段类型

首先数据库里面都应该是存放UTC时间，只是说以前使用timestamp的时候是属于程序上的强制性规范要求，这样避免各种纠结时区问题。而现在postgresql的timestamp字段对外说是支持时区的，但其实它内部存放的还是UTC时间，只是它帮你进行了一些自动转换。

如果你是以isoformat格式存放进入timestamptz字段，或者以isoformat格式查询时间，程序员都是不用操心时区的问题的，因为isoformat里面已经有时区信息了。为了你的程序各方面表现良好，推荐你程序运行时的服务器时区设置好。然后如果你数据库服务器时区设置好在查看时间上会有更好的本地体验。





## 附录

### 配置文件在那里

    sudo -u postgres psql postgres
    
    psql> SELECT name,setting FROM pg_settings WHERE category = 'File Locations';
           name        |                 setting                  
    -------------------+------------------------------------------
     config_file       | /etc/postgresql/9.3/main/postgresql.conf
     data_directory    | /var/lib/postgresql/9.3/main
     external_pid_file | /var/run/postgresql/9.3-main.pid
     hba_file          | /etc/postgresql/9.3/main/pg_hba.conf
     ident_file        | /etc/postgresql/9.3/main/pg_ident.conf
    (5 rows)



### 重启postgresql服务

在linux下可以运行如下命令行来达到目的:

    sudo service postgresql restart

或者

    sudo service postgresql reload

## 参考资料

1.  PostgreSQL官方参考文档
2.  PostgreSQL Up and Running, 2nd Edition