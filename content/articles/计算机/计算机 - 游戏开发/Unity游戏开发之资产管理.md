Tags: unity

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

