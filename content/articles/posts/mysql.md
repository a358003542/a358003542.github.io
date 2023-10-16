Slug: mysql
Date: 20230309
Modified: 20231017


[TOC]


在阅读本文之前推荐先阅读 [SQL核心教程]({filename}./SQL核心教程.md) 一文，对SQL语言有一个基本的认识。



### ubuntu22.04安装mariadb

```bash
sudo apt install mariadb-server
```

初次安装还需要运行如下脚本：

```
sudo mysql_secure_installation
```

这里我选择了移除匿名用户，禁止root用户远程登录，移除test database和重载权限表格。

### mariadb设置用户可以远程登录
本小节的讨论主要参考了 [官方文档的这篇文章](https://mariadb.com/kb/en/configuring-mariadb-for-remote-client-access/) 。

首先你需要以root用户的身份登录
```
sudo mysql -u root -p
```

默认是没设密码，直接按Enter。


然后需要如下配置好一个用户访问权限


```mysql
GRANT ALL PRIVILEGES ON *.* TO 'wander'@'192.168.30.%' IDENTIFIED BY 'admin@123' WITH GRANT OPTION;
```
- 第一个 `*.*` 的意思是所有database的所有表格。
- wander这里是具体的用户名，读者请选择自己的。
- 后面是设置一个允许的ip段， `%` 表示所有。也可以写为 `'wander'@'%'` 也就是所有的ip段都允许，但一般不推荐这样写。 
- 后面 `admin@123` 是样例密码，读者请设置为自己的。

然后你还需要把 `/etc/mysql/mariadb.conf.d/50-server.cnf` 文件里面的

```
bind-address     = 127.0.0.1
```
这一行注释掉。

然后再重启mysql服务，则该用户可以远程登录了。

```
systemctl restart mysql
```

### 列出数据库

```mysql
show databases;
```

### 切换数据库

```mysql
use mysql;
```



### 列出表格

```mysql
show tables;
```




### 创建数据库

我们先创建一个新的数据库:

```mysql
create database test;
```



#### 创建数据库指定字符集

```
create database database_name character set utf8 collate utf8_unicode_ci;
```



### 创建表格

```mysql
mysql> create table test(x int,y integer,z integer);
```

这里就简单创建了一个名叫test的表格，然后定义表头为三个整数，integer和int是一个意思。



### 插入数据

插入数据和其他sql数据库一样还是insert into这样的语句格式。

```mysql
mysql> insert into test(x,y,z) values(1,2,3) ;
```


### 删除table

```mysql
drop table test;
```

### 删除database

```mysql
drop database test;
```



### 别名

前面说了select字句是不仅可以运算列，还可以重新构建一个列，这些列mysql会自动为其创建默认名字，你也可以明确指定该名字，用如下 **as** 关键词，如下所示:

    select emp_id, 'ACTIVE' as status, emp_id * 3.1415926 as empid_x_pi, upper(lname) as last_name_upper from employee;

**as** 关键词可以省略，表达仍然有效，但还是推荐加上 **as** 关键词，这样SQL语句可读性更高。

### 去除重复的行

如下所示加入 **distinct** 关键词来让select字句过滤掉重复的行。

    select distinct cust_id from account;


### 备份和还原

mysql的备份操作就是使用 `mysqldump` 命令，其将生成一个sql文件，然后还原实际上就是加载这个sql文件即可。

#### 还原

过程如下所示:

    mysql -u root -p newdatabase < dump.sql
#### 备份
使用 `mysqldump` 命令：

    mysqldump -u user -h 127.0.0.1 -P 8888 -p -v olddatabase > dump.sql

-   **`-u`:** 设置登录用户名
-   **`-h`:** 要连接的数据库服务器地址
-   **`-P`:** 要连接的数据库服务器端口
-   **`-v`:** 显示聒噪信息
-   **`-p`:** 和mysql命令类似，等下输入密码

其后必填参数是你想要dump的某个database名字。

#### 备份还加上查询语句

```
mysqldump --tables article --where="created_at > '2017-11-19';"  --databases wxarticles  -u root  -p123456
```



### 重命名数据库

将备份和还原过程组合起来就是重命名数据库了。然后按照 [hendrasaputra](https://stackoverflow.com/questions/67093/how-do-i-quickly-rename-a-mysql-database-change-schema-name)  介绍，如下做可以降低I/O。

```
mysqladmin -u username -p create newdatabase
mysqldump -u username -v olddatabase -p | mysql -u username -p -D newdatabase
```

推荐扩展略读这篇文章，关于mysqlworkbench的相关备份还原和重命名操作：

[mysqlworkbench实现数据库的重命名](https://mp.weixin.qq.com/s/13c5lipEzmLkIynttM3v2g)



### python连接

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

### 创建用户

给user表格插入一条记录实际上就是新建一个新的mysql用户，如下所示:

```mysql
insert into user(host,user,password,select_priv,insert_priv)
values('localhost','wanze',password('123456'),'Y','Y');
```



### 删除用户

给user表格删除一条记录就是删除某个mysql用户，让我们把前面创建的这个用户删除了:

```mysql
delete from user where user = 'wanze';
```

好吧，继续再把那个用户加进去，然后我们注意到之前只给了那个用户select和insert的权限的，现在让我们再多给他几个权限。



### 更改用户权限

```mysql
mysql> update user
    -> set update_priv = 'Y',
    -> delete_priv = 'Y',
    -> create_priv = 'Y',
    -> drop_priv = 'Y'
    -> where user = 'wanze';
```

现在这个用户又新加上了update，delete，create和drop权限了。然后我们看到用户还有很多其他权限设置，



### 参考资料

1.  本网页主要参考了《SQL学习指南》一书，第二版，Alan Beaulieu著，张伟超，林青松译。


[^1]: 参考了 [这个网页](http://www.w3schools.com/sql/sql_insert_into_select.asp)
