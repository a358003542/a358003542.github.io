Tags: unity

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

