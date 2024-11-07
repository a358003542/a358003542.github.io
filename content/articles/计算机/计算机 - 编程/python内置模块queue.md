Slug: python-builtin-module-queue
Date: 20231019
Modified: 20241106


[TOC]

## queue模块
本文主要简要介绍了python的内置模块queue, 更多内容请参看 [官方文档](https://docs.python.org/zh-cn/3/library/queue.html).

queue模块提供了

- Queue类, 先进先出队列
- LifoQueue类, 后进先出队列
- PriorityQueue类, 优先级队列

优先级队列可以设置队列内的数据如下:

```
from dataclasses import dataclass, field
from typing import Any

@dataclass(order=True)
class PrioritizedItem:
    priority: int
    item: Any=field(compare=False)
```

这几个Queue类都支持下面这些方法:

- put 放一个item 
- get 取一个item 阻塞式
- join和task_done join方法和task_done方法是联动的, 当一个item put进去之后会增加一个计数, task_done声明一次说已经消费了一个item, 主控程序join方法那里会阻塞, 直到每个put进去的item都声明了task_done为止.




