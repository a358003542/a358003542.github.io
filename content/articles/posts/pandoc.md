Slug: pandoc

[TOC]

## 前言

pandoc是一个非常强大的文档格式转换工具，你可以利用它来根据markdown来转换生成epub，或者根据html来生成epub。也可以根据latex文档输出markdown或者根据latex输出epub和html等等。


### 从latex刷html经验总结
```
pandoc --toc -s -o main.html main.tex --metadata-file=epub.yaml
```
`--toc` 会根据latex里面的 `\tableofcontents` 再<body> 里面新增一个<nav> 字段，里面有目录结构。

```html
<nav id="TOC" role="doc-toc">
<ul>
<li><a href="#编者言">编者言</a></li>
<li><a href="#古训增广贤文">古训增广贤文</a></li>
<li><a href="#附录">附录</a>
<ul>
<li><a href="#新增广贤文">新增广贤文</a>
<ul>
<li><a href="#上集">上集</a></li>
<li><a href="#下集">下集</a></li>
</ul></li>
</ul></li>
</ul>
</nav>
```

在转化中，latex的part命令对应html的h1标签，section命令对应html的h2标签，后面的以此推断之。

`-s` 输出完整版的html文件，也就是包含html，head，body这些标签。

tex里面的 title 命令 和 author 命令会让html有：
```
  <meta name="author" content="增广贤文" />
  <title>增广贤文</title>
```
此外在body之下还会有：
```
<header id="title-block-header">
<h1 class="title">增广贤文</h1>
<p class="author">增广贤文</p>
</header>
```

下面讲到的metadata也可以直接传递title和author这两个metadata，效果同上。



`--metadata-file` 编写一个yaml文件，里面定义一些传递给pandoc的额外的参数。

#### metadata解释
title和author上面已经解释了。

- date 会增加这两行关于date的信息描述，一个是meta，一个在body之下。

```html
    <meta name="dcterms.date" content="2021-10-02" />

    <header id="title-block-header">
    <h1 class="title">增广贤文</h1>
    <p class="author">增广贤文</p>
    <p class="date">2021-10-02</p>
    </header>
```

- lang 如果没有则lang描述为空，如果设置则有：
```
<html xmlns="http://www.w3.org/1999/xhtml" lang="zh" xml:lang="zh">
```

### 从tex刷epub经验总结
如果你的文件源是tex并想制作epub文件，那么推荐如下一步到位：
```
pandoc -o main.epub main.tex --metadata-file=epub.yaml
```

可能会有需要利用calibre来进一步进行epub编辑，但如果能够从文件源内容控制入手一步到位当然会更好。

首先是目录，因为tex具有良好的目录标记定义，输出的epub目录也是良好的【这里说的epub目录指的是epub阅读左侧用于导航用的目录，也可以说是书签。】

epub的目录输出首先会自动根据metadata的title来生成一个h1标识，并作为第一个顶级书签。后面part或者chapter你自己随意，虽然epub内部显示效果都是可以调整的，不过epub内部editor打开可以看到，最好认为 part命令 对应epub的 一个章节也就是内部的ch001.xhtml一个独立文本。在显示上这样一个`ch001.xhtml`的独立文本是单独起页的。而假如是多个chapter命令则其仍然都会归于一个`ch00?.xhtml` 文本中，在显示tex的上一chapter和另外一chapter命令之间的内容不是单独起页的。**因此我推荐在编写tex的时候认为part对应传统意义上的一章来输出epub**。


tex里面的 title 命令 和 author 命令会让epub的`title_page.xhtml` 有内容：
```
<section epub:type="titlepage" class="titlepage">
  <h1 class="title">增广贤文</h1>
  <p class="author">增广贤文</p>
</section>
```
不过这只是自动生成的封面，具体和epub的metadata相关的是 `content.opf` 哪里定义的：
```
    <dc:title id="epub-title-1">增广贤文</dc:title>
    <dc:creator id="epub-creator-1">增广贤文作者</dc:creator>
```
是的author在epub那边是 `dc:creator` ，导入calibre会根据这里的对应来自动填入元数据。

- date 影响的是 `content.opf` 里的这个字段：

```
    <dc:date id="epub-date">2021-12-01T04:37:02Z</dc:date>
```
如果不填入这个metadata会自动填入当前的时间点。

- lang 影响的是 `content.opf` 里的这个字段：

