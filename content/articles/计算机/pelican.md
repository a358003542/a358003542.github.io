Slug: pelican
Date: 20230309
Modified: 20260105

[TOC]

## pelican简介

**本文的讨论基于pelican version 4.11.0** 。

pelican是一个静态网站生成工具，其是用python编写实现的。

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


### 使用theme

没必要将pelican推荐的那些theme都下载下来，找一个你喜欢的theme，将你复制到你的pelican项目根目录下，然后配置 `your_theme_name` 等于你复制来的主题的文件夹名字：

```text
THEME = 'your_theme_name'
```

theme内部static文件夹下的内容会copy到output文件夹下，比如 `static/css` 到 `theme/css` 。

然后templates文件夹里面都是一些jinja2模板文件，具体jinja2模块引擎相关的知识就不在这里讨论了。

#### 模板文件可以使用的变量

1. 配置文件里面的变量直接可以使用，比如你在配置文件里面定义了`SITEURL="WHAT"` ，那么在模板文件里面可以这样引用 `{{ SITEURL}}` 。注意这些配置名按照规范是应该全部大写字母的。
2. 比如在article模板下你定义的那些metadata都是可以引用的，如`article.tags` 。
3. 你也可以在文档头里面定义自己想要的metadata，值得一提的是这些变量在Jinja2那边都要写成小写，比如：`article.bookname` 。

具体那些模板文件可以使用那些变量内容更多，请读者参看官方文档5.6 Creating themes的Templates and variables 一小节。



### plugin的安装

通过如下配置来安装plugin，具体文件夹的操作就是在你的pelican项目根目录下有个 `myplugins` 文件夹，里面就是你编写的plugin或者将其他作者写的plugin copy到这里。

```text
PLUGIN_PATHS = ['myplugins']
PLUGINS = [ 'extract_toc', 'tipue_search', 'render_math']
```


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


## pelican源码阅读

本文的讨论基于pelican version **4.7.1** 。

本文主要以pelican命令为切入口来对pelican模块的核心内容进行讨论，其他辅助性质的工具和其他细枝末节的内容将会忽略掉，忽略讨论的内容有：

- pelican-import 
- pelican-quickstart
- pelican-themes
- pelcan-plugins
- 命令行listen参数，这个只是pelican额外提供的辅助工具，自己另外再用python的 `http.server` 模块启动一个效果都是一样的。
- 忽略了程序运行计时和相关日志的输出讨论
- 忽略了一些程序运行统计信息和相关日志输出的讨论
- 忽略翻译问题



### 初始化日志

这是进入pelican模块必做的第一件事情。

```
def init(level=None, fatal='', handler=RichHandler(console=console), name=None,
         logs_dedup_min_level=None):
```

fatal参数另外封装了一下LimitLogger来实现的，主要是实现warning或者error日志的时候程序就终止。

logs_dedup_min_level默认是 `logging.WARNING` ，也就是warning级别之上的日志都会打印出来。

然后是利用 `logging.basicConfig` 进行了一些基本的日志打印格式调整。

`RichHandler` 利用的是另外一个rich模块，主要是美化终端输出格式，这些简单了解下即可。

pelican的log.py里面最核心的内容就是LimitLogger加载了LimitFilter，其filter函数实现了日志过滤功能。

1. 日志级别大于`logging.WARNING` 的必打印
2. 如果该日志文件编号`record.levelno` 和 日志信息重复，则不再打印。
3. 对接 `LOG_FILTER` 配置。填写的这些日志将会被过滤。
4. 如果日志接受额外的参数 `limit_msg` ，默认阈限是5，也即是报告五次之后不再报告。

日志这块pelican就是做了上面所述的这些调整，简单了解下即可。

### 命令行参数和配置文件加载

命令行参数和配置文件加载这里就不专门讨论了，这些内容有些在pelican的使用中已有所接触，有些后面提到什么参数什么配置就默认加载进来了。

配置的相关选项和默认值在 `settings.py` 哪里有，这块查看源码或者查看文档的说明即可，不作过多讨论了。

### autoreload

pelican命令行对应的`__main__`里面的main函数，里面最核心的逻辑，在忽略掉listen之后就是两个分支：一个是autoreload参数填入，则执行：

```
autoreload(args)
```

一个是没有autoreload参数则为：

```
	watcher = FileSystemWatcher(args.settings, Readers, settings)
	watcher.check()
	with console.status("Generating..."):
		pelican.run()
```

这两个过程的主要区别是autoreload会监控文件的变化，如果文件发生了变化则会重新执行 `pelican.run()` 。下面详细讨论下文件监控行为，也就是FileSystemWatcher类里面的细节。后面只关注 `pelican.run()` 了。

查看了一下`pelican.run()`后面的代码，后面的文件列表还会另外生成的，也就是可以确定这个FileSystemWatcher的用途仅仅只是用来判断监控的文件或文件夹里面的内容是否发生了变化。

其维护了这样一个字典值：

```
	self.watchers = {
		'settings': FileSystemWatcher.file_watcher(settings_file)
	}
```

后面还会根据配置来更新一些监控项：

- content 根据 `PATH` 配置来。
- theme 根据 `THEME` 配置来。
- 此外还会根据 `STATIC_PATHS` 来增加静态资源监控，从代码来看这些静态文件是必须在 `PATH` 下面的。

其会利用 `get_watcher` 方法来自动判断给定的path是文件还是文件夹，来分配 `file_watcher` 或者 `folder_watcher` 。

