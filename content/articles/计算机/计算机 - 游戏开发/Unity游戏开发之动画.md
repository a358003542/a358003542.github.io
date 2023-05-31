Tags: unity

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