```
    <dc:language>en-US</dc:language>
```
如果不填入这个metadata会自动填入en-US。中文的代码是 `zh` ，其他语言请参看 [这个网页](https://www.rfc-editor.org/info/bcp47) 。calibre会根据这里来自动填入语种元数据。



-  subjects

```
subject: [文学 - 哲学,]
```

其影响的是 `content.opf` 里的这个字段：
```
    <dc:subject>文学 - 哲学</dc:subject>
```
calibre会自动根据这个来填写标签元数据。

- css 指定epub的css文件，否则epub只有默认的css配置。
  
- cover-image 指定epub的封面。


### 从html刷epub经验总结
首先就多个html作为文件源的情况作出说明，请始终认为只有一个html文件源，pandoc接受多个html文件源首先就会将他们合并为一个html文件源。比如说文章内链接，本来可能在两个html文件内，都应该用一个html文件源的思路来处理。再说得详细点，假设两个html：ch1.html和ch2.html，其中ch2有一小节标记文章内链接锚点：
```
<section id="section1">what</section>
```
那么ch1.html中想要正确链接该小节，直接使用 `<a href="#section1"></a>` 即可。

epub的目录输出首先会自动根据metadata的title来生成一个h1标识，并作为第一个顶级书签。后面h1或者h2你自己随意，虽然epub内部显示效果都是可以调整的，不过epub内部editor打开可以看到，最好认为 h1 标签 对应epub的 一个章节也就是内部的ch001.xhtml一个独立文本。在显示上这样一个`ch001.xhtml`的独立文本是单独起页的。而假如是多个h2命令则其仍然都会归于一个`ch00?.xhtml` 文本中，在显示上一个h2的内容和另外一个h2的内容不是单独起页的。**因此我推荐在编写html的时候认为h1对应传统意义上的一章来输出epub**。

**第二个推荐是所有的html头内容都删除**，也就是html,head,body这些标签都可以删除，一些metadata都通过 `--metadata-file` 来传递：

在实践中因为calibre的epub编辑器有目录自动生成功能和页面内目录自动生成功能，所以实际制作的时候没必要加入目录页了。

从网络中弄来的html资源，假设是已经下载下来的图片则会自动集成到epub里面去，而很多站内的链接假设多个网页之间id命名没有重复的话，则你将href地址的前面一大串删除，只留下 `#what` 即可。不过从网络上弄来的html资源是不可控的，具有太多复杂性，不像从markdown刷epub基本上没有太多意外。所以仍然可能有大量的校对修正工作。

个人建议利用pandoc将多个html合并输出一个epub大概样子之后就脱离pandoc工作流程了，后续的需求都利用calibre的epub编辑工具来进行。正如前面所说的，如果是从低复杂度刷高复杂度的文档，比如说markdown到html，基本上是满意的，但如果你的参照物是某个表现形式复杂的html网页，然后通过pandoc希望刷出类似效果的epub则是总不会令你满意的，最好是直接将epub视作一个打包的html和css等资源的集合直接到epub那边去编辑。这就好比一个复杂的东西经过某个统一的流程化的东西，还希望那个复杂的东西保持其个性特殊性，则显然是不现实的。

在进入calibre的epub编辑之前，需要做的工作如下：

1. html无关的head部分删除

2. html的h1, h2等文档结构标记基本确定【尤其是一些不规范的网页需要专门编写脚本来**清洗h头标签**，因为后面calibre自动生成就是根据这些标签来的，而且按照html规范写法也不应该随意乱用这些标签的。】

3. 合并成为一个主html

4. 这个时候pandoc的工作就算完成了，html情况太过于复杂，对于获得的那个主html结果肯定还有一些不满意的地方，但这都是后面的工作了。

5. 脚本处理：这部分工作需要额外编写一些脚本，来分析整理主html，比如有任务： **站内链接转文章内链接**，**站内链接html内容递归访问嵌入进来**，**站内链接图片下载到本地**。个人实践来看，这一过程需要编写好对应的check函数，然后反复刷反复check，直到脚本下一次工作链所有的check函数会报告工作量为0，也就是就算再执行一个工作链流程也基本上什么也不会做，这个时候主程序退出。这一过程任何网络请求都应该做好缓存工作，此外整个工作链的输入输出文件IO名字要有良好的定义规范。

6. 脚本处理完之后，利用pandoc将主html输出为epub文件，集成好一些epub文件元数据。


**强调：上面的流程该做的工作都应做好无误，epub反复阅读没有大问题，才能进入到calibre的epub编辑工作。因为再也无法回头了，上面的流程那一步没做好，修改代码，再刷再修改就是，到这里就不行了。** 但也不要做到尽善尽美，就是把那些数量众多一定要脚本处理的问题在上面流程做好，一些小问题小细节在calibre那边修改会更方便一些的。

calibre的epub编辑器有很多功能，比如目录生成啊，html代码优化啊，图片精简啊，epub检查等等，有时间会另外写篇关于calibre的epub编辑功能的文章。

```
pandoc -o main.html CHAPTER-1.html CHAPTER-2.html 
pandoc --metadata-file=epub.yaml  -o main.epub main_out.html
```

