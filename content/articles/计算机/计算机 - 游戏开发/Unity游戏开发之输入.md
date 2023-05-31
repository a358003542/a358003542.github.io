Tags: unity

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

