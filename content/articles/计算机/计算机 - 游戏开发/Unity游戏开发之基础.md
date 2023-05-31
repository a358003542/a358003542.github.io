Slug: unity-basic
Tags: unity

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

