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

