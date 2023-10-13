Date: 20230714
[TOC]

## pyinstaller制作exe

### 简介

所谓的exe制作也就是把你写python程序freeze起来，这样目标机器上用户没有安装python或者等等其他依赖都能正常运行程序。

推荐使用pyinstaller。 pyinstaller的官网在 [这里](http://www.pyinstaller.org/) 。安装就是用pip安装即可。

然后推荐在你的项目根目录下创建一个简单的启动脚本，一方面方便平时测试，一方面作为pyinstaller的程序入口。

**NOTICE:**  注意该脚本的名字不要和你的程序的模块名字相同，之前我安装后闪退就是因为这个脚本名字没取好。

具体使用很简单：

```text
pyinstaller you_entry_point.py
```

当然该脚本文件不一定在当前目录下，你也可以如下来指定目标脚本文件：

```
pyinstaller yaogua\gui.py
```

如果一切顺利，到 `dist` 文件夹下运行你的目标程序exe运行正常，一切都OK，那么恭喜你了。没必要继续往下看了。如果出问题了，那么请钻研官方文档吧，下面也会做出一些补充说明。

首先你不能依靠自动生成的 `.spec` 文件了，接下来讨论了很多定制都是基于对这个 `.spec` 文件的修改。修改好了之后你后面要运行pyinstaller需要如下运行了：

```text
pyinstaller you_entry_point.spec
```



### 输出单个exe文件

一般桌面端程序和较大型的项目是不推荐输出单个exe文件的，而对于一些小型的项目或者命令行工具，输出单个exe文件有时是很便捷的。然后在某些情况下你可能会遇到找不到python3.*.dll之类的错误，那么这个时候是一定要采用输出单个exe文件的方案的。

对于输出单个exe文件方案的spec文件，你先如下生成最基本的spec文件：

```
pyinstaller -F you_entry_point.py
```

然后接下来就是对该spec文件进行一些定制工作了。



### 环境配置和使用建议

你的python项目推荐使用虚拟环境，只安装必要的python依赖。然后python系统最好没有安装pyside2之类的模块，免得有干扰。然后你的pyinstaller安装在虚拟环境里面，一切命令执行也在虚拟环境里面。

这既有可能避免某些pyinstaller的bug和问题，也会减少你的安装包大小。

### 不弹出那个cmd窗口

在 `exe=EXE` 那里修改 `console` 字段为 `False` ，这样生成的exe在执行时将不会再弹出那个cmd窗口了。

### 修改输出exe名字

在`exe=EXE` 那里修改 `name` 字段来修改目标输出exe的名字。

### 检查python包依赖情况

一般pyinstaller输出之后很多时候出问题是python包依赖没有正确检测到，通过查看`build/{name}/xref-{name}.html` 这个文件来确认python包依赖是否都加载进去了，没有则修改`a = Analysis` 下的 `hiddenimports` 字段，将缺失的模块名加入进去。



### 添加额外的文件

spec文件下配置 `datas` 这个列表值：

```text
datas=[ ('src/README.txt', '.') ],
```

大概意思是把那里的那个文件copy到目标dist文件夹的那里。

### python包里面的数据文件

推荐都规范为使用 `pkg_resources` 来管理：

```
from pkg_resources import resource_filename
```

但是这样你的数据文件exe程序还是不能使用的，你需要按照上面做的添加额外的文件，来把各个文件添加进去，比如：

```
             datas=[('yaogua/html_resource','yaogua/html_resource'),
             ('yaogua/yaogua.json','yaogua')],
```

上面是把yaogua模块的html_resource下的所有文件内容都复制到dist文件夹下的对应软件名的yaogua的html_resource那里，这样使用 `resource_filename` 引用路径仍是可行的可用的。
