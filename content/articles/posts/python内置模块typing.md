Slug: python-builtin-module-typing
Date: 20231019

[TOC]

### typing.NamedTuple

这个类添加于python3.6，与 collections.namedtuple 非常类似。

```python
from typing import NamedTuple
class Car(NamedTuple):
    color: str
    mileage: float
    automatic: bool
car1 = Car(color='red',mileage=3512.5, automatic=True)
car1.color
```

总的说来我不赞同达恩·巴德尔的观点——推荐使用typing.NamedTuple ，因为namedtuple有比较优势和区分的是相对于字典，其有两个特点：一，key不可变；二，轻量级。在某些情况下使用namedtuple优于字典。但是如果采用类的写法，那么就换了一个情景了，我认为在这个情境下，NamedTuple和dict都不太合适，而类应该成为第一公民。