这个 `file_watcher` 和`folder_watcher` 是一个生成器函数，其中 `file_watcher` 的内部逻辑是 判断该文件的

```
os.stat(path).st_mtime
```

如果大于函数内部记录的 `LAST_MTIME` ，则认为该文件已发生修改，然后 `yield True` ，否则 `yield False` 。

FileSystemWatcher在每次判断前需要前支持`check` 方法：

```python
    def check(self):
        result = {key: next(watcher) for key, watcher in self.watchers.items()}
```

其核心就是那个`next`函数，其会再次执行目标生成器函数。

 `file_watcher` 和`folder_watcher` 内部都是`While True` 的循环，好在python的迭代器的惰性运算机制，使得这个监控设计实现起来很简单。

`folder_watcher` 当然需要进行文件夹迭代，监控的文件要满足两个条件：

1. 是有效的扩展名，有效的扩展名是根据 `Readers` 类来的，其是根据这个来的：

```python
        for cls in [BaseReader] + BaseReader.__subclasses__():
            if not cls.enabled:
                logger.debug('Missing dependencies for %s',
                             ', '.join(cls.file_extensions))
                continue

            for ext in cls.file_extensions:
                self.reader_classes[ext] = cls
```

pelican的所有Reader都需要继承自 `BaseReader` 这个类，上面完成了对 BaseReader所有子类的迭代查询，以`MarkdownReader`为例子：

```
class MarkdownReader(BaseReader):
    """Reader for Markdown files"""

    enabled = bool(Markdown)
    file_extensions = ['md', 'markdown', 'mkd', 'mdown']
```

如果你没有安装 `Markdown` 模块，则enabled就为False，那么其就不是有效扩展，其不会进入Readers类的reader_classes和readers这两个字典值中。这样这些相关的扩展名也不会被视作有效扩展名。

2. 不是忽略的文件。忽略逻辑是由配置的 `IGNORE_FILES` 来定义的，默认值是 `['.#*']` 。具体匹配是由python的fnmatch模块定义的语法：

```
fnmatch.fnmatch(f, ignore)
```

其对文件名提供了一种比正则表达式更简单点的匹配模式，具体是匹配的文件的后缀名。比如默认的 `['.#*']` 就是任何以 `.#` 开头的扩展名文件都将被忽略。

`folder_watcher` 对整个文件夹是否发生了更新采取了一种很聪明的方法，取 `max(file_times(path))` 其内所有文件修改时间的最大值，如果该时间大于记录的上次最大时间，那么文件夹里面的内容肯定发生修改了。

`update_watchers` 在初次运行或者配置发生变化之后需要运行一次，其内有些小细节处理，这里就忽略讨论了。

`theme` 和静态文件的文件夹监控的有效扩展是直接赋值 `['']` ，这里我注意到 `f.endswith(tuple(extensions))` ，python的字符串的endswith方法还可以接受一个字符串元组，只要以其中任一个结尾即返回`True` 。然后有：

```
>>> '.abc'.endswith('')
True
```

也就是静态文件夹里面没有是有效扩展名这个判断逻辑。

### 加载插件

在运行 `pelican.run()` 之前还有一件事，那就是实例化 `Pelican` 类，从代码中看，这里面最重要的一项工作就是加载插件。

```python
    def init_plugins(self):
        self.plugins = []
        for plugin in load_plugins(self.settings):
            name = get_plugin_name(plugin)
            logger.debug('Registering plugin `%s`', name)
            try:
                plugin.register()
                self.plugins.append(plugin)
            except Exception as e:
                logger.error('Cannot register plugin `%s`\n%s',
                             name, e)

        self.settings['PLUGINS'] = [get_plugin_name(p) for p in self.plugins]

```

这个 `load_plugins` 首先做的工作是试着加载pelican模块里面的plugins文件夹下的插件，因为pelican模块默认里面什么都没有，所以这一块等于什么都没做，就略过讨论了。

然后 `load_plugins` 开始分析配置的 `PLUGINS` ，然后根据配置 `PLUGIN_PATHS` 来试着加载插件。具体加载过程以最简单的情况来说就是执行：

```
spec = importlib.machinery.PathFinder.find_spec(plugin, plugin_paths)
```

find_spec是一个类方法，其返回的spec是一个特别的对象，经过module_from_spec函数处理就能转成module对象。这里的 `plugin_paths` 是一个类似 `sys.path` 的列表值：`['path']` 。

剩下的加载模块动作如下

```python
        # Avoid loading the same plugin twice
        if spec.name in sys.modules:
            return sys.modules[spec.name]
        # create module object from spec
        mod = importlib.util.module_from_spec(spec)
        # place it into sys.modules cache
        # necessary if module imports itself at some point (e.g. packages)
        sys.modules[spec.name] = mod
        try:
            # try to execute it inside module object
            spec.loader.exec_module(mod)
        except Exception:  # problem with import
            try:
                # remove module from sys.modules since it can't be loaded
                del sys.modules[spec.name]
            except KeyError:
                pass
            raise
```

关于上面的代码最核心的是 `mod = importlib.util.module_from_spec(spec)` 这一句，通过这一句我们就获得了对应插件，也就是python的module对象，后面的这一句：

```
sys.modules[spec.name] = mod
```

只是对于某些插件可能需要 `import` 操作才有用，然后后面的 `spec.loader.exec_module(mod)` 更多的是去试着执行module对象，是一个试着核对插件正确性的手段。

再回到最开始讨论的 `init_plugins` 方法上，这里有一句：

```
plugin.register()
```

