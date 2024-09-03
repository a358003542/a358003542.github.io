Slug: python-builtin-module-textwrap
Date: 20231019

[TOC]

## textwrap模块

textwrap模块实现了编辑器常见的换行显示功能。默认 `width=70`  。

```python
from textwrap import fill
wrapped = fill(output)
```

fill函数等于：

```text
"\n".join(wrap(text, ...))
```
