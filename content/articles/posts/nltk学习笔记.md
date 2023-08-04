Slug: nltk-learning-notes

[TOC]



## 前言

nltk是一个很有用的关于自然语言处理研究学习的支持性python模块。

## 安装和使用

nltk作为python模块安装并没有什么好说的，不过你还需要安装`nltk_data` ，通过运行：

```
import nltk
nltk.download()
```

即可，当然你也可以自己手工配置。其搜索路径是如下配置的：

```python
if sys.platform.startswith("win"):
    # Common locations on Windows:
    path += [
        os.path.join(sys.prefix, str("nltk_data")),
        os.path.join(sys.prefix, str("share"), str("nltk_data")),
        os.path.join(sys.prefix, str("lib"), str("nltk_data")),
        os.path.join(os.environ.get(str("APPDATA"), str("C:\\")), str("nltk_data")),
        str(r"C:\nltk_data"),
        str(r"D:\nltk_data"),
        str(r"E:\nltk_data"),
    ]
else:
    # Common locations on UNIX & OS X:
    path += [
        os.path.join(sys.prefix, str("nltk_data")),
        os.path.join(sys.prefix, str("share"), str("nltk_data")),
        os.path.join(sys.prefix, str("lib"), str("nltk_data")),
        str("/usr/share/nltk_data"),
        str("/usr/local/share/nltk_data"),
        str("/usr/lib/nltk_data"),
        str("/usr/local/lib/nltk_data"),
    ]
```

