Slug: dask-module
Date: 20190922

[TOC]

## 前言

总的说来对于python生态圈来说，大数据解决方案我是推荐dask多于pyspark。接触pyspark之后最大的痛苦就是，之前学习机器学习积累下来的numpy，pandas，sklearn的知识，全部不能继续使用了。而dask作为python的大数据解决方案，不说完全无缝对接，这也是不现实的，毕竟到了大数据那块，不说其他东西，就是你要应对的变量，也必然是惰性加载和惰性求值的，这也是一个区别点。但总的给我的感觉就是，作为python爱好者，之于大数据解决方案，dask真的用的很爽。

dask的官方文档写的很厚实，主要是这块东西也多。本文作者尽我所知简要地说下个人使用经验吧。其他深入研究还是要读者去研究 [官方文档](https://docs.dask.org/en/latest/) 的。



## 大数据hadoop简介

现在的hadoop2的架构大概如下所示：

![img]({static}/images/大数据/HADOOP.png)

底层是hadoop分布式文件系统作为大数据的文件存储支持。HDFS的基本架构如下图所示：

![img](http://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-hdfs/images/hdfsarchitecture.png)

然后中层是YARN对计算资源进行调度分配。YARN的基本架构如下图所示：

![img](http://hadoop.apache.org/docs/stable/hadoop-yarn/hadoop-yarn-site/yarn_architecture.gif)

如上图所示，Yarn有一个Scheduler，也就是Resource Manager 进行资源调度，然后还有很多 个worker，也就是Node Manager进行实际的应用计算任务。

而最高层MapReduce框架是分布式应用程序的一个支持性框架，现在Hadoop2可扩展性很好，dask，spark等这些框架都是可以运行在Yarn之上的。



## dask简介

dask主要由两部分组成：

1. 基于计算优化的动态调度 
2. 大数据级别的集合

简单来说就是dask基于python常见的那些数据类型概念，比如array，dataframe，进行大数据级别的集合扩展，其有很多个worker和一个scheduler，调度器主要负责计算调度，调度器面临的最小计算单位是所谓的partition，这个partition会分散在不同的worker中，具体这些worker会利用相同的python环境，来进行某些计算。

dask的安装就python模块来说不是难点所在，这一块难点主要在大数据环境的搭建上。如果你们大数据工作组已经将环境搭建好了，那么利用dask-yarn还是很容易进行dask的分布式任务的分发工作的。





## dask-yarn

dask连接yarn集群

```python
from dask_yarn import YarnCluster
from dask.distributed import Client

# Create a cluster where each worker has two cores and eight GiB of memory
cluster = YarnCluster(environment = 'environment.tar.gz',
                      worker_vcores=w_cores,
                      worker_memory=w_mem,
                      scheduler_vcores=s_cores,
                      scheduler_memory=s_mem,
                      name=app_name,
                      worker_env={'ARROW_LIBHDFS_DIR': libhdfs_env})
# Scale out to ten such workers
cluster.scale(10)

# Connect to the cluster
client = Client(cluster)
```

基本的连接过程如上所示，你需要安装 `dask-yarn` 模块，然后连接的时候参数

- environment 你的分布式应用程序的python环境包，你可以激活虚拟环境下运行 `venv-pack` 命令来打包之。
- worker_vcores 申请分配应用资源worker cpu 核数
- worker_memory 申请分配应用资源worker 内存数
- scheduler_vcores 申请分配应用资源scheduler cpu 核数
- scheduler_memory 申请分配应用资源scheduler 内存数
- name 申请分配资源的应用名字
- work_env 这里是大数据组配置好了hadoop的环境变量



### 实际调整worker资源

最开始是没有实际开启worker资源的。

```
cluster.scale()
```

然后可以跟个数字，其会自动决定是 `scale_up` 还是 `scale_down` 。

### 关闭应用释放资源

似乎cluster的关闭动作会申请自动释放你在hadoop集群上申请的资源，但任何非正常推荐都可能导致申请的应用资源仍占在哪里的。更保险起见是确保异常之后总能够执行:

```
cluster.shutdown()
```

### 强制关闭某个应用

```
 dask-yarn kill application_1538148161343_0051
```



## dataframe最佳实践

1. 如果你的机器内存够用，那么应该直接使用pandas。
2. 代码在运算过程中，如果能够转到pandas，那么也应该尽早转到pandas。
3. pandas的优化：避免apply，使用向量化操作，用分类等。这些对dask的dataframe都有效。尤其是向量化的操作风格，这个初学pandas的人很容易忽视。
4. 将某一列设置为索引index，某些沿着这个列的操作将会加速，比如说沿着这个列的loc，groupby，join or merge。
5. 上面提到的 `set_index` 是很昂贵的操作，你需要确认这有必要，此外不要频繁这样设置索引操作，最好后面再persist 一下。
6. 聪明的persist 推荐采用如下写法来节省占用内存：

```
df = client.persist(df)  # replace your old lazy DataFrame
```

7. 设置合理的分区数 分区数太大太小都不好 
8. 数据存为apache parquet文件格式



## dataframe的map_partitions 返回值

参考了 [这个网页](<https://stackoverflow.com/questions/40662912/python-dask-dataframe-map-partitions-return-value>) 。

1. 如果函数返回的标量，那么map_partitions 返回的是 dask Series object
2. 如果函数返回的是pd.Series object， 那么 map_partitions 会将这些 Series 对象连接起来，返回的也是 dask Series object。
3. 如果函数返回的pd.DataFrame object ，那么map_partitions 会将这些Dataframe连接起来，沿着axis=0，也就是纵向，返回的是dask DataFrame对象。

## dask单机版

dask单机版在熟悉dask命令和基本调试代码上还是很有用的，不需要做任何配置就是dask单机版。

按照官方文档，单机版也分为单机调度或分布式调度两种，官方文档推荐如下采用分布式调度，说有更好的诊断功能等。

```
from dask.distributed import Client, LocalCluster
cluster = LocalCluster()
client = Client(cluster)
```

似乎现在只能在linux上运行了。



单机版的线程调度中还是有所区别的：

- 相同的进程中用多个线程 【】 默认是dask.array dask.dataframe dask.delayed

scheduler="threads"

- 分开的进程处理 默认是dask.bag

scheduler="processes"

- 单线程式

scheduler="single-threaded"





## 参考资料

1. [dask官方文档](https://docs.dask.org/en/latest/)