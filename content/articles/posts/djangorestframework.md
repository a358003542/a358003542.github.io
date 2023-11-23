Slug: django-restframework
Date: 20231017
Modified: 20231123

[TOC]


## APIView
对于一般的视图函数根据HTTP请求方法的不同，我们一般会有如下代码：

```python
from django.http import HttpResponse

def my_view(request):
    if request.method == 'GET':
        # <view logic>
        return HttpResponse('result')
```

django那边提出View类的概念，只需要具体编写`get`、`post`等方法就实现了对应方法的响应。


```python
from django.http import HttpResponse
from django.views import View

class MyView(View):
    def get(self, request):
        # <view logic>
        return HttpResponse('result')
```

django restframework的 APIView 继承自 django 的 View，然后针对restful风格的api提供了很多便捷的功能支持。此外rest framework还提供了 `GenericAPIView` 和 `RetrieveAPIView` 等等其他视图类，还提供了 `ListModelMixin` 等等其他Mixin，一般来说视图类的编写继承自 `APIView` 类即可，其他Mixin和视图类很方便，在应用上可以节省很多代码的编写，读者可以随着对这些视图类和Mixin的熟悉程度而慢慢使用之【对于新手推荐就直接使用APIView类，已经足够的好用了，rest fraemwork提供的其他视图类如果熟悉的话就用，不熟悉就不用，过多的类嵌套层次不一定是一件好事】。

### Request对象
APIView视图类下面定义get，post等方法，默认第一个参数是request参数，即Request对象，这个对象有：

- query_params 其对应的是URL参数上解析获得的参数，一般情况是GET方法的URL上的参数，但其他方法也可能会有。

- data 其对应的是HTTP请求体BODY部分的解析内容，对于Restful风格API来说，一种常见的情况就是POST，PUT上传递过来的json字典值。而更厉害的是对于传过来的文件，表单其都有不错的支持。

- user 如果请求经过认证了会返回相应的用户记录，你编写auth类的时候会知道的，如果没有认证，那么返回 `AnonymousUser`



### Response对象
rest framework的Response对象继承自django的SimpleTemplateResponse类，其继承自django的HttpResponse对象，也就是最终返回的仍是django的HttpResponse对象，只是针对Restful风格API作了很多优化，一般来说是推荐使用rest framework提供的Response类。

```
Response(data, status=None, template_name=None, headers=None, content_type=None)
```
headers http协议响应头，status http状态码等等。

下面贴上一个视图类的代码样例，因为rest framework的视图类编写的具体过程很是大同小异，多看几遍就清楚了该做那些事情了。

```python
class SnippetDetail(APIView):
    """
    Retrieve, update or delete a snippet instance.
    """
    def get_object(self, pk):
        try:
            return Snippet.objects.get(pk=pk)
        except Snippet.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        snippet = self.get_object(pk)
        serializer = SnippetSerializer(snippet)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        snippet = self.get_object(pk)
        serializer = SnippetSerializer(snippet, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        snippet = self.get_object(pk)
        snippet.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
```



## 序列化
rest framework的序列化类提供了沟通django的Model类到JSON数据格式之间的桥梁【说的简单点就是序列化就是数据从模型层流向python代码层的过程。】。

比如下面是模型层到python代码层的过程，序列化之后的 `data` 就是python的字典值了。

```
serializer = SnippetSerializer(snippet)
serializer.data
# {'pk': 2, 'title': u'', 'code': u'print "hello, world"\n', 'linenos': False, 'language': u'python', 'style': u'friendly'}
```

下面的过程是反序列化过程【数据从python代码层流向模型层的过程】：

```
serializer = SnippetSerializer(data=data)
serializer.save()
```

这个save方法具体行为如果你定义的save方法当然就是直接调用save方法，如果没有则依赖于你定义的 `create` 和 `update` 方法。如下所示：

```
    def create(self, validated_data):
        return Comment.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.email = validated_data.get('email', instance.email)
        instance.content = validated_data.get('content', instance.content)
        instance.created = validated_data.get('created', instance.created)
        instance.save()
        return instance
```
### Serializer类
Serializer类的初始化方法了解一下：
```
    def __init__(self, instance=None, data=empty, **kwargs):
```
第一个参数是instance，如果这个设置了，那么后面save的时候会调用update方法，否则调用create方法。

第二个参数data为我们很熟悉了。

kwargs里面还有一个参数值得一提，有的时候序列化类里面某些方法可能需要一些特殊的参数，比如：
```
        serializer = self.serializer_class(profile, context={
            'request': request
        })
```

