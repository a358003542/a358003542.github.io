Slug: python-builtin-module-queue
Date: 20231019

[TOC]

### queue.PriorityQueue

queue.PriorityQueue 内部实现是基于heapq堆排序的，只是额外做了一些处理，从而保证操作是线程安全的。一般来说如果要实现一个优先级队列，推荐使用 PriorityQueue：

```python
from queue import PriorityQueue
q = PriorityQueue()
q.put((2, 'code'))
q.put((1, 'eat'))
q.put((3, 'sleep')) 
while not q.empty():
    print(q.get())
```

```
(1, 'eat')
(2, 'code')
(3, 'sleep')
```

### queue.Queue

这个是线程安全的先进先出【队列操作】数据结构。

```
from queue import Queue
q = Queue()
q.put('a')
q.put('c')
print(q.get())
print(q.get())
```

```
a
c
```



### queue.LifoQueue

这个是线程安全的后进先出【栈操作】的数据结构。

```
from queue import LifoQueue
q = LifoQueue()
q.put('a')
q.put('c')
print(q.get())
print(q.get())
```

```
c
a
```