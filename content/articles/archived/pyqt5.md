Slug: pyqt5
Date: 20191018


[TOC]



## 安装和配置

就是利用pip3 安装之：

```bash
pip3 install pyqt5
```

以前是需要安装qt5的，不过在windows下经过测试发现已经不需要安装qt5了，所以我估计ubuntu下也已经不需要安装qt5了。

但是还是把下面这个写上吧，如果读者遇到程序提示没找到qt或者什么类似的错误，那么安装qt之：

```bash
sudo apt-get install qt5-default
sudo apt-get install qtbase5-dev
sudo apt-get install qtdeclarative5-dev
```

以前安装SIP挺麻烦的，现在sip也可以直接通过pip安装了，而且之前你安装pyqt5的时候，应该也顺便装上了。然后我发现windows下已经有
 `pyuic5` 和 `pyrcc5` 这两个命令了，应该是通过pip安装的时候就装上了。

 以前在ubuntu下是要安装下面这个东西的，估计现在也不需要了：

```sh
sudo apt-get install pyqt5-dev-tools
```

检查pyqt5安装情况执行以下脚本即可，显示的是当前安装的pyqt5的版本号:

```
>>> from PyQt5.QtCore import QT_VERSION_STR
>>> print(QT_VERSION_STR)
>>> 5.9.2
```

本文的代码都是PyQt版本号都是上面的，没有特别的理由，会一直维持在这个版本号里面了。

## 第一个例子

### 窗口
【beginning-first01】

```python
import sys
from PyQt5.QtGui import *
from PyQt5.QtWidgets import *

class MyWidget(QWidget):
    def __init__(self):
        super().__init__()
        self.setGeometry(0, 0, 800, 600)
        #坐标0 0 大小800 600
        self.setWindowTitle('myapp')

myapp = QApplication(sys.argv)
mywidget = MyWidget()
mywidget.show()
sys.exit(myapp.exec_())
```

首先导入sys宏包，这是为了后面接受sys.argv参数。

接下来我们定义了MyWidget类，它继承自QWidget类。然后通过QWidget类的 `setGeometry` 方法来调整窗口的左顶点的坐标位置和窗口的大小。

然后通过 `setWindowTitle` 方法来设置这个窗口程序的标题，这里就简单设置为"myapp"了。

任何窗口程序都需要创建一个QApplication类的实例，这里是myapp。然后接下来创建QWidget类的实例mywidget，然后通过调用mywidget的方法 `show` 来显示窗体。

最后我们看到系统要退出是调用的myapp实例的 `exec_` 方法。

### 加上图标
【beginning-first02】

```python
import sys
from PyQt5.QtGui import QIcon
from PyQt5.QtWidgets import QWidget, QApplication

class MyWidget(QWidget):
    def __init__(self):
        super().__init__()
        self.resize(800,600)
        self.setWindowTitle('myapp')
        self.setWindowIcon(QIcon\
        ('icons/myapp.ico'))

myapp = QApplication(sys.argv)
mywidget = MyWidget()
mywidget.show()
sys.exit(myapp.exec_())
```

这个程序相对上面的程序就增加了一个 `setWindowIcon` 方法，这个方法调用了 `QtGui.QIcon` 方法，然后后面跟的就是图标的存放路径，使用相对路径。在运行这个例子的时候，请随便弄个图标文件过来。

为了简单起见这个程序就使用了QWidget类的 `resize` 方法来设置窗体的大小。

### 弹出提示信息
【beginning-first03】

```python
import sys
from PyQt5.QtGui import *
from PyQt5.QtWidgets import *

class MyWidget(QWidget):
    def __init__(self):
        super().__init__()
        self.resize(800,600)
        self.setWindowTitle('myapp')
        self.setWindowIcon(QIcon\
        ('icons/myapp.ico'))
        self.setToolTip('看什么看^_^')
        QToolTip.setFont(QFont\
        ('微软雅黑', 12))

myapp = QApplication(sys.argv)
mywidget = MyWidget()
mywidget.show()
sys.exit(myapp.exec_())
```

上面这段代码和前面的代码的不同就在于MyWidget类的初始函数新加入了两条命令。其中 `setToolTip` 方法设置具体显示的弹出的提示文本内容，然后后面调用QToolTip类的 `setFont` 方法来设置字体和字号，我不太清楚这里随便设置系统的字体微软雅黑是不是有效。

这样你的鼠标停放在窗口上一会儿会弹出一小段提示文字。

### 关闭窗体时询问
【beginning-first04】

```python
import sys
from PyQt5.QtGui import *
from PyQt5.QtWidgets import *

class MyWidget(QWidget):
    def __init__(self):
        super().__init__()
        self.resize(800,600)
        self.setWindowTitle('myapp')
        self.setWindowIcon(QIcon\
        ('icons/myapp.ico'))
        self.setToolTip('看什么看^_^')
        QToolTip.setFont(QFont\
        ('微软雅黑', 12))

    def closeEvent(self, event):
        #重新定义colseEvent
        reply = QMessageBox.question\
        (self, '信息',
            "你确定要退出吗？",
             QMessageBox.Yes,
             QMessageBox.No)
        if reply == QMessageBox.Yes:
            event.accept()
        else:
            event.ignore()

myapp = QApplication(sys.argv)
mywidget = MyWidget()
mywidget.show()
sys.exit(myapp.exec_())
```

这段代码和前面代码的不同就是重新定义了 `colseEvent` 事件。这段代码的核心就是QtGui类的QMessageBox类的question方法，这个方法将会弹出一个询问窗体。这个方法接受四个参数：第一个参数是这个窗体所属的母体，这里就是self也就是实例mywidget；第二个参数是弹出窗体的标题；第三个参数是一个标准button；第四个参数也是一个标准button，是默认（也就是按enter直接选定的）的button。然后这个方法返回的是那个被点击了的标准button的标识符，所以后面和标准 `QMessageBox.Yes`
 比较了，然后执行event的accept方法。