后面序列化类的自定义方面里面可以如下调用这个request对象：
```
request = self.context.get('request', None)
```

### ModelSerializer
可以利用 `ModelSerializer` 类来更快地创建序列化类，比如上面的SnippetSerializer如果你是继承自Serializer类那么一些字段你是要一个个去定义的，而如果继承自 `ModelSerializer` 类则只需要指定一些模型字段就会自动创建，然后其有一个默认创建的 create和update方法，一般情况下这两个方法对于一般情况就够用了。


```python
from rest_framework import serializers

class SnippetSerializer(serializers.ModelSerializer):
    title = CharField(allow_blank=True, max_length=100, required=False)
    
    class Meta:
        model = Snippet
        fields = ('id', 'title', 'code', 'linenos', 'language', 'style')
```
**值得一提的是：** 上面这种写法，比如说title字段你也可以明确声明出来，下面fields再列出来也是不冲突的，因为可能有时默认的字段声明你不是很满意。

```
>>> from snippets.models import Snippet
>>> snippet = Snippet(code='print "hello, world2"\n')
>>> from snippets.serializers import SnippetSerializer
>>> snippet.save()
>>> serializer = SnippetSerializer(snippet)
>>> serializer.data
{'language': 'python', 'linenos': False, 'id': 3, 'title': '', 'code': 'print "hello, world2"\n', 'style': 'friendly'}
```

ModelSerializer实现了一个版本的create和update方法，你可能会对默认的版本不太满意，则你可以自己去定义自己的版本。这两个方法具体是在调用 `save` 的时候被调用的，当instance没有传入进序列化对象的时候，其会调用create方法；如果instance对象传入进来了，则调用update方法。

```python
        validated_data = {**self.validated_data, **kwargs}
        if self.instance is not None:
            self.instance = self.update(self.instance, validated_data)
            assert self.instance is not None, (
                '`update()` did not return an object instance.'
            )
        else:
            self.instance = self.create(validated_data)
            assert self.instance is not None, (
                '`create()` did not return an object instance.'
            )
```

### 查看ModelSerializer默认配置
python manage.py shell

```
from myapp.serializers import AccountSerializer
serializer = AccountSerializer()
print(repr(serializer))
```

### source参数
source对于字段的一般含义如下所示：
```
    if self.source is None:
        self.source = field_name
```

 默认为None，然后赋值为字段名。扩展的用法如下：

 1. `URLField(source='get_absolute_url')` 根据序列化类的方法来获得值
 2. `EmailField(source='user.email')` 通过关系字段获得扩展属性，注意如果关系字段为NULL则会报错，最好设置下default值。

### partial参数
默认序列化类需要传入所有required字段数据，否则将抛出验证异常，可以传入 `partial=True` 来允许部分更新。


### is_valid 方法
当反序列化的时候，一般需要调用 `is_valid` 方法来判断数据是否合适保存到模型层去。
```
serializer.is_valid(raise_exception=True)
```

你可以定义 `validate` 方法来进行目标对象的验证行为，或者定义 `validate_<fieldname>` 来定义字段级别的验证行为。

```python
    def validate(self, data):
        """
        Check that the start is before the stop.
        """
        if data['start'] > data['finish']:
            raise serializers.ValidationError("finish must occur after start")
        return data
```

### read_only和write_only
序列化类的某个字段设置为 `read_only` 则该字段不会进入 read 和 update 方法的 `validated_data` 参数，但可以用于 `.data` 的序列化展示数据。

如果某个字段设置为 `write_only` ，则该字段不会 `.data` 的序列化数据展示，但会进入 read 和 update 方法的 `validated_data` 参数中。

### SerializerMethodField
这是一个read_only 字段，可以通过某个方法来给你的 `.data` 序列化输出增加额外的字段信息。

**NOTICE: ** 注意目标方法接受两个参数。

```python
from django.contrib.auth.models import User
from django.utils.timezone import now
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    days_since_joined = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = '__all__'

    def get_days_since_joined(self, obj):
        return (now() - obj.date_joined).days
```

### 在序列化类里面引用request.user

