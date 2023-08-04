Slug: requests-module
Tags: python
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

## 附录

### urllib.request内置模块

urllib.request模块我们可以在这里稍微了解一下，其是python官方对于这一块的支持实现，可以作为参考来了解requests模块为何相比较官方模块更好用一点。

#### urlopen函数

urlopen函数在urllib模块的request子模块，其提供了简单的获取目标url网页内容的接口。一个简单的例子如下所示：

```python
from urllib.request import urlopen
import socket
socket.setdefaulttimeout(10)

urls = ['https://www.google.com.cn','https://www.google.com',
    'http://www.google.com.cn']

for url in urls:
    try:
        response = urlopen(url)
        html = response.read().decode('utf-8')
        print(html)
    except socket.timeout as error:
        print(error)
    except OSError as error:
        print(error)
```

为什么刚开始就用这么一个稍显复杂的例子作为演示，well，天朝网络的特色。如果你用百度的url `http://www.baidu.com` ，可能大部分情况下你都不用操心这些问题，但既然我们处在天朝网络这个大背景下，还是早点介绍这个。这个例子的返回的error种类似乎间接地反映了GFW的工作原理。

比如google的.com.cn的https连接还能正常工作（目前暂时。。），只是有时会有点慢，然后其http连接则会返回404错误，这是天朝网络常见的网络错误了，大家的分析是GFW进行了dns投毒。而对于google的.com连接不管是http或者https连接都会返回OSError错误，说的是：Network is unreachable，这表明GFW对于后缀google.com的url采取的完全硬件级别的网络掐断。

然后urlopen函数第一个参数是url连接这不用多说，其还有很多可选项，其中很重要的参数就是 **timeout** 参数，这个和socket套接字的工作模式相关。如果不加上这个timeout参数，对于某些被墙的网站就会一直尝试然后程序陷入卡死状态了。在后面会介绍 **urlretrieve** 函数，也在这个urllib.request模块下面，这个函数可以用于网络下载东西，其并没有内置的timeout参数，不过可以通过设置全局网络socket的timeout（前面socket模块的setdefaulttimeout函数），这个全局timeout最好设置得稍微大一点。

