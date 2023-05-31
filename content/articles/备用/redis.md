[TOC]



### redis基础

redis简单来说就是一个基于内存的k-v存储数据库，当然具体内容还是很丰富的，这个后面再慢慢详细讨论之。

就作为python接口和基本的 get set操作都是很直观简单的，这个就不多说了，至于具体数据类型，先知道字符串型即可，哦，对了，redis存储数字1也会变成字符串"1"的。

一个简单的获取redis的连接函数如下所示：

```python
def get_redis_client(db=0):
    host = settings['redis'].get('host', 'localhost')
    port = settings['redis'].get('port', 6379)

    redis_client = redis.StrictRedis(host=host, port=port, db=db, decode_responses=True)
    return redis_client
```

注意看 `decode_responses=True` ，加上的目的就是让python那边接受字符串不是bytes型，也是字符串型，就大部分使用来说都会希望返回的是字符串型。



### 字典类型

确切的描述是 hash 表，大体对应于python那边的字典类型。

```
127.0.0.1:6379> hmset x a 1
OK
127.0.0.1:6379> hgetall x
1) "a"
2) "1"
127.0.0.1:6379> hmset x b 2
OK
127.0.0.1:6379> hgetall x
1) "a"
2) "1"
3) "b"
4) "2"
```



### 设置过期时间

设置某个key的过期时间，

请参看 expire 和 pexpire 命令。



