Slug: emacs-orgmode-learning-notes
Tags: emacs
Date: 2018

[TOC]


## org转tex初步配置

```emacs-lisp
;latex设置
(setq org-latex-default-packages-alist  '(("" "" nil)))
```

在.emacs文件里面加上那么一句，这里 **org-latex-default-packages-alist** 列表里面存储着从org文件生成tex文件默认要加载的一些宏包。这个列表是由一系列的三个元素的列表组成，其中第一个元素是要加载宏包的选项，第二个参数是要加载宏包的名字，第三个选项设置为t或者nil，即要加载或者不加载。这里就简单将 **org-latex-export-to-latex** 命令默认的要加载的一系列宏包全部都清空，因为有些宏包会和接下来我们要用的xelatex不匹配，然后既然我们经过了前面的学习已经有了自己的一般文档配置，那么简单把我们自己的文档配置加进来即可。

```text
#+LATEX_CLASS: book
#+LATEX_CLASS_OPTIONS:[11pt,oneside]
#+LATEX_HEADER: \usepackage{book}
```

上面org文档的 `#+LATEX_CLASS` 用来设置目标tex文档的documentclass，这里的 `#+LATEX_CLASS_OPTIONS` 对应的是documentclass命令的可选项，这样就对应了目标代码：

```latex
\documentclass[11pt,oneside]{article}
```

然后

```text
#+LATEX_HEADER: \usepackage{article}
```

对应的tex文档的代码是：

```latex
\usepackage{article}
```

这个article.sty文件正是我们之前一般文档配置的总结。

然后你用xelatex命令处理生成的tex文档，我们会发现配置文件都刷过去了没有问题，比如页面布局啊，字体啊等等都是有效的，生成的pdf已经很是美观了。但是我们还有一些问题要面对，第一个问题是org的输入模式和latex的对应问题，第二个问题是如何处理好自建命令和自建环境。

### title命令

默认的title命令填的是当前org文件的文件名，具体的title你可以通过：

```text
#+TITLE: mytitle
```

来配置。

类似的还有AUTHOR，DATE对应的是tex文档的author和date命令，这些命令和org文档生成的html兼容性也很好。

### 设置目录深度

在org文档上加入如下OPTIONS的配置：

```text
#+OPTIONS: toc:2
```

此即相当于在tex文档上加入了如下代码：

```latex
\setcounter{tocdepth}{2}
```

## org模式对应latex命令详解

