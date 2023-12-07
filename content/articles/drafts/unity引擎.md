Slug: unity-basic
Status: draft


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

Tags: unity
Status: draft
[TOC]



### 通过代码实例化预制件

```
Instantiate(GameObject perfab);
```

最常见的例子就是发射子弹或者射弓箭，子弹一开始没有在场景中，然后需要合适的时候再实例化子弹预制件。

该函数还可以接受几个可选参数，用来控制新生成实例的位置，转向和parent属性：

```
public static Object Instantiate(Object original, Vector3 position, Quaternion rotation, Transform parent);
```



### 如何将某个摄像头调到当前视角

首先在编辑器上调整好开发者视角，然后选中某个摄像头，然后选择 `游戏对象-> align with view` 。





### JsonUtility

这个就不多说了，具体参见官方文档。

[Unity - Manual: JSON Serialization (unity3d.com)](https://docs.unity3d.com/2019.4/Documentation/Manual/JSONSerialization.html)

[Unity - Scripting API: JsonUtility (unity3d.com)](https://docs.unity3d.com/2019.4/Documentation/ScriptReference/JsonUtility.html)

### 游戏状态的保存经验分享

**PlayerPrefs** 这个不是用来进行游戏状态保存的，最多就是一些游戏配置放在这上面。实际上这个东西在windows下是写在注册表里面的，东西稍微写多一些都是很不好的。

Json序列化参考上面的讨论，很适合小型项目开始快速搭建游戏状态保存系统，实际上就算是联网游戏用json来传递数据也是一个不错的选择。

json序列化具体到文件操作层面那是程序员自己的事，还有很大的优化空间，特别值得一提的是，json格式很容易发生格式损坏，因此对存档文件进行备份和在写的时候先写在临时文件上，再用临时文件替换掉存档文件是必要的手段。

**不要用ScriptableObject来保存要变动的数据**。也不要试着直接将ScriptableObject通过JSONUtility序列化，那些InstanceId都是不可靠的，基本上表示数据丢失了。从游戏状态存储的角度来说再把ScriptableObject又存一遍也是没必要的。以物品来说，一般来说将物品定义为ScriptableObject是很合适的，在游戏运行时的那些代码都引用ItemSO也是很方便的，但在游戏状态存储这边通过物品名去引用即可，不要把事情弄复杂了，具体还需要再另外建一个ScriptableObject来保存所有的物品清单。

建立自己的数据类型的序列化解决方案和Editor那边的显示支持会给你的游戏开发带来极大的便利，包括这里讨论的游戏状态的保存。有时间就去做。粗略看了下一个是加入 `ISerializationCallbackReceiver` interface，Editor那边Unity也专门提供了 `PropertyDrawer` ，在描述上就直接说明了方便定义自己的序列化类的显示定制。这块有时间再研究。





## 导航系统

Unity内置了一个路径导航系统，首先你需要将你的地形 GameObject 进行烘焙：

1. 选择你的地形GameObject，选择Static菜单的Navigation Static【在烘焙NavMesh的时候只收集标记为Navigation Static的游戏对象数据】
2. 选择Window->AI->导航，选择烘培Bake Tab，然后点击烘培。
3. 你将会在目标场景地图下面看到新建了一个NavMesh对象。

导航系统中你想要移动的目标对象需要绑定Nav Mesh Agent组件。

导航系统中你需要定义一系列的导航路径点，空的GameObject即可。



### 如何移动一个Agent

实际会很简单，就是设定destination属性即可。

```
agent.destination = transform.position;
```

### 巡逻模式

一个agent的巡逻模式可以通过如下类似编码来实现：

```c#
    void Update()
    {
        if (agent.remainingDistance < 0.2f && !agent.pathPending)
        {
            MoveToNextPatrolLocaton();
        }
    }
        private void MoveToNextPatrolLocaton()
    {
        if (locations.Count == 0)
        {
            return;
        }

        agent.destination = locations[locationIndex].position;

        locationIndex = (locationIndex + 1) % locations.Count;
    }
```

上面的 `agent.pathPending` 的意思是当前路径还没有计算好，取值否表示一定要先等路径计算好然后剩余距离只有多少之后继续移动到下一个导航点。

### 烘焙的时候选择高度网格

如果不选择高度网格的话，角色会有一定的悬空浮动问题。高度网络在运行时会占用一些内存和处理资源，只有在必要的时候才开启这个选项。

### NavMesh Surface

这个组件需要在 [这里](https://github.com/Unity-Technologies/NavMeshComponents) 额外下载安装，它可以作为组件附加在游戏对象上，然后可以针对某种特定的NavMesh Agent定义可行走区域。





## 单元测试

按照C#的方法，自动创建了一个单元测试项目。即使是空白单元测试也会报错：

```
CS0006 could not found file Assembly-CSharp.dll
```

大概这个错误，我好不容易才在 [这个网页](https://developercommunity.visualstudio.com/t/vs-doesnt-put-binaries-of-unity-project-to-output/785717) 知道Unity项目在visual studio中默认是不自动完成生成项目的，你需要在：

```
工具 ->  选项 -> 适用于Unity的工具 -> 杂项 -> 禁止完整生成项目
```



## 雾效

在 window->渲染->照明设置那里勾选雾，则可以为你的场景打开雾效。



## skybox

天空盒就是在天空那个巨大盒子上应用你想要的材质。可以新建一个材质，然后这个材质在stardard着色器那里选择skybox，从而快速创建一个skybox材质，然后在 window->渲染->照明设置 那里应用该skybox材质。

## 日志

早期调试Debug.Log基本上只是一个打印信息功能，但后面随着项目完善Debug日志就要开始慢慢规范了，也需要考虑下面方法来显示不同信息：

```
Debug.LogError
Debug.LogWarning
```

在终端可见的这些日志信息对于正式游戏运行版本也是有的，还有游戏调试版本也会显示这些日志信息，具体日志文件在那里请参阅  [官方文档的这里](https://docs.unity3d.com/Manual/LogFiles.html) 。

Windows下玩家的日志在：`%USERPROFILE%\AppData\LocalLow\CompanyName\ProductName\Player.log` 。



## 开发过程中避免踩坑的点

### 暂停菜单的正确退出

这个问题当时出现也是纠结了好久，一般开发人员正常设计一个暂停菜单是没有问题的，因为暂停菜单会有很多额外的逻辑而不仅简单的UI界面切换，比如游戏时间暂停，动画暂停，玩家其他输入控制暂停等。正常切换暂停菜单谁都会想到要把这些状态再切换回来，但还有很多情况可能是你一下突然就忘记了，然后突然发现游戏鼠标不能动了，游戏没反应了会很困惑。

比如多个场景的切换，如果你在暂停菜单退出到主菜单，再从主菜单切换到某个场景下，如果你忘了之前暂停的各个状态切回来，那么进入场景就会很困惑怎么游戏处于一种僵死状态会很困惑。

### 详细阅读事件函数的执行顺序

[官方文档在这里，强烈推荐！](https://docs.unity3d.com/cn/current/Manual/ExecutionOrder.html)

这个坑对应的最常见的报错说null什么的，就是你脚本里面引用了某个对象，但这个对象实际上现在还没有初始化。这个报错非常常见，常见到官方文档又另外下面单独写了一个关于 `NullReferenceException` 的讨论文章。

除了最简单的本来你打算在编辑器里面指定对象的但还没有指定的情况，也可能就是因为事件函数的执行顺序你没有理解好所以脚本执行先后顺序和你预想的不一样。

然后在同一场景下不同的MonoBehavior脚本组件的加载先后顺序也是有关系的，有的会推荐项目设置那里设置脚本执行顺序，但这个只是对于某些特别的脚本，很多这种情况如果我用FindObjectOfType来处理会正常解决，目前还不清楚这是因为什么，可能FindObjectOfType会让这个脚本在加载顺序上依赖其他脚本组件，所以会让它加载往后面放一点。

更复杂的多场景情况的一个建议就是不要跨场景引用对象了【好像也不太好跨场景引用了吧，也不要脚本依赖式的Find去查找】，用事件通道，因为多个场景的加载顺序会更加不可控制了，还是用事件通道会好一点。



## 实战经验分享

### 翻译插件遇到的一个问题

个人编写的小型翻译插件没太多花里胡哨的东西，反而很好用，不过遇到了一个问题，那就是不管是设置 `.text` 还是通过 `SetText` 方法都有可能让原Text对象的原始文本内容给永久修改掉。这个似乎有时并没有修改，有时会修改，可能和退出机制有关，但不管怎么说这个是不可控的。

只好每个text下面再另外新增一个脚本用来保留该text的字典key。



### 场景里面东西太多，如何选择性地显示

参考官方文档的这里： [Unity - Manual: Scene visibility (unity3d.com)](https://docs.unity3d.com/Manual/SceneVisibility.html)

世界大纲视图对象左侧有个眼睛的形状可以切换该对象在场景中的可见性，不影响实际游戏中的效果。

如果是只想观察场景中的某个或某些对象其他对象都希望隐藏则选中那些你想要显示的对象，然后按键 `Shift+H` 进入Isolation view模式，再按键 `Shift+H` 退出Isolation view模式。

### 怎么我的场景看上去有点暗

在窗口-渲染那些烘焙下光照，一般Build项目之前是需要烘焙下光照的。

### 怎么修改动画的播放速度

可以通过某个参数来控制动画的播放速度，具体如下图所示：

![img]({static}/images/2021/unity_animation_speed.png)

### Audio mixer是做什么的

请参看这个视频： [Audio Mixer and Audio Mixer Groups - Unity Official Tutorials - YouTube](https://www.youtube.com/watch?v=vOaQp2x-io0&ab_channel=Unity)



### URP

Universal Render Pipeline，除非是很高画面要求的游戏，则推荐使用HDRP，否则一般项目推荐使用URP。

URP的安装就是安装URP包，因为URP包内置了post process功能，所以原来的Post Processing Stack包可以删掉了。

然后需要在` 项目设置->Player->其他设置` 那里，将Color Space颜色空间设置为线性，意义不明，[参考网页](https://learn.unity.com/tutorial/introduction-to-urp)。

然后需要创建一个URP asset，具体是

```
Assets > Create > Rendering > Universal Render Pipeline > Pipeline Asset
```

然后是启用该asset，具体是在 `项目设置->图形` 那里选择该asset文件。

至此原有项目就已经升级为URP项目了。

#### 升级你的着色器

项目升级为URP项目，会自动升级你的着色器，后面你也可以手工选择那些旧有的着色器来升级为URP支持的着色器，具体就是选择：

```
Edit > Render Pipeline > Universal Render Pipeline
```

然后选择 ` Upgrade Project Materials to URP Materials` 或者  `Upgrade Selected Materials to URP Materials` 。

不是所有的旧有着色器都能成功升级为URP支持的着色器的。

### null check

在C#那边推荐的null检查语法是 `is null` ，当时说的是可以规避掉 `==` 被重载的情况，null 检查会更严谨些，但在unity这边，似乎unity对象的 `==` 运算符已经被重载了，所以 `is null` 检查会失效。而unity的官方2020版推荐的null check语法是这样的：

```c#
using UnityEngine;
using System.Collections;

public class Example : MonoBehaviour {

    void Start () {
        GameObject go = GameObject.Find("wibble");
        if (go) {
            Debug.Log(go.name);
        } else {
            Debug.Log("No game object called wibble found");
        }
    }

}
```

对于unity的对象可以这样判断，但对于C#的其他对象还是推荐使用 `is null` 。个人实践unity的null对象通过 `is null` 判断并不是一个c#的null对象，而如果通过 `go == null` 是可以判断的，然后unity的null对象能够用上面的写法，也说明了它不是一个c#的null，而是一个对象，并且这个对象还支持转bool类型的方法。个人推断这种转bool和 `== null` 写法内部区别不是太大。

但这种情况是令人沮丧的，不说还需要额外区分哪些对象是不是unit对象，因为null在C#中的普遍存在，经常你编写的函数和某些地方可能返回null或者unity空对象或者unity对象，所以更推荐的做法都写成

```c#
        if (go != null) {
            Debug.Log(go.name);
        } else {
            Debug.Log("No game object called wibble found");
        }
```



### 地形环境的开发

笔者经过摸索并没有找到特别好的地形环境搭建工具，至少免费的没有。那个L3DT并不是很好用，还将很多问题弄复杂了。地形环境开发最关键的问题不是要弄出一个随机的看上去还行的地形环境出来，那随便怎么弄一下就行，而是要首先用绘画工具加上游戏设计思路将地图的大概形状和玩家活动区域分块和玩家可行走区域等设计规划出来。然后才是实际搭建unity的Terrian。

游戏设计阶段对地图的大概情况也就是等高线的手绘是一个很重要的一环，我想在这一环之上，试着完善等高线图然后使用用unity的terrian地形生成，也就是基于等高线图来自动生成地形，实际输出效果不是很好。等高线边缘通过光滑倒是可以微调，等高线的相对高度通过绘制图形是利用灰度的百分比也可以做到一个大概的效果。但仍然有太多地方需要优化了，比如规划的玩家可行走路线的斜坡表达，比如河道边的效果表现，比如等高线区域太过于平坦。

这些微调整优化里面有一些倒是不那么紧要的，毕竟Unity的地形仍然只是一个原型工具，比如等高线区域太过于平坦，加入岩石模型就可以改变这点，但有一些则是需要立刻在地形上进行微调的，一个是河道边路斜面优化，一个是玩家可行走路线上一些斜坡的优化等。

Unity的灰度百分比推荐8位灰度，0%白表示z=0，然后100%白表示你的地形的最大高度，然后进行百分比划分。Unity接受的Terrian必须是正方形的raw图片格式。

整个地形环境的开发如上描述从地图等高线手绘，到玩家活动区域和行走路线设定到Unity的Terrian，再就是构想玩家于某一点的视觉呈现概念图到Unity的terrian地形微调，再到各个岩石，地面，树木等模型的建模，再到模型制成unity的预制件和根据terrian来放置，然后后期还有根据地图设计对石头树木矿石等各个资源型预制件的微调。这一流程虽然繁琐但每一步都是必要的，可见一个游戏的地形环境开发也不是一蹴而就的事。

## 其他

### 查看你使用的Unity的C#版本

这个其实很重要的，最好先查看清楚，免得后面因为一些版本细节问题纠结半天。目前笔者使用的是Unity2019.4，从 [这个网页](https://docs.unity3d.com/2019.4/Documentation/Manual/CSharpCompiler.html) 来看，它使用的是 .net 4.6，使用的C#版本是7.3，并不是C#8，有些差异还是需要特别注意的。

比如之前纠结的一个问题，就是因为我这边使用的是.net framework4.6，并没有 `System.HashCode` 这个方法。

如果使用的Unity2020 LTS版本，则使用的也是.net framework4.6，c#语言版本是c#8。

### visual studio快速方法输入

`Ctrl+Shift+M` 在visual studio 上调出Unity快速方法输入。

### RequireComponent

```
[RequireComponent(typeof(PlayerInput))]
public class PlayerScript : MonoBehaviour
{
//
}
```

脚本将会自动添加给本GameObject添加某个组件来确保本GameObject的组件依赖正确。

### 默认单位

Unity术语里面长度用的是 1unit，比如velocity 用的每秒移动的unit。比如1unit等于多少并没有一个准数的，要看你自己那边的建模规范。

### 四元数和欧拉角度

旋转Editor看到的x y z的值就是所谓的欧拉角度，但是如果你要给tranform.rotation赋值的话则需要使用四元数（Quaternion）。

```
transorm.rotation = Quaternion.Euler(0,0,0);
```

上面的过程也可以看做将一个欧拉角度数组转换成Quaternion四元数再赋值给rotation。

四元数访问对应的欧拉角度如下：

```
transform.localEulerAngles               // 局部坐标   
transform.eulerAngles                    // 世界坐标
```



在用一个Vector3变量表示游戏里面的方向的时候，现在假定都是全局坐标，则 `(0,0,1)` 也就是所谓的forward方向，即物体的z轴指向表示forword方向，此外还有 `(0,1,0)` 表示物体的Vector3.up方向，即物体的Y轴指向。x轴就是x轴和我们一般常识没有太多出入。

到Vector2坐标输入又有所不同，其x值对应的是水平方向，可以认为影响的是x值，而y值对应的是垂直方向，可以认为影响的是y值。

继续学习，这个四元数确实还是很让人困惑的，手册里面说Unity一般期待四元数是normalized，这个懂点线性代数的大概清楚就是这个矢量的模规约为1。具体调用是 `quaternion.normalized` ，将会返回一个magnitude等于1的四元数。

然后看到四元数乘以一个Vector3，参考 [这个网页](https://answers.unity.com/questions/186252/multiply-quaternion-by-vector.html) 。一个Vector3乘以一个四元数实际上是将这个Vector3进行了该四元数对应的旋转操作，也就是返回的也是一个Vector3变量。那么这又到了这个问题上，四元数表示的是一个什么旋转动作。比如说 `Quaternion.Euler(0,90,0)`  意思是绕着y轴旋转90度，y轴是垂直向上的，绕着y轴旋转90度大概就是一个物体在xy平面的旋转动作。



#### Quaternion.AngleAxis

绕某个轴旋转多少角度。

```
transform.rotation = Quaternion.AngleAxis(30, Vector3.up);
```

#### 不要直接修改欧拉角度来表示旋转

按照官方文档的介绍如果用欧拉角度里面的x,y,z值来表示旋转，不要直接去修改这些分量的值来表示旋转，Unity内部对于旋转的计算都是用的四元数，而对于某个旋转则可能会有多个欧拉角度值的表达，所以从Editor上去看会有些差异。

一般推荐用四元数的乘法操作，也就是用四元数乘以本欧拉角度来表达某个旋转操作。或者用一个Vector3量来赋值，Unity会先将这个Vector3量转成四元数的旋转量，然后再作用到目标上。



### 中文字体

需要通过 window -> TextMeshPro -> Font asset creator 来创建中文字体asset。

最好将你的游戏所有涉及到的中文字符都汇总在一个txt文件里面，这样肯定是最小集的，然后再根据 `Characters from file` 来创建。

值得一提的是TextMeshPro有字体回滚功能，所以也没必要去修改界面上的字体，界面上的字体也可能会因为多语种考虑字符不断变化，所以TextMeshPro的字体回滚功能真的不错，强烈推荐。

这个网页也推荐看下： https://learn.unity.com/tutorial/textmesh-pro-localization

目前还没遇到上面说的那么复杂的问题，那个 Atlas Population Mode 也不太明白，不过如果只有一个回滚字体的话那么是需要设置static的，默认好像也是static。所以就如上创建一个中文回滚字体即可。





### 平台相关编译代码

```
#if UNITY_EDITOR

#endif
```

这段宏定义了中间的一些代码调用Unity Editor的脚本，也就是依赖Unity Editor环境的。



### 常驻单例对象

有很多对象在游戏初始化加载之后就应该以单例常驻的形式而存在，可以编写一个 `PersistentGameObject` 来获得这个效果。

其主要要做两件事：

1.  DontDestroyOnLoad 常驻本gameObject
2. 构造一个static字典保存本gameObject的名字和实例，保证在游戏运行起见所有的常驻对象都单例而且名字唯一。

### 翻译插件实践经验分享

目前官方的Localization那个插件还处于preview状态，个人使用体验并不是很好，比如说TextMeshPro下面新增他们的脚本没有正常检测到，然后那么多文本每个都要加入实在是浪费时间。

1. 自己编写一个ScriptableObecjt，核心就是一个字典结构，来存放各个翻译语言的数据，key是字段Key，value是实际的文本。
2. 全局检索TextMeshPro文本组件，然后根据你的翻译数据来查找对应的字段。这个动作要在每次场景加载完毕之后触发。然后要注意查找最好使用 `Resources.FindObjectsOfTypeAll<TMP_Text>();` ，因为一般来说一些UI面板刚开始是inactive状态，这样使用 `FindObjectsOfType` 是找不到的。
3. 编写核心找到方法，大概逻辑如下：
   1. 查找对应的语言，如果找到对应语言的翻译，则试着查找对应的key，没有找到则试着使用默认的翻译
   2. 默认的翻译即第一个翻译数据，试着查找对应的key，没有找到则返回原key字符串
4. 这个核心查找方法后面动态变动的文本都要根据这个来，之前那个自动翻译过程只能保证第一次静态的那些文本得到翻译了，后面所有动态文本在对应的变动方法里面加上上面的查找方法 `Translator.Instance[key]` 。
5. 这个Translator是常驻单例对象。
6. 如果直接设置 `.text` 属性，UI元素的最原始文本也修改了，推荐是通过 `SetText` 方法来修改文本，这只是临时修改的。



### AsyncOperation

场景异步加载 `SceneManager.LoadSceneAsync` 返回的就是一个 AsyncOperation 对象，可以利用其 completed 事件来对接完成后的一些动作。

### 比较矢量的长度推荐使用sqrMagnitude

magnitude是 $\sqrt{a^2 + b^2}$  ，sqrMagnitude是 $a^2 + b^2$ ，官方文档说一般比较矢量长度大小推荐使用sqrMagnitude，会稍微效率高点。

### respawn玩家角色

一般都是如下respawn玩家角色：

```
		player.transform.position = spawnPoint.position;
		player.transform.rotation = spawnPoint.rotation;
```

Unity游戏开发一书就是这样写的，然而现在不可以了。 [这个视频](https://www.youtube.com/watch?v=FPU3uR3HYGo) 说了需要把项目设置的Physics的 `Auto Sync Transforms` 勾选上，一试果然就可以了。看了下Unity文档，Unity的物理系统默认没有勾选上，也就是你的transform属性硬修改Unity的物理系统是没有跟上同步的，然后Unity文档又说了这个自动勾选上开销会有一些，所以最好在需要硬修改的地方加上：

```
		player.transform.position = spawnPoint.position;
		player.transform.rotation = spawnPoint.rotation;
		Physics.SyncTransforms();
```





## 备用

### 加载多个场景之后要激活场景

默认是第一个为激活的场景，最好明确指定那个场景为激活场景。

```
public static bool SetActiveScene(SceneManagement.Scene scene);
```



### Mathf.clamp

```
public static float Clamp(float value, float min, float max);
```

如果value在min和max之间则返回value，如果小于min则返回min，如果大于max则返回max。一个很方便的函数控制某个变量的值在某个范围内。

### 在Editor上增加一点空白距离

```
[Space]
```

在Unity Editor上的检查器面板上增加一点距离。

### 移动控制

`Input.GetAxis(axis_name)` 获取当前控制轴的值，比如Horizontal axis 方向left和 a键为-1，right和d为1。

### transform.Translate和Rigidbody.MovePosition

经过试验结论如下，在速度特别快的情况下两个都可能发生避开物理碰撞系统而发生穿模，速度很低的情况下两个也都不会穿模。不过在速度中等的情况下，用Transform的translate方法移动物体仍时不时会避开物理刚体碰撞系统，而在这种情况下刚体的MovePosition就表现要好一下。

此外FixUpdate的固定时间设定也会很好地防止物体移动速度不可捉摸的突变情况。

### 地形绘制纹理

主要是编辑图形层那里，显示创建图层，再是添加图层。在这些图层里面利用不同的笔刷进行绘制。

笔刷的不透明度是笔刷的力度。



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

Slug: unity-editor
Tags: unity
Status: draft
[TOC]

## 前言

本文是Unity游戏开发系列的编辑器编码部分。

### 本系列内容的取舍

- 因为笔者开发的是3D游戏，因此专属于2D游戏的那些内容将不会在这里讨论。
- 笔者使用的是Unity 2020.3 LTS版本，之前的版本被废弃的特性或者之后的版本新增的特性将不会在这里讨论。
- 笔者在行文上会尽可能节省笔墨，只是标出官方参考文档的引用出处，但在某些地方会额外花费笔墨来说明，比如个人觉得官方文档文字可能不是很好懂，某些内容很重要需要再特别强调一遍等。



## MenuItem

为你的unity编辑器添加一个菜单项。

```
public class EditorHelloWorld : EditorWindow
{
    [MenuItem("Tools/STStudio/Utilities/HelloWorld", false)]
    private static void ShowWindow()
    {
        EditorWindow.GetWindow(typeof(EditorHelloWorld));
    }

    private void OnGUI()
    {
    }
}
		
```

第二个参数如果是false则就是创建菜单项点击之后的动作，如果是true则下面的函数是校验函数，如果该校验函数返回false则菜单项将是禁用状态。

## 属性值

### TextAreaAttribute

这会让你的字符串有一个更宽的文本输入区域。

```
using UnityEngine;

public class TextAreaExample : MonoBehaviour
{
    [TextArea]
    public string MyTextArea;
}
```



### TooltipAttribute

给Unity编辑器的某个字段增加一个提示信息，当鼠标悬停的时候会弹出这个提示信息。

```
using UnityEngine;

public class Example : MonoBehaviour
{
    [Tooltip("Health value between 0 and 100.")]
    int health = 0;
}
```



### 自定义属性

如下 `Header` 是自定义的属性：

```
	[Header("Persistent managers Scene")]
```

添加一个属性Header，则会在编辑器的Inspector窗口上添加一个标题头，你也可以自定义自己的属性装饰函数。

```c#
	public class HeaderLineAttribute : PropertyAttribute {

		public readonly string header;
		
		public HeaderLineAttribute(string header)
		{
			this.header = header;
		}
	}
```

如上定义了一个 `HeaderLineAttribute` 属性装饰函数，实际使用是：

```
[HeaderLine("Input")]
```

【似乎如果该类的名字有Attribute则会省略。】

然后该属性装饰函数你可以定义属性绘制类：

```c#
	[CustomPropertyDrawer (typeof(HeaderLineAttribute))]
	public class HeaderLineDrawer : DecoratorDrawer
	{
		public HeaderLineDrawer ()
		{
		}
	}
```

DecoratorDrawer类似PropertyDrawer，区别就是DecoratorDrawer不绘制属性，除了从对应的PropertyAttribute对象那里获取的数据。

具体绘图是根据 `OnGUI`  重载方法来的。

## 完全定制类的Inspector视图

属性值只是一个影响类的Inspector视图的方式，你还可以对你编写的类完全来定义Inspector视图。

### 第一个例子

现在假设你定义了一个SomeScript类，其继承自MonoBehaviour，然后你希望定制这个SomeScript组件在Unity编辑器上的Inspector视图。一个简单的编辑器定制代码如下所示：

```c#
using UnityEditor;

[CustomEditor(typeof(SomeScript))]
public class SomeScriptEditor : Editor
{
    public override void OnInspectorGUI()
    {
        SomeScript someScript = (SomeScript)target;

        someScript.experience = EditorGUILayout.IntField("Experience", someScript.experience);

        EditorGUILayout.LabelField("Label: ", someScript.Level.ToString());
    }
}
```

1. `using UnityEditor;` 一般进行Unity Editor开发需要引入这个命名空间。
2. 关于Editor的类是继承自 `Editor` 这个类。
3. `[CustomEditor(typeof(SomeScript))]`  指明你要定制那个类的Inspector视图。
4. 重载override `OnInspectorGUI` 方法来实现Inspector视图的定制。在`OnInspectorGUI` 方法里面 `target` 就是目标类对象。

### 添加一个整数值

```
someScript.experience = EditorGUILayout.IntField("Experience", someScript.experience);
```

上面接受两个参数，第一个参数是显示字符，第二个参数是整数值来源。

上面写成再一次赋值语句，应该是从编辑器那边修改值之后，然后修改值再回写回来。【个人尝试是如果不写成这种赋值语句修改值动作是无效的】

### 添加一个Lable

```
EditorGUILayout.LabelField("Label: ", someScript.Level.ToString());
```

上面接受两个字符串参数，其中第一个参数是左边的label，第二个参数是右边的label。

### 添加一个按钮

具体请参见下面的例子：

```c#
using UnityEditor;
using UnityEngine;

[CustomEditor(typeof(TestSerializableDict))]
public class TestSerializableDictEditor : Editor
{
    public override void OnInspectorGUI()
    {
        base.OnInspectorGUI();

        TestSerializableDict targetScript = (TestSerializableDict)target;
        if (GUILayout.Button("test"))
        {
            targetScript.Test();
        }
    }
}
```

上面代码如果点击按钮的话会执行 `TestSerializableDict` 脚本组件里面的Test方法。

上面的 `base.OnInspectorGUI();` 是将该脚本组件原来该有的属性视图都添加上，在 [这个网页](https://learn.unity.com/tutorial/editor-scripting) 提到 `DrawDefaultInspector();` 也有类似的作用，这两者是完全一样还是有细微的差异个人不太清楚。





### 默认显示动作

```
public override void OnInspectorGUI(){
    DrawDefaultInspector();
}
```

`DrawDefaultInspector` 方法会让你的自定义类显示先绘制默认的显示动作。

估计 `base.OnInspectorGUI` 的写法效果是一样的。

### EditorGUI和EditorGUILayout的区别

原则上Editor编码应该使用EditorGUI和EditorGUILayout，不过大致查了一下，要创建button还是需要通过GUILayout类。

EditorGUI和EditorGUILayout这两个类的区别是EditorGUILayout是自动布局的，比如说创建一个Lable：

```
# EditorGUI
public static void LabelField(Rect position, string label, GUIStyle style = EditorStyles.label);

# EditorGUILayout
public static void LabelField(string label, params GUILayoutOption[] options);
```

EditorGUILayout是不需要Rect这个参数的，而EditorGUI是需要Rect这个参数要指明本Label从哪里开始还有宽和高都是多少【前两个参数x，y定义了本矩形区域的左上角顶点，然后第三个参数是width，第四个参数是height。】。



## 附录

### serializedObject和target

在自定义编辑器类里面 `serializedObject` 和 `target` 都是引用当前Inspector的类对象，但是又有一些细微的差异。`serializedObject` 可以用下面的代码来理解：

```
serializedObject = new SerializedObject(targets);
```

target只是引用当前监视的第一个对象，而targets则是当前监视的多个对象【值得是Unity的多对象编辑操作】。一般实践新的代码都推荐使用serializedObject。上面讨论参考了 [这个网页](https://forum.unity.com/threads/editor-target-vs-editor-serializedobject.640072/)。

### SerializedObject

#### `FindProperty`

根据字符串返回指向SerializedObject某个属性的SerializedProperty。

```
SerializedProperty serializedPropertyMyInt = serializedObject.FindProperty("myInt");
```



### SerializedProperty

### ReorderableList

这个类在 `UnityEditorInternal` 命名空间里面，官方文档对这个类也语焉不详，但是是一个很好的表现列表的类，[这篇文章](https://va.lent.in/unity-make-your-lists-functional-with-reorderablelist/) 对这个类的讨论很有参考价值。

```c#
public ReorderableList(
	SerializedObject serializedObject, 
	SerializedProperty elements, 
    bool draggable, 
    bool displayHeader, 
    bool displayAddButton, 
    bool displayRemoveButton);
```

SerializedProperty可以是array，应该也可以是List。该对象还提供了很多回调属性：

- drawHeaderCallback
- drawElementCallback
- onSelectCallback
- onAddCallback
- drawElementBackgroundCallback

#### drawHeaderCallback

列表前面的Header回调方法，首先是：

```
list.drawHeaderCallback = new ReorderableList.HeaderCallbackDelegate(DrawHeader);

private void DrawHeader(Rect rect)
{
    EditorGUI.LabelField(rect, "Header");
}
```

这个回调方法没有赋值可能有默认的行为，赋值之后会使用再定义的回调方法。

#### drawElementCallback

绘制列表中的某一个元素的回调方法：

```
list.drawElementCallback = new ReorderableList.ElementCallbackDelegate(DrawElement);

private void DrawElement(Rect rect, int index, bool isActive, bool isFocused)
{
}
```

在回调方法里面，通过`GetArrayElementAtIndex` 方法来获取目标element，index是当前绘制的element索引值：

```
var element = serializedObject.FindProperty("list").GetArrayElementAtIndex(index);
```

通过 `FindPropertyRelative` 方法来获取目标element里面的属性值：

```
element.FindPropertyRelative("Name");
```





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

Tags: unity
Status: draft

[TOC]

## 前言

本文是Unity游戏开发系列的动画部分。

### 本系列内容的取舍

- 因为笔者开发的是3D游戏，因此专属于2D游戏的那些内容将不会在这里讨论。
- 笔者使用的是Unity 2020.3 LTS版本，之前的版本被废弃的特性或者之后的版本新增的特性将不会在这里讨论。
- 笔者在行文上会尽可能节省笔墨，只是标出官方参考文档的引用出处，但在某些地方会额外花费笔墨来说明，比如个人觉得官方文档文字可能不是很好懂，某些内容很重要需要再特别强调一遍等。
- 一般来说官方文档里面有的不会在这里赘述，不过有时某些内容会特别重要而会再强调一遍。





## 动画

### 新建动画

制作动画片段：

1. 新建一个Animations文件夹等下放动画片段资源
2. 选中你想要有动画效果的那个组件，选定window->Animation->Animation。
3. 选择启用关键帧记录模式，然后在每个帧上修改物体组件的某个属性

动画的开头和结尾常常有卡顿现象，哪怕你设置的旋转动作是0度到360度数值上是无缝对接的，仍然会有卡顿现象，你可以在曲线那里看到数值的变动是有一个切线变化率的，每一个帧都有两个切线，左切线是进入，右切线是离开，从头帧到结尾帧要想不卡顿，左右两个切线斜率必须是相同的，也就是co-linear的。

对于旋转动作可以将头尾两帧的双切线都改为线性。对应官方文档的 Broken-Linear模式。这样帧与帧之间是线性变化的，也就不存在那个变动斜率问题了。

### 导入模型动画时的可选配置

- Loop Time 循环时间：动画是否循环播放
- Root Transform Rotation 根变换旋转  Bake into pose 烘焙成动作 。下面三个根变换相关的选项都是在说你是否希望动画会实际影响模型的这些属性，比如这里就是你是否希望动画会影响模型的旋转属性，如果勾选了烘焙成动作，则动画不会影响角色的根旋转。比如说直走，则动画导入勾选这个选项。
- Root Transform Position (Y) - 烘焙成动作。动画剪辑不会影响游戏对象的高度。大部分游戏动画剪辑都会启动此设置，只有跳跃才应该将此设置关闭，不过跳跃动画有的也只是一种原地跳姿态，然后再实际动画中用脚本去移动游戏对象。
- Root Transform Position (XZ) - 烘焙成动作。一般角色的IDLE状态会希望启用此选项。

我看到有的推荐将这三个选项都勾选上，也就是动画剪辑完全不会影响游戏对象的根运动，游戏对象的移动旋转都由脚本控制。

### Animator组件

控制GameObject的动画组件，需要指定动画控制器，也就是AnimationController。

Apply root motion：应用根运动。是从动画本身控制角色的移动和旋转还是从脚本。

脚本那边设置这个参数是通过 `animator.applyRootMotion` 。如果脚本定义了 `OnAnimatorMove` 方法，则applyRootMotion不起作用 【参考Animator.applyRootMotion 文档。】。

更新模式：

- Normal 法线 Animator和Update同步更新
- Animate Physics Animator和FixUpdate同步更新，即和物理系统步调一致

剔除模式：

- 总是动画化，即使在屏幕外也不剔除。

#### 动画状态判断

动画状态判断推荐使用 `animator.StringToHash("State")` 来获取一个int型hash值然后进行状态判断。

具体比较是：

```
CurrentStateInfo = animator.GetCurrentAnimatorStateInfo(0);
Animator.StringToHash("Run") == CurrentStateInfo.shortNameHash;
```

默认的图层索引是0，上面CurrentStateInfo就是当前的动画状态，`CurrentStateInfo.shortNameHash` 就是当前动画状态的短名字的Hash值，短名字的意思就是你的动画控制器那边显示的名字是Run则就是Run，前面没有默认的图层名字。

#### 标签

动画控制器的标签也是一个有用的字段方便进行一些动画控制上状态的逻辑管理。

#### 动画层



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

Slug: unity-basic
Status: draft
[TOC]

## 前言

本文是Unity游戏开发系列的基础部分。

### 本系列内容的取舍

- 因为笔者开发的是3D游戏，因此专属于2D游戏的那些内容将不会在这里讨论。
- 笔者使用的是Unity 2020.3 LTS版本，之前的版本被废弃的特性或者之后的版本新增的特性将不会在这里讨论。
- 笔者在行文上会尽可能节省笔墨，只是标出官方参考文档的引用出处，但在某些地方会额外花费笔墨来说明，比如个人觉得官方文档文字可能不是很好懂，某些内容很重要需要再特别强调一遍等。

## 开发环境

1. 安装visual studio
2. 选择安装 `使用unity的游戏开发` ，默认是会自动安装 `unity hub`，这是一个可选项，你取消勾选之后后面也可以自己单独去安装 `unity hub` 。
3. 通过 `unity hub` 来安装unity editor，笔者推荐安装一个最近的LTS版本。你也可以在官网上下载unity editor然后在 `unity hub` 上定位即可。



## 初识unity

### 新建一个C#脚本

该脚本名字随意，但需要遵守如下规范：

1. 因为该脚本的名字就是类的名字，所以一般开头大写，然后在写法上遵守驼峰规则。
2. 该脚本的名字和里面类的名字一致。

### 双击脚本自动打开visual studio

可能已经设置好了，如果没有设置好，可以去 `Edit->Perferences->External tools->External Script Editor` 那里设置。

设置好了就可以双击脚本来打开visual studio了。

### 将脚本作为组件挂在摄像头上

记得visual studio那边修改名字之后要保存下，然后点击摄像头，添加组件，选择脚本。

### 入门Debug

你的脚本类需要继承自 `MonoBehaviour` ，这样unity才能知道那个是一个脚本类。

Start方法每个组件游戏开始时就会执行，在这个方法里面写上这样的Debug语句：

```
    void Start()
    {
        Debug.Log("hello world!");
    }
```

保存运行游戏，如果没有问题的话，你在控制台那边应该看到一个hello world的消息。入门第一课算是完成了。

加分项，熟悉下面的LogFormat方法的用法，以后某些情况会很方便的。

```
Debug.LogFormat("{0} + {1} = {2}", 2,3,2+3);
```




## Unity Editor的使用

关于Unity Editor的基本使用请读者自行熟悉软件界面，然后试着自己慢慢搭建起，比如一个平面作为一个基本的游玩空间，平面由四面墙围起来，然后等等其他立方体等等。移动缩放旋转和复制等等。

推荐是找个相关的入门视频看看，当然喜欢自己摸索的多接触接触也就可以了。

### 预制件

预制件Perfab非常的有用，可以说是Unity开发里面很重要的一个核心概念了。可以将Perfab理解为编程中的类，而场景中的各个对象在没有perfab之前属于游离的实例，在创建perfab之后才真正可以称之为根据某个perfab类在场景中创建的实例。

嵌套预制件，多个perfab形成嵌套关系并没有改变原perfab和场景中实例间的继承关系。

预制件变体，你可以根据某个perfab来创建某个预制件变体，这些预制件变体更类似于类的继承关系，比如你改变原预制件的某个属性，之后创建的预制件变体的某个属性也会对应发生更改。【变种属性应该继续保持原有的继承更改关系。】

**需要注意的是在项目间重复使用，Perfab和Perfab之间和各个资产之间的引用关系必须是一致的，也就是原Asset资产的文件夹层次是保持一致的。**

### 解压缩Perfab

是由原场景中GameObject转成Perfab的反向操作，也就是该GameObject成为一个常规的GameObject了。

### 练习题1

请读者随便新建一个场景，新建一个平面，然后在该平面的两角放置两个立方体，两个立方体是根据一个立方体预制件perfab而来，然后将该立方体拖动为平面的子辈。然后将平面预制件化。然后再根据该平面预制件再新建一个平面。

经过试验我们可以发现，嵌套预制件也有一种继承层次在里面。

比如现在假设立方体盒子的基色是橙色，那么最开始两个平面的所有盒子都是橙色材质。然后现在修改平面预制件里面的右边的盒子颜色为紫色材质。继而出来后会发现两个平面的右边的盒子都变为了紫色。

再继而修改场景中具体某个平面的右边的盒子材质为红色，继而我们发现只有该盒子变为了红色材质。

这个显示结果是符合大家预期的，但这里更深入的是需要理解嵌套预制件的属性继承关系。

以最左角的盒子为例子，它的材质属性场景中没有修改，再继而去找平面的预制件，然后平面预制件也没有修改，再继而去找立方体盒子预制件，最终该盒子的材质属性等于原立方体盒子预制件的属性。

以第二个盒子为例子，它的材质场景中没有修改，平面预制件中修改为了紫色，所以该盒子的材质为紫色。

简单点来说，各个GameObject中的属性查找是：场景中的修改 > 预制件中的属性修改 > 嵌套预制件中的属性。





## 序列化

序列化这小节内容又往前提了一点，其重要性总是超过了Unity初学者的预期。最开始以为这是理解Unity Editor如何工作的关键，但实际上序列化这小节内容可以说是渗透进了Unity开发的方方面面，从理解Unity Editor工作原理，到理解ScriptableObject，到理解JsonUtility和相关JSON序列化手段，到如何更有效地搭建自己游戏的状态保存方案等。

首先推荐读者参考阅读 [这篇文章](https://blogs.unity3d.com/2014/06/24/serialization-in-unity/) 和官方文档的 [脚本序列化](https://docs.unity3d.com/cn/current/Manual/script-Serialization.html) 一小节。

首先是你在Unity Editor上执行保存这个动作的过程，实际上就是Unity内部执行序列化的过程。一般来说这些可以序列化的对象在Unity Editor的检查器面板是看得到的。此外还有：

- perfab 预制件实际就是对一个或多个游戏对象的序列化数据存储。
- 实例化过程 当调用 `Instantiate`方法是Unity首先是把该对象序列化，然后新建一个对象，然后反序列化获得的数据打入新的对象中。
- 场景的保存和加载也是利用了基于yaml的序列化和反序列化动作。
- 热重载【就是Unity侦测到你的脚本或者某个资源等发生了变化会自动进行热重载更新】其首先会序列化所有编辑器窗体，再销毁窗体，再更新旧的C#代码，再加载新的C#代码，再重新创建窗体。



Unity会对以下属性进行序列化：

- public
- [SerializeField] 标记的属性
- not static
- not readonly
- not const
- unity能够序列化的

unity能够序列化的属性：

- 自定义的非抽象类有[Serializable] 标注，比如：

```c#
[Serializable]
class Trouble
{
   public Trouble t1;
   public Trouble t2;
   public Trouble t3;
}
```

- 自定义的结构有[Serializable] 标注
- 由UntiyEngine.Object衍生出来的类【所以ScriptableOjbect是可以序列化的】
- C#的基本数据类型（int, float, double, bool, string etc.）
- 枚举类型
- 某些 Unity 内置类型：Vector2、Vector3、Vector4、Rect、Quaternion、Matrix4x4、Color、Color32、LayerMask、AnimationCurve、Gradient、RectOffset、GUIStyle
- 可以序列化对象组成的array
- `List<T>`  T是可序列化的类型。

可序列化对象组成的数组或列表稍有一些要注意的点，后面再说。

### 自定义的可序列化类

自定义的类除了上面提到的要有 `[Serializable]`  属性标注之外，还需要是**非抽象的**，**非静态的**，**非泛型的**【但可继承自泛型类】。

此外自定义的可序列化类**不支持null** ，但是我看到有的地方在实现上会给那些可自定义可序列化类赋值default，按照道理来讲default其实就是null，然后从具体运行来看可以看出和普通的c#代码的一个很大的不同就是，自定义的可序列化类已经默认执行了 `new What()` 这样的实例化动作了，而c#那边则仍然是null。

自定义的可序列化类不支持多态。老实说官方文档这段怎么也没看懂。。

### SerializeField

上面序列化一节提到，一个私有字段如果加上 `[SerializeField]` 标识，Unity对该私有字段也将使用序列化技术。

```
[SerializeField] 
private AssetReference _persistentManagersScene = default;
```

### NonSerialized

有的时候某些public属性你不需要系列化则可以加上修饰头 `[NonSerialized]` 。

```
    [NonSerialized]    
    public int p = 5;
```



### ScriptableObject

ScriptableObject继承自UntiyEngine.Object，按照上面序列化一小节的描述，ScriptableObject是可序列化的对象。

ScriptableObject的作用是充当一个数据容器。Unity的预制件实例化，里面的数据将会产生多个副本，所以对于重复使用的公有数据一般是推荐使用ScriptableObject来存储数据，然后预制件来访问这些数据。

#### ScriptableObject的唯一性

ScriptableOjbect的唯一性是根据你创建的asset文件唯一性来的，只要保证是引用的同一asset文件，则生成类的实例都是一样的，个人测试也是实例id都是一样的。

如果是和Unity Addressable Asset system相结合，如果你的ScriptableObject是通过 `LoadAssetAsync` 加载进来的，那么在引用Asset的时候实际上都是在使用一个ScriptableObject，你可以将这个ScriptableObject看作类似perfab预制件一样的东西，直接使用该数据对象就是直接使用预制件，都是在用同一个东西。

而如果你调用 `InstantiateAsync` 来对ScriptableObject进行了实例化，则就是不同的数据对象了。[参考网页](https://docs.unity3d.com/cn/2019.4/Manual/class-ScriptableObject.html)。

经过个人试验发现：

```
		bool t1 = _menuToLoad[0] == _menuToLoad[1];
		bool t2 = _menuToLoad[1] == _menuToLoad[2];
		Debug.Log($"{_menuToLoad[0].GetHashCode()}");
		Debug.Log($"{_menuToLoad[1].GetHashCode()}");
		Debug.Log($"{_menuToLoad[2].GetHashCode()}");
		Debug.Log($"test:      {t1}");
		Debug.Log($"test:      {t2}");

		return;
```

上面代码`_menuToLoad` 列表一号和二号是不同的scriptableobject，二号和三号是相同的scriptableobject。然后scrptableobject的相等性可以使用 `==` 运算符来进行，然后通过HashCode发现相同的scriptableobject的哈希值也是相同的。

#### 创建一个ScriptableObject对象

```
[CreateAssetMenu(fileName = "Data", menuName = "ScriptableObjects/SpawnManagerScriptableObject", order = 1)]
public class SpawnManagerScriptableObject : ScriptableObject
{
    public string prefabName;

    public int numberOfPrefabsToCreate;
    public Vector3[] spawnPoints;
}
```

fileName是点击菜单按钮之后默认保存的文件名，menuName是在Unity Editor对应的菜单按钮位置。



### 新增可序列化类

主要是加入 `ISerializationCallbackReceiver` ，具体要实现两个方法：

- OnAfterDeserialize
- OnBeforeSerialize

一般来说你新增的可序列化类是基于原Unity能够序列化的那些数据字段的，然后你想保存的某种数据结构会是该可序列化类的私有对象。下面就是要实现上面的两个方法来实现核心数据和可序列化数据的同步。  `OnBeforeSerialize` 是根据核心数据来生成可序列化数据，然后让Unity去处理那些可序列化数据，一般来说后面自定编辑器的其他功能都只能看到那些可序列化数据的。`OnAfterDeserialize`  要做的事情就是根据那些可序列化数据来生成你的核心数据。这两个过程都必须是完成新生成数据模式，这样才能保证两端数据是同步的，因为你根本无法知道编辑器那边对那些可序列化数据做了些什么改动，所以只能完全重新生成。





## 摄像机

摄像机里面有些术语，具体观察下场景：

- Near cliping plane 最近裁剪面，摄像头和最近裁剪面之间的那点空间里面的游戏对象是不会渲染的。

- Far cliping plane 最远裁剪面 意义很明显，超过那个平面的游戏对象是不会渲染的。

- Camera frustum 摄像机截头体 就是由上面的最近裁剪面和最远裁剪面组成的一个类似金字塔形状去掉头的那个空间，这部分空间里面的游戏对象才会渲染到摄像机里面。

  

后面会讲到从摄像机发射射线的概念，这个射线的定义对物理系统射线投射可以相互配合，这个射线有个screenpoint或者vireport的平面概念，这个平面指的就是最近裁剪面，也就是可以理解为这个射线是从最近裁剪面发射出去的。

### 多个摄像机

Unity可以添加多个摄像机组件，摄像机有个参数叫做深度，这个深度值最大的摄像机将是最终显示的那个摄像机【如果两个摄像机在显示上都是全覆盖的】。

### Camera.main

如果你的主摄像机有标签 `MainCamera` ，则可以通过 `Camera.main` 来调用。

### Camera.ScreenPointToRay

定义了一个射线，从摄像机出发射向屏幕的某个坐标点。

```
public Ray ScreenPointToRay(Vector3 pos);
```

该pos的z值将忽略。

还有一个类似的方法 ViewportPointToRay ，ViewPortPoint里面是通过 `0-1` 来定义平面点的位置，而ScreenPoint是通过像素距离来定义平面点的位置。

### viewportToWorldPoint

根据摄像机视图空间的一个Vector3坐标转成游戏场景中的Vector3坐标。

```
Vector3 p = camera.ViewportToWorldPoint(new Vector3(1, 1, camera.nearClipPlane));
```

其中Vector3的x和y如果是 `(0,0)` 则是左下角，如果是 `(1,1)` 则是右上角，这个z值设置为 `camera.nearClipPlane` 是摄像机的近裁剪平面，还有一个远裁剪平面，z值也可以设置为0就是紧贴着摄像机。



### 分屏显示

摄像机的Viewport矩形x和y值决定了显示的起始位置，x值是横向，y值是竖向。比如(0,0) 是最左边那里，`(0.5,0)` 是横向宽度50%竖向继续0%那里。然后w是显示的宽度，0.5就是显示宽度为整个宽度的50%。h是显示高度。

调配两个摄像头的Viewport矩形参数，一个(0,0)显示宽度0.5，显示高度1；一个(0.5,0)显示宽度0.5，显示高度1就可以达到一种横向分两个屏幕显示的效果。

继续调配这个Viewport矩形参数还可以做到另外一个摄像头专门在显示界面右上角来显示，一种类似小地图的功能。



### cinemachine

cinemachine不是要取代原Unity的摄像机组件，而是新增了一个cinemachine brain组件用于控制原Unity摄像机的位置和Aim，同时还提供了其他一些额外的功能，比如摇动效果。

利用cinemachine创建一个第三人称跟踪式摄像头是很方便的，而后续更多的运镜，包括摇摄，跟摄，多个摄像头视角转换都可以很容易办到。

一般使用就使用virtual camera，其他camera只是在特定应用场景下才好用，可能额外增加的一些特性限定并不适合你的应用需求。

Follow控制的摄像头的跟随对象，Body控制的是摄像头跟随跟随对象的移动行为，但是要注意3rd person follow 似乎还会有额外的摄像头旋转动作。

loot at控制的摄像头的瞄准对象，Aim控制的是摄像头的旋转行为，有可以根据用户行为来旋转摄像头，但只是针对的旧版本的输入控制，如果你希望自己实现根据用户的操作来旋转摄像头，最好是自己编写脚本，那么Aim填上do nothing，免得干扰。

body的Framing transposer很灵活和全面，很好用，摄像头偏移，距离，damping，dead zone，soft zone等概念都是可以调整的。

- dead zone cinemachine会保证那个黄点也就是关注点在dead zone之内
- soft zone 如果黄点在dead zone则不会有动作，如果黄点在soft zone 则摄像头会开始调整，摄像头调整可块可慢，具体可根据damping这个值来设置。





## 光源

默认的定向光可以类比太阳光，点光源可以类比灯泡，聚光灯可以类比汽车的前照灯。

需要强调一点的是Unity里面的灯光是游戏对象的组件，当你在空白地方新建一个灯光的时候，实际上是新建了一个空白对象然后包含了一个灯光组件。前面提到的各个灯光类型比如定向光点光源都是灯光组件的类型变量控制的，这都是可以调整的。

以新建一个路灯为例子，路灯有杆子和上面的立方体，给上面的立方体一个灯光组件就有了一个类似路灯的效果。

最后要提醒一点的是灯光只是让这个对象在发光，要让这个对象看起来在发光还需要给这个对象添加对应的发光材质。

## 地形

前面说过，这里再强调一遍，地形更多是你未来场景的蓝图，而不是你未来游戏的实际效果展示，所以在绘制地形的时候不要花费太多精力在地形的细枝末节上，点到为止即可，很多细节还需要后面慢慢调整的【因为地形也不仅仅只是环境搭建，还要考虑游戏流程和关卡设计的。】

默认地形宽度长度为一千米。





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

Status: draft

[TOC]

## 前言

本文是Unity游戏开发系列的输入部分。本文主要讨论的是Unity内置的Input输入模块，此外还有一个新的input system，不过对于刚接触unity输入系统这块的初学者来说，还是建议先学习用好unity内置的input输入模块，这个用熟了然后后面再根据需要决定是否需要升级为新的input system。

### 本系列内容的取舍

- 因为笔者开发的是3D游戏，因此专属于2D游戏的那些内容将不会在这里讨论。
- 笔者使用的是Unity 2020.3 LTS版本，之前的版本被废弃的特性或者之后的版本新增的特性将不会在这里讨论。
- 笔者在行文上会尽可能节省笔墨，只是标出官方参考文档的引用出处，但在某些地方会额外花费笔墨来说明，比如个人觉得官方文档文字可能不是很好懂，某些内容很重要需要再特别强调一遍等。
- 一般来说官方文档里面有的不会在这里赘述，不过有时某些内容会特别重要而会再强调一遍。



## GraphicRaycaster和UI操作

Canvas的GraphicRaycaster组件的用处就是将射线投射到画布上，可以利用GraphicRaycaster来判断本Canvas当前那些画布元素是被击中的，或者说的再简单点是在鼠标当前所在位置上的。

如下面的代码就是利用本画布上的GraphicRaycaster组件来获取当前鼠标位置上的画布元素。

```c#
private GraphicRaycaster rc;
private PointerEventData pt; 

rc = GetComponent<GraphicRaycaster>();
pt = new PointerEventData(EventSystem.current);

pt.position = Input.mousePosition;

List<RaycastResult> results = new List<RaycastResult>();

rc.Raycast(pt, results);
```

这些画布元素存储在results上：

```
        foreach (RaycastResult swatch in results)
        {
            Debug.Log($"{swatch.gameObject.name}");
        }
```

假设有两个画布元素，一个Panel，Panel上面一个Image，`Raycast Target` 属性是勾选确认状态，则上面results的长度是二。如上所示`swatch.gameObject`就是该画布元素对象，后续可以进行进一步的判断操作。

在一些Canvas情况不是很复杂的时候推荐使用Raycast来解决问题。

### RaycastAll

RaycastAll方法是所有的BaseRaycasters都进行了射线投射，这其中还包括PhysicsRaycaster等。还不清楚PhysicsRaycaster的用途，不过假设有多个Canvas的情况下，通过这个RaycastAll来进行所有GraphicRaycaster的射线投射是很便利的。

```c#
        PointerEventData eventDataCurrentPosition = new PointerEventData(EventSystem.current);
        eventDataCurrentPosition.position = Input.mousePosition;
        List<RaycastResult> results = new List<RaycastResult>();
        EventSystem.current.RaycastAll(eventDataCurrentPosition, results);
```

上面获得的result含义和之前讨论的相同，是当前鼠标所在位置射线投射穿过的所有对象。

同样类似上面的讨论如果某个UI元素 `Raycast Target` 属性没有勾选也是不会检测到的。

### IsPointerOverGameObject

通过 `EventSystem.current.IsPointerOverGameObject()` 可以判断当前的pointer是否在某个event system object上，在很多情况下似乎可以达到一种能够判断当前pointer是否在UI上的效果，但这个函数名，加上所谓的event system object具体是什么东西并不大确切，而且具体各个对象的属性也没有获取无法获得进一步的判断效果，这个方法只是备用。

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

Tags: unity
Status: draft

[TOC]

## 前言

本文是Unity游戏开发系列的图形部分。

### 本系列内容的取舍

- 因为笔者开发的是3D游戏，因此专属于2D游戏的那些内容将不会在这里讨论。
- 笔者使用的是Unity 2020.3 LTS版本，之前的版本被废弃的特性或者之后的版本新增的特性将不会在这里讨论。
- 笔者在行文上会尽可能节省笔墨，只是标出官方参考文档的引用出处，但在某些地方会额外花费笔墨来说明，比如个人觉得官方文档文字可能不是很好懂，某些内容很重要需要再特别强调一遍等。



## 计算机图形学

个人精力有限，不可能去钻研计算机图形学里面那些复杂的东西的，但是Unity游戏开发里面的图形说到底和计算机图形学里面讨论的图形是一个东西，很多东西概念都是相同的，如果完全不理会的话，会发现接触的很多概念都没弄懂没弄明白，有的不深究也可，有的不深究则是完全不知道这是一个什么东西，用都用不好。本小节主要讨论的是计算机图形学相关理论知识，一般是和下面讨论的内容很相关，觉得实在有必要拿出来讨论一下。





### 摄像机

模拟的3D世界最终在摄像机上成为2D图像。摄像机定义了一个锥体，这个锥体叫做viewing volume，只有在

## PBR材质

pbr材质【全称叫做 Physically Based Rendering】能和环境交互，因此提供了更真实的材质效果。

### 光线的基本原理

光是走直线的，遇到金属表面会反射，法线是垂直于金属表面的线，入射光线与法线的夹角叫入射角，反射光线与法线的夹角叫反射角，入射角和反射角相等。当光线从一个介质进入另外一个介质则会发生折射现象，折射角具体大小由介质之间的折射率决定。因为物体表面并不是绝对光滑的，于是还存在着散射现象。这是高中光学的基本知识。

散射现象的另外一种解释是光线射入另外一个介质中，然后被里面的原子反复弹射几次之后再射出来，也就是不认为是物体表面不够光滑造成的。比如Lambertian模型在考虑散射现象的时候是不考虑粗糙度这个变量的。其他散射模型比如Oren-Nayar会考虑粗糙度这个变量。

### 微表面理论

微表面理论认为物体表面是由一些细小的各自朝向不同的微小表面组成，每个微小的表面上面基于自己的法线发生着反射现象。也就是微表面理论认为物体表面的粗糙引起了光的散射。



### F0(Fresnel Reflectance at 0 degree)

Fresnel effect描述了一种光的现象，当光的入射角越来越接近于零，也就是越来越接近物体表面的时候，反射光的量会越来越大。

F0就是描述了这个入射角接近零度的时候的情况，对于非金属来说其值一般为0.02-0.05，对于金属来说其值一般为0.5-1.0。



### 金属还是非金属

现实中物质的颜色是因为某部分波长的光被吸收了，然后散射出来的光显出了颜色。对于非金属来说diffuse map里面是有颜色的，这个颜色一般对应的就是现实世界中非金属我们看到的那个颜色；对于金属来说在PBR里面是认为折射进入金属的光都被吸收了，金属的diffuse map里面是没有颜色的。

### linear space rendering

对于颜色值的计算和颜色操作应该在linear space下，人眼对颜色的观察是非线性的是gamma-encoded space（sRGB）。

对于人眼看到观察的颜色应该用sRGB，对于粗糙度的表达或者金属度的表达则应该使用linear。



### Metal/Roughness

- base color map  sRGB 【对于非金属是颜色对于金属是反射度，金属的反射度一般是70%-100%，颜色在180-255。】
- metallic map grayscale linear 【0是黑色代表非金属，1是白色代表金属。】【对于金属度的不同PRB对上面base color map里面的值的解释会不同，非金属是颜色，金属是反射度。】【会自动应用F0 4%。】
- roughness map grayscale linear【黑色表示光滑，白色表示粗糙。】
- height map 可选
- ambient occlusion map 可选

### Specular/Glossiness

- diffuse map 【有的地方也叫做albedo】【金属就是0黑色没有颜色，其他配上相应的颜色。】
- specular map 【对于金属是反射度，对于非金属是F0。】
- glossiness map
- normal map 可选
- height map 可选
- ambient occlusion map 可选

### metallic

金属的，定义了材质的金属表现。

### Smoothness

平滑度，定义了材质的表面光滑性。一般为了看上去更真实不应该设置为0或1而是某个中间值。

### 

pbr材质主要有以下参数：

- color 基础颜色 有的地方你会看到叫做albedo
- metallic  金属度 
- roughness 粗糙程度
- normal 法线图
- height 
- ambient occlusion 环境光遮蔽 有的地方会简称为AO

颜色可能是初学者最容易理解也是推荐最先使用好的参数。

金属度 和 粗糙度 

法线图 和 高度图 影响的材质的高度表现

## LOD技术

unity的LOD技术可以根据游戏对象与摄像机的距离来选择性地使用游戏对象不同的渲染模型。

具体就是创建一个空的游戏对象，添加LOD group组件。然后将blender建模的不同精细度的模型导入到该游戏对象，并拖动到LDO group那里对应不同的LOD显示级别。其中LOD0是精细度最高的模型。

blender那边需要建模不同精细度的模型，导出的时候名字一般规范为： `Name_LOD0` 等。一个简单的做法是对网格体使用精简修改器，刚开始调配的多边形数目小的不能再小的建模再网上抬高一点为LOD0，然后再继续降低多边形数目，这个时候你会发现模型出现了一些瑕疵或缺陷，这是可以容忍的，因为LOD1是摄像机距离有点远的时候了，这个时候玩家一般不会太注意这些模型的小瑕疵了。







## Shader

### 绘图管线

参看资料wiki ：[Graphics pipeline - Wikipedia](https://en.wikipedia.org/wiki/Graphics_pipeline)

在计算机图形学中，绘图管线描述了图像系统通过一系列步骤来将3D场景渲染为2D图像这一过程。更具体来说这一过程就是我们游戏中的3d场景投射到摄像机上的过程。

绘图管线大体分为三个主要阶段：应用阶段，几何阶段和光栅化阶段（rasterization）。

### Shader

上面的应用阶段是在CPU上进行的，而几何阶段和光栅化阶段是在GPU上进行的，基本上绘图管线上定义的工作就是GPU要做的事情。然后GPU那边的工作大概也是一系列的工作流，这其中情况各不相同，有的是固定不变的，有的是可配置的，有的是可编程的。然后这里面有一些重要的工作节点称之为什么着色器Shader。常常听到什么Shader比如片元着色器就是对应GPU的某个Shader工作节点。

所以简单来说谈到Shader实际上指的是GPU上的某段程序。

### vertex shader

GPU的vertex shader顶点着色器是完全可编程的，它是GPU渲染流水管线的第一个作业阶段。vertex shader的工作任务有完成顶点从3D空间到2D摄像机平面的坐标变换。

### fragment shader

片元着色器是另外一个可编程的着色器。

### surface shader

unity提出的surface shader是基于vertex and fragment shader，其需要在unity的build-in render pipeline下使用，主要是节省了原来编写Shader对光照的一些工作。

下面是一个简单的vertex and fragment shader的例子，来自参考资料9：

```c#
Shader "Custom/Simple VertexFragment Shader" {
    SubShader {
        Pass {
            CGPROGRAM
            #pragma vertex vert
            #pragma fragment frag

            float4 vert(float4 v : POSITION) : SV_POSITION {
                return mul (UNITY_MATRIX_MVP, v);
            }

            fixed4 frag() : SV_Target {
                return fixed4(1.0,0.0,0.0,1.0);
            }

            ENDCG
        }
    }
}

```

和surface shader的最大的区别就是其代码是放在Pass区块里面的，然后这个Pass区块在SubShader区块里面。

### ShaderLab

所谓的编写Shader其实只是因为GPU上的某个Shader提供了可配置接口或者可编程入口，然后再通过某种语言来对这个Shader进行编程和配置。这个语言很多GPU厂商都提供了自己特定的语言，Unity提供了两种Shader编码语言，然后会将其根据不同的GPU转成对应的它支持的语言。其中ShaderLab是Unity开发出来的专门写Shader的一门语言。此外Unity还支持HLSL语言，不管你是用的ShaderLab还是HLSL，最终unity都会将它们针对不同的硬件编译成不同的目标机器支持的语言的。

#### 基本结构

要熟悉ShaderLab基本结构，最好是自己新建一个最常用的Shader，`Create -> Shader -> Standard Surface Shader` ，打开该文件我们会看到如下内容：

```c#
Shader "Custom/MySurfaceShader"
{
    Properties
    {
        _Color ("Color", Color) = (1,1,1,1)
        _MainTex ("Albedo (RGB)", 2D) = "white" {}
        _Glossiness ("Smoothness", Range(0,1)) = 0.5
        _Metallic ("Metallic", Range(0,1)) = 0.0
    }
    SubShader
    {
        Tags { "RenderType"="Opaque" }
        LOD 200

        CGPROGRAM
        // Physically based Standard lighting model, and enable shadows on all light types
        #pragma surface surf Standard fullforwardshadows

        // Use shader model 3.0 target, to get nicer looking lighting
        #pragma target 3.0

        sampler2D _MainTex;

        struct Input
        {
            float2 uv_MainTex;
        };

        half _Glossiness;
        half _Metallic;
        fixed4 _Color;

        // Add instancing support for this shader. You need to check 'Enable Instancing' on materials that use the shader.
        // See https://docs.unity3d.com/Manual/GPUInstancing.html for more information about instancing.
        // #pragma instancing_options assumeuniformscaling
        UNITY_INSTANCING_BUFFER_START(Props)
            // put more per-instance properties here
        UNITY_INSTANCING_BUFFER_END(Props)

        void surf (Input IN, inout SurfaceOutputStandard o)
        {
            // Albedo comes from a texture tinted by color
            fixed4 c = tex2D (_MainTex, IN.uv_MainTex) * _Color;
            o.Albedo = c.rgb;
            // Metallic and smoothness come from slider variables
            o.Metallic = _Metallic;
            o.Smoothness = _Glossiness;
            o.Alpha = c.a;
        }
        ENDCG
    }
    FallBack "Diffuse"
}

```

1. `Shader "Custom/MySurfaceShader"` 我已经将这个Shader的名字改为MySurfaceShader了，现在随便新建一个立方体，然后新建一个材质。该材质的最上面就可以设置该材质对应的Shader，默认是Standard Shader，现在选中我们这里新建的MySurfaceShader。
2. `Properties` 区块，在这个区块里面会定义本Shader的一些属性，这些属性在材质的Inspector面板那里看得到的。
3. `SubShader` 区块，至少要定义一个SubShader区块，多个SubShader区块可以对不同的硬件进行支持。
4. `FallBack` ，含义很明显，如果所有的SubShader都失败了则回滚到某个着色器。



#### Properties

```
_Color ("Color", Color) = (1,1,1,1)
```

这是定义了颜色属性。`_Color` 是Shader内部该属性的调用名，后面一个元组第一个是材质Inspector面板那边的显示名字，第二个是该变量的类型，最后等号后面是该属性的默认值。具体执行的属性类型有：

- Int
- Float
- Range(min,max)
- Color
- Vector
- 2D
- Cube
- 3D

参考资料9给出了一个不错的例子同时展示了这些属性的使用情况：

```c#
Shader "Custom/ShaderLabProperties" {
    Properties {
        // Numbers and Sliders
        _Int ("Int", Int) = 2
        _Float ("Float", Float) = 1.5
        _Range("Range", Range(0.0, 5.0)) = 3.0
        // Colors and Vectors
        _Color ("Color", Color) = (1,1,1,1)
        _Vector ("Vector", Vector) = (2, 3, 6, 1)
        // Textures
        _2D ("2D", 2D) = "" {}
        _Cube ("Cube", Cube) = "white" {}
        _3D ("3D", 3D) = "black" {}
    }

    FallBack "Diffuse"
}
```

#### SubShader

##### Tags

```
 Tags { "RenderType"="Opaque" }
```

设置本SubShader的RenderType。

##### LOD

```
LOD 200
```

指定本SubShader的计算需求【computationally demanding】。

##### CGPROGRAM

插入HLSL写的shader代码。

```
        CGPROGRAM
        // HLSL CODE
        ENDCG
```

### HLSL shader

#### `#pragma`

`#pragma` shader编译预处理指令。有很多`pragma` 预处理指令，如下这一句：

```
#pragma surface surf Standard fullforwardshadows
```

写surface shader需要加上这一句，后面代码surf函数就是在这里定义的，表示编译出来的这个surf函数对应的就是surface shader。后面的Standard是lightmodel，再后面fullforwardshadows是一个可选参数。具体更多细节请参见 [官方文档](https://docs.unity3d.com/2020.3/Documentation/Manual/SL-SurfaceShaders.html) 。

类似的有：

- `#pragma vertex <name>` 编译出来的这个函数是vertex shader
- `#pragma fragment <name>`  编译出来的这个函数是fragment shader
- `#pragma target 5.0` 等价于DirectX shader model5.0，但是不要求支持32位插值和cubemap arrays。

#### `#include`

```
#include "UnityStandardUtils.cginc"
```

unity提供了一些文件，里面有可供你shader编程使用的预定义变量和帮助函数。







## 编写Surface shader

实际上默认的标准surface shader的代码就是一个不错的学习例子：

```
        void surf (Input IN, inout SurfaceOutputStandard o)
        {
            // Albedo comes from a texture tinted by color
            fixed4 c = tex2D (_MainTex, IN.uv_MainTex) * _Color;
            o.Albedo = c.rgb;
            // Metallic and smoothness come from slider variables
            o.Metallic = _Metallic;
            o.Smoothness = _Glossiness;
            o.Alpha = c.a;
        }
```

这其中的有些东西还是不太明白，不过从材质Inspector面板来的 `sampler2D _MainTex;` 和颜色怎么相乘怎么封装一下获得的 c 其rgb就是Albedo，其a就是Alpha，然后就是设置o的Metallic和Smoothness，这两个参数的值是直接从材质Inspector面板那里获得的。

## 粒子系统

粒子系统可以制作出很多种效果，比如爆炸，火焰，烟雾，烟花，施法效果等。粒子系统就是空间中的一个点，从这个点出发发射一些粒子对象，从而制造出一些视觉效果。

### 新建一个粒子系统

新建一个粒子系统，右键在世界大纲视图下新建->效果->粒子系统。你也可以将粒子系统作为某个对象的组件添加进去。

从粒子系统属性面板可以看到很多属性调配参数，这些更规范的叫法叫做模块，默认启用的模块有默认模块和发射模块和形状模块。除了默认模块其他模块都是可选可启用也可停用的。这么多模块和参数，慢慢熟悉吧。

### 默认模块

显然至少默认模块的一些参数要先熟悉清楚。

- Duration 持续时间 粒子系统的运行时间
- Looping 是否循环播放
- Prewarm 预热 粒子系统从上次的循环中开始播放
- Start Delay 启动延迟 发射粒子之前等待的时间，不能和预热共存。
- Start Lifetime 每个粒子的存活时间，单位是秒
- Start Speed 粒子的初始速度
- Start Size 粒子的初始大小
- Start Rotation 粒子的初始旋转角度
- 翻转旋转 某些粒子向反方向旋转
- Start Color 粒子的起始颜色
- 重力修改器 应用于粒子的重力修改器，0是没有重力。
- 模拟空间 指定坐标是本地局部坐标系还是世界坐标系
- 模拟速度 微调粒子系统的播放速度
- 时间差 粒子系统的时间是基于缩放时间还是非缩放时间
- 缩放模式 缩放是基于游戏对象的父对象还是发射器的形状
- 唤醒时播放 粒子系统Awake就开始播放，如果关闭则需要手动开启粒子系统。
- 发射器速度 速度的计算是基于对象的变换还是它的刚体
- 最大粒子 粒子可以存在的最大数目，如果达到最大数目，粒子系统将暂停新粒子生成。
- 自动随机种子 每次播放粒子系统选择不同的随机种子
- 停止行动 如果粒子系统停止或所有粒子消亡，是否禁用或销毁自身。

### 发射模块

- Rate over time 随单位时间产生的粒子数，即每秒发射的粒子数目
- Rate over distance 每Unit单位发射的粒子数目
- bursts 爆发，突变。在某个特定时间内突然发射额外的粒子

### 形状模块

这个确定的是发射器，或者说发射的粒子们组成的形状。





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
11. [The PBR Guide - Part 1 (adobe.com)](https://substance3d.adobe.com/tutorials/courses/the-pbr-guide-part-1)
12. [Physically Based Rendering: From Theory to Implementation (pbr-book.org)](https://www.pbr-book.org/)
13. 计算机图形学导论 by James D.Foley and Andries van Dam etc.
14. 计算机图形学 by Steve Cunningham

Tags: unity
Status: draft

[TOC]

## 前言

本文是Unity游戏开发系列的物理系统部分。

### 本系列内容的取舍

- 因为笔者开发的是3D游戏，因此专属于2D游戏的那些内容将不会在这里讨论。
- 笔者使用的是Unity 2020.3 LTS版本，之前的版本被废弃的特性或者之后的版本新增的特性将不会在这里讨论。
- 笔者在行文上会尽可能节省笔墨，只是标出官方参考文档的引用出处，但在某些地方会额外花费笔墨来说明，比如个人觉得官方文档文字可能不是很好懂，某些内容很重要需要再特别强调一遍等。
- 一般来说官方文档里面有的不会在这里赘述，不过有时某些内容会特别重要而会再强调一遍。
- 

## 物理系统

### 碰撞器

#### 碰撞器组件的是否是触发器属性

默认是否，如果勾选，则该碰撞器不具有物体碰撞功能而只有碰撞事件触发功能，也就是你可以穿模进去了。比如某些液体就可以勾选这个选项这样玩家既可以进入该液体同时也可以跟踪玩家进入该液体的事件。

### 网格碰撞器

网格碰撞器虽然对物体边界的模拟虽然更精细了，但一般都不推荐使用，因为它非常的消耗性能。我们看到即使是最常见的玩家角色，角色控制器组件也只是简单用一个胶囊碰撞器进行了碰撞模拟。

### 物理材质

碰撞器的那个材质属性是来设置物理材质用的，物理材质可以通过新建物理材质来创建。

- dynamic friction 动态摩擦
- static friction 静态摩擦
- bounciness 反弹力 0不反弹，1没有动量损失
- Friction Combine 摩擦力如何组合，取最小值，取最大值或者取平均值
- Friction Combine 反弹力如何组合，取最小值，取最大值或者取平均值

### 触发器

触发器如果被满足条件的碰撞器发生碰撞则会调用下面三个方法：

```
OnTriggerEnter(Collider other)
OnTriggerStay(Collider other)
OnTriggerExit(Collider other)
```

#### OnTriggerEnter和OnCollisionEnter

OnTriggerEnter 的触发条件是：

- 两个GameObject都有碰撞器组件，其中某个GameObject的碰撞器必须勾选了`isTrigger` ，其中某个GameObject必须刚体组件。但是如果两个碰撞器都勾选了 `isTrigger` ，也不会触发。
- 然后就是两个碰撞器发生碰撞则会触发事件。

OnCollisionEnter的触发条件较为宽松，两个GameObject的碰撞器或者刚体发生碰撞则会触发。

个人编写了一个测试场景，OnTriggerEnter的触发情况确实如上所述，还必须要求某个GameObject有刚体组件。

但是我碰到了这样一种情况，那就是基于Unity Standard Assets的FPSController和另外一个单纯的平面trigger进行交互，两个都没有刚体也触发了OnTriggerEnter方法，**经过个人试探 Unity2019.4.19f1c1这边的情况是Chatacter Controller和随便一个trigger发生碰撞就会触发OnTriggerEnter方法，并没有刚体的要求**。

### Character Controller组件

一般第一人称或第三人称角色控制玩家会需要更灵活地控制角色，这种情况下玩家角色如果加入物理系统的刚体会有一种操作上的不顺畅感，但此时仍然希望保留碰撞的物理效果，可以加入Character Controller组件来实现这点。

我们看到角色控制器下面有三个参数：center控制胶囊碰撞体的中心位置，半径控制胶囊碰撞体的宽度，height控制胶囊碰撞体的高度。大体可以猜到角色控制器就是通过这个胶囊碰撞体来和环境交互的。

#### isGrounded

本角色控制器组件在上一次移动中是否接触到了地面。



### RayCast方法

```
public static bool Raycast(Vector3 origin, Vector3 direction, float maxDistance = Mathf.Infinity, int layerMask = DefaultRaycastLayers, QueryTriggerInteraction queryTriggerInteraction = QueryTriggerInteraction.UseGlobal);
```

从origin向这direction方向发射一个射线，如果射线和某个碰撞体相交则返回true，否则返回false。

这个射线投射很有用，物理系统里面的很多功能都是基于这个射线投射，比如碰撞判断。此外还可以基于这个射线投射来构建出很多有用的功能：

- 比如想要确定玩家当前的选择交互对象，视窗中心射出一个射线，和什么GameObject相交则认为该GameObject是当前玩家的选择对象。
- 然后再比如射击游戏可以用射线投射来模拟射击动作，并利用RayCatHit返回对象来获取被击中物体的很多信息，从而来更好地构建射击动作。

RayCast参数还有好几种形式，这个就参看官方文档了，不在这里赘述了。

### BoxCast

BoxCast的意思是沿着某个Ray投射一个Box。可以理解为在RayCast的基础上再加上了一个移动的Box的体积判断。

还有SphereCast也是类似的。

### CheckCapsule

这个可以用来测试玩家角色是否接触地面，具体这个方法参数官方文档读起来也不是很直观，具体来说其定义了这样一个胶囊：

![img]({static}/images/2021/unity_capsule.png)



```
public static bool CheckCapsule(Vector3 start, Vector3 end, float radius, int layerMask = DefaultRaycastLayers, QueryTriggerInteraction queryTriggerInteraction = QueryTriggerInteraction.UseGlobal);
```

这里的layerMask是选中的图层才会进入碰撞判断。

### 图层

图层的创建和将某个GameObject分配给某个图层在Unity Editor那边操作熟悉下即可。

图层在某些特定的地方会很有用，比如摄像机渲染和物理系统的射线碰撞判断，否则不要创建一些无谓的图层。



#### 摄像机的剔除遮罩属性

Culling Mask 用来设置本摄像机想要渲染的图层，默认是Everything。

现在假设有两个摄像机，一个摄像机对着一个红色的立方体，该红色的立方体在RED图层；另外一个摄像机对着蓝色的立方体，该蓝色的立方体在BLUE图层。第一个摄像机的剔除遮罩没有选择BLUE图层，则该摄像机的渲染图像里面没有蓝色的立方体；第二个摄像机的剔除遮罩没有选择RED图层，则该摄像机的渲染图像里面没有红色的立方体。

#### 物理系统的图层碰撞矩阵

在 `Edit->Project settings->Physics` 那里，有一个Layer collision Matrix，用来设置你的项目里面各个图层中的各个GameObject是否有物理系统的碰撞判断。

此外物理系统的射线投射函数`Raycast` 里面有个 `layerMask` 参数就是设置你希望该射线和那些图层交互的。比如：

```
int layerMask = 0;
```

则射线不会和任何东西发生碰撞。

如果：

```
int layerMask = 1<<8;
```

则射线会和第8图层的GameObject发生碰撞。

如果：

```
int layerMask = ~(1<<8);
```

则射线会和其他图层的GameObject发生碰撞除了第8图层。

看到这里读者可能已经明白了，一共32个图层，第一图层是 `00...00001` ，第二图层是`000...00010` ，比如我现在希望取第一图层和第二图层，就是 `00...0001 | 000...00010`  ，也就是 `00...11` 。

但个人还是不喜欢这种写法，还是推荐多使用 `LayerMask.GetMask` 这个方法，这个方法接受一个图层或者多个图层的名字，然后返回也就是类似上面描述的layermask的数值：

```
LayerMask.GetMask("UserLayerA", "UserLayerB");
```



### 刚体

####  isKinematic

是否是运动学刚体，如果勾选了，则力，碰撞和joint将不再影响刚体，刚体的移动仅仅动画或者脚本【transform.position】来控制。

#### Continuous Collision Detection

防止碰撞器快速移动穿过彼此，可以将碰撞属性检测设置为连续或者连续动态。

设置为连续可以防止刚体穿过任何静态碰撞器。

设置为连续动态可以防止刚体穿过任何支持刚体碰撞检测的物体。





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

Status: draft

[TOC]

## 前言

本文是Unity游戏开发学习系列的运行时编码部分。

### 本系列内容的取舍

- 因为笔者开发的是3D游戏，因此专属于2D游戏的那些内容将不会在这里讨论。
- 笔者使用的是Unity 2020.3 LTS版本，之前的版本被废弃的特性或者之后的版本新增的特性将不会在这里讨论。
- 笔者在行文上会尽可能节省笔墨，只是标出官方参考文档的引用出处，但在某些地方会额外花费笔墨来说明，比如个人觉得官方文档文字可能不是很好懂，某些内容很重要需要再特别强调一遍等。
- 一般来说官方文档里面有的不会在这里赘述，不过有时某些内容会特别重要而会再强调一遍。

## 基于事件驱动的Unity编程

作为和桌面端程序类似的存在，成熟的Unity游戏编程必然是基于事件驱动的编程模式。这对于大中小型Unity项目都是有用的和必须的。

C#那边已经有成熟的事件驱动编程解决方案了，拿过来用就是了。因为Unity那边又新增了UnityAction之类的语法糖，但从 [这篇文章](https://www.jacksondunstan.com/articles/3335) 来看，其效率反而不如C#自带的事件驱动解决方案，除非在某些Unity Editor定制人物上，才一定要使用UnityAction之类的，那个时候再使用。

**更新：** ScriptableObject最好只是作为数据文件存在，否则在Build那边会有一些问题，之前C#那边已经讨论过事件驱动编程了，下面将这些讨论粘贴过来，在Unity那边同样也是可以用的。

### 事件驱动编程

事件驱动编程模式或者说委托代理模式，其将构建一个事件通道作为第三中间人，事件发送方只负责告诉该第三人事件发生了，事件发送方并不关心这个第三人等下要将这些事件通知给谁。而事件接收方也不知道事件发送方是谁，它只管听第三人也就是事件通道的，事件通道说事件触发了，然后事件接收方再决定做某些事情。

此外编程上还有一个观察模式，观察模式的事件发送方和事件接受方彼此是知道的，事件发生了事件发送方会直接通知各个事件接收方事件发生了。参考了 [这篇文章](https://hackernoon.com/observer-vs-pub-sub-pattern-50d3b27f838c) 。

按照上面的说法，我们最好是构建出一个EventChannel类，由这个EventChannel来负责触发事件，由这个EventChannel负责传递函数参数和通知事件接收方事件发生了。

在实践中的一个编码规范是参数最好把事件的发送人和发送的参数作为两个参数。大概如下：

```
public delegate void EventHandler<TEventArgs>(object? sender, TEventArgs e);
```

是的，C#就已经定义了这个EventHandler委托，于是利用这个EventHandler我们就可以如下定义事件了：

```
public event EventHandler<SomeEventArgs> someEvent;
```

下面是定义该事件的参数传递规范：

```c#
    public class SomeEventArgs : EventArgs
    {
        public int x { get; private set; }
        public int y { get; private set; }

        public SomeEventArgs(int x, int y){
            this.x = x;
            this.y = y;
        }
    }
```

下面定义了一个事件通道基类：

```c#
    public enum Status { Started, Stopped };

    public class BaseEventChannel<T>
    {
        public event EventHandler<T> Event;

        public void RaiseEvent(object sender, T args)
        {
            Event?.Invoke(sender, args);
        }

        public void AddHandler(EventHandler<T> handler)
        {
            Event += handler;
        }
        public void RemoveHandler(EventHandler<T> handler)
        {
            Event -= handler;
        }
    }
```

```c#
public class SomeEventArgs : EventArgs
    {
        public Status status { get; private set; }

        public SomeEventArgs(Status status)
        {
            this.status = status;
        }
    }
    public class SomeEventChannel : BaseEventChannel<SomeEventArgs>
    {
    }

    class Engine
    {
        public SomeEventChannel someEventChannel = new SomeEventChannel();

        protected virtual void OnSomeEvent(SomeEventArgs args)
        {
            someEventChannel.RaiseEvent(this, args);
        }

        public void Start()
        {
            OnSomeEvent(new SomeEventArgs(Status.Started));
        }

        public void Stop()
        {
            OnSomeEvent(new SomeEventArgs(Status.Stopped));
        }

    }
```

具体调用程序大体如下：

```c#
 class Program
    {

        static void Main(string[] args)
        {
            Engine engine = new Engine();
            engine.someEventChannel.AddHandler(OnEngineStatusChanged);
            engine.someEventChannel.AddHandler(OnEngineStatusChanged2);

            engine.Start();
            engine.Stop();

            engine.someEventChannel.RemoveHandler(OnEngineStatusChanged2);
            engine.Start();
            engine.Stop();
        }

        private static void OnEngineStatusChanged(object sender, SomeEventArgs args)
        {
            Console.WriteLine($"{sender} is now {args.status}");
        }

        private static void OnEngineStatusChanged2(object sender, SomeEventArgs args)
        {
            Console.WriteLine($"Report2: {sender} is now {args.status}");
        }

    }
```

就上面这个程序小片段没这个问题，但对于稍大点的应用程序，则需要保证某一特定事件通道的唯一性。有以下做法，并没有那种优于那种一说：

- 一是靠程序员自我编码规范，比如事件和组件是特有的绑定关系，这样你在编码的时候就会很少犯错，因为你总是在想这个组件实体触发了什么事件，自然会做好组件实体的唯一性和对目标事件的引用。
- 让事件通道成为全局变量从而全局唯一。
- 从事件通道的编码上实现单例模式
- 将你的事件通道和外部的数据文件等建立某种唯一关系等。

### 单例模式示例

本小节单例模式实现主要参考了 [这个网页](https://csharpindepth.com/articles/singleton) 。

```c#
    public sealed class SomeEventChannel : BaseEventChannel<SomeEventArgs>
    {
        private static readonly SomeEventChannel instance = new SomeEventChannel();
        static SomeEventChannel() { } // Make sure it's truly lazy
        private SomeEventChannel() { } // Prevent instantiation outside

        public static SomeEventChannel Instance { get { return instance; } }

    }
```

具体在引用的时候要如下这样使用了：

```
        public SomeEventChannel someEventChannel = SomeEventChannel.Instance;
```

### 和组件绑定的事件

在实践中有一种情况，那就是事件是和某一个组件是绑定的一对一关系，那么自然这个事件就是单例的。而这个事件作为某个组件的属性在单例的处理上就会稍微简单一点，这个组件事件也没必要发送sender这个参数了，因为事件发起人肯定是本组件this。出于代码简洁的考虑，可以引入组件事件的概念：

```
namespace System
{
    public delegate void VoidComponentEventHandler();
    public delegate void ComponentEventHandler<TEventArgs>(TEventArgs e);
}

public class ComponentEventBase<T>
{
    public event ComponentEventHandler<T> Event;

    public void RaiseEvent(T args)
    {
        Event?.Invoke(args);
    }

    public void AddHandler(ComponentEventHandler<T> handler)
    {
        Event += handler;
    }
    public void RemoveHandler(ComponentEventHandler<T> handler)
    {
        Event -= handler;
    }
}


public class VoidComponentEvent
{
    public event VoidComponentEventHandler Event;

    public void RaiseEvent()
    {
        Event?.Invoke();
    }

    public void AddHandler(VoidComponentEventHandler handler)
    {
        Event += handler;
    }
    public void RemoveHandler(VoidComponentEventHandler handler)
    {
        Event -= handler;
    }
}

```

```
public VoidComponentEvent myEvent1 = new VoidComponentEvent();
public VoidComponentEvent myEvent2 = new VoidComponentEvent();
```



### UnityEvent

UnityEvent如上的讨论，在效率上反而不如C#原生的事件，但你给你的组件脚本上随便如下添加：

```
UnityEvent OnSomeEvent;
```

那么在Unity Editor那里就会多出一个`OnSomeEvent` 选单，这个选单你可以随意添加很多行为，其他脚本的其他方法都可以随意拖动过来，UnityEvent带来的就是这个好处。一般来说熟悉C#编程的Unity开发人员在这种程序行为定义的地方是不推荐采用拖动的方式的，还是直接用代码编写吧。

具体这块应用场景主要对应上面和组件绑定的事件的讨论，个人对于代码并没有太极端的微优化喜好，所以在这种和组件绑定的事件应用场景下，简单使用UnityEvent也是可以的，更多情况请参见官方手册。

### UnityAction

UnityAction带来的便利就是Unity Editor那边是支持显示一个按钮方便手工触发该事件的，除此之外UnityAction就是一个有着特定名字的C#委托，并没有什么特殊的。

UnityEvent相比较原生C#事件确实有点性能方面的问题，但UnityAction则仅仅只是一个语法糖而已，有的地方觉得好用还是可以用的。

它提供了不接受参数，接受一个参数，到接受四个参数的函数委托模型。





## Unity协程

如果读者之前接触过协程概念，对于这里的协程的理解会很快，但有一点是需要特别强调的。那就是Unity的协程更多的是一个Unity自身基于逐帧运算然后做出来的概念，和很多编程语言上的协程概念比较起来，其底层甚至可能都不依赖于线程切换。

C#语言那边有异步编程，其使用的async func 和await之类的和python的异步编程很像，这些才是严格意义上的协程概念，Unity协程只是利用了C#的 `IEnumerator` 和 `yield return` 构建起来的类似python的可迭代对象，然后在这个可迭代对象之上构建出来的Unity协程概念。

具体Unity协程的编写如下：

```c#
using System.Collections;

IEnumerator CoroutineExample(int a){
    // do something 
    yield return null;
    // still do something
    yield return null;
}
```

启动一个Unity协程：

```c#
StartCoroutine(CoroutineExample(1));
```

该CoroutineExample协程会在遇到yield return 那里停止执行，然后下一帧再回来继续执行本协程。

此外可以如下启动协程：

```
StartCoroutine("CoroutineExample", 1);
```

这种指定协程名字符串的启动后面可以指定名字要求停止某个协程：

```
StopCoroutine("CoroutineExample")
```

你还可以让某个协程暂停执行多少秒：

```
yield return new WaitForSeconds(.1f);
```

理解Unity协程的关键是理解它是一种基于Unity的按帧运算的类协程，首先协程函数通过 StartCoroutine 启动之后是完全不会阻塞程序的流程的，也就是程序继续往下面执行了。而协程那边在本帧执行到某个yield return 语句获得值之后就按照一般的协程逻辑挂在那边了。然后那个协程在下一帧又会继续执行下面的逻辑。



### 嵌套Unity协程

参考了  [这篇文章](https://www.alanzucconi.com/2017/02/15/nested-coroutines-in-unity/) 。

如下：

```
yield return StartCoroutine(AnotherCoroutine())
```

这种形式，父协程要等待子协程完成才会继续往下走，也就是对于父协程来说，子协程的整个执行过程是同步的。因为子协程仍然是通过 StartCoroutine启动的，其内部的执行是异步的。



### 平行Unity协程

```
IEnumerator A()
{
    
    // Starts B, C, and D as coroutines and continues the execution
    Coroutine b = StartCoroutine( B() );
    Coroutine c = StartCoroutine( C() );
    Coroutine d = StartCoroutine( D() );
    
    // Waits for B, C and D to terminate
    yield return b;
    yield return c;
    yield return d;
    
}
```

B C D这几个子协程从启动开始就执行了，说的再直白点就是正常启动协程一下就启动起来了，根本花费不了什么时间。

### WaitUntil

一个方便的协程支持方法，可以进行条件判断，条件判断满足之后才往下走。

```
yield return new WaitUntil(() => frame >= 10);
```

### WaitForSecondsRealtime

类似WaitForSeconds ，只是对应的不是游戏中缩放的时间，而是真实时间。





## 脚本

### GameObject

 一个空的GameObject就是一个容器，其可以用于在Unity Editor的大纲视图中进行层级管理。一个GameObject下面管理的多个物体，如果将这个GameObject拖动到项目文件夹视图下，则将会创建一个Perfab预制件。预制件Perfab可以重复只用，并且改变基础Perfab属性会影响所有相关场景中的由此Perfab实例化的对象。

一个GameObject里的组件如果调用`gameObject` 属性，比如transform，或者脚本类this，都会指向这个目标容器GameObject。

```
this.gameObject;
this.transform.gameObject;
```

脚本作为组件绑定在某个GameObject上，如上在脚本中调用 `this.gameObject` 则会引用该GameObject。

所有的GameObject，即使是一个空的GameObject也会有transform属性。



#### GetComponent方法

这个方法在 `GameObject.GetComponent` 上，也就是Unity上的所有游戏对象都是可以调用这个方法的，这既包括脚本组件对象，也包括transform对象。

然后GetComponent方法主要是找目标组件和本脚本组件或者其他组件在同一GameObject之下的情况，当然你也可以直接引用本GameObject来调用这个方法：`gameObject.GetComponent` 。返回的是找到的第一个相同类型的目标组件，如果没有找到则返回null。

```
_rb = this.GetComponent<Rigidbody>();
```

上面假设本脚本和某个刚体组件同在一个GameObject之下，则如上引用该目标组件。其实你在Unity Editor看到的其他组件说白了也是一些脚本，只是说之前Unity官方或者其他库预先帮你写好了。脚本也可以不绑定在GameObject上，这个后面会提到，其叫做 ScriptableObject。

#### 引用其他脚本组件

现在假设你的GameObject下面有多个脚本组件，则引用另一个脚本组件代码如下：

```
gameManager = this.GetComponent<GameBehavior>();
```

上面的意思是本GameObject下还有一个脚本类，其类名叫做 `GameBehavior` ，那么那个刚体组件呢，其对应的就是还有另外一个脚本，其类名叫做Rigidbody。请注意，这里的讨论只是在试图澄清组件和脚本类之间的关系，并不是在说如何使用其他类里面的数据，Unity对于交互数据更推荐使用ScriptableObject或者其他方法来处理，一般来说脚本类里面只放着行为逻辑。

#### Find方法

Find方法可以用于查找不是本GameObject的其他GameObject，具体名字就是Unity面板上显示的那个名字。

```c#
private GameObject directLight;
private Transform lightTransorm;

directLight = GameObject.Find("Directional Light");
lightTransorm = directLight.GetComponent<Transform>();
Debug.Log(lightTransorm.localPosition);
```

**WARNING：** Find方法是对所有已经加载的场景中激活的所有对象的遍历搜索动作，开销会很大，没有特别的理由不要使用Find方法，更推荐的其他GameObject引用参看下面。



##### 更推荐的做法

在实践中如上使用Find方法其实并不是很好用，更推荐的做法是将你需要定位的GameObject做成你的脚本类的公有属性或者序列化属性，值得一提的是这种做法可用于定位目标GameObject，也可用于定位目标组件，目标组件在十万八千里远或者就在旁边都可以这样用。

```
public YouTargetClass object_name;
```

然后在编辑器上选中目标对象或者拖动目标对象到目标输入框。你给定的类名一定要是你想定位的目标的类，这样选择框才会弹出对应的候选项。

这种做法的好处就是编辑器友好和简单，又能少写代码又简单当然是推荐使用的了。一般大部分应用场景都可以用这个推荐做法来解决引用目标对象的问题，只可能在某些极个别的情况需要代码查找。

#### transform的层级树

unity的每一个gameObject都有transform这个属性，这个transform是有一个内在的层级树在里面的，这个层级树也就是里面的parent和child概念是直接对应你在大纲视图上看到的GameObject的层级的。

你可以通过transform的层级数来定位某个gameObject的transform，然后通过 `.gameObject` 这个属性来获得具体该gameObject对象。

你可以通过如下语句来迭代某个GameObject下的子节点：

```c#
foreach (Transform child in parent){
    // do something
}
```

然后有 `transform.parent` 来返回本transform的父节点transform对象。更多的方法请参看 Transform 类。

**NOTICE: 这里再强调一遍，gameObject之间是没有父子层级关系的，你在大纲视图上看到的层级关系只是各个gameObject的transform属性的层级关系。**

#### FindWithTag方法

正如上面的讨论，但在某些情况下你确实需要使用Find来查找，那么推荐你使用 `FindWithTag` 方法，然后你想要查找的目标GameObject上添加一个专门的标签，这样效率会高很多。

#### SendMessage方法

非常有用的一个方法，请注意看官方文档下面的这个例子，两个class是作为同一GameObject的两个脚本组件挂在上面的，确切来说本GameObject上所有MonoBehaviour也就是脚本组件都会被通知到，如果脚本组件有目标方法，则会执行该方法。

```c#
using UnityEngine;

public class Example : MonoBehaviour
{
    void Start()
    {
        // Calls the function ApplyDamage with a value of 5
        // Every script attached to the game object
        // that has an ApplyDamage function will be called.
        gameObject.SendMessage("ApplyDamage", 5.0);
    }
}

public class Example2 : MonoBehaviour
{
    public void ApplyDamage(float damage)
    {
        print(damage);
    }
}
```

sendmessage和getcomponent by type 估计内部效率是差不多的，有一个很有用的应用情景。一般来说我们编写的脚本比如selecable啊，damageable等等都是一些通用的脚本组件。这些通用的脚本组件是不合适编写具体某一个游戏对象的行为逻辑的。但是对于select或者damage来说又另外再编写一个脚本组件也没必要，所以通过事件通道上传信息之后再由上面系统分发通知各个组件来sendmessage，这个时候通过sendmessage再具体调用某一消息下的更具体的实例行为。

sendmessage第三个选项可以设置为没有接收人也不会报错。



### 常驻GameObject

你可能希望某些GameObject常驻在游戏里面然后多个场景调用。一个做法是不摧毁原场景，设置一个常驻场景作为该GameObject所在地，这可以通过规范你的项目场景加载卸载逻辑来实现。还有一个做法如下：

#### DontDestroyOnLoad

当加载一个新的场景时会把原场景的所有对象destroy掉，如果加入如下代码：

```
DontDestroyOnLoad(this.gameObject);
```

则本脚本绑定的那个GameObject在场景切换时将不会被删除掉。

**值得一提的是：** DontDestroyOnLoad 只能操作在场景大纲视图下的root对象。

### MonoBehavior

MonoBehavior定义了一个脚本组件，这个脚本组件必须附加在某个GameObject之上。

#### Update和FixedUpdate

Update是每帧执行，一般键盘输入放在这里。

FixedUpdate是每隔一定固定时间段执行，一般物理模拟内容放在这里。

此外还需要了解 `Time.deltaTime` ，其返回的是上一帧到这一帧的时间间隔。以FixedUpdate为例，其内每次调用 Time.deltaTime都是相同的某个时间段，而对于Update则没有这个规律。

#### Awake和Start

Start Awake 脚本都只会执行一次，Awake先于Start执行。而OnEnable是本脚本组件只要发生了Enable事件都会被执行一次。

这里说的再具体一点就是`.enable = true` 执行之后该脚本组件将会执行 `OnEnable` 方法。`.enable=false` 执行之后将会执行 `OnDisenable` 方法。还有就是因为脚本组件会随着挂载上的游戏对象激活而激活，如果是整个游戏对象 `SetActive(true)` ，那么脚本组件也会执行 `OnEnable` 方法。

Start和Awake的区别是Awake那怕本脚本组件没有激活，只要本脚本组件挂载的GameObject已经激活了那么本脚本组件也会Awake，但不会执行Start，只有本脚本组件第一次Enable之后才会执行Start函数。



#### LateUpdate

在Update方法之后执行，也在各个可能的动画移动之后，一般用于摄像机的调整动作。

#### Reset方法

在Editor上，右键点击查看最上面有个选项，叫做重置，具体对应的就是这个方法。可以在Reset方法上执行一些变量的默认值配置工作，然后你点击重置就会得到这些默认值。一个MonoBehavior新建的时候的默认值也会参考这个方法。

### StateMachineBehaviour

又是一个大块内容，类似于MonoBehavior，这是你继承StateMachineBehaviour编写的类不是附在GameObject上，而是附在动画器的动画行为【叫做状态】上。

有很多回调方法，具体参看官方文档，比如刚进入某个动画状态干什么，比如退出动画状态做什么等等。





### Transform.TransformPoint

```
public Vector3 TransformPoint(Vector3 position);
```

根据某个Transform的local space偏移值Vector3 position，获得目标值的世界坐标值Vector3。



### 启用和禁用组件

```
component.enable = true;
```

### Object

#### name

```
Object.name
```

名字，所有的MonoBehavior也就是脚本组件如果绑定到某个游戏对象上，它的名字和该游戏对象的名字会是一样的。





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

Tags: unity
Status: draft

[TOC]

## 前言

本文是Unity游戏开发系列的资产管理部分。

### 本系列内容的取舍

- 因为笔者开发的是3D游戏，因此专属于2D游戏的那些内容将不会在这里讨论。
- 笔者使用的是Unity 2020.3 LTS版本，之前的版本被废弃的特性或者之后的版本新增的特性将不会在这里讨论。
- 笔者在行文上会尽可能节省笔墨，只是标出官方参考文档的引用出处，但在某些地方会额外花费笔墨来说明，比如个人觉得官方文档文字可能不是很好懂，某些内容很重要需要再特别强调一遍等。
- 一般来说官方文档里面有的不会在这里赘述，不过有时某些内容会特别重要而会再强调一遍。

## blender和unity的协作

虽然Unity的ProBuilder和PloyBrush提供了一定的模型建立和地形构建的能力，但这主要还是用于原型开发，一般建模当然还是推荐在blender上完成。

至于Unity的地形工具是有局限性的，某些封闭的如洞穴场景或者如同minecraft需要和地形的元素进行交互的场景是不应该使用Unity的terrian地形工具的，而应该通过blender建模来导入到Unity场景中来。其次即使是那些似乎看起来Unity地形工具勉强能够应付的场景，如果后续对地形在表现细节上有更多的要求，那么也应该通过blender建模来实现。【**这里补充说明一下**：关于Unity 地形工具后面会讨论的，上面对Unity地形工具的讨论不是说Unity地形工具没用，我们在成熟的项目的场景里面可能都看不到地形这个要素了，但地形工具还是很有用，Unity地形工具和ProBuilder一样更多的是用于原型开发阶段，就好比搭建一栋大楼一样，你看到满地的砖头或者说满地的blender模型素材会无从下手的，而地形工具就好比建建筑的蓝图，后面实际场景地形搭建还是要根据你之前的地形蓝图来的。也正是因为如此，后面再介绍地形的时候我也会强调一遍，**地形更多的相当于你未来场景的蓝图**，所以不要花费太多精力在地形的细枝末节上。】

### blender建模

blender建模导入Unity下面说一下基本的流程思路，可能有时会有一些细节上的问题。

1. 按A全选你想要导出的元素，主要是网格体和骨架。选择导出到FBX，然后选择网格体，如果有骨骼的话也推荐将骨架选上。然后导出。
2. 将FBX文件移动到你的Unity项目中，Unity会自动检测导入，但一般来说你还需要对模型导入配置参数进行一些调整。比如材质，比如如果是人形模型，而你希望根据该人形模型构建动画还需要自动创建Avatar。
3. FBX模型最好是另外单独一个地方存放，导入的模型参数配置好之后，拖入场景，然后拖动制成Perfab预制件，然后解压缩预制件，再对该预制件进行一些你想要的修改，比如有的加上碰撞器和行为脚本之类的。在更新预制件。

### blender动画

blender里面的动画导出到Unity也是类似上面的导出FBX，实际上就是导出的你的模型的骨架的一些移动变换数据，然后Unity接受成为动画Clips。

1. 按A全选你想要导出的元素，主要是网格体和骨架。选择导出到FBX，然后选择骨架，和导出一般模型不同，如果你只希望导出动画的话这里只选择骨架即可。
2. FBX动画文件导入Unity项目中，然后对动画Animation这一栏一些参数做出一些调配，还有Avatar选择Copy from之前本模型创建的那个Avatar。

个人测试相同的人形模型差异不太大的话即使是原来不同的Avatar动画文件里面的内容也是可以复制，大体可以参考的。这一块主要是动画姿态的不匹配问题，如果是自己很粗略弄的动画反倒是泛用性会很强，而那些动捕或者调配的很好的姿态，泛用性会很差，比如一个女性角色的走路姿态套用到一个男性角色上然后出来的效果你懂的。

简单的Unity动画就在Unity那边编辑即可，但有些动画文件很复杂，而Unity那边的动画文件编辑功能并不是很强大，可能还是要继续再blender那边修改之后再应用到Unity那边。







## Unity Addressable Asset system

Unity的官方包，在包管理里面搜索`addressables` 。这个包可以让你访问资产Asset通过地址访问的方式来进行，从而增加资源访问的灵活性。原asset bundle管理方案已经处于废弃状态。

在 window->addressables groups 那里新增一个group。

然后将资源拖动到这里，第一列就是后面你要使用引用的名字，默认的名字是根据你的资源的本地目录来的，你也可以修改为你想要的名字。

在脚本中使用资源如下，接受的参数是该资产的名字。

```
using UnityEngine.AddressableAssets;
Addressables.LoadAssetAsync<GameObject>("AssetAddress");
Addressables.InstantiateAsync("AssetAddress");
```

如果是`AssetReference` 配置好的资产则可以直接如下调用，：

```
_menuLoadChannel.LoadAssetAsync<LoadEventChannelSO>().Completed += LoadMainMenu;
```

一般的使用大体如下：

```c#
using System.Collections;
using System.Collections.Generic;
using UnityEngine.AddressableAssets;
using UnityEngine;

public class AddressablesExample : MonoBehaviour {

    GameObject myGameObject;

        ...
        Addressables.LoadAssetAsync<GameObject>("AssetAddress").Completed += OnLoadDone;
    }

    private void OnLoadDone(UnityEngine.ResourceManagement.AsyncOperations.AsyncOperationHandle<GameObject> obj)
    {
        // In a production environment, you should add exception handling to catch scenarios such as a null result.
        myGameObject = obj.Result;
    }
}

```

### 异步加载你的场景

addressables 系统可用于异步加载你的场景，非常的方便。

```
using UnityEngine.AddressableAssets;
using UnityEngine.ResourceManagement.AsyncOperations;
using UnityEngine.SceneManagement;
using UnityEngine.ResourceManagement.ResourceProviders;

Addressables.LoadSceneAsync("sceneName", LoadSceneMode.Additive).Completed += SceneLoadComplete;
// if scene is a AssetReference
scene.LoadSceneAsync(LoadSceneMode.Additive).Completed += SceneLoadComplete;

private void SceneLoadComplete(SceneInstance obj)
{
	if (obj.Status == AsyncOperationStatus.Succeeded)
	{
		Debug.Log("scene load succeeded.")
		// do something.
	}

}
```

卸载场景如下：

```
private AsyncOperationHandle<SceneInstance> handle;
handle = obj;

Addressables.UnloadSceneAsync(handle).Completed += SceneUnloadComplete;
```

上面不管是加载还是卸载一旦启动就异步进行了，Completed事件加入回调是一种方法，但你也可以用Unity的协程方法来检查之：

```
private IEnumerator LoadingProcess()
{
	if (obj.Status == AsyncOperationStatus.Succeeded)
	{
		Debug.Log("scene load succeeded.")
		// do something.
	}
	yield return null;
}
```

如果大体每一帧都会检测一次加载是否Succeeded。

### build发布前记得运行下build

你的项目build独立运行记得将在那个窗口的build子菜单那里点击new build一个资源。







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

Tags: unity
Status: draft
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

Tags: unity
Status: draft
[TOC]

## 前言

本文是Unity游戏开发系列的UI部分。这里主要讨论的是运行时的UI开发，具体使用的是unity的ui包，正式术语中叫做ugui。

### 本系列内容的取舍

- 因为笔者开发的是3D游戏，因此专属于2D游戏的那些内容将不会在这里讨论。
- 笔者使用的是Unity 2020.3 LTS版本，之前的版本被废弃的特性或者之后的版本新增的特性将不会在这里讨论。
- 笔者在行文上会尽可能节省笔墨，只是标出官方参考文档的引用出处，但在某些地方会额外花费笔墨来说明，比如个人觉得官方文档文字可能不是很好懂，某些内容很重要需要再特别强调一遍等。



## Canvas

Unity的UI是基于画布Canvas构建的，其他UI元素都需要在Canvas之上，或者说所有的UI元素都需要是Canvas的子对象。

Unity的UI可以有多个Canvas画布，出于性能上的考虑推荐变动频率接近的UI元素放在一个画布上，因为画布的某部分发生了变化会重新绘制全部内容【出处：Unity游戏开发一书第三版第14章。】。

### 画布渲染模式【render mode】

- Screen Space-Overlay 【屏幕空间-覆盖】默认的渲染模式，在场景中的UI对象位置和具体的UI显示没有关系。Unity内置的图层UI，一般UI元素都放在这一层，在场景中选择隐藏UI图层也是没有问题的【运行游戏时仍然会在】。排序次序【sort Order】在多个画布的时候有用，数值越高越最后显示，也就是会覆盖前面的。
- Screen Space-Camera 【屏幕空间-摄像机】这种模式使用摄像机来渲染UI。一般这种情况最好专门再添加一个摄像机专门用来渲染画布。这种模式下画布还是正对着摄像机，不过有个平面距离可以控制画布和摄像机的距离。具体来说渲染的是指定的渲染摄像机到这个平面之间的一个截头锥体空间。
- World Space 【世界空间】这种情况下画布是作为场景中一个游戏对象和其他游戏对象没有区别地混在一起的。比如游戏角色头顶上的问号。事件摄像头如果你希望你的画布响应用户的动作则需要设置，具体是根据用户鼠标在屏幕的位置和事件摄像头的方向发射射线，射线触碰到画布的那里就是那里。一般使用设置主摄像头是合理的。



### 画布缩放【Cavas Scaler】

- 恒定像素缩放【Constant Pixel Size】 UI元素不缩放，保持恒定像素大小。
- 屏幕大小缩放【Scale With Screen Size】 UI元素会随着屏幕分辨率而缩放。【个人试探结果是如果你的UI元素锚点设置有缩放属性，则最好选择这个。】

设置参考分辨率最好是你最开始选中的那个喜欢的分辨率。对于和参考分辨率的纵横比一样的其他分辨率缩放是没有问题的，而如果不同的话则会调用下面的三种方案的一个：Match width or height，根据参考分辨率的宽或者高来进行缩放；Expand，屏幕比参考分辨率小则expand；Shrink，屏幕比参考分辨率大则缩减尺寸。Match width or height下面有个控制拉杆的逻辑是尽可能照顾宽度或者尽可能照顾高度。

- 恒定物理大小【Constant Physical Size】 这个和恒定像素缩放似乎有点类似，不过看官方文档还是有点差异的。恒定像素缩放是`Makes UI elements retain the same size in pixels regardless of screen size.` ，而恒定物理大小是 `Makes UI elements retain the same physical size regardless of screen size and resolution.` 。

通过参考官方Unity UI Samples项目，可以看到画布一般设置为屏幕大小缩放，然后World Space会有默认的World缩放模式。所以前面提及的如果你的UI元素有缩放属性那么画布最好设置为屏幕大小缩放应该是正确的。

### Graphic Raycaster

这是让你的画布能够检测射线投射，raycaster会遍历本画布上的各个元素然后决定哪个被射线投射撞击了。raycaster是用来判断pointer当前的所在。

- Ignore Reversed Graphics 图像背对射线将会被忽略

## Rect Transform

UI系统里面的定位属性，类似于其他GameObject的Transform属性有位置，旋转和缩放，此外还多了一些其他的属性。

画布如果不是世界空间模式Rect Transform属性是不可以调整的，不过其内的UI元素是可以的。请读者随便新建一个UI元素来测试下面的讨论。

矩形工具在UI元素操作中很有用，矩形工具可以移动对象；也可以缩放对象，鼠标贴近边界或角落；也可以旋转对象，鼠标贴近角落外面点。矩形工具的旋转和缩放相对点右边两个按钮控制的：

- 选择中心 则矩形工具的操作是相对该对象的中心点
- 选择轴心【Pivot Point】 则矩形工具的操作是相对轴心点
- 选择全局 矩形工具的那个边界盒子和对象有点出入
- 选择局部 矩形工具的那个边界盒子会和对象紧贴在一起。

一般UI操作会推荐选择轴心和局部。

此外还有一个锚点【Anchor】概念。理解锚点和轴心点是让你的UI元素正确布局的关键。四个锚点分别对应了子UI元素的四个角落，父UI元素的缩放不会改变子UI元素四个角落到四个锚点的距离，而四个锚点到父UI元素的四个角落的距离会随着父UI元素的缩放而改变。

请读者参阅 [这个Unity官方视频](https://www.youtube.com/watch?v=FeheZqu85WI) 对于Rect Transform的讨论深入学习之。深刻理解Rect Transform里面的概念是让你的UI元素正确布局的关键。

在开始的那里读者肯定看到了一些锚点预设组，根据这些锚点预设组可以快速达成你想要的元素布局效果。比如没有在stretch那一列的随着你的屏幕缩放元素不会发生缩放，而只是固定停靠在某个点上，比如总是停靠在中间，比如总是停靠在左边。而在stretch那一列的停靠方案会有对应的缩放效果。

蓝图模式下矩形工具不能旋转，然后还有一个snap吸附功能。

Raw Edit 模式，还不知道有什么用，最直接的意思就是启用了之后修改锚点或轴心的位置实际上移动的是UI元素，锚点和轴心的位置没变。【这里的修改值得是修改属性面板那里的值】





## 分辨率

在游戏运行窗口下面可以看到调整分辨率和显示比例的地方。

默认的Free Aspect是指随着你的Editor的游戏界面窗口大小来改变分辨率。考虑到一般开发者在调整好自己喜欢的Editor布局之后是不喜欢再随意改动的，所以更好的做法是选择好一个你喜欢的显示分辨率，在这个喜欢的显示分辨率下进行项目早期的开发工作，后面再集中测试各个不同分辨率下游戏的显示细节问题。

在`Editor->Project Settings->Player`那里，在`Standalone Player Options` 下面有个 `Supported Aspect Ratios` 。这些支持纵横比【显示比例】如果不需要的可以取消掉，不同的纵横比里面的游戏效果是需要单独测试的。



## UI元素

各个基本的UI元素下面只简单讨论下，具体请参看文档。

### Panel

Panel其实就是Image，只是有些属性预设值和Image的预设值不太一样。话虽然这么说，但从UI设计来说Panel更大的作用是作为一个带有Rect Transform属性的GameObject来容装其内的一些UI元素，背景图片只是额外的功能支持。

### Text



### Image

Raycast Target 选项是本Image是否是一个Raycast目标，也就是 `GraphicRaycaster.Raycast` 是否和该Image交互。

### Button

Button的高亮hightlight指的是鼠标hover在button之上的状态。

而selected指的是鼠标已经在该按钮上点击之后的状态。

disable状态是该按钮设置`interactable = false`之后进入，这和 `setActive(false)` 有所不同，`setActive(false)` 会将按钮完全移除，这可能会改变UI布局。



## 自动布局

给某一UI元素增加一个自动布局组件，其内的子元素的大小位置缩放等属性将被自动布局组件控制，有点类似于画布组。自动布局的添加在布局那一栏，不在UI那里。

- 填充 padding 某个方向增加一点间距
- 间距 spacing 两个子元素之间的额外间距
- 子级对齐 选择子元素的对齐方式，也就是选择子元素Rect Transform的那个预设组属性
- 控制子对象大小 通过resize子元素来让子元素填充父元素
- 使用子级缩放 考虑到缩放属性一般不推荐使用，这个应该也很少用。
- 子力扩展 Child Force Expand 听名字很是让人困惑，不过如果不勾选这个，上面的控制子对象大小不会正常工作。它会让子元素来宽度方向或者高度方向来强制填充可用空间。这个扩展会保留上面的spacing属性。

### 网格布局组

网格布局组和水平布局组或者垂直布局组区别稍大。

- 单元格大小 其内子元素的width和height属性。
- 起始角落和起始轴 控制子元素的开始填充地点和填充方向。
- 约束 自由或者固定的行数或列数。

## 画布组

UI元素可以增加一个组件叫做画布组。它有一些属性设置是影响本UI元素和所有子UI元素的，比如说属性Alpha，0是完全透明，1是完全不透明。一个简单的引用就是加载页面的淡入淡出效果，就是调配的这个Alpha值。

- Interactable 是否接受输入
- Blocks Raycast 本画布组的UI元素将会阻隔射线，后面的UI元素就不会接收到了。
- Ignore Parent Groups 本画布组如果是另外一个画布组的子对象，那么勾选这个将会是本画布组忽略父画布组的属性配置。



## 布局元素

如果你给某个UI元素添加布局元素，而这个UI元素收到了父元素的自动布局命令，而这和布局元素指定的不匹配，那么这个UI元素会选用本组件布局元素指定的属性。

比如说忽略布局，那么本UI元素会不管父元素的自动布局，实际上本UI元素完全移出了自动布局组的管理列表了。

## Content Size Fitter

会让父UI元素跟着子UI元素们的大小来调整大小，好让其能够容纳它们。

## sprite文件

UI里面有些地方用的是sprite文件对象，如果你直接导入png图片的话会发现没有对应的选项，需要将导入的png图片的属性那里更改为sprite才可以。

一般来说游戏的UI会放在你的常驻场景里面，和你的其他游戏管理逻辑放在一起，而不是某单个level场景里面。



## EventSystem

一个场景只能有一个EventSystem组件，如果是多个场景，场景切换有时会出现问题，推荐的做法是将最开始的EventSystem组件做成常驻对象，然后之后所有的场景都共享这一个EventSystem。

EventSystem下面有输入模块支持，如果使用的是Unity的新的输入系统，推荐统一为你游戏内统一使用的Action Assets。

首个选择项指的是首个UI元素选择项，这在某些情况下比如鼠标突然不能动，一般为空也没关系。

发送导航事件，一般勾选上，发送move，submit，cancel等等导航事件。

阻力阈值，这个中文翻译很让人困惑，英文是Drag threshold，就是拖动操作的判断阈值。



## EventTrigger

可以绑定在任意UI元素上，也可以绑定在非UI元素上。

EventTrigger会监听所有事件，效率不是很高，不是很推荐使用。

### Pointer event 

Pointerenter 事件 当pointer 进入物体的边界时会出发 这个物体的边界对于UI元素是由Rect Transform定义的矩形区域，或者其他物体的碰撞器边界。此外还有pointerexit 事件

Pointerdown down

Pointerup  up事件

Pointerclick 一次点击事件

### drag事件

Begindrap 开始拖动

Enddrap 结束拖动

### drop事件

Enddrop 事件调用的对象是drop位置下的物体



## 经验分享

### 圆角sprite的正确导入设置

UI的Image下面有一个sliced属性，这个sliced属性有什么用呢？假设你的sprite图像分为九个区域，其中四个角落是那种圆角，然后你希望你的图像有很好地拉伸扩展性能并保留四个圆角的显示效果，则可以选择这个sliced属性。具体来说这九个区域的设置和你的sprite导入设置有关系。

sprite是单一还是多个都是可以的，不过推荐还是用外部编辑器将周边的多余的透明区块剔除掉，能够选择单一就选择单一。然后就是sprite图片从个人实践经验来看并不是像素越高越好，比如这里讨论的四个圆角，四个圆角加上一定的周边区域，32*32的图片大小就够用了，因为sprite作用在UI上缩放，直线或者涂满颜色的区块缩放显示效果都还是挺不错的。

然后网格类型mesh type一定要选择 **全矩形** [full rect] 。然后进入sprite editor【安装2d sprite包】：

![img]({static}/images/2021/sprite_sliced.png)

注意拖动要拖动中间的绿色方块，其他位置是调整整个sprite大小的。然后点击应用。



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