这个是在说所有的pelican的插件都应该定义 **register** 函数，插件被加入进来都会先执行这个register函数。

### 信号

在讲到插件就必须讲到信号了，pelican利用blinker这个第三方模块来实现一种信号-函数的执行机制，上面讲的插件要和pelican的具体事务发生关系就需要通过信号来绑定上行为。简单来说就是pelican自身处理事物流程到了一定阶段就会发送一个信号，pelican的插件，具体就是register函数哪里，将这些信号也就是pelican的处理事物流程哪里，再扩展出另外一些额外的函数执行行为。

因为本文关注于pelican的源码阅读，所以这些信号就要详细解读一下，虽然pelican的核心执行流程还没有说明清楚，不过这里就预先讲一点，后面再有涉及到的地方再继续补充之。

```
initialized = signal('pelican_initialized')
```

Plican对象的 `__init__` 构造方法执行完毕会发送这个信号。发送的附带参数，也就是信号connect的执行函数的接受参数为Pelican对象。

```
finalized = signal('pelican_finalized')
```

Plican对象的 `run` 方法主要工作运行完毕之后会发送这个信号。发送的附带参数是Pelican对象。

```
readers_init = signal('readers_init')
```

Readers类 `__init__` 构造方法主要工作执行完毕之后会发送这个方法，Readers类在autoreload哪里的讨论提到，pelican需要清楚自己支持的后缀名的时候就需要先执行，所以这个信号发送是很早的。一般新增的Reader按照官方文档的讨论，也就是如果新增扩展名的，都应该和这个信号绑定起来，早早地执行起来。

下面这些信号后面再适当的时候引入进来再讨论之。

```
all_generators_finalized = signal('all_generators_finalized')

page_generator_finalized = signal('page_generator_finalized')
page_generator_write_page = signal('page_generator_write_page')
page_writer_finalized = signal('page_writer_finalized')

static_generator_init = signal('static_generator_init')
static_generator_finalized = signal('static_generator_finalized')

# Page-level signals
page_generator_preread = signal('page_generator_preread')
page_generator_context = signal('page_generator_context')

static_generator_preread = signal('static_generator_preread')
static_generator_context = signal('static_generator_context')

content_object_init = signal('content_object_init')

# Writers signals
feed_generated = signal('feed_generated')
feed_written = signal('feed_written')
```

### run

终于要到Pelican核心工作流程，也就是Pelican对象的run方法的讨论了。pelican的核心工作流程如下：

1. 收集各个Generator类
2. 如果各个Generator有 `generate_context` 方法，则执行之。
3. 如果各个Generator有 `refresh_metadata_intersite_links` 方法，则执行之。
4. 如果各个Generator有 `generate_output` 方法，则执行之。



在收集完各个Generator类之后有额外的逻辑：

```python
        if (self.delete_outputdir
                and os.path.commonpath([os.path.realpath(self.output_path)]) !=
                os.path.commonpath([os.path.realpath(self.output_path),
                                    os.path.realpath(self.path)])):
            clean_output_dir(self.output_path, self.output_retention)
```

也就是如果配置定义了 `DELETE_OUTPUT_DIRECTORY`  ，并且不是源或者父文件夹，则执行删除动作。删除动作不会删除配置 `OUTPUT_RETENTION` 定义的文件夹。

这是额外的一个优化逻辑，这里就不深入讨论了。



#### 收集各个Generator类

默认 `ArticlesGenerator` 和 `PagesGenerator` 都要加入进来。在 `ArticlesGenerator` 类初始化的时候还有一些细节，先讨论之。

ArticlesGenerator类继承自 `CachingGenerator` ，`CachingGenerator` 继承自 `Generator, FileStampDataCacher` 。

先看到 `Generator` 类，其 `__init__` 构造方法执行完毕之后会发送 `generator_init` 信号。

```
generator_init = signal('generator_init')
```

Generator类构造方法里面进行了很多Jinja2相关的配置，如果你自己定义的Generator类不需要Jinja2那么则不需要继承自Generator。

```python
        self._templates_path = list(self.settings['THEME_TEMPLATES_OVERRIDES'])

        theme_templates_path = os.path.expanduser(
            os.path.join(self.theme, 'templates'))
        self._templates_path.append(theme_templates_path)
        theme_loader = FileSystemLoader(theme_templates_path)

        simple_theme_path = os.path.dirname(os.path.abspath(__file__))
        simple_loader = FileSystemLoader(
            os.path.join(simple_theme_path, "themes", "simple", "templates"))

		self.env = Environment(
            loader=ChoiceLoader([
                FileSystemLoader(self._templates_path),
                simple_loader,  # implicit inheritance
                PrefixLoader({
                    '!simple': simple_loader,
                    '!theme': theme_loader
                })  # explicit ones
            ]),
            **self.settings['JINJA_ENVIRONMENT']
        )
```

Jinja2的ChoiceLoader工作原理是如果一个template找不到则会尝试下一个loader。

Jinja2的FileSystemLoader是试着从文件系统中查找一个template。

PrefixLoader是根据前缀限定来查找loader，默认的`delimiter='/'` ，也就是假设你指定template名字是 `!simple/index.html` ，则会试着用simple_loader来查找index.html模板。

现在总结到pelican里面jinja2模板引擎查找模板的逻辑是：

1. 试着从配置的 `THEME_TEMPLATES_OVERRIDES` 和 配置的 `THEME/template` 定义的文件系统来查找模板
2. 如果上面找不到则试着从pelican代码自带的simple模板里面查找。
3. 如果上面找不到而且模板名字是以 `!simple` 或者 `!theme` 前缀开头，则去掉前缀和delimiter，从对应的simple模板或者 `THEME/template` 哪里查找对应的。

