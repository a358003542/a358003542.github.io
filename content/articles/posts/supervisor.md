Slug: supervisor
Date: 20190918


[TOC]

## 简介

supervisor会开启一个后台服务 `supervisord` 可以通过：

```
systemctl status supervisord
```

查看之。同样类似于nginx之类的做法，其通过各个配置文件来管理的，然后配置文件在 `/etc/supervisord.conf` 文件里面。

一般会如下所示将配置文件放在另外的某个地方。

```
[include]
files = /etc/supervisord.d/*.conf
```

这些配置都是等下supervisord要加载的。

此外你还需要了解下 supervisor提供的 `supervisorctl` 命令。

其提供的子命令有：

- reread 重载配置
- restart `<name>` 重启某个进程
- restart all 重启所有进程
- stop `<name>` 停止某个进程
- stop all 停止所有进程
- start `<name>` 启用某个进程
- start all 启用所有进程
- status `<name>` 查看某个进程
- status all 查看所有进程
- clear `<name>` 清除某个进程的日志  注意supervisor是将某个进程的stdout作为日志输出源，然后对应的那个日志文件将会被清除，但因为进程还在，所以马上新的日志文件又产生了。
- clear all 清除所有进程的日志
- update `<gname>` 更新某个 **进程组** 的配置，如果配置发生了更改，那么该name对应的进程将会被重启。reread只是重载配置并没有重启过程，update既更新了配置，又相应的决定是否重启进程，update更实用些。
- update all 更新所有的进程的配置