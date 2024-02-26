Date: 20230607


[TOC]

## 引言
图书预处理最开始还是需要OCR步骤的，不可能完全手工输入，因为图书排版上的多样，再强大的OCR软件应该也是做不到百分之百准确的，当然最好预处理的时候准确率越高越好，这样后面校对手工工作就少一些。

[pdf24](https://tools.pdf24.org/zh/) 这个软件以前是接触过的，进行一些pdf分割，优化压缩大小等很方面，免费又强大，然后看到pdf24已经有这个ocr文字识别功能了，试着看怎么样，不想一直在报错。

后来又找了好多其他的软件，都是要收费的，鄙人太穷。github上随便翻看了一下，一些神经网络项目看不大懂，鄙人太笨，只想进行一个简单的OCR而已。但大概也看到在OCR领域谷歌开源的tesseract是一个不错的选择，于是又折腾了一会，想到还要用python来分割pdf然后如何头要大了。

突然灵感迸发，之前看到pdf24的报错信息是少了什么traindata，难道是少了模型数据。然后跑到pdf24软件的安装目录哪里，发现有一个tesseract文件夹，也就是说pdf24的文字识别功能就是基于tesseract的，然后我一看：

```
PS C:\Program Files\PDF24\tesseract> .\tesseract.exe -v
tesseract 5.3.0
 leptonica-1.83.1 (Apr 13 2023, 15:31:55) [MSC v.1929 LIB Release x64]
  libgif 5.2.1 : libjpeg 6b (libjpeg-turbo 2.1.5.1) : libpng 1.6.39 : libtiff 4.5.0 : zlib 1.2.13 : libwebp 1.3.0 : libopenjp2 2.5.0
 Found AVX2
 Found AVX
 Found FMA
 Found SSE4.1
 Found libarchive 3.6.2 zlib/1.2.13 liblzma/5.4.1 bz2lib/1.0.8 liblz4/1.9.4 libzstd/1.5.4
 Found libcurl/8.0.1-DEV Schannel zlib/1.2.13
```

pdf24的tesseract竟然还挺新的，然后就阅读tesseract文档，看那个模型文件到底咋回事。

## tesseract模型文件
首先需要把 [osd.traineddata](https://github.com/tesseract-ocr/tessdata/raw/3.04.00/osd.traineddata) 和 [equ.traineddata](https://github.com/tesseract-ocr/tessdata/raw/3.04.00/equ.traineddata) 这两个文件下载下来放到pdf24的tessdata文件夹下。

然后tesseract模型文件从4.0+开始分为几个：

1. tessdata_fast 跑得快但是准确性不高
2. tessdata_best 跑得慢而准确性高一些
3. tessdata 兼顾速度和准确性的中庸版本

因为我之前tesseract windows版本装上了，就把中英文的模型文件复制过来了，从文件大小来看应该是fast版本，后来我又试了一下best的版本，不清楚是pdf24的命令行默认参数没有启用新的模型还是什么原因，感觉best版本也就似乎好上一点点，但区别不大，所以推荐直接下载fast模型文件就可以了。

tesseract windows版本的下载地在 [这里](https://github.com/UB-Mannheim/tesseract/wiki) 。读者现在只需要在 [这里](https://github.com/tesseract-ocr/tessdata) 下载对应的语言模型文件即可。

现在pdf24就可以进行文字识别处理了，识别的txt内容可以另外保存下来，然后文字嵌入的pdf版本也可以保存下来。

大概简单的比较了一下，和市面上的识别效果会略微逊色一点，但够用就行了，市面上的也不是百分之百的准确。