此外配置的 `JINJA_ENVIRONMENT` 可以传递额外的参数给Jinja2的Environment对象。

```python
        # provide utils.strftime as a jinja filter
        self.env.filters.update({'strftime': DateFormatter()})

        # get custom Jinja filters from user settings
        custom_filters = self.settings['JINJA_FILTERS']
        self.env.filters.update(custom_filters)
```

更新Jinja2的Environment环境下的filters， `self.env.filters` 就是一个字典值，你可以在配置中利用 `JINJA_FILTERS` 来添加更多的filter，具体filter就是一个可调用对象即有 `__call__` 的类或者函数即可。

```
        # get custom Jinja globals from user settings
        custom_globals = self.settings['JINJA_GLOBALS']
        self.env.globals.update(custom_globals)
```

Jinja2模板的一些全局可用变量可利用配置 `JINJA_GLOBALS` 来增加之，也是一个字典值。

```
        custom_tests = self.settings['JINJA_TESTS']
        self.env.tests.update(custom_tests)
```

ArticlesGenerator的初始化另外还声明了一些变量，然后发送信号：

```
article_generator_init = signal('article_generator_init')
```

PagesGenerator和ArticlesGenerator一样也是继承自 `CachingGenerator` ，然后初始化也另外声明了一些变量，然后发送信号：

```
page_generator_init = signal('page_generator_init')
```

关于ArticlesGenerator和PagesGenerator的缓存优化生成策略我决定暂时先略过讨论，后面再另开一小节集中讨论之。这是另外额外添加的优化特性。

如果配置有 `TEMPLATE_PAGES` ，则会再加上 `TemplatePagesGenerator` 。

如果配置有 `OUTPUT_SOURCES` ，则会再加上 `SourceFileGenerator` 。

这两个Generator后面再讨论。

下面这段代码是支持自定义Generator插件的：

```python
        for receiver, values in signals.get_generators.send(self):
            if not isinstance(values, Iterable):
                values = (values,)
            for generator in values:
                if generator is None:
                    continue  # plugin did not return a generator
                discovered_generators.append((generator, receiver.__module__))
```

我粗略看了一下，pelican里面信号send之后还有返回值的就两个，一个是 `get_generators` ，一个是 `get_writer` 。

```
get_generators = signal('get_generators')

get_writer = signal('get_writer')
```

send的返回值结构如下：

```
            return [(receiver, receiver(sender, **kwargs))
                    for receiver in self.receivers_for(sender)]
```

具体blinker内部细节不深究了，不过从这里可以看出blinker的某个信号send之后，之前connect的那些回调函数都会被调用和执行。

```
        # StaticGenerator must run last, so it can identify files that
        # were skipped by the other generators, and so static files can
        # have their output paths overridden by the {attach} link syntax.
        discovered_generators.append((StaticGenerator, "internal"))
```

最后是增加 StaticGenerator ，官方文档说明了一定要最后运行。

收集的Generator最后汇总并实例化：

```python

        context = self.settings.copy()
        # Share these among all the generators and content objects
        # They map source paths to Content objects or None
        context['generated_content'] = {}
        context['static_links'] = set()
        context['static_content'] = {}
        context['localsiteurl'] = self.settings['SITEURL']

        generators = [
            cls(
                context=context,
                settings=self.settings,
                path=self.path,
                theme=self.theme,
                output_path=self.output_path,
            ) for cls in self._get_generator_classes()
        ]
```

path来自配置 `PATH` ，theme来自 `THEME` ，output_path 来自 `OUTPUT_PATH` 。

总结：作为源码解读的第一遍过程，配置都认为是默认配置，然后不会讨论用户自定义插件问题，如此则会实例化下面这几个Generator：

- ArticlesGenerator
- PagesGenerator
- StaticGenerator


### ArticlesGenerator
ArticlesGenerator的`generate_context` 方法首先是获取要处理的文章：

```
for f in self.get_files(
                self.settings['ARTICLE_PATHS'],
                exclude=self.settings['ARTICLE_EXCLUDES']):
```

在获取要处理的文章列表逻辑里面， 配置 `ARTICLE_EXCLUDES` 和 `IGNORE_FILES` 都会起作用并排除掉，然后只会处理前面提到 `readers.extension` 确定的能够处理的文件后缀名的文件。

默认配置 `ARTICLE_PATHS` 的值为 `['']` ，也就是为空，从而根据：
```
root = os.path.join(self.path, path) if path else self.path
```
确定root为 `self.path` 也就是配置 `PATH` 。

剩下来的核心逻辑和前面提到的autoreload监控文件变化里面的 `folder_watcher` 用到的都是一样的，就是利用 `os.walk` 递归遍历文件夹。

默认的 `ARTICLE_PATHS` 和默认的 `PATH` 最后确定的路径是 `os.curdir` 这很不好，目前个人的配置是设置 `PATH = 'content'` 勉强可以，现在看来还有优化空间，一些图片和静态文件都刷进去了，虽然根据后缀名最后都会过滤掉，但这里再加上配置 

```
ARTICLE_PATHS = ['articles']
```
会更好一些。

注意看到代码这里 `os.path.join(self.path, path)` ，所以你在定义你想要的文章所在地的时候，就需要在content也就是PATH下面，然后只需要写上目标文件夹名字即可。

