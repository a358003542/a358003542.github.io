Slug: xecjkhong-bao-zhong-de-mou-xie-te-shu-zi-fu-xian-shi
Date: 20200830

在排版pdf的时候希望显示周易六十四卦䷀等这些字符，大概找了好久才发现DejaVu Sans字体里面有周易六十四卦的这些字符，本来打算直接用常规的调字体的方式来显示这个字符，却发现并没有效果，估计可能是这个区块的字符被划分到CJK字符那边了，然后归xeCJK这个宏包处理了

用xeCJK提供的 `\CJKfontspec` 命令确实可以起到效果，但是考虑到六十四个卦六十四的字符，不管是单独写命令还是分别用newunicodechar封装等都不是很好的解决方案，况且newunicodechar和xeCJK宏包之间也似乎有协调问题。

在仔细阅读xeCJK宏包文档之后确认下面的解决方案就是最好的：

首先通过xeCJK宏包提供的 `xeCJKDeclareSubCJKBlock` 来定义一个字符区块：

```latex
\xeCJKDeclareSubCJKBlock{LIUSHISIGUA}{ "4DC0 -> "4DFF}
```

然后你在设置CJK主要字体的时候可以单独指定这一个字符区块里面的字符归哪个字体处理：

```latex
\setCJKmainfont[LIUSHISIGUA=DejaVu Sans]{Source Han Serif CN}
```

这样你在tex文档里面正常复制粘贴䷀这样的字符就能够正常显示了。