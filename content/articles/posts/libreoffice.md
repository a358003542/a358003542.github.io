Date: 20230309

[TOC]

## 求整列的最大值

下面是求得D列的最大值

```
= Max(D:D)
```

## 自动筛选

选择你想使用的数据区块，然后选择 `数据->自动筛选` 。

默认认为你的数据区块的第一行为标题头。

![img]({static}/images/2021/libreoffice_1.png)

这样你的整个数据区块可以根据标题头来进行升序和降序的排序操作了。

## 整列值是可选项

选择一列数据，然后点击菜单数据，然后选择数据有效性，然后选择允许列表，然后在条目下面定义你想要的值，则该列的值都是这些列表里面的可选值。

## 列值唯一性约束

选择一列数据，然后点击菜单数据，然后选择数据有效性，然后选择自定义，取消勾选允许空白单元格，加入如下公式：

```
COUNTIF(B:B,INDIRECT("B"&ROW()))=1
```

COUNTIF函数的第一个参数是数据区块，这里是B列的意思。

INDIRECT函数是间接取值。

ROW函数是取该单元格的行数，这里 `"B"&ROW()` 的意思比如说你当前正在输入B75单元格，则该值就是`B75` 。然后`INDIRECT("B"&ROW())` 就是B75单元格的值。

整个公式的意思是遍历B列，计算B列和你当前正在输入的单元格的值相同的单元格的数目，如果等于1则数据有效，否则数据无效。
