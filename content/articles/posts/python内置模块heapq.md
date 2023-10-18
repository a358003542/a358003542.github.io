Slug: python-builtin-module-heapq
Date: 20231019

[TOC]

### 查找多个最大最小元素的情况

如果只是想要获知某些数据的一个最大值或者一个最小值，那么当然用 `max` 或 `min` 方法就可以了。这里讨论的情况是如果你想要获知某些数据的多个最大值或多个最小值。一般想到的就是先对这些数据进行排序，然后进行切片操作。参考资料2的第一章第四节讨论的方法实际上是利用最小堆结构进行堆排序然后提出最大或最小的那个几个元素。

大体过程就是:
```
lst = [1, 8, 2, 23, 7, -4, 18, 23, 42, 37, 2]
import heapq
heapq.heapify(lst)
heapq.nlargest(3,lst)
heapq.nsmallest(3,lst)
```
