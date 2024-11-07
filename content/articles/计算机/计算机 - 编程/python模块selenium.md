Slug: python-module-selenium
Date: 20241106
Modified: 20241107

[TOC]


## selenium
本文主要关注利用selenium来实现自动化爬虫任务, selenium还有很多其他用途, 比如关于网页前端展示的自动化测试等. 更多内容请参看 [官方文档](https://www.selenium.dev/zh-cn/documentation/).

selenium来做爬虫最大的好处是基本上等同于和人一样正常浏览网页, 只要略微注意下是基本上不会被封的, 否则该网站也会把正常用户也封禁了. 当然selenium因为加载东西很多开销还是很大的, 如果利用requests编写的传统爬虫是可行的, 那么还是优先选择传统方式.

用pip安装如下:

```
pip install selenium
```



## 打开一个url
```
driver = webdriver.Chrome()

driver.get("https://www.selenium.dev/selenium/web/web-form.html")

```

## 等待一会
初次打开一个页面最好先等待一会儿.
```python
driver.implicitly_wait(1)
```


## 获取网页源码

```
page_source = driver.page_source
```


## 退出driver
```
driver.quit()
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