在进入各个文件处理区块之后，首先是：
```
article = self.get_cached_data(f, None)
```
这里pelican自己的处理加速缓存逻辑，如果没有处理缓存则会返回False，如果有则会返回缓存数据，然后后面就不用再计算一边了，直接利用缓存数据即可，这里假定没有缓存数据。

下面代码是没有缓存的时候pelican要做的事情，看到最后一行 `self.cache_data(f,article)` 就是将处理数据存入缓存，所以可以认为这一区块就是pelican在处理文章时候的核心工作了。
```python
                try:
                    article = self.readers.read_file(
                        base_path=self.path, path=f, content_class=Article,
                        context=self.context,
                        preread_signal=signals.article_generator_preread,
                        preread_sender=self,
                        context_signal=signals.article_generator_context,
                        context_sender=self)
                except Exception as e:
                    logger.error(
                        'Could not process %s\n%s', f, e,
                        exc_info=self.settings.get('DEBUG', False))
                    self._add_failed_source_path(f)
                    continue

                if not article.is_valid():
                    self._add_failed_source_path(f)
                    continue

                self.cache_data(f, article)
```
其就是调用Readers类的实例的read_file方法，继续到read_file那边，有：

```python
        if preread_signal:
            preread_signal.send(preread_sender)
```

```
article_generator_preread = signal('article_generator_preread')
```
这样 `article_generator_preread` 信号就发送出去了，附带的参数是本ArticlesGenerator实例。其标记了ArticlesGenerator将要处理一篇文章的context。

```python
        if not fmt:
            _, ext = os.path.splitext(os.path.basename(path))
            fmt = ext[1:]

        if fmt not in self.readers:
            raise TypeError(
                'Pelican does not know how to parse %s', path)

        # ......

        reader = self.readers[fmt]

        metadata = _filter_discardable_metadata(default_metadata(
            settings=self.settings, process=reader.process_metadata))
        metadata.update(path_metadata(
            full_path=path, source_path=source_path,
            settings=self.settings))
        metadata.update(_filter_discardable_metadata(parse_path_metadata(
            source_path=source_path, settings=self.settings,
            process=reader.process_metadata)))
        reader_name = reader.__class__.__name__
        metadata['reader'] = reader_name.replace('Reader', '').lower()

        content, reader_metadata = self.get_cached_data(path, (None, None))
        if content is None:
            content, reader_metadata = reader.read(path)
            reader_metadata = _filter_discardable_metadata(reader_metadata)
            self.cache_data(path, (content, reader_metadata))
        metadata.update(reader_metadata)
```

接下来是根据扩展名找到对应的Reader实例【Readers类初始化的时候已经将各个Reader实例化并对应上各个扩展名了】。

接下来这一句：

```
        metadata = _filter_discardable_metadata(default_metadata(
            settings=self.settings, process=reader.process_metadata))
```
重点不是 `_filter_discardable_metadata` 而是 `default_metadata` , `_filter_discardable_metadata` 只是过滤掉为 `_DISCARD` 值的字典项，只是细枝末节了。

```python
def default_metadata(settings=None, process=None):
    metadata = {}
    if settings:
        for name, value in dict(settings.get('DEFAULT_METADATA', {})).items():
            if process:
                value = process(name, value)
            metadata[name] = value
        if 'DEFAULT_CATEGORY' in settings:
            value = settings['DEFAULT_CATEGORY']
            if process:
                value = process('category', value)
            metadata['category'] = value
        if settings.get('DEFAULT_DATE', None) and \
           settings['DEFAULT_DATE'] != 'fs':
            if isinstance(settings['DEFAULT_DATE'], str):
                metadata['date'] = get_date(settings['DEFAULT_DATE'])
            else:
                metadata['date'] = datetime.datetime(*settings['DEFAULT_DATE'])
    return metadata
```
上面的process函数是`reader.process_metadata` ，`RstReader` ，`MarkdownReader` ，`HTMLReader` 都没有定义这个方法，也是继承自他们的父类也就是 `BaseReader` , 该方法如下：

```python

    def process_metadata(self, name, value):
        if name in METADATA_PROCESSORS:
            return METADATA_PROCESSORS[name](value, self.settings)
        return value
```

假设你要编写一个插件，重新写一个Reader，然后要对metadata做某些额外的动作的话，可以通过定义这个 `process_metadata` 方法来，其第一个参数是对应的metadata的key，第二个参数是该key的默认值。

```python
METADATA_PROCESSORS = {
    'tags': lambda x, y: ([
        Tag(tag, y)
        for tag in ensure_metadata_list(x)
    ] or _DISCARD),
    'date': lambda x, y: get_date(x.replace('_', ' ')),
    'modified': lambda x, y: get_date(x),
    'status': lambda x, y: x.strip() or _DISCARD,
    'category': lambda x, y: _process_if_nonempty(Category, x, y),
    'author': lambda x, y: _process_if_nonempty(Author, x, y),
    'authors': lambda x, y: ([
        Author(author, y)
        for author in ensure_metadata_list(x)
    ] or _DISCARD),
    'slug': lambda x, y: x.strip() or _DISCARD,
}
```

这个process_metadata更像是一个后处理函数，后面再合适的时机再引入相关的讨论。

继续前面的，假设你的配置通过 `DEFAULT_METADATA` 定义了一些metadata，则你的所有文章都是可以看到这些metadata的，不过你在配置里面定义的metadata还可能会经过 `process_metadata` 的后处理。现在假设你定义了：

```python
DEFAULT_METADATA = {'author':' abc '}
```

