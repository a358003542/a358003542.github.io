Tags: unity

[TOC]

## 前言

本文是Unity游戏开发系列的包部分。Unity游戏开发可以利用包的概念实现对一个游戏项目里面各个要素的解耦合，从而实现更轻量级的模块化开发过程。

### 本系列内容的取舍

- 因为笔者开发的是3D游戏，因此专属于2D游戏的那些内容将不会在这里讨论。
- 笔者使用的是Unity 2020.3 LTS版本，之前的版本被废弃的特性或者之后的版本新增的特性将不会在这里讨论。
- 笔者在行文上会尽可能节省笔墨，只是标出官方参考文档的引用出处，但在某些地方会额外花费笔墨来说明，比如个人觉得官方文档文字可能不是很好懂，某些内容很重要需要再特别强调一遍等。
- 一般来说官方文档里面有的不会在这里赘述，不过有时某些内容会特别重要而会再强调一遍。



## 创建自己的包

Unity的包主要是由 `package.json` 这个文件来定义的，关于包的文件夹结构很多都是约定俗成的东西，具体请参见官方文档 [包布局]([Unity - Manual: Package layout (unity3d.com)](https://docs.unity3d.com/2020.3/Documentation/Manual/cus-layout.html))一文。下面是 `package.json` 的很简单的例子：

```json
{
    "name": "com.ststudio.utilities",
    "version": "0.1.3",
    "displayName": "Utilities",
    "description": "Some Utilities",
    "unity": "2020.3",
    "dependencies": {},
    "author": "wanze",
    "email": "a358003542@outlook.com"
}
```

## 安装包

安装互联网公开的包这里就不赘述了，如果是你自己本地编写的包，则需要选择 `Add package from disk...` ，然后选择你的本地包所在的 `package.json` 文件。

### unitypackage文件

你可以通过unitypackage文件来导出包和导入包。具体在 `Assets -> import pacakge -> Custom package...` 那里。



## 包依赖

这里包的依赖只能是互联网上公开可用的Unity包，你可以在你的项目 `Packages/manifest.json` 文件下看到你当前所安装的包依赖。

将类似的字段写入 `package.json` 即可：

```json
    "dependencies": {
        "com.unity.addressables": "1.18.16"
    },
```

值得一提的是这里的包依赖仅仅是unity那边的包依赖管理，和具体C#代码那边项目的组织管理和依赖是不相干的。

## 程序集定义

在推荐的包布局那里有这样的安排：

```
  ├── Editor
  │   ├── Unity.[YourPackageName].Editor.asmdef
  │   └── EditorExample.cs
  ├── Runtime
  │   ├── Unity.[YourPackageName].asmdef
  │   └── RuntimeExample.cs
```

这个asmdef文件就是所谓的程序集定义，在unity那里可以通过 `Create -> Assembly definition` 来创建。对于Editor那边如下：

![img]({static}/images/游戏开发/unity_package_1.png)

注意下面平台只勾选了Editor，这应该是节省了C#的编译行为开销。然后在Runtime那边也新建一个程序集定义之后，如果我们用visual studio打开这个项目会发现解决方案那里有两个项目，一个是Editor的，一个是Runtime的，这应该也是节省项目编译行为开销的。具体这块笔者还不是很懂，总之刚开始按照这种推荐方式来。

一般来说同项目的Editor的程序集定义是要添加一个本Runtime程序集定义的依赖的。

虽然你已经安装依赖包了，但是假设你的脚本里面用到了依赖包里面的类型，那么还需要在程序集定义里面指明依赖关系。

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

