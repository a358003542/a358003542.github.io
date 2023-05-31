Tags: unity

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

