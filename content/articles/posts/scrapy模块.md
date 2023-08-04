Slug: scrapy-module
Date: 20190911

[TOC]

## 简介
Scrapy模块和Django模块在使用上包括在内容目录结构上都很相似，当然这两个项目干的完全是两个不同的事情，我想这种相似性更多的可以描述为类似于大多数GUI界面的那种类似。

我之前尝试过写过一个小的Spider网络爬虫程序，其实网络爬取大体过程都是类似的，因此我学习Scrapy项目大体只是一些基本配置的了解，对于其内部原理已经很熟悉了，所以本文不会在这些地方赘述了。

scrapy就是一个python模块，可以通过 `pip` 安装之，所以安装这块也不多说了。


### 新建一个项目

```
scrapy startproject project_name  [path] 
```

因为我喜欢创建python的venv虚拟环境，所以上面最后path设置为 `.` 当前目录下的意思。

然后接下来就是编写爬虫Spider脚本还有等等其他一些配置了。



## 第一个例子
下面是一个简单的例子：

```python
class MySpider(scrapy.Spider):
    user_agent = get_random_user_agent()
    name = "7yrt"
    start_urls = ['http://7yrt.com/html/rhrt/']

    def parse(self, response):
        url = response.url
        html = response.text
        
        ## do something
        if re.match('http://7yrt.com/html/rhrt/[\d]+/[\d]+/[\d_]+.html', url):
            images = parse_webpage_images(url, html, name='div', class_='imgview')
            title = response.xpath('//h1/text()').extract_first()
            for index,image in enumerate(images):
                yield MyItem(uuid=get_item_uuid(url, str(index)),
                            image_url=[image],
                            name = title)


        ##### get next page
        links = parse_webpage_links(url, html)

        for next_page in links:
            yield scrapy.Request(next_page, callback=self.parse)
```

- `user_agent` 属性改变你爬虫情况的USER_AGENT HTTP头，这通常需要设置一下，防止你的爬虫被ban。

- `name` 你的爬虫的名字，等下你要具体运行某个爬虫的名字是 `scrapy crawl spider_name` ，用的就是这里定义的名字。然后 `scrapy list` 显示的也是这些爬虫名字。

- `start_urls` 你的爬虫起始开爬点，官方教程提到过 `start_requests` 这个方法，一般就定义 `start_urls` 还是很简便的。



### response对象
response对象可以获取 `response.text` 然后送给beautifulsoup来处理，比如上面的 `parse_webpage_images` 和 `parse_webpage_links` 就是这样做的，主要是这两个以前写的函数还是很简便的，所以就没考虑效率问题了，有的时候真的不在乎那么一点，因为后面还会讨论减缓爬虫爬取速度的问题。

然后官方教程提到的response对象可以调用 `css` 或 `xpath` 方法来进行一些信息提取工作，这个简单了解下xpath语法，还是很便捷的。

## 测试抓取

```
scrapy shell  url
```

然后进入shell之后，有个 `response` 对象，其对应于之前写爬虫 parse函数时候的那个response对象。进一步可以做一些前期测试抓取的工作。

## 实际爬取

一般实际爬取某个爬虫使用的是 `scrapy crawl` 命令：

你可以如下通过 `-a` 给你的爬虫传递一些参数进去

```
scrapy crawl spider_51shucheng  -a book_name="xunqinji"
```

参数到了爬虫那边是传递给了 `__init__` 哪里：

```
def __init__(self, book_name='', **kwargs):
```

推荐采用笔者的这种处理方式，实践表明这很优雅灵活，就是通过 `-a` 传递极少的参数，从而确定你的爬虫要寻找的 `.ini` 配置文件所在，然后加载这个配置文件进一步完成从 `start_url` 到后面的爬虫动作的各个参数调配。



## xpath语法

