Slug: python-builtin-module-dataclasses
Date: 20231019

[TOC]

### 构建一个dataclass类

python3.7新加入的dataclass类是一个很有用的特性，对于代码中的某些函数之间彼此传输的特定数据，可以如下构建一个dataclass类：

```
@dataclass
class InventoryItem:
    '''Class for keeping track of an item in inventory.'''
    name: str
    unit_price: float
    quantity_on_hand: int = 0
```

其大致效果等于：

```
def __init__(self, name: str, unit_price: float, quantity_on_hand: int=0):
    self.name = name
    self.unit_price = unit_price
    self.quantity_on_hand = quantity_on_hand
```

编写这样的dataclass类主要是让你的项目代码数据定义更加清晰化。

