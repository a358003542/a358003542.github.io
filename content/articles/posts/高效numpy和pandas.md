[TOC]

## 高效numpy

### numpy总的来说比pandas快

如果一个计算，你发现需要的dataframe的values的值，来进行某些numpy运算，有时可能类似这样的语句不会报错：

```
np.dot(df['a'],x)
```

但是明确写上 `df['a'].values` 通常会让你的程序速度快上那么一点点。



### numpy的concatate比stack快

比如下面的程序：

```
import numpy as np
x = np.random.rand(1,1000)
```

```
%%timeit 

res = np.vstack([x for i in range(10000)])
```

```
50.7 ms ± 1.5 ms per loop (mean ± std. dev. of 7 runs, 10 loops each)
```

```
%%timeit 

res = np.concatenate([x for i in range(10000)], axis=0)
```

```
41.1 ms ± 697 µs per loop (mean ± std. dev. of 7 runs, 10 loops each)
```



### 避免numpy的copy操作而多用view

<https://ipython-books.github.io/45-understanding-the-internals-of-numpy-to-avoid-unnecessary-array-copying/>



## 高效Pandas

这里主要参考了 [这篇文章](<https://tomaugspurger.github.io/modern-4-performance>) ，这里有一系列关于如何更好的使用pandas的文章，价值很大。这里主要关注使用上speed up的问题。

### 多个相似结构的df合并推荐使用concat而不是append

pandas的dataframe任何长度改变操作都会引发copy操作，最好是先将数据合并成一个或者多个dataframe再concat【不推荐append，而一行行append显然就更加不推荐了】。

通常有很多类似数据源，比如多个csv文件等，需要将这些相似结构的df进行合并操作。这里推荐如下使用concat来做，而不是append：

```python
topk_all = pd.concat([topk_df, local_topk], ignore_index=True)
```

### 使用pandas的nlargest而不是排序之后取前几个

你如果需要找最大的几个值，那么推荐使用Dataframe的nlargest方法，这个方法经过优化了的，简单来说就是使用了快速排序的前半部分，这样会更高效。

### 不要用逐个索引操作风格

### 尽量不要用apply

### 向量操作风格最高效

这个优化建议主要参看了 [这篇文章](<https://engineering.upside.com/a-beginners-guide-to-optimizing-pandas-code-for-speed-c09ef2c6a4d6>) ，我们也可以多学习下这篇文章的分析问题测速的思路。

对pandas的某个列的所有值进行操作，如下的逐个索引风格：

```
    for i in range(0, len(df)):
        d = haversine(40.671, -73.985, df.iloc[i]['latitude'], df.iloc[i]['longitude'])
        distance_list.append(d)
```

这很慢，这样的代码不应该出现。 `iterrows` 写法如下：

```python
    haversine_series = []
    for index, row in df.iterrows():
        haversine_series.append(haversine(40.671, -73.985, row['latitude'], row['longitude']))
```

比上面的逐个索引稍微好点，但也不应该使用。如下apply写法稍微好点，但也尽量不使用：

```
df['distance'] = df.apply(lambda row: haversine(40.671, -73.985, row['latitude'], row['longitude']), axis=1)
```

pandas 最高效的操作风格是向量式操作，这需要你在定义函数的时候就习惯numpy的那种ndarray向量操作风格，上面的函数就是支持的：

```python
import numpy as np

# Define a basic Haversine distance formula
def haversine(lat1, lon1, lat2, lon2):
    MILES = 3959
    lat1, lon1, lat2, lon2 = map(np.deg2rad, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1 
    dlon = lon2 - lon1 
    a = np.sin(dlat/2)**2 + np.cos(lat1) * np.cos(lat2) * np.sin(dlon/2)**2
    c = 2 * np.arcsin(np.sqrt(a)) 
    total_miles = MILES * c
    return total_miles
```

这种写法需要我们对numpy的一些东西，尤其是向量操作很熟悉，这样我们直接把pandas的Series对象传递过去即可。

这种向量式写法及时和之前优化了的apply写法，也快了56倍。

```
df['distance'] = haversine(40.671, -73.985, df['latitude'], df['longitude'])
```

而如果我们直接使用numpy的ndarray对象，速度还将继续提升4倍：

```
df['distance'] = haversine(40.671, -73.985, df['latitude'].values, df['longitude'].values)
```