如果你使用的是emacs编辑器，那么打开org后缀的文件即直接进入emacs的org模式，并不需要额外的配置。如果你需要更多的信息请参阅[org模式官网](http://orgmode.org/) 。

接着前面的来，如果你在org文档前面定义latex的class是article，那么一个星号对应的就是section，两个星号就是subsection，三个星对应的是subsubsection。如果latex的class是book，那么一个星号对应的latex命令是part，接下来依次是chapter和section。

四个星的情况默认转成了列表形式，这不是我们想要的。我们可以在org文件上加入这样的设置

    #+OPTIONS: H:4

这样article就支持subsubsection，book就支持subsection，也就是四级结构命令了。

为了以后方便，我们还是把 **org-export-headline-levels** 设置为一个很大的数字吧，一般5级结构，也就是五颗星够用了，article到subparagraph，book到subsubsection。

    (setq org-export-headline-levels 5)

### .emacs文件及时生效

好吧，开始对修改.emacs或者其他插件之后，需要重新启动emacs来使其生效有点厌倦了。

### org文件的基本操作

org文件的基本操作其实很简单，就是一些视图控制，比如你的光标落在一个标题上，然后按下Tab键试试，然后还有一个按键 **Shift+Tab** ，其不需要光标一定落在标题上，全局性质的展开或折叠。还有其他一些按键操作和emacs的按键操作等等先暂时不予考虑，就用鼠标操作吧。

### org对应latex基础

现在我们可以开始编写最简单的带有文档结构的org文件了，写上一段文字，我们会发现，由于各个标记语言之间内部的相似性，org上的一段文字就对应tex文档上的一段文字，就对应html文档上<p></p>包围的一部分也就是一个段落，虽然我们在org文档上多加入的空格和空行都会保留到目标tex文档和html文档上，但我们如同往常一样认为，多余的空行视作一个空行，多余的空格视作一个空格也是可行的（html文档也是多个空格只视作一个空格）。恩，对于此，我们很是满意。

然后关于页面布局的控制，我们利用之前自定义的article.sty或者book.sty里面加载的geometry宏包然后进行设置，一切都工作得很好，而且和html文档的生成毫不干扰，这很好。

然后如果我们想要使用xelatex引擎，生成的tex文档对应的sty配置文件里面，如之前所说的设置好字体配置，然后用xelatex处理之，中文显示问题即解决，一切都很好。 <span class="underline">总之，在你的目标tex文档中，如果没有使用额外的命令或环境，而只是利用宏包然后在sty文件上进行配置，那么不会有任何问题，一切都工作得很好</span> 。

那么接下来要考虑的一个就是这个很紧要的问题：tex文档的特殊符号的处理。

### 特殊的符号（org模式中）

考虑到我们要利用org文档生成目标tex文档和html文档，而这三个文档内部各有自己的原生语义癖好，所以特殊符号如何处理和显示可真是个大问题啊。

第一个问题是#符号，之前我们接触了类似 `#+TITLE` 等这样的配置写法，似乎这个符号在org文档中是注释一般的存在，可是并不尽然。如果一行开头是#符号，后面的内容不加额外的空格，那么#符号和后面的内容都会顺利的显示出来（包括html文档中），唯一要注意的是如果一行开头是#符号，然后后面跟着空格，那么这一整行都会被视作org文档内的注释内容，这一整行都不会在生成的目标tex文档或者html文档中。

然后接下来的tex文档中的一些特殊符号在org文档中都可以直接写上，其输出时都会如下所示进行转换：

    $    \$
    &    \&
    %    \%
    ^    \^{}
    {    \{
    }    \}
    ~    \textasciitilde{}
    \    $\backslash$

虽然上面的转换有些空格可能处理得不是很理想，然后\\符号最好使用 `\textbackslash{}` 命令（字体问题），但考虑到我们这条线路跟来就是更多的关注于内容，所以这些小细节且先略过吧。

值得一提的是这些符号的显示同样对于生成目标html也会有相应的处理方案，显示得很好。

#### 连字号

我们知道在tex文档中一个两个连字号在生成pdf时会处理为特殊的字符，现在这点不需要我们担心了，经过测试，org文档将一个或者两个或者三个连字号原样保留在了tex文档中，然后html文档中已经变成了对应的unicode符号了，和前面谈论的pdf显示效果是一致的。

#### 更多的符号和中文化问题

在sty配置文件中设置好即可，然后直接用输入法输入，没什么好担心的。中文化问题在sty配置文件中配置好，就不用操心了。

#### \\符号

\\符号还需要讨论一下，如果只是希望输入单独这个符号那么就直接输入即可，但是如果\\符号后面紧跟着其他字符或符号，即类似tex文档中命令这样的形式：

```latex
\test
\test{}
\test[]{}
```

那么这些代码将会原样送入tex文档中，即\\符号没有发生转变（如果\\符号后面跟着中文字符不在上面讨论的情况中，即还是普通的\\符号。）。

这似乎很方便，可以实现org文档无缝对接tex文档，但在html上就会多了很多奇怪的 `\test` 之类的命令，而且如果我们这样使用org文档，那还不如直接用tex文档作为第一编辑代码源呢。所以如上这些tex文档的命令和环境在org文档中都不推荐使用（后面还会继续详细讨论这个自定义命令的对接问题），但有一个情况是个例外，请看到下面的数学环境。

### 数学环境

接下来要讲的严格意义上和org模式关系不大了，我们在org文档中添加的原生数学环境 <span class="underline">大多</span> 原样存放在了目标tex文档和目标html文档上了，tex文档不用说了，而目标html文档之所以能够正确显示这些数学环境的tex代码是因为org生成的html目标文档配置了[mathjax](http://www.mathjax.org/) 这个工具。

但是mathjax所支持的数学环境tex代码和原latex的tex代码还是有细微差异的，下列命令或环境能够正常支持：

    $ $  行内数学环境
    $$ $$ 单行数学环境
    \[  \]  单行数学环境，没有编号

虽然上面的 `\[ \]` 环境支持，但displaymath不支持，这个有点古怪，估计是org具体生成配置还没优化好和mathjax工具无关。

然后来自amsmath宏包的equation和equation\*环境也能正常支持，不过equation没有显示编号，估计和mathjax具体的配置有关系。

然后多行数学环境，即里面可以用 `\\` 来换行的多行数学环境，gather和gather\*还有align和align\*都正常支持，同样编号没有正确显示，估计和org生成的目标html文档的mathjax配置有关。

至于这些数学环境里面那些命令可用那些命令不可用那就不好一一讨论了，应该常用的tex原生数学命令和amsmath宏包里面的数学命令（数学环境）都是支持的。

### 换行命令

`\\` 命令在html会被转换成为 `<br />` 命令，因此你可以在org文档中自如地加上换行 `\\` 命令。但是 `\\[10pt]` 这样的命令就不要用了，在html上也没有这个概念。换行命令算是一个tex命令可以进入org中的特例。

### 插入列表

插入列表org模式解决得比较完美了，无序列表项以'-'、'+'或者'\*'开头，其对应的是latex的itemize环境；而有序列表则以'1.'或'1)'开头，其对应的是latex的enumerate环境， 然后description环境org对于生成的html文档的css还有额外的处理，在org上你只要简单如下输入即可：

```text
- the bold font :: some test
```

进一步的深度定义推荐都在sty文件里面定制。

### 插入引用

org模式上插入引用也是很方便的，label对应的命令格式如下：

```text
<<targetname>>
```

其将转变成为：

```latex
\label{targetname}
```

然后要引用这个目标地点就使用如下语法：

```text
[[targetname]]
[[targetname][shownname]]
```

这里的targetname对应的就是你上面定义的地点名字，然后shownname就是实际页面显示链接的文本，如果如第一种形式不设置shownname，那么生成的tex代码是使用的ref命令，如下形式：

```latex
\ref{targetname}
```

如果加上shownname那么使用的是hyperref宏包提供的hyperref命令，如下：

```latex
\hyperref[targetname]{showname}
```

需要提醒读者的是： *targetname不能使用中文* ，shownname可以使用中文。

外部链接使用类似上面的语法：

```text
[[http://www.google.com][谷歌]]
```

其对应的tex代码如下：

```latex
\href{http://www.google.com}{谷歌}
```

其他形式还有：

```text
file:papers/last.pdf  
mailto:adent@galaxy.net
```

还有其他一些格式，这里的讨论就略过了。关于这些链接的颜色啊等等hyperref宏包的配置，请在sty文件上完成。

相应的生成的html文档代码也很好，无需多言。

### 插入脚注

由于pdf和html显示风格的不同，实际上脚注并不是那么好协调，在html上脚注更确切不应该叫做脚注而要叫做尾注。所以org模式提供了两种插入脚注语法：

      this is a test line[fn::this is a footnote]
    
      this is a test line[fn:name]
    
    [fn:name] this is a footnote

这两种写法在html上显示稍微有点区别，但无关紧要。总的来说更推荐第一种写法，其直接将脚注内容写进去不用考虑命名和编号细节，而第二种写法还要花心思去考虑脚注具体叫什么名字，浪费脑力，而且我们选择org模式不就是为了重视内容快速写作吗，第二种脚注写法有点分散写作者注意力的嫌疑。

### 特殊的文字环境

#### 粗体

注意粗体斜体等要起作用，需要和周围的字符空出来一个空格。

```text
*bold*
```

两个星号包围的字体将被加粗，对应生成的tex代码即：

```latex
\textbf{bold}
```

其对应生成的html代码如下：

```html
<b>bold</b>
```

#### 斜体和emph命令

在org模式下，如下两个/符号包围的字符信息

```text
/环境/
```

输出在html文档上将是：

```html
<i>环境</i>
```

我们似乎可以把两个/符号包围的环境称作斜体环境，如果其对应的tex代码则是：

```latex
\emph{环境}
```

tex的原始代码确实emph内的字体将用italic字形处理，不过这个命令经常被换成其他形式，比如ulem会将其换成下划线等，而我喜欢将其换成红色，觉得更有强调的效果。而html的i环境我们其实也可以稍作调整即可以达到同样的效果，比如：

```text
i{
    font-style:normal;
    color:red;}
```

这样我们可以简单理解两个/符号包围的字符是文字强调功能。

#### 下划线

我使用了一段时间ulem宏包了，除开花里胡哨的命令，uline和uwave命令是用的最多的。uwave命令以后考虑怎么处理加入去，现在uline命令org模式已经很好的支持了。

org文档中的

```text
_下划线环境_
```

将会变成tex文档中的代码：

```latex
\uline{下划线环境}
```

而其对应的html代码如下所示：

```html
<span class="underline">下划线环境</span>
```

这个underline class，org生成的html已经定义好了，具体就是文字下面加上了下划线效果。

#### 短代码环境

org文档的

```text
=verbatim环境=
~另外的verbatim环境～
```

输出html文档都会被code标签包围，即短代码环境。而在tex文档下有点差异。

第一种情况对应的是ttfamily字族情况：

```latex
\texttt{verbatim环境}
```

第二种情况对应的是verb命令：

```latex
\verb~另外的verbatim环境~
```

不得不承认这个\\~{}符号已经选得很好了，但代码内还是可能出现干扰。更多的细节参见下面的插入代码一小节的讨论。

#### verse诗歌环境

诗歌环境org模式处理的很好，会自动在每一行后面加上 `\\` 换行。所以你只需要如下输入：

```text
#+BEGIN_VERSE
这里放着
诗歌
#+END_VERSE
```

其生成的tex代码如下：

```latex
\begin{verse}
这里放着 \\
诗歌 \\
\end{verse}
```

更进一步的定制在sty文件里面配置verse环境即可。

其对应的HTML代码是：

```html
<p class="verse">
这里放着<br  />
诗歌<br  />
</p>
```

其对应的p.verse class在自动生成的html文档前面已经很粗糙的定义好了——就是简单的缩进了下，可能并不能让你满意。

#### quote引用环境

类似的quote加入语录环境有：

```text
#+BEGIN_QUOTE
这里放着quote
引用环境
#+END_QUOTE
```

对应的tex代码就是变成quote环境，没有其他改动了。html代码是对应了一个特定的代码：

```html
<blockquote>
<p>
这里放着quote
引用环境
</p>
</blockquote>
```

这个blockquote标签我还是第一次简单，html文档没有做任何配置，这个标签环境默认就有了缩进举动，有那么一点引用环境的意思了。

#### 居中环境

和上面讨论的情况类似，不赘述了。

```text
#+BEGIN_CENTER
文本居中环境
#+END_CENTER
```

### 插入一横线

```text
-----
```

如上所示，在org文档中这样的连接号大于等于5个，其将输出一横线，对应的tex代码是：

```latex
\rule{\linewidth}{0.5pt}
```

对应的html代码就是大家熟悉的hr标签了。

### 插入图片

插入图片用的和前面谈及的插入引用一样的语法，最简单的形式如下所示：

```text
[[file:images/test.jpg]]
```

其生成的tex代码是：

```latex
\includegraphics[width=.9\linewidth]{images/test.jpg}
```

注意到其并没有加入figure环境，然后对应的html代码是：

```html
<div class="figure">
<p><img src="images/test.jpg" alt="test.jpg" />
</p>
</div>
```

其已经引入figure class了。

*注意：* 插入图片就不要使用这样的形式了：

    [[file:images/test.jpg][test]]

其将变成前面讨论的插入引用的形式，tex文档用href命令处理，然后html用a标签处理。

#### 加上标题

图片加上标题如下所示：

```text
#+CAPTION: 女金刚狼
[[file:images/test.jpg]]
```

其生成的tex代码将变成这样的形式，即引入figure环境了：

```latex
\begin{figure}[htb]
\centering
\includegraphics[width=.9\linewidth]{images/test.jpg}
\caption{女金刚狼}
\end{figure}
```

#### 加上标签

```text
#+CAPTION: 女金刚狼
#+NAME: fig:test
[[file:images/test.jpg]]
```

其生成的tex代码如下所示：

```latex
\begin{figure}[htb]
\centering
\includegraphics[width=.9\linewidth]{images/test.jpg}
\caption{\label{fig:test}女金刚狼}
\end{figure}
```

非常遗憾，同在插入引用一小节所提及的，label的中文名标签不支持，所以上面只好随便取一个名字了。

值得一提的是： `#+NAME:` 必须在CAPTION的下面，而且不能单独存在——即没有CAPTION命令。

#### 简单的优化

网页那边的情况主要是居中和尺寸控制问题，推荐用css这样设置一下即可：

```css
img{
    margin-left: -2em;
    max-width: 700px;
}

figure{
    text-align: center;
}
```

其中用 `max-width` 来控制图片最大尺寸，然后 figure的设置是让图片居中。

LaTeX那边图片并没有所谓的控制图片最大尺寸的概念，参考[代写，引用缺失，下次翻到补上]这个网站，给出了这个解决方案。

```latex
\RequirePackage[export]{adjustbox}% 'export' is needed
\newenvironment{fig}[2][1]
    {\begin{figure}[H]
    \centering
    \includegraphics[scale=#1 , keepaspectratio,max width=0.95\linewidth]{#2}}
    {\end{figure}}
```

上面定义的fig环境方便读者在写LaTeX文档时快速输入图片。核心设置就是第一行引入adjustbox宏包，注意前面的选项export是一定要有的。你还需要在 `.emacs` 上加上如下设置：

```emacs-lisp
(setq org-latex-image-default-option "keepaspectratio,max width=0.95\\linewidth")
(setq org-latex-image-default-width "")
(setq org-latex-default-figure-position "H")
```

上面代码第一行加入includegraphics这个命令的默认选项，其中 **max width** 是关键，这里控制为图片如果不超过行宽0.95倍，那么就按照图片原始图片显示，如果超过，那么图片宽度就是行宽的0.95倍。

第二行情况原width的设置，如果不这么做，那么整个设置都会失效，然后第三行是设置浮动为H，有float宏包控制。

这样设置之后图片的显示大致差不多了，其他css或sty样式优化读者随意。

### 上标和下标

上标和下标在org文档中就可以这样直接使用：

```text
这是^{上标}，这是_{下标}，十分方便。
```

之所以敢这样使用是因为html文档中使用sup和sub标签即能很好地解决上标和下标问题，而生成的tex代码如下：

```text
这是$^{\text{上表}}$，这是$_{\text{下表}}$，十分方便。
```

我们看到这里自动加上数学环境进行处理了。不过推荐读者在.emacs上把下面的选项加进去<sup><a id="fnr.1" class="footref" href="#fn.1">1</a></sup>  ：

```emacs-lisp
(setq org-export-with-sub-superscripts '{})
```

这样在org上你可以自如的书写a^b和a\_b，然后用

```text
a^{b} a_{b}
```

a^{b} a\_{b} 

又可以进入上下标模式了。

### 插入表格

接下来的插入表格和插入代码，就最简单的应用并没有多少内容，不过这里将它们单独提出来作为一章，是因为在org模式和在emacs编辑器下，如何处理表格，生成表格，进行运算，如何处理代码，运算代码，加载其他文件进行运算生成表格，加载其他文件的代码等等有着丰富的内容。这部分内容算是比较高级的东西了，就拖到这后面单独成为一章了。

最基本的使用就是用 `|` 开头，然后加入表格开头元素，用 `|` 分开，然后按 **Tab** 键，后面的填充会自动跟进。

然后首行标题开头元素和后面的内容之间可以加上 `|--+--|` 这样的形式分开，只需要在开头写上 `|-` 然后按一下 **Tab** 键即可。

#### LaTeX那边的情况

表格显示这一下反倒是LaTeX那边简单些了，只需要在.emacs上加入如下设置：

```emacs-lisp
(setq org-latex-tables-booktabs t)
```

也就是启用booktabs宏包模式，然后就能生成很漂亮的三线表了。然后表格环境还支持额外插入一些属性设置，其中用的最多的就是对齐属性了，在booktabs模式下就是对应的tabular环境的对齐设置。

比如下面这个例子：

```text
#+ATTR_LATEX:  :align p{0.18\linewidth}|p{0.72\linewidth}
#+CAPTION: 表格
| x |  y |
|---+----|
| 1 |  2 |
| 2 |  4 |
| 3 |  5 |
| 4 |  6 |
```

将会生成LaTeX代码如下：

```latex
\begin{table}[H]
\caption{表格}
\centering
\begin{tabular}{p{0.18\linewidth}|p{0.72\linewidth}}
\toprule
x &amp; y\\
\midrule
1 &amp; 2\\
2 &amp; 4\\
3 &amp; 5\\
4 &amp; 6\\
\bottomrule
\end{tabular}
\end{table}
```

（推荐读者在网页布局中央核心区域宽度和生成的pdf中央核心区域宽度最好保持一致或者相差不是很远。）

#### 网页那边的情况

网页那边的情况实际上就是一些css设置问题了，我对此不是很熟，下面给出我经过摸索的一种三线表样式：

```css
table, th, td
{
    margin:0 auto;
    min-width:2em;
    text-align:center !important ;
    padding: 5px;
}

table{
    border-top: 2px solid ;
    border-bottom: 2px solid ;
}
thead{
    border-bottom: 1px solid ;
}
```

如果你实在想加上竖线，可以额外在表格前加上

```text
#+ATTR_HTML: :rules cols
```

这对应的是table的rules属性。说是html5了，不推荐这么做了，推荐的是通过css调整。不过这里考虑的是一般还是用三线表样式，有的时候表格特别长了，可以考虑临时加上rules属性，此外还有rows和all。

#### 长表格问题

在网页下倒没有表格过长的显示问题了，这是pdf分页引起的问题。首先通过 `#+ATTR_LATEX:` 的 `:environment` 将原来的tabular环境换成longtable环境，当然你需要加载longtable宏包，然后对齐参数这里推荐加入一个新的参数 **x** ，其既有p参数的控制宽度又能对齐。是由如下设置引入的（[参考的这个网站，引用  代写 ]）：

```latex
\RequirePackage{longtable}
\RequirePackage{array}
\newcolumntype{x}[1]{&gt;{\centering\arraybackslash\hspace{0pt}}p{#1}}
```

这样，下面这个例子：

```text
#+ATTR_LATEX: :environment longtable :align x{0.2\linewidth}x{0.2\linewidth}
#+CAPTION: 表格
| x |  y |
|---+----|
| 1 |  2 |
| 2 |  4 |
......
```

生成的LaTeX代码是：

```latex
\begin{longtable}{x{0.2\linewidth}x{0.2\linewidth}}
\caption{表格}
\\
\toprule
x &amp; y\\
\midrule
\endhead
\midrule\multicolumn{2}{r}{Continued on next page} \\
\endfoot
\endlastfoot
1 &amp; 2\\
2 &amp; 4\\
......
```

显示效果已经很好了。

#### 表格数据导出

org模式下对表格里面的数据可以做很多的运算，比如说光标停留在表格中的某一列，然后输入 `M-x` ，然后输入 `org-table-sum` ，那么minibuffer下会显示这一列的总和。此外还有很多其他功能吧，但目前我对这些都不感兴趣，最感兴趣的是把这些表格里面的数据导出来，导出之后方便其他脚本程序处理，作图等等。同样输入 `M-x` ，然后输入 `org-table-export` ，你就会看到提示了。

## org转html和tex的协调问题

其实org的转html和tex文档的协调问题很好解决，加入

```text
#+LATEX: \appendix
```

那么这一行的内容，就只原样输入进tex文档中，不进入html文档中。类似的有命令：

```text
#+HTML:
```

类似的还有

```text
#+BEGIN_LATEX
这里将原封不动的放入tex文档
#+END_LATEX
```

但是既然我们选择了org模式，那么就不应该过多的添加tex原始代码。html和tex这种代码越多你的org文档就越复杂（最糟糕的情况可能是等于你编写了两边文档），所以如果一定要用的，那么还是推荐使用

```text
#+LATEX: \appendix
```

这种一行的修正。

以下这些命令是基于tex文档结构的，可以考虑加进去，加进去了反而可以更好地提醒写作者此处我在写些什么。

```latex
\mainmatter
\appendix
\backmatter
```

其中mainmatter命令放在文档内容开始的前面，然后appendix放在你的附录标题前面，backmatter放在你的参考文献标题前面。其他内容照旧，html没有页码自然不用考虑那些问题。注意 <span class="underline">这些命令都是针对book类的</span> 。

其中参考文献为了考虑协调性如果没有太多的话就使用简单的列表表达即可。

### 原有环境命令属性的修正

其只适用于表格，图片，列表，源代码和其他特殊的区块。

```text
#+ATTR_LATEX:
```

### 文档内非要使用自定义的命令

基于简单原则，sty配置文件最好不要引入额外的自定义命令和环境，如果实在不得不使用自定义的命令或环境，同时内容最好是html和pdf都共享的（这正是org模式本身要求的），那么接下来工作就会变得很多了，下面主要讨论这个问题。

在前面讨论的各种情况中，如果org模式针对tex代码和html代码有特定的环境命令或class，那么推荐进一步定制该环境命令或class即可。下面讨论的情况是除开这些特定的环境命令或class，要使用其他的环境命令或者class，那么在org文档中，任何

```text
#+BEGIN_WHAT

#+END_WHAT
```

都将输出为tex文档的如下格式：

```latex
\begin{what}

\end{what}
```

对应的html文档代码是：

```html
<div class="what">
<p>
what
</p>
```

然后读者把tex文档的该what环境（在sty文件中）配置好和把html的该what class（在css文件中）配置好即可。

## 插入代码

小代码之前讲过了，两个等号或者两个波浪号包围的在tex文档中一个对应ttfamily字体，一个对应verb命令。

### 简单的代码

简单的代码如下所示，其对应的就是tex文档的verbatim环境。

```text
#+BEGIN_EXAMPLE
       THIS IS A EXAMPLE ENVIRONMENT
#+END_EXAMPLE
```

不需要华丽表现不需要染色的简单代码就推荐使用EXAMPLE环境，不过我对verbatim环境不太满意，主要是前后没有分割直线，没有将代码和文本和清晰的分开。一直使用的是fancyvrb的Verbatim环境，那么我们如何把org模式的EXAMPLE环境对应的输出为Verbatim环境呢？

本来以为这个问题会很简单，不过目前要达到这种效果还有点麻烦，因为目前（2015-01-22）的org模式的EXAMPLE并没有把这个选项打开，在参考[这个网站](http://lists.gnu.org/archive/html/emacs-orgmode/2013-04/msg01018.html) 的情况下，大致的一个解决方案如下：

1.  首先如果你是手工编译的emacs，那么在[lisp]→[org]文件夹里找到ox-latex.el这个文件，在这个文件里看到 **org-latex-example-block** 这个函数，看到format那里，你就明白为什么默认的输出的verbatim环境。那么将最后两行删除，即进行如下改动：
```text
    -     (format "\\begin{verbatim}\n%s\\end{verbatim}"
    -     (org-export-format-code-default example-block info)))))
    +     (format "\\begin{%s}\n%s\\end{%s}"
    +     org-latex-verbatim-env
    +     (org-export-format-code-default example-block info)
    +     org-latex-verbatim-env))))
```
这里简单知道%s类似大多数编程语言的字符串处理方式即可，这样环境就改为由 **org-latex-verbatim-env** 来定义了。然后重新编译emacs。

我之前是自己编译的emacs，但并没有采取上面的方式，采取的是下面提及的更新org宏包的方式。

首先在.emacs文件里面加入如下代码：

```text
;more package
(require 'package) ;; You might already have this line
(add-to-list 'package-archives
             '("melpa" . "http://melpa.org/packages/") t)
```

这将为你的emacs宏包管理提供更多的可用宏包，这些宏包是由melpa提供的。然后打开emacs，打开options的宏包管理，你就可以看到更多的宏包选项了，其中有最新的org，安装即可。这些宏包都放在你的主文件夹的 **.emacs.d** 文件夹那里。

这里顺便提一下如何通过这个宏包管理插件删除安装的宏包，将光标移动到你想删除的宏包名字那里，按一下字母 **d** 键，你就可以看到前面有个标记D，然后移动光标到其他位置，按下 **x** 键你就会看到minibuffer有提示了<sup><a id="fnr.2" class="footref" href="#fn.2">2</a></sup> 。

在.emacs.d文件夹的elpa文件夹里面，你会看到org宏包相关的文件夹，同样打开找到ox-latex.el文件，然后类似上面谈及的做出一些修改，然后注意更新一下elc文件。具体就用emacs打开这个文件，然后在emacs-lisp下面的byte-compile this file选项。

1.  接下来就是修改.emacs文件，把我们修改好的接口 **org-latex-verbatim-env** 这个变量定义好：

    (setq org-latex-verbatim-env "Verbatim")

好了，你可以测试一下效果了。

### 更华丽的代码

org模式还提供了SRC环境，对应的是latex的更华丽的代码环境：

```text
#+BEGIN_SRC python 
print('hello')
#+END_SRC
```

其输出可以调成listings环境：

```lisp
(setq org-export-latex-listings t)
```

不过我不太喜欢listings环境，其对minted环境的输出支持也很好（后面将要谈到的选项支持）：

```lisp
(setq org-latex-listings 'minted)
```

minted环境有个问题，就是加上背景色之后分页会有问题，在之前的介绍xelatex基础语法中的插入代码一小节里谈到的自定义命令tcbpython和tcbbash如何引入进来呢，因为tcolorbox和minted结合在显示代码这一块很是完美和让人满意了。

我们可以在.emacs文件里进行如下设置：

```emacs-lisp
(setq org-latex-custom-lang-environments
      '((python "tcbpython")
        (bash "tcbbash")
        ))
```

这样，当你的SRC环境后面跟着bash，

```text
#+BEGIN_SRC bash
sudo pip3 install pygments
#+END_SRC
```

就会输入tex代码如下：

```latex
\begin{tcbbash}
sudo pip3 install pygments
\end{tcbbash}
```

类似的上面我们还定义了python对应的是tcbpython，也会对应成tcbpython环境。而我们没有自定义的语言，如果你设置了minted为默认引擎，
比如这样的情况：

```text
#+BEGIN_SRC emacs-lisp
some code
#+END_SRC
```

那么将生成这样的tex代码：

```latex
\begin{minted}[]{common-lisp}
some code
\end{minted}
```

这已经很好了。至于html那边的情况，代码都能正常显示，但没有染色，你可以安装emacs的htmlize宏包来达到某种染色效果。。但真的好丑陋，我对那边的情况还不太熟悉，所以这里略过不做讨论了。

#### SRC环境的一些选项

SRC环境跟着程序语言种类之后后面还可以跟很多选项，其中有些选项很复杂，还有一些设置很底层。这个有兴趣的慢慢研究手册吧。

暂时就介绍一个选项 **-n** ：

```text
#+BEGIN_SRC emacs-lisp -n
def main(args):
    return 0
#+END_SRC
```

如果SRC环境选择是minted环境作为输出，那么其参数会对应的设置进去：

```latex
\begin{minted}[linenos,firstnumber=1]{common-lisp}
def main(args):
    return 0
\end{minted}
```

如果是listings环境也会支持的很好，但是如果是前面谈及的自定义的tcbpython环境或tcbbash环境，代码的每一行前面都将加上数字：

```text
1  def main(args):
2      return 0
```

这不是很美观，更好的做法，如果你喜欢加上数字，那么在sty配置文件的tcbpython（或者你定义的什么名字）的定义里加上：

```text
minted options={linenos,numbersep=3mm}
```

即可。

当然假设你定义的python对应的是what环境也没问题，反正这里不涉及html，然后你在sty文件里面配置好这个what环境即可。

最好就是如下的无参数what环境形式。

```text
\begin{what}

\end{what}
```

### 插入代码文件

废话不多说，插入代码文件格式如下：

```text
#+INCLUDE: "~/.emacs" src emacs-lisp
```

当然是不可能采取这种形式的，就是INCLUDE命令放在SRC环境里面，这样将不会被执行而被视作代码。所以插入代码文件只能采取上面的形式，后面跟着src，似乎还有其他可能性，然后接下来是程序语言，当然前面提及的SRC环境的一些选项也是可以加上去的。



## 项目管理

emacs的org模式的项目管理都是通过 `org-publish-project-alist` 这个参数来配置的。其有很多花俏的参数和复杂的配置，这里给出一种简单的解决方案。我心目中的理想方案是要在输出html和输出pdf之间进行协调，而且最好每一个书籍都有一个独立的文件夹，自己内部的图片文件环境等，这样引用逻辑就会很简单。

在这种考虑下，我的emacs只做了如下简单的配置：

```emacs-lisp
;publish
(setq org-publish-project-alist
      '(("website"
         :base-directory "~/工作空间/website"
         :exclude "templates/.*"
         :recursive t
         :publishing-directory "~/工作空间/website/"
         :publishing-function org-html-publish-to-html)
        ))
```

这里website是项目名字 ，等下你要在 **org-mode** 下 运行命令 **org-publish-project** ，然后输入这个名字，即进行了整个org项目的pulish操作。

**base-directory** 这个参数就是你的org文件的放置根目录，然后 **exclude** 是排除templates这个文件夹（因为这个文件夹会放置整个项目都会使用的一些模板文件图片文件等等。）。下面的 **recursive** 这个参数设置为 `t` ，这个很关键，你看到其和前面的 **base-directory** 是一样的，再加上这个递归支持，这样就会保留原项目的文件目录系统，简单来说就是对于某个文件夹某个文件夹下的某个org文件，其会在原地输出html文件，而这正是我喜欢的效果。

最后 **publishing-function** 设置publish执行的函数动作，这里只加上了输出html文件的动作。因为tex那一块还很不完美，（比如minted宏包对于代码路径管理就有问题，提交一个bug他们说最新版的修复了不过ubuntu的texlive这里还没发布出来。），况且对应pdf制作放在最后做成完美形式也是合情合理的，所以就不加进去了。

### 项目所有文档强制刷一遍

参考了 [这个网页](http://stackoverflow.com/questions/21258769/using-emacs-org-mode-how-to-publish-the-unchanged-files-in-a-project) 。

不需要进入org模式，就按M-x，然后输入 `ielm` 进入elisp交互环境，然后输入下面的命令即可。后面的t就表示全部都强制刷一边，project\_name就是上面你设置的项目名字。

```text
(org-publish "project_name" t)
```

## org模式其他额外的特性

### 快速输入

emacs深度定制能够开发出很多快速输入技术，而org模式自带的就有一些快速输入的方法了，已经很好用了。比如你要快速输入EXAMPLE环境，先输入一个 *<* 符号，然后再输入一个小写字母 *e* ，然后按下Tab键，就能快速输入EXAMPLE环境，类似的有：

-   **c:** CENTER环境
-   **e:** EXAMPLE环境
-   **h:** HTML环境
-   **H:** HTML单行命令，即 `#+HTML:`
-   **I:** INCLUDE单行命令，即 `#+INCLUDE:`
-   **l:** LATEX环境
-   **L:** LATEX单行命令，即 `#+LATEX:`
-   **q:** QUOTE环境
-   **s:** SRC环境
-   **v:** VERSE环境

#### 定义自己的快速输入

本小节参考了 [这个网页](http://stackoverflow.com/questions/19145433/shortcut-for-inserting-environments-in-org-mode/19146417) 。

除了上面提及的快速输入之外，你还可以定义自己的快速输入方法。 就是往 `org-structure-template-alist` 这个列表值里面添加一些内容:

```lisp
(add-to-list 'org-structure-template-alist '("C" "#+CAPTION: "))
(add-to-list 'org-structure-template-alist 
    '("f" "#+BEGIN_FRAMED\n?\n#+END_FRAMED"))
```

使用add-to-list函数来将某个元素添加到目标列表值中去，元素是一个元组，第一个是快速输入的表示字母，第二个是具体输入的字符。我们看到第二个例子，其中 `\n` 表示换行，然后 `?` 是等下光标要停留的地方。

### org输出markdown文档

pandoc并不支持org输出markdown文档，它能够做到将markdown输出为org文档，但我看不出来这有什么用，因为大家都懂得，emacs的org模式是如此的强大，最大的快乐就是在这种模式下进行编辑工作，那么谁还需要将markdown文档输出为org文档？

有的时候我们是希望走这条路线的，那就是将org文档输出为markdown文档，然后将这些markdown文档放入某个静态或者动态的网站框架下，从而既有了内容层和表现层的分离灵活，又获得了emacs的org模式的强大内容编辑能力。而org其实是有支持输出markdown文档的后台的，其对应的输出命令是 `org-md-export-to-markdown` 。直接这么用即可，并不需要什么配置。

但是你那边可能不能这么用？不太清楚，最好在你的配置文件里面加上这么一句:

```emacs-lisp
(add-to-list 'org-export-backends 'md)
```

但这样输出的markdown文档src区块和example区块都输出缩进的代码形式，推荐安装 `ox-gfm` 宏包来生成github更友好的markdown文档，其将src区块处理为了三个斜点 `` ``` `` 符号封装的环境，加上对应的语言标明。

其github项目地址在 [这里](https://github.com/larstvei/ox-gfm) 。然后按照常规将其装上:

```lisp
;;; ox-gfm
(add-to-list 'load-path "~/工作空间/myemacs/myorg/ox-gfm")
(require 'ox-gfm)
```

这样你就可以使用 `org-gfm-export-to-markdown` 命令来生成结构更好一点的markdown文档了。



<div id="footnotes">
<h2 class="footnotes">Footnotes: </h2>
<div id="text-footnotes">

<div class="footdef"><sup><a id="fn.1" class="footnum" href="#fnr.1">1</a></sup> <div class="footpara"><a href="http://stackoverflow.com/questions/26636562/org-mode-weirdness-with-org-export-with-sub-superscripts">参考网站</a></div></div>
<div class="footdef"><sup><a id="fn.2" class="footnum" href="#fnr.2">2</a></sup> <div class="footpara">参考了 <a href="http://stackoverflow.com/questions/20541322/how-to-remove-installed-elpa-package">这个网站</a></div></div>
</div>
</div>