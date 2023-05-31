[TOC]

## 前言

sklearn的很多内容在机器学习相关文章中都有所提及，这里作为拾遗性质。



### 关于sklearn的pipeline

```
from sklearn.pipeline import Pipeline
from sklearn.pipeline import FeatureUnion
from sklearn.model_selection import GridSearchCV
```

Pipeline 用来创建sklearn数据处理流模型，FeatureUnion可整合多个特征。

sklearn的pipeline不是数据处理管道流的万能灵药，不是说所有的数据处理流都要写成pipeline模式。实际上pipeline里面的transformer和estimator都有一些限定，若一定要贯穿数据处理始终，是很不方便的。

1. pipeline里面的组件多接受X，机器学习中数据处理的核心数据矩阵
2. 调用pipeline 的fit 和 predict方法有一套固定作业模式，简单来说属于机器学习中常见的训练测试数据格式模式。fit的话, transformer 的 fit 和 transform方法都要执行一下，两个方法接受相同的X ，然后前面的transformer的transform方法返回的X是下一个transformer和fit接受的X。而pipeline的predict方法，前面的transformer的transform方法也都会执行一下，然后最后再执行estimator的predict方法。
3. 这套固定的作业模式，对于机器学习尤其是监督学习问题，是具有普适性的，而且利用pipeline，将所有数据预处理缩放整合进来，这样调用pipeline大模型的predict方法，直接输入原始test数据即可，这是很便捷的。但脱离了这个领域，进入其他数据处理需求，再来死套这个作业模式，就非常不合时宜了。
4. 用上sklearn的pipeline建模核心算法了，那么就不得不提一下 `GridSearchCV` 来进行参数优化选模。

### train_test_split

```
from sklearn.model_selection import train_test_split
```

如果你跟着某些老旧教材学习，那么就会发现sklearn的 `train_test_split` 函数真的非常方便。这个函数也很实用，就是在后期引入pipeline等概念，你都应该先进行训练集测试集的分开，然后才是进入机器学习的核心算法。

值得一提的是： train_test_split 输入的dataset是pandas的DataFrame，则返回的train_data 也是pandas的DataFrame数据类型。



### K折验证

```
from sklearn.model_selection import KFold
```

sklearn提供的K折验证也很实用。
K折验证集 形成K个数据输入组合，每个组合有一部分是验证集，其余部分是训练集，验证训练的比例是1: k-1
各个组合间验证集的选择不同

具体使用是选定好K折的系数K, 然后输入数据集。

```
kf = KFold(n_splits=2)

for train_index, test_index in kf.split(X):
    X_train, X_test = X[train_index], X[test_index]
    y_train, y_test = y[train_index], y[test_index]
```



### 交叉验证

```
from sklearn.model_selection import cross_val_score

"""

实行交叉验证计算验证得分的最简单的方法是 cross_val_score

scores = cross_val_score(model, train_data, train_labels, cv=4)

"""
```

