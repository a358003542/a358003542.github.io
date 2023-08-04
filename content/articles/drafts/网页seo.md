Slug: web-seo
Date: 20190911
Status: draft
[TOC]

## seo简介

SEO是英文（Search Engine Optimization）的缩写，意思是搜索引擎优化。简单来说就是让自己的网站在搜索引擎中排名更高的方法研究。

**外链** 也就是别的网站引用本网站能有效提高本网站排名，在各个搜索引擎算法中现在仍然是一个很重要的指标。

### meta标记

早期搜索引擎是会爬取meta源标记信息，如下所示：

```
<meta name="keywords" content="search engine optimization, SEO, Jennette Banks, 搜索引擎优化, tttwaca"/>
```

不过现在搜索引擎的发展方向是忽略这些指定的关键词，而是自己分析得到关键词。

那么无疑现在seo最最重要的就是内容：

### 积极更新的高质量的内容

**积极更新的高质量的内容** 无疑将是seo的重中之重。而考虑到搜索引擎以后的发展越来越智能化，**更能满足用户需求** 的网页， **用户体验好的网页** 无疑将能够获得更高的排名。所以我在这里做个假想，甚至搜索引擎都能够检测目标网页的评论数，点赞数等等，来给目标网页更高的评分，而目前已知的下面这些因素以后在衡量一篇网页或网站价值上会越来越重要：

### 其他因素

**跳出率**  只访问了入口网页就离开的访问量占总访问量的百分比

**用户访问深度**  用户访问你的网站打开的总页面数（跳出率在衡量网站价值上可能会有失偏颇，比如博客。）

按照 [2017排名因素这篇文章](https://www.seozac.com/google/2017-ranking-factors/) 的介绍，推荐网站做到 https 安全链接。

然后网站的流量和点击率对排名也是有影响的，但主要是对高查询量的关键词。



### 查询本站点收录情况

```
site: you_domain
```



## google seo帮助文档学习

具体参看的 [google的这个帮助文档](https://support.google.com/webmasters/answer/7451184) 。

-   title很重要

-   description 元标记很重要，其不要过短也不要过长和重复多次的说明元标记

    ```html
    <meta content="本指南的适用对象&#10;如果您通过 Google 搜索运营、管理或推广在线内容，或通过在线内容获利，则本指南对您适用。如果您是业务快速发展的商家、拥有 " name="description">
    ```

    >   说明元标记很重要，因为 Google 可能会将其用作您网页的摘要。

上面是google 帮助文档的原话，说的是可能，但该优化还是优化下。

-   em 和 strong 标签会影响google分析你的文档，它将其视为重要的文字，所以这些强调文字最好和本文关键词有很好的关联性。
-   添加结构化的数据标记（TODO）
-   网站结构和导航条优化
-   了解读者所想的并提供给他们
-   链接文字优化，避免点击这里，文章，而应加入描述文字（这个我做的不太好）
-   优化图片的 `alt` 信息
-   推广你的网站（这个google的言下之意应该是网站访问量也是个因素）
-   使用 [google的网站管理员工具 ](https://www.google.com/webmasters/tools)或者 [bing的网站管理员工具](https://www.bing.com/toolbox/webmaster) 。
-   分析网站上的用户行为




## facebook爬虫

当我们在facebook上分享我们的网页的时候，facebook的爬虫就会工作，我们可以根据facebook推荐的 Open Graph Tags来定制具体分享的页面效果：

```html
<meta property="og:type" content="article" />
<meta property="og:title" content="自訂網頁在Facebook, Google+等社群平台的顯示內容" />
<meta property="og:description" content="透過社群分享中繼標籤，我們可以優化顯示在社群網站上的內容，包含標題、縮圖、說明文字、作者…等，還有其他豐富的訊息。這篇文章就要教你如何使用社群分享中繼標籤來自訂顯示在社群網站上的分享訊息。" />
<meta property="og:image" content="http://blog.shihshih.com/social-meta-tag/demo/images/social-sharing.png" />
<meta property="og:url" content="http://blog.shihshih.com/social-meta-tag/" />
```



## twitter爬虫

同样twitter在分享的时候也类似的有所谓的twitter card标准：

```html
<meta name="twitter:card" content="summary" />
<meta name="twitter:site" content="@sullen1209" />
<meta name="twitter:title" content="自訂網頁在Facebook, Google+等社群平台的顯示內容" />
<meta name="twitter:description" content="透過社群分享中繼標籤，我們可以優化顯示在社群網站上的內容，包含標題、縮圖、說明文字、作者…等，還有其他豐富的訊息。這篇文章就要教你如何使用社群分享中繼標籤來自訂顯示在社群網站上的分享訊息。" />
<meta name="twitter:image" content="http://blog.shihshih.com/social-meta-tag/demo/images/social-sharing.png" />
<meta name="twitter:url" content="http://blog.shihshih.com/social-meta-tag/" />
```








## seo术语

-   **PV** page view  页面浏览量
-   **Visit** 访问次数
-   **UV** 独立访客数



## 参考资料

1.  seo教程-极客学院
2.  [social-meta-tag](http://blog.shihshih.com/social-meta-tag/)