这里的套接字socket的timeout参数就是控制阻塞时间的，因为有些网络数据不可能一次就传递完，好比下载过程一样的有个时间，而这个timeout就是控制这个下载时间的，如果超过这个时间了那么直接返回错误。这里有个问题，就是这个程序默认全局socket的timeout都设置为10秒，那么会不会以后用urlretrieve函数下载某个东西，本身就要求超过10秒？参看requests文档的 [这里](http://cn.python-requests.org/zh_CN/latest/user/quickstart.html#id10) ，其对timeout有很好的解释，他说timeout仅对连接过程有效，与响应体的下载无关。

因为网络上的情况比较复杂，关于网络的这些异常处理是不可回避的话题。上面虽然只是一个简单读取网页的程序也跟上了这么多异常捕捉，不是为了偏执的追求程序的健壮，而是必要的必须做的工作。

##### 返回的是什么

urlopen函数返回的是urllib.response模块的Response对象，其提供了一些简单的文件风格的操作接口，比如 `read()` 方法， `readline()` 方法，需要记住的是read之后返回的是 **bytes流** 。

这个Response对象还有 `geturl()` 方法，其返回具体的url字符串，还有 `info()` 方法，其返回一个字典值，里面有一些关于网页的基本信息。这个请读者自己试验一下。

##### HTTPError和URLError异常

```
from urllib.error import HTTPError
```

HTTPError是URLError的子类，URLError是OSError的子类，而OSError是不要加载模块就可以直接引用的，所以简单的处理就用OSError来捕捉。

##### ContentTooShortError异常

```
from urllib.error import ContentTooShortError
```

当 **urlretrieve** 函数下载的数据量少于预期的数据量时返回这个错误。

#### 访问网页得到401 error

这里以路由器为例 `192.168.1.1` 或者 `192.168.0.1` 等，上面的小脚本我们稍作修改有：

```python
from urllib.request import urlopen
from urllib.error import HTTPError

import socket
socket.setdefaulttimeout(10)


url = 'http://192.168.1.1'


try:
    response = urlopen(url)
    html = response.read().decode('utf-8')
    print(html)
except socket.timeout as error:
    print(url, error)
except HTTPError as error:
    if error.code == 401:
        print(url,' need password, the 401 error')
    else:
        print(url,error)
except OSError as error:
    print(url, error)
```

运行会返回：

```
http://192.168.1.1  need password, the 401 error
```

返回了401异常，那么这个网页需要经过网页认证才能访问。下面是一个简单的小脚本附带网页认证功能：

```python
from urllib.request import build_opener, HTTPBasicAuthHandler, urlopen
import urllib
from urllib.error import HTTPError
import getpass
import socket
socket.setdefaulttimeout(10)


url = 'http://192.168.1.1'

while True:
    username = input("Username:").rstrip()
    password = getpass.getpass().rstrip()
    print('try...',username,password)

    auth_handler = HTTPBasicAuthHandler()
    auth_handler.add_password(realm = '',uri = '',user=username,passwd = password)

    try:
        opener = build_opener(auth_handler)
        urllib.request.install_opener(opener)
        ###install it gloably so urlopen can use it
        response = urlopen(url)
        print('I found it', username, password)
        break
    except socket.timeout as error:
        print(url, error)
    except HTTPError as error:
        if error.code == 401:
            print(url,' need password, the 401 error')
        else:
            print(url,error)
    except OSError as error:
        print(url, error)
```

这里的getpass内置模块的getpass函数提供了终端输入密码不显示的功能。然后我们看到 `build_opener()` 这个函数，其可以接受一系列的handler，根据 `HTTPBasicAuthHandler` 创建了一个handler实例，其通过 `add_password` 方法来加入用户名和密码属性，其中realm和uri我还不清楚。似乎通过你要认证的网页head可以看到。

然后调用urllib子模块request的 `install_opener` 函数，其将全局性的安装这个openr，后面的urlopen函数就会使用这个opener了。如果不这样做，则需要使用opener.open单独打开一个response，这并不推荐。

#### 加上代理功能来翻墙

现在我们修改最初的那个第一个例子，加入代理功能，从理论上这样写似乎应该可以了，但是并没有效果，GFW还是很强大地。。

```python
from urllib.request import urlopen, build_opener
import urllib
import socket
socket.setdefaulttimeout(10)

urls = ['https://www.google.com.cn','https://www.google.com',
    'http://www.google.com.cn']

proxy_handler = urllib.request.ProxyHandler({'http':'http://127.0.0.1:8580/'})
opener = urllib.request.build_opener(proxy_handler)
urllib.request.install_opener(opener)

for url in urls:
    try:
        response = urlopen(url)
        html = response.read().decode('utf-8')
        print(html)
    except socket.timeout as error:
        print(error)
    except OSError as error:
        print(error)
```

#### 通过修改url来GET数据

下面开始对接各个搜索引擎。

```python
from urllib.request import urlopen
import urllib
import socket
socket.setdefaulttimeout(10)

#search_engine = 'http://www.baidu.com/'
#search_engine = 'http://www.zhihu.com/'

search_engine = 'http://stackoverflow.com/'

def addGETdata(url, string):
    p = urllib.parse.urlparse(url)
    if p.netloc == 'www.baidu.com':
        return url + 's?' + urllib.parse.urlencode({'wd':string})
    elif p.netloc in ['www.zhihu.com','stackoverflow.com']:
        return  url + 'search?' + urllib.parse.urlencode({'q':string})

url = addGETdata(search_engine, 'python urllib')

print(url)

pyout = open('test.html','w')
try:
    response = urlopen(url)
    html = response.read().decode('utf-8')
    print(html,file=pyout)
except socket.timeout as error:
    print(error)
except OSError as error:
    print(error)
```

这里主要要讲的是addGETdata这个函数，其修改url为目标形式，然后后面都是一样的，这个要根据具体目标搜索引擎网站来了。

#### 通过POST方法来获取数据

这个不太灵活，我们看到前面baidu和zhihu两个并不相同，而如果采用POST方法，默认是加入的中缀search?，这有时不太适合，其次采用POST方法需要给自己伪装头部，否则有些网站会禁止你。这个方法略过了。就直接通过修改url来GET已经很简单了。



### 关于HTTP的补充理论知识

HTTP协议就支持四种方法：

- **GET:** 从web service 那里提取信息
- **POST:** 往web service 那里发送信息
- **PUT:** 在web service 那里更新信息
- **DELETE:** 在web service 那里删除信息

#### GET和POST的区别

参考了 [这个网页](http://blog.csdn.net/gideal_wang/article/details/4316691) 。前面谈及的修改网页的url来获取资源，实质就是HTTP的GET方法，也就是GET方法的信息就放在url上的，然后web service服务器会分析这些url，从而相应的决定对客户机的回应方式。而POST方法并不修改url，web service服务器接受的url上并没有任何额外的信息，具体POST方法具体会另外传输一个信息包。一般能够通过GET方法和服务器互动的就采用GET方法，但因为url的局限性，可能某些GET方法并不适用，这是就需要服务器支持对应的POST方法来互动了。至于PUT还有DELETE方法就更加少用了，有些服务器甚至根本就不支持这些冷门的方法。

#### HTTP返回错误码含义

```
100: ('Continue', 'Request received, please continue'),
    101: ('Switching Protocols',
          'Switching to new protocol; obey Upgrade header'),

    200: ('OK', 'Request fulfilled, document follows'),
    201: ('Created', 'Document created, URL follows'),
    202: ('Accepted',
          'Request accepted, processing continues off-line'),
    203: ('Non-Authoritative Information', 'Request fulfilled from cache'),
    204: ('No Content', 'Request fulfilled, nothing follows'),
    205: ('Reset Content', 'Clear input form for further input.'),
    206: ('Partial Content', 'Partial content follows.'),

    300: ('Multiple Choices',
          'Object has several resources -- see URI list'),
    301: ('Moved Permanently', 'Object moved permanently -- see URI list'),
    302: ('Found', 'Object moved temporarily -- see URI list'),
    303: ('See Other', 'Object moved -- see Method and URL list'),
    304: ('Not Modified',
          'Document has not changed since given time'),
    305: ('Use Proxy',
          'You must use proxy specified in Location to access this '
          'resource.'),
    307: ('Temporary Redirect',
          'Object moved temporarily -- see URI list'),

    400: ('Bad Request',
          'Bad request syntax or unsupported method'),
    401: ('Unauthorized',
          'No permission -- see authorization schemes'),
    402: ('Payment Required',
          'No payment -- see charging schemes'),
    403: ('Forbidden',
          'Request forbidden -- authorization will not help'),
    404: ('Not Found', 'Nothing matches the given URI'),
    405: ('Method Not Allowed',
          'Specified method is invalid for this server.'),
    406: ('Not Acceptable', 'URI not available in preferred format.'),
    407: ('Proxy Authentication Required', 'You must authenticate with '
          'this proxy before proceeding.'),
    408: ('Request Timeout', 'Request timed out; try again later.'),
    409: ('Conflict', 'Request conflict.'),
    410: ('Gone',
          'URI no longer exists and has been permanently removed.'),
    411: ('Length Required', 'Client must specify Content-Length.'),
    412: ('Precondition Failed', 'Precondition in headers is false.'),
    413: ('Request Entity Too Large', 'Entity is too large.'),
    414: ('Request-URI Too Long', 'URI is too long.'),
    415: ('Unsupported Media Type', 'Entity body in unsupported format.'),
    416: ('Requested Range Not Satisfiable',
          'Cannot satisfy request range.'),
    417: ('Expectation Failed',
          'Expect condition could not be satisfied.'),

    500: ('Internal Server Error', 'Server got itself in trouble'),
    501: ('Not Implemented',
          'Server does not support this operation'),
    502: ('Bad Gateway', 'Invalid responses from another server/proxy.'),
    503: ('Service Unavailable',
          'The server cannot process the request due to a high load'),
    504: ('Gateway Timeout',
          'The gateway server did not receive a timely response'),
    505: ('HTTP Version Not Supported', 'Cannot fulfill request.'),
```

### 参考资料

1. Foundations of Python Network Programming ，python网络编程基础，[美] John Goerzen 著，莫迟等译 。
2. 计算机网络 [美] 特南鲍姆
3. [diveintopython3 web services 一章](http://www.diveintopython3.net/http-web-services.html) 这是 [中文网页](http://sebug.net/paper/books/dive-into-python3/http-web-services.html) 。