具体里面的内容可以在 [nltk_data](https://github.com/nltk/nltk_data) 这个github项目中找到。具体内容在packages下面，其中corpora的内容是不需要zip解压的，其他的一般需要先解压再放好位置。



## 有用的工具集







### FreqDist

很有用的一个类，其继承自Counter类，用于记数的一个字典。

输入的是就是你分词好的词汇列表：`[a, b, c, a ,a ,b .....]`

```python
t = FreqDist([a,b,c,a....])
```

其内部会自动处理然后得到一个词的词频统计，比如下面是看频率最高的25个： 

```
t.most_common(25)
[('天下', 56), ('不', 51), ('圣人', 32), ('道', 27), ('谓', 24), ('曰', 21), ('万物', 20), ('吾', 20), ('无', 18), ('欲', 14), ('无为', 13), ('亦', 10), ('章', 10), ('人', 9), ('天地', 8), ('不争', 8), ('下', 8), ('道者', 8), ('大', 8), ('夫', 8), ('无以', 8), ('贵', 7), ('不知', 7), ('知', 7), ('善人', 7)]
```

### bigrams

自然语言处理研究中的n元语法模型中的二元语法：

```
>>> list(bigrams([1,2,3,4,5]))
[(1, 2), (2, 3), (3, 4), (4, 5)]
```



### ConditionalFreqDist

其是一个字典套字典结构，第一个字典key是一些条件，具体再引用该条件`cfd[condition]` 返回的是一个FreqDist对象。更具体来说其用来存储某一条件下的FreqDist分布。

```
cfd = ConditionalFreqDist([['1','a'],['1','b'],['0','a'],['1','a']])
cfd['1']
FreqDist({'a': 2, 'b': 1})
cfd['0']
FreqDist({'a': 1})
```



### str2tuple

一般POS（part of speech）标注或者其他标注都可以采用 `word/tag` 这样的格式，然后可以利用 `str2tuple` 函数来拆分它们。

```
tagged_token = str2tuple('fly/NN')

tagged_token
('fly', 'NN')
```

```python
def str2tuple(s, sep="/"):
    pass
```

第二个参数sep默认是 `/` ，你也可以指定其他的分隔符。

### Index类

Index类是一个默认为列表的defaultdict类，可以用来构建多值字典。

```
index = nltk.Index([('a',1),('a',2),('b',3)])
index
Index(<class 'list'>, {'a': [1, 2], 'b': [3]})
```

## 语料库管理

nltk的语料库管理并不是重点，不过其提供的一些语料库接口是值得学习的，比如说：

```
from nltk.book import gutenberg
```

这个gutenberg具体利用的是 `PlaintextCorpusReader` 这个类。

可以利用这个类来加载你自己的txt文本，不过中文的话需要自己定义Tokenizer类。一个简单的类如下所示：

```python
from nltk.tokenize.api import TokenizerI

class JiebaTokenizer(TokenizerI):
    def tokenize(self, s):
        return jieba.lcut(s)
```

你需要实现tokenize这个方法，切分字符串然后返回的是列表。

中文分句一个简单实现就是利用正则表达式来切分：

```python
from nltk import RegexpTokenizer
from my_python_module.basic.list import combine_odd_even

class ChineseSentenceTokenizer(RegexpTokenizer):
    def __init__(self):
        RegexpTokenizer.__init__(self, r"(。|？|！)", gaps=True)

    def tokenize(self, text):
        res = super(ChineseSentenceTokenizer, self).tokenize(text)
        return combine_odd_even(res)
```

上面的combine_odd_even是我自己定义的一个方法，将列表奇偶元素相加，这里不是讨论的重点，略过了。

然后我们定义 `load_corpus` 来加载txt语料：

```
def load_corpus(root, word_tokenizer=JiebaTokenizer(),
                sent_tokenizer=ChineseSentenceTokenizer()):
    return PlaintextCorpusReader(root, r"(?!\.).*\.txt",
                                 word_tokenizer=word_tokenizer,
                                 sent_tokenizer=sent_tokenizer,
                                 encoding='utf8')

zh_gutenberg = load_corpus('D:/nlp_data/corpora/zh_gutenberg')
```

这个root指向你的语料库的文件夹即可，下面放着一些txt文本。

然后如下利用nltk的Text类来加载语料进行分析。

```
laozi = Text(zh_gutenberg.words("laozi.txt"))
lunyu = Text(zh_gutenberg.words("lunyu.txt"))
```

后面就对应上官方教材的叙述了。

### 语料库接口

如下调用语料库的原始文本，利用你之前设置好的word_tokenizer分词后的词语列表，利用你之前设置好的sent_tokenizer分句之后的句子列表。

```
zh_gutenberg.raw('xiyouji_s.txt')
zh_gutenberg.words('xiyouji_s.txt')
zh_gutenberg.sents('xiyouji_s.txt')
```

## Text接口

### concordance

索引词

```
text1.concordance("monstrous")
```

### similar

根据上下词环境来找相似词

```
text1.similar("monstrous")
```

###  common_contexts

两个词之间的共同上下词环境

```
 text2.common_contexts(["monstrous", "very"])
```

### generater

根据上下文来随机生成一些文本。

```
laozi.generate()
```

### collocations

原nltk的Text类里面的这个方法只是专门针对英文的，如果重新写一个ChineseText类继承并重载这个方法：

```python
class ChineseText(Text):

    def collocation_list(self, num=20, window_size=2):
        """
        Return collocations derived from the text, ignoring stopwords.

            >>> from nltk.book import text4
            >>> text4.collocation_list()[:2]
            [('United', 'States'), ('fellow', 'citizens')]

        :param num: The maximum number of collocations to return.
        :type num: int
        :param window_size: The number of tokens spanned by a collocation (default=2)
        :type window_size: int
        :rtype: list(tuple(str, str))
        """
        if not (
                "_collocations" in self.__dict__
                and self._num == num
                and self._window_size == window_size
        ):
            self._num = num
            self._window_size = window_size

            from .chinese_stop_words import STOP_WORDS

            finder = BigramCollocationFinder.from_words(self.tokens,
                                                        window_size)
            finder.apply_freq_filter(2)
            finder.apply_word_filter(lambda w: w in STOP_WORDS)
            # 移除空白字符
            from my_python_module.nlp.utils import is_empty_string
            finder.apply_word_filter(lambda w: is_empty_string(w))

            bigram_measures = BigramAssocMeasures()
            self._collocations = list(
                finder.nbest(bigram_measures.likelihood_ratio, num))
        return self._collocations
```

具体修改是原过滤器过滤了词语的长度，这个不适合中文。然后停用词换成了中文停用词词库。然后增加了一个空白字符去除动作。

具体里面评估二元语法组得分用的是 `bigram_measures.likelihood_ratio` 这个算法。有兴趣可以研究一下，这里暂时略过了。
