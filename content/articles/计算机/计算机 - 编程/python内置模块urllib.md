Slug: python-builtin-module-urllib
Date: 20241012


[TOC]



### urllib的request子模块

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
