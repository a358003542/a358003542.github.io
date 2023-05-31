Tags: sql, database
Date: 20201121
Slug: sql-database-cookbook


[TOC]



## 前言

这里列出一些个人日常操作遇到的案例，可以参考学习，也可以触类旁通的学习下SQL的高级知识。



## 根据某些条件删除某个表格的重复行

```sql
DELETE FROM news T1
   USING  news T2
 WHERE  T1.id < T2.id -- delete the older versions
   AND T1.url = T2.url; -- add more columns if needed
```

上面这句话的意思是删除本news表格中url重复的行，删除的是那些id小的行（T1.id< T2.id）

这里delete语句使用using说简单点就是后面的where子句可以使用该表格，类似于select的from；说复杂点如果是本表格的话，那么就是自连接self-join。

对于join的简单理解就是 (a,b) * (a, b) => a a , a b , b a , b b 这样的SQL表格笛卡尔乘积组合然后再基于后面where给定的条件进行过滤。这里的 delete ... using ... 参考 [postgresql的文档]( https://www.postgresql.org/docs/9.5/sql-delete.html ) 使用自己的表格名字就是self-join，而本表格和本表格的inner join组合后面的过滤进行过滤，下面举个例子可能会更加清晰一点：

| id   | url  |
| ---- | ---- |
| 1    | a    |
| 2    | b    |
| 3    | a    |

如果self-join后形成了这样的组合：

```
1 a --- 1 a
1 a --- 2 b
1 a --- 3 a
2 b --- 1 a
2 b --- 2 b
2 b --- 3 a
3 a --- 1 a
3 a --- 2 b
3 a --- 3 a
```

然后再过滤，首先是url相等的行 

```sql
select * from newtable T1  
inner join newtable T2
on T1.url = T2.url
```


```
1 a --- 1 a
1 a --- 3 a
2 b --- 2 b
3 a --- 1 a
3 a --- 3 a
```

其次是 id小一点的

```sql
select * from newtable T1  
inner join newtable T2
on T1.url = T2.url
where T1.id < T2.id
```

```
1 a --- 3 a
```

最后得到的T1 的 1 a 这一行，然后执行delete操作将其删掉。

这里我们看到self-join的情况要非常注意重复行的过滤，比如如果上面是 T1.id <= T2.id 那么就会将整个表格给删掉。



## 根据表格的某个字段值更新本表格

```sql
update news 
set insert_time = t2.pub_time
from news t2
where news.html = '' and news.insert_time >= '2019-11-19' and news.id = t2.id; 
```

同样参考postgresql的官方文档，这里update...from... 也类似于 select 里面的from_list table，如果是本表格自身的话那么就是 self join。

这样self join之后后面你的update操作是可以引用这个表格的值的。



## 快速检查某一行是否存在

参考了 [这个网页](<https://stackoverflow.com/questions/7471625/fastest-check-if-row-exists-in-postgresql> ) ，如下所示：

```
select exists(select 1 from contact where id=12)
```

这里值得一提的是，用python的SQL数据库通用的DB2接口，也就是pymysql或者psycopg2查询得到的直接是python的bool对象，True或者False，因为上面使用exists函数。