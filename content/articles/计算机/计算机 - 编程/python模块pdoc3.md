Slug: python-module-pdoc3
Date: 20241113
Modified: 20241113

[TOC]


## pdoc3
python第三方模块 `pdoc3` 是一个自动生成python模块项目的API说明文档的支持性模块. 更多信息请参看 [官方文档](https://pdoc3.github.io/pdoc/doc/pdoc/).

用pip安装如下:

```
pip install pdoc3
```

该模块主要提供了 `pdoc` 命令行工具, 可通过 `pdoc --help` 来简单了解下该命令行工具.


## 用法一: 查看网页文档
下面的pywander是样例模块名,  `--http :` 默认是 `localhost:8080`. 这样在网页端打开`localhost:8080`, 就可以看到生成的文档的网页了,而且本地模块修改之后会自动更新.

 
```
pdoc --http : pywander
```

## 用法二: 输出html文档
下面的pywander为样例模块名, `--html` 是输出html模式, `--output-dir docs` 是输出的文件夹名.
```
pdoc --html --output-dir docs pywander
```


## 文档的编写
1. 请参看 [PEP257](https://peps.python.org/pep-0257/)
2. 文档最左边的缩进都会统一移除.
2. 文档支持markdown语法.
3. 文档不要在参数名上啰嗦, 尽可能用人类易懂的语言将一些你觉得必要的信息说明白.
4. 文档支持显示doctest代码.




