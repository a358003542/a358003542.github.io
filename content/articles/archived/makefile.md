Slug: makefile
Date: 20190918

[TOC]

## 简单了解下makefile

makefile一般只能在Linux环境下运行，更确切来说要有gnu make这个工具去运行Makefile这个文件。

makefile里面内容其实很丰富的，实际上甚至有点过于复杂了。不过有的时候只是简单使用其基本功能还是很便利的。

```makefile
project=helloworld
cflags=-g -Wall  ${CCFLAGS}

${project}: 
	${CC}  helloworld.c -o $@ ${cflags}

clean:
	rm ${project}

install:
	cp ${project} /usr/local/bin

uninstall:
	rm /usr/local/bin/${project}

.PHONY:
	clean uninstall install
```

为了便于理解，上面这个makefile我有意采用了一种和bash shell接近的风格。前面 `project=` 就是一个定义变量的行为。这个project变量就是本脚本的名字。然后makefile下面的主体部分格式如下:

```makefile
target: prerequisites
    the command
```

具体意思就是要生成target这个文件，首先要确保prerequisites这些依赖文件都在而且是最新的，不在或者不是最新的那么查找对应的目标生成规则继续生成。而对于这个target的生成就是执行下面的bash命令。下面是关于上面例子的一些讲解信息:



- *特别要强调，命令前面请用 Tab键 隔开*。 
- 关于变量的使用读者看到上面的例子，我有意采用了类似bash脚本的语法。这么写也是支持的。
- `$@` 这个特殊的符号并不是什么神秘东西，其意思就是当前目标的文件名，上面例子中当前目标是 `${target}` ，也就是helloworld，所以这里 `$@` 就是 "helloworld" 。
- `.PHONY` 这后面跟着一些生成目标，具体意思就是这些生成目标是伪目标，或者说其并没有生成文件，只是执行了某个命令。
- 我们注意到上面的`${CC}` 和 `${CCFLAGS}`  并没有为用户定义，其是make命令的一些默认变量。 `$(CC)` 就是调用系统默认的c编译器，一般为gcc。
- `make` 命令不输入任何子命令时，默认执行输出第一个目标命令，一般是本项目目标。
- makefile的每个命令都有一个独立的终端，也就是不同的终端不共享变量，所以最好多个命令连接成为一个命令，这样好在一个shell里面执行和共享变量。（export是可以共享的？）
- makefile扫描两边，第一遍变量替换，第二遍依赖关系。变量声明最好跟着对应的规则，还有要保证不能被后面的变量声明改变。



## 强制某个目标更新

参考了 [这个网页](http://stackoverflow.com/questions/7643838/how-to-force-make-to-always-rebuild-a-file) 。

大致如下面所示，设置一个 FORCE 目标，凡是依赖FORCE目标的都将强制没一次都再更新一遍，而原因就是因为这个FORCE目标不不依赖任何目标，这样makefile认为目标不存在，而每次都会再更新生成一遍。

```makefile
${project}.org: FORCE
	python3 make_${project}org.py
FORCE:	
```



