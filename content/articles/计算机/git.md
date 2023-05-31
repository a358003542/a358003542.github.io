Slug: git
Tags: git
Date: 20191018

[TOC]

## 前言
虽然git这个强大的工具刚开始是用于代码的版本控制的，但谁能想到不过是一个简单的线上Git服务商起步的Github发展到今天这个地步呢，Github能够取得今天的成就有很大一部分是因为Git这个强大的工具能力不光局限在代码的版本控制，文档的或者任意文本的版本控制它都是胜任的。

## git基础

下面就git命令使用的基本流程说明如下：

-   远程仓库文件到本地 网上创建项目之后，你需要将网上的存档下载到本地，在你希望下载的地点，打开终端：

```bash
git clone https://github.com/a358003542/xelatex-guide-book.git
```

-   初始化本地仓库 `git init` 命令用于初始化本地仓库， `git clone` 下来的仓库文件已经初始化了，然后 `origin` 这个远程服务器名字也已经加上去了。
-   本地仓库进入索引 你可以先用 `git status` 命令查看一下当前仓库的改动情况，如果某个文件你不想改动，可以用 `git checkout what` 来放弃这个更改，如果某项改动你想提交上去，则用 `git add what` 把目标文件加入索引。这个add命令也可以跟上某个文件夹名，则该文件夹下所有的文件都将被跟踪。然后你本地删除了某个文件，如果你希望仓库也删除这个文件，那么可以加上 `--all` 选项：

```bash
git add --all which_folder
```

-   将索引改动提交到本地仓库

```bash
git  commit   -m  '2013-08-25:19:00'
```

具体文字信息是对于这次更改的注释，你也可以不加上 `-m` 选项，来直接进入编辑器写上一些信息。

-   本地仓库改动提交到远程仓库

第一次提交你需要给你的远程服务器取个简单点的名字：
```bash
git remote add origin 
     https://github.com/a358003542/xelatex-guide-book.git
```

这里的 origin 是远程服务器的简称，按理来说这个名字是可以随便取的，不过大家似乎都是取得origin，然后你从github上clone下来的仓库默认远程服务器名字大多也是 origin。

然后以后都可以用这个简单的命令来更新了：

```bash
git  push  origin  master
```

现在最新的git版本简单的写作 `git push` 也是可以的。

-   远程仓库的改动更新到本地

下面这个命令git对文件的操作是合并式的，也就是只是替换最新改动的文件。如果你希望远程仓库所有改动包括删除也更新到本地，使用可选项  `-- all` （--all是个方便的处理删除动作的选项，否则你需要对你想要删除的文件使用git rm 命令之后git仓库才会记录这次删除动作，从而本地和远程仓库都跟踪这次删除动作） 。

```bash
git  pull origin master
```

现在最新版本的git 简单写上 `git pull` 就可以了，它内部可以更加智能的判断分支之类的参数了。


一般情况下就 add commit push 这三步。这是基本的日常维护提交流程。如果你在网站上对远程仓库做了一些修改，记得先用pull命令将远程仓库的改动更新到本地。




## 第一次使用的配置

设置你的名字和email：

```bash
git config --global user.name "Your Name"
git config --global user.email "your_email@whatever.com"
```

这个是git的全局设置，和具体项目无关。你可以打开你的家目录下的 `.gitconfig` 文件看一下。

## .gitignore文件

你在github创建项目的时候如果选择好了项目语言，就会自动创建一个 `.gitignore` 文件，文件语法很简单，比如 `*.out` 则项目内所有后缀为out的文件都不会被加入索引。