### 屏幕居中显示窗体
【beginning-first05】

```python
import sys
from PyQt5.QtGui  import *
from PyQt5.QtWidgets import *

class MyWidget(QWidget):
    def __init__(self):
        super().__init__()
        self.resize(800,600)
        self.center()
        self.setWindowTitle('myapp')
        self.setWindowIcon(QIcon\
        ('icons/myapp.ico'))
        self.setToolTip('看什么看^_^')
        QToolTip.setFont(QFont\
        ('微软雅黑', 12))

    def closeEvent(self, event):
        #重新定义colseEvent
        reply = QMessageBox.question\
        (self, '信息',
            "你确定要退出吗？",
             QMessageBox.Yes,
             QMessageBox.No)
        if reply == QMessageBox.Yes:
            event.accept()
        else:
            event.ignore()
     #center method
    def center(self):
        screen = QDesktopWidget().screenGeometry()
        size =  self.geometry()
        self.move((screen.width()-size.width())/2,\
         (screen.height()-size.height())/2)

myapp = QApplication(sys.argv)
mywidget = MyWidget()
mywidget.show()
sys.exit(myapp.exec_())
```

这个例子和前面相比改动是新建了一个 `center` 方法，接受一个实例，这里是mywidget。然后对这个实例也就是窗口的具体位置做一些调整。

QDesktopWidget类的 `screenGeometry` 方法返回一个量，这个量的width属性就是屏幕的宽度（按照pt像素计，比如1366×768，宽度就是1366），这个量的height属性就是屏幕的高度。

然后QWidget类的 `geometry` 方法同样返回一个量，这个量的width是这个窗体的宽度，这个量的height属性是这个窗体的高度。

然后调用QWidget类的move方法，这里是对mywidget这个实例作用。我们可以看到move方法的X，Y是从屏幕的坐标原点 (0,0) 开始计算的。第一个参数X表示向右移动了多少宽度，Y表示向下移动了多少高度。

整个函数的作用效果就是将这个窗体居中显示。

### QMainWindow类

QtGui.QMainWindow类提供应用程序主窗口，可以创建一个经典的拥有状态栏、工具栏和菜单栏的应用程序骨架。（之前使用的是QWidget类，现在换成QMainWindow类。）

