Date: 20230309


[TOC]


## 当前目录启动powershell

现在的win10 按下shift键，然后点下鼠标右键，出来的菜单里面有个打开powershell功能就是当前目录启动powershell。

## 设置powershell启动的默认大小

右键点击powershell最上面的一栏，会看到默认值那个选项，设置布局的窗口大小即可，我这边宽度高度是100-40，感觉还行。

## 安全策略管理

powershell脚本的后缀是 `ps1` 。直接运行powershell脚本一般会提示有权限错误，更多信息请参看 [这个网页](https://docs.microsoft.com/zh-cn/powershell/module/microsoft.powershell.core/about/about_execution_policies?view=powershell-7.2) 。



## 启动一个进程

```powershell
Start-Process -FilePath "ping.exe" -Args "www.baidu.com"
```

然后进程的输出可以如下进行重定向：

```powershell
Start-Process -FilePath "ping.exe" -Args "www.baidu.com" -RedirectStandardOutput '.\console.out' -RedirectStandardError '.\console.err'
```



## 获取当前工作目录

下面的例子也同时讲解了基本的关于powershell里面如何定义变量和字符串中如何使用变量等知识。

```powershell
$curpath=$(Convert-Path .)
echo $curpath
cd "$curpath\logs"
echo $(Convert-Path .)
cd $curpath
```

熟悉脚本的看到这个例子，基本上所谓的子命令调用返回，或者字符串中变量的替换，或引用变量等都一看就清楚了。