推荐你到 [gitignore项目](https://github.com/github/gitignore) 那里看一下。



## 初始化仓库

```bash
git init
```

`git init` 即在当前工作目录下初始化git的管理仓库，如果你打开查看隐藏文件，会看到一个 `.git` 文件夹，git用于管理当前项目的一些文件就存放在这里面，你以后可能会用到的就是那个 config 文件。

比如如果你是在github上创建的项目，然后将这个项目克隆下来（已经创建了一个文件了），那么就不需要再执行init命令，远程仓库已经执行了。而且你打开那个config文件会看到remote origin 也已经定义好了。

如果你之前clone的时候使用的http连接，然后你又想使用ssh连接，那么直接在那个config文件下修改即可。



## 删除文件动作的跟踪

如果你本地删除了文件，你希望远程仓库也删除这些文件，那么你可以先看一下 `git status` 看看又那些文件改动了。

然后使用
```bash
git rm 目标文件
```

来跟踪目标文件的删除动作。

如果我们在 `git add` 某个文件夹的时候，加上 `--all` 选项，那么这个文件夹内的文件的删除动作也会自动跟踪的。

## 查看git仓库目前文件改动情况

```bash
git status
```

## 查看git仓库更改记录

```bash
git log
```

使用git log 命令就可以查看本地仓库的更改记录。git log有很多设置，这里有个最简单的例子（参考了githowtu网页）：

```bash
git log --pretty=format:'%h %ad | %s%d [%an]' --graph --date=short
```

你可以创建一个别名来方便后面使用，比如在你的家目录的 `.gitconfig` 文件里面写上：
```bash
[alias]
	hist = log --pretty=format:'%h %ad | %s%d [%an]' --graph --date=short
```



## git命令的别名功能

比如上面提到修改家目录的 `.gitconfig` 文件来获得输入 `git hist` 就很获得git仓库更改记录的好看的打印信息。

你也可以这样

```bash
git config --global alias.hist "log --pretty=format:'%h %ad | %s%d [%an]' --graph --date=short"
```

这个命令实际上还是修改了主文件夹的.gitconfig文件，你可以打开看一下。



## 切换版本

切回到另外一个版本中去：

```bash
git checkout  3fbdf2c
```

具体commit的hash值可用git log查看之，这个命令将会将本地文件夹返回到某个特定的版本状态。

## 取消对文件的修改

```bash
git  checkout  file_or_folder
```
如果你修改了某个文件，还没有add和commit，然后对现在修改不满意，想全部舍弃。那么可以如上使用checkout某个文件或者文件夹来取消修改，从而文件回滚到最后一次commit时未修改的样子。

## 最后一次commit的更改

有的时候你提交一个commit了，然后又发现还有那个地方没有修改，或者commit的附加信息你不满意等等，你可以使用:

```bash
git commit --amend
```

来覆写上一次你的commit记录，amend的意思是改进修正的意思。这里你只能amend你最近的那次commit，然后运行命令之后，等于你上一次所有的commit都被取消掉了，然后你做了一些修改，再重新进行一个commit。


## 取消已经add了的文件
如果你不小心 `add .` 所有的文件，然后有些文件你不想add的，那么可以如下取消add操作。
```bash
git reset HEAD file_or_folder
```



## 分支功能
git的分支功能特别强大，推荐多使用来做到灵活开发。git保存的不是文件差异或者变化量而是一系列的文件快照。git在commit之后，除了相关的提交信息之外，还有一个指向这棵树的指针。而git中的分支本质上仅仅是个指向commit对象的可变指针。当使用 `git branch testing` 来新建一个分支之后，就是在目前这个commit对象上又新建了一个分支指针。然后git还保存了一个名叫 `HEAD` 的特别指针，其指向你正在工作的本地分支。因此运行git branch仅仅是新建了一个分支，系统并不会自动切换到那个分支，要切换到那个分支需要使用 `git checkout testing` 命令。如果master分支和testing分支各自向前commit推一次，然后一个分支样貌就如下图所示出来了:

 ![git分支]({static}/images/linux/git-branch.png)


上图HEAD说明当前正在工作的分支点在那里，master是默认的主分支，然后上图还有一个testing分支。上图是在f30ab那里开了一个testing分支，然后testing分支又commit了一次，然后master分支那边也推了一次，然后本地文件夹当前工作分支是在master那里。

按照 pro git 一书的说法，Git中的分支实际上仅是一个包含所指对象校验和（40 个字符长度 SHA-1 字串）的文件，所以创建和销毁一个分支非常的廉价，而且切换也是非常的快。Git鼓励开发者频繁使用分支。


### 新建分支

如下新建一个git分支：

```bash
git branch the_branch_name
```
​    

额外需要提醒的是新建一个git分支之后，你还需要用checkout命令来切换到那个分支，否则是停留在原来的分支上的。

### 查看分支

`git branch` 可用于查看分支状态。如果加上选项 `-a` 还会显示远程分支的状态。
​    

### 切换分支

```bash
git checkout the_branch_name
```
​    

### 克隆分支

使用git clone某个项目如果你只想克隆某个分支，你可以加上 `-b` 选项来只clone远程仓库的某个分支：

```bash
git clone -b the_branch_name the_project_url
```
​    

### 合并分支

比如说上面的testing分支和master分支你想合并在一起了。那么首先切换到master分支，然后使用git merge合并分支之，如下所示:

```bash
git checkout master
git merge the_branck_name
```

合并策略是没有的新建，有的迭加合并，其中某些文件有冲突的则需要手工处理。

### 删除本地分支

本小节参考了 [这个网页](http://stackoverflow.com/questions/2003505/delete-a-git-branch-both-locally-and-remotely) 。


```bash
git branch -D branch_name
```

### 删除远程分支

```bash
git push origin :branch_name
```

### 分支对分支的推送

```bash
git push origin dev:dev
```

这里的意思是本地有一个dev分支，现在将其推送到远程的dev分支上去。我们看到这和删除远程分支的语法有点类似，除了冒号前面没有指定本地分支。

还有一种很不规范的做法:
```bash
git push origin dev:master
```

这是将本地的dev分支推送到远程master分支上去，不推荐这么做，尽量让本地分支和远程分支名字一样吧，免得自己也弄混了。



## tag功能

我们看到github上有个release栏就是基于git的tag功能 ，可以通过如下命令来推送一个release或者说提交一个tag。如果你需要修改额外的说明信息或者额外附加某个bin或者exe文件，要到github上网页操作。

- 查看tag
```bash
git tag
```
- 添加tag

```bash
git tag tag_name
```
- 将tag推送到远程

```bash
git push --tag
```



## commit几次之后的后悔行为

如果你commit几次了，然后对这几次commit都不太满意，想回滚到之前的某个commit下。可以如下：


```bash
git reset --hard commit_id

## 修改
## 新的commit
git push --force
```

- `--hard` 是强制回滚到那个版本，重设索引，而且你的本地文件修改也会丢失。 `--soft` 是你做的本地修改和索引都不更改，只是说git现在回滚到那个版本了。`--mixed` 是默认的选项，重设索引，本地文件修改都会保留。
- 因为你很有可能之前远程仓库的commit已经推送了，所以这个时候是需要加上 `--force` 选项的。

## 子模块功能

### 为某个git项目添加子模块

一个git仓库里面可能有一些文件夹是另外一个git仓库，我们称该git仓库为子模块，对于这些内容我们应该如下添加子模块来管理：

```bash
git submodule add submodule_url
```

这样将会多出了一个 `.gitmodules` 文件，里面存放着当前项目的子模块的信息。

现在子模块里面还没有内容，你还需要运行：

```bash
git submodule update
```

来获取子模块的内容。

### clone包括子git模块

如果某个项目里面有子git模块，然后简单使用git clone命令里面的内容是不会下载下来的。参考了 [这个网页](http://stackoverflow.com/questions/3796927/how-to-git-clone-including-submodules) 。

如下加上 `--recursive` 选项就会下载项目里面的子git模块。

```bash
git clone --recursive what.git
```

 如果你之前clone某个带有子模块的项目并没有将子模块clone下来，后来你又想clone了，那么可以使用下面的命令：

```bash
git submodule update --init --recursive
```



### 日常子模块操作

其实子模块就是另外一个git项目，你可以进入子模块文件夹，然后进行其他一些常规的git操作。只是因为主项目指向的是某个版本号的子模块，这些操作在主模块上我们不能认为已经生效了。

要主项目指向子模块的最新版本可以如下操作：

```bash
git add --all  submodule_folder

git commit -m "update submodule"
```



## 中文乱码问题

主要参考了 [这个网页](https://segmentfault.com/a/1190000000578037) 。

我的用户家目录下的 `.gitconfig` 文件有这些设置，读者可以参考下：

```
[core]
	quotepath = false
	autocrlf = false
	safecrlf = true
[gui]
	encoding = utf-8
[i18n "commit"]
	encoding = utf-8
[i18n]
	logoutputencoding = utf-8
```

这其中 `autocrlf = false` 是git for windows的一个设置，就是把Linux的换行符变成windows的换行符行为关闭；然后 `safecrlf=true` 设置是什么就是什么，git for windows不做任何更改。

`quotepath` 是把git的路径默认转义行为关闭。

然后下面一些设置为utf8编码的行为。

​    

## 参考资料

1.  [git简明指南](http://rogerdudler.github.io/git-guide/index.zh.html)

2.  [git howto](http://githowto.com/)
3.  [图解git](http://marklodato.github.io/visual-git-guide/index-zh-cn.html)
4.  [git community book中文版](http://gitbook.liuhui998.com/)
5.  [pro git第二版](http://git-scm.com/book/zh/v2)