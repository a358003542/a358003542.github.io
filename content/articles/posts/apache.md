Slug: apache
Date: 20190918

[TOC]


## 前言

关于apache2 web server的简要介绍请参看 [apache http server wiki](https://zh.wikipedia.org/wiki/Apache_HTTP_Server) 。目前推荐使用apache2.4，这是它的 [apache官方文档](http://httpd.apache.org/docs/2.4/) 。

Ubuntu系统或者Centos系统之间httpd的安装配置环境等差异很大，我想说的是那些知识都不是重点，跟着官方文档，咱首先折腾出一个绿色本地安装版本的httpd，然后跟着官方文档学配置才是王道。什么在那个系统那个命令啊，那个系统那个文件夹下那个配置啊都是不重要的东西。

## apache的本地安装

apache本地安装过程大体分为下面几步：


- 安装apr


- 安装apr-util
- 安装httpd
- 安装mod_wsgi （可选项，使用django或者flask你需要它的）

更多的细节在官方文档的 install 那一章节里，读者如果懂ansible的话，可以看看 我写的 [green-install项目](https://github.com/a358003542/green-install)  里面的apache role 部分。

正如前面说到的，日志文件在那里，配置文件在那里加载啊等等都是可以定制的，摸清楚配置语法才是王道。



## 挂个简单的静态网站

首先httpd.conf 那里我们写上了 `LISTEN 80` 了，这样apache将会监听80端口。你的域名指向你的远程服务器ip就可以了。然后一般我们在httpd.conf 后面写上这么一句： 

```
Include conf.d/*.conf
```

也就是conf.d文件夹下的所有配置自动加载进来。这个conf.d文件夹和conf文件夹是平行关系。然后conf.d里面我们主要就是定义 `VirtualHost` 。

上个完整的例子吧：

```
<VirtualHost *:80>
    ServerName www.cdwanze.work
    DocumentRoot /home/wanze/venv/html
    DirectoryIndex index.html	
    
    <Directory /home/wanze/venv/html >
        <IfVersion >= 2.4>
            Require all granted
        </IfVersion>
        <IfVersion < 2.4>
            Order deny,allow
            Allow from all
        </IfVersion>
    </Directory>

</VirtualHost>
```


- ServerName： apache监听80端口的信号将经过这个ServerName进一步进行分发，比如请求域名是 api.cdwanze.work，那个这个情况将不会被上面例子的VirtualHost处理。
- DocumentRoot ： 服务的静态网站的那些内容所在的文件夹。重要级别五颗星。
- DirectoryIndex ： 某些文件夹请求比如 /a/b ，如果这个文件夹下有index.html文件，那么将显示这个文件的内容。
- Directory： 文件夹权限管理，重要级别五颗星，不写就会出现没有权限访问错误。

```
403 Forbidden You don't have permission to access / on this server
```

apache2.4版本使用语法是 `Require all granted` ，对应的原2.2的配置是：

```
Order allow,deny

Allow from all
```



有考究癖的可以了解下2.2这种写法的意思： 

Order allow,deny —— 先写allow规则，再写deny规则
Allow from all —— 所有都可以访问
Deny from all —— 所有都拒绝

2.2的这个配置
```
Order deny,allow
Deny from all
```

等同于2.4的：
```
Require all denied
\end{Verbatim}
```

然后2.2的这个：
```
Order Deny,Allow
Deny from all
Allow from example.org
```
意思是所有都拒绝，只允许 example.org的访问。

等同于2.4：
```
Require host example.org
```

我们看到2.4的Require语句更简洁了，比如下面的这个：
```
Require all granted
Require not ip 10.252.46.165
```

所有都允许，除了谁谁禁止访问。




## 挂个wsgi站点
上例子吧：

```
<IfModule !wsgi_module>
    LoadModule wsgi_module modules/mod_wsgi.so
</IfModule>

WSGIPythonHome "/home/wanze/venv"
WSGIPythonPath "/home/wanze/venv/webapp"

<VirtualHost *:80>
    ServerName api.cdwanze.work

    WSGIScriptAlias / /home/wanze/venv/webapp/webapp/wsgi.py

    <Directory /home/wanze/venv/webapp >
        <IfVersion >= 2.4>
            Require all granted
        </IfVersion>
        <IfVersion < 2.4>
            Order deny,allow
            Allow from all
        </IfVersion>
    </Directory>
    
    Alias "/static" "/home/wanze/venv/webapp/static"
    
    <Directory  /home/wanze/venv/webapp/static >
        <IfVersion >= 2.4>
            Require all granted
        </IfVersion>
        <IfVersion < 2.4>
            Order deny,allow
            Allow from all
        </IfVersion>
    </Directory>

</VirtualHost>
```

- 首先是检测wsgi模块加载了没有，没有把它加载上。


- WSGIPythonHome 这个设置你的python的虚拟环境的所在目录，比如上面的例子 venv/bin下面就是python可执行脚本。


- WSGIPythonPath 这个设置你的Django项目目录所在
- WSGIScriptAlias 这个设置你的WSGI文件所在
- Alias 和下面Directory 设置是服务你的项目的静态文件的。




## 其他文件权限问题
除了上面设置好 Directory 之外，你可能还会遇到其他某些文件的读写权限问题，在查看日志的时候发现提示说那个文件没有权限读写了。这个时候首先要明确httpd的执行User和Group是谁，然后在看目标文件夹或文件的具体权限。

Django项目的wsgi文件是需要有执行权限的。还有Django项目操纵数据库，比如sqlite3这种文件数据库，你可能也会遇到读写权限问题。

还有值得一提的是如果某个母文件夹没有可执行权限，那么里面的所有文件都是不可见的。



