Slug: github_pages

[TOC]

## Github pages

基本使用就是在你的github上新建一个 `your_name.github.io` 的项目，其内容一般是一个静态网站生成工具输出的内容。



### 自定义域名

简单来说就是写一个 `CNAME` 文件，实际上github的 settings那里还提供了功能，具体实际做的工作也就是创建了一个 `CNAME` 文件。

![github_pages_cname]({static}/images/others/github_pages_cname.png)




### 自定义域名https支持

本小节参考了 [这篇文章](https://hackernoon.com/set-up-ssl-on-github-pages-with-custom-domains-for-free-a576bdf51bc) 。简单来说就是利用 [cloudflare](https://www.cloudflare.com) 提供的服务。其提供的是DNS域名解析服务，然后还做了很多额外的工作，比如缓存啊，统计啊，https支持啊等等。

具体设置它那边说明得很详细，很多就是一键式设置吧，里面有些东西我也不是很清楚，比如 SSL 模式推荐选择 `Flexible` 但是 `Full` 是否也支持github pages就不得而知了，具体设置后好等好几个小时才能生效。

然后 `Automatic HTTPS Rewrites` 和 `Always use HTTPS` 是推荐选上的，然后上面那篇文章提到 `page rules` 需要如下设置下，但是因为前面已经勾选了 `Always use HTTPS` 这个总选项，所以不确定是不是重复设置了。



![github_pages_set_https]({static}/images/others/github_pages_set_https.png)





### 挂上gitbook的内容

**WARNING: 本小节内容可能年久失修过时了。**

```text
把 gitbook build  之后的 _book 里面的内容复制到主目录下，然后如下引用即可：

    /html5-learning-notes

也就是指向文件夹就可以正常工作了。
```

参考了 [这个网页](http://www.chengweiyang.cn/gitbook/github-pages/README.html) 和 `create-react-app` 关于分支的管理建议 ，综合更好的解决方案如下：

1.  `yarn init`  如果读者对yarn npm不太熟悉的话，那么全部都 Enter 吧。

2.  `yarn add gh-pages`

3.  在 `packages.json` 里面加上 （PS: 注意json语法object最后一项不能带逗号）：

```text
    "scripts": {
      "predeploy": "npm run build",
      "deploy": "gh-pages -d _book",
      "build": "gitbook build"
     }
```

4.  然后运行 `gitbook deploy` 好了，现在你的gitbook已经挂载在 `you_name.github.io/project` 那里了。