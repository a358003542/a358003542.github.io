Slug: wxpython-learning-notes
Date: 20191018


[TOC]



## wxpython基础

本文假设读者已经熟悉某一种桌面图形开发了，比如说PyQt之类的，也就是基本的图形桌面开发概念读者是熟悉了，下面将言简意赅地就wxpython相关的特色核心概念说明之，然后后面就针对某些专门的问题专门讨论了。

首先说下安装，现在wxpython和pyqt5一样都已经进步了，都可以直接用pip安装了，而且linux下和windows都可以直接安装。



### Sizer.Add参数详解

- `Sizer.Add(item, 0 , wx.ALIGN_RIGHT, 0)`    右对齐布局，第一个参数proportion详细讨论在后面，第三个参数是设置border的宽度的。
- Sizer.Add(item, 0, wx.ALIGN_CENTER, 0)  居中布局
- Sizer.Add(item, 0, wx.EXPAND, 0) 扩展布局，（在vertical sizer里面水平扩展；在horizontal sizer里面垂直扩展）

#### proportion参数

默认是0，0表示不缩放，我估计这样设置之后父窗体Layout，而子窗体将不会自动Layout。然后设置其他整数则是某种缩放比的意思。参考资料谈了一些缩放比的问题，暂时不是很关心这个。下面是讨论的原文：

> proportion参数是被wx.BoxSizer用作因数去决定当sizer的大小改变时，sizer应该如何调整它的孩子的尺寸。我们这里使用的是水平方向调整的sizer，stretch因数决定每个孩子的水平尺寸如何改变（坚直方向的改变由box sizer基于第三个参数来决定）。

一般的0表示不缩放，1表示随着父窗体缩放而缩放。

#### Flag参数

这块东西经常遇到，虽然Flag较多，还是建议沉下心来学一下，这些后面会频繁用到的：

#####  控制那边有border
```
wx.TOP
wx.BOTTOM
wx.LEFT
wx.RIGHT
wx.ALL
```

##### 扩展

```
wx.EXPAND  周围有空间就扩展
wx.SHAPED  扩展同时保持宽高比
```

##### 对齐

```
wx.ALIGN_CENTER or wx.ALIGN_CENTRE
wx.ALIGN_LEFT
wx.ALIGN_RIGHT
wx.ALIGN_RIGHT
wx.ALIGN_TOP
wx.ALIGN_BOTTOM
wx.ALIGN_CENTER_VERTICAL or wx.ALIGN_CENTRE_VERTICAL
wx.ALIGN_CENTER_HORIZONTAL or wx.ALIGN_CENTRE_HORIZONTAL
```

下面举一些组合的例子：

```
 wx.EXPAND | wx.LEFT  有空间就扩展，border在左边，这样你会看到左边有空白
```

```
 wx.EXPAND | wx.LEFT | wx.RIGHT  有空间就扩展，border在左边和右边，这样你会看到左边和右边有空白
```

```
wx.EXPAND | wx.ALL 有空间就扩展，上下左右border都有
```

#### Frame样式
- `wx.FRAME_NO_TASKBAR` 没有任务栏

- `wx.FRAME_SHAPED` 非矩形框架

- `wx.FRAME_TOOL_WINDOW` 

- `wx.FRAME_FLOAT_ON_PARENT` 框架将漂浮在父窗体之上

- `wx.STAY_ON_TOP` 总在最上

- `wx.SIMPLE_BORDER` 没有装饰的边框


### 布局的太布局的

一般手写布局代码的话，肯定是使用各个Sizer，其中BoxSizer最常用，对于不是特别复杂的布局BoxSizer，横竖拼接加上Add的参数调配，基本上都是调出来的。以至于每个panel类里面我现在都写上了一个 `self.box` 成为惯例了，虽然后面某些情况下会使用到其他Sizer，比如GridSizer等，但GridSizer是可以放在BoxSizer里面的，所以问题不大。这样形成惯例之后，后面引用该面板，想到主Sizer，就直接panel.box即可，这是题外话了。

#### FlexGridSizer

FlexGridSizer布局将页面分成二维的表格，各个表格元素高度一定是一样的，但宽度可以不一样（GridSizer则要求一定一样）。

```
wx.FlexGridSizer(int rows=1, int cols=0, int vgap=0, int hgap=0)
```

- rows 多少行
- cols 多少列
- vgap 垂直向加点空间
- hgap 水平向加点空间





### wxpython里面的ID

window identifiers 是一些整数 决定了窗体在系统中的唯一性，wxpython中可以如下定义窗体的ID：

#### 窗体ID的定义
- 明确赋值一个正整数，不推荐
- 使用wx.NewID()
- 传递wx.ID_ANY 或 -1 给窗体构造器
```
frame = wx.Frame.__init__(None, -1)
id = frame.GetId()
```



然后笔者强烈推荐读者使用名字来定义和定位窗体，这样你的代码具有更具有良好的可读性。

#### 标准ID

