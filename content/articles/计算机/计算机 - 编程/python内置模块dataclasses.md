Slug: python-builtin-module-dataclasses
Date: 20231019
Modified: 20241107

[TOC]

## dataclasses模块
本文简要介绍了python的内置模块dataclasses, 更多内容请参看 [官方文档](https://docs.python.org/zh-cn/3/library/dataclasses.html).

dataclasses主要提供了创建数据类的支持, 这种数据封装对象在某些需要传递特定格式数据包时非常有用.

如下所示:

```
@dataclass
class InventoryItem:
    '''Class for keeping track of an item in inventory.'''
    name: str
    unit_price: float
    quantity_on_hand: int = 0
```

其大体帮你实现了类似下面的 `__init__` 方法, 还有 `__repr__` 和其他方法的自动添加.

```
def __init__(self, name: str, unit_price: float, quantity_on_hand: int=0):
    self.name = name
    self.unit_price = unit_price
    self.quantity_on_hand = quantity_on_hand
```


## `__post_init__` 方法
定义一些初始化 `__init__` 方法之后的后处理动作, 这在某些情况下会有用. 比如上面定义默认值对于可变类型列表等是禁止的,这个时候你可以类似下面做:

```
    def __post_init__(self):
        if self.args is None:
            self.args = list()
```
