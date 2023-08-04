
[TOC]

本文对pandas模块的一些核心概念进行说明。

## 基本入门

pandas最核心的两个数据结构就是 Series 类和 DataFrame 类。其中DataFrame可能会用的偏多一点，Series相当于一维情况下较简单的DataFrame，有的时候会用到。本文重点讨论DataFrame类。

DataFrame之所以很常用是因为这种数据结构太常见了，在excel中，在csv中，在sql中，等等来源的数据都可以汇总成为DataFrame数据结构，然后进行一些后面必要的数据处理，包括送入机器学习或者深度学习的模型中去。



## 读写文件支持

pandas的io子模块写得很便捷，实际上我经常看到有些python程序员并不是在做数据处理，有时都会调用下pandas的io来做一些读写操作。

其大体有这些函数：

- read_csv    to_csv
- read_json   to_json
- read_html to_html
- read_excel to_excel
- read_sql to_sql

这其中，html的读写在网络抓取上有时可能有用，但不是很强大，还是推荐用专门的工具来做，sql的操作简单点可以用pandas那边的接口，但如果稍微复杂点还是推荐用sqlalchemy来做，这样写出来的代码可读性更好一些，orm层接口也更便捷写，代码里面全是一大堆sql语句，总不是太好的。



### 读csv文件