```python
def _process_if_nonempty(processor, name, settings):
    """Removes extra whitespace from name and applies a metadata processor.
    If name is empty or all whitespace, returns _DISCARD instead.
    """
    name = name.strip()
    return processor(name, settings) if name else _DISCARD
```
最后返回的是：`Author('abc', settings)` 。 

再比如 `authors` 的 `ensure_metadata_list` ：
```python
def ensure_metadata_list(text):
    if isinstance(text, str):
        if ';' in text:
            text = text.split(';')
        else:
            text = text.split(',')

    return list(OrderedDict.fromkeys(
        [v for v in (w.strip() for w in text) if v]
    ))
```
其认为 `;` 或者 `,` 为作者们的分隔符，这些都是小细节上的处理，完全可以根据实际情况的不同来定制你自己的metadata处理方法，具体再编写上 `Author`, `Category` , `Tag` 是要写成特殊类的，其他的都是字符串。

配置的 `DEFAULT_CATEGORY` 也要这么process一下就是这个Category类的支持。`DEFAULT_DATE` 就是字符串即可。 

```
metadata.update(path_metadata(
            full_path=path, source_path=source_path,
            settings=self.settings))
```

其中有对配置 `EXTRA_PATH_METADATA` 的支持，我不是很关心，然后看到上面关于 `DEFAULT_DATE` 还有一点没写完的逻辑：

```python
        if settings.get('DEFAULT_DATE', None) == 'fs':
            metadata['date'] = datetime.datetime.fromtimestamp(
                os.stat(full_path).st_mtime)
            metadata['modified'] = metadata['date']
```

为什么这些metadata在配置里面要以DEFAULT的字段开头，后面会讲到，这还没有实际刷文章内部定义的metadata，后面代码会显示，凡是文章内部用户自己定义的metadata都具有第一优先级，也就是字典里面的同key值覆盖动作。

接下来是下面这句，具体就是根据文件的文件名来获得一些metadata信息。比如配置 `USE_FOLDER_AS_CATEGORY` 就是根据文章所在的文件夹来获得 Category metadata。其他的读者感兴趣有需要的可以参看代码，这里笔者就不做过多讨论了。
```python
        metadata.update(_filter_discardable_metadata(parse_path_metadata(
            source_path=source_path, settings=self.settings,
            process=reader.process_metadata)))

def parse_path_metadata(source_path, settings=None, process=None):
    r"""Extract a metadata dictionary from a file's path

    >>> import pprint
    >>> settings = {
    ...     'FILENAME_METADATA': r'(?P<slug>[^.]*).*',
    ...     'PATH_METADATA':
    ...         r'(?P<category>[^/]*)/(?P<date>\d{4}-\d{2}-\d{2})/.*',
    ...     }
    >>> reader = BaseReader(settings=settings)
    >>> metadata = parse_path_metadata(
    ...     source_path='my-cat/2013-01-01/my-slug.html',
    ...     settings=settings,
    ...     process=reader.process_metadata)
    >>> pprint.pprint(metadata)  # doctest: +ELLIPSIS
    {'category': <pelican.urlwrappers.Category object at ...>,
     'date': datetime.datetime(2013, 1, 1, 0, 0),
     'slug': 'my-slug'}
    """
    metadata = {}
    dirname, basename = os.path.split(source_path)
    base, ext = os.path.splitext(basename)
    subdir = os.path.basename(dirname)
    if settings:
        checks = []
        for key, data in [('FILENAME_METADATA', base),
                          ('PATH_METADATA', source_path)]:
            checks.append((settings.get(key, None), data))
        if settings.get('USE_FOLDER_AS_CATEGORY', None):
            checks.append(('(?P<category>.*)', subdir))
        for regexp, data in checks:
            if regexp and data:
                match = re.match(regexp, data)
                if match:
                    # .items() for py3k compat.
                    for k, v in match.groupdict().items():
                        k = k.lower()  # metadata must be lowercase
                        if v is not None and k not in metadata:
                            if process:
                                v = process(k, v)
                            metadata[k] = v
    return metadata

```

再看到下面这段：
```python
        content, reader_metadata = self.get_cached_data(path, (None, None))
        if content is None:
            content, reader_metadata = reader.read(path)
            reader_metadata = _filter_discardable_metadata(reader_metadata)
            self.cache_data(path, (content, reader_metadata))
        metadata.update(reader_metadata)
```

除开缓存代码，这里面的核心逻辑就是：
```
content, reader_metadata = reader.read(path)
```

这也是官方文档在如何自定义Reader里面的讨论，那就是必须定义一个 `read` 方法，这个read方法返回content，这个content就是文章要输出的核心内容content，然后就是你想要输出的metadata。正如前面讨论的，凡是在文章中读取到的metadata都会覆写可能从其他途径获得的metadata，如下是字典的update覆写逻辑：
```
metadata.update(reader_metadata)
```

再处理完毕之后将会发送信号：
```
article_generator_context = signal('article_generator_context')
```

最后read_file返回：

```
        return content_class(content=content, metadata=metadata,
                             settings=self.settings, source_path=path,
                             context=context)
```

具体到ArticlesGenerator这里就是：
```
Article(content=content, metadata=metadata,settings=self.settings, source_path=path,context=context)
```
这个Article类pelican内部处理逻辑的支持，比如下面这句：

```
                if not article.is_valid():
                    self._add_failed_source_path(f)
                    continue

                if article.status == "published":
                    all_articles.append(article)
                elif article.status == "draft":
                    all_drafts.append(article)
                elif article.status == "hidden":
                    hidden_articles.append(article)
```
这个 `is_valid` 和 `status` 属性都是Article继承自的Content类提供的。

