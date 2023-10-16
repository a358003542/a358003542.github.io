Slug: python-module-matplotlib
Date: 20230309
Modified: 20231017

[TOC]

### matplotlib支持中文显示

比如下面的调配中文字体支持的，是matplotlib模块的外围操作，应该绘图前就要调配好的：

```python

def set_matplotlib_support_chinese(font='SimHei'):
    """
    设置matplotlib支持中文
    :param font:
    :return:
    """
    from matplotlib import rcParams

    rcParams['font.family'] = 'sans-serif'
    rcParams['font.sans-serif'].insert(0, font)  # 插入中文字体
    rcParams['axes.unicode_minus'] = False  # 用来正常显示负号
```

然后我们对之前pandas的绘图接口操作发现，除了传递必要的x，y数值进去外，还需要传一个 ax 变量过去，这个ax变量就是matplotlib绘图中所谓的 **axes** 概念。matplotlib在绘图的时候是先确定一个figure 图表对象，然后一个figure下面有一个或者多个axes 坐标系。然后一个axes下面可能有比如x y 等等多个axis 坐标轴。

因此官方教程也给出了，假如说我们有需求，对不同的数据绘制大致相似的图形，那么推荐的函数编写风格如下：

```python

def myplotter(ax, x, y, param_dict):
    """
    ax matplotlib ax object
    x data plot on x axis
    y data plot on y axis
    param_dict other kwargs

    """
    out = ax.plot(x, y , **param_dict)
    return out
```

而外围ax的输出一般采用如下语法：

```
fig, ax = plt.subplots()
```

这是一幅图含一个坐标系，或者：

```
fig, (ax1, ax2) = plt.subplots(1,2)
```

这是一幅图含两个坐标系，坐标系布局是1row，2 col 。

```
fig, (ax1, ax2) = plt.subplots(2,1)
```

这是一幅图含两个坐标系，坐标系布局是2row，1col 。

而我们常看到的 `plt.show()` 也属于外围语句，这个是将你的图形在屏幕上显示，但如果你设置好其他backend，比如说jupyter notebook 上设置好：

```
%matplotlib notebook
```

那么不用这一句图形也会显示出来的。

具体建议查看 Axes 的源码来参考定制：

```
from matplotlib.axes._axes import Axes
```

但实际我们是没有必要写的如同那些内置方法一样复杂的，更多的是根据个人实际情况来简化定制，这样会更实用一些。

### 一个简单的折线图函数

```python
def line_plot1(ax, y_values, x_ticks, xlabel='', ylabel='', ylim=None, **kwargs):
    """
    绘制直线图
    :param ax:
    :param x:
    :param y:
    :param param_dict:
    :return:
    """
    if ylabel:
        ax.set_ylabel(ylabel)  # 设置y标签

    if xlabel:
        ax.set_xlabel(xlabel)  # 设置x标签

    x_values = np.arange(len(x_ticks))
    ax.set_xticks(x_values)  # 设置x标记
    ax.set_xticklabels(x_ticks)

    if ylim is not None:
        ax.set_ylim(ylim)  # 设置y轴范围
        
    out = ax.plot(y_values, **kwargs)
    return out
```

然后我们有：

```python
y_values = [2,2.1, 2.2, 2.1, 2.3, 2.4]
x_ticks = ['七月', '八月', '九月', '十月', '十一月', '十二月']
fig,ax = plt.subplots()
line_plot1(ax, y_values, x_ticks,xlabel='月份', ylabel='利润', ylim=(0,2.8))
```

这样数据和绘图部分基本上就分离了。

然后我们可以看下两个坐标系的情况：

```python
y_values = [2,2.1, 2.2, 2.1, 2.3, 2.4]
x_ticks = ['七月', '八月', '九月', '十月', '十一月', '十二月']
fig,(ax1,ax2) = plt.subplots(1,2)
line_plot1(ax1, y_values, x_ticks,xlabel='月份', ylabel='利润', ylim=(0,2.8))
line_plot1(ax2, y_values, x_ticks,xlabel='月份', ylim=(0,2.8))
```

如上面所示，matplotlib后面越玩越熟悉之后，就不再推荐使用pandas的绘图接口了，而应该统一到你定制的那些接口中去，因为慢慢的你的绘图函数，各个参数调配出来的风格，会越来越是你喜欢的那种样子了的。

下面我们将之前接触的那几个绘图都转成通用函数风格作为我们学习matplotlib绘图的入门吧。

### 饼图

```python
def pie_plot(ax, labels, sizes):
    """
    绘制饼状图
    :return:
    """
    ax.pie(sizes, labels=labels, autopct='%2.0f%%', startangle=90)
    out = ax.axis('equal')  # 确保画成一个圆
    return out

labels = ['其他', '射击', '动作', '策略', '体育']
sizes = [1500, 3500, 6000, 11500, 27500]
fig, ax = plt.subplots()
pie_plot(ax, labels, sizes)
```

### 水平条形图

```python
def barh_plot(ax, y_values, x_labels, xlabel='', ylabel='', **kwargs):
    """
    水平条形图
    :param ax:
    :return:
    """
    y = np.arange(len(x_labels))

    ax.set_yticks(y)
    ax.set_yticklabels(x_labels)

    if xlabel:
        ax.set_ylabel(xlabel)

    if ylabel:
        ax.set_xlabel(ylabel)

    out = ax.barh(y, y_values, align='center', **kwargs)
    return out
fig, ax = plt.subplots()
x_labels = ['北美洲', '南美洲', '欧洲', '亚洲', '大洋洲', '非洲', '南极洲']
y_values = [1500, 500, 1500, 2000, 1000, 500, 1]
barh_plot(ax, y_values, x_labels, ylabel='销量')
```

### 直方图

```python

def hist_plot(ax, y_values, x_bins, xlabel='', ylabel='', title='', **kwargs):
    """

    :param ax:
    :return:
    """
    if title:
        ax.set_title(title)
    if xlabel:
        ax.set_xlabel(xlabel)
    if ylabel:
        ax.set_ylabel(ylabel)
    out = ax.hist(x_bins[:-1], bins=x_bins, weights=y_values, **kwargs)
    return out
```





### 散点图

```python

def scatter_plot1(ax, X, xlabel='', ylabel='', title='', **kwargs):
    """
    散点图 输入X 第一列x 第二列 y
    :param ax:
    :param X:
    :return:
    """
    x_group = []
    y_group = []
    for x, y in X:
        x_group.append(x)
        y_group.append(y)
    if xlabel:
        ax.set_xlabel(xlabel)
    if ylabel:
        ax.set_ylabel(ylabel)
    if title:
        ax.set_title(title)

    out = ax.scatter(x_group, y_group, **kwargs)
    return out
X = np.array([[1.0, 1.1], [1.0, 1.0], [0, 0], [0, 0.1]])
fig, ax = plt.subplots()
scatter_plot1(ax, X)
```





