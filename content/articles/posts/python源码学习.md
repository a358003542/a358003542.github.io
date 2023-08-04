[TOC]

### 基本结构

- `Doc` 文档
- `Grammar` 计算机可理解的语言定义
- `Include` C的头文件
- `Lib` 用python写的python内置模块部分
- `Mac` macOs支持
- `Misc` 杂项
- `Modules` 用C写的python内置模块部分
- `Objects` 核心对象和类
- `Parser`  python解析器
- `PC` 对windows系统旧版本的编译支持
- `PCBuild` 对windows系统的编译支持
- `Programs` python命令行程序
- `Python` CPython解释器
- `Tools` 单独的一些有用的工具
- `m4` 定制脚本用于自动配置makefile

### 一个简单的C语言扩展

如上面所示，CPython首先是一个C语言实现的解释器，其次是由C语言写的核心对象和类，再就是用C写的内置模块，最后就是用python写的内置模块。python写的模块源码是直接可以拿来阅读的，而C语言写的内置模块这就是本小节要展示。下面将通过C语言来编写一个最简单的python模块。

`ctest.c` 文件内容如下：

```c
#define PY_SSIZE_T_CLEAN
#include <Python.h>
#include <stdio.h>

static PyObject *
ctest_hello(PyObject *self, PyObject *args) {
    char *str;

    /* Parse arguments */
    if(!PyArg_ParseTuple(args, "s", &str)) {
        return NULL;
    }

    printf("hello %s\n", str);

    return Py_None;
}

static PyMethodDef CtestMethods[] = {
    {"hello", ctest_hello, METH_VARARGS, "a simple say hello function."},
    {NULL, NULL, 0, NULL}
};


static struct PyModuleDef ctestmodule = {
    PyModuleDef_HEAD_INIT,
    "ctest",
    "a simple python module writing in c",
    -1,
    CtestMethods
};

PyMODINIT_FUNC PyInit_ctest(void) {
    return PyModule_Create(&ctestmodule);
}
```

setup.py 是用来编译该模块的：

```python
from distutils.core import setup, Extension


def main():
    setup(
        ext_modules=[
            Extension("my_python_module.ctest", ["src/ctest/ctest.c"])]
    )


if __name__ == "__main__":
    main()
```

读者可能注意到了，该模块是作为my_python_module的子模块引入进来的。然后正常打包安装：

```
python -m build
pip install dist\***.whl
```

```
>>> import my_python_module.ctest
>>> my_python_module.ctest.hello("world")
hello world
```

因为这里不是C语言教程，所以这里不会就C语言作过多讨论，而上面的ctest.c先请读者简单看一下，熟悉一下，后面我们再慢慢学习熟悉这其中的细节。



### 基础知识

python解释器的工作不是将你输入的python代码编译为机器码，而是一种中间语言：`bytecode` 。`.pyc`文件下存储的就是这样的字节码。

python语言规范使用的是EBNF（Extended-BNF）规范。

- `*` 重复
- `+` 至少重复一次
- `[]` 可选部分
- `|` 可供选择的部分
- `()` grouping

