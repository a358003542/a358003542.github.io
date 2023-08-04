Slug: selenium-module
Tags:  python, crawler
Status: draft
[TOC]

## 简介

selenium有很多用途，可用于针对浏览器端页面的自动化测试，或者用于网络爬虫。就作为网络爬虫的那部分是越来越得到我的青睐了，传统的网络爬虫笨重而粗暴，给服务器那边造成了不少的压力，而爬虫这边也经常因为被封而停止工作，况且在现在这个信息爆炸的互联网时代，我们的目的必然不是尽可能多地获取信息，那是容易的但也是没多少价值的，而是更智能地定向地获取到目标有价值的信息。selenium因为是采取的模拟浏览器动作的风格，然后我们在编写脚本的时候只要再稍微限制下速度，那么基本上我们的脚本的行为对于外面服务器来说和人正常浏览页面是没有区别的，那么被封的可能性是大大降低了，只可能有某些情况即使是人正常打开网页也会弹出某些验证码等页面，通常服务器那边也应该尽量避免正常打开网页出现这种情况的，这对用户体验很不好。同时selenium因为是模拟浏览器的行为，也提供了更多的智能化爬虫的潜在可能性，加上编程的最终智能目的就是要将人的智能行为转移到机器上的智能行为上来，从这个意义来上说，selenium模拟网络爬虫的编写更有深层次含义和乐趣在里面。

## 基本的安装的使用

以chrome为例，你需要看下你当前安装的chrome浏览器的版本号，然后下载对应的chromedriver.exe，具体到不用设置系统变量PATH之类的，只需要如下设置用 `executable_path` 参数指向目标exe文件即可：

```python
driver = webdriver.Chrome(executable_path="chromedriver", options=options)
```

如上所示，通常你需要配置一些浏览器参数来定制浏览器，具体更多的参数参见chrome driver的 [官方文档](https://sites.google.com/a/chromium.org/chromedriver) 。

```python
from selenium.webdriver.chrome.options import Options

options = Options()
options.add_argument(f"--user-agent={user_agent}")
options.add_argument("--start-maximized")
```



## 浏览器参数配置

### 配置useragent

```python
options.add_argument(f"--user-agent={user_agent}")
```

你可以执行下面代码来实际查看下useragent：

```python
agent = driver.execute_script("return navigator.userAgent")
print(agent)
```

### 浏览器开始窗口最大化

```python
options.add_argument("--start-maximized")
```



### 开启移动端模拟

```python
mobile_emulation = {"deviceName": "iPhone X"}
options.add_experimental_option("mobileEmulation", mobile_emulation)
```

### 配置缓存路径

```python
options.add_argument('--disk-cache-dir=d:/cache')
```

### 配置缓存最大大小

单位是字节，这个数值必须是int型，最多只能到2G。

```python
options.add_argument('--disk-cache-size=2073741824')
```

### 开启无头浏览器

也就是不显示浏览器了，会在后台运行。

```python
options.add_argument("--headless")
```



## 获取网页源码

```
page_source = driver.page_source
```



## 定位目标元素

这一块官方文档说的很详细了。xpath则需要读者另外去了解。

## 执行js代码

执行js代码是selenium很核心的一个功能，很多编码目的实现都可以通过执行js代码来做到。

### scroll到显示目标元素

```python
driver.execute_script("arguments[0].scrollIntoView(true);",
                                  elem_target)
```

### 点击目标元素

```python
driver.execute_script("arguments[0].click();", elem_target)
```



## wait

官方文档这块说的比较详细，如下的暗含等待并不是说要浏览器一定要等这么久，而是说要等这么久到页面元素基本上加载完，如果加载完则不会等了。

```python
driver.implicitly_wait(10)
```