前面第一个例子都是用的QtGui.QWidget类创建的一个窗体。关于QWidget和QMainWindow这两个类的区别 [根据这个网站](http://stackoverflow.com/questions/3298792/whats-the-difference-between-qmainwindow-and-qwidget-and-qdialog) 得出的结论是：QWdget类在Qt中是所有可画类的基础（这里的意思可能是窗体的基础吧。） 任何基于QWidget的类都可以作为独立窗体而显示出来而不需要母体（parent）。

QMainWindow类是针对主窗体一般需求而设计的，它预定义了菜单栏状态栏和其他widget（窗口小部件） 。因为它继承自QWidget，所以前面谈及的一些属性修改都适用于它。那么首先我们将之前的代码中的QWidget类换成QMainWindow类。

【beginning-first06】

```python
import sys
from PyQt5.QtGui  import *
from PyQt5.QtWidgets import *

class MyWidget(QMainWindow):
    def __init__(self):
        super().__init__()
        self.resize(800,600)
        self.center()
        self.setWindowTitle('myapp')
        self.setWindowIcon(QIcon\
        ('icons/myapp.ico'))
        self.setToolTip('看什么看^_^')
        QToolTip.setFont(QFont\
        ('微软雅黑', 12))

    def closeEvent(self, event):
        #重新定义colseEvent
        reply = QMessageBox.question\
        (self, '信息',
            "你确定要退出吗？",
             QMessageBox.Yes,
             QMessageBox.No)
        if reply == QMessageBox.Yes:
            event.accept()
        else:
            event.ignore()
     #center method
    def center(self):
        screen = QDesktopWidget().screenGeometry()
        size =  self.geometry()
        self.move((screen.width()-size.width())/2,\
         (screen.height()-size.height())/2)

myapp = QApplication(sys.argv)
mywidget = MyWidget()
mywidget.show()
sys.exit(myapp.exec_())
```

现在程序运行情况良好，我们继续加点东西进去。

### 加上状态栏
【beginning-first07】

```python
import sys
from PyQt5.QtGui  import *
from PyQt5.QtWidgets import *

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.resize(800,600)
        self.center()
        self.setWindowTitle('myapp')
        self.setWindowIcon(QIcon\
        ('icons/myapp.ico'))
        self.setToolTip('看什么看^_^')
        QToolTip.setFont(QFont\
        ('微软雅黑', 12))

    def closeEvent(self, event):
        #重新定义colseEvent
        reply = QMessageBox.question\
        (self, '信息',
            "你确定要退出吗？",
             QMessageBox.Yes,
             QMessageBox.No)
        if reply == QMessageBox.Yes:
            event.accept()
        else:
            event.ignore()
     #center method
    def center(self):
        screen = QDesktopWidget().screenGeometry()
        size =  self.geometry()
        self.move((screen.width()-size.width())/2,\
         (screen.height()-size.height())/2)

myapp = QApplication(sys.argv)
mainwindow = MainWindow()
mainwindow.show()
mainwindow.statusBar().showMessage('程序已就绪...')
sys.exit(myapp.exec_())
```

这个程序和前面的区别在于最后倒数第二行，调用mainwindow这个QMainWindow类生成的实例的 `statusBar` 方法生成一个QStatusBar对象，然后调用QStatusBar类的 `showMessage` 方法来显示一段文字。

如果你希望这段代码在 `__init__` 方法里面，那么具体实现过程也与上面描述的类似。

### 加上菜单栏
【beginning-first08】

```python
import sys

from PyQt5.QtGui  import *
from PyQt5.QtWidgets import *

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.initUI()

    def initUI(self):
        self.resize(800,600)
        self.center()
        self.setWindowTitle('myapp')
        self.setWindowIcon(QIcon\
        ('icons/myapp.ico'))
    #菜单栏
        menu_control = self.menuBar().addMenu('Contorl')
        act_quit = menu_control.addAction('quit')
        act_quit.triggered.connect(self.close)

        menu_help = self.menuBar().addMenu('Help')
        act_about = menu_help.addAction('about...')
        act_about.triggered.connect(self.about)
        act_aboutqt = menu_help.addAction('aboutqt')
        act_aboutqt.triggered.connect(self.aboutqt)


    #状态栏
        self.statusBar().showMessage('程序已就绪...')
        self.show()

    def about(self):
        QMessageBox.about(self,"about this software","wise system")
    def aboutqt(self):
        QMessageBox.aboutQt(self)

    def closeEvent(self, event):
        #重新定义colseEvent
        reply = QMessageBox.question\
        (self, '信息',
            "你确定要退出吗？",
             QMessageBox.Yes,
             QMessageBox.No)
        if reply == QMessageBox.Yes:
            event.accept()
        else:
            event.ignore()
     #center method
    def center(self):
        screen = QDesktopWidget().screenGeometry()
        size =  self.geometry()
        self.move((screen.width()-size.width())/2,\
         (screen.height()-size.height())/2)

myapp = QApplication(sys.argv)
mainwindow = MainWindow()
sys.exit(myapp.exec_())
```

和上面讨论加上状态栏类似，这里用QMainWindow类的 `menuBar` 方法来获得一个菜单栏对象。然后用这个菜单栏对象的 `addMenu` 方法来创建一个新的菜单对象（QMenu类），addMenu方法里面的内容是新建菜单要显示的文本。

然后继续给之前的菜单对象加上动作，调用菜单对象的 `addAction` 方法，我们看到menuBar创建了一个菜单栏对象，然后使用addMenu方法创建了一个菜单，同时返回的是一个菜单对象，然后对这个菜单对象使用addAction方法，这个方法给菜单添加了一个动作，或者说一个item一个内容，然后addAction返回的是一个动作对象，然后对这个动作对象进行信号－槽机制连接，将其和一个函数连接起来了。

在这里这个动作对象，就是菜单的下拉选项，如果我们用鼠标点击一下的话，将会触发 `triggered` 信号，如果我们connect方法连接到某个槽上（或者某个你定义的函数），那么将会触发这个函数的执行。下面就信号－槽机制详细说明之。

### 信号－槽机制

GUI程序一般都引入一种事件和信号机制，well，简单来说就是一个循环程序，这个循环程序等到某个时刻程序会自动做某些事情比如刷新程序界面啊，或者扫描键盘鼠标之类的，等用户点击鼠标或者按了键盘之后，它会接受这个信号然后做出相应的反应。

所以你一定猜到了， `close` 函数可能就是要退出这个循环程序。我们调用主程序的 `exec_` 方法，就是开启这个循环程序。

pyqt4的旧的信号－槽连接语句我在这里忽略了，在这里值得提醒的是pyqt5已经不支持旧的信号－槽连接语句了。下面就新的语句说明之。

```python
act_exit.triggered.connect(self.close)
```

我们看到新的信号－槽机制语句变得更精简更易懂了。整个过程就是如我前面所述，某个对象发出了某个信号，然后用connect将这个信号和某个槽（或者你定义的某个函数）连接起来即形成了一个反射弧了。

这里的槽就是self主窗口实例的close方法，这个是主窗口自带的函数。

然后我们看到aboutqt和about函数。具体读者如果不懂请翻阅QMessageBox类的静态方法 `about` 和 `aboutqt` 。



## 信号－槽详解

考虑到pyqt5只支持新式信号－槽机制了，这里将新式信号－槽机制详细说明。

信号(singal)可以连接无数多个槽(slot)，或者没有连接槽也没有问题，信号也可以连接其他的信号。正如前面所述，连接的基本语句形式如下： `who.singal.connect(slot)` 。比如说按钮最常见的内置信号 `triggered` ，而槽实际上就是某个函数，比如主窗体的 `self.close` 方法。

信号就是 `QObject` 的一个属性，pyqt的窗体有很多内置信号，你也可以定义自己的信号，这个后面再提及。信号还没和槽连接起来就只是一个属性，只有通过 `connect` 方法连接起来，信号－槽机制就建立起来了。类似的信号还有 `disconnect` 方法和 `emit` 方法。disconnect就是断开信号－槽机制，而emit就是激活那个信号。

pyqt很多内置信号和内置槽将GUI的事件驱动细节给隐藏了，如果你自己定义自己的信号或者槽可能对who.singal.connect(slot)这样简洁的形式如何完成工作的感到困惑。这里先简要地介绍一下。

信号都是类的一个属性，新的信号必须继承自QObject，然后由 `PyQt5.QtCore.pyqtSingal` 方法创建，这个方法接受的参数中最重要的是types类型，比如int，bool之类的，你可以认为这是信号传递的参数类型，但实际传递这些参数值的是emit方法。然后槽实际上就是经过特殊封装的函数，这些函数当然需要接受一些参数或者不接受参数，而这些参数具体的值传进来的是由emit方法执行的，然后我们通过who.singal.connect(slot)这样的形式将某个信号和某个槽连接起来，who的信号，然后信号类自带的连接方法，然后连接到slot某个函数上，在这里隐藏的一个重要细节就是emit方法，比如说你定义一个新的信号，需要将点击屏幕的具体x,y坐标发送出去，内置的信号－槽将这一机制都完成了，如果你自己定义的信号和槽的话，比如 `pyqtSingal(int,int)` ，发送给func(x,y)，具体x和y的值你需要通过emit(x,y)来发送。至于什么时候发送，已经发送的x,y值的获取，这应该又是另外一个信号－槽机制的细节。

请看下面这个例子：
【singal-slot/age】

```python
import sys
from PyQt5.QtWidgets import QHBoxLayout,QSlider,QSpinBox,QApplication,QWidget
from PyQt5.QtCore import Qt

app = QApplication(sys.argv)
window = QWidget()
window.setWindowTitle("enter your age")
spinBox = QSpinBox()
slider = QSlider(Qt.Horizontal)
spinBox.setRange(0,130)
slider.setRange(0,130)

spinBox.valueChanged.connect(slider.setValue)
slider.valueChanged.connect(spinBox.setValue)

spinBox.setValue(35)

layout = QHBoxLayout()
layout.addWidget(spinBox)
layout.addWidget(slider)


window.setLayout(layout)
window.show()

sys.exit(app.exec_())

```

第16行将spinBox的 `valueChanged` 信号和slider的 `setValue` 槽连接起来了，其中QSpinBox内置的 `valueChanged` 信号发射自带的一个参数就是改变后的值，这个值传递给了QSlider的内置槽 `setValue` ，从而将slider的值设置为新值。第17行如果slider的值发生了改变，那么会发送valueChanged信号，然后又传递给了spinBox，并执行了内置槽setValue，由于此时的值即为原值，这样spinBox内的值就没有发生改变了，如此程序不会陷入死循环。

### 自定义信号

正如前所述及自定义信号由 `PyQt5.QtCore.pyqtSingal` 方法创建，具体格式如下：

```python
from PyQt5.QtCore import QObject, pyqtSignal

class Foo(QObject):
closed = pyqtSignal()
range_changed = pyqtSignal(int, int, name='rangeChanged')
```

上面Foo类里面自定义了一个新的信号，它必须是GObject的子类。然后定义了一个closed信号，没有接受任何参数。下面是range\_changed信号，接受了一个int和一个int类型，然后这个信号的名字是rangeChanged，name选项是一个可选项，如果不填那么信号的名字就是range\_changed。

信号还可以overload，不过似乎不太适合python。

注意信号必须定义为类的属性，同时必须是GObject的子类。

### 自定义槽

按照python格式自己定义的函数就是所谓的自定义槽了。不过推荐用pyqt的槽装饰器来定义槽。

```python
from PyQt4.QtCore import pyqtSlot
#1
@pyqtSlot()
def foo(self):
pass
#2
@pyqtSlot(int, str)
def foo(self, arg1, arg2):
pass
#3
@pyqtSlot(int, name='bar')
def foo(self, arg1):
pass
#4
@pyqtSlot(int, result=int)
def foo(self, arg1):
pass
#5
@pyqtSlot(int, QObject)
def foo(self, arg1):
pass
```

上面的第一个例子定义了名叫foo的一个槽，然后不接受任何参数。第二个槽接受一个int类型的值和str类型的值。第三个槽名字叫做bar，接受一个int类型的值，第四个槽接受一个int类型的值，然后返回的是一个int类型的值，第五个操作接受一个int类型的值和一个GObject类型的值，此处应该暗指其他pyqt窗体类型都可以作为参数进行传递。

```python
@pyqtSlot(int)
@pyqtSlot('QString')
def valueChanged(self, value):
pass
```

这里定义了两个槽，名字都叫做valueChanged，一个接受int类型，一个接受QString类型，同前面信号的overload一样，在python中不推荐这么使用，还是明晰一点比较好。

### 发射信号

信号对象有emit方法用来发射信号，然后信号对象还有disconnect方法断开某个信号和槽的连接。

一个信号可以连接多个槽，多个信号可以连接同一个槽，一个信号可以与另外一个信号相连接。

下面通过一个例子详解自建信号还有自建槽并建立发射机制的情况。
【singal-slot/FindDialog】

```python
from PyQt5.QtWidgets import QDialog,QLabel,QLineEdit,QCheckBox,QPushButton,QHBoxLayout,QVBoxLayout,QApplication
from PyQt5.QtCore import  Qt ,pyqtSignal,QObject,pyqtSlot


class FindDialog(QDialog):
    findNext = pyqtSignal(str,Qt.CaseSensitivity)
    findPrevious = pyqtSignal(str,Qt.CaseSensitivity)

    def __init__(self,parent=None):
        super().__init__(parent)
        label = QLabel(self.tr("Find &what:"))
        self.lineEdit = QLineEdit()
        label.setBuddy(self.lineEdit)

        self.caseCheckBox=QCheckBox(self.tr("Match &case"))
        self.backwardCheckBox=QCheckBox(self.tr("Search &backward"))
        self.findButton = QPushButton(self.tr("&Find"))
        self.findButton.setDefault(True)
        self.findButton.setEnabled(False)
        closeButton=QPushButton(self.tr("Close"))

        self.lineEdit.textChanged.connect(self.enableFindButton)
        self.findButton.clicked.connect(self.findClicked)
        closeButton.clicked.connect(self.close)

        topLeftLayout=QHBoxLayout()
        topLeftLayout.addWidget(label)
        topLeftLayout.addWidget(self.lineEdit)
        leftLayout=QVBoxLayout()
        leftLayout.addLayout(topLeftLayout)
        leftLayout.addWidget(self.caseCheckBox)
        leftLayout.addWidget(self.backwardCheckBox)
        rightLayout = QVBoxLayout()
        rightLayout.addWidget(self.findButton)
        rightLayout.addWidget(closeButton)
        rightLayout.addStretch()
        mainLayout=QHBoxLayout()
        mainLayout.addLayout(leftLayout)
        mainLayout.addLayout(rightLayout)
        self.setLayout(mainLayout)

        self.setWindowTitle(self.tr("Find"))
        self.setFixedHeight(self.sizeHint().height())


    def enableFindButton(self,text):
        self.findButton.setEnabled(bool(text))
    @pyqtSlot()
    def findClicked(self):
        text = self.lineEdit.text()
        if self.caseCheckBox.isChecked():
            cs=Qt.CaseSensitive
        else:
            cs=Qt.CaseInsensitive

        if self.backwardCheckBox.isChecked():
            self.findPrevious.emit(text,cs)
        else:
            self.findNext.emit(text,cs)



if __name__ == '__main__':
    import sys
    app=QApplication(sys.argv)
    findDialog = FindDialog()
    def find(text,cs):
        print('find:',text,'cs',cs)
    def findp(text,cs):
        print('findp:',text,'cs',cs)

    findDialog.findNext.connect(find)
    findDialog.findPrevious.connect(findp)
    findDialog.show()
    sys.exit(app.exec_())

```

首先自建的信号必须是类的属性，然后这个类必须是QObject的子类，这里QDialog是继承自QObject的。请看到第9行和第10行，通过pyqtSignal函数来自建信号，此信号有两个参数，一个是str字符变量，一个是Qt.CaseSensitivity的枚举值。假设我们输入一些文字了，然后点击Find按钮，请看到第26行，点击之后将执行findClicked槽，按钮的clicked信号是不带参数的。所以后面定义的findClicked槽（简单的函数也可以）也没有任何参数。

findClicked槽的53-57行确定了当前的QLineEdit的text值和cs也就是大小写是否检查的状态。然后根据向前或者向后是否勾选来确定接下来要发送的信号。比如findNext信号调用emit方法，对应两个参数也传递过去了。而这个findNext正是我们前面自定义的信号，正是对应的两个参数类型。

我们再看到这里简单做了一个测试程序，70-73行定义了两个简单的函数，然后75，76行将findDialog的这两个信号和上面两个函数连接起来。于是当我们点击Find按钮，首先执行findClicked槽，然后假设这里发送了findNext信号（附带两个参数），然后信号又和find函数相连（参数传递给了find函数），然后执行find函数。整个过程就是这样的。

### 信号－槽机制的反思

在接下来Qt designer这一章也会详细讨论这个问题，我们使用Qt designer来设计和修改ui文件——对应程序中大部分的静态视图元素，主要的目的倒不是为了快速GUI程序编写，其实写代码也挺快的，主要的目的就是为了代码复用。当我们养成习惯，强迫自己程序中的静态视图元素都进入ui文件，这不仅增强了ui文件的复用性，而且也增强了剩下来的python代码的复用性。这其中很大一部分就是这里讨论的信号－槽机制的功劳。

当我们自定义的类加载好ui文件之后，该类里面的代码实际上就剩下两个工作：

1. 把本窗体的信号和槽都编写好
2. 把母窗体和子窗体和信号－槽接口写好。

一般程序的用户互动接口大多在最顶层，也就是用户一般喜欢在菜单栏找到所有可能对程序的控制，这些控制的实现函数如果放在都放在母窗体，那么整个程序的代码复用性会降到最低，而如果我们将这些实现函数分别移到和其视图窗体最紧密的窗体类中，那么不仅代码复用性会大大提高，而且这些槽或函数的编写也会简单很多。那么我们该如何组织这些信号和槽（实现函数）呢？我在这里提出组织学上的一些抽象原则：

1. 最小组织原则，凡是小组织能够自我实现的功能绝不上传到更大一级的组织中去。
2. 大组织对小组织元素的某些实现的引用，采用明文引用原则。比如说母窗体中有一个小窗体有一个编辑器，母窗体想要操控这个编辑器执行剪切操作，那么采用明文引用，也就是self.textEdit.cut。
3. 小组织对大组织属性的引用采用信号激活原则，比如说某个编辑器发生了内容修改，你可以自定义一个信号，该信号为标题修改信号，然后信号触发母窗体的某个方法，这样达到修改母窗体的标题的目的。而在母窗体中，只需要在声明是将小组织的信号和大组织的某个方法连接起来即可。



### 引用信号发射对象

`sender` 方法来自GObject，所以一般Qt里的窗体对象都可以用。其用法主要在槽里面，调用 `self.sender()` ，即返回一个发射该信号从而调用该槽的对象。



## 布局管理

布局管理是GUI设计中不可回避的一个话题，这里详细讨论下pyqt的布局管理。正如前所述及，pyqt5用于布局管理的类都移到了QtWidgets子模块那里了，首先是最基本的 `QHBoxLayout` 和 `QVBoxLayout` 。

### QBoxLayout

`QHBoxLayout` 和 `QVBoxLayout` 一个是横向排布，一个是竖向排布。它们的使用方法如下所示：

```python
mainLayout=QHBoxLayout()
mainLayout.addWidget(button1)
mainLayout.addWidget(button2)
self.setLayout(mainLayout)
```

Layout对象就好像一个封装器，Layout里面还可以有Layout，当然还有其他一些窗体子单元，都通过 `addWidget` 方法来确立封装关系。最后主母窗口主要接受一个Layout对象，使用的是 `setLayout` 方法。

【layout/hello】

```python
from PyQt5.QtWidgets import QApplication,QWidget,QLabel,QVBoxLayout,QPushButton,QLineEdit, QMessageBox

class Form(QWidget):
    def __init__(self):
        super().__init__()
        nameLabel = QLabel("Name:")
        self.nameLine = QLineEdit()
        self.submitButton = QPushButton("Submit")
        bodyLayout = QVBoxLayout()
        bodyLayout.addWidget(nameLabel)
        bodyLayout.addWidget(self.nameLine)
        bodyLayout.addWidget(self.submitButton)

        self.submitButton.clicked.connect(self.submit)

        self.setLayout(bodyLayout)
        self.setWindowTitle("Hello Qt")
        self.show()

    def submit(self):
        name = self.nameLine.text()

        if name == "":
            QMessageBox.information(self, "Empty Field",
                                    "Please enter a name.")
            return
        else:
            QMessageBox.information(self, "Success!",
                                    "Hello %s!" % name)

if __name__ == '__main__':
    import sys
    app = QApplication(sys.argv)
    screen = Form()
    sys.exit(app.exec_())

```



### addStretch方法

插入一个分隔符，也就是设计器里面的弹簧。

### QGridLayout

在tkinter中有个grid方法，也就是网格布局，同样pyqt中也有个网格布局对象QGridLayout。QGridLayout的用法和上面QBoxLayout类似，除了 **addWidget** 方法后面还可以接受两个额外的参数表示几行几列。

请看到下面的例子。这个例子很好地演示了QGridLayout的使用。其中 `(i-1)//3` 即该数对3取商，本来的1 2 3 4 5 6…将变成0 0 0 1 1 1 2 2 2…正好对应网格中的几行，而 (i-1)%3 即该数对3取余，本来的1 2 3 4 5 6…将变成0 1 2 0 1 2 0 1 2…正好对应网格中的几列的概念。

【layout/gridlayout】

```python
from PyQt5.QtWidgets import QApplication,QWidget,QPushButton,QGridLayout

class Form(QWidget):
    def __init__(self):
        super().__init__()
        bodyLayout = QGridLayout()
        for i in range(1,10):
            button = QPushButton(str(i))
            bodyLayout.addWidget(button,(i-1)//3,(i-1)%3)
            print(i,(i-1)//3,(i-1)%3)
        self.setLayout(bodyLayout)
        self.setWindowTitle("the grid layout")
        self.show()


if __name__ == '__main__':
    import sys
    app = QApplication(sys.argv)
    screen = Form()
    sys.exit(app.exec_())

```

### QFormLayout

QFormLayout，表单布局，常用于提交某个配置信息的表单。

请看到下面的例子。这个例子来自pyqt5源码examples文件夹layouts文件夹里面的basiclayouts.py文件，做了简化主要用于演示表单布局。

【layout/basiclayouts】

```python
from PyQt5.QtWidgets import (QApplication, QDialog,QDialogButtonBox, QFormLayout, QGroupBox,QLabel, QLineEdit, QSpinBox,QVBoxLayout,QTextEdit)


class Dialog(QDialog):
    def __init__(self):
        super().__init__()
        self.createFormGroupBox()
        buttonBox = QDialogButtonBox(QDialogButtonBox.Ok | QDialogButtonBox.Cancel)
        buttonBox.accepted.connect(self.accept)
        buttonBox.rejected.connect(self.reject)
        mainLayout = QVBoxLayout()
        mainLayout.addWidget(self.formGroupBox)
        mainLayout.addWidget(buttonBox)
        self.setLayout(mainLayout)
        self.setWindowTitle("user info")

    def createFormGroupBox(self):
        self.formGroupBox = QGroupBox("your infomation")
        layout = QFormLayout()
        layout.addRow(QLabel("name:"), QLineEdit())
        layout.addRow("age:", QSpinBox())
        layout.addRow(QLabel("other infomation:"), QTextEdit())
        self.formGroupBox.setLayout(layout)


if __name__ == '__main__':
    import sys
    app = QApplication(sys.argv)
    dialog = Dialog()
    sys.exit(dialog.exec_())
```

这里 `QDialog` 类和 `QDialogButtonBox` 类我们且不去管他，QDialog类和下面的accept和reject方法有关，而QDialogButtonBox和最下面的两个按钮和绑定的喜好accepted和rejected有关。

然后我们看到下面创建表单的那个函数，其中 `QGroupBox` 也是一个窗体类型，带有标题。接下来就是QFormLayout表单布局的核心代码：

```python
layout = QFormLayout()

layout.addRow(QLabel("name:"), QLineEdit())

layout.addRow(QLabel("age:"), QSpinBox())

layout.addRow(QLabel("other infomation:"), QTextEdit())

self.formGroupBox.setLayout(layout)

```



我们看到前面的layout的创建和后面母窗体使用本layout的 `setLayout` 方法和前面两个布局都是类似的，除了表单布局是一行行的，它的方法不是addWidget，而是 `addRow` ，然后addRow方法严格意义上可以接受两个窗体类型（包括layout类型）， <span class="underline">另外第一个参数还可以是字符串，即显示的文字</span> 。

## ui文件管理

利用 Qt designer 设计输出的 ui 界面文件，是可以直接用 `PyQt5.uic.loadUi` 来加载进来的，不过ui文件需要利用pypi的资源管理机制，这固然是一种解决方案，但不够pythonic。

推荐是用 `pyuic5` 处理来输出ui文件对应的py文件。大体是利用如下命令行： 

```python
pyuic5 {filename}.ui -o {filename}_ui.py --import-from={project}'.format(filename=filename,
																project=PROJECT)
```

这里的 `--import-from` 选项影响输出py文件的资源引入语句，默认是 `import main_rc` ，设置这个选项之后更改为：

`from project import main_rc`

然后就是利用输出py文件里面的ui类了。



```python
from .uis.main_ui import Ui_MainWindow

class MainWindow(QMainWindow):
    def __init__(self, parent=None, *args):
        super().__init__(parent, *args)

		### setup ui
        self.mainUi = Ui_MainWindow()
        self.mainUi.setupUi(self)
```

具体引入按照官方教程有几种写法，上面这种写法中 `setupUi` 函数跟着本窗体的parent，如果是self则是挂在本窗体上，然后如果本窗体挂在其他母窗体即可。



## 配置文件管理

pyqt5里的QtCore子模块里提供了 **QSettings** 类来方便管理软件的配置文件。

### QSettings构造函数

一般先推荐把OrganizationName和ApplicationName设置好。

```python
app.setOrganizationName("Wise")
app.setApplicationName("wise")
```

然后接下来是构建一个QSettings对象。

```python
QSettings(parent)
```

在设置好组织名和软件名之后，如果如上简单 `QSettings()` 来创建一个配置文件对象，不带任何参数，parent取默认值，那么所谓的format取的默认值是 `QSettings.NativeFormat` ，然后所谓的scope取的默认值是 `QSettings.UserScope` 。这里的scope还有QSettings.SystemScope，这个和软件的配置文件权限有关，这里先略过了，一般就使用默认的UserScope吧。

fromat如果取默认的NativeFormat那么具体软件配置文件的安装目录如下：

- 如果是linux系统，比如上面的例子具体配置文件就是：

```
/home/wanze/.config/Wise/wise.conf
```

- 如果是windows系统，那么上面的例子具体就是：

```
HKEY_CURRENT_USER\Software\Wise\wise
```

windows下配置是放在注册表里面的。

### IniFormat

如果你希望配置文件都以ini形式存储，那么你需要采取如下格式初始化配置文件对象：

```text
self.settings = QSettings(QSettings.IniFormat,QSettings.UserScope,"Wise","wise")
```

这样配置文件就在这里： `/home/wanze/.config/Wise/wise.ini` 。这里是linux系统的情况，windows系统官方文档给出的是： `%APPDATA%\Wise\wise.ini` ，这个 `%APPDATA%` 一般是 ` C:\Documents and Settings\*User Name*\Application Data`

你可以通过调用 `self.settings.fileName()` 来查看该配置文件对象具体的路径所在。

推荐配置文件作为mainwindow实例的属性如上self.settings来确定，然后所有的子窗体都可以通过调用self来获得同一的配置文件对象。

#### ini文件存放DIY

如果你希望ini文件放在你喜欢的地方，下面是配置文件构造函数的第三种形式：

```text
QSettings("wise.ini",QSettings.IniFormat)
```

第一个参数是你的配置文件名，第二个参数是format。如上相对路径的话则是从你目前软件运行时的文件夹算起。

你可以通过调用 `settings.fileName()` 来看看该配置文件的具体所在。

#### ini文件注意事项

ini文件是大小写不敏感的，所以尽量避免两个变量名相近只是大小写不同。

不要使用“\\”和“/”。windows里\\会转换成/，而“/”使用来表示配置文件中分组关系的。

#### 存值和读值

配置文件对象建立之后你就可以很方便地存放一些值和读取值了。存值用 `setValue` 方法，取值用 `value` 方法。如下所示：

```text
settings.setValue("editor/wrapMargin", 68)
margin = self.settings.value("editor/wrapMargin")
```

如果setValue的键在配置文件对象中已经存在，那么将更新值，如果要修改立即生效，可以使用 `sync` 方法，sync方法不接受参数，就是立即同步配置文件中的更新。

`value` 方法第一个参数是“键”，第二个参数是可选值，也就是如果没找到这个键，那么将会返回的值。一般最好还是写上，否则可能配置文件不在了，你就会发生读取错误。

其他方法还有：

- **contains:** 接受一个“键”，字符串对象，返回bool值，看看这个键是不是存在。
- **remove:** 接受一个“键“，移除该键。
- **allkeys:** 不接受参数，返回所有的“键“。
- **clear:** 不接受参数，清除所有的“键”。

### 群组管理

```text
settings.setValue("editor/wrapMargin", 68)
```

如上例子所示“/”表示数据结构中的分组，如果有很多值都有相同的前缀，也就是同属一组，那么可以使用beginGroup方法和endGroup方法来管理。如下所示：

```text
settings.beginGroup("editor")
settings.setValue("wrapMargin", 68)
settings.engGroup()
```



## 快捷键和Tab键管理

我们在创建ui文件的时候就可以把一些Action对应的快捷键给设置好。

### 什么是伙伴关系

一般是通过QLabel的setBuddy方法来关联某个输入窗体。然后QLabel有一个快捷键，当你按下这个快捷键，输入焦点就会转到这个QLabel对应的伙伴输入窗体上。

### 快捷键

QShortcut类

文本前用&会引入对应的Alt+w之类的快捷键。

然后QAction在初始化的时候有

然后QAction有方法

### QKeySequence

`QKeySequence` 类在pyqt4和pyqt5中来自QtGui子模块，是快捷键的解决方案。比如可以直接引用 `QKeySequence.Open` 来表示快捷键Ctrl+O。可用的构造函数如下所示：

```text
QKeySequence(QKeySequence.Print)
QKeySequence(tr("Ctrl+P"))
QKeySequence(tr("Ctrl+p"))
QKeySequence(Qt.CTRL + Qt.Key_P)
```

我不太喜欢第一种表达方式，不是任何软件都有打印操作，况且打印和某个快捷键之间并没有逻辑联系，只有程序员的个人使用经验，这是不小的记忆负担。我比较喜欢第四种写法，看上去意义更加清晰，Qt来自QtCore子模块。

字母按键就是类似 `Qt.Key_W` 这样的形式，Shift按键是Qt.SHIFT，Meta按键是Qt.META，CTRL按键是 `Qt.CTRL` ，ALT按键是 `Qt.ALT` 。





## 资源文件管理

### 资源管理

pyqt都用qrc文件来管理软件内部的资源文件（如图标文件，翻译文件等）。qrc文件的编写格式如下：

```xml
<!DOCTYPE RCC><RCC version="1.0">
<qresource>
    <file>images/copy.png</file>
</qresource>
</RCC>
```

qrc的编写还是很简单的，完全可以手工编写之。上面代码第三行的images/copy.png的意思就是qrc文件所在目录下的images文件夹，里面的copy.png文件。

qrc文件编写好了你需要运行如下命令

```sh
pyrcc5 wise.qrc -o wise_rc.py
```

这样将会输出一个 `wise_rc.py` 文件，你如果要使用里面的资源，首先

```python
import wise_rc
```

然后引用路径如下  `:/images/copy.png`  ，这样就可以使用该图标文件了。

推荐一个项目里面所有的资源文件都用一个qrc文件来管理。



## 国际化支持

本小节参考资料除了官方文档之外还有[这个网站](http://plashless.wordpress.com/2014/02/01/internationalizing-python-pyqt-apps/) 。

这里指的pyqt的软件国际化支持主要是指i18n，也就是两种语言，英语和本土语言。其中软件的字符串都是英语，然后用 `self.tr()` 封装，不过按照官方pyqt5文档的 [说明](http://pyqt.sourceforge.net/Docs/PyQt5/i18n.html) ，其推荐使用如下形式：

```text
from PyQt5.QtCore import QCoreApplication
QCoreApplication.translate('A', "Hello")
```

上面translate函数第一个参数是翻译的目标类，第二个是待翻译的字符串。实际可以考虑写个translate函数，然后将所有翻译都统一到本程序的某个主类上。

```python
def translate(string, targetobj=None):
    if targetobj is None:
        targetobj = "MainWindow"

    return QCoreApplication.translate(targetobj, string)
```



然后在你的项目里新建一个translations文件夹，新建如下一个小文件 `wise.pro` ，这里的wise是你的模块具体的名字，随意修改之。这个文件的内容简要如下：

```text
SOURCES += ../main.py ../__init__.py \
../Widgets/__init__.py
TRANSLATIONS += wise_zh_CN.ts
```

SOURCES 是你希望扫描的py文件，如果该文件有前面所说的translate封装，那么里面的字符串 `pylupdate5` 工具就可以扫描出来。这里支持路径的相对表达。但是不支持glob语法。

第二个变量就是TRANSLATIONS就是你希望生成的目标翻译ts文件的文件名，一般是如下格式：

```text
{PROJECT_NAME}_{QLocale.system().name()}.ts
```

其中PROJECT\_NAME是你项目的名字，而QLocale.system().name()是你当前机器所用的目标语言简写，你可以在python3的eval模式下查看一下：

```
>>> from PyQt5.QtCore import QLocale
>>> QLocale.system().name()
'zh_CN'
```

然后你需要用 `pylupdate5` 小工具处理该pro文件：

```sh
pylupdate5 wise.pro
```

这样你就可以看到生成的 `wise_zh_CH.ts` 文件了。



### 使用翻译文件

样例如下：

```python
from PyQt5.QtCore import QTranslator,QLocale
myapp = QApplication(sys.argv)
translator = QTranslator()
if translator.load('wise_'+ QLocale.system().name()+'.qm',
":/translations/"):
myapp.installTranslator(translator)
```

首先你需要构建一个QTranslator对象，然后调用该对象的方法load，这里第一个参数是要load的qm文件名，第二个参数是qm文件的路径，可以使用前面谈及的qrc引用路径。

最后你的主母窗口myapp使用installTranslator方法把这个QTranslator对象加进去即可。

### 使用qt官方翻译文件

有些qt窗体内部文字可能不好DIY，这时需要如上一样加载qt的官方翻译文件。代码如下所示：

```python
translator_qt = QTranslator()
if translator_qt.load('qt_'+ QLocale.system().name()+'.qm',":/translations/"):
# print('i found qt')
myapp.installTranslator(translator_qt)
```

这样你的主母窗口myapp现在需要加载两个翻译文件了。

官方qt翻译文件在qt源码的translations文件夹里面，可以如下通过git clone获取。

```sh
git clone https://gitorious.org/qt/qttranslations.git

```

ts文件如前所述用 **lrelease** 命令处理以下，或者直接用语言工具打开然后发布即可。



## exe制作和安装程序制作

### exe制作

所谓的exe制作也就是把你写的pyqt程序或者说python程序freeze起来，这样目标机器上用户没有安装python或者等等其他依赖都能正常运行程序。

推荐使用pyinstaller。 pyinstaller的官网在 [这里](http://www.pyinstaller.org/) 。

首先是用pip 安装之，然后推荐在你的项目根目录下创建一个简单的启动脚本，一方面方便平时测试，一方面作为pyinstaller的程序入口。

```python
"""
for pyinstaller
注意本脚本名字不能设置为 quicktikz
"""
import quicktikz.main

if __name__ == '__main__':
    quicktikz.main.gui()
```



**NOTICE:**  注意该脚本的名字不要和你的pyqt程序的模块名字相同，之前我安装后闪退就是因为这个脚本名字没取好。

具体使用很简单：

```python
import subprocess

PROJECT = 'quicktikz'

cmd = 'pyinstaller.exe --noconsole -y QuickTikz.py'

subprocess.call(cmd, shell=True)
```

上面的 `-y` 选项是自动删除原输出文件， `--noconsole` 是隐藏你的pyqt程序的终端界面，否则后面程序会开两个窗口不太好看。

如果一切顺利，到 `dist` 文件夹下运行你的目标程序exe运行正常，那么一切都OK，如果出问题了，那么请钻研官方文档吧。。

### 安装程序的制作

推荐使用 advanceinstaller程序，这是该程序的 [官网地址](https://www.advancedinstaller.com/) 。推荐一开始安装官网的simple 过程来，请参看官网的这个基本 [入门tutorial](https://www.advancedinstaller.com/user-guide/tutorial-simple.html) 。

在设置文件和文件夹的时候把在 `dist` 里面的所有内容都加进去即可，注意这个软件操作说是添加文件那么只能添加文件的，所以dist里面的 PyQt5文件夹需要再操作添加文件夹之。

如果一切运行顺利，那么太好了，我们就有了我们程序的安装程序，赶快分享给小伙伴们吧。

![img]({static}/images/adinstaller.png  "adinstaller")