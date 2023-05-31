Slug: gunicorn
Date: 20190918
Status: draft

[TOC]

## 简介

gunicorn 挂载python的 wsgi 服务还是不错的，多进程多线程支持，大大提升服务性能。



## 配置

配置可以就是一个python文件，然后大体内容如下：

```python
from multiprocessing import cpu_count
from os import environ

def max_workers():
    return cpu_count()


bind = '127.0.0.1:8000'
max_requests = 1000

worker_class = 'gevent'
workers = max_workers()

```

写上这么一个python文件之后，启动gunicorn挂载django服务大体如下：

```
gunicorn -c gunicorn_config.py youapp.wsgi
```

其他配置还有：

- pidfile
- reload 代码改变之后自动reload，这个前期开发会很有用
- accesslog access日志所在地
- errorlog error 日志所在地
- workers  进程数
- threads 一个进程的线程数
- worker_class 
- worker_connections 单进程最大连接数
- loglevel 日志级别