实际上我们可能更常遇到的是txt文件，还是用 read_csv 函数来读，只是需要做一些额外的配置，比如 [这个问题](https://stackoverflow.com/questions/21546739/load-data-from-txt-with-pandas) 里面的例子是这样的：

```
data = pd.read_csv('output_list.txt', sep=" ", header=None)
```

- sep 设置读取csv时每个字段的分隔，默认是逗号，我遇到过是 `\t` 作为分隔符的情况
- header 默认取csv的第一行作为df数据的作为各个列的列名，如果设置了 `names` ，也就是手动指定列名，那么header相当于设置了None，如果header设置了None，将不会读取第一行作为列名。

read_csv 有很多选项，应付初步加载csv数据进入df内是绝对没问题的了。

### 读excel文件

利用pd.read_excel来读excel文件里面的数据，这个功能需要安装 **xlrd** 模块。

### 读取html网页

读取html网页具体就是分析网页里面的table标签所在，然后刷table并将数据填充到df里面去。 `read_html` 我遇到的一个问题是它会自动分析里面的数值并将其转成整型、浮点型等，因为网页数据一般不是很规范，这个自动转换很可能不合你的心意。

我遇到这种情况后，分析源码后发现 `read_html` 这个函数并不能接受额外的参数，而你需要将 dtypes 传递进去，里面有个过程会判断是否有dtypes 传递进来，否则自动试着判断数据类型，主要是数值型。也就是首先你需要定制read_html函数，简单来说就是copy原代码然后加上 `**kwargs` 传递到 `_parse` 哪里。然后：

```
df = read_html(html, dtype=str)
```

这样就控制所有的数据都是字符串了，参考了 [这个网页](https://stackoverflow.com/questions/49684951/pandas-read-csv-dtype-read-all-columns-but-few-as-string)。

### 执行某个sql查询语句

使用pd.read_sql 来从某个sql查询语句中获取数据，其有第二个必填参数conn，可以利用sqlalchemy如下获得：

```
import sqlalchemy
data_source = sqlalchemy.create_engine('sqlite:///mydata.sqlite')
```



## 创建DataFrame对象

除了直接从文件读写创建DataFrame对象外，你还可以通过DataFrame类来直接生成DataFrame对象，如下所示：

### 直接加载python对象

这里支持的python对象有字典，或者已经是DataFrame了。

```python
data = {'state': ['Ohio', 'Ohio', 'Ohio', 'Nevada', 'Nevada', 'Nevada'], 
        'year': [2000, 2001, 2002, 2001, 2002, 2003], 
        'pop': [1.5, 1.7, 3.6, 2.4, 2.9, 3.2]}

frame = pd.DataFrame(data)
```

当然我们操作DataFrame通常的思路更偏向于一行一行的来，你也可以直接把类似于numpy的ndarray的结构的数据转成DataFrame对象：

```
pd.DataFrame([[1,2],[2,3]])
```

再比如：

### 新建一个随机数填充的DataFrame

新建一个DataFrame对象，随机数填充6行4列，列名分别为 `['a','b','c','d']` 。

```
df = pd.DataFrame(np.random.randn(6,4), columns=['a','b','c','d'])
```

上面的例子还演示了列名不用默认的0 1 ，而是你直接去指定。



### 选择合适的时机转入DataFrame

你需要选择一个合适的时机将你的python数据转入DataFrame中，通常这并不是越早越好。DataFrame更快更适合的是那些矩阵操作，或者所有元素都要进行的操作。而对于你的python数据的某个，或者某些的更改操作，并不是某一行，或者某一列的操作，这个时候用DataFrame你会发现很不方便。



## DataFrame基础



### DataFrame转ndarray

有的时候我们进行计算是希望以ndarray（numpy）的形式来进行的（我们引入DataFrame是因为其有label等等让各个列数据有含义的功能，而到了实际底层算法，可能就是特征1234了，我们不再关心具体特征的名字，这个时候将某部分数据退化为numpy的ndarray数据类型就很必要了，一方面底层算法层不在意这些，第二就是numpy的ndarray对象可以和以前我们常见的那些算法包括新出来的tensorflow很容易对接起来。）

实际转变如下，非常简单：

```
nd = df.values
```

参考了 [这个网页](https://stackoverflow.com/questions/13187778/convert-pandas-dataframe-to-numpy-array-preserving-index) 。



### DataFrame列重命名

在创建DataFrame对象时 `columns` 参数是设置列名的，DataFrame对象创建之后，你还可以如下所示修改列名。

```python
def set_columns(df, columns):
    """
    重新设置列名
    """
    df.columns = columns

def rename_column(df, origin_column_name, column_name):
    """
    将某个列名更改为某个名字
    默认的column 可用 0 1 2 来引用 数值型
    """
    d = {}
    d[origin_column_name] = column_name
    df.rename(columns=d, inplace=True)

def rename_columns(df, columns):
    """
    重新设置列名
    """
    df.rename(columns = columns, inplace=True)
    
def rename_column_by_index(df, index, column_name):
    """
    不知道列名是多少，只知道是第几列，将其修改为某个名字
    """
    df.rename(columns={df.columns[index]: column_name})
```



### DataFrame的append操作

有的时候你需要在现有的Datafrme后面额外添加一行或者几行数据，这个操作很普遍。

```
import pandas as pd
df = pd.DataFrame(columns=['a','b','c'])
df.append({'a':1}, ignore_index=True)
Out[7]: 
     a   b   c
0  1.0 NaN NaN

df.append([{'a':1},{'b':2}], ignore_index=True)
Out[8]: 
     a    b   c
0  1.0  NaN NaN
1  NaN  2.0 NaN
```

如果是上面字典的形式，那么是比如带上 `ignore_index=True` 参数的。此外还可以append pandas的 Series对象，如果Series对象有name属性，那么这个name将作为插入新的一行的index名字，否则也要带上 `ignore_index=True` 参数。







## 索引

### 按照列名选择

如果你已经定义列名了，那么选择一列按照列名是最直观的了：

```
df[column_name]
```

返回的是Series对象，原DataFrame对象的index部分继续保留，也就是原来你的DataFrame的index是有名字的，那么可以继续使用这些索引名字。

这种引用也可以用于添加某一列或者删除某一列：

```
del df[column_name]
df[column_name] = series
```

### 按照列名选择多个列

```python
df[['a','b','c']]
```

这样得到的将是一个copy！

### iloc方法

因为我是比较喜欢矩阵那种几行几列对于某一具体单元格的描述的，所以我很喜欢用 `df.iloc[i][j]` 这种形式来索引具体某个单元格的数据，就是i行j列，然后注意如果你的column是指定的数字，不是从0开始的，那么引用0就会出现索引异常【如果你的列名不是数字类型那么没有这个问题】。

唯一要注意的是就是和线性代数里面行列式下标有所不同，这里的索引都是从0开始计数的。

### 按照索引选择多个列

选择多个列【切片式】

```
df.iloc[:,0:2]
```

此外还有种写法【列举式】：

```
df.iloc[:, [0,2]]
```



### 对某一特征列进行某个运算

对于DataFrame中的某一特征列，其为Series对象，推荐使用 `map` 方法:

```python
df['commas'] = df['text'].map(lambda text: text.count(','))
```

参考了 [这个网页](<https://stackoverflow.com/questions/19798153/difference-between-map-applymap-and-apply-methods-in-pandas>) ，apply方法可以作用方向为行或者列，然后apply方法主要针对dataframe对象整体的操作。

### 搜索语句

DataFrame可以通过如下的搜索语句来对针对某些特征列的值进行判断，从而过滤掉某些行。

```
df[df['col1']==1]
df[(df['col1']==1)|(df['col2']==1)]
df[(df['col1']==0) & (df['col2']==0)]
```



### 按照行排序

```
df.sort_index(axis=1, ascending=False)
```

### 按照列排序

```
df.sort_values(by='B')
```







## 绘图相关

### 绘制散点图

```
DataFrame.plot.scatter(x, y, s=None, c=None, **kwds)
```

根据数据记录 x 列（由x参数指定）和 y 列（由y参数指定）的一一对应的数据，来绘制散点图。

