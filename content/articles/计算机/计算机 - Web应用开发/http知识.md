Date: 20191018

[TOC]

## HTTP知识

## URL结构

URL结构如下:

    scheme:[//[user:password@]host[:port]][/]path[?query][#fragment]

其中:

-   **scheme:** 描述访问服务器的协议，也就是如何获取该资源，最常见的是http，此外还有ftp等。
-   **user:password:** 这里用于http认证
-   **host:** 那里获取资源
-   **port:** 连接端口号是多少
-   **path:** 具体访问该资源的path
-   **query:** 其他额外参数
-   **fragment:** 片段，为client使用。还有一个params不太常用。

URL是只支持ascii字符表示的，其他的字符要经过utf-8编码操作。具体转义字符是 `%` ，比如空格SPACE，具体在URL中的表示就是 `%20` 。即使是ascii里面，也有一些字符需要转义，然后比如中文字符等，也需要如此utf-8编码和转义。比如 "书"
```
    >>> '书'.encode('utf-8')
    b'\xe4\xb9\xa6'
```
在URL中对应的就是 `%e4%b9%a6` 。还有其他一些细节，当然实际操作中各个编程语言都提供了良好的函数接口了的，比如python的urlencode函数。

### http header详解

本小节主要参考了 [这个网页](http://kb.cnblogs.com/page/92320/) ，内容整理得不错，都搬过来了，做备份用。

http协议过程分为http请求过程和http响应过程，http请求过程就是发送http请求信息包，http响应过程就是发送http响应信息包的过程。

### http 请求信息包

http请求信息包格式如下:
```
    <method> <URL> <version>

    <headers>

    <entity-body>
```
比如打开google主页的请求包是:
```
    GET / HTTP/1.1
    Host: www.google.com
    User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:40.0) Gecko/20100101 Firefox/40.0
    ........
```
其中第一行为大家熟知， 就是 `GET` 方法，具体打开的URL是 `/` ，然后http的version是 `HTTP/1.1` 。然后后面的请求包header内容不定，后面再细讲。请求信息包大多都没有entity-body，也就是额外的content内容，但就算没有header完了也要留一空白行。

### 请求headers详解

<table>
<colgroup>
<col  class="org-left">

<col  class="org-left">

<col  class="org-left">
</colgroup>
<thead>
<tr>
<th scope="col" class="org-left">header</th>
<th scope="col" class="org-left">解释</th>
<th scope="col" class="org-left">示例</th>
</tr>
</thead>

<tbody>
<tr>
<td class="org-left">Accept</td>
<td class="org-left">指定客户端能够接收的内容类型</td>
<td class="org-left">Accept: text/plain, text/html</td>
</tr>


<tr>
<td class="org-left">Accept-Charset</td>
<td class="org-left">浏览器可以接受的字符编码集</td>
<td class="org-left">Accept-Charset: iso-8859-5</td>
</tr>


<tr>
<td class="org-left">Accept-Encoding</td>
<td class="org-left">指定浏览器可以支持的web服务器返回内容压缩编码类型</td>
<td class="org-left">Accept-Encoding: compress, gzip</td>
</tr>


<tr>
<td class="org-left">Accept-Language</td>
<td class="org-left">浏览器可接受的语言</td>
<td class="org-left">Accept-Language: en,zh</td>
</tr>


<tr>
<td class="org-left">Accept-Ranges</td>
<td class="org-left">可以请求网页实体的一个或者多个子范围字段</td>
<td class="org-left">Accept-Ranges: bytes</td>
</tr>


<tr>
<td class="org-left">Authorization</td>
<td class="org-left">HTTP授权的授权证书</td>
<td class="org-left">Authorization: Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==</td>
</tr>


<tr>
<td class="org-left">Cache-Control</td>
<td class="org-left">指定请求和响应遵循的缓存机制</td>
<td class="org-left">Cache-Control: no-cache</td>
</tr>


<tr>
<td class="org-left">Connection</td>
<td class="org-left">表示是否需要持久连接   （HTTP 1.1默认进行持久连接）</td>
<td class="org-left">Connection: close</td>
</tr>


<tr>
<td class="org-left">Cookie</td>
<td class="org-left">HTTP请求发送时，会把保存在该请求域名下的所有cookie值一起发送给web服务器。</td>
<td class="org-left">Cookie: $Version=1; Skin=new;</td>
</tr>


<tr>
<td class="org-left">Content-Length</td>
<td class="org-left">请求的内容长度</td>
<td class="org-left">Content-Length: 348</td>
</tr>


<tr>
<td class="org-left">Content-Type</td>
<td class="org-left">请求的与实体对应的MIME信息</td>
<td class="org-left">Content-Type: application/x-www-form-urlencoded</td>
</tr>


<tr>
<td class="org-left">Date</td>
<td class="org-left">请求发送的日期和时间</td>
<td class="org-left">Date: Tue, 15 Nov 2010 08:12:31 GMT</td>
</tr>


<tr>
<td class="org-left">Expect</td>
<td class="org-left">请求的特定的服务器行为</td>
<td class="org-left">Expect: 100-continue</td>
</tr>


<tr>
<td class="org-left">From</td>
<td class="org-left">发出请求的用户的Email</td>
<td class="org-left">From: user@email.com</td>
</tr>


<tr>
<td class="org-left">Host</td>
<td class="org-left">指定请求的服务器的域名和端口号</td>
<td class="org-left">Host: www.zcmhi.com</td>
</tr>


<tr>
<td class="org-left">If-Match</td>
<td class="org-left">只有请求内容与实体相匹配才有效</td>
<td class="org-left">If-Match: “737060cd8c284d8af7ad3082f209582d”</td>
</tr>


<tr>
<td class="org-left">If-Modified-Since</td>
<td class="org-left">如果请求的部分在指定时间之后被修改则请求成功，未被修改则返回304代码</td>
<td class="org-left">If-Modified-Since: Sat, 29 Oct 2010 19:43:31 GMT</td>
</tr>


<tr>
<td class="org-left">If-None-Match</td>
<td class="org-left">如果内容未改变返回304代码，参数为服务器先前发送的Etag，与服务器回应的Etag比较判断是否改变</td>
<td class="org-left">If-None-Match: “737060cd8c284d8af7ad3082f209582d”</td>
</tr>


<tr>
<td class="org-left">If-Range</td>
<td class="org-left">如果实体未改变，服务器发送客户端丢失的部分，否则发送整个实体。参数也为Etag</td>
<td class="org-left">If-Range: “737060cd8c284d8af7ad3082f209582d”</td>
</tr>


<tr>
<td class="org-left">If-Unmodified-Since</td>
<td class="org-left">只在实体在指定时间之后未被修改才请求成功</td>
<td class="org-left">If-Unmodified-Since: Sat, 29 Oct 2010 19:43:31 GMT</td>
</tr>


<tr>
<td class="org-left">Max-Forwards</td>
<td class="org-left">限制信息通过代理和网关传送的时间</td>
<td class="org-left">Max-Forwards: 10</td>
</tr>


<tr>
<td class="org-left">Pragma</td>
<td class="org-left">用来包含实现特定的指令</td>
<td class="org-left">Pragma: no-cache</td>
</tr>


<tr>
<td class="org-left">Proxy-Authorization</td>
<td class="org-left">连接到代理的授权证书</td>
<td class="org-left">Proxy-Authorization: Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==</td>
</tr>


<tr>
<td class="org-left">Range</td>
<td class="org-left">只请求实体的一部分，指定范围</td>
<td class="org-left">Range: bytes=500-999</td>
</tr>


<tr>
<td class="org-left">Referer</td>
<td class="org-left">先前网页的地址，当前请求网页紧随其后,即来路</td>
<td class="org-left">Referer: <http://www.zcmhi.com/archives/71.html></td>
</tr>


<tr>
<td class="org-left">TE</td>
<td class="org-left">客户端愿意接受的传输编码，并通知服务器接受接受尾加头信息</td>
<td class="org-left">TE: trailers,deflate;q=0.5</td>
</tr>


<tr>
<td class="org-left">Upgrade</td>
<td class="org-left">向服务器指定某种传输协议以便服务器进行转换（如果支持）</td>
<td class="org-left">Upgrade: HTTP/2.0, SHTTP/1.3, IRC/6.9, RTA/x11</td>
</tr>


<tr>
<td class="org-left">User-Agent</td>
<td class="org-left">User-Agent的内容包含发出请求的用户信息</td>
<td class="org-left">User-Agent: Mozilla/5.0 (Linux; X11)</td>
</tr>


<tr>
<td class="org-left">Via</td>
<td class="org-left">通知中间网关或代理服务器地址，通信协议</td>
<td class="org-left">Via: 1.0 fred, 1.1 nowhere.com (Apache/1.1)</td>
</tr>


<tr>
<td class="org-left">Warning</td>
<td class="org-left">关于消息实体的警告信息</td>
<td class="org-left">Warn: 199 Miscellaneous warning</td>
</tr>
</tbody>
</table>

### http 响应信息包

http响应信息包格式如下:
```
    <version> <status-code> <reason-phrase>

    <headers>

    <entity-body>
```
比如:
```
    HTTP/1.1 200 OK
    Cache-Control: private
    Content-Length: 231
    Content-Type: text/html; charset=UTF-8
    Date: Wed, 02 Sep 2015 08:47:52 GMT
    ....
```
这个响应体 `HTTP/1.1` 就是的就是http的version，然后 `200` 是具体的http状态码，然后 `OK` 是一个描述文字。然后是响应体的header，然后空一行，然后是响应信息包的具体发送的cotent内容。

http的方法method和状态码为大家所熟知，下面就header的一些内容列出来说明之。

### 响应headers详解

<table>


<colgroup>
<col  class="org-left">

<col  class="org-left">

<col  class="org-left">
</colgroup>
<thead>
<tr>
<th scope="col" class="org-left">header</th>
<th scope="col" class="org-left">解释</th>
<th scope="col" class="org-left">示例</th>
</tr>
</thead>

<tbody>
<tr>
<td class="org-left">Accept-Ranges</td>
<td class="org-left">表明服务器是否支持指定范围请求及哪种类型的分段请求</td>
<td class="org-left">Accept-Ranges: bytes</td>
</tr>


<tr>
<td class="org-left">Age</td>
<td class="org-left">从原始服务器到代理缓存形成的估算时间（以秒计，非负）</td>
<td class="org-left">Age: 12</td>
</tr>


<tr>
<td class="org-left">Allow</td>
<td class="org-left">对某网络资源的有效的请求行为，不允许则返回405</td>
<td class="org-left">Allow: GET, HEAD</td>
</tr>


<tr>
<td class="org-left">Cache-Control</td>
<td class="org-left">告诉所有的缓存机制是否可以缓存及哪种类型</td>
<td class="org-left">Cache-Control: no-cache</td>
</tr>


<tr>
<td class="org-left">Content-Encoding</td>
<td class="org-left">web服务器支持的返回内容压缩编码类型。</td>
<td class="org-left">Content-Encoding: gzip</td>
</tr>


<tr>
<td class="org-left">Content-Language</td>
<td class="org-left">响应体的语言</td>
<td class="org-left">Content-Language: en,zh</td>
</tr>


<tr>
<td class="org-left">Content-Length</td>
<td class="org-left">响应体的长度</td>
<td class="org-left">Content-Length: 348</td>
</tr>


<tr>
<td class="org-left">Content-Location</td>
<td class="org-left">请求资源可替代的备用的另一地址</td>
<td class="org-left">Content-Location: /index.htm</td>
</tr>


<tr>
<td class="org-left">Content-MD5</td>
<td class="org-left">返回资源的MD5校验值</td>
<td class="org-left">Content-MD5: Q2hlY2sgSW50ZWdyaXR5IQ==</td>
</tr>


<tr>
<td class="org-left">Content-Range</td>
<td class="org-left">在整个返回体中本部分的字节位置</td>
<td class="org-left">Content-Range: bytes 21010-47021/47022</td>
</tr>


<tr>
<td class="org-left">Content-Type</td>
<td class="org-left">返回内容的MIME类型</td>
<td class="org-left">Content-Type: text/html; charset=utf-8</td>
</tr>


<tr>
<td class="org-left">Date</td>
<td class="org-left">原始服务器消息发出的时间</td>
<td class="org-left">Date: Tue, 15 Nov 2010 08:12:31 GMT</td>
</tr>


<tr>
<td class="org-left">ETag</td>
<td class="org-left">请求变量的实体标签的当前值</td>
<td class="org-left">ETag: “737060cd8c284d8af7ad3082f209582d”</td>
</tr>


<tr>
<td class="org-left">Expires</td>
<td class="org-left">响应过期的日期和时间</td>
<td class="org-left">Expires: Thu, 01 Dec 2010 16:00:00 GMT</td>
</tr>


<tr>
<td class="org-left">Last-Modified</td>
<td class="org-left">请求资源的最后修改时间</td>
<td class="org-left">Last-Modified: Tue, 15 Nov 2010 12:45:26 GMT</td>
</tr>


<tr>
<td class="org-left">Location</td>
<td class="org-left">用来重定向接收方到非请求URL的位置来完成请求或标识新的资源</td>
<td class="org-left">Location: <http://www.zcmhi.com/archives/94.html></td>
</tr>


<tr>
<td class="org-left">Pragma</td>
<td class="org-left">包括实现特定的指令，它可应用到响应链上的任何接收方</td>
<td class="org-left">Pragma: no-cache</td>
</tr>


<tr>
<td class="org-left">Proxy-Authenticate</td>
<td class="org-left">它指出认证方案和可应用到代理的该URL上的参数</td>
<td class="org-left">Proxy-Authenticate: Basic</td>
</tr>


<tr>
<td class="org-left">refresh</td>
<td class="org-left">应用于重定向或一个新的资源被创造，在5秒之后重定向</td>
<td class="org-left">&#xa0;</td>
</tr>


<tr>
<td class="org-left">Retry-After</td>
<td class="org-left">如果实体暂时不可取，通知客户端在指定时间之后再次尝试</td>
<td class="org-left">Retry-After: 120</td>
</tr>


<tr>
<td class="org-left">Server</td>
<td class="org-left">web服务器软件名称</td>
<td class="org-left">Server: Apache/1.3.27 (Unix) (Red-Hat/Linux)</td>
</tr>


<tr>
<td class="org-left">Set-Cookie</td>
<td class="org-left">设置Http Cookie</td>
<td class="org-left">&#xa0;</td>
</tr>


<tr>
<td class="org-left">Trailer</td>
<td class="org-left">指出头域在分块传输编码的尾部存在</td>
<td class="org-left">Trailer: Max-Forwards</td>
</tr>


<tr>
<td class="org-left">Transfer-Encoding</td>
<td class="org-left">文件传输编码</td>
<td class="org-left">&#xa0;</td>
</tr>


<tr>
<td class="org-left">Vary</td>
<td class="org-left">告诉下游代理是使用缓存响应还是从原始服务器请求</td>
<td class="org-left">&#xa0;</td>
</tr>


<tr>
<td class="org-left">Via</td>
<td class="org-left">告知代理客户端响应是通过哪里发送的</td>
<td class="org-left">&#xa0;</td>
</tr>


<tr>
<td class="org-left">Warning</td>
<td class="org-left">警告实体可能存在的问题</td>
<td class="org-left">&#xa0;</td>
</tr>


<tr>
<td class="org-left">WWW-Authenticate</td>
<td class="org-left">表明客户端请求实体应该使用的授权方案</td>
<td class="org-left">WWW-Authenticate: Basic</td>
</tr>
</tbody>
</table>

### http状态码详

-   **MIME type:** 其全称是Multipurpose Internet Mail Extensions ，可以看得出来和email系统有关，但不管怎么说，我们知道其在http里面用于描述文件类型即可。具体就是对应的
```
    Content-type : image/jpeg
```
这一行，image/jpeg 就是MIME type描述，image是主文件类型，jpeg是次文件类型。最常见的是html文件，其MIME type是 `text/html` 。

-   **URI:** Uniform Resource Identifier ，此外常见的还有URN和URL概念。参考了 [这个网页](http://stackoverflow.com/questions/4913343/what-is-the-difference-between-uri-url-and-urn) 。URN和URL都属于URI的范畴，也就是都视同用一连串的字符串来将所有的资源文件分别表示出来，而URN和URL是两种不同的标识方法，URL有点类似于门牌号码街道的描述，其大致有如下结构:
```
    scheme:[//[user:password@]host[:port]][/]path[?query][#fragment]
```
而URN比如:
```
    urn:isbn:0451450523
```
目前几乎绝大部分URI就是URL，URN只在某些特别领域使用。

