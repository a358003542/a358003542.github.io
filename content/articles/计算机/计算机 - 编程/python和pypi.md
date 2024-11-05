Slug: python-pypi
Date: 20191018
Modified: 20241104


[TOC]


### 前言
本文讨论的内容有如果要编写自己的python模块，并上传到pypi.org则需要了解的知识点。主要有setuptool模块的使用，pip命令行工具，如何在pypi上上传自己的模块和其他相关知识。

### setuptools

本章知识是我们理解前人编写的各个有用的模块包的基础，也是编写自己的模块包的基础。

请结合Github上的 [pyskeleton项目](https://github.com/a358003542/pyskeleton) 来阅读本章。

虽然官方内置distutils模块也能实现类似的功能，不过现在人们更常用的是第三方模块setuptools，其相当于distutils模块的加强版，初学者推荐就使用setuptools模块。更多内容请参看setuptools模块的 [官方文档](https://setuptools.readthedocs.io/en/latest/) 。

现在setuptools推荐使用`setup.cfg`来进行相关配置管理，而不是之前的 `setup.py` 里的 `setup` 函数。pypi生态圈和相关PEP规范在不断完善中，现在推荐使用 `build` 模块，运行 `python -m build` 来进行你项目的打包工作。

你首先需要新建一个 `pyproject.toml` 文件，指定本项目的安装环境，setuptools相关如下：

````
[build-system]
requires = ["setuptools", "wheel"]
build-backend = "setuptools.build_meta"
````

#### 小型模块项目
即使是非常小型的单python文件的模块，也推荐组织成为python的模块结构而不是通过`py_modules`来指定。

现在假定这里我们讨论的python模块名字是pyskeleton，如果该python模块很小型，则推荐采用如下结构：

```
----pyskeleton
  --__init__.py
  --another_file.py
  
setup.cfg
pyproject.toml
```

对应的setup.cfg文件内容大体如下：

```
[metadata]
name = pyskeleton
version = attr: pyskeleton.__version__
description = quickly create a python module, have some other good concern.
url=https://github.com/a358003542/pyskeleton
long_description = file: README.md
long_description_content_type=text/markdown

[options]
include_package_data = True
packages = pyskeleton
```

也就是直接将packages写上去即可。

**NOTICE:** packages这个关键词是setuptools模块继承自distutil模块的，**其不会进一步递归扫描该模块可能有的子模块**。也就是上面这个写法只能添加pyskeleton文件夹下的 `__init__.py` 文件和与其平行的一些python文件。如果你还希望在下面添加几个子模块，则参见下面的讨论。

#### 中型模块项目
```
----pyskeleton
  -- submodule1
    -- __init__.py
  -- submodule2
    -- __init__.py
  --__init__.py
  --another_file.py
  
setup.cfg
pyproject.toml
```

类似上面这样中型大小的python模块项目，如果子模块不是很多的话，那么你可以继续如下这样编写：

```
packages = 
  pyskeleton
  pyskeleton.submodule1
  pyskeleton.submodule2
```

显然这样子模块多于两个以上就显得很麻烦了，那么这时就推荐使用setuptools模块提供的find函数。

```
packages = find:
```

其会自动从根目录开始进行扫描，然后根据 `__init__.py` 是否存在来自动生成packages列表。这个时候就有一个注意事项：你的测试文件夹 tests 最好不要有 `__init__.py` 文件了，实际上利用pytest这样的测试辅助模块也是不需要 `__init__.py` 文件的。

然后有的时候你可能希望某个子模块不要添加进去了，反正有的时候就有这个需求，那么你可以加上 exclude 参数：

```
[options.packages.find]
exclude = my_python_module.backup
```
注意写法是你预期要添加进入packages列表的字段，然后排除掉。


#### 多python模块项目
绝大部分情况基本上就属于上面描述的哪两种了，但对于某些公司内部大型的复杂的python项目，可能会有多个python模块放在一个文件夹下，而且这里谈论的多个python模块的意思，就是多个python模块，比如requests和scapy这样完全不相干，不属于一个父模块名的独立的python模块，大体类似下面这样的文件夹结构：


```
----src
  ----pyskeleton
    --__init__.py
  ----other_module
    --__init__.py
    
setup.cfg
pyproject.toml
```


这种结构的 `setup.cfg` 大体内容如下所示：

```
[metadata]
name = pyskeleton
version = attr: pyskeleton.__version__
description = quickly create a python module, have some other good concern.
url=https://github.com/a358003542/pyskeleton
long_description = file: README.md
long_description_content_type=text/markdown

[options]
include_package_data = True
packages = find:
package_dir =
    = src

[options.packages.find]
where = src
include = pyskeleton

[options.entry_points]
console_scripts =
    pyskeleton = pyskeleton.__main__:main
```

首先来集中解释一下 `package_dir` 这个参数，这个参数实际上是从distuitl模块那边来的，上面这种写法对应的传统写法是：
```
package_dir = {'': 'src'}
```
这个字典值key是模块名，value是对应的文件夹，空字符串意思是根模块。这个说起来有点难懂，我下面再将整个过程理一遍好让读者更容易懂一点。

find函数的where是说要从哪里寻找python模块，所以现在find开始在src文件夹下面寻找了，include和exclude参数用来进一步控制find的查找行为，其中如果有include参数则只添加include参数指定的那些模块，比如上面只会添加pyskeleton模块，但这里还有一个点没讲。如果package_dir那个参数没配置的话，按照道理讲其对应的package name是 src.pyskeleton，因为包名是根据文件夹的结构来的，虽然我指定find从src文件夹开始查找，但是具体某个模块的文件夹结构是没变的，继而对应的packages那边的名字也是没变的，因为有了上面 package_dir 那个配置，现在模块的根位置对应的src文件夹，于是pyskeleton那个文件夹对应的模块名就是pyskeleton了。说得再具体一点pyskeleton现在将作为一个独立模块拷贝到 `site-packages` 哪里的根目录下面。


为了加深理解我们可以将上面的include参数改成 `pyskeleton*` ，然后再随便新建一个pyskeleton2模块，经过测试就会发现又会多了一个pyskeleton2的模块。

一般子模块会放在总模块的下面方便管理，但项目合作的时候可能各个子模块会分开开发，那么这个时候你可以使用`find_namespace` 来实现多个子模块在一个父模块名字之下，这块讨论这里就略过了。


#### metadata

 一些metadata的填写还是很简单的，不过需要注意上面的 `attr:` 和 `file:` 写法。attr可以提取本模块的某些属性信息，而可用于提取某文件的内容。

name

:   本软件的名字

version

:   本软件的版本号

author

: 本软件的作者

author_email

: 本软件作者的邮箱

maintainer

: 本软件的维护者

maintainer_email

: 本软件维护者的邮箱

contact

: 本软件的联系人。可以不写，则是维护者的名字，如果没有则是作者的名字。

contact_email

: 本软件的联系人的邮箱，可以不写，则是维护者的邮箱，如果没有则是作者的邮箱。

license

: 本软件的license

url

: 本软件项目主页地址

description

: 本软件的简要描述
long_description

: 本软件的完整描述

platforms

: 本软件经过测试可运行的平台

classifiers

: 本软件的分类，请参考 [这个网页](<https://pypi.org/classifiers/> ) 给出一些值。是字符串的列表。

keywords

: 本软件在pypi上搜索的关键词，字符串的列表。



#### options

options这里除了上面已经提到的一些，其他的都略过讨论了，一般只在某些特殊情况下才会使用到。

entry_point
: 

```text
entry_points = {
'console_scripts' :[ 'zwc=zwc.zwc:main',],
}
```

其中zwc是你的shell调用的名字，然后zwc是你的模块，另外一个zwc是你的主模块的子模块，然后main是其中的main函数。这就是你的shell调用程序的接口了。类似的还有gui_script可以控制你调用GUI图形的命令入口。

include_package_data

: 一般推荐设置为 True，然后通过 `MANIFAST.in` 文件来管理各个数据文件。

install_requires
: 接受字符串的列表值，将你依赖的可以通过pip安装的模块名放入进去，然后你的软件安装会自动检测并安装这些依赖模块。

package_data

: 你的软件的模块额外附加的（除了py文件的）其他文件，具体设置类似这样 `{"skeleton":['*.txt'],}` 其中skeleton这里就是具体的你的软件的模块（对应的文件夹名），然后后面跟着的就是一系列的文件名列表，可以接受glob语法。注意这里只能包含你的模块文件夹也就是前面通过packages控制的文件夹下面的内容。



#### 不推荐使用的选项

- scripts 不推荐使用，推荐通过entry_point来生成脚本。
- setup_requires 不推荐使用，基于PEP-518 。
- py_modules 不推荐使用，推荐使用packages来管理模块。
- data_files 前面的package_data是只能在你的模块文件夹里面的其他数据文件等，然后可能还有一些数据文件你需要包含的，用data_files来控制，具体后面跟着的参数格式如下面例子所示：

```text
data_files = [('icos',['icos/wise.ico'])],
#这是添加的icos文件夹下面的wise.ico文件
data_files = [('',['skeleton.tar.gz'])],
#这是添加的主目录下的skeleton.tar.gz文件
```

值得一提的是data_files不能接受glob语法。

data_files已经不推荐使用了，推荐用`MANIFAST.in`来管理，可以方便用pkg_resources里面的方法来引用其中的资源文件。

### 读取资源文件

如下所示：

```
from pkg_resources import resource_filename
resource_stream('wise','icos/Folder-Documents.ico')
```


第一个参数是模块名字，第二个参数是模块中的文件的相对路径表达。

上面的例子是resource_filename，返回的是引用的文件名。此外还有命令：resource_string，参数和resource_filename一样，除了它返回的是字节流。这个字节流可以赋值给某个变量从而直接使用，或者存储在某个文件里面。

### pip的develop模式

本小节参考了 [这个问题](https://stackoverflow.com/questions/19048732/python-setup-py-develop-vs-install) 。

对于其他第三方包你不需要修改的，就直接 python setup.py install 就是了，而对于你自己写的包，可能需要频繁变动，最好是加载引用于本地某个文件夹，那么推荐是采用 python setup.py develop 命令来安装。develop模式下你修改了你的模块源码是直接生效的，因为安装过程只是提供了一个引用链接，实际还是用的你的源码这边的代码。

`python setup.py install` 对应的是 `pip install .` 命令，如果你没有setup.py这个文件了那么可以使用这个命令来从本地源码安装。develop模式对应的命令是： `pip install -e .`  。


### 在pypi上传你的模块

#### 正确处理README文档

现在pypi已经支持markdow文档格式了。推荐按照官方文档 [这里](<https://packaging.python.org/guides/making-a-pypi-friendly-readme/> ) 来处理：

```python
long_description = file: README.md
long_description_content_type=text/markdown
```

注意上面配置的 `long_description_content_type` ，如果你喜欢 `reStructuredText` 格式，那么设置为 `text/x-rst` 即可。

#### 打包模块

首先推荐升级最新的setuptools，wheel和twine模块。

然后直接用下面这句：

```text
python setup.py sdist bdist_wheel
```

这样将直接dist文件夹下面生成源码tar包和wheel包。

没有`setup.py` 的项目【<u>也就是采用setup.cfg新式管理方式的项目</u>】**需要安装 `build` 模块**，然后运行 `python -m build` 。

然后推荐运行下：

```text
twine check dist/*
```

来确保你的文档格式没问题。

#### 使用twine上传

使用twine上传到pypi很简单：

```text
twine upload dist/*
```

你每次都需要输入用户名和密码，你可以安装 `keyring` 模块，然后运行：

```text
keyring set https://upload.pypi.org/legacy/ your-username
```

来本地安全保存你的用户名和密码。

### pypi下载使用国内源

豆瓣的pypi源 `https://pypi.douban.com/simple`  或者 清华的pypi源 `https://pypi.tuna.tsinghua.edu.cn/simple` 都可以吧。

临时使用用 `-i` 或者 `--index` 选项： 

```text
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple some-package
```

永久更改本地配置：

```text
pip install pip -U
pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple
```



### pypi只下载软件源文件

下载pypi上的目标软件源文件而不是安装。参考了 [这个网页](http://stackoverflow.com/questions/7300321/how-to-use-pythons-pip-to-download-and-keep-the-zipped-files-for-a-package) 。

```text
pip install --download="/pth/to/downloaded/files" package_name
```

### 其他注意事项
注意那个什么egg-info这个缓存文件夹，如果你更改了你的项目的配置，最好将这个缓存文件夹删掉，有时会有干扰。