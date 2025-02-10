Slug: python-builtin-module-urllib
Date: 20241012
Modified: 20250201


[TOC]



## urllib的parse子模块
urllib的parse子模块提供了对URL的解析支持，还是很有用的，下面简要介绍之，更多信息请参见 [官方文档](https://docs.python.org/zh-cn/3/library/urllib.parse.html) 。




### urlsplit
URL结构如下： `scheme://netloc/path;parameters?query#fragment` ，一般URL上没有path的那个parameters参数，所以一般会推荐使用urlsplit来分拆URL，否则需要使用urlparse函数。

```
urllib.parse.urlsplit(urlstring, scheme='', allow_fragments=True)
```

urlsplit的返回结果，一般推荐用 `p.scheme` , `p.netloc` , `p.path` , `p.query` , `p.fragment` 来访问。


### urljoin
```
urllib.parse.urljoin(base, url, allow_fragments=True)
```
根据base里面的URL信息来填充第二个url，从而得到一个绝对URL。


### urlencode
```
urllib.parse.urlencode(query, doseq=False, safe='', encoding=None, errors=None, quote_via=quote_plus)
```

作用就是拼凑出URL上的查询参数字符串，看一下下面例子就明白了：

```
import urllib.parse
params = urllib.parse.urlencode({'spam': 1, 'eggs': 2, 'bacon': 0})
print(f"http://www.musi-cal.com/cgi-bin/query?{params}")
```

输出结果是：
```
http://www.musi-cal.com/cgi-bin/query?spam=1&eggs=2&bacon=0
```



## urllib的request子模块
urllib的requests子模块提供了一些基本的请求网络资源URL的支持，一般推荐使用requests模块，下面简要介绍下本子模块，更多信息请参见 [官方文档](https://docs.python.org/zh-cn/3/library/urllib.request.html) 。


### urlopen函数
urlopen函数请求一个URL，一个简单的例子如下所示：

```python
import urllib.request
with urllib.request.urlopen('http://www.python.org/') as f:
    print(f.read(300))
```





