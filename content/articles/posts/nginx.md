Slug: nginx
Date: 20190918


[TOC]
## 前言

nginx的官方文档在 [这里](http://nginx.org/en/docs/) ，有问题主要还是参看官方文档吧。

### 安装

debian系安装:

    sudo apt-get install nginx

rpm系统安装:

    sudo yum install nginx

### nginx配置基础

nginx的配置就是在 `/etc/nginx/sites-available` 那里新建一个配置文件，然后这样创建一个符号链接到 `sites-enabled` 那里。

    sudo ln -s /etc/nginx/sites-available/cdwanze.work /etc/nginx/sites-enabled/cdwanze.work

然后重启nginx即可。 

    sudo service nginx restart

nginx配置文件的基本格式是:

    <section> {
        <directive>  <parameters>;
    }

### nginx命令行
- nginx -t  测试

- nginx -s stop 快速停用nginx

- nginx -s quit 温和的退出nginx

- nginx -s reload 重载配置文件

  



## 通用配置

这里的所谓通用的配置也就是所谓的 global section ，这些配置将影响整个server，我们常在 `nginx.conf` 中看到这些配置。

### user

 当前工作进程下的user用户名。



###  worker_processes
工作进程数，在 [server-configs-nginx](https://github.com/h5bp/server-configs-nginx) 项目中的推荐设置如下:

```
    # Sets the worker threads to the number of CPU cores available in the system for best performance.
    # Should be > the number of CPU cores.
    # Maximum number of connections = worker_processes * worker_connections
    worker_processes auto;
```
### error_log

其他地方没设置的话，默认的错误日志输出路径。

推荐将 `/etc/nginx/logs` 和 `/var/log/nginx` 用ln命令统一起来：

```
ln -s /var/log/nginx /etc/nginx/logs
```



## http部分配置

http部分也就是所谓的 `http` section部分配置，其是基于http module。http section部分后面有这么一句:

      include sites-enabled/*;
    }

这是把额外的站点配置放在 `sites-enabled` 文件夹下管理，同时也说明了后面提到的server 部分应该放入http 部分中，在实践中人们会创建一个 `sites-available` 文件夹，在下面创建一些站点配置，实际启用就用ln 命令来创建一个符号链接。



### keepalive_timeout

设置响应头 KeepAlive 的时间。



### server_tokens

默认on 推荐off。把nginx的版本信息隐藏起来。







常常有些需求最后要到这里来配置。比如说 `client_max_body_size` ，如果你遇到nginx请求实体过大错误信息:

    Nginx 413 Request Entity Too Large

参考了 [这个网页](http://www.cyberciti.biz/faq/linux-unix-bsd-nginx-413-request-entity-too-large/) ，你需要在http section里面如下配置:

    # set client body size to 2M #
    client_max_body_size 2M;

## server部分配置

listen和server_name 的配置很基本和关键，具体请参看附录介绍的nginx分配请求逻辑。



## location部分配置

location部分配置是放在 server部分里面的。 location部分描述了 遇到什么url 该做什么动作。

对于url的匹配，nginx认为没有正则表达式的最长匹配为最佳匹配，然后再开始按照正则表达式进行匹配。

一般的静态文件服务如下：

```
location /static {
    root /whrer/your/static;
}
```

或者反向代理服务：

```
location / {
    proxy_pass http://127.0.0.1:5000;
}
```



这种反向代理，一个很重要的知识点就是uri的改写规则。这里面东西也很多，比如下面的这个:

    location /socket.io {
        proxy_pass http://127.0.0.1:5000/socket.io;
    }

匹配到的部分会被改写为 `http://127.0.0.1:5000/socket.io` 但是也有些例外的情况，以后再详细讨论之。

### root和alias的区别

比如说想要服务一些静态文件：

```
 location /static/ {
      root /home/cdwanze/project/tinyblog;
      autoindex off;
  }	
```

 root在这里的意思是，我们从root开始找，`/static/???`  根据 url 传过来的 full path。注意如果用root，就不要再指定static文件夹名了。

而 alias的意思是：

```
 location /static/ {
      alias /home/cdwanze/project/tinyblog/static;
      autoindex off;
  }	
```

`/static/` 将被替换为 `/home/cdwanze/project/tinyblog/static/???` 去找那个文件。

本小节参考了 [这个网页](https://stackoverflow.com/questions/10631933/nginx-static-file-serving-confusion-with-root-alias) 。

## 附录

### nginx分配请求逻辑

这部分内容很关键，慢慢看下吧。

1.  根据请求的ip和端口号来核对 `listen` 信息。
2.  根据请求Host字段来核对 `server_name` 信息。
    -   核对由继续分为 *通配符前* 核对
    -   *通配符后* 核对
    -   正则表达式 核对
3.  以上listen和server\_name的核对最后若都没有匹配最后都会回滚到默认的 default_server 中。(实践中推荐default_server return 444，来提升服务器的安全访问级别。)

```
server {
    listen 80 default_server;
    return 444;
}
```

4.  以上核对若匹配则进一步根据相应的配置来进行请求处理。

### 403没有权限访问错误

我需要在本用户的主文件夹下的随便某个文件夹来写一些网页，然后nginx的server的 `root` 配置好后可能会出现 403错误，这很有可能是你 `nginx.conf` 文件的 `user` 配置，没有设置为本用户，所以才无权限操作。ubuntu下那个user好像默认的是var-www这个。将其改为你的用户名即可。参看了 [这个网页](http://zoroeye.iteye.com/blog/2166174) 。

## 参考资料

1.  mastering nginx
2.  nginx 官方手册