从配置，从文件名，从文件内容中获取metadata还只是第一步，第二个就是根据收集到的Article信息汇总，pelican需要进行一番内处理，从来方便后面的各个输出工作。

```python
        def _process(arts):
            origs, translations = process_translations(
                arts, translation_id=self.settings['ARTICLE_TRANSLATION_ID'])
            origs = order_content(origs, self.settings['ARTICLE_ORDER_BY'])
            return origs, translations

        self.articles, self.translations = _process(all_articles)
        self.hidden_articles, self.hidden_translations = _process(hidden_articles)
        self.drafts, self.drafts_translations = _process(all_drafts)
```

根据Article的status收集到的文章已经分为三类了：`all_articles` , `all_drafts`, `hidden_articles` 。上面的`_process` 进一步对翻译语种不同进行划分。这里的细节略过讨论了。

翻译问题本文忽略讨论，现在收集到三个重要的列表量： `self.articles` , `self.hidden_articles` , `self.drafts` 。

处理完之后发送信号：
```
article_generator_pretaxonomy = signal('article_generator_pretaxonomy')
```

```python
        for article in self.articles:
            # only main articles are listed in categories and tags
            # not translations or hidden articles
            self.categories[article.category].append(article)
            if hasattr(article, 'tags'):
                for tag in article.tags:
                    self.tags[tag].append(article)
            for author in getattr(article, 'authors', []):
                self.authors[author].append(article)
```

这是按category，tag和author来收集文章，这三个变量都是 `defaultdict(list)` 结构。

```python
        self.dates = list(self.articles)
        self.dates.sort(key=attrgetter('date'),
                        reverse=self.context['NEWEST_FIRST_ARCHIVES'])

```
这里将所有文章按日期排序然后汇集成 `self.dates` 变量。根据配置 `NEWEST_FIRST_ARCHIVES = True` 来。

```python
        self.categories = list(self.categories.items())
        self.categories.sort(
            reverse=self.settings['REVERSE_CATEGORY_ORDER'])
```
上面的 `self.categories` 列表化之后排序，根据配置 `REVERSE_CATEGORY_ORDER = False` 来。

```python
        self.authors = list(self.authors.items())
        self.authors.sort()
```
`self.authors` 排序。

最后还有一点context更新和缓存处理，这里就略过讨论了。

最后发送信号：
```
article_generator_finalized = signal('article_generator_finalized')
```


#### generate_output
在 `generate_output` 之前有代码：
```
writer = self._get_writer()
```
这个writer将作为参数传递给 `generate_output` 方法，其有内容：

```
    def _get_writer(self):
        writers = [w for _, w in signals.get_writer.send(self) if isinstance(w, type)]
        num_writers = len(writers)

        if num_writers == 0:
            return Writer(self.output_path, settings=self.settings)

        if num_writers > 1:
            logger.warning("%s writers found, using only first one", num_writers)

        writer = writers[0]

        logger.debug("Found writer: %s (%s)", writer.__name__, writer.__module__)
        return writer(self.output_path, settings=self.settings)

```

这一行就是对接插件Plugin的 `get_writer` 接口的：
```
 writers = [w for _, w in signals.get_writer.send(self) if isinstance(w, type)]
```
上面写成列表是因为blinker的信号返回机制，但实际起作用的只是插件的第一个。现在假设没有插件对接信号 `get_writer` ，则返回的是pelican默认的Writer，即：
```
Writer(self.output_path, settings=self.settings)
```
如果有多个，返回的则只是第一个。

然后这里我们看到，如果用户要自定义 `get_writer` 的插件的话，其构造函数至少要接受一个默认参数 `self.output_path` ，然后还要接受一个可选参数 `settings=` 。本文只讨论默认配置，所以后面就假设返回的是默认的Writer类了。

这个 `self.output_path` 来自配置的 `OUTPUT_PATH` ，默认是 `output` 文件夹。


ArticlesGenerator的generate_output做的工作，一是执行 `generate_feeds` 方法，一是执行 `generate_pages` 方法，然后发送信号：


```
    def generate_output(self, writer):
        self.generate_feeds(writer)
        self.generate_pages(writer)
        signals.article_writer_finalized.send(self, writer=writer)
```

```
article_writer_finalized = signal('article_writer_finalized')
```

#### `generate_feeds`
首先来看 `generate_feeds` 方法，如果配置有 `FEED_ATOM` ，则执行writer的 `write_feed` 方法。如果有 `FEED_RSS` ，则执行writer的 `write_feed` 方法，其中额外有参数 `feed_type='rss'` 。后面类似的还有：

- FEED_ALL_ATOM 
- FEED_ALL_RSS
- CATEGORY_FEED_ATOM
- CATEGORY_FEED_RSS
- AUTHOR_FEED_ATOM
- AUTHOR_FEED_RSS
- TAG_FEED_ATOM
- TAG_FEED_RSS
- TRANSLATION_FEED_ATOM
- TRANSLATION_FEED_RSS

这些feed文件因为我都不太需要，所以之前就按照官方文档的说法将这些配置设置为 `None` 了，所以这一块的讨论我就略过了，读者如果有需要了解的，请阅读 Writer类的 `write_feed` 方法。

#### `generate_pages`