[官方文档标准ID列表](https://wxpython.org/Phoenix/docs/html/wx.StandardID.enumeration.html) 

#### 根据ID来查找窗体
1、wx.FindWindowById(id, parent=None)
2、wx.FindWindowByName(name, parent=None)
3、wx.FindWindowByLabel(label, parent=None)

如果在某个窗体内调用 `self.FindWindowById` 则是本窗体内查找，找到的第一个。



### 根据名字来查找窗体

笔者强烈推荐读者在写大型GUI程序的时候给几个核心窗体都定义好唯一的名字（具体大部分窗体都可以接受一个name可选参数的），然后如下来查找之。这对于你后面的编程会带来很大的便利。

```python
import wx

def find_window_by_name(name):
    """
    根据窗体的名字来返回窗体，推荐风格
    :param name:
    :return:
    """
    window = wx.FindWindowByName(name)
    return window

def is_the_window_name(window, name):
    """
    根据名字来判断是否是这个窗体
    :param window:
    :param name:
    :return:
    """
    if window.SetName() == name:
        return True
    else:
        return False
```



### 深入理解wxpython中的事件

```
Bind(event, handler, source=None, id=wx.ID_ANY, id2=wx.ID_ANY)
```

- event 比如在wx.Button上鼠标单击一下将触发一个 wx.EVT_BUTTON 事件，event这里可以定义具体你想要绑定的事件。
- handler 处理器
- source 一般不需要指定，如果父窗口多个相同的触发源，比如说多个按钮，那么就需要指定下。
- id 根据id定义事件触发源，在某些情况下根据id来会更方便些，然后id2同id可以确定一串连续的窗体。

#### wxpython事件处理过程



![img]({static}/images/wxpython/wxpython事件处理过程.png)



1. 事件触发--> 获取事件触发对象
2. 检查事件触发对象是否允许处理事件（可以通过 `SetEvtHandlerEnabled(boolean)` 来禁用窗体处理事件）【UI层面Disable Enable只是禁用了窗体和用户的交互，但它还是可以处理间接接受到的事件，比如通过PostEvent等】
3. `event.Skip()` 这个方法之前我以为是该事件的处理跳过了，理解错误了，更准确的说法是 **本事件处理完成** 了。 也就是如果在事件触发链中，没有看到这个方法，那么事件将会继续传播，否则事件处理终止。
4. 如果目标事件允许 传播propagate ， 那么还会继续向上去触发父容器的事件，直到App，也就是最顶层结束传播。【默认情况，只有wx.CommandEvent及其子类的实例向上展开至容器级。其它的所有事件都不传播。】【Button单击属于CommandEvent，鼠标移动和浮动在上和离开都是MouseEvent】

##### 习题1

请读者解释为什么是下面的写法，鼠标浮动在上和离开事件为什么只能定向self.button。

```
self.Bind(wx.EVT_BUTTON, self.OnButtonClick,  self.button)    #1 绑定按钮事件     
self.button.Bind(wx.EVT_ENTER_WINDOW,   self.OnEnterWindow)     #2 绑定鼠标位于其上事件 
self.button.Bind(wx.EVT_LEAVE_WINDOW, self.OnLeaveWindow)     #3 绑定鼠标离开事件
```

按钮点击行为可以传播，其首先在本窗体上触发按钮事件，然后在本窗体上找对应的方法 `OnButtonClick` ，如果找到这个方法了，那么执行，执行过程中如果遇到Skip方法，那么本事件处理到此结束；如果没有，则会试着向上传播，直到顶层窗体。向上传播的过程就是传播事件，也就是本窗体的父窗体也将触发本按钮事件，然后试着实行对应的 `OnButtonClick` 方法。

鼠标移动行为是不可以传播事件，必须指明那个按钮绑定的。 `self.button.Bind`  过程就是直接执行你初始挂在的那个方法，找不到就抛出异常了。

大体是这样的，如果读者还有不明白了，请阅读 wxpython in action 这本书的第三章，关于这部分问题，这本书讲的很好。

##### 习题2

如何一个按钮的点击事件会触发两个动作。

简单来说就是写两个 `self.button.Bind()` 语句绑定两个函数就可以了，按照前面说的，这两个函数每个都要跟上 `event.Skip()` 。



#### 手动触发某个事件

有时直接手动触发一个事件会省下很多代码。

```
self.Close(True)
```



#### 获取当前事件的触发对象

```
button = event.GetEventObject()
print(button.GetName())
```



#### 常见的wx.Event子类

- wx.CloseEvent frame框架关闭时触发
- wx.CommandEvent 按钮单击 菜单选择 等
- wx.KeyEvent 按键事件
- wx.MouseEvent 鼠标事件
- wx.PaintEvent 窗体需要重画时触发
- wx.SizeEvent 窗体大小或布局改变时触发
- wx.TimerEvent wx.Timer类创建的定时事件



#### 按钮三事件

按钮在GUI设计中是使用频率非常高的一个组件，其绑定的最常用的三个事件有：

- self.Bind(wx.EVT_BUTTON, self.OnButtonClick,  self.button)   绑定按钮事件  
- self.button.Bind(wx.EVT_ENTER_WINDOW,  self.OnEnterWindow)    绑定鼠标位于其上事件  
- self.button.Bind(wx.EVT_LEAVE_WINDOW, self.OnLeaveWindow)     绑定鼠标离开事件





### 什么时候调用Layout方法

动态调整GUI的各个元素，我们会看到网上各个例子经常会看到调用了 Layout方法，然后有的时候我发现不调用似乎影响不大，有的时候发现不调用页面会变形，那么到底什么时候应该调用Layout方法呢。请参看 [这篇文章](https://wiki.wxpython.org/WhenAndHowToCallLayout) 。

1. StaticText 进行 SetLable 操作之后，应该Layout下
2. 通过sizer显示或隐藏某个面板元素之后应该Layout 下。

如果窗体触发了 `EVT_SIZE` 事件，wxpython会自动进行Layout重排。重排的时候父窗体的sizer会自动进行Layout，然后父窗体的子窗体也会相应的进行重排操作，但如果某个子窗体不需要重排，那么它就不会接受 `EVT_SIZE` 事件了，也就不会调用Layout方法了。比如StaticText 更改Layout，你调用其父窗体的Layout，StaticText是不会自动调整的。

按照 [这个网页](https://stackoverflow.com/questions/6294726/setsizer-setsizerandfit-and-resizing-components) 的介绍，加上个人的一点实践经验，不推荐使用 `SetSizerAndFit` 方法了，个人的使用体验是使用 `SetSizer` 就能完成工作了，而加上Fit有的时候会给你的布局带来一些困扰，比如ScrolledPanel在Fit之后会发生截断问题。

总的原则经过试验确实是可行的：

1. SetSizer
2. 发现不对劲，Layout
3. Layout之后还不对劲，这通常不是布局的问题了，某些情况下你更改了一些数据，可能需要Refresh
4.  TODO Layout 和 Refresh 的区别是什么 目前我已经遇到一个问题，只有Refresh之后才有正常的行为，那就是重画的透明组件再设置标签之后，似乎只有Refresh之后才会再次进行重画动作，这值得引起读者的注意。然后有的时候我们看到子面板Layout之后会自动Refresh。

#### ScrolledPanel

这里特别值得一提的是 `ScrolledPanel` 里面的内容在发生变动的时候，除了Layout之外还需要加上：

```
self.SetupScrolling()
```

实践发现是内容变动之后都需要加上这句，否则侧边滚动条会丢失，下面的内容也会被隐藏。

### 设置背景颜色和字体颜色

wxpython的任何窗体对象（是的这两个方法是挂在wx.Window上的），可以用 `SetBackgroundColour` 来设置其背景颜色，用 `SetForegroundColour`来设置前景颜色，前景颜色一般就是所谓的字体颜色吧。

如果你需要动态调成某个面板的背景颜色，那么记得调用Refresh方法来激活重画事件。

### 将图片转成python编码

首先是编写这样一个python脚本：

```python
#!/usr/bin/env python
# -*-coding:utf-8-*-


"""
将项目图片文件全部转成python文件，然后可以直接 import images 来引用图片了。
"""

import sys
from wx.tools import img2py

command_lines = [
    "   -F -i -n Favicon static/images/favicon.ico images.py",
    "-a -F -n ApplyTaiKa static/images/apply_tai_ka.png images.py",
    "-a -F -n Address static/images/address_img.png images.py",
]

if __name__ == "__main__":
    for line in command_lines:
        args = line.split()
        img2py.main(args)
```

其调用了wxpython提供的工具 img2py ，然后输出的images.py 里面的图片对象有如下方法：

```
    def GetBitmap(self):
        return wx.Bitmap(self.GetImage())
    def GetData(self):
        data = self.data
        if self.isBase64:
            data = b64decode(self.data)
        return data

    def GetIcon(self):
        icon = wx.Icon()
        icon.CopyFromBitmap(self.GetBitmap())
        return icon

    def GetImage(self):
        stream = BytesIO(self.GetData())
        return wx.Image(stream)
```

最常用的是 `GetBitmap` 直接获取Bitmap图片对象。

### 后台任务

wxpython的后台任务推荐用 `wx.CallAfter` 或者 `wx.CallLater` 来调用。用python内置的多线程可能会让你的界面有时出现一些奇怪的问题。

```
wx.CallAfter(callable, *args, **kwargs)
```

### Timer

wxpython里面的计时器某些任务挂上去还是很方便的。

        self.timer = wx.Timer(self)
        self.timer.Start(1000)
        self.Bind(wx.EVT_TIMER, self.update, self.timer)





### 动态多组件切换

用boxsizer来挂载一些面板，然后隐藏一些面板，并显示初始你想要显示的那个panel。Add, Show Hide 等方法来操作，最后注意Layout一下，这是基本功了。

这里值得一提的是，如果你只是本panel基本的Layout，那么多个panel切换父panel给那些子panel的size都是一致的，因为你的子panel各个size大小不同，如果你动态切换需要更好的效果，那么应该调用父panel的Layout。

#### 某个子Panel的重写

一些参数的变化，你的子panel需要重写，这个时候推荐使用box的Replace方法：

```python
        old_panel = self.category_sp2_panel
        new_panel = CategorySPInnerPanel(self, data_list=value)

        self.box.Replace(old_panel, new_panel)
        old_panel.Destroy()
        self.category_sp2_panel = new_panel
```

大体过程如上，实际切换推荐采用如下写法：

1. 首先隐藏box所包含的所有子面板：

```
    def hide_all_panel(self):
        for panel in self.box.GetChildren():
            self.box.Hide(panel.GetWindow())
```

2. 然后在决定显示那个子面板

   ```
   self.box.Show(self.category_sp1_panel)
   ```

当然了最后记得要调用父面板级别的Layout一下。



### 全局捕捉异常

```python
import sys

import traceback

import wx


class Panel(wx.Panel):
    def __init__(self, parent):
        super(Panel, self).__init__(parent)

        button = wx.Button(self, label='抛异常')
        button.Bind(wx.EVT_BUTTON, self.OnButton)

    def OnButton(self, event):
        1 / 0


def MyExceptionHook(etype, value, trace):
    """
    etype exception type
    value exception message
    trace traceback header
    :param etype:
    :param value:
    :param trace:
    :return:
    """
    frame = wx.GetApp().GetTopWindow()

    tmp = traceback.format_exception(etype, value, trace)

    exception = "".join(tmp)

    print(exception)


class DemoFrame(wx.Frame):
    def __init__(self):
        super(DemoFrame, self).__init__(None, -1, "test capture all excepiton", size=(600, 400))

        sys.excepthook = MyExceptionHook
        panel = Panel(self)


if __name__ == '__main__':
    app = wx.App()
    frame = DemoFrame()
    frame.Show()

    app.MainLoop()

```



实际过程很简单，就是把python的 sys.excepthook 重载为 MyExceptionHook 函数，一切异常交给它来处理。



### 验证器

验证器最开始是对于对话框的某些数据格式有限定要求，但后面发现验证器非常的有用，之前对话框管理 `self.data` 做的一些工作可以交给验证器来做，所以验证器这一块最好早接触。

一般使用验证器先自己定义一个验证器类，继承自 `wx.Validator` 。然后你自定义一个 `Clone` 方法，返回本验证器相同的副本。

验证器第一个功能是验证数据，你在本验证器类中定义的 `Validate` 方法就是做这个的。这个方法默认还将传递一个 win参数进来，这个win，比如说你的验证器类是挂载在某个TextCtrl上的，那么那个TextCtrl实例就是这个win，所以你可以方便引用这个win来获得数据。

如果 `Validate` 方法返回 True ，那么验证成功，如果返回 False，那么验证失败。再返回之前你还可以做一些其他的事情。

此外验证器类还需要定义 `TransferToWindow` 方法，表示验证器启动开始进行的动作；定义 `TransferFromWindow` 方法表示验证器验证结束后的动作。如果这两个函数都简单 `return True` ，那么将什么都不用做，此外你可以通过这两个方法一来一去来维护一个对话框维护的某个全局数据集。之前我还没接触验证器的时候，写了几十行代码为了维护一个类似的data数据集，而且是只要对话框各个控件稍有变动，就要触发一个事件进行数据同步动作。显然验证器的这种方案更加的优雅。

你的Dialog可能有几个控件，几个控件使用各自的validator是独立的，虽然你在写验证器类的时候可以统一为一个类，但实际运行时有好几个验证器各自起作用的。具体请看下面这个例子：

```python
import wx



class CategorySPAddValidator(wx.Validator):
    def __init__(self, data, key):
        super(CategorySPAddValidator, self).__init__()
        self.data = data
        self.key = key

    def Clone(self):
        return CategorySPAddValidator(self.data, self.key)

    def handle_targetCtrl_state(self, targetCtrl, state):
        """
        成功和失败的动作通用动作
        :param state:
        :return:
        """
        if state:
            targetCtrl.SetBackgroundColour(wx.SystemSettings.GetColour(wx.SYS_COLOUR_WINDOW))
            targetCtrl.Refresh()
        else:
            targetCtrl.SetBackgroundColour("pink")
            targetCtrl.SetFocus()
            targetCtrl.Refresh()

    def Validate(self, win):
        targetCtrl = self.GetWindow()
        value = targetCtrl.GetValue()

        state = True

        if self.key == 'name':
            if len(value) == 0:
                dlg = wx.MessageDialog(win, "科目名称不能为空", '输入有误')
                dlg.ShowModal()
                state = False
        elif self.key == 'code':
            if len(value) == 0:
                dlg = wx.MessageDialog(win, "税收分类编码不能为空.", '输入有误')
                dlg.ShowModal()
                state = False
            elif len(value) != 19:
                dlg = wx.MessageDialog(win, "税收分类编码必须是19位.", '输入有误')
                dlg.ShowModal()
                state = False
        elif self.key == 'unit':
            pass
        elif self.key == 'price':
            pass

        self.handle_targetCtrl_state(targetCtrl, state)

        return state

    def TransferToWindow(self):
        """
        对话框打开是，读取数据到窗体
        :return:
        """
        targetCtrl = self.GetWindow()

        state = True
        value = None

        if self.key == 'name':
            value = self.data.get('spmc', '')
        elif self.key == 'code':
            value = self.data.get('spbm', '')
        elif self.key == 'unit':
            value = self.data.get('jldw', '')
        elif self.key == 'price':
            value = self.data.get('dj', '')

        targetCtrl.SetValue(value)
        return state

    def TransferFromWindow(self):
        """
        对话框关闭
        :return:
        """
        targetCtrl = self.GetWindow()
        value = targetCtrl.GetValue()

        state = True

        if self.key == 'name':
            self.data['spmc'] = value
        elif self.key == 'code':
            self.data['spbm'] = value
        elif self.key == 'unit':
            self.data['jldw'] = value
        elif self.key == 'price':
            self.data['dj'] = value

        return state

```



这个例子我是跟着wxpython in action 一书上的例子进行了一些优化，一开始我以为书上的例子并没有很好地解决dialog那边数据传输问题，但最神奇的是，原对话框的 self.data 属性已经发生更改了，而且我确认 `TransferFromWindow` 哪里 self.data 指的的本验证器，当然。但问题是后面我调用dlg里面的data数据，没想到就是修改好的数据。所以现在的问题是，Why it works . 一个初步的猜测是wxpython的验证器非常聪明地将我之前传输 `self.data` 数据进来的时候就把它记住了，只能做这个解释。

经过试验发现上面如果面板层次稍微复杂点，上面的self.data直接操作风格就不行了，而如果你的验证器要管理多个数据也不能这样做的。总之关于验证器基本该了解的就是这么多了，具体数据传输，到母面板的哪里，或者从哪里提取数据，这些都是小细节了。

上面的代码只是一个演示功能，读者具体自己写代码还是不要寄托这些神奇的魔法，应该更加明晰的指定数据从哪里来，到哪里去。

### wxpython和asyncio的集成

本小节主要参考了 [这个代码文件](https://github.com/BrendanSimon/micropython_experiments/blob/master/keypad_lcd/wx_asyncio_test_1.py) 。我看了一下，空闲事件和Timer事件都彼此触发，重复得很明显，就选择一个Timer触发即可。

然后看了一下asyncio的相关文档，stop是不会让事件循环中的任务丢失的，所以总的效果就是asyncio 的事件循环一直在后台运行就是了。

```python
        self.timer = wx.Timer(self)
        self.timer.Start(1)
        self.Bind(wx.EVT_TIMER, self.idle_handler)
        self.eventloop = asyncio.get_event_loop()
        
    def idle_handler(self, event):
        """
        Idle handler runs the asyncio event loop.
        """
        self.eventloop.call_soon(self.eventloop.stop)
        self.eventloop.run_forever()
```



### 利用进程间通信来实现多次启动应用只有一个应用

前面已经讲了wxpython如何实现确保只有一个程序实例在运行，就是利用 `wx.SingleInstanceChecker` 这个类，具体使用很简单。

但我们如何实现那种效果，就是下一次点击应用图标，还是弹出的原窗体应用，而第二次启动应用尝试悄然结束即可。

仔细分析问题和查了一些资料之后发现，这实际上就是一个简单的进程间通信问题。第二次启动应用的进程，只要发送一个简单的消息给原应用就可以实现这种效果了。

了解进程间通信原理之后发现这块还挺复杂的，尤其是windows的那些win32 API操作，我非常的不熟悉，然后看到套接字也可以做进程间通信，这说白了就是你的应用开了一些小的server监听端口和client请求。这种实现方式兼容性是最好的，但一开始我总感觉是不是有点杀鸡用牛刀了，因为我就想发个简单的信号即可，然后了解到python的signal模块在windows这边兼容性不好，其他windows的win32操作麻烦还不一定是个好方案，就决定写个简单的套接字。

好在应用asyncio事件循环上面提及的，已经挂载在应用上了，也就是说我们只需要利用asyncio模块照着教程写个最简单的套接字发送一个简单的消息即可。

```python
LOCAL_SOCKET_PORT = 10000
MSG_INSTANCE = 'instance'


async def handle_local_socket_server(reader, writer):
    data = await reader.read()
    message = data.decode()

    if message == MSG_INSTANCE:
        logger.info('another instance is calling.')
        mainFrame = get_mainFrame()
        mainFrame.taskBarIcon.max_show()


async def handle_local_socket_client(message, loop):
    reader, writer = await asyncio.open_connection('127.0.0.1', LOCAL_SOCKET_PORT, loop=loop)
    writer.write(message.encode())

    await writer.drain()
    writer.close()

    .....
    
    if self.instance.IsAnotherRunning():
            self.eventloop.run_until_complete(handle_local_socket_client(MSG_INSTANCE, loop=self.eventloop))
            logger.warning('已经有一个潮生活发票助手程序在运行了！')
            return False
        else:
            local_socket_server = asyncio.start_server(handle_local_socket_server, '127.0.0.1', port=LOCAL_SOCKET_PORT,
                                                       loop=self.eventloop)

            self.eventloop.run_until_complete(local_socket_server)

```

大概代码如上所示，最后效果还挺不错的。

这里基本上只用到了asyncio套接字编程最基础的那些知识，这里有个问题，我这边还没有试探：那就是按照道理只需要 `self.eventloop.create_task` 把任务挂上去即可，而不需要 `run_until_complete` 的，可能是前面提及的wxpython和asyncio集成，要稍后面一些asyncio的事件循环才启动，因为那个计时器也才刚开始创建，这个我没试过，也可能不是。



### 程序触发事件

wxpython里面如何通过程序来触发某个事件呢，如下所示：

```python
            homeButton = find_window_by_name('homeButton')
            evt = wx.PyCommandEvent(wx.EVT_BUTTON.typeId, homeButton.GetId())
            wx.PostEvent(homeButton, evt)
```

核心就是 `wx.PostEvent` 方法，值得一提的是，通过这种方法触发的事件不能调用

```
event.GetEventObject()

```

不过你可以通过

```
    button = find_window_by_id(event.GetId())

```

来找到那个目标button，也就是 `GetId` 方法还是可以用的。





### TextCtrl用代码改变文本

TextCtrl用代码直接改变文本的方法有：

- AppendText 尾部添加文本
- Clear 
- EmulateKeyPress 产生一个按键事件
- SetInsertionPoint 设置插入点
- SetValue
- WriteText 在当前插入点插入文本
- Remove 删除指定范围文本
- Replace 替换指定范围文本

### 对接系统的剪贴板

#### 将文本放入剪贴板

```python
data = wx.TextDataObject()
text = "your text"
data.SetText(text)
if wx.TheClipboard.Open():
	wx.TheClipboard.SetData(data) #将数据放置到剪贴板上
	wx.TheClipboard.Close()
else:
	print('剪贴板打不开..')
```

#### 从剪贴板中取内容

```python
data = wx.TextDataObject()
if wx.TheClipboard.Open():
    success = wx.TheClipboard.GetData(data)
    wx.TheClipboard.Close()
if success:
    return data.GetText()
```

此外还有清空剪贴板的动作： `Clear` 方法。



### ScrolledPanel

带滚动条的面板，下面是一些值得额外一提的东西：

#### SetupScrolling

```python
SetupScrolling(self, scroll_x=True, scroll_y=True, rate_x=20, rate_y=20,
                       scrollToTop=True, scrollIntoView=True)
```

这个方法很重要，前面谈到，带滚动条的面板如果内容发生变动，除了 Layout 之外，还需要加上 `SetupScrolling` 这一句。

然后后面的这些选项也很重要：

- scroll_x 如果设置为False 则横向滚动条不显示
- scroll_y 如果设置为False 则竖向滚动条不显示
- rate_x 最小一步滚动的距离 
- rate_y 最小一步竖向滚动距离，
- scroolIntoView 滚动是尽可能让子面板合适的显示



此外你可以通过 `Scroll` 方法来程序进行滚动。



### wxpython里面的鼠标图案

一般面板，也就是继承自Window的类都有 `SetCursor` 方法来设置当前的鼠标图形

```
self.SetCursor(wx.Cursor(wx.CURSOR_HAND))
```

默认的是： `wx.CURSOR_ARROW` ，常用的显示要点击的手型是 `wx.CURSOR_HAND` ，此外还有：

- wx.CURSOR_ARROWWAIT 只能在windows下有效，表示繁忙的光标
- wx.CURSOR_BLANK 不可见的光标
- wx.CURSOR_WAIT 沙漏等待光标
- wx.CURSOR_WATCH 手表等待光标
- wx.CURSOR_SPRAYCAN 绘图用光标
- wx.CURSOR_SIZING 尺寸调整时光标，四个指向
- wx.CURSOR_SIZEWE 水平尺寸调整光标，左右指向
- wx.CURSOR_SIZENS 垂直尺寸调整光标，上下指向
- wx.CURSOR_RIGHT_BUTTON 右按键按下光标
- wx.CURSOR_PENCIL 钢笔样光标
- wx.CURSOR_PAINT_BRUSH 画刷样光标，同样在绘图程序中
- wx.CURSOR_MAGNIFIER 放大镜，表示缩放
- wx.CURSOR_MIDDLE_BUTTON 一个中间按键按下的鼠标

此外你还可以自定义光标图案： `wx.CursorFromImage(image)` 



### ComboBox内容的修改

参考了 [这个问题](https://stackoverflow.com/questions/682923/dynamically-change-the-choices-in-a-wx-combobox) 。

ComboBox的官方手册上找不到相关方法，原来ComboBox继承自 `ItemContainer` ，调用这里的方法，就可以动态修改ComboBox里面的内容。

- Clear 清空
- Append 附加
- Delete(self, n) 删除
- Insert 插入
- `Set(self, items)`  整个替换 



### 自定义对话框

某些情况下直接继承自 `SizedDialog`  会很方便：

```python
import wx.lib.sized_controls as sc

class Dialog(sc.SizedDialog):
    def __init__(self, parent, *args, data=None, type='simple', **kwargs):
        sc.SizedDialog.__init__(self, parent, *args, size=(400, 300), **kwargs)
        self.parent = parent
        
        pane = self.GetContentsPane()
        pane.SetSizerType("form")

        # 科目名称
        wx.StaticText(pane, -1, "科目名称")
        self.nameText = wx.StaticText(pane, -1, label=self.name)

        self.Fit()
        self.SetMinSize(self.GetSize())

        self.Layout()
        self.Center()
```

或者直接继承自 `wx.Dialog` ，然后就像自定义panel一样做，除了里面添加button推荐使用一些标准ID，这样可以类似下面关闭对话框之后判断具体点击了那个按钮：

```
val = dlg.ShowModal()
if val == wx.ID_DELETE ...
```



### 列表控件

列表控件支持三种模式：

1. style=wx.LC_ICON 图标模式，大概看上去像windows上的文件浏览的样子
2. style=wx.LC_SMALL_ICON 小图标模式
3. style=wx.LC_LIST 列表模式 有点类似于小图标模式，不同的是按列排列的
4. style=wx.LC_REPORT 报告模式 类似于excel表单的那种

具体更详尽的使用还是需要查阅文档的，此外如果你需要在某个item里面添加Panel或者其他控件，那么建议读者了解下 `wx.lib.agw.ultimatelistctrl.UltimateListCtrl` ，如果读者需要某一列可排序，了解下 `wx.lib.mixins.listctrl.ColumnSorterMixin` 如果需要item成为 textctrl 可以输入，了解下 `wx.lib.mixins.listctrl.TextEditMixin` ，还有其他的mixin，不过在使用 ultimatelistctrl的时候就没必要使用那些mixin了。



### 网格控件

网格控件 `wx.grid.Grid` 感觉比列表控件更加复杂，具体涉及到的方法很多，建议根据需要查阅文档之。



### 树型控件

TreeCtrl 显示复杂的层次数据，比如目录结构时可以用到。

### HTMLWindow

对于某些复杂的文本显示需求，可以使用HTMLWindow用一种类html标记语言来渲染而成，其底层并不是用的浏览器渲染，而是wxpython自己完成了的渲染，简单来说这只是wxpython通过一种类html标记语言完成的一种快速定义文本显示界面的功能。

此外wxpython还提供了html2包，其是利用浏览器底层渲染，然后显示的，这样更接近浏览器显示效果。



### DateTime和python的datetime对象互转

这一节参考了 python cook book 的 #12 recipe。这里记录下，后面有时候应该会用到的：

```python
import datetime
import wx

def pydate2wxdate(date):
    assert isinstance(date, (datetime.datetime, datetime.date))

    tt = date.timetuple()
    dmy = (tt[2], tt[1]-1, tt[0])
    return wx.DateTimeFromDMY(*dmy)

def wxdate2pydate(date):
    assert isinstance(date, wx.DateTime)
    if date.IsValid():
        ymd = map(int, date.FormatISODate().split('-'))
        return datetime.date(*ymd)
    else:
        return None
```



### boxsizer两个值得注意的方法

#### AddSpacer

作用就是增加一段固定的空白距离，boxsizer覆写了sizer的AddSpacer方法，横向竖向不能混淆的。

```python
def add_vspace(box, size):
    """
    boxsizer竖向增加空白距离，如果不是VERTICAL则将抛异常
    :param box:
    :param size:
    :return:
    """
    if box.GetOrientation() == wx.VERTICAL:
        box.AddSpacer(size)
    else:
        raise NotVerticalSizer


def add_hspace(box, size):
    """
    boxsizer横向增加空白距离，如果不是HORIZONTAL则将抛异常
    :param box:
    :param size:
    :return:
    """
    if box.GetOrientation() == wx.HORIZONTAL:
        box.AddSpacer(size)
    else:
        raise NotHorizontalSizer
```



#### AddStretchSpacer

这个方法是sizer里面的，boxsizer也可以调用，一开始我还没注意到。这个方法和上面方法的区别就是增加了一段可缩放的空白距离，其在Qt里面就是一段弹簧样的东西。利用这个缩放器很方便实现某个空间的居中或者某个比例的位置调整。



## wxpython编码风格推荐

1. 使用

```
import wx
```

不要使用 `from what import * ` 这样的引入语法。

2. 使用 size=(500,400)，不推荐使用 wx.Size ，这个提法是 [这个网页](https://wiki.wxpython.org/wxPython%20Style%20Guide) 说的，可能会有点争议性，他说简单比复杂好。因为点就x, y两个值，所以就目前个人使用来说，确实直接用数组对会方便点，而且在编码的时候，具体size参数实际上已经指明了第一个参数是x，第二个参数是y了。
3. 凡是面板都应该子类化，然后面板类的各个控件可以被面板管理。这个不是说要全部这样做，但这样做的好处很多。面板类的控件可管理，对你的后续管理操作编码带来很多便利，而面板的子类化是大型GUI程序的必然道路。
4. 多个按钮推荐使用 `StdDialogButtonSizer` ， TODO ，后面我个人使用体验之后再讨论几句。

```
    okButton = wx.Button(self, wx.ID_OK, "&OK")
    okButton.SetDefault()
    cancelButton = wx.Button(self, wx.ID_CANCEL, "&Cancel")
    btnSizer = wx.StdDialogButtonSizer()
    btnSizer.AddButton(okButton)
    btnSizer.AddButton(cancelButton)
    btnSizer.Realize()
```



### 代码重构：思考如何视图操作分离

首先说一下整个编程世界公认的一些理念，比如DRY原则。

然后在具体编码中wxpython额外有些风格推荐。

按照DIY原则，我们有：

- 数据和代码分离，不管你的数据以何种方式加载进来的，这个都是后面完善的小细节，因为GUI编码的特殊性，从一开始就要考虑数据和代码的分离。
- 随着GUI程序编码的复杂度提高，请立刻开始重构你的代码，实现面向对象风格的写法，GUI程序内在和面向对象思想是很融洽的，只是一开始程序代码很简单不用考虑上面向对象，稍微写几天之后，就要考虑第一次重构了。请根据你的视图层结构特色，来对应编写你的gui模块的类的结构层次。
- 前面说到数据和代码分离，GUI有很多变量数据实际上是一些常量数据，建议所有后面不会发生变动的这些常量数据都另外再开个模块统一管理。一个不错的风格是这些常量数据包括你的所有变量数据和各种配置数据最终都在你的一个全局变量模块中汇总。既方便代码中的编写引用，也方便后续你写代码时候的debug模式编写，GUI程序运行时，只要写个简单的debug菜单，就可以将程序运行时所有的变量常量参数打印出来。
- 你的程序主要核心面板最好都给他们一个名字，这样后面事件处理的时候，可以直接调用对应的窗体，然后顺着这个窗体，调用目标窗体的子窗体来进行一些操作，但做的完善的，你的窗体应该提供各种方法来操控本窗体的子控件，而不是直接调用子控件。

而上面提到的那篇参考文章更进一步提出了MVC架构，这其中最关键的一点就是利用pypubsub模块，来实现你的程序内部的消息和发送和接收，从而实现视图层和模型层完全解耦。你的模型层只负责管理好本应用程序本地数据，你的控制层负责和模型层和视图层交互，通过控制层，你的视图层是完全不需要和模型层直接交互的。

具体哪个样例代码我就不贴了，而pypubsub模块的基本使用是很简洁的，这里面的关键在于理解MVC层各个层的分工和具体设计思路。仔细分析参考文章的样例代码，我们会发现这里面有一些设计很精妙的地方。首先请读者设想一个问题，这个问题在GUI程序编写或者其他类似的MVC架构中都会出现，那就是如果底层某个模型或者说某个数据或者更精确一点某个变量发生变化了，这种变化可能是内部计算得到的，也可能是从外部API获取到的数据，总之就是我们的GUI程序数据池里面已经有一些变动了，其中有一些数据是直接和视图层相关的，我们是希望视图层做出相应的调整。手工请求数据，再刷新页面的想法实在太愚蠢了，我们应该设计一个控制器，这个控制器负责进行内部某些运算或者从外部获取到某些数据，然后检测某些数据的变化，这些数据的变化首先送给本地模型层，做好变化记录，这时的样例程序是 changing 过程，然后本地模型层数据变化了，就应该改变视图层相应的显示，具体就是通过发送changed 信号来实现页面更新驱动的。



#### 视图层

你之前写的GUI程序一开始就放在视图层，你的视图层的panel类等，本面板的子控件，主要是那些可变元素，挂在本面板上可以直接调用，后面根据你的业务和GUI显示需求，你需要些更好针对本面板的子控件的组合行为。

面板的属性，利用python的 `@property` 你将确定一些本面板的属性，通常你的面板的一些可变元素就是调用这些属性来的，而具体引用这些属性的方法，实际指向的是外部的可变内容，这样你的视图层内部代码每次引用 `self.what` ，都会实际调用你定义的属性的方法，也就是实时再计算一次，得到最新的信息。

然后视图层还有常数信息，按照前面讨论的编码风格推荐，也应该慢慢抽离出来，用某个const常数模块来统一管理之，一句话，努力做到数据和代码分离。

#### 控制层

控制层的任务有如下：

- 接受本应用模型层，组织好本地常量变量数据
- 接受好视图层或者模型层发送的消息，针对这些消息进行对应的动作处理
- 如上所述，视图层引用可变数据的方法支持是控制层提供的



#### 模型层

模型层不和视图层直接进行交互，如前面所说的，只负责管理好本地的数据和发送相应的信号，实际上模型层也没有引入控制层，其只是一个单纯简单的管理本地数据的接口罢了。

一般来说经常变动的一些和业务相关的数据应该进入模型层。



### 二次思考MVC架构

流行的web框架是以一种非常成熟的MVC架构风格，很多东西并没有引起我们太大的注意，加之GUI编程相对于web应用视图层和控制层不太好分离。随着GUI程序越来越复杂，我也确实感觉到有些东西有点杂乱，思路不够清晰，一会这里数据变动了，视图层忘记跟着变动，一会儿那边数据变动了，信号又忘记发送了。

目前我的处理方式，程序常量汇入全局变量池，除了本面板或者控件内自身的GUI要素，其他都汇入全局变量池，这给实际操作带来了很大的便利。然后全局变量池中某些变量进行了特殊的处理，由这种特殊的处理建立起了模型层。

在模型层中对于目标变量，只要发生了变化，就将发送一个对应的信号。

视图层对应监听目标信号，从而实时变动界面来体现数据的变化。

GUI层自身还有一些事件处理。

控制层还可能有其他的处理逻辑和模型层进行交互。

其实上面提到的这些都是正确的，关键在于都混在一起就有点杂乱了，再加上GUI自身的事件信号，让程序员思维有点混乱。

我试着进行如下约定，然后再试着重构整理下代码试试看。

![img](C:/Users/a3580/Desktop/wxpython/{static}/images/wxpython/MVC.png)

#### 常量，模型层变量，全局变量分离

程序涉及到的常量，模型层变量，全局变量分离，早期觉得都汇入全局变量挺方便的，但随着全局变量规模变得庞大，需要分离来减轻程序员头脑负担。

#### 模型层和视图层分离

1. 模型层里面不应该有视图层的东西，也就是面板之类的。
2. 视图层里面不应该有模型层的东西，部分全局变量可以进入视图层（但主要要控制好这部分的量），除此之外的变量应该进入模型层。【视图层有时需要使用模型层的数据，推荐通过某个接口统一管理】
3. 模型层不要向视图层发送的消息（name_changing）而只发送（name_changed），控制层直接修改模型层数据。视图层只负责监听 (name_changed) 的消息。控制层只监听(name_changing) 。

#### 模型层信号规范

1. 模型层是数据层，不管是业务逻辑也好还是视图层数据显示也好，只要其是数据依赖的，或者说数据驱动的，那么控制层或视图层就应该监听对应的数据模型。

   监听信号名规范为： 

   1. 变量名_changed  【模型层数据实际发生了变动，changed模式可被控制层或者视图层监听】
   2. 变量名_changing 【视图层数据发生变动，发射changing信号，本信号只被控制层监听，模型层不用管。】（这里再着重讨论下changing信号和changed信号各自的分工，changed信号的信息变动源更多的是外部，造成模型层数据变动，从而本程序内部视图层跟踪进行相应的变动，或者有时一些复杂的逻辑交给控制层中继处理；而changing信号更多的是本程序本地信息变动为驱动源，changing的第一任务是本GUI视图层内部各个不同面板组件之间信息同步，其次才是根据情况控制层决定是否监听从而更改模型层数据。简言之，changing第一任务是视图层内部的不同，changed第一任务是外部引起的数据变动视图层跟踪相应的变化，其次才是视需要控制层监听某些信号来编写更复杂的内部程序逻辑。）
   3. name_changing 和 name_changed 是只有值发生变法才发送消息，但某些情况下需要总是发送消息（可设置always_send选项）
   4. name_appending name_appended 某些情况下列表引入append模式会很方便
   5. name_clearing name_cleared 某些情况下需要数据清空还原默认值操作
   6. 传递过去的value就是当前的数据值，除了append模式只传递附加的部分。

#### 代码重构后感

按照上面的思路，模型层建立了一些通用模型，进行了代码重构，发现MVC架构在项目早期实际上还增加了很多额外的代码量，不过后期应该是会降低代码量的。

然后就是后面写代码的时候不仅要注意前面提及的规则，还需要额外再加上一条：

> 写的代码写完之后最好就可以放在一个地方供使用，然后其他时候就不用阅读了。

这不仅涉及到代码的可复用性，代码的良好设计，上面提及的MVC架构在努力实现模型层视图层的分离时也在努力去追求这一点。



TODO： pypubsub模块需要深入地学习如何debug，如何查看阅读那些信息发送了那些信息到那个函数里面被执行了。



### 三次思考MVC架构【PLUS】

前面二次思考MVC架构的内容基本是正确的，除了changing信号具体实现细节还有一些要补充的：

- 建立视图层变量，具体写法和建立方法类似于模型层变量的做法
- 视图层各个面板绑定好事件，内容发生变更则发送信号进行视图层相关面板数据同步工作。
- 视图层变量更多的和面板操作记录的临时变量相关，对于外部驱动发生的数据更改，之后驱动的方法我们应该优先选择面板的SetValue之类还会继续发送GUI Event的方法，如果没有这样的方法，则需要手工添加，好做到模型层初始化或者有变更则会自动触发视图层的变更。





### 注意事项

目前pypubsub 4.0版本已经确认如果有两个面板同时监听某个topic，那么各个面板对应的函数，参数格式应该一致。比如 

```python
def on_topic_test(self, value)
	pass
```

如果另外一个写为：

```python
def on_topic_test(self, value=None)
	pass
```

则pypubsub会抛异常，但如果两个都写作一样的，无论哪种形式，都没问题。

#### 类变量和实例变量

这个算是python里面的基础知识了，在使用你自己写的可复用面板的时候，千万要记得：

```
class ...
  a = 1 这里的变量每个实例都是相同的
  def __init__()...
    b = 1  这里的变量每个实例都不同
```

也就是你在写一些方法和定义一些特别的本面板上的元素的时候，有些挂在类上问题不大，有些是一定要定义在初始化函数里面的，好让具体多个实例化后的面板有不同的子面板元素，这样行为才不会出错。





## wxpython自定义窗体

本文重点讨论wxpython较为底层的绘图知识和利用这些知识来建立自定义的一些窗体。



### GDI

wxpython底层绘图有个GDI（Graphics Device Interface）的概念，可以理解为通用绘图接口，利用这个通用绘图接口，一套绘图方法，就可以向显示器，打印机等绘图。这样程序员可以不用考虑硬件底层来进行绘图编程了。

这个GDI具体来说就是一些绘图的类和方法。

### DC

在开始绘图前，你需要创建一个设备上下文DC（device context），这个DC具体来说就是wx.DC类。实际使用中不应该使用wx.DC类，而应该选择更具体的设备向的DC子类。这些子类具体分为三类：

- 用于绘制到屏幕的上下文
- 用于绘制到另外地方而非屏幕
- 用于缓冲一个设备上下文

#### 用于绘制到屏幕

- wx.ClientDC 
- wx.PaintDC 如果你是在EVT_PAINT事件中，那么你应该使用这个设备上下文，其他时候必须使用wx.ClientDC 。
- wx.WindowDC 如果你不光希望在客户区绘制，窗体的边框，标题栏等你都想绘制，那么就使用这个。
- wx.ScreenDC 如果你希望在整个屏幕上绘制，那么就使用这个。

#### 非屏幕设备上下文

- wx.MemoryDC 用于内存中的位图bitmap上绘制
- wx.MetafileDC 这个只在windows下有效，将绘制并写入到文件中
- wx.PostScriptDC 这个是跨平台的，将写入eps文件中
- wx.PrinterDC 这个只在windows下有效，将写入打印机中

#### 缓冲设备上下文

- wx.BufferedDC 
- wx.BufferedPaintDC 缓冲一个设备上下文，当你做几个重绘的时候，防止屏幕闪烁，缓冲是个选择。复杂的绘制防止屏幕闪烁，推荐使用 `dc = wx.BufferedPaintDC(self)`





### 带颜色的线条

wxpython里的StaticLine是不可以定制颜色的，请看下面这个类实现了一个可以定义颜色的线条功能。这个例子基本演示了如何自定义窗体，具体就是在OnPaint上画上窗体图形，然后Bind好你想要的事件和动作。

绘图变得也来越复杂和更多的定制需求，你的窗体可能需要加入更多的方法来支持这些特性。

```python
import wx


class ColorStaticLine(wx.Panel):
    """
    带颜色的线段
    """
    def __init__(self, parent, color='black', mode='hline', **kwargs):
        super(ColorStaticLine, self).__init__(parent=parent, **kwargs)
        self.parent = parent

        self.color = color
        self.mode = mode

        self.Bind(wx.EVT_PAINT, self.OnPaint)

    def OnPaint(self, event):
        dc = wx.PaintDC(self)

        width, height = self.GetClientSize()

        dc.SetPen(wx.Pen(wx.Colour(self.color)))

        if self.mode == 'hline':
            dc.DrawLine(0, 0, width, 0)
        elif self.mode == 'vline':
            dc.DrawLine(0, 0, 0, height)

```



虽然这是一个很简单的例子，但我们可以学到很多东西：

- 定义重画事件，然后使用 wx.PaintDC 。
- 具体绘画区域x,y的计算是重新开始的，即 (0,0)
- 具体本面板的绘画区域可以由 self.GetClientSize() 方法获得。
- 通过 dc.SetPen 来设置画笔，这是可以设置颜色，然后dc.DrawLine画一条直线，这就是整个绘画过程了。



这样我们就定义了一个自己个性化的可复用小面板组件了。



TODO ： 一个问题，为什么这里要继承自 wx.Panel 才行，这其中的道理暂时还没想明白。

### 基本形状绘制

#### 带颜色的方块

```
dc.SetBrush(wx.Brush('#1ac500'))
dc.DrawRectangle(130, 15, 90, 60)
```

设置画刷，然后画一个矩形。

#### 绘制圆弧

```
DrawArc(x1, y1, x2, y2, xc, yc)
```

绘制一个圆弧，起点 x1 y1 终点 x2 y2 中心点 xc yc 弧线逆时针绘制，如果设置了画刷，而会填充圆弧区域。

#### 画一个圆

```
DrawCircle(x, y, radius)
```

以x y 为中心， radius为半径，画一个圆。

#### 画一直线

```
DrawLine(x1, y1, x2, y2)
```

起点 x1 y1 终点 x2 y2 画一直线

#### 画多边形

```
DrawPolygon(points)
```

定义一系列的点，画一多边形，起点和终点自动相连

#### 画圆角矩形

```
DrawRoundedRectangle(x, y, width, height, radius)
```

radius控制曲率



#### 绘制文本

```
DrawText(text, x, y)
```



绘制文本之前你可以通过：

- `SetTextForeground` 来设置字体颜色 此外还有 `GetTextForeground`
- `dc.SetBackgroundMode(wx.SOLID)`  默认 `wx.SOLID` 文本有背景颜色，或者设置 `wx.TRANSPARENT` ，文本无背景颜色。
- `dc.SetTextBackground` 设置文本背景颜色
- `dc.SetFont` 设置字体



#### 绘制图片

```
DrawBitmap
DrawIcon

```

### 设置画笔

上面提到的一些基本形状的绘制，填充区域由画刷控制，而那些形状的线条颜色，则是由画笔控制的。

```
SetPen

```

```
wx.Pen(wx.Colour, width=1, style=wx.PENSTYLE_SOLID)

```

#### 画笔的样式

- wx.PENSTYLE_SOLID 默认的实线就是这个
- wx.PENSTYLE_DOT 小点
- wx.PENSTYLE_LONG_DASH 虚线
- wx.PENSTYLE_SHORT_DASH 短虚线
- wx.PENSTYLE_DOT_DASH 点划线
- wx.PENSTYLE_TRANSPARENT 没有笔线
- wx.PENSTYLE_STIPPLE 使用提供的位图作为笔触
- wx.PENSTYLE_BDIAGONAL_HATCH 反斜线
- wx.PENSTYLE_CROSSDIAG_HATCH  XXX 线
- wx.PENSTYLE_FDIAGONAL_HATCH 正斜线
- wx.PENSTYLE_CROSS_HATCH +++ 线
- wx.PENSTYLE_HORIZONTAL_HATCH 水平线
- wx.PENSTYLE_VERTICAL_HATCH 垂直线

### 设置画刷

```
SetBrush()

```

```
wx.Brush(colour, style=wx.SOLID)

```

#### 画刷的样式

画刷的样式下面列举如下：

- wx.BRUSHSTYLE_SOLID 默认实心填充
- wx.BRUSHSTYLE_TRANSPARENT 透明，也就是没有填充
- wx.BRUSHSTYLE_STIPPLE_MASK_OPAQUE 用位图做笔触，the mask is used for blitting monochrome using text foreground and background colors.
- wx.BRUSHSTYLE_STIPPLE_MASK 用位图做笔触， mask is used for masking areas in the stipple bitmap.
- wx.BRUSHSTYLE_STIPPLE 用位图做笔触
- wx.BRUSHSTYLE_BDIAGONAL_HATCH 反斜线
- wx.BRUSHSTYLE_CROSSDIAG_HATCH XXX 线
- wx.BRUSHSTYLE_FDIAGONAL_HATCH 正斜线
- wx.BRUSHSTYLE_CROSS_HATCH +++ 线
- wx.BRUSHSTYLE_HORIZONTAL_HATCH 水平线
- wx.BRUSHSTYLE_VERTICAL_HATCH 垂直线

#### 自定义画刷图案

```
brush1 = wx.Brush(wx.Bitmap('pattern1.png'))
dc.SetBrush(brush1)
dc.DrawRectangle(10, 15, 90, 60)

```

画刷可以指定某个图片来作为其刷出来的图案。

### 获取绘图区域尺寸

```
width, height = self.GetClientSize()

```

### 获取某个窗体的尺寸

wxpython内的窗体（继承自Window）都有 GetSize 这个方法，这样你可以得到某个窗体的尺寸：

```
width, height = self.GetSize()

```



### 获取文本的宽度和高度

```
w, h = self.GetTextExtent(line)

```

如果是空行的话可以写为：

```
w, h = self.GetTextExtent('M')

```

### 居中的定义

获取绘图区域的width，然后计算好你想要居中的对象的width（w），然后居中绘制起点x是：

```
start_x = (width - w)/2

```



### 居右的定义

获取绘图区域的width，然后计算好你想要居右的对象的window（w）,然后居右的绘制起点x是：

```
start_x = width -w

```

### dc.Clear

TODO 我对这个理解还不是很深，只知道这个可以用来清空背景画刷。

```python
brush = wx.Brush("white")  
dc.SetBackground(brush)  
dc.Clear() 

```

### style管理

一般常数状态不用多说，下面说下wxpython的style是如何管理的，其首先定义一些常数，比如说

A = 0b1

B = 0b10

C = 0b100

然后假如说你定义了一个状态：style = A | B ， 则执行逻辑或操作即可。加入你想要测试style是否包含B态则 `style & B` 即可。由于每个style态只占一个二进制位，则其和目标style进行逻辑与操作，包含就返回非0值，返回0值则说明不包含目标style态。





### 只有一个程序实例在运行

利用 `wx.SingleInstanceChecker` 很方便就可以做到这点，更多信息请参看文档的 [这里](https://wxpython.org/Phoenix/docs/html/wx.SingleInstanceChecker.html) 。下面的做法是确保了操作系统某个用户只有一个程序实例在运行。

```python
import wx

class SingleAppFrame(wx.Frame):
    def __init__(self, parent, title):
        wx.Frame.__init__(self, parent, title=title, size=(300, 300))
        self.Centre()


class SingleApp(wx.App):
    def OnInit(self):
        self.name = "SingleApp-%s" % wx.GetUserId()
        self.instance = wx.SingleInstanceChecker(self.name)
        if self.instance.IsAnotherRunning():
            wx.MessageBox("Another instance is running", "ERROR")
            return False
        frame = SingleAppFrame(None, "SingleApp")
        frame.Show()
        return True
    

app = SingleApp(redirect=False)
app.MainLoop()
```



### 欢迎页面

利用wx.adv.SplashScreen 就可以很方便地制作出一个欢迎页面，读者还可以看一下demo各个案例中提到的 `wx.lib.agw.advancedsplash as AS`  ，和 SplashScreen 类比起来又多了一些可定制的选项。



```python
    from gui.mainFrame import ChaoShengHuo

    class ChaoShengHuoApp(wx.App):
        img_base = g_var.img_base

        def OnInit(self):
            self.name = "SingleApp-%s" % wx.GetUserId()
            self.instance = wx.SingleInstanceChecker(self.name)

            if self.instance.IsAnotherRunning():
                wx.MessageBox("已经有一个潮生活发票助手程序在运行了！", "Do not Panic")
                return False
            else:
                # 欢迎页面
                bitmap = wx.Bitmap(self.img_base + 'welcome.png', wx.BITMAP_TYPE_PNG)

                wx.adv.SplashScreen(bitmap, wx.adv.SPLASH_CENTRE_ON_SCREEN | wx.adv.SPLASH_TIMEOUT,
                                    3000, None, -1, wx.DefaultPosition, wx.DefaultSize,
                                    wx.BORDER_SIMPLE | wx.STAY_ON_TOP)
                wx.Yield()

                the_frame = ChaoShengHuo(None, -1)
                the_frame.Show(True)
                return True

```

### 程序最小化到托盘

主界面那边关闭事件是：

```
    def MinimizeWindow(self, event):
        self.Iconize(True)

    def CloseWindow(self, event):
        self.Hide()
        event.Skip()
```

```python
import wx
import wx.adv

class TaskBarIcon(wx.adv.TaskBarIcon):
    ID_About = wx.NewId()
    ID_Minshow = wx.NewId()
    ID_Maxshow = wx.NewId()
    ID_Closeshow = wx.NewId()

    def __init__(self, frame):
        wx.adv.TaskBarIcon.__init__(self)
        self.frame = frame
        self.SetIcon(wx.Icon(name='favicon.ico', type=wx.BITMAP_TYPE_ICO), '潮生活发票助手')
        self.Bind(wx.adv.EVT_TASKBAR_LEFT_DCLICK, self.OnTaskBarLeftDClick)  # 定义左键双击
        self.Bind(wx.EVT_MENU, self.OnAbout, id=self.ID_About)
        self.Bind(wx.EVT_MENU, self.OnMinshow, id=self.ID_Minshow)
        self.Bind(wx.EVT_MENU, self.OnMaxshow, id=self.ID_Maxshow)
        self.Bind(wx.EVT_MENU, self.OnCloseshow, id=self.ID_Closeshow)

    def OnTaskBarLeftDClick(self, event):
        if self.frame.IsIconized():
            self.frame.Iconize(False)
        if not self.frame.IsShown():
            self.frame.Show(True)
        self.frame.Raise()

    def OnAbout(self, event):
        wx.MessageBox('潮生活发票助手V3.0', '关于')

    def OnMinshow(self, event):
        self.frame.Iconize(True)

    def OnMaxshow(self, event):
        if self.frame.IsIconized():
            self.frame.Iconize(False)
        if not self.frame.IsShown():
            self.frame.Show(True)
        self.frame.Raise()

    def OnCloseshow(self, event):
        self.RemoveIcon()
        self.Destroy()
        self.frame.Destroy()


    def CreatePopupMenu(self):
        menu = wx.Menu()
        menu.Append(self.ID_Minshow, '最小化')
        menu.Append(self.ID_Maxshow, '最大化')
        menu.Append(self.ID_About, '关于')
        menu.Append(self.ID_Closeshow, '退出')
        return menu
```



### 图片重画

一个抹去事件被发送，当窗体背景需要重画的时候。
An erase event is sent when a window’s background needs to be repainted.

```
dc = event.GetDC()
```

```
wx.ClientDC：用于在一个窗口对象上绘画。当你想在窗口部件的主区域上（不包括
边框或别的装饰）绘画时使用它。主区域有时也称为客户区。wx.ClientDC类也应临
时创建。该类仅适用于wx.PaintEvent的处理之外。
```



[参考网页](https://blog.csdn.net/cassiepython/article/details/43103143)

```
import wx
 
class Frame(wx.Frame):
    def __init__(self):
        wx.Frame.__init__(self,None,-1,"My Frame",size=(400,300),
                          style = wx.DEFAULT_FRAME_STYLE)
        self.panel = wx.Panel(self)
        self.panel.Bind(wx.EVT_ERASE_BACKGROUND,self.OnEraseBack)
    def OnEraseBack(self,event):
        dc = event.GetDC()
        if not dc:
            dc = wx.ClientDC(self)
            rect = self.GetUpdateRegion().GetBox()
            dc.SetClippingRect(rect)
        dc.Clear()
        bmp = wx.Bitmap("background.jpg")
        dc.DrawBitmap(bmp, 0, 0)
if __name__ == '__main__':
    app = wx.App()
    frame = Frame()
    frame.Show()
    app.MainLoop()

```





### 让窗体可以拖动

你想要的那部分窗体可以拖动，就将事件绑定一下，但拖动事件实际执行方法应该在主窗体上，然后主窗体应该也进行一次绑定。具体原因还不是很明白。

```python
        self.Bind(wx.EVT_LEFT_DOWN, self.OnLeftDown)  # 左键点击按下
        self.Bind(wx.EVT_LEFT_UP, self.OnLeftUp)  # 左键释放
        self.Bind(wx.EVT_MOTION, self.OnMouseMove)  # 鼠标移动

    # 拖动相关
    def OnLeftDown(self, event):
        logger.debug(f'GUI事件: {event} - OnLeftDown')
        self.CaptureMouse()  # 捕获鼠标
        pos = self.ClientToScreen(event.GetPosition())
        origin = self.GetPosition()
        self.delta = wx.Point(pos.x - origin.x, pos.y - origin.y)

    def OnLeftUp(self, event):
        logger.debug(f'GUI事件: {event} - OnLeftUp')
        if self.HasCapture():
            self.ReleaseMouse()  # 释放鼠标

    def OnMouseMove(self, event):
        logger.debug(f'GUI事件: {event} - OnMouseMove')

        if event.Dragging() and event.LeftIsDown():
            pos = self.ClientToScreen(event.GetPosition())
            newPos = (pos.x - self.delta.x, pos.y - self.delta.y)
            self.Move(newPos)
```





### 扩充你的颜色定义

wxpython有自己内部一套颜色定义库，然后你还可以利用进一步扩充自己的颜色定义库：

aquamarine：海蓝色 
black：黑色 
blue：蓝色 
brown：褐色 
coral：珊瑚色 
cyan：青色 
firebrick：火砖色 
gold：金色 
gray：灰色 
green：绿色 
khaki：土黄色 
magenta：绛红色 
maroon：栗色 
navy：藏青色
orange：橙色 
orchid：淡紫色 
pink：粉红色 
plum：梅红色 
purple：紫色 
red：红色
salmon：鲜肉色 
sienna：红褐色
tan：浅棕色
thistle：蓟色 
turquoise：青绿色 
violet：紫罗兰色 
wheat：浅黄色 
white：白色 
yellow：黄色 

更多颜色请参看 demo 那边的 ColourDB 。

你需要在你的app `OnInit` 的时候加载你自己定义的颜色，请看官方代码的这个片段，这样你就知道自己该怎么做了：

```python
def updateColourDB():
    """
    Updates the :class:`wx.ColourDatabase` by adding new colour names and RGB values.
    """

    global _haveUpdated
    if not _haveUpdated:
        import wx
        assert wx.GetApp() is not None, "You must have a wx.App object before you can use the colour database."
        cl = getColourInfoList()

        for info in cl:
            name, colour = info[0], wx.Colour(*info[1:])
            wx.TheColourDatabase.AddColour(name, colour)

        _haveUpdated = True

```





## wxpython项目骨架

笔者钻研wxpython桌面编程有一段时间了，一些样例请参见 [这个项目](https://github.com/a358003542/wxpython_examples) 。

然后多查看wxpython的demo程序还有API文档。

剩下来的就是具体编程需求，思考如何界面设计等等问题。

不过在开始编写项目之前，wxpython还是有一个通用的骨架可以参考的，这和后面的实际编程需求或者说业务并不是很相关。

具体读者可以参考 [这个项目](https://github.com/a358003542/image_process_tool) 的前面几个commit。下面简要说明下。

### 图片文件管理

 图片文件都应该放在一个文件夹里面，然后编写 [encode_bitmaps.py](https://github.com/a358003542/image_process_tool/blob/master/encode_bitmaps.py) 文件，然后你的项目里面通过

```python
import images
images.Favicon
```

来获取图片对象。

### 程序主入口

你应该编写一个程序主入口文件， [image_process_tool.py](https://github.com/a358003542/image_process_tool/blob/master/image_process_tool.py) ，这对于你平时测试运行是方便的，对于你后面利用 pyinstaller 来编译exe文件，也是需要这样一个脚本文件入口的。

### 编写pyinstaller的spec文件

从个人实践经验来看，推荐你还是手工编写pyinstaller的spec文件。

### 编写一个全局变量文件

某些参数和全局变量是推荐编写一个 [global_var.py](https://github.com/a358003542/image_process_tool/blob/master/global_var.py) 文件，同样后面在程序中可以直接

```
import global_var as g_var
```

来调用，很多情况下这是很方便的。

### MVC分离架构

实际源码中分为 `gui`表示视图层， `models` 表示模型层， `controllers` 表示控制层，在一些非常小的图形界面中，可能控制层和模型层并没有代码，但这种MVC分离架构还是推荐保留着。

### 常数配置统一管理

桌面GUI程序，哪怕是很小型的桌面GUI程序都可能遇到很多const常数，推荐统一管理。

### 自定义颜色

请参看 [app.py](https://github.com/a358003542/image_process_tool/blob/master/src/gui/app.py) 的 `update_self_defined_color` 操作，建立自己的颜色定义库来规范化你的程序代码。

### 应用程序启动唯一性

在某些个别的情况下可能会允许桌面程序多开，但绝大部分情况应该都是要求一个应用程序一个界面，而且需要应用程序有这样的反应，那就是点击应用程序图标，会自动弹出来之前你创建的那个应用程序实例。

请参看  [app.py](https://github.com/a358003542/image_process_tool/blob/master/src/gui/app.py)  的解决方案。

### 异常信息更好的处理

利用pubsub操作来更好的对异常信息进行捕捉，否则随着你的桌面程序代码变得庞大，如果你的异常无法定位了，将会让调试变得非常困难。具体请参看 [exception_utils.py](https://github.com/a358003542/image_process_tool/blob/master/src/exception_utils.py) 文件。



## 参考资料

1. [zetcode 的wxpython教程](http://zetcode.com/wxpython)
2. [wxpython官方参考文档](https://docs.wxpython.org/)
3. wxpython in action , Author by Harri Pasanen and Robin Dunn