参考了 [这个问题](https://stackoverflow.com/questions/30203652/how-to-get-request-user-in-django-rest-framework-serializer) ，在序列化类里面需要通过 `self.context['request']` 来获取 request 对象，进而获取 user对象。

```
user =  self.context['request'].user

```

## 渲染器
如下是配置rest framework的全局默认渲染器：

```
REST_FRAMEWORK = {
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',
    ]
}
```
对于继承自 `APIView` 的视图类，可以通过 `renderer_classes` 来设置它的渲染器：

```
from django.contrib.auth.models import User
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
from rest_framework.views import APIView

class UserCountView(APIView):
    """
    A view that returns the count of active users in JSON.
    """
    renderer_classes = [JSONRenderer]

    def get(self, request, format=None):
        user_count = User.objects.filter(active=True).count()
        content = {'user_count': user_count}
        return Response(content)
```

或者：

```
@api_view(['GET'])
@renderer_classes([JSONRenderer])
def user_count_view(request, format=None):
    """
    A view that returns the count of active users in JSON.
    """
    user_count = User.objects.filter(active=True).count()
    content = {'user_count': user_count}
    return Response(content)
```

### 自定义渲染器
在realworld有这样一个自定义渲染器样例：
```python
import json

from rest_framework.renderers import JSONRenderer


class ConduitJSONRenderer(JSONRenderer):
    charset = 'utf-8'
    object_label = 'object'
    pagination_object_label = 'objects'
    pagination_object_count = 'count'

    def render(self, data, media_type=None, renderer_context=None):
        if data.get('results', None) is not None:
            return json.dumps({
                self.pagination_object_label: data['results'],
                self.pagination_count_label: data['count']
            })

        # If the view throws an error (such as the user can't be authenticated
        # or something similar), `data` will contain an `errors` key. We want
        # the default JSONRenderer to handle rendering errors, so we need to
        # check for this case.
        elif data.get('errors', None) is not None:
            return super(ConduitJSONRenderer, self).render(data)

        else:
            return json.dumps({
                self.object_label: data
            })

显然渲染器就是要实现render方法，这里的思路就是假如说是多个结果的情况，那么最好封装成为：

```
{
    "results": ...
    "count": ...
}
```
这样的结构形式，然后后续不同的render可以更改 `pagination_object_label` 这个参数。

假如说是异常错误的情况则推荐采用格式：
```
{
    "errors": ...
}
```

加入是单个对象的返回值，视图函数那边直接返回该对象的数据，然后会封装成为：

```
{
    "object_label" : data
}
```


class UserJSONRenderer(ConduitJSONRenderer):
    charset = 'utf-8'
    object_label = 'user'
    pagination_object_label = 'users'
    pagination_count_label = 'usersCount'

    def render(self, data, media_type=None, renderer_context=None):
        # If we recieve a `token` key as part of the response, it will by a
        # byte object. Byte objects don't serializer well, so we need to
        # decode it before rendering the User object.
        token = data.get('token', None)

        if token is not None and isinstance(token, bytes):
            # Also as mentioned above, we will decode `token` if it is of type
            # bytes.
            data['token'] = token.decode('utf-8')

        return super(UserJSONRenderer, self).render(data)

```

UserJSONRenderer主要在ConduitJSONRenderer的基础上新增了一个token字段。

**警告：** 上面的例子只是参考，还是有点问题的，比如media_type和renderer_context参数已经传递丢失了。

renderer_context 里面的参数有：view, request, response, args, kwargs 。这些args和kwargs都是视图函数那边的。

**警告：** 自定义的渲染器的返回值格式变动TestCase那边的测试代码是不知道的，因为那边调用的是response对象，你需要修改 `renderer_context['response']` 。

### 自定义异常处理
对于API视图函数抛出的异常，可以通过异常处理函数，根据接受到的异常转成Response对象。

这个函数接受两个参数，第一个exc是当前正在处理的异常，第二个参数是一个字典值context，一些额外的环境参数。

异常处理函数要某返回一个Response对象，或者返回None。如果返回的是None，则该异常将会抛给Django，然后Django返回一个标准的500 Server error响应。

下面这个样例异常处理函数，会将所有的响应状态码写入response字典数据里面。
```python
from rest_framework.views import exception_handler

def custom_exception_handler(exc, context):
    # Call REST framework's default exception handler first,
    # to get the standard error response.
    response = exception_handler(exc, context)

    # Now add the HTTP status code to the response.
    if response is not None:
        response.data['status_code'] = response.status_code

    return response
```

再比如realworld里面自定义的异常处理函数：

```python
def core_exception_handler(exc, context):
    # If an exception is thrown that we don't explicitly handle here, we want
    # to delegate to the default exception handler offered by DRF. If we do
    # handle this exception type, we will still want access to the response
    # generated by DRF, so we get that response up front.
    response = exception_handler(exc, context)
    handlers = {
        'ValidationError': _handle_generic_error
    }
    # This is how we identify the type of the current exception. We will use
    # this in a moment to see whether we should handle this exception or let
    # Django REST Framework do it's thing.
    exception_class = exc.__class__.__name__

    if exception_class in handlers:
        # If this exception is one that we can handle, handle it. Otherwise,
        # return the response generated earlier by the default exception 
        # handler.
        return handlers[exception_class](exc, context, response)

    return response
```
也就是根据你定义的异常类型来决定不同的处理策略，比如 `_handle_not_found_error` :

```python
def _handle_generic_error(exc, context, response):
    # This is about the most straightforward exception handler we can create.
    # We take the response generated by DRF and wrap it in the `errors` key.
    response.data = {
        'errors': response.data
    }

    return response
```

`context['view']` 可以获取目标视图函数。上面就是简单将异常信息封装进errors键里面。

自定义的异常要在 `REST_FRAMEWORK` 上配置后才生效。

```
REST_FRAMEWORK = {
    'EXCEPTION_HANDLER': 'my_project.my_app.utils.custom_exception_handler'
}
```

## JWT认证
首先说一下JWT认证和传统的session的区别在哪里，有很多文章会比较它们的优缺点，比如session需要服务器在数据库里面存储于是这是一笔额外的计算开销，这个是一个点，至于因此带来的服务器分布式的可扩展性问题会麻烦点，但不是没有办法解决。此外有的批评JWT的安全性的观点我认为是有待考量的，有的认为JWT具有实现简单的优势我也不是很认同，我不认为JWT会比session简单，结合对JWT的安全性的批评我们会发现，JWT作为一种新技术要将其用好，比如安全性方面完善好也不简单。所以我发现网上的关于JWT认证和基于session的认证的优缺点对比说的点我觉得都不是很重要，至少我可以确定在小用户量应用场景下这两者是不能说谁优于谁的。

不过这里我提出一个点，这个点就是JWT认证在设计上会更加吻合HTTP的无状态特性，更吻合Restful 风格api的无状态设计理念。正确的设计理念有的时候很重要，人们谈论的很多问题JWT在实践上都可以慢慢完善，唯独这个设计理念如果不对味后面也是完善不了的。所以讨论了这么久无非是这个问题，服务器到底有没有必要存储session信息，看着数据库里面一堆乱码般的django_session数据库，这些无谓的临时冗余信息让我不是很喜欢，所以以下是个人的一家之言：如果你不清楚该用那种认证方式，那么推荐JWT认证。


jwt认证的基本思路是对于某个api请求，用户输入用户名和密码，正确的话服务器返回jwt的token，然后后面用户要请求其他url则需要在HTTP请求的Header上加上 `Authorization` 这个字段。具体这个字段的值可能会有所差异的，我略微查看了pyjwt `version 2.3.0` 的源码，得到这一行：
```
authentication.get_authorization_header(request)
```
就会获取 `Authorization` 的值。realworld的样例在处理上会有一个额外的动作：

```python
import jwt

from django.conf import settings

from rest_framework import authentication, exceptions

from .models import User


class JWTAuthentication(authentication.BaseAuthentication):
    authentication_header_prefix = 'Token'

    def authenticate(self, request):
        """
        The `authenticate` method is called on every request, regardless of
        whether the endpoint requires authentication.

        `authenticate` has two possible return values:

        1) `None` - We return `None` if we do not wish to authenticate. Usually
        this means we know authentication will fail. An example of
        this is when the request does not include a token in the
        headers.

        2) `(user, token)` - We return a user/token combination when
        authentication was successful.

        If neither of these two cases were met, that means there was an error.
        In the event of an error, we do not return anything. We simple raise
        the `AuthenticationFailed` exception and let Django REST Framework
        handle the rest.
        """
        request.user = None

        # `auth_header` should be an array with two elements: 1) the name of
        # the authentication header (in this case, "Token") and 2) the JWT
        # that we should authenticate against.
        auth_header = authentication.get_authorization_header(request).split()
        auth_header_prefix = self.authentication_header_prefix.lower()
        if not auth_header:
            return None

        if len(auth_header) == 1:
            # Invalid token header. No credentials provided. Do not attempt to
            # authenticate.
            return None

        elif len(auth_header) > 2:
            # Invalid token header. Token string should not contain spaces. Do
            # not attempt to authenticate.
            return None

        # The JWT library we're using can't handle the `byte` type, which is
        # commonly used by standard libraries in Python 3. To get around this,
        # we simply have to decode `prefix` and `token`. This does not make for
        # clean code, but it is a good decision because we would get an error
        # if we didn't decode these values.
        prefix = auth_header[0].decode('utf-8')
        token = auth_header[1].decode('utf-8')

        if prefix.lower() != auth_header_prefix:
            # The auth header prefix is not what we expected. Do not attempt to
            # authenticate.
            return None
        # By now, we are sure there is a *chance* that authentication will
        # succeed. We delegate the actual credentials authentication to the
        # method below.
        return self._authenticate_credentials(request, token)

    def _authenticate_credentials(self, request, token):
        """
        Try to authenticate the given credentials. If authentication is
        successful, return the user and token. If not, throw an error.
        """
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms='HS256')
        except:
            msg = 'Invalid authentication. Could not decode token.'
            raise exceptions.AuthenticationFailed(msg)

        try:
            user = User.objects.get(pk=payload['id'])
        except User.DoesNotExist:
            msg = 'No user matching this token was found.'
            raise exceptions.AuthenticationFailed(msg)

        if not user.is_active:
            msg = 'This user has been deactivated.'
            raise exceptions.AuthenticationFailed(msg)

        return (user, token)

```
注意看那个split方法和后面的：
```
        prefix = auth_header[0].decode('utf-8')
        token = auth_header[1].decode('utf-8')
```

也就是 `Authorization` 内的值是：
```
Token token....
```

这样的格式。

注意pyjwt version 2.3.0版本decode是 `algorithms` 参数名，encode是 `algorithm` 参数名，好像最新的才都改为了 `algorithms` 。

默认的rest framework认证配置是：
```
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.BasicAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ]
}
```

这是一个尝试清单，realworld改为了：
```
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'apps.app_user.backends.JWTAuthentication',
    )
}
```

认证类认证成功返回 `(user, auth)` 认证成功后到视图函数那边，通过 `request.user` 和 `request.auth` 来获得对应的这两个值。没有认证成功则 `request.user` 是默认值： `django.contrib.auth.models.AnonymousUser` ，可通过 `UNAUTHENTICATED_USER` 另外配置。 `request.auth` 是默认值 `None` ，可通过 `UNAUTHENTICATED_TOKEN` 配置。

```
from django.contrib.auth import authenticate
```

这个autheticate函数的功能的实现就是根据你定义的那些认证类来的。

realworld的代码似乎并没有对jwt的时效性进行校对，此外jwt认证还需要加入refresh token过程来完善。

### refresh token
一般access_token时效性会设置的较短，大概几分钟的样子。在应用上不可能要求用户时不时得就输入用户名和密码，于是人们参考OAUTH2的认证方式提出了refresh token的概念，在用户首次登陆输入用户名和密码的请求哪里，还会返回一个时效性较长的refresh token，平时用access token去请求和之前的过程一样，区别就是客户端自己把那个refresh token存起来了，当客户端发现access token过期了的时候会像服务器的refresh token api 发送refresh token请求，带上的就是客户端自己保存的refresh token，服务器判断token有效，就会返回新的access token和新的refresh token。


## 认证和权限
django rest framework的配置 `DEFAULT_AUTHENTICATION_CLASSES` 默认是：

```
'DEFAULT_AUTHENTICATION_CLASSES': [
    'rest_framework.authentication.SessionAuthentication',
    'rest_framework.authentication.BasicAuthentication'
],
```
其对应的是APIView类下的配置：
```
authentication_classes = api_settings.DEFAULT_AUTHENTICATION_CLASSES
```

具体到APIView类的每个HTTP请求都会经过一些预处理，这其中就包括调用各个认证类的 authenticate方法。

而django的 `AUTHENTICATION_BACKENDS` 配置默认是：
```
AUTHENTICATION_BACKENDS = (
    # default django authenticate method
    'django.contrib.auth.backends.ModelBackend',
)
```

对应的是 `from django.contrib.auth import authenticate` 这个authenticate这个函数。在实践中这两个功能会分离出来：django提供的authenticate方法和用户的登录行为相关，这个方法只是返回User对象，说的再直白点这个只和login那一个api有关系。对于其他众多的restful 风格的api的请求仍然是需要一个认证过程的，这个认证就是通过rest framework提供的认证类来做的，这些认证类同样也有一个 authentication 方法，其返回的有User对象和token。

django rest framework的 `permission_classes` 来确定目标视图类的权限管理行为，默认是 `AllowAny` 。上面的认证过程做完了就会进入权限管理逻辑，也就是说在权限检查的时候 `request.user`  `request.auth` 已经是可以调用的了。

最简单的权限管理类就是 `IsAuthenticated` ：

```
class IsAuthenticated(BasePermission):
    """
    Allows access only to authenticated users.
    """

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)
```

这个确认 `request.user` 是可用的，也就是是登录用户是可以理解的，这个 `request.user.is_authenticated` 有点看不懂，简单查了一下似乎这个值总是True，是django因为兼容性问题写的代码。

最后就是`AUTHENTICATION_BACKENDS`里面认证权限不分家，django的ModelBackend自带权限校验，这块内容有点多，后面有时间再慢慢讨论。

再来看下面这段代码：
```
def get_user(request):
    if not hasattr(request, '_cached_user'):
        request._cached_user = auth.get_user(request)
    return request._cached_user


class AuthenticationMiddleware(MiddlewareMixin):
    def process_request(self, request):
        if not hasattr(request, 'session'):
            raise ImproperlyConfigured(
                "The Django authentication middleware requires session "
                "middleware to be installed. Edit your MIDDLEWARE setting to "
                "insert "
                "'django.contrib.sessions.middleware.SessionMiddleware' before "
                "'django.contrib.auth.middleware.AuthenticationMiddleware'."
            )
        request.user = SimpleLazyObject(lambda: get_user(request))
```

看的出来 `request.user` 的效果是 `AuthenticationMiddleware` 中间件做到的，然后 `get_user` 会调用各个backend的`get_user` 方法来获得user对象。 


## Restful API
本章节讨论的内容主要是基于HTTP协议的Restful API风格的编写原则。

### URL
目前url域名都推荐使用 api.what.com 这样的风格，然后关于API的版本，在URL上加上版本号，并不是一个很好的主意。在当前前后端分离的大背景下，这给前端和后端的代码都带来了一些额外的复杂度。

版本号按照 [阮一峰的这篇文章](http://www.ruanyifeng.com/blog/2011/09/restful.html) ，推荐使用 Accept 字段：

```
Accept: vnd.example-com.foo+json; version=2.0
```

推荐的URL风格如下：

```
api.what.com/resource_name
api.what.com/resource_name/<id>
api.what.com/resource_name/<id>/resource_name2
api.what.com/resource_name/<id>/resource_name2/<id>
```
上面的resource_name2的意思是SQL关系数据库中的关系，某个resource_name会关联多个resource_name2。

### HTTP方法
按照Restful api风格就推荐使用HTTP的这五种方法：GET, POST, PUT, DELETE和PATCH。

具体在使用上首先简单的理解就是对应数据库的增删改查来对应POST，DELETE，PUT，GET这四种方法。然后在细节上POST只能用户新增记录insert逻辑，PUT则是insert or update逻辑，PATCH只能用户update更新逻辑。

一般来说GET方法权限审核最宽松，POST方法次之，PUT方法和DELETE方法的权限审核最严，有时甚至完全不会将api写出来。


### 返回内容
payload都推荐采用json的单字典格式形式。

我喜欢使用这种风格：

1. 成功则直接返回各个结果：

```
{
    'a':1
}
```

有些人会说成功之后也应该加上code:200的代码，可是这是完全没有必要的，如果你需要获取数据，那么拿就是了，如果你怕数据不存在，那么加个针对目标数据的判断即可。加个code:200，但是目标数据字段还是不存在，程序不一样也会报错？

2. 失败则必须带上code错误码和msg错误信息

```
{
    'code': 10001,
    'msg': 'your error msg'
}
```

错误码软件系统内部应该有一个统一的规范，常见的错误类型有：

- 资源没有找到
- 找到多个资源
- 未知错误
- 输入缺少参数


### 参数设计
查询操作如果针对的是目标资源集合，有以下参数是推荐加上的：

- limit 返回个数
- offset 偏移值，可以通过它来实现分页效果
- sort 或者sortby等，总之一个排序的参数
- reverse 排序是否反转的参数

### 选择合适的状态码响应
状态码不建议弄得太复杂，下面列出几个必要的：

- 200 正确执行 
- 201 POST成功新增

- 400 BAD REQUEST 请求参数有误
- 401 未认证 用户未登陆未被识别
- 403 被禁止的 用户无权限
- 404 请求的URL不存在 
- 405 请求的方法不被允许

- 500 服务器内部错误 某些情况下需要这个状态码


