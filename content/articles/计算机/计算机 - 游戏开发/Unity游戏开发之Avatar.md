Tags: unity

[TOC]

## 前言

本文是Unity游戏开发系列的Avatar部分。玩家角色模型Avatar开发这里主要是利用了Unity的UMA包。

### 本系列内容的取舍

- 因为笔者开发的是3D游戏，因此专属于2D游戏的那些内容将不会在这里讨论。
- 笔者使用的是Unity 2020.3 LTS版本，之前的版本被废弃的特性或者之后的版本新增的特性将不会在这里讨论。
- 笔者在行文上会尽可能节省笔墨，只是标出官方参考文档的引用出处，但在某些地方会额外花费笔墨来说明，比如个人觉得官方文档文字可能不是很好懂，某些内容很重要需要再特别强调一遍等。



## 第一个例子

首先将`Getting Started` 文件夹下的 `UMA_GLIB` 和 `UMADynamicCharacterAvatar` 拖入场景，其中最关键的初始调配属性有：

- Active Race 设置种族
- 下面的Recipe一栏进行拖动和删除wardrobe的recepie。

更多内容后面再详细讨论。



## Customizaiton

### Character Colors

基本颜色，Metallic和Gloss。Gloss光泽度由设置颜色的Alpha决定。

这些属性来自你设置角色的Recipe里面的Shared colors那里。shared color从recipe那边定义，然后可能应用到某个slot，从而继续影响目标slot上的材质颜色。





recipe - slot - overlay 这三者的关系是一个recipe是一个配置方案，而一个slot对应的是某个mesh，然后overlay则是该mesh上的某个或某几个材质组。



## 参考资料

1. Unity官方文档
2. Stack overflow
3. 其他模块文档
4. Unity商城Free资源
5. Learning c# by developing games with unity 2019 by Harrison Ferrone
6. Unity 游戏开发 by  Mike Geig
7. Mastering UI Development with Unity by Asheley Godbold
8. Unity in Action by Joseph Hocking
9. Unity Shader入门精要 by 冯乐乐
2. Mastering Unity Shaders and Effects by Jamie Dean

