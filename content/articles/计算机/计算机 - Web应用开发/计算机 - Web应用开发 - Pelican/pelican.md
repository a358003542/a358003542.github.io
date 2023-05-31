Slug: pelican

[TOC]

## pelican简介

**本文的讨论基于pelican version 4.7.1** 。

pelican是一个静态网站生成工具，其是用python编写实现的，所以对于pythoner来说显得格外的亲切。

首先按照官方的quickstart入门教程简单的刷一遍吧，好对pelican的使用和基本情况有个了解。那个 `Makefile`  说到底也只是一个对于 `pelican` 命令的调用和其他辅助功能，感兴趣的读者可以看到后面的 *定制自动生成python脚本* 一小节，就会对pelican模块的基本命令入口有个清晰的认识。而开发调试运行和实际build分别调用的是两个不同的python配置文件，一个是 `pelicanconf.py` ，一个是 `publishconf.py` 。

在 `publishconf.py` 文件里面有这样一段代码：

```python
import os
import sys
sys.path.append(os.curdir)
from pelicanconf import *
```

也就是其将继承所有来自 `pelicanconf.py` 里面的配置参量，不同的是 `publishconf.py` 是针对发布到远程服务器上的，而 `pelicanconf.py` 的配置只是用于本机调试的。

所以 `pelicanconf.py` 里面的 `SITEURL` 变量是空值，而在 `publishconf.py` 里面是要赋一个具体的值的，此外还值得一提的是你在这两个配置文件里面定义的变量在pelican里面的模板，也就是基于Jinja2模板引用编写的Html输出模板，这些变量都是可以这样 `{{ SITEURL }}` 调用的。

### pelican的工作流程

静态网站就是一堆html文件和其他相关的静态资源，比如css文件，图片文件等。静态资源的处理基本上就是Copy动作，唯一的区别就是决定Copy目的地的位置，这一块后面再讨论。pelican最核心的工作就是要利用各种不同类型的文件源，比如markdown文件，reStructuredText文件，html文件等各种文件格式，利用这些文件源里面的文件内容，然后输出HTML文件。

程序刚开始的命令行接口和配置参数相关工作这里就略过讨论了。然后工作主体就是启动各种不同类型的generator，有默认要启动的：`ArticlesGenerator` 和 `PagesGenerator` ，如果设置了 `TEMPLATE_PAGES` ，还会启动 `TemplatePagesGenerator` 等，如果还有用户自定义的Generator也会启动。

然后是调用每个Generator的  `generate_context` 方法，继而调用 `generate_output` 。`generate_context` 主要是加载各个文件然后利用Reader来加载目标文件的元数据和内容数据。`generate_output` 过程里面有对其他一些额外html页面的生成动作，但不管怎么说现在先简单理解为利用Write和之前加载的元数据和内容数据生成目标html文件。



## 支持Markdown写作

请先确保当前环境安装了markdown模块：

```text
pip install markdown
```

