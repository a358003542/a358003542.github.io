Slug: python-module-requests
Date: 20191018

[TOC]



## requests模块

具体网络编程推荐使用requests模块，这是requests的 [官网](http://docs.python-requests.org/en/latest/) ，这是中文文档的 [链接](http://cn.python-requests.org/zh_CN/latest/) 。更多信息请参看官方文档。

### 安装

安装推荐使用pip或者pip3命令简便安装之。

### HTTP基本协议支持

下面这几个函数一看名字就知道对应的是HTTP的GET，POST，PUT和DELETE方法，然后HTTP的冷门方法HEAD和OPTIONS requests模块有类似的head函数和options函数。

#### get函数

这是之前第一个例子的改写：

```python
import requests

urls = ['https://www.google.com.cn','https://www.google.com',
    'http://www.google.com.cn']

for url in urls:
    try:
        response = requests.get(url, timeout = 10)
        html = response.text
        print(html)
    except requests.exceptions.Timeout as error:
        print(url, error)
    except requests.exceptions.RequestException as error:
        print(url, error)
```

这里使用get函数对应HTTP的GET方法来获取网页的内容，然后注意现在 <span class="underline">不能通过socket全局设置timeout了</span> ，而需要设置一个timeout参数。提取文本内容简单的调用text属性即可，后面是一些错误捕捉，这里就不赘述了。

##### params参数

params参数就是给url加入一些关键词和值等，带点前面提及的urlencode函数的功能，但整个语句更加简洁方便了。下面通过类似前面的例子来演示之：

```python
import requests
import urllib###use the urlparse

search_engines = (
    'http://www.baidu.com/s',
    'http://www.zhihu.com/search',
    'http://stackoverflow.com/search',
    'http://www.ask.com/web',
    'http://search.yahoo.com/search',
    'http://cn.bing.com/search',
    'https://www.google.com/#',
    'https://zh.wikipedia.org/w/index.php',
    'https://en.wikipedia.org/wiki/',
    )

def addGETparams(url, search_string):
    p = urllib.parse.urlparse(url)
    if p.netloc == 'www.baidu.com':
        return {'wd':search_string}
    elif p.netloc in ['www.zhihu.com','stackoverflow.com','cn.bing.com',
        'www.ask.com','www.google.com']:
        return  {'q':search_string}
    elif p.netloc in ['search.yahoo.com']:
        return {'p':search_string}
    elif p.netloc in ['zh.wikipedia.org','en.wikipedia.org']:
        return {'search':search_string}

search_engine = search_engines[2]
params = addGETparams(search_engine, 'python')

pyout = open('test.html','w')
try:
    response = requests.get(search_engine, timeout = 10, params = params)
    print(response.url)
    html = response.text
    print(html, file = pyout)
except requests.exceptions.Timeout as error:
    print(url, error)
except requests.exceptions.RequestException as error:
    print(url, error)

pyout.close()
```

其中search\_engin的原始url做了一些修改，使得语法更加的简洁了。

#### post函数

和get函数一样如下使用：

```
response = requests.put("http://httpbin.org/put")
```

##### data参数

data参数，就是POST方法实际传输过去的数据，可以是字符串，字典值，或者json数据（需要用json模块的dumps函数处理之）。

```
>>> payload = {'key1': 'value1', 'key2': 'value2'}
>>> r = requests.post("http://httpbin.org/post", data=payload)
```

##### headers属性

接受一个字典值，用于定制POST方法的HTTP请求头。



### 返回的reponse响应对象

上面这些函数返回的reponse对象

#### url属性

返回响应具体的url

#### text属性

返回响应的文本内容

#### encoding属性

返回响应的encoding。

#### content属性

返回的是响应的二进制形式。我们可以利用这个属性来下载文件。下面这个 `download_file` 函数参考了 [这个网页](http://stackoverflow.com/questions/16694907/how-to-download-large-file-in-python-with-requests-py) 。

注意这里用了 `stream = True` 参数设置，然后

```python
def download_file(url,filefold='download'):
    '''简单的根据url下载文件函数，filefold为下载文件存放的下一级文件夹名'''
    try:
        os.mkdir(filefold)
    except FileExistsError:
        pass

    filename = './' + filefold +'/' + url.split('/')[-1]
    # NOTE the stream=True parameter
    response = requests.get(url, stream=True)
    with open(filename, 'wb') as f:
        for chunk in response.iter_content(chunk_size=1024):
            if chunk: # filter out keep-alive new chunks
                f.write(chunk)
                f.flush()
    return filename
```

#### json方法

如果响应是json文件，那么调用这个方法就自动将json文件解码了（相当于json模块的loads）。

#### status\_code属性

具体响应的状态码，如404之类的。

#### headers方法

服务器响应的HTTP头信息。

#### allow\_redirects

GET OPTIONS POST PUT PATCH DELETE 这些方法重定向默认打开 True
然后HEAD方法默认重定向关闭。

#### timeout参数

timeout参数控制，如果超时则将抛出 `requests.exceptions.Timeout` 异常。

### 异常

下面这些异常了解下：

遇到网络问题（如：DNS查询失败、拒绝连接等）时，Requests会抛出一个 ConnectionError 异常。

遇到罕见的无效HTTP响应时，Requests则会抛出一个 HTTPError 异常。

若请求超时，则抛出一个 Timeout 异常。

若请求超过了设定的最大重定向次数，则会抛出一个 TooManyRedirects 异常。

所有Requests显式抛出的异常都继承自 requests.exceptions.RequestException 。



### 会话

会话对象可以跨多个requests请求对象保持相同的某些参数设置，比如cookies等。

Session对象有requests API的所有方法，即get，post之类。会话对象之前设置的那些参数都会保留在那里，后面调用的get方法还可以加上额外的一些参数设置，如下所示:

```
s = requests.Session()
s.auth = ('user', 'pass')
s.headers.update({'x-test': 'true'})

# both 'x-test' and 'x-test2' are sent
s.get('http://httpbin.org/headers', headers={'x-test2': 'true'})
```

#### SSL验证

加上 `verify=True` 即要求对目标主机进行SSL验证。

### 响应体的content

对于响应体含有content却内容较多的情况，可以通过 `Stream=True` 来让推迟content下载，而只获取header信息。后面遇到 `response.content` 才实际下载content。

然后还有 `Response.iter_content` 和 `Response.iter_lines` 方法来控制工作流，或者以 `Response.raw` 通过底层urllib3来读取响应对象。

#### response.iter\_content

```
iter_content(chunk_size=1, decode_unicode=False)
```

迭代读取响应体的content内容，设置一次读取多少 `chunk_size` 。

#### response.iter\_lines

```
iter_lines(chunk_size=512, decode_unicode=None)
```

迭代读取响应体的content内容，一次读一行。行的内容应该小于chunk\_size，一般不设置即可。

### 身份验证

```
>>> from requests.auth import HTTPBasicAuth
>>> requests.get('https://api.github.com/user', auth=HTTPBasicAuth('user', 'pass'))
<Response [200]>
>>> requests.get('https://api.github.com/user', auth=('user', 'pass'))
<Response [200]>
```

### 代理

```
import requests
```

```
proxies = {
  "http": "http://10.10.1.10:3128",
  "https": "http://10.10.1.10:1080",
}

requests.get("http://example.org", proxies=proxies)
```
