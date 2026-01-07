Slug: python-module-requests
Date: 20191018
Modified: 20250201


[TOC]



## requests模块
更多信息请参看 [官方文档](https://requests.readthedocs.io/projects/cn/zh-cn/latest/) 。



## get请求
```
requests.get('https://api.github.com/events')
```

get请求上URL上的参数通过params参数传递进去：

```
payload = {'key1': 'value1', 'key2': 'value2'}
>>> r = requests.get("http://httpbin.org/get", params=payload)
```

可以看到URL上的参数已经正确编码进去了。
```
>>> print(r.url)
http://httpbin.org/get?key2=value2&key1=value1
```


## post请求
```
requests.post('http://httpbin.org/post', data = {'key':'value'})
```

注意上面的data参数，就是POST方法实际传输过去的数据。




## 会话
会话对象可以跨多个requests请求对象保持相同的某些参数设置，比如cookies等。

```
s = requests.Session()
s.auth = ('user', 'pass')
s.headers.update({'x-test': 'true'})

# both 'x-test' and 'x-test2' are sent
s.get('http://httpbin.org/headers', headers={'x-test2': 'true'})
```




## 代理
```
import requests
proxies = {
  "http": "http://10.10.1.10:3128",
  "https": "http://10.10.1.10:1080",
}

requests.get("http://example.org", proxies=proxies)
```
