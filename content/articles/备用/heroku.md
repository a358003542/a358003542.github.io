Slug: heroku
Date: 20190911

[TOC]



## 前言

在heroku上部署项目其实很简单，本文将简单的将heroku的容器作用原理和简单的git推送和相应的一些额外的配置说明一下，整个过程不通过 `heroku` 命令行工具，或者网页操作，或者修改文件之。

本文主要面向python的，首先推荐读者参考一下 heroku 官方在github 上的项目，比如说 [这个项目](https://github.com/heroku/heroku-django-template) 。其是基于最近的django1.11的，看着这个模板理解一些东西，然后在heroku上设置好自动同github同步就可以了。



## runtime.txt

这个文件用来执行python的版本，里面简单写上即可：

    python-3.6.3

这样，远程heroku会帮你确定python运行环境为python-3.6.3。

## requirements.txt

熟悉python开发的人都知道这个文件是什么意思，只是在heroku这里，是必须填写好的一个文件了，其和heroku远程调配好pip的环境有关。

## Procfile

这个文件包含了一些进程类型声明，每个进程类（process type）由一行组成是： 

    <process type>: <command>
比如写着 `web` 的意思就是启动一个web server。

还有就是具体执行何命令来启动这个web server了。我们看到gunicron的官方文档写着对django项目如下支持语法：

```
$ gunicorn myproject.wsgi

或者明确指定django的settings位置
$ gunicorn --env DJANGO_SETTINGS_MODULE=myproject.settings myproject.wsgi
```

所以我们在教程中看到如下一行：

```
web: gunicorn myproject.wsgi --log-file -
```

上面的 `--log-file -` 在gunicron那边是把日志输出到默认stdout的意思。



## 通过git推送你的项目

你可以设置github自动同步，这样直接推送到你的github仓库即可。这里讲的是heroku默认的git url。

```
git remote add heroku  https://git.heroku.com/{{heroku_project_name}}.git
```



**重要提示：添加的这个heroku的remote url直接和后面的heroku 命令行工具相关。** （参阅了[这个网页](http://subin.logdown.com/posts/1594965) ） 

那个heroku命令行工具因为在windows下环境有点不好配，所以很多功能都略过了，不过 `heroku run` 功能是无法回避的，有些工作比如django的数据库初始化要手工输入命令完成： 

```
heroku run python manage.py makemigrations
heroku run python manage.py migrate
```



## django的静态文件

我在heroku的处理日志中看到这样一行：

```
python manage.py collectstatic --noinput
```

说明其自动处理好了django的静态文件问题。



## django的数据库

在官网上管理好项目addon，然后看到 `settings` 有个 `Config Vars` 字段，里面定义了一个 `DATABASE_URL` 值。

然后 `dj-database-url` 这个pypi包会自动刷这个 `DATABASE_URL` 成为django的settings配置，如下配置：

```python
# Update database configuration with $DATABASE_URL.
import dj_database_url
db_from_env = dj_database_url.config(conn_max_age=500)
DATABASES['default'].update(db_from_env)
```



## heroku命令行工具

### heroku create

大体类似于你在官网上操作新建一个app，只是名字是随机的。



## 如何加入数据库

    heroku  pg:psql --app cheminfo
    
    heroku addons:add heroku-postgresql:dev --app cheminfo