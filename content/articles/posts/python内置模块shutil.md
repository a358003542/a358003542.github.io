Slug: python-builtin-module-shutil
Date: 20231019

[TOC]

## shutil模块


相当于os模块的补充，shutil模块进一步提供了一些系统级别的文件或文件夹的复制，删除，移动等等操作。

### 复制文件

    shutil.copyfile(src, dst)
    shutil.copy(src, dst)
    shutil.copy2(src, dst)

其中**copyfile**的src和dst两个参量都是完整文件路径名，第一个参量是待复制的文件，第二个参量是复制后的文件名；而**copy**函数的第一个参量是待复制的文件，但是第二个参量是目标文件夹路径；**copy2**函数和copy函数类似，不同的是它能尝试保留文件的所有元信息metadata（模块开头有说明是理论上但不尽然）。

### 复制文件夹

    shutil.copytree(src, dst)

**copytree**函数第一个参量是待复制的文件夹路径名，第二个参量是目标文件夹路径名，其将被创建不应该存在。

### 删除整个目录

    shutil.rmtree(path)

**rmtree**函数用于删除整个文件夹，path就是目标文件夹的路径名。

### 移动文件夹

    shutil.move(src,dst)

**move**函数把一个文件或者一个文件夹移动到一个文件夹内。

### chown函数

    shutil.chown(path, user=None, group=None)

**chown**函数类似的linux系统下的chown函数，这个函数基于os.chown函数，不过接口更友好。

### which函数

    shutil.which(cmd)

**which**函数类似的linux系统下的which函数。

更多shutil模块内容请参见[官方文档](https://docs.python.org/3.4/library/shutil.html)。