Tags: editor
Date: 20201120
Slug: visual-studio-editor
Status: draft
[TOC]

## 前言

本文列出一些个人在使用visual_studio过程中觉得值得一提的小技巧。

## 多行快速注释和取消注释

注释是 `Ctrl+k Ctrl+c`

取消注释是 `Ctrl+k Ctrl+u`

## 文档格式化

visual studio 是有文档格式化功能的，只是藏得比较深。具体是选择 `工具->选项->环境->键盘` ，搜索关键词 `格式` ，其中相关的有：

- 编辑.设置文档的格式 ，默认的快捷键是 `Ctrl+k Ctrl+d` ，也就是本文档自动格式化。
- 编辑.设置选定内容的格式，默认的快捷键是 `Ctrl+k Ctrl+f` ，也就是选中内容自动格式化。

## outline大纲视图

初入visual studio会看到解决方案资源管理器大体类似于文件outline视图，但我们还希望有一个本文档的类各个方法的outline视图这样方便快速切换。

当我们点击解决方案资源管理器里面的类，展开可以看到visual studio是有类似的各个方法outline视图显示功能的，只是和文件outline在一起很不方便，这是可以右键点击再新建一个解决方案资源管理器就可以了。



## codemaid插件

codemaid是visual studio的一个免费插件，官网在 [这里](https://www.codemaid.net/) 。

这个插件有很多功能，粗略地看了一下，其中**文档格式化**功能和 **文档大纲视图** 功能非常的好用，强烈推荐这个插件。



## 保存窗口布局

你可以点击窗口->保存窗口布局来保存当前你喜欢的窗口布局。

## 编辑器换行显示

Tools -> 选项 -> 文本编辑器 -> 所有语言 。选择自动换行。