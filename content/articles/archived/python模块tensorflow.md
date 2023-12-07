Date: 20230309
Slug: python-module-tensorflow

[TOC]

### tensorflow hello world

本文档记录关于tensorflow模块学习中的一些东西。

tensorflow是通用的数据流计算图框架，一般我们都会写上一个简单的hello world例子来简单了解一下目标框架：

```python
h = tf.constant('hello')
w = tf.constant(' world.')

hw = h + w

with tf.Session() as s:
    res = s.run(hw)

print(res)
```



`tf.constant` 表示一个常量，简单理解就相当于一个不断输出某个数值的节点。hw将两个常量相加，相当于连接两个节点执行了相加操作。tensorflow有个计算图的概念，在这个计算图中，具体计算只有在session回话实际 `run` 的时候才会执行：

```python
with tf.Session() as sess:
    do something
```





### 神经网络结构

1. 神经元中的数据，或者是输入的，或者是常数，其后神经元的数据则是在数据流动中生成出来的。
2. 神经元的连接用权重矩阵表示，某个节点神经元中的数据值 = 前输入层 * 权重矩阵，用数学公式表达可能更好：

$$
data = 
\begin{bmatrix}
x1 & x2 & x3
\end{bmatrix}

\begin{bmatrix}
w1\\ 
w2\\ 
w3
\end{bmatrix}
$$

第二个神经元的权重在第二列展开，

1. 一层一层之间的连接用矩阵乘法表示，即

```
a = tf.matmul(x, w1)
y = tf.matmul(a, w2)
```

前一层的输出就是后一层的第一个输入参数。



### 变量

用 `tf.Variable` 来定义一个变量，变量相当于一个节点其内数据值是变动的。我们可以用 `tf.assign` 来手动给某个变量赋值。



### placeholder

`tf.placeholder` 占位节点，和常量相比这个节点暂时还没有数据，是等后面在session 启动之后将通过`feed_dict` 把数据塞进去。通常外面的数据流输入就输入到placeholder哪里。

`tf.placeholder(dtype, [None, dim])` 这里None的意思是不确定要输入多少个数据，后面的dim指定具体输入数据的个数。

   

### 初始所有变量

```python
with tf.Session() as sess:
    init_op = tf.global_variables_initializer()
    sess.run(init_op)
```