该模块的官方文档在 [这里](https://python-markdown.github.io/) 。就基本的使用是不需要太深入了解这个模块的，不过后面稍微有点定制需求，还有一些插件等，都是和这个模块的一些功能关联在一起的。

首先我们来看最常用的两个功能，一个语法高亮功能，一个是自动目录生成功能。

pelican相关的MARKDOWN配置原始参数如下：

```
MARKDOWN = {
    'extension_configs': {
        'markdown.extensions.codehilite': {'css_class': 'highlight'},
        'markdown.extensions.extra': {},
        'markdown.extensions.meta': {},
    },
    'output_format': 'html5',
}
```

这些参数实际上就是传递给上面提到的 `markdown` 模块，pelican并没有管这块的。然后这里所谓的 extension_config 可以在其官方文档的 [这里](https://python-markdown.github.io/extensions/) 获得信息，其中有很多官方插件，随着markdown模块的安装一并就安装进来了。

### codehilite

这个插件提供了一种代码块语法高亮方案，不过其对于代码块要求采用如下格式：

```text
#!/usr/bin/python
# Code goes here ...
```

还有其他几种格式这里就不赘述了，后面提到的 `fenced_code` 插件实际上是站在 CodeHilite 之上的，支持了我们常见了gfm代码块的表达。这两个插件都依赖 `pygments` 模块。

- css_class 配置最外面那个div区块的class名字
- guess_lang 也不知道从那个版本开始，这个参数默认变成True了，给我带来了一些困扰，它会让pygments去猜代码块里的语言，经常猜的不准确，我喜欢关掉，这样默认text也就是不染色最好，通常这个和用户习惯也是一致的，不指定语言一般暗含的意思就是语种不确定就按照text来。
- 其他还有几个参数选择读者参看该插件的文档吧。比如 `linenums` 可能有些人会喜欢使用。

### fenced_code

如上描述。

### toc

你在markdown 文档里面写上：

```
[TOC]
```

其会自动将其转成：

```
<div class="toc">
.....
</div>
```

这里顺便就提到 `extract_toc` plugin 了，该插件利用 `beautifulsoup4` 模块刷上面的toc div，将你在pelican模板中遇到的 `article` 这个变量，加入了 `article.toc` 这个属性，具体内容就是上面提及的自动生成的toc内容。

出于好奇我们可以看一下extract_toc 的相关代码：

```python
    if toc:
        toc.extract()
        content._content = soup.decode()
        content.toc = toc.decode()
        if content.toc.startswith('<html>'):
            content.toc = content.toc[12:-14]
```

我们看到 `toc.extract()` 也就是将之前 toc 插件生成的目录删去了，然后将toc赋值给了content，这个content对应的就是 `article` 。

因此在pelican里，你可以查看一下你的theme，如果toc显示正常的话，应该有类似如下jinja2代码：

```jinja2
    {% if article.toc %}
    <div class="col-md-2 table-of-content">
        <nav>
        ....
        {{ article.toc }}
        </nav>
    </div>
```

按照上面的讨论现在MARKDOWN 这个变量是：

```
MARKDOWN = {
    'extension_configs': {
        'markdown.extensions.codehilite': {'css_class': 'highlight',
                                           'guess_lang': False},
        'markdown.extensions.toc': {},
        'markdown.extensions.fenced_code': {},
        'markdown.extensions.extra': {},
        'markdown.extensions.meta': {},
    },
    'output_format': 'html5',
}
```



## 实践文档编写

### 引用本博客内部文章

引用本博客内部文章不需要考虑该文章的slug细节，直接如下引用：

```text
[what]({filename}path/to/what.md)
```

相对路径支持 `..` 表达。

### 引用静态资源

比如在markdown里面引入图片如下所示：

```md
![img]({static}/images/chemistry/Naphthalene.png)
```

 `{static}` 后面就是具体要引用的文件路径。具体就是content文件夹下面的images文件夹，这个文件夹默认是要copy到output输出文件夹根目录哪里去的。



### 网站加入favicon.ico

这里参考了 [这个网页](http://stackoverflow.com/questions/31270373/how-to-add-a-favicon-to-a-pelican-blog) ，你需要如下配置，其会将extra文件夹下面的favicon.ico文件copy到output文件夹下面。

```text
EXTRA_PATH_METADATA = {
    'extra/favicon.ico': {'path': 'favicon.ico'}
}
```

### Category参数控制

你可以配置：

```text
DEFAULT_CATEGORY = 'others'
```

来决定你的pelican项目的默认Category参数值。

如果你配置了：

```text
USE_FOLDER_AS_CATEGORY = True
```

则 `Category` 这个参数可以省略，pelican会根据文章所在的上一级文件夹的名字来决定这个文章的Category。

当然随着你的文件夹里面结构变得复杂，你可能对这个默认的Category处理方法不再满意了，那么就将这个设置关闭吧：

```text
USE_FOLDER_AS_CATEGORY = False
```

然后直接在目标文章的头参数那里配置

```text
Category: what
```

### 静态资源管理

images和pdfs和data和extra文件夹其实名字都是随意的，只是一般这样写罢了，pdfs里面放pdf，images里面放图片等。这几个文件夹都是所谓的静态资源文件夹，等下生成output文件夹的时候，里面的内容都放送入到output文件夹里面去。你需要如下设置：

```
STATIC_PATHS = ['images',
                'pdfs',
                'data',
                'extra',]
```



然后html文件需要额外说一下，原网页的body里面的内容都会完整传过去，但是原html网页head部分里面除了必要的meta标签和title标签之外，其他多余的内容是传不过去的。那么css或者js的设置怎么弄呢，这个请参看后面的相关讨论，到时候设置好相关的meta标签即可。




### output输出控制

```text
ARTICLE_URL = '{category}/{slug}.html'
ARTICLE_SAVE_AS = ARTICLE_URL
PAGE_URL = '{slug}.html'
PAGE_SAVE_AS = PAGE_URL
CATEGORY_URL = '{slug}/index.html'
CATEGORY_SAVE_AS = CATEGORY_URL
TAG_URL = 'tag/{slug}.html'
TAG_SAVE_AS = TAG_URL
```

- `ARTICLE_URL` 定义了文章的URL显示，其中slug你可以在文件头属性那边自定义。
- `ARTICLE_SAVE_AS` 定义了该文件在output文件夹那边如何的存储路径
- 后面类似的有控制 CATEGORY TAG PAGE 页面的URL和具体网页在output文件夹里面的存储路径。



### 某个文件夹下的文章内容不处理

通过 `ARTICLE_EXCLUDES` 可以配置一系列的文件夹列表，来让这些文件夹是跳过处理的。

1. 下面的路径表达是相对于PATH的相对路径表达。
2. 注意windows下因为先版本pelican代码路径解析关系【4.2.0】，要采用如下写法，而不能用`/` 这种写法。

```
ARTICLE_EXCLUDES= ['articles\\programming\\algorithm\\examples']
```

## HTML文档的处理



## 模板

### 使用theme

没必要将pelican推荐的那些theme都下载下来，找一个你喜欢的theme，将你复制到你的pelican项目根目录下，然后配置 `your_theme_name` 等于你复制来的主题的文件夹名字：

```text
THEME = 'your_theme_name'
```

theme内部static文件夹下的内容会copy到output文件夹下，比如 `static/css` 到 `theme/css` 。

然后templates文件夹里面都是一些jinja2模板文件，具体jinja2模块引擎相关的知识就不在这里讨论了。

### 模板文件可以使用的变量

1. 配置文件里面的变量直接可以使用，比如你在配置文件里面定义了`SITEURL="WHAT"` ，那么在模板文件里面可以这样引用 `{{ SITEURL}}` 。注意这些配置名按照规范是应该全部大写字母的。
2. 比如在article模板下你定义的那些metadata都是可以引用的，如`article.tags` 。
3. 你也可以在文档头里面定义自己想要的metadata，值得一提的是这些变量在Jinja2那边都要写成小写，比如：`article.bookname` 。

具体那些模板文件可以使用那些变量内容更多，请读者参看官方文档5.6 Creating themes的Templates and variables 一小节。



## 插件

### plugin的安装

通过如下配置来安装plugin，具体文件夹的操作就是在你的pelican项目根目录下有个 `myplugins` 文件夹，里面就是你编写的plugin或者将其他作者写的plugin copy到这里。

```text
PLUGIN_PATHS = ['myplugins']
PLUGINS = [ 'extract_toc', 'tipue_search', 'render_math']
```



## 其他技巧分享

### 定制自动生成python脚本

如果读者是在windows环境下，那么pelican那个默认的Makefile是不怎么好用的，说到底其只是提供了一些快捷的命令行支持，我们完全可以另外写一个python脚本来实现这点。

```python
#!/usr/bin/env python
# -*-coding:utf-8-*-


"""
run.bat 在windows下运行方便点 对应的就是 build 命令

"""

import click
import subprocess
import os
import shutil
from pathlib import Path
import threading

PROJECT = 'myblog'
BASEDIR = os.getcwd()
INPUTDIR = os.path.join(BASEDIR, 'content')
OUTPUTDIR = os.path.join(BASEDIR, 'dev_output')
PUBLISHDIR = os.path.join(BASEDIR, 'output')
CONFFILE = os.path.join(BASEDIR, 'pelicanconf.py')
PUBLISHCONF = os.path.join(BASEDIR, 'publishconf.py')
PORT = 9000


@click.group()
def main():
    pass


def copy_mathjax(dest):
    mathjax_foldername = 'MathJax-2.7.7'
    dest_folder = os.path.join(dest, mathjax_foldername)
    if os.path.exists(dest_folder):
        click.echo(f'{mathjax_foldername} already exists.')
    else:
        shutil.copytree(mathjax_foldername, dest_folder)
        click.echo(f'{mathjax_foldername} copyed.')


@main.command()
def devserve():
    """
    devbuild your pelican project
    """
    click.echo("start devbuild your pelican project...")
    
    copy_mathjax(OUTPUTDIR)
    
    def devbuild():
        cmd = "pelican -r {INPUTDIR} -o {OUTPUTDIR} -s {CONFFILE}".format(
            INPUTDIR=INPUTDIR,
            OUTPUTDIR=OUTPUTDIR,
            CONFFILE=CONFFILE
        )
        click.echo('start run cmd: {0}'.format(cmd))
        subprocess.call(cmd, shell=True)

    def serve():
        while not os.path.exists(OUTPUTDIR):
            import time
            time.sleep(1)

        os.chdir(OUTPUTDIR)
        serve_cmd = 'python -m http.server {PORT}'.format(PORT=PORT)
        click.echo('start run cmd: {0}'.format(serve_cmd))
        subprocess.call(serve_cmd, shell=True)

    t0 = threading.Thread(target=devbuild)
    t0.start()

    t = threading.Thread(target=serve)
    t.start()

    threads = []
    threads.append(t0)
    threads.append(t)

    for t in threads:
        try:
            t.join()
        except KeyboardInterrupt as e:
            print('用户取消了')


@main.command()
def build():
    """
    build your pelican project
    """
    click.echo("start build your pelican project...")
    copy_mathjax(PUBLISHDIR)
    
    cmd = "pelican {INPUTDIR} -o {PUBLISHDIR} -s {PUBLISHCONF}".format(
        INPUTDIR=INPUTDIR,
        PUBLISHCONF=PUBLISHCONF,
        PUBLISHDIR=PUBLISHDIR
    )

    click.echo('start run cmd: {0}'.format(cmd))
    ret = subprocess.call(cmd, shell=True)

    click.echo('running result is:{0}'.format(ret))

    


@main.command()
def devclean():
    """
    clean your dev output
    """
    click.echo("start clean your output folder...")
    rm(OUTPUTDIR, recursive=True)


def normalized_path_obj(path='.'):
    """
    默认支持 ~ 符号

    返回的是 Path 对象
    :param path:
    :return:
    """
    if isinstance(path, Path):
        return path.expanduser()
    elif isinstance(path, str):
        if path.startswith('~'):
            path = os.path.expanduser(path)
        return Path(path)
    else:
        raise TypeError


def rm(path, recursive=False):
    """
    the function can remove file or empty directory(default).

    use `shutil.rmtree` to remove the non-empty directory,you need add `recursive=True`

    """
    path = normalized_path_obj(path)
    if recursive:
        shutil.rmtree(path)
    else:
        if path.is_file():
            path.unlink()
        else:
            path.rmdir()


if __name__ == '__main__':
    main()
```

在上面 `run.py` 的基础上，我们可以创建如下两个脚本：`start_server.bat` 和 `build.bat` 。其中`start_server.bat` 是平时编写调试的时候使用， `build.bat` 是编译输出网站成品时使用。

这两个脚本内容很简单，就是调用上面编写的python脚本提供的命令行接口。其中 `start_server.bat` 是：

```text
python run.py devserve
```

`build.bat` 的内容是：

```text
python run.py build
```

关于python编程可以参看我编写的python编程一文。

关于python的click模块可以参看我编写的click模块一文。



## 附录

### 默认的Metadata

<table border="1" class="docutils">
<colgroup>
<col width="19%">
<col width="81%">
</colgroup>
<thead valign="bottom">
<tr class="row-odd"><th class="head">Metadata</th>
<th class="head">Description</th>
</tr>
</thead>
<tbody valign="top">
<tr class="row-even"><td><code class="docutils literal notranslate"><span class="pre">title</span></code></td>
<td>Title of the article or page</td>
</tr>
<tr class="row-odd"><td><code class="docutils literal notranslate"><span class="pre">date</span></code></td>
<td>Publication date (e.g., <code class="docutils literal notranslate"><span class="pre">YYYY-MM-DD</span> <span class="pre">HH:SS</span></code>)</td>
</tr>
<tr class="row-even"><td><code class="docutils literal notranslate"><span class="pre">modified</span></code></td>
<td>Modification date (e.g., <code class="docutils literal notranslate"><span class="pre">YYYY-MM-DD</span> <span class="pre">HH:SS</span></code>)</td>
</tr>
<tr class="row-odd"><td><code class="docutils literal notranslate"><span class="pre">tags</span></code></td>
<td>Content tags, separated by commas</td>
</tr>
<tr class="row-even"><td><code class="docutils literal notranslate"><span class="pre">keywords</span></code></td>
<td>Content keywords, separated by commas (HTML content only)</td>
</tr>
<tr class="row-odd"><td><code class="docutils literal notranslate"><span class="pre">category</span></code></td>
<td>Content category (one only — not multiple)</td>
</tr>
<tr class="row-even"><td><code class="docutils literal notranslate"><span class="pre">slug</span></code></td>
<td>Identifier used in URLs and translations</td>
</tr>
<tr class="row-odd"><td><code class="docutils literal notranslate"><span class="pre">author</span></code></td>
<td>Content author, when there is only one</td>
</tr>
<tr class="row-even"><td><code class="docutils literal notranslate"><span class="pre">authors</span></code></td>
<td>Content authors, when there are multiple</td>
</tr>
<tr class="row-odd"><td><code class="docutils literal notranslate"><span class="pre">summary</span></code></td>
<td>Brief description of content for index pages</td>
</tr>
<tr class="row-even"><td><code class="docutils literal notranslate"><span class="pre">lang</span></code></td>
<td>Content language ID (<code class="docutils literal notranslate"><span class="pre">en</span></code>, <code class="docutils literal notranslate"><span class="pre">fr</span></code>, etc.)</td>
</tr>
<tr class="row-odd"><td><code class="docutils literal notranslate"><span class="pre">translation</span></code></td>
<td>If content is a translation of another (<code class="docutils literal notranslate"><span class="pre">true</span></code> or <code class="docutils literal notranslate"><span class="pre">false</span></code>)</td>
</tr>
<tr class="row-even"><td><code class="docutils literal notranslate"><span class="pre">status</span></code></td>
<td>Content status: <code class="docutils literal notranslate"><span class="pre">draft</span></code>, <code class="docutils literal notranslate"><span class="pre">hidden</span></code>, or <code class="docutils literal notranslate"><span class="pre">published</span></code></td>
</tr>
<tr class="row-odd"><td><code class="docutils literal notranslate"><span class="pre">template</span></code></td>
<td>Name of template to use to generate content (without extension)</td>
</tr>
<tr class="row-even"><td><code class="docutils literal notranslate"><span class="pre">save_as</span></code></td>
<td>Save content to this relative file path</td>
</tr>
<tr class="row-odd"><td><code class="docutils literal notranslate"><span class="pre">url</span></code></td>
<td>URL to use for this article/page</td>
</tr>
</tbody>
</table>

### Jinja2模板里面的变量

