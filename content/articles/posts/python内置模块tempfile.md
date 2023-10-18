Slug: python-builtin-module-tempfile
Date: 20231019

[TOC]

## tempfile模块

tempfile模块用于创建临时文件或者临时文件夹，这个模块在所有系统平台上都能正常工作，有时还是很有用的。

比如windows系统下的临时文件夹所在：
```python
>>> import os
>>> os.name
'nt'
>>> import tempfile
>>> tempfile.gettempdir()
'C:\\Users\\a3580\\AppData\\Local\\Temp'
```
最核心的两个函数是 `mkstemp` 和 `mkdtemp` 。



### mkstemp

mkstemp函数用于新建一个临时文件

```python
fd, fpath = tempfile.mkstemp(dir=tmpdir)
with os.fdopen(fd, 'wb') as temp_cache_file:
    marshal.dump((self.FREQ, self.total), temp_cache_file)
```

返回的第二个参数就是目标临时文件的路径名，第一个文件参数比较特殊，是操作系统级别的文件句柄（应该是C语言那边的文件句柄吧），要转成一般使用的python文件对象如上所示，使用 `os.fdopen` 来打开。

