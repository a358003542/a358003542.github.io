Tags: unity

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