下面主要通过各个例子简要介绍xpath语法之，参考了 [阮一峰的这篇文章](http://www.ruanyifeng.com/blog/2009/07/xpath_path_expressions.html) 和菜鸟教程的xpath教程。

基本东西简单了解下即可，然后多看例子吧。

```
/what   基本路径表达，下个节点
//what  基本路径表达，任意位置的下个节点
```

这里 `/` 表示在下个节点中匹配， `//` 下个或所有子节点匹配。 

```
//div[@id='what']   根据id定位
//div[@id='what']/a[1] 根据id定位后找下面的第一个a标签
//div[@id='what']/a[*] 根据id定位后找下面的所有a标签
```

这里 `*` 表示所有的意思。

```
//div[@name]   找具有name属性的div标签

//div[@name='what'] 找name属性等于what的div标签 

//*[contains(@class,'what')] 找某个标签class属性有 what NOTICE: 这里的意思是有，多个class属性也是可以匹配的 class="what what_what"
//div[@class='what'] 那个目标标签的class属性就是what，也就是匹配的是 class="what"

//*[@id="list"]//dd[*]/a[@href and @title] 找id=list的标签下面的所有dd标签下面的a标签，a标签必须有href和title属性。
```



```
//title[@*]  选择title，随意属性，但title标签必须有属性
```



### 选择title

```
//title
```

这是选择到了文档中任意位置的 title 标签， `/` 开头的话会选择根节点，这不太好用。

### 选择title包含的文本

```
//title/text()
```

### 按照id选择

```
//div[@id='post-date']/text()
```

上面例子的意思是选择一个div标签，其有id属性 `post-date` ，如果div改为 `*` 则为随便什么标签名字。

### 继续往下选

```
//*[@id='js_profile_qrcode']/div/p[1]/span/text()
```

### 选择目标标签的属性

```
////*[@id='js_profile_qrcode']//a/@href
```



### 选择属性

```
//*[@id="list"]//dd[*]/a[@href and @title]/@href  
```

### 选择文本

```
//title/text()
```

### string

对于选择的节点（注意如果返回的是节点集 nodeset将只取第一个），将所有的节点（也就是包括子节点）的文本抽取出来并合并。

```
string(//div[@class="lemma-summary"])
```



## 减缓访问速度
在网络爬取中，防止被ban（一般403错误就是由此而来）一直是个大问题。开代理换IP成本挺高的，不过下面这些手段一般还是能够实现的，这些都在settings.py里面就有了，只需要去注释就是了。大体有下面这些：


```
DOWNLOAD_DELAY = 3
CONCURRENT_REQUESTS_PER_DOMAIN = 16
#CONCURRENT_REQUESTS_PER_IP = 16
# Disable cookies (enabled by default)
COOKIES_ENABLED = False
```
就是设置下载访问停顿时间和并行请求数还有禁用cookies。除了禁用cookies之外，上面这几个设置可以不用，请看到官方文档的 [这里](https://doc.scrapy.org/en/latest/topics/autothrottle.html) 。

这个在 settings.py 文件的后面些也有，这是一种自动节流机制，它是利用下载延迟还有并行数来自动调节DELAY时间，

```
AUTOTHROTTLE_ENABLED = True
# The initial download delay
AUTOTHROTTLE_START_DELAY = 5
# The maximum download delay to be set in case of high latencies
AUTOTHROTTLE_MAX_DELAY = 60
# The average number of requests Scrapy should be sending in parallel to
# each remote server
AUTOTHROTTLE_TARGET_CONCURRENCY = 1.0
```

最后要说的是自动节流和前面的 `DOWNLOAD_DELAY` 和 `CONCURRENT_REQUESTS_PER_DOMAIN` 是协作关系。自动节流最小不会小过 `DOWNLOAD_DELAY` ，最大不会大过 `AUTOTHROTTLE_MAX_DELAY` 。 然后 `AUTOTHROTTLE_TARGET_CONCURRENCY` 也只是一个节流建议，并不是最大极限，对于单个域名的最大并行请求数是由 `CONCURRENT_REQUESTS_PER_DOMAIN` 定义的。

## 控制输出

`scrapy crawl` 命令默认 `-o test.json` 参数你可以省略，然后settings.py 哪里控制你的输出格式和文件名等等，具体请参看scrapy官方文档的 feed-export 一章。

比如你可以通过如下配置来做到默认输出jsonlines格式，这个对于爬虫数据收集来说会更好一点，容错率高一点：

```
FEED_URI = 'file:///output/%(name)s/%(time)s.jl'
FEED_FORMAT = 'jsonlines'
FEED_EXPORT_ENCODING = 'utf8'
```



## 慎用scrapy的高级特性

请慎用scrapy的高级特性，什么PIpeline啊，middleware等，请慎用数据库。如果不是简单的练手性质项目，而是正式的爬虫项目，够你操心的事将是一大堆，不管怎么样，先把数据爬到手再说。弄那些高级特性和数据库只会让你的精力被那些吸走，你的关注点应该集中在爬取，xpath分析，必要的数据收集和数据的后处理上。





## 模拟用户登录

表单简单来说就是一个前端友好的界面，其实质就是发送了 一个 POST 请求。

关键是要理解前端的表单界面，具体POST了哪些参量。

```
<form method="POST" action="???"
    <input type=... name="firstname" ... >
    <input type ...
    submit
</form>
```

input 的  **name** 就是具体 POST 的参量，然后就是action那边就是你要 POST 的目的地。

类似的表单还有很多其他元素，比如checkbox之类的，其都不过是为了让用户快速地设置某个参量罢了。

### 登录的cookies问题

因为http无状态，所以有cookies 和 session ，服务端数据库记录session，cookies就是客户端。爬虫要正常登录，记得保留好登录成功之后的cookies。

多次请求的时候，用requests的cookies保存和设置就不好用了。记得使用requests的session机制。

```
import requests
session = requests.Session()
data = {'username':'user', 'password': '123456' }
s = session.post('login.html', data)

##### 继续用这个session来请求，没有任何问题
s.get('profile.html')
```

```python
import scrapy

class LoginSpider(scrapy.Spider):
    name = 'example.com'
    start_urls = ['http://www.example.com/users/login.php']

    def parse(self, response):
        return scrapy.FormRequest.from_response(
            response,
            formdata={'username': 'john', 'password': 'secret'},
            callback=self.after_login
        )

    def after_login(self, response):
        # check login succeed before going on
        if "authentication failed" in response.body:
            self.logger.error("Login failed")
            return

        # continue scraping with authenticated session...
```





## 防止被封的策略

1. 设置随机的user agent策略
2. 禁用cookie `COOKIES_ENABLED = True`
3. 设置下载停顿 `DOWNLOAD_DELAY = n`
4. 使用代理池



防止被封的首要策略就是尽量的为别人的服务器多考虑下，让自己写的爬虫少请求，每次请求都是有效的核心请求获取最核心的数据，不管是刷页面还是刷ajax，多次请求之间应该设置一个停顿时间。

```
time.sleep(3)
```

在上面的首要原则的基础上，下面介绍的很多实战技巧，其实都符合一个大的原则：尽可能地让你的爬虫和人浏览网页没有区别。



### http请求头调整

user-agent 设置，而且时不时的切换下。

虽然目前还没有遇到，不过我推测可能 Referrer 这个header在某些场景下是有些文章的。

还有 Accept-Language 也可能有用。



### Cookies

有些情况下cookies的正常获取需要javascript的支持。cookies总的原则是第一次请求获取到cookies，然后后面的很多次请求都使用这个cookies即可。

不过反爬虫cookies一般都会有个时间限制，一个简单的做法就是这边也设置个时间，定时获取最新的cookies或者，一定请求量之后再获取一个新的cookies。

具体使用 scrapy-splash 了解下。



### 表单陷阱

有的表单里面有：

```
<input type="hidden" ...
```

我们要记住人如果在页面上点击，这个没有显示的字段的值也会一并送过去，而他们服务器那边会根据这个值可能是个加密的某个值来判断这个请求是人点的还是爬虫行为。

最好的策略是先把整个表单内容爬过来，收集好之后再发送表单请求。

和上面的情况相反，还有一种情况，页面表单发送可能有特别的处理，某些表单字段，不管用户看得见看不见，你都不能发送过去，只要发送过去就会被毙掉。

继续上面的表单陷阱，某些css也会动态将某个input 属于hidden属性，这个需要好好分析下。



### 403 forbidden

这极有可能是你的爬虫被封了。



## 高级议题

### JsonPipeline

`pipelines.py` 文件里面就定义了一些你自己写的Pipeline类，比如下面这个是JsonPipeline类：

```python
class JsonPipeline(object):

    def __init__(self):
        self.file = codecs.open('test.json', 'w', encoding='utf-8')

    def process_item(self, item, spider):
        line = json.dumps(dict(item), ensure_ascii=False, indent=4) + "\n"
        self.file.write(line)
        return item

    def spider_closed(self, spider):
        self.file.close()

```

大体就是一个简单的类，其中一些特别的方法有特别的用处。这个jsonpipelie并不具有实用价值，简单了解下即可。

### ImagesPipeline

想要自动下载图片，没问题，scrapy已经内置有这个功能了！你需要做的就是收集好图片连接就是了。设置里要加上这样一行：

```
ITEM_PIPELINES = {
    'scrapy.pipelines.images.ImagesPipeline': 1,
}
```

然后设置里还有如下相关配置:

```
IMAGES_STORE = '/path/to/download_images'
IMAGES_URLS_FIELD = 'image_url'
IMAGES_RESULT_FIELD = 'image'
```

这里 `IMAGES_URLS_FIELD` 的默认值是 `image_urls` ，你需要在你的items对象加上这一属性，其是一个列表值。然后 `IMAGES_RESULT_FIELD` 默认值是 `images` ， 这个值ImagesPipeline会自动填充，不需要管的。这里改名字是因为我不喜欢很多图片混在一起，所以做了一些处理分开了。

### MongoDBPipeline

想要把数据直接实时填入到mongodb里面去？用 `MongoDBPipeline` 即可，你需要

```
pip install scrapy-mongodb
```

然后配置加上

```
ITEM_PIPELINES = {
    'scrapy_mongodb.MongoDBPipeline': 400,
}
```

这后面的数字只是执行优先级，没什么特别的含义。

然后还有配置：

```
MONGODB_URI = 'mongodb://localhost:27017'
MONGODB_DATABASE = 'myscrapy'
MONGODB_UNIQUE_KEY = 'uuid'
```

这个插件的 `MONGODB_COLLECTION` 值默认是 `items` 是个死的，我还不是很满意。然后 `MONGODB_UNIQUE_KEY` 我还不清楚是什么，后面有时间继续。







### settings的传递

爬虫初始化后， `self.settings` 就可以使用了，通过它你就可以调用一些在 `settings.py` 文件里面的配置变量了。然后你在写pipeline的时候，如下：

```python
    def open_spider(self, spider):
        self.client = MongoClient(self.mongo_uri)
        self.mongodb = self.client[self.mongo_dbname]
        spider.mongodb = self.mongodb
```

`open_spider` 是打开爬虫后的动作，定义 `self.mongodb` 是将目标mongodb 数据库对象挂载本 pipeline上，而 `spider.mongodb` 是将这个变量挂在本爬虫上，这样后面你的爬虫类那里都是可以直接用 `self.mongodb` 来调用目标变量的，但说到爬虫类 `__init__` 方法里面还不大确定。然后你写pipeline的时候通过 `crawler.settings` 也可以或者配置变量：

```python
    @classmethod
    def from_crawler(cls, crawler):
        return cls(
            mongo_uri=crawler.settings.get('MONGODB_URI'),
            mongo_dbname=crawler.settings.get('MONGODB_DATABASE')
        )
```

