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