```python
    def generate_pages(self, writer):
        """Generate the pages on the disk"""
        write = partial(writer.write_file,
                        relative_urls=self.settings['RELATIVE_URLS'])

        # to minimize the number of relative path stuff modification
        # in writer, articles pass first
        self.generate_articles(write)
        self.generate_period_archives(write)
        self.generate_direct_templates(write)

        # and subfolders after that
        self.generate_tags(write)
        self.generate_categories(write)
        self.generate_authors(write)
        self.generate_drafts(write)
```
其中这一行：
```
        write = partial(writer.write_file,
                        relative_urls=self.settings['RELATIVE_URLS'])
```
只是需要将额外的参数 `relative_urls` 传递过去，大概查了一下代码，writer的`write_file` 之前的relative_urls都设置为了配置的 `RELATIVE_URLS` ，所以这个应该是后面为了新增配置 `RELATIVE_URLS` 而引入的临时代码，由于 `RELATIVE_URLS` 默认为False，这里就认为和原 `write_file` 方法是一样的了。

现在看到 `generate_articles` 方法：
```
    def generate_articles(self, write):
        """Generate the articles."""
        for article in chain(
            self.translations, self.articles,
            self.hidden_translations, self.hidden_articles
        ):
            signals.article_generator_write_article.send(self, content=article)
            write(article.save_as, self.get_template(article.template),
                  self.context, article=article, category=article.category,
                  override_output=hasattr(article, 'override_save_as'),
                  url=article.url, blog=True)
```

在每篇文章输出之前都会发送信号：
```
article_generator_write_article = signal('article_generator_write_article')
```

然后就是执行 `write_file` 方法来输出文件，Writer类的write_file方法算是有点大的一个函数了，下面慢慢讲：

```
    def write_file(self, name, template, context, relative_urls=False,
                   paginated=None, template_name=None, override_output=False,
                   url=None, **kwargs):
```

这里的一些参数解释很多都在Article类和Content类之下，这块代码不便粘贴出来，下面就用人类的语言简要说明一下。

- save_as 首先从文章metadata读取到的SAVE_AS会存储为 `override_save_as` ，然后如果有的话，则会优先作为save_as字段。如果没有的话则会试着根据配置的 `ARTICLE_SAVE_AS` 的来配置，这里可配置参数有：原文章中读取的metadata，path，slug，lang，date，author，category。 

- template 首先说 `article.template` ，如果文章metadata定义了`TEMPLATE`。【这里额外提一句，pelican里面自定义的metadata都是小写，然后MarkdownReader读取到的metadata都会先经过lower处理，但HTMLReader并没有这样处理，不管怎么说pelican里面的metadata都应该视作小写。】则取该值，否则取默认值 `article` 。至于那个 `get_template` 方法只是额外的封装，保证目标template文件一定存在。这个判断就是用Jinja2去试着加载， `self.env.get_template(name + ext)` ，这样返回的就是Jinja2那边的Template对象了。

- article.url 和 `SAVE_AS` 大概类似的逻辑，文章有则取文章中读取到的元数据，否则按照 `ARTICLE_URL` 来生成。

- article.category 这里是直接从传递过来的metadata中读取的，因为之前已经有category的metadata修正处理逻辑了。

好吧，我之前说错了，这个 `write_file` 方法挺简单的，只是额外加了一个paginated分页逻辑，这里没有分页逻辑的话，则直接执行 `_write_file` 函数。这里有一些细节上的context处理，暂时略过讨论，于是核心逻辑就剩下：

```
output = template.render(localcontext)
```
然后是一些文件名和文件夹的处理，然后就是写出文件：
```
            with self._open_w(path, 'utf-8', override=override) as f:
                f.write(output)
```
然后发送信号：
```
content_written = signal('content_written')
```

因为localcontext是直接影响Jinja2的模板渲染的，所以关于localcontext的生成再详细谈谈。首先是最开始的context，只是从配置文件那边继承过来，然后新增了几个运行时的参数，但是也不太在意，这里又加入了一些参数，实在繁琐，后面有需要再详细讨论吧。目前就记住这个
```
localcontext = settings + 一些运行时额外的参数 + kwargs【write_file额外接受的参数，比如blog=True，这就将作为一个额外的参数传递进去。】 
```
然后就是 `localsiteurl`  有一些额外的处理，这里就略过了。

下一个过程是 `generate_period_archives` 。先试着加载 `period_archives` 或者 `archives` 模板。这个周期archive输出如果你的配置里面没有配置 `YEAR_ARCHIVE_SAVE_AS` 或者 `MONTH_ARCHIVE_SAVE_AS` 或者 `DAY_ARCHIVE_SAVE_AS` 则将跳过。

- `generate_direct_templates` 是根据配置 `DIRECT_TEMPLATES` 来进行输出。

- generate_tags 根据tag模板来进行输出
- generate_categories 根据category模板来进行输出
- generate_authors 根据author模板来进行输出

- generate_drafts 输出draft标记的文章

如果你不想输出这些网页，则配置 `AUTHOR_SAVE_AS = ''` ，类似的有：`CATEGORY_SAVE_AS = ''` 和 `TAG_SAVE_AS = ''` 。

要这些功能正常显示，还需要正确配置模板 authors和 categorys 和 tags，这些应该是走的 `generate_direct_templates` 来生成的。


### PagesGenerator
在了解了ArticlesGenerator的工作原理之后，PagesGenerator在实践中可以看作某个简化版本的ArticlesGenerator，在很多地方代码会写的很简单，因为在articles那边很多需要考虑的问题都没有了。

### StaticGenerator
对于静态文件来说 `generate_output` 方法需要重写，直接利用文件操作复制过去即可。





## 附录


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

