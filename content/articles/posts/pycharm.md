Tags: editor
Slug: pycharm-editor
Date: 20201120

[TOC]



## 常用的快捷键

- `F4` 选中某个变量，然后按键，则跳转到该变量的定义位置。
- `Ctrl + /` ，选中某行或者多行，然后按键，则选中行会自动注释。选中注释行再按键则会取消注释。

## 直接上传文件到服务器

其实原理就是利用sftp上传，但在pycharm这个大环境下，确实有时很方便的。这个功能只在pycharm专业版下才有。

```
Tools -> Deployment -> configuration
```

主要是某些需要在服务器上频繁测试的工作，但是有不方便git频繁commit的情况，这个时候可以先测试好，在git推送。



## 设置环境为远程python解释器

在：

```
Settings -> Project -> Project Interpreter
```

哪里，可以利用pycharm新建一个本地的虚拟环境，或者用pipenv建立环境之后，pycharm会自动找到，从而利用已经存在的python虚拟环境，而这里要讲的是，你还可以设置解释器环境为远程服务器的python环境，这样你的开发调试将更加接近程序实际运行时的环境。

在：

```
Tools -> Start SSH session...
```

你可以在terminal哪里打开一个连接到远程服务器的ssh终端，加上上面的设置好文件upload功能，基本上你不需要使用另外一个额外的ssh终端连接程序了。

本部分讨论的都是基于ssh连接的，你需要在：

```
Tools -> Deployment -> Configuration
```

哪里设置好ssh server 的连接方式。

## 正则表达式替换

按下路径替换之后，可能有些复杂点的任务需要做正则表达式替换，正则表达式大家都很熟悉了，这里就不多说了，主要是group替换的时候，如何表示。

首先原表达式一样用 `()` 来包围你想要设定的group，然后本表达式引用这个group（从1开始数），是 `\1 \2 ...` 

而后面要替换的表达式要引用上面的group依次是 `$1 $2 ...` 

更多内容请参看官方文档的 [这里](https://www.jetbrains.com/help/webstorm/2017.2/regular-expression-syntax-reference.html) 。