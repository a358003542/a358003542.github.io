Slug: pyside2-learning-notes
Date: 20201018
Tags: gui,python


[TOC]

## 更新说明

在原pyqt5学习笔记的基础上更新调整为pyside2学习笔记，推荐使用pyside2。本文推荐参看 [样例项目](https://github.com/a358003542/pyside2_examples) 来阅读风味更佳。

## 安装和配置

就是利用pip 安装之：

```bash
pip install pyside2
```

## 第一个例子

### 窗口
【beginning-first01】

```python
import sys
from PySide2.QtWidgets import QApplication, QWidget


class MyWidget(QWidget):
    def __init__(self):
        super().__init__()
        self.setGeometry(0, 0, 800, 600)
        # 坐标0 0 大小800 600
        self.setWindowTitle('myapp')


if __name__ == '__main__':
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
from PySide2.QtGui import QIcon
from PySide2.QtWidgets import QWidget, QApplication


class MyWidget(QWidget):
    def __init__(self):
        super().__init__()
        self.resize(800, 600)
        self.setWindowTitle('myapp')
        self.setWindowIcon(QIcon('icons/myapp.ico'))


if __name__ == '__main__':
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
from PySide2.QtGui import QIcon, QFont
from PySide2.QtWidgets import QWidget, QApplication, QToolTip


class MyWidget(QWidget):
    def __init__(self):
        super().__init__()
        self.resize(800, 600)
        self.setWindowTitle('myapp')
        self.setWindowIcon(QIcon('icons/myapp.ico'))
        self.setToolTip('看什么看^_^')
        QToolTip.setFont(QFont('微软雅黑', 12))


if __name__ == '__main__':
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
from PySide2.QtGui import QIcon, QFont
from PySide2.QtWidgets import QWidget, QApplication, QToolTip, QMessageBox


class MyWidget(QWidget):
    def __init__(self):
        super().__init__()
        self.resize(800, 600)
        self.setWindowTitle('myapp')
        self.setWindowIcon(QIcon('icons/myapp.ico'))
        self.setToolTip('看什么看^_^')
        QToolTip.setFont(QFont('微软雅黑', 12))

    def closeEvent(self, event):
        # 重新定义colseEvent
        reply = QMessageBox.question(self, '信息',
                                     "你确定要退出吗？",
                                     QMessageBox.Yes,
                                     QMessageBox.No)
        if reply == QMessageBox.Yes:
            event.accept()
        else:
            event.ignore()


if __name__ == '__main__':
    myapp = QApplication(sys.argv)
    mywidget = MyWidget()
    mywidget.show()
    sys.exit(myapp.exec_())
```

这段代码和前面代码的不同就是重新定义了 `colseEvent` 事件。这段代码的核心就是QMessageBox类的question方法，这个方法将会弹出一个询问窗体。这个方法接受四个参数：第一个参数是这个窗体所属的母体，这里就是self也就是实例mywidget；第二个参数是弹出窗体的标题；第三个参数是一个标准button；第四个参数也是一个标准button，是默认（也就是按enter直接选定的）的button。然后这个方法返回的是那个被点击了的标准button的标识符，所以后面和标准 `QMessageBox.Yes`
 比较了，然后执行event的accept方法。

### 屏幕居中显示窗体
【beginning-first05】

```python
import sys
from PySide2.QtGui import QIcon, QFont
from PySide2.QtWidgets import QWidget, QApplication, QToolTip, QMessageBox


class MyWidget(QWidget):
    def __init__(self, app):
        super().__init__()
        self.app = app
        self.resize(800, 600)
        self.center()
        self.setWindowTitle('myapp')
        self.setWindowIcon(QIcon('icons/myapp.ico'))
        self.setToolTip('看什么看^_^')
        QToolTip.setFont(QFont('微软雅黑', 12))

    def closeEvent(self, event):
        # 重新定义colseEvent
        reply = QMessageBox.question(self, '信息',
                                     "你确定要退出吗？",
                                     QMessageBox.Yes,
                                     QMessageBox.No)
        if reply == QMessageBox.Yes:
            event.accept()
        else:
            event.ignore()

    # center method
    def center(self):
        screen = self.app.screens()[0]
        screen_size = screen.size()
        size = self.geometry()
        self.move((screen_size.width() - size.width()) / 2, \
                  (screen_size.height() - size.height()) / 2)


if __name__ == '__main__':
    myapp = QApplication(sys.argv)
    mywidget = MyWidget(myapp)
    mywidget.show()
    sys.exit(myapp.exec_())
```

这个例子和前面相比改动是新建了一个 `center` 方法，接受一个实例，这里是mywidget。然后对这个实例也就是窗口的具体位置做一些调整。

这里将你之前新建的QApplication对象传递进来，其有一个 `screens` 方法，可以获取当前你的电脑设备的QScreen对象列表，如果有多个屏幕的话是有用的，这里就简单选定第一个屏幕了。然后通过QScreen对象的 `size` 方法你可以获取当前屏幕的大小尺寸，返回的是QSize对象。

然后QWidget类的 `geometry` 方法同样返回一个量，这个量的width是这个窗体的宽度，这个量的height属性是这个窗体的高度。

然后调用QWidget类的move方法，这里是对mywidget这个实例作用。我们可以看到move方法的X，Y是从屏幕的坐标原点 (0,0) 开始计算的。第一个参数X表示向右移动了多少宽度，Y表示向下移动了多少高度。

整个函数的作用效果就是将这个窗体居中显示。

### QMainWindow类

QMainWindow类提供应用程序主窗口，可以创建一个经典的拥有状态栏、工具栏和菜单栏的应用程序骨架。（之前使用的是QWidget类，现在换成QMainWindow类。）

前面第一个例子都是用的QWidget类创建的一个窗体。关于QWidget和QMainWindow这两个类的区别 [根据这个网站](http://stackoverflow.com/questions/3298792/whats-the-difference-between-qmainwindow-and-qwidget-and-qdialog) 得出的结论是：QWdget类在Qt中是所有可画类的基础（这里的意思可能是窗体的基础吧。） 任何基于QWidget的类都可以作为独立窗体而显示出来而不需要母体（parent）。

QMainWindow类是针对主窗体一般需求而设计的，它预定义了菜单栏状态栏和其他widget（窗口小部件） 。因为它继承自QWidget，所以前面谈及的一些属性修改都适用于它。那么现在我们将之前的代码中的QWidget类换成QMainWindow类，然后加上一个状态栏提示信息。

【beginning-first06】

```python

import sys
from PySide2.QtGui import QIcon, QFont
from PySide2.QtWidgets import QMainWindow, QApplication, QToolTip, QMessageBox


class MyWindow(QMainWindow):
    def __init__(self, app):
        super().__init__()
        self.app = app
        self.resize(800, 600)
        self.center()
        self.setWindowTitle('myapp')
        self.setWindowIcon(QIcon('icons/myapp.ico'))
        self.setToolTip('看什么看^_^')
        QToolTip.setFont(QFont('微软雅黑', 12))

    def closeEvent(self, event):
        # 重新定义colseEvent
        reply = QMessageBox.question(self, '信息',
                                     "你确定要退出吗？",
                                     QMessageBox.Yes,
                                     QMessageBox.No)
        if reply == QMessageBox.Yes:
            event.accept()
        else:
            event.ignore()

    # center method
    def center(self):
        screen = self.app.screens()[0]
        screen_size = screen.size()
        size = self.geometry()
        self.move((screen_size.width() - size.width()) / 2, \
                  (screen_size.height() - size.height()) / 2)


if __name__ == '__main__':
    myapp = QApplication(sys.argv)
    mywindow = MyWindow(myapp)
    mywindow.show()
    mywindow.statusBar().showMessage('程序已就绪...')
    sys.exit(myapp.exec_())
```



### 加上菜单栏
【beginning-first07】

```python
import sys
from PySide2.QtGui import QIcon, QFont
from PySide2.QtWidgets import QMainWindow, QApplication, QToolTip, QMessageBox


class MyWindow(QMainWindow):
    def __init__(self, app):
        super().__init__()
        self.app = app
        self.initUI()

    def initUI(self):
        self.resize(800, 600)
        self.center()
        self.setWindowTitle('myapp')
        self.setWindowIcon(QIcon('icons/myapp.ico'))
        self.setToolTip('看什么看^_^')
        QToolTip.setFont(QFont('微软雅黑', 12))

        # 菜单栏
        menu_control = self.menuBar().addMenu('Contorl')
        act_quit = menu_control.addAction('quit')
        act_quit.triggered.connect(self.close)

        menu_help = self.menuBar().addMenu('Help')
        act_about = menu_help.addAction('about...')
        act_about.triggered.connect(self.about)
        act_aboutqt = menu_help.addAction('aboutqt')
        act_aboutqt.triggered.connect(self.aboutqt)

        # 状态栏
        self.statusBar().showMessage('程序已就绪...')
        self.show()

    def closeEvent(self, event):
        # 重新定义colseEvent
        reply = QMessageBox.question(self, '信息',
                                     "你确定要退出吗？",
                                     QMessageBox.Yes,
                                     QMessageBox.No)
        if reply == QMessageBox.Yes:
            event.accept()
        else:
            event.ignore()

    def about(self):
        QMessageBox.about(self, "about this software", "wise system")

    def aboutqt(self):
        QMessageBox.aboutQt(self)

    # center method
    def center(self):
        screen = self.app.screens()[0]
        screen_size = screen.size()
        size = self.geometry()
        self.move((screen_size.width() - size.width()) / 2, \
                  (screen_size.height() - size.height()) / 2)


if __name__ == '__main__':
    myapp = QApplication(sys.argv)
    mywindow = MyWindow(myapp)
    sys.exit(myapp.exec_())
```

和上面讨论加上状态栏类似，这里用QMainWindow类的 `menuBar` 方法来获得一个菜单栏对象。然后用这个菜单栏对象的 `addMenu` 方法来创建一个新的菜单对象（QMenu类），addMenu方法里面的内容是新建菜单要显示的文本。

然后继续给之前的菜单对象加上动作，调用菜单对象的 `addAction` 方法，我们看到menuBar创建了一个菜单栏对象，然后使用addMenu方法创建了一个菜单，同时返回的是一个菜单对象，然后对这个菜单对象使用addAction方法，这个方法给菜单添加了一个动作，或者说一个item一个内容，然后addAction返回的是一个动作对象，然后对这个动作对象进行信号－槽机制连接，将其和一个函数连接起来了。

在这里这个动作对象，就是菜单的下拉选项，如果我们用鼠标点击一下的话，将会触发 `triggered` 信号，如果我们connect方法连接到某个槽上（或者某个你定义的函数），那么将会触发这个函数的执行。下面就信号－槽机制详细说明之。

### 信号－槽机制

GUI程序一般都引入一种事件和信号机制，well，简单来说就是一个循环程序，这个循环程序等到某个时刻程序会自动做某些事情比如刷新程序界面啊，或者扫描键盘鼠标之类的，等用户点击鼠标或者按了键盘之后，它会接受这个信号然后做出相应的反应。

所以你一定猜到了， `close` 函数可能就是要退出这个循环程序。我们调用主程序的 `exec_` 方法，就是开启这个循环程序。

现在新的信号-槽基本语法如下所示：

```python
act_exit.triggered.connect(self.close)
```

我们看到新的信号－槽机制语句变得更精简更易懂了。整个过程就是如我前面所述，某个对象发出了某个信号，然后用connect将这个信号和某个槽（或者你定义的某个函数）连接起来即形成了一个反射弧了。

这里的槽就是self主窗口实例的close方法，这个是主窗口自带的函数。

然后我们看到aboutqt和about函数。具体读者如果不懂请翻阅QMessageBox类的静态方法 `about` 和 `aboutqt` 。

### 再随便画点什么

现在我们再随便画点什么，QMainWindow中心面板是由 `setCentralWidget` 决定的，然后这里我们随便给新的自定义面板设置了垂直布局，简单加上了一个按钮。如果按钮点击的话会执行print hello world动作。更详细的了解请参看下面的信号-槽详解小节和布局管理小节。

```python
import sys
from PySide2.QtGui import QIcon, QFont
from PySide2.QtCore import Slot
from PySide2.QtWidgets import QMainWindow, QApplication, QToolTip, QMessageBox, \
    QPushButton, QWidget, QVBoxLayout


class MyWidget(QWidget):
    def __init__(self):
        super(MyWidget, self).__init__()

        layout = QVBoxLayout()
        mybutton = QPushButton("hello world!")
        layout.addWidget(mybutton)

        self.setLayout(layout)

        mybutton.clicked.connect(self.hello)

    @Slot()
    def hello(self):
        print('hello world!')


class MyWindow(QMainWindow):
    def __init__(self, app):
        super().__init__()
        self.app = app
        self.initUI()

    def initUI(self):
        self.resize(800, 600)
        self.center()
        self.setWindowTitle('myapp')
        self.setWindowIcon(QIcon('icons/myapp.ico'))
        self.setToolTip('看什么看^_^')
        QToolTip.setFont(QFont('微软雅黑', 12))

        # 菜单栏
        menu_control = self.menuBar().addMenu('Contorl')
        act_quit = menu_control.addAction('quit')
        act_quit.triggered.connect(self.close)

        menu_help = self.menuBar().addMenu('Help')
        act_about = menu_help.addAction('about...')
        act_about.triggered.connect(self.about)
        act_aboutqt = menu_help.addAction('aboutqt')
        act_aboutqt.triggered.connect(self.aboutqt)

        # 绘制点什么
        mywidget = MyWidget()
        self.setCentralWidget(mywidget)

        # 状态栏
        self.statusBar().showMessage('程序已就绪...')
        self.show()

    def closeEvent(self, event):
        # 重新定义colseEvent
        reply = QMessageBox.question(self, '信息',
                                     "你确定要退出吗？",
                                     QMessageBox.Yes,
                                     QMessageBox.No)
        if reply == QMessageBox.Yes:
            event.accept()
        else:
            event.ignore()

    def about(self):
        QMessageBox.about(self, "about this software", "wise system")

    def aboutqt(self):
        QMessageBox.aboutQt(self)

    # center method
    def center(self):
        screen = self.app.screens()[0]
        screen_size = screen.size()
        size = self.geometry()
        self.move((screen_size.width() - size.width()) / 2, \
                  (screen_size.height() - size.height()) / 2)


if __name__ == '__main__':
    myapp = QApplication(sys.argv)
    mywindow = MyWindow(myapp)
    sys.exit(myapp.exec_())
```



## 信号－槽详解

信号(singal)可以连接无数多个槽(slot)，或者没有连接槽也没有问题，信号也可以连接其他的信号。正如前面所述，连接的基本语句形式如下： `who.singal.connect(slot)` 。比如说按钮最常见的内置信号 `triggered` ，而槽实际上就是某个函数，比如主窗体的 `self.close` 方法。

信号就是 `QObject` 的一个属性，pyqt的窗体有很多内置信号，你也可以定义自己的信号，这个后面再提及。信号还没和槽连接起来就只是一个属性，只有通过 `connect` 方法连接起来，信号－槽机制就建立起来了。类似的信号还有 `disconnect` 方法和 `emit` 方法。disconnect就是断开信号－槽机制，而emit就是激活那个信号。

如果你自己定义自己的信号或者槽可能对who.singal.connect(slot)这样简洁的形式如何完成工作的感到困惑。这里先简要地介绍一下。

信号都是类的一个属性，新的信号必须继承自QObject，然后由 `PySide2.QtCore.Singal` 方法创建，这个方法接受的参数中最重要的是types类型，比如int，bool之类的，你可以认为这是信号传递的参数类型，但实际传递这些参数值的是emit方法。然后槽实际上就是经过特殊封装的函数，这些函数当然需要接受一些参数或者不接受参数，而这些参数具体的值传进来的是由emit方法执行的，在这里隐藏的一个重要细节就是emit方法。比如说你定义一个新的信号，需要将点击屏幕的具体x,y坐标发送出去，内置的信号－槽将这一机制都完成了，如果你自己定义的信号和槽的话，比如 `Singal(int,int)` ，发送给func(x,y)，具体x和y的值你需要通过emit(x,y)来发送。

请看下面这个例子：
【singal-slot/age】

```python
import sys
from PySide2.QtWidgets import QHBoxLayout, QSlider, QSpinBox, QApplication, \
    QWidget
from PySide2.QtCore import Qt

app = QApplication(sys.argv)
window = QWidget()
window.setWindowTitle("enter your age")
spinBox = QSpinBox()
slider = QSlider(Qt.Horizontal)
spinBox.setRange(0, 130)
slider.setRange(0, 130)

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

`spinBox.valueChanged.connect(slider.setValue)` 将spinBox的 `valueChanged` 信号和slider的 `setValue` 槽连接起来了，其中QSpinBox内置的 `valueChanged` 信号发射自带的一个参数就是改变后的值，这个值传递给了QSlider的内置槽 `setValue` ，从而将slider的值设置为新值。下面也一样，如果slider的值发生了改变，那么会发送valueChanged信号，然后又传递给了spinBox，并执行了内置槽setValue，由于此时的值即为原值，这样spinBox内的值就没有发生改变了，如此程序不会陷入死循环。

### 自定义信号

如下具体来创建一个自己定义的信号：

```python
from PySide2.QtCore import Signal

closed = Signal()
```

### 自定义槽

按照python格式自己定义的函数就是所谓的自定义槽了。不过推荐用Pyside2的槽装饰器来定义槽。

```python
from PySide2.QtCore import Slot

@Slot()
def foo(self):
	pass

@Slot(int, str)
def foo(self, arg1, arg2):
	pass
```

上面的第一个例子定义了名叫foo的一个槽，然后不接受任何参数。第二个槽接受一个int类型的值和str类型的值。

### 发射信号

信号对象有emit方法用来发射信号，然后信号对象还有disconnect方法断开某个信号和槽的连接。

一个信号可以连接多个槽，多个信号可以连接同一个槽，一个信号可以与另外一个信号相连接。

下面通过一个例子详解自建信号还有自建槽并建立发射机制的情况。
【singal-slot/FindDialog】

```python
from PySide2.QtWidgets import QDialog, QLabel, QLineEdit, QCheckBox, \
    QPushButton, QHBoxLayout, QVBoxLayout, QApplication
from PySide2.QtCore import Qt, Signal, Slot


class FindDialog(QDialog):
    findNext = Signal(str, Qt.CaseSensitivity)
    findPrevious = Signal(str, Qt.CaseSensitivity)

    def __init__(self, parent=None):
        super().__init__(parent)
        label = QLabel("Find &what:")
        self.lineEdit = QLineEdit()
        label.setBuddy(self.lineEdit)

        self.caseCheckBox = QCheckBox("Match &case")
        self.backwardCheckBox = QCheckBox("Search &backward")
        self.findButton = QPushButton("&Find")
        self.findButton.setDefault(True)
        self.findButton.setEnabled(False)
        closeButton = QPushButton("Close")

        self.lineEdit.textChanged.connect(self.enableFindButton)
        self.findButton.clicked.connect(self.findClicked)
        closeButton.clicked.connect(self.close)

        topLeftLayout = QHBoxLayout()
        topLeftLayout.addWidget(label)
        topLeftLayout.addWidget(self.lineEdit)
        leftLayout = QVBoxLayout()
        leftLayout.addLayout(topLeftLayout)
        leftLayout.addWidget(self.caseCheckBox)
        leftLayout.addWidget(self.backwardCheckBox)
        rightLayout = QVBoxLayout()
        rightLayout.addWidget(self.findButton)
        rightLayout.addWidget(closeButton)
        rightLayout.addStretch()
        mainLayout = QHBoxLayout()
        mainLayout.addLayout(leftLayout)
        mainLayout.addLayout(rightLayout)
        self.setLayout(mainLayout)

        self.setWindowTitle("Find")
        self.setFixedHeight(self.sizeHint().height())

    def enableFindButton(self, text):
        self.findButton.setEnabled(bool(text))

    @Slot()
    def findClicked(self):
        text = self.lineEdit.text()
        if self.caseCheckBox.isChecked():
            cs = Qt.CaseSensitive
        else:
            cs = Qt.CaseInsensitive

        if self.backwardCheckBox.isChecked():
            self.findPrevious.emit(text, cs)
        else:
            self.findNext.emit(text, cs)


if __name__ == '__main__':
    import sys

    app = QApplication(sys.argv)
    findDialog = FindDialog()


    def find(text, cs):
        print('find:', text, 'cs', cs)


    def findp(text, cs):
        print('findp:', text, 'cs', cs)


    findDialog.findNext.connect(find)
    findDialog.findPrevious.connect(findp)
    findDialog.show()
    sys.exit(app.exec_())
```

首先自建的信号必须是类的属性，然后这个类必须是QObject的子类，面板都是继承自QObject的，这个倒是不用担心。

```python
    findNext = Signal(str, Qt.CaseSensitivity)
    findPrevious = Signal(str, Qt.CaseSensitivity)
```

上面两行是自定义信号，此信号有两个参数，一个是str字符变量，一个是Qt.CaseSensitivity的枚举值。假设我们输入一些文字了，然后点击Find按钮，请看到：

```python
self.findButton.clicked.connect(self.findClicked)
```

点击之后将执行findClicked槽，按钮的clicked信号是不带参数的。所以后面定义的findClicked槽也没有任何参数。

findClicked函数后面确定了当前的QLineEdit的text值和cs也就是大小写是否检查的状态。然后根据向前或者向后是否勾选来确定接下来要发送的信号。比如findNext信号调用emit方法，对应两个参数也传递过去了。而这个findNext正是我们前面自定义的信号，正是对应的两个参数类型。

```python
    def find(text, cs):
        print('find:', text, 'cs', cs)


    def findp(text, cs):
        print('findp:', text, 'cs', cs)


    findDialog.findNext.connect(find)
    findDialog.findPrevious.connect(findp)
```

这里简单定义的两个函数用这里的术语来说应该称之为槽，上面emit方法只是实际发送了findNext信号和参数，而这里就是将findNext信号和find槽连接起来，信号和槽之间的参数一定要匹配，我们看到这里find就接受了两个参数。



### 引用信号发射对象

`sender` 方法来自GObject，所以一般Qt里的窗体对象都可以用。其用法主要在槽里面，调用 `self.sender()` ，即返回一个发射该信号的对象。



## 布局管理

首先是最基本的 `QHBoxLayout` 和 `QVBoxLayout` ，一个是水平布局，一个是垂直布局。

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

from PySide2.QtWidgets import QApplication, QWidget, QLabel, QVBoxLayout, \
    QPushButton, QLineEdit, QMessageBox


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

QGridLayout也就是网格布局。QGridLayout的用法和上面QBoxLayout类似，除了 **addWidget** 方法后面还可以接受两个额外的参数表示几行几列。

请看到下面的例子。这个例子很好地演示了QGridLayout的使用。其中 `(i-1)//3` 即该数对3取商，本来的1 2 3 4 5 6…将变成0 0 0 1 1 1 2 2 2…正好对应网格中的几行，而 (i-1)%3 即该数对3取余，本来的1 2 3 4 5 6…将变成0 1 2 0 1 2 0 1 2…正好对应网格中的几列的概念。

【layout/gridlayout】

```python

from PySide2.QtWidgets import QApplication, QWidget, QPushButton, QGridLayout


class Form(QWidget):
    def __init__(self):
        super().__init__()
        bodyLayout = QGridLayout()
        for i in range(1, 10):
            button = QPushButton(str(i))
            bodyLayout.addWidget(button, (i - 1) // 3, (i - 1) % 3)
            print(i, (i - 1) // 3, (i - 1) % 3)
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

from PySide2.QtWidgets import (QApplication, QDialog, QDialogButtonBox,
                               QFormLayout, QGroupBox, QLabel, QLineEdit,
                               QSpinBox, QVBoxLayout, QTextEdit)


class Dialog(QDialog):
    def __init__(self):
        super().__init__()
        self.createFormGroupBox()
        buttonBox = QDialogButtonBox(
            QDialogButtonBox.Ok | QDialogButtonBox.Cancel)
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

## 资源文件管理

【funnyclock】

对于一般的资源文件，比如图片文件，翻译文件，推荐将其转成python资源文件，然后在python代码中直接import即可使用。首先你需要编写一个qrc文件，qrc文件的编写格式如下：

```xml
<!DOCTYPE RCC><RCC version="1.0">
<qresource>
    <file>icons/clock.png</file>
</qresource>
</RCC>
```

qrc的编写还是很简单的，完全可以手工编写之。上面代码第三行的 `icons/clock.png` 的意思就是qrc文件所在目录下的icons文件夹，里面的clock.png文件。

qrc文件编写好了你需要运行如下命令

```sh
pyside2-rcc.exe funnyclock.qrc -o funnyclock_rc.py
```

这个pyside2-rcc 在你安装pyside2的时候就会自动有了，具体是在你安装的虚拟环境或者系统python环境下的Script文件夹下。如果你要使用里面的资源，首先

```python
import funnyclock_rc
```

然后引用路径如下  `:/icons/clock.png`  ，这样就可以使用该图标文件了。

推荐一个项目里面所有的资源文件都用一个qrc文件来管理。

## 国际化支持

本小节参考资料除了官方文档之外还有[这个网站](http://plashless.wordpress.com/2014/02/01/internationalizing-python-pyqt-apps/) 。

这里指的软件国际化支持主要是指i18n，也就是两种语言，英语和本土语言。其中软件的字符串都是英语，然后用 `self.tr()` 封装。

然后在你的项目里新建一个translations文件夹，新建如下一个小文件 `wise.pro` ，这里的wise是你的模块具体的名字，随意修改之。这个文件的内容简要如下：

```text
SOURCES += timer.py
TRANSLATIONS += timer_zh_CN.ts
```

SOURCES 是你希望扫描的py文件，如果该文件有前面所说的翻译封装，那么里面的字符串 `pyside2-lupdate` 工具就可以扫描出来。这里支持路径的相对表达。但是不支持glob语法。

第二个变量就是TRANSLATIONS就是你希望生成的目标翻译ts文件的文件名，一般是如下格式：

```text
{PROJECT_NAME}_{QLocale.system().name()}.ts
```

其中PROJECT\_NAME是你项目的名字，而QLocale.system().name()是你当前机器所用的目标语言简写，你可以如下查看下：

```text
>>> from PySide2.QtCore import QLocale
>>> QLocale.system().name()
'zh_CN'
```

然后你需要用 `pyside2-lupdate` 小工具处理该pro文件【同样这个小工具在你安装pyside2的时候自动安装了】：

```sh
pyside2-lupdate.exe timer.pro
```

这样你就可以看到生成的 timer_zh_CH.ts 文件了。

### 编辑ts文件

你需要下载qtlinguist工具来编辑ts文件并生成qm文件。推荐到 [这个项目](https://github.com/lelegard/qtlinguist-installers/releases) 上下载。



### 使用翻译文件

具体使用翻译文件，也就是那个qm文件

```python
# 先自动加载最佳语言方案
default_translator = QTranslator()
default_translator.load(f':translations/timer_{QLocale.system().name()}')
app.installTranslator(default_translator)
```

首先你需要构建一个QTranslator对象，然后调用该对象的方法load，这里第一个参数是要load的qm文件名，第二个参数是qm文件的路径，可以使用前面谈及的qrc引用路径。

最后你的主母窗口myapp使用installTranslator方法把这个QTranslator对象加进去即可。

### 动态切换翻译方案

请参看演示样例 【timer】

```python
  def change_lang_chinese(self):
        self.app.removeTranslator(default_translator)
        translator = QTranslator()
        translator.load(':translations/timer_zh_CN')
        self.app.installTranslator(translator)
        self.retranslateUi()
        self.lang = 'zh'

    def change_lang_english(self):
        self.app.removeTranslator(default_translator)
        translator = QTranslator()
        translator.load('')
        self.app.installTranslator(translator)
        self.retranslateUi()
        self.lang = ''
```



## 多线程初步

请参看演示样例 【timer】

```python
class MakeSoundThread(QThread):
    def run(self):
        while True:
            gfun_beep(500, 3)

            self.sleep(10)

            if self.isInterruptionRequested():
                return
```

- start 线程开始
- requestInterruption 对应上面的 isInterruptionRequested ，可用于长时任务的线程退出。

## 最小化到托盘

请参看演示样例 【timer】

```python
 class MySystemTrayIcon(QSystemTrayIcon):
    def __init__(self, parent=None):
        super(MySystemTrayIcon, self).__init__(parent)
        self.parent = parent
        self.setIcon(QIcon(':images/myapp.png'))
        self.activated.connect(self.onTrayIconActivated)

    def onTrayIconActivated(self, reason):
        if reason == QSystemTrayIcon.ActivationReason.Trigger:
            self.parent.reopen()
            
 .....
 
		self.mysystemTrayIcon = MySystemTrayIcon(self)
        menu1 = QMenu(self)
        menu_systemTrayIcon_open = menu1.addAction('open')
        menu_systemTrayIcon_open.triggered.connect(self.reopen)
        menu1.addSeparator()
        menu_systemTrayIcon_exit = menu1.addAction("exit")
        menu_systemTrayIcon_exit.triggered.connect(self.menu_exit)
        self.mysystemTrayIcon.setContextMenu(menu1)
        self.mysystemTrayIcon.show()
```



## exe制作和安装程序制作

### exe制作

所谓的exe制作也就是把你写python程序freeze起来，这样目标机器上用户没有安装python或者等等其他依赖都能正常运行程序。

推荐使用pyinstaller。 pyinstaller的官网在 [这里](http://www.pyinstaller.org/) 。安装就是用pip 安装即可。

然后推荐在你的项目根目录下创建一个简单的启动脚本，一方面方便平时测试，一方面作为pyinstaller的程序入口。

**NOTICE:**  注意该脚本的名字不要和你的程序的模块名字相同，之前我安装后闪退就是因为这个脚本名字没取好。

具体使用很简单：

```text
pyinstaller you_entry_point.py
```

如果一切顺利，到 `dist` 文件夹下运行你的目标程序exe运行正常，那么一切都OK，如果出问题了，那么请钻研官方文档吧。

### 安装程序的制作

你可以使用 advanceintaller 或者 nsis 等工具来制作具体程序的安装文件。



## 使用qt designer

安装pyside2之后实际上就已经安装qt designer了：

```text
pyside2-designer.exe
```

你可以使用这个设计器快速地设计你的图形界面，然后将其转成python代码文件：

```text
pyside2-uic.exe test.ui > test.py
```

然后在这个输出python文件的基础上进一步进行代码修改完善工作。并不推荐直接在python代码中加载ui文件的使用风格，这会造成你项目代码的一种分裂感。

总的来说个人对生成的代码不是很满意，权作参考吧。



## 配置文件管理

QtCore模块里提供了 **QSettings** 类来方便管理软件的配置文件。

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

```text
/home/wanze/.config/Wise/wise.conf
```

- 如果是windows系统，那么上面的例子具体就是：

```text
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

#### ini文件注意事项

ini文件是大小写不敏感的，所以尽量避免两个变量名相近只是大小写不同。

不要使用 `\` 和 `/` 。windows里 `\` 会转换成`/`，而 `/` 是用来表示配置文件中分组关系的。

#### 存值和读值

配置文件对象建立之后你就可以很方便地存放一些值和读取值了。存值用 `setValue` 方法，取值用 `value` 方法。如下所示：

```python
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

```python
settings.setValue("editor/wrapMargin", 68)
```

如上例子所示 `/` 表示数据结构中的分组，如果有很多值都有相同的前缀，也就是同属一组，那么可以使用beginGroup方法和endGroup方法来管理。如下所示：

```python
settings.beginGroup("editor")
settings.setValue("wrapMargin", 68)
settings.engGroup()
```



## QWebEngine

之前Qt的QtWebkit现在都改名叫做QWebEngine了，这次迁移的详细信息请参看 [这个网页](https://doc.qt.io/qt-5/qtwebenginewidgets-qtwebkitportingguide.html) 。利用QWebEngine相关技术我们可以在Qt桌面程序上使用html5相关编程，其等于是一个内嵌的Chromium浏览器核心，具体细节不详，但大体是这个意思。

一个简单的使用如下所示：

```python
        self.webview = QWebEngineView()
        self.webpage = QWebEnginePage()
        self.webview.setPage(self.webpage)
        url = QUrl.fromLocalFile(
            resource_filename("yaogua", "html_resource/zhou_yi_yao_gua.html"))
        self.webview.load(url)
```

其中QWebEngineView继承自QWidget，然后QWebEnginePage可以对页面进行一些额外的操作。上面的代码片段是QWebEngineView加载load了某个html文件。

更详细的使用请查看相关官方API文档，此外我编写的这个 [github项目](https://github.com/a358003542/yaogua) 也可以作为参考。



-------------



## 快捷键和Tab键管理

### 什么是伙伴关系

一般是通过QLabel的setBuddy方法来关联某个输入窗体。然后QLabel有一个快捷键，当你按下这个快捷键，输入焦点就会转到这个QLabel对应的伙伴输入窗体上。

### 快捷键

QShortcut类

### QKeySequence

`QKeySequence` 类是快捷键的解决方案。比如可以直接引用 `QKeySequence.Open` 来表示快捷键Ctrl+O。可用的构造函数如下所示：

```python
QKeySequence(QKeySequence.Print)
QKeySequence(tr("Ctrl+P"))
QKeySequence(tr("Ctrl+p"))
QKeySequence(Qt.CTRL + Qt.Key_P)
```

字母按键就是类似 `Qt.Key_W` 这样的形式，Shift按键是Qt.SHIFT，Meta按键是Qt.META，CTRL按键是 `Qt.CTRL` ，ALT按键是 `Qt.ALT` 。

## pyinstaller制作exe

### 简介

所谓的exe制作也就是把你写python程序freeze起来，这样目标机器上用户没有安装python或者等等其他依赖都能正常运行程序。

推荐使用pyinstaller。 pyinstaller的官网在 [这里](http://www.pyinstaller.org/) 。安装就是用pip安装即可。

然后推荐在你的项目根目录下创建一个简单的启动脚本，一方面方便平时测试，一方面作为pyinstaller的程序入口。

**NOTICE:**  注意该脚本的名字不要和你的程序的模块名字相同，之前我安装后闪退就是因为这个脚本名字没取好。

具体使用很简单：

```text
pyinstaller you_entry_point.py
```

当然该脚本文件不一定在当前目录下，你也可以如下来指定目标脚本文件：

```
pyinstaller yaogua\gui.py
```

如果一切顺利，到 `dist` 文件夹下运行你的目标程序exe运行正常，一切都OK，那么恭喜你了。没必要继续往下看了。如果出问题了，那么请钻研官方文档吧，下面也会做出一些补充说明。

首先你不能依靠自动生成的 `.spec` 文件了，接下来讨论了很多定制都是基于对这个 `.spec` 文件的修改。修改好了之后你后面要运行pyinstaller需要如下运行了：

```text
pyinstaller you_entry_point.spec
```



### 输出单个exe文件

一般桌面端程序和较大型的项目是不推荐输出单个exe文件的，而对于一些小型的项目或者命令行工具，输出单个exe文件有时是很便捷的。然后在某些情况下你可能会遇到找不到python3.*.dll之类的错误，那么这个时候是一定要采用输出单个exe文件的方案的。

对于输出单个exe文件方案的spec文件，你先如下生成最基本的spec文件：

```
pyinstaller -F you_entry_point.py
```

然后接下来就是对该spec文件进行一些定制工作了。



### 环境配置和使用建议

你的python项目推荐使用虚拟环境，只安装必要的python依赖。然后python系统最好没有安装pyside2之类的模块，免得有干扰。然后你的pyinstaller安装在虚拟环境里面，一切命令执行也在虚拟环境里面。

这既有可能避免某些pyinstaller的bug和问题，也会减少你的安装包大小。

### 不弹出那个cmd窗口

在 `exe=EXE` 那里修改 `console` 字段为 `False` ，这样生成的exe在执行时将不会再弹出那个cmd窗口了。

### 修改输出exe名字

在`exe=EXE` 那里修改 `name` 字段来修改目标输出exe的名字。

### 检查python包依赖情况

一般pyinstaller输出之后很多时候出问题是python包依赖没有正确检测到，通过查看`build/{name}/xref-{name}.html` 这个文件来确认python包依赖是否都加载进去了，没有则修改`a = Analysis` 下的 `hiddenimports` 字段，将缺失的模块名加入进去。



### 添加额外的文件

spec文件下配置 `datas` 这个列表值：

```text
datas=[ ('src/README.txt', '.') ],
```

大概意思是把那里的那个文件copy到目标dist文件夹的那里。

### python包里面的数据文件

推荐都规范为使用 `pkg_resources` 来管理：

```
from pkg_resources import resource_filename
```

但是这样你的数据文件exe程序还是不能使用的，你需要按照上面做的添加额外的文件，来把各个文件添加进去，比如：

```
             datas=[('yaogua/html_resource','yaogua/html_resource'),
             ('yaogua/yaogua.json','yaogua')],
```

上面是把yaogua模块的html_resource下的所有文件内容都复制到dist文件夹下的对应软件名的yaogua的html_resource那里，这样使用 `resource_filename` 引用路径仍是可行的可用的。


## 用nsis制作安装程序

nsis安装程序是free的，通常制作一个简单的安装程序稍微熟悉学习一下够用了。

首先你需要下载 nsis基本程序，推荐到 [这里](https://nsis.sourceforge.io/Main_Page) 下载 。

然后推荐下载 [HM NIS Edit](http://hmne.sourceforge.net/) 这个简单的程序，这个程序可以向导式生成一个nsi脚本文件。具体nsi文件的编写倒不一定要在哪里编写。

**NOTICE** HM NIS Edit 这个软件界面不推荐选择中文，输出的文件编码会是GBK的，这和现在通用的UTF8编码很不兼容了。

利用HM NIS Edit填写一些信息，这个具体倒是很直观，没什么好说的。生成的脚本到另外的编辑器上一般还要做一些进一步的修改。这个脚本刷文件夹所有的文件变动还是很方便的。

### 学习模板

下面这个是利用HM nis edit 软件自动生成模板然后做了一些修改，放在下面方便学习。

```
; Script generated by the HM NIS Edit Script Wizard.

; HM NIS Edit Wizard helper defines
!define PRODUCT_NAME "timer"
!define PRODUCT_VERSION "1.3.1"
!define PRODUCT_PUBLISHER "wanze"
!define PRODUCT_DIR_REGKEY "Software\Microsoft\Windows\CurrentVersion\App Paths\timer.exe"
!define PRODUCT_UNINST_KEY "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}"
!define PRODUCT_UNINST_ROOT_KEY "HKLM"

; MUI 1.67 compatible ------
!include "MUI2.nsh"

; MUI Settings
!define MUI_ABORTWARNING
!define MUI_ICON "dist\timer\timer.ico"
!define MUI_UNICON "dist\timer\timer.ico"

; Welcome page
!insertmacro MUI_PAGE_WELCOME
; License page
!insertmacro MUI_PAGE_LICENSE "LICENSE.txt"
; Directory page
!insertmacro MUI_PAGE_DIRECTORY
; Instfiles page
!insertmacro MUI_PAGE_INSTFILES
; Finish page
!define MUI_FINISHPAGE_RUN "$INSTDIR\timer.exe"
!insertmacro MUI_PAGE_FINISH

; Uninstaller pages
!insertmacro MUI_UNPAGE_INSTFILES

; Language files
!insertmacro MUI_LANGUAGE "English"

; MUI end ------

Name "${PRODUCT_NAME} ${PRODUCT_VERSION}"
OutFile "timer_setup.exe"
InstallDir "$PROGRAMFILES\Timer"
InstallDirRegKey HKLM "${PRODUCT_DIR_REGKEY}" ""
ShowInstDetails show
ShowUnInstDetails show

Section "MainSection" SEC01
  SetOutPath "$INSTDIR"
  SetOverwrite try
  File "dist\timer\*.dll"
  File "dist\timer\base_library.zip"
  File "dist\timer\timer.ico"
  File "dist\timer\*.pyd"
  File /r "dist\timer\PySide2"
  File /r "dist\timer\shiboken2"
  File "dist\timer\timer.exe"
  CreateDirectory "$SMPROGRAMS\timer"
  CreateShortCut "$SMPROGRAMS\timer\timer.lnk" "$INSTDIR\timer.exe" "" "$INSTDIR\timer.ico"
  CreateShortCut "$DESKTOP\timer.lnk" "$INSTDIR\timer.exe" "" "$INSTDIR\timer.ico"
  File "dist\timer\timer.exe.manifest"
SectionEnd

Section -AdditionalIcons
  CreateShortCut "$SMPROGRAMS\timer\Uninstall.lnk" "$INSTDIR\uninst.exe"
SectionEnd

Section -Post
  WriteUninstaller "$INSTDIR\uninst.exe"
  WriteRegStr HKLM "${PRODUCT_DIR_REGKEY}" "" "$INSTDIR\timer.exe"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "DisplayName" "$(^Name)"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "UninstallString" "$INSTDIR\uninst.exe"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "DisplayIcon" "$INSTDIR\timer.exe"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "DisplayVersion" "${PRODUCT_VERSION}"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "Publisher" "${PRODUCT_PUBLISHER}"
SectionEnd


Function un.onUninstSuccess
  HideWindow
  MessageBox MB_ICONINFORMATION|MB_OK "$(^Name) was successfully removed from your computer."
FunctionEnd

Function un.onInit
  MessageBox MB_ICONQUESTION|MB_YESNO|MB_DEFBUTTON2 "Are you sure you want to completely remove $(^Name) and all of its components?" IDYES +2
  Abort
FunctionEnd

Section Uninstall
  Delete "$INSTDIR\uninst.exe"
  Delete "$INSTDIR\*.pyd"
  Delete "$INSTDIR\*.dll"
  Delete "$INSTDIR\timer.exe.manifest"
  Delete "$INSTDIR\timer.exe"
  RMDir /r "$INSTDIR\shiboken2"
  RMDir /r "$INSTDIR\PySide2"
  Delete "$INSTDIR\timer.ico"
  Delete "$INSTDIR\base_library.zip"
  Delete "$SMPROGRAMS\timer\Uninstall.lnk"
  Delete "$DESKTOP\timer.lnk"
  Delete "$SMPROGRAMS\timer\timer.lnk"

  RMDir "$SMPROGRAMS\timer"
  RMDir "$INSTDIR"

  DeleteRegKey ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}"
  DeleteRegKey HKLM "${PRODUCT_DIR_REGKEY}"
  SetAutoClose true
SectionEnd
```



### 一些基本信息

下面是定义软件名，软件版本号和软件出版人这些基本信息。

```
!define PRODUCT_NAME "yaogua"
!define PRODUCT_VERSION "0.1.1"
!define PRODUCT_PUBLISHER "wanze"
```



### 界面语言选择

之前如下这样设置是可行的：

```text
!insertmacro MUI_LANGUAGE "SimpChinese"
```
繁体中文是 `TradChinese` 。

但是最近我将我的win10系统全局设置为UTF8编码之后，其安装界面成乱码了。可能nsis的中文编码默认不是utf8的。稳妥起见还是选择英语吧，这肯定不会出现恼人的乱码问题：

```
; Language files
!insertmacro MUI_LANGUAGE "English"
```



### 快捷方式加图标
用上面提到的工具自动生成的nsi脚本，默认的快捷方式向导是没有加上图标的，你可以如下加上图标：
```text
  CreateShortCut "$SMPROGRAMS\timer\timer.lnk" "$INSTDIR\timer.exe" "" "$INSTDIR\myapp.ico"
```

第三个参数是可选的，命令行参数，没啥好填的。最后一个参数就是设置图标的，具体图标注意要填在文件复制到目的地操作之后，填写的值也是复制的目的地那边的哪里。

### `PRODUCT_DIR_REGKEY`

这个应该是向windows系统注册本软件的安装目录：

```
!define PRODUCT_DIR_REGKEY "Software\Microsoft\Windows\CurrentVersion\App Paths\yaogua"
```

默认的输出似乎有时exe会指错。

### OutFile

OutFile会控制你的输出exe的名字。

```
Name "${PRODUCT_NAME} ${PRODUCT_VERSION}"
OutFile "yaogua_Setup.exe"
InstallDir "$PROGRAMFILES\yaogua"
InstallDirRegKey HKLM "${PRODUCT_DIR_REGKEY}" ""
```

### 设置安装图标和删除图标

```
!define MUI_ICON "app.ico"
!define MUI_UNICON "app.ico"
```

这个应该是那个安装程序和那个删除程序 `uninst.exe` 的图标，前面提到的 `CreateShortCut` 是一些快捷方式的图标，比如桌面快捷方式。

###  !define

定义了一个全局变量，后面可以通过 `${what}` 这样的格式来引用。

### 使用Modern UI

```
!include "MUI2.nsh"
```

具体看它的 [文档](https://nsis.sourceforge.io/Docs/Modern%20UI%202/Readme.html) ，这里做了一下修改，现在是版本2了。

#### MUI_ABORTWARNING

当用户想要关闭安装程式则弹出一个页面。

```
!define MUI_ABORTWARNING
```
#### MUI_ICON

设置安装程式的图标

```
!define MUI_ICON "dist\timer\timer.ico"
```
#### MUI_UNICON

设置卸载时程序的图标

```
!define MUI_UNICON "dist\timer\timer.ico"
```
#### 插入页面

如下插入页面，程序将会按照写入的顺序来展示页面。

```nsis
; Welcome page
!insertmacro MUI_PAGE_WELCOME
; License page
!insertmacro MUI_PAGE_LICENSE "LICENSE.txt"
; Directory page
!insertmacro MUI_PAGE_DIRECTORY
; Instfiles page
!insertmacro MUI_PAGE_INSTFILES
; Finish page
!define MUI_FINISHPAGE_RUN "$INSTDIR\timer.exe"
!insertmacro MUI_PAGE_FINISH
```

```
!define MUI_FINISHPAGE_RUN "$INSTDIR\timer.exe"
```

这一行定义了用户最后完成页面选择打开程序具体是打开的那个程序。

```
; Uninstaller pages
!insertmacro MUI_UNPAGE_INSTFILES
```

这一行说明卸载程序只有一个页面。

#### 设置语言

```
!insertmacro MUI_LANGUAGE "English"
```

可以设置多语言，后面再讨论，这里就采用默认的英语。

### Name

设置安装程序的名字，后面可以使用 `$(^Name)` 来引用这个变量。

```
Name "${PRODUCT_NAME} ${PRODUCT_VERSION}"
```

### OutFile

设置安装程序的输出文件名。

### InstallDir

设置默认的安装路径。

```
InstallDir "$PROGRAMFILES\Timer"
```
### InstallDirRegKey

试着从注册表来查找这个值，找到则会以该值为新的InstallDir。

```
InstallDirRegKey HKLM "${PRODUCT_DIR_REGKEY}" ""
```
### ShowInstDetails

设置是否显示安装细节。

```
ShowInstDetails show
```

### ShowUnInstDetails

设置是否显示卸载细节。

```
ShowUnInstDetails show
```

### Section
```nsis
Section "MainSection" SEC01
  SetOutPath "$INSTDIR"
  SetOverwrite try
  File "dist\timer\*.dll"
  File "dist\timer\base_library.zip"
  File "dist\timer\timer.ico"
  File "dist\timer\*.pyd"
  File /r "dist\timer\PySide2"
  File /r "dist\timer\shiboken2"
  File "dist\timer\timer.exe"
  CreateDirectory "$SMPROGRAMS\timer"
  CreateShortCut "$SMPROGRAMS\timer\timer.lnk" "$INSTDIR\timer.exe" "" "$INSTDIR\timer.ico"
  CreateShortCut "$DESKTOP\timer.lnk" "$INSTDIR\timer.exe" "" "$INSTDIR\timer.ico"
  File "dist\timer\timer.exe.manifest"
SectionEnd

Section -AdditionalIcons
  CreateShortCut "$SMPROGRAMS\timer\Uninstall.lnk" "$INSTDIR\uninst.exe"
SectionEnd

Section -Post
  WriteUninstaller "$INSTDIR\uninst.exe"
  WriteRegStr HKLM "${PRODUCT_DIR_REGKEY}" "" "$INSTDIR\timer.exe"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "DisplayName" "$(^Name)"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "UninstallString" "$INSTDIR\uninst.exe"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "DisplayIcon" "$INSTDIR\timer.exe"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "DisplayVersion" "${PRODUCT_VERSION}"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "Publisher" "${PRODUCT_PUBLISHER}"
SectionEnd
```

这个Section...SectionEnd定义了一个Section区块，具体来说就是安装动作的不同安装部分，上面这个是简单的情况，虽然分成了几个Section，但后面两个因为section_name前面加上了`-` ，那么这个section是默认安装，用户不可控制的，所以只剩下一个section为主Section了，然后section_name名字都是随意的，包括这里的 MainSection 也只是一个惯例，section_name唯一的例外就是 `Uninstall`  必然表示卸载动作Section。

#### SetOutPath

设置安装的输出路径

```
SetOutPath "$INSTDIR"
```

#### File

将某些文件移过去，支持如下的 `*` 通配选择。

```
File "dist\timer\*.dll"
```

#### CreateDirectory

新建一个文件夹。下面这个 `$SMPROGRAMS` 是你的程序在应用程序开始菜单上的位置，比如下面这个具体对应的文件夹是：

```
C:\Users\wz-game\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\timer
```



```
CreateDirectory "$SMPROGRAMS\timer"
```
#### CreateShortCut

新建一个快捷方式，具体链接到那个文件，第三个参数是启动该程序时额外的一些参数，第四个参数是设置图标。

```
  CreateShortCut "$SMPROGRAMS\timer\timer.lnk" "$INSTDIR\timer.exe" "" "$INSTDIR\timer.ico"
```

#### WriteUninstaller

输出卸载的exe文件。

```
  WriteUninstaller "$INSTDIR\uninst.exe"
```
#### WriteRegStr

这里进行了一些注册表的填写工作。

```
  WriteRegStr HKLM "${PRODUCT_DIR_REGKEY}" "" "$INSTDIR\timer.exe"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "DisplayName" "$(^Name)"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "UninstallString" "$INSTDIR\uninst.exe"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "DisplayIcon" "$INSTDIR\timer.ico"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "DisplayVersion" "${PRODUCT_VERSION}"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "Publisher" "${PRODUCT_PUBLISHER}"
```

#### Delete

卸载删除文件

#### RMDir

卸载删除文件夹，可以加上 `/r` 参数递归删除该文件夹所有内容。

```
  RMDir /r "$INSTDIR\shiboken2"
```

#### DeleteRegKey

注册表字段删除

````
  DeleteRegKey ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}"
````



