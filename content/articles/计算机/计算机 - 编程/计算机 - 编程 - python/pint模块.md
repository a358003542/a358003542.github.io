Slug: pint-module
Tags:  python, pint
Date: 20201018

[TOC]



## 前言

如何表示物理量这个问题在各个科学学科研究中是一个很基本的问题，关于这一块python有很多模块，但这一块最好是有一个公用的解决方案以供其他具体科学学科的python模块来调用。

scipy模块有一个子模块constants，其提供了一些物理常数，不过这些物理常数具体就是一些数值，最好这些基本的物理常数作为物理量就是Quantity类。astropy是一个专门解决天文学方面问题的python支持模块，其有一个物理单位系统，然后里面的物理常数都是其内部定义的Quantity类，而其Quantity类是继承自np.ndarray的，个人觉得这依赖有点大了。当然它这么设计也是为了对numpy有很好的支持。然后chempy这个模块里面的单位系统依赖 [python-quantites](https://github.com/python-quantities/python-quantities) 这个模块，其Quantity类也是继承自np.ndarray。

pint模块在物理量表示这个问题上算是一个star数很多的模块了，其Quantity类并不是直接继承自np.ndarray，而是额外做了一些处理来对numpy进行了很好的支持。pint模块获得了我的青睐。

慢着，还有一个竞争者。sympy模块里面有一个专门解决物理量单位系统的子模块，其采用的方法和上面的都不一样，sympy模块主要用于符号计算的，其在处理物理量甚至用到了群论的方法，至少就目前个人学习化学研究的xchemistry项目来说实在有点大材小用了。

在决定选用pint模块之后，从astropy模块和chempy模块中可以看到关于具体学科的物理常数和物理量方面还是有一些额外的工作要做，这个后面再慢慢讨论。



## pint模块

pint模块就大的一个特色就是可定制性，就其模块本身来说只是提供了一个基本的处理物理量单位的逻辑，具体单位系统和相关运算的定义都是通过一种文本配置的形式展开的，比如：

```
@system SI
    second
    meter
    kilogram
    ampere
    kelvin
    mole
    candela
@end
```

上面这样的配置是刷单位系统的。

比如：

```
minute = 60 * second = min
hour = 60 * minute = hr
day = 24 * hour = d
week = 7 * day
```

就基本的使用如下：

```
>>> from pint import UnitRegistry
>>> unit = UnitRegistry()
>>> d = 3* unit.meter + 4*unit.centimeter
>>> d
<Quantity(3.04, 'meter')>
>>> d.magnitude
3.04
>>> d.units
<Unit('meter')>
```

按照pint源码的写法，`UnitRegistry` 类  `SystemRegistry` 类，`ContextRegistry` 类， `NonMultiplicativeRegistry` 类和 `BaseRegistry` 类的各个初始化动作都执行了一遍。而且由于 `BaseRegistry` 类的元类加入这样的定制：

```
class RegistryMeta(type):
    def __call__(self, *args, **kwargs):
        obj = super().__call__(*args, **kwargs)
        obj._after_init()
        return obj
```

使得 `BaseRegistry` 类初始化动作还额外挂载了 `_after_init` 动作。这个额外的挂载动作主要的一句是：

```
        if self._filename == "":
            self.load_definitions("default_en.txt", True)
        elif self._filename is not None:
            self.load_definitions(self._filename)
```

其就是加载默认的definition文本。该文本定义的规则和语法都是pint模块自己定义的，大体如下：

### 定义unit

```
<canonical name> = <relation to another unit or dimension> [= <symbol>] [= <alias>] 
```

比如：

```
minute = 60 * second = min
```

然后：

```
second = [time] = s = sec
```

`[time]` 这个写法是说本单位是一个最基本的维度单位。

还有这种写法：

```
[velocity] = [length] / [time] = [speed]
```

这是定义衍生维度单位。

```
@alias meter = metro = metr
```

这是定义单位别名。

### 定义物理常数

```
speed_of_light = 299792458 m/s = c = c_0
```

这个speed_of_light实际上就是一个单位。

### 前缀支持

kilogram在定义文件里面是没有写的，不过也是可以直接使用的，因为其加入了下面这样的前缀支持语句：

```
kilo- =  1e3   = k-
```

然后发现kilograms最后也会读取为kilogram单位。

### 单位转换

```python
test_value = 2 * unit.L
assert test_value.to('meter ** 3').magnitude == pytest.approx(0.002, rel=1e-10)
```

具体就是使用to方法，还是比较智能的了，看的出来这个模块从设计后后面的分析计算花了很多心思的。

整个单位的转换和计算还有有效位数问题这个后面有时间再讨论。