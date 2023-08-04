Tags: centos7
Slug: centos7
Status: draft
[TOC]

## 安装系统

centos7的安装目前最大的难点在硬盘分区上，加上最新的uefi启动方式，还是有些新的问题需要讨论的。

记得以前早起折腾ubuntu系统时，最大的一个影响就是需要给linux系统安装预先分出一个swap分区，大约是内存的两倍，当时还不太懂这个有什么，按照《鸟哥的私房菜》里的描述， 服务器一般内存都十几G-64G的内存，就不能按照这个公式来了——分出3-4Gswap分区意思一下就可以了。



### 各个硬件在linux下的名字

这个需要了解下，参考 [鸟哥的私房菜第二章](http://linux.vbird.org/linux_basic/0130designlinux.php) ，

- 硬盘或者USB模拟的硬盘 ：   /dev/sd[a-p]
- CDROM或者DVDROM :  /dev/scd[0-1] , /dev/cdrom（当前cdrom） , /dev/sr[0-1]
- 打印机 ： /dev/lp[0-2] , /dev/usb/lp[0-15]
- 鼠标 ： /dev/input/mouse[0-15] , /dev/mouse (当前鼠标)



### 分区推荐

按照鸟哥的私房菜推荐，不是随便玩玩，而是作为工作服务器，那么推荐还是如下多分几个区：

- /boot
- /
- /home
- /var
- swap


## firewall-cmd

防火墙策略管理命令： `firewall-cmd` ， 其中 `--list-all` 列出开启的端口号等情况， `--add-port` 来开放某个端口号，比如：

```
firewall-cmd --add-port=80/tcp
```

更多细节请参看 [这篇文章](http://wangchujiang.com/linux-command/c/firewall-cmd.html) ，下面就一些常用的用法简要说明之。

```bash
firewall-cmd --get-active-zones # 查看活动的区域
firewall-cmd --zone=work --add-interface=eth0 # 为某个区域指定网卡界面
# 默认的zone是public 
firewall-cmd --zone=work --list-ports # 列出所有开放的端口
firewall-cmd --zone=work --add-port=8080/tcp # 为某个区域开发端口
firewall-cmd --zone=work --add-service=ssh # 为某个区域开发服务
# 类似的还有 --remove-prot  和  --remove-service
firewall-cmd --get-services # 列出所有可用服务
```

**NOTICE:** 上面提及的操作如果不加 `--permanent` 参数那么只是临时有效，重启firewalld服务就会配置丢失。




## systemd

systemd作为linux的初始化系统已经渐趋主流，其最大的特点就是比原upstart有更快的启动速度。其尽可能启动更少的进程和尽可能更多进程并行启动。总的说来提高并发启动来加速系统启动是好的，不过这也要求systemd脚本编写人员对于系统的启动的各个单元或服务之间的依赖关系有很清楚的认识。

关于systemd的参考手册强烈推荐 [金步国翻译的systemd中文手册](http://www.jinbuguo.com/systemd/systemd.exec.html) 。

systemd服务通过 `systemctl` 命令来管理的，实际上systemd是如此的基本，因为它已经取代inid成为了pid为1的进程，也就是后面的很多进程都是通过它来启动的，你甚至还可以通过systemctl来重启电脑，你就知道systemd服务是多么的底层了：

- systemctl reboot
- systemctl poweroff

system的systemd服务脚本放在 `/usr/lib/systemd/system` 哪里，用户的systemd服务脚本是放在 `/usr/lib/systemd/user` 哪里。或者你也可以放在 `/etc/systemd/system` 或者 `/etc/systemd/user` 哪里。

也就是说现在linux系统初始化进程systemd之后，后续基本上所有的服务进程都是由systemd来管理的，这些不同的系统资源在systemd这边都叫做单元Unit。一种分为12种单元：

1. Service 最常用的单元类型，表示一个后台服务进程。
2. Target  需要注意的是并没有 `[Target]` 这样的配置选项，其作用就是将一些依赖汇成一组单元，给这一组单元取一个名字，从而方便这组单元和其他启动单元的依赖关系。
3. Device 硬件设备
4. Mount 文件系统的挂载点
5. Automount 自动挂载点，当该自动挂载点被访问时，systemd将执行定义的挂载行为
6. Path 文件或路径
7. Scope 不是由systemd启动的外部进程
8. Slice 进程组
9. Snapshot systemd快照
10. Socket 套接字
11. Swap swap文件
12. Timer 定时器

可以用 `systemctl list-units` 来列出当前系统正在运行的所有unit。

下面列出一个systemd的服务脚本例子，一般 `Unit` 和 `Install` 配置节都是有的，然后服务脚本特有的是那个 `Service`  配置节。

```
[Unit]
Description=nginx - high performance web server
Documentation=http://nginx.org/en/docs/
After=network.target remote-fs.target nss-lookup.target

[Service]
Type=forking
PIDFile=/usr/local/nginx/logs/nginx.pid
ExecStartPre=/usr/local/nginx/sbin/nginx -t -c /usr/local/nginx/conf/nginx.conf
ExecStart=/usr/local/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.conf
ExecReload=/bin/kill -s HUP $MAINPID
ExecStop=/bin/kill -s QUIT $MAINPID
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```

一般配置文件放在 `/usr/lib/systemd/system` 那里，如果你希望这个配置单元开机启动，则运行 `systemctl enable what.service` 来让这个配置单元激活开机启动，其将创建一个符号链接到 `/etc/systemd/system` 那里。反之撤销开机启动是 `systemctl disable what.service` 。



### Unit配置节

Unit - Description 描述文字

Unit - Documentation 本单元的文档

Unit - Requires 设置本单元的依赖关系。列出的单元若启动失败，而且After中也列出了该单元，则本单元不会启动。此外这些依赖单元显式停止，本单元也会停止。

Unit - Wants 也是设置本单元的依赖关系，相当于Requires的弱化版本，依赖单元只是尽可能启动，单元不存在或无法启动不影响本单元的启动。

Unit - After 强制单元的先后顺序，这里是指本单元强制在列表中的单元之后。

Unit - Before 强制单元的先后顺序，这里是指本单元强制在列表中的单元之前，即两个单元都要启动时，后面的单元会延迟到前面的单元启动完毕再启动。

### Install 配置节

systemctl enable和disable才使用本Install配置节，我们常看到下面选项：

```
[Install]
WantedBy=multi-user.target
```

其相当于在multi-user.target的配置上加上了 `Wants=本单元` ，这样multi-user.target启动就需要本单元启动，默认linux的启动单元default.target，一般这个default.target就是这个multi-user.target。

Install  -  WantedBy  

### Service配置节

Service - Type 启动类型，simple： 默认值，立即启动该服务； forking：以fork方式启动进程；oneshot：一次性进程；dbus：dbus启动；notify：服务启动完毕，通知systemd，然后继续向下执行。

Service - PIDFile pid文件路径

Service - ExecStartPre 启动前动作

Service - ExecStart 启动动作

Service - ExecReload reload动作

Service - ExecStop 停止动作

Service - PrivateTmp 临时空间

Service - ExecStartPost 启动后动作



### system的常规启动流程

```
                                     cryptsetup-pre.target
                                                  |
(various low-level                                v
 API VFS mounts:                 (various cryptsetup devices...)
 mqueue, configfs,                                |    |
 debugfs, ...)                                    v    |
 |                                  cryptsetup.target  |
 |  (various swap                                 |    |    remote-fs-pre.target
 |   devices...)                                  |    |     |        |
 |    |                                           |    |     |        v
 |    v                       local-fs-pre.target |    |     |  (network file systems)
 |  swap.target                       |           |    v     v                 |
 |    |                               v           |  remote-cryptsetup.target  |
 |    |  (various low-level  (various mounts and  |             |              |
 |    |   services: udevd,    fsck services...)   |             |    remote-fs.target
 |    |   tmpfiles, random            |           |             |             /
 |    |   seed, sysctl, ...)          v           |             |            /
 |    |      |                 local-fs.target    |             |           /
 |    |      |                        |           |             |          /
 \____|______|_______________   ______|___________/             |         /
                             \ /                                |        /
                              v                                 |       /
                       sysinit.target                           |      /
                              |                                 |     /
       ______________________/|\_____________________           |    /
      /              |        |      |               \          |   /
      |              |        |      |               |          |  /
      v              v        |      v               |          | /
 (various       (various      |  (various            |          |/
  timers...)      paths...)   |   sockets...)        |          |
      |              |        |      |               |          |
      v              v        |      v               |          |
timers.target  paths.target   |  sockets.target      |          |
      |              |        |      |               v          |
      v              \_______ | _____/         rescue.service   |
                             \|/                     |          |
                              v                      v          |
                          basic.target         rescue.target    |
                              |                                 |
                      ________v____________________             |
                     /              |              \            |
                     |              |              |            |
                     v              v              v            |
                 display-    (various system   (various system  |
             manager.service     services        services)      |
                     |         required for        |            |
                     |        graphical UIs)       v            v
                     |              |            multi-user.target
emergency.service    |              |              |
        |            \_____________ | _____________/
        v                          \|/
emergency.target                    v
                              graphical.target
```



### Mount单元

**请参考 [金步国的systemd.mount 中文手册](http://www.jinbuguo.com/systemd/systemd.mount.html)  中的相关讨论。**




### Timer单元

Timer单元针对某些服务进程配置定时任务很方便，大体可以实现crontab类似的功能



### 服务文件修改之后

一般是推荐配置文件外移，服务文件设置好之后就没必要修改了，如果服务文件修改了那么需要：

```
systemctl daemon-reload
```

### 日志管理

systemd统一管理所有日志，可用 `jourlnalctl` 命令来查看之。点名要看某个服务Unit：

```
jourlnalctl --unit=nginx
```

### 启动服务等等

启动服务重启服务暂停服务等等我想大家都很熟悉了吧：

```
systemctl start what.service
systemctl stop what.service
systemctl restart what.service
```



## centos7配置dns

发现centos7配置dns之后重启 network 服务配置就会丢失，需要在

```
/etc/NetworkManager/NetworkManager.conf
```

main哪里加上

```
dns = none
```

然后重启

```
systemctl restart NetworkManager.service
```

然后再如同以前一样修改 `/etc/resolv.conf` 。



## 配置语言

### 查看当前操作系统语言

```
cat /etc/locale.conf 
```

或者

```
localectl status
```

### 列出可用语言

```
locale -a
```
或者

```
localectl list-locales | grep zh
```

### 修改操作系统语言

```
sudo localectl set-locale LANG=zh_CN.utf8
```







## 参考资料

1. [鸟哥的私房菜](http://linux.vbird.org/linux_basic)
2. [systemd入门教程之命令](http://www.ruanyifeng.com/blog/2016/03/systemd-tutorial-commands.html)
3. [systemd详解](https://www.xncoding.com/2016/06/07/linux/systemd.html)
4. [浅析 Linux 初始化 init 系统-systemd](https://www.ibm.com/developerworks/cn/linux/1407_liuming_init3/index.html)



