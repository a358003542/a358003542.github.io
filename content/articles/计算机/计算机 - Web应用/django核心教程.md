Slug: django-core-tutorial
Date: 20190405
Modified: 20260712


[TOC]


更多信息请参阅 [django官方文档](https://docs.djangoproject.com/zh-hans/6.0/) 。

## 初识Django

首先是搭建好项目的python依赖环境，环境里面安装好django模块依赖，这块讨论我就从简了。

运行如下命令来创建django项目骨架：

```
django-admin startproject project-name
```

不过一般这个时候我们已经把项目文件夹创建好了，那么推荐直接在项目文件夹下运行：

```
django-admin startproject project-name .
```

你会看到在当前文件夹下面多了一个 `manage.py` 文件，然后还有其他一些文件夹和文件。这个建议初学者简单了解下即可，后面会慢慢接触和熟悉的。


然后如下启动本django项目：

```
python manage.py runserver 
```

打开网页就能看到django的展示页面了。django默认配置一开始是使用的sqlite数据库，默认admin页面是可以查看的。读者可以到 `/admin` 那里看一下，这个admin页面的首次登录你需要创建一个超级用户，但这块先不讨论，后面再说。



### 新建一个应用

```
python manage.py startapp app_name
```

新建的应用里面有：

- migrations 和数据库迁移相关
- admin.py admin页面相关
- apps.py 应用的配置
- models.py 编写你的模型定义代码的地方
- tests.py 测试代码
- views.py 编写视图函数代码的地方

**NOTICE**: 你新建的app应用必须在django配置文件 `INSTALLED_APPS` 那里添加上，否则没有任何效果的。


### django做了什么事
HTTP请求包到了你的服务器，比如nginx服务器，其会分析你的HTTP请求包里面的URL，具体是分析URL里面的path参数，然后根据path参数来决定不同的行为。比如说很多静态图片HTTP请求一般是不会到django那边去的，这些静态内容的URL请求会直接由nginx来返回HTTP响应包。

还有一部分URL里面的path在Web服务器那边是定义为由某个WSGI服务接管（这里暂时还不讨论生产环境推荐使用gunicorn服务），对于这些URL的HTTP请求，Web服务器只是起到代理性质，将该请求传递给WSGI服务即可，这里所说的WSGI服务就是django提供的。这部分URL又会分成很多不同的类型，在代码上的表现就是通过编写urls.py这个文件来实现URL的进一步分发，分发过来的HTTP请求包会继续往下面传递，这里HTTP请求包当然早就不是原生的文本格式了，为了方便程序员开发应用程序进行了很多友好的封装。分发过去的HTTP请求包会继续分发到视图层也就是views.py这个文件里面的某个视图函数上，具体HTTP响应包的内容就是由这个视图函数封装的。

具体该视图函数在处理过程中可能会请求SQL数据库里面的资源，这个时候就要使用models.py里面定义的模型层的代码了，具体叫做SQL数据库的ORM封装。


### 基本的开发流程
希望 `/hello` 打印简单的 hello world 。

先是编写URL分发规则： 

1. 总应用的urls.py那里需要将目标应用的urls.py include进去，大概增加类似这样的一行：`path('', include('core.urls')),`
2. 目标应用urls.py那里 `urlpatterns` 增加类似这样的一行 `path("hello/", views.hello, name="hello"),`

然后在子应用的views.py 那里编写对应的视图函数

```
from django.http import HttpResponse

def hello(request):
    return HttpResponse("Hello World")
```

基本的开发流程就是这样的了，其他内容都是在这个基本的流程上增加东西。





## 配置
django的配置主要通过修改settings.py文件里面的内容来实现。

开发，测试，部署等有的项目做法是采用不同的settings.py文件，我不推荐这样的做法，一方面是这么做会造成很大的代码冗余，另外在开发中因为不同的代码文件要维护也常常造成困扰。为了版本更改比对方便，甚至推荐django提供的原始内容也就是前面那一块，完全不要更改，因为settings.py本身就是一个python文件，你完全可以后面添加一些代码来实现你想要的效果。

### 环境变量的加载
推荐使用 [python-dotenv](https://github.com/theskumar/python-dotenv) 来加载一些环境变量。

安装好后在`manage.py` 的main函数下添加：

```
from dotenv import load_dotenv
load_dotenv()
```

wsgi.py或者asgi.py文件，如果后面你要使用了，也别忘记添加这两行。

然后在settings.py的最后面增加这样一行：


```
from .load_env_settings import *
```

在settings.py文件的旁边增加 `load_env_settings.py` 文件，里面的内容如下：


```
import os


if os.getenv('DEBUG') and os.getenv('DEBUG').lower() == 'true':
    DEBUG = True
elif os.getenv('DEBUG') and os.getenv('DEBUG').lower() == 'false':
    DEBUG = False

if os.getenv('ALLOWED_HOSTS'):
    ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS').split(',')
```

然后根据你的django项目在那里来具体修改 `.env` 环境变量。比如生产环境就加上 `DEBUG=true`，根据具体服务器所在地点情况的不同来针对性地加上 `ALLOWED_HOSTS` 字段。

这样做第一个好处就是配置和代码抽离，代码尽可能少变动，配置变动不影响代码版本库。第二个好处就是很多隐私信息不进代码库，更加的安全。


## 静态文件管理
首先写一个简单的基于静态文件的hello样例。

视图函数类似这样的：

```
from django.shortcuts import render

def index(request):
    context = {}
    return render(request, 'index.html', context)
```

随便新建一个 `index.html` 文件，上面简单写一句hello world。文件放在本应用的templates文件夹下。按照django的默认配置，应该是能正常工作的，否则的话建议先确认配置 `TEMPATES -> APP_DIRS` 为 `True` 。 


### 使用jinja2模板引擎
笔者对jinja2模板引擎更熟悉，django是可以设置网页渲染引擎为jinja2的，这里就先讲了，后面涉及到模板文件的内容都默认是jinja2模板。

你的项目环境需要确保安装了 `jinja2` 模块。

然后对配置做如下更改：

```
TEMPLATES.extend([
    {
        'BACKEND': 'django.template.backends.jinja2.Jinja2',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'environment': 'myproject.jinja2.environment',
        },
    },
])
```

在你的主应用文件夹下（settings.py旁边），新建一个jinja2.py文件，文件内容如下：

```python
from django.templatetags.static import static
from django.urls import reverse

from jinja2 import Environment


def environment(**options):
    env = Environment(**options)
    env.globals.update(
        {
            "static": static,
            "url": reverse,
        }
    )
    return env
```

这是将django的一些额外的功能static和reverse引入到jinja2模板环境中去，这样在jinja2模板中你就可以调用该函数了。

然后在你的子应用下新建一个 `jinja2` 文件夹，下面放入你创建的jinja2模板，比如创建一个 `index.html` 文件，那么视图函数就不需要做任何更改了。

如上操作的好处就是继续保留了django内置的admin页面支持，当然可能还有其他很多django第三方应用也是使用的django默认的模板引擎，那些也是不受影响的。

### 静态文件加载
如下这样一行：
```
    <link rel="stylesheet" href="{{ static('vendor/bootstrap/css/bootstrap.min.css') }}" >
```

如上所述，现在static函数可以直接调用了，django默认模板引擎的那个`{% load static %}` 也不要用了。

对应的静态文件放在你的子应用下，新建一个`static` 文件夹，然后是 `vendor` 文件夹等等，依次类推。

### 生产环境的静态文件
生产环境的静态文件主要是nginx那边的事，然后django提供了 `python manage.py collectstatic` 来收集项目涉及到的所有静态文件，收集的目标地建议新增配置：

```
STATIC_ROOT = '/var/www/myproject/static'
```
因为默认静态文件和你的代码放在一个目录下不是太好。

下面的讨论假定你没有更改django原始配置，主要指的是 `STATIC_URL = 'static/'` 。

nginx对应服务上新增配置：

```
location /static/ {
    alias /var/www/myproject/static/;
}
```






## tests.py
```
python manage.py test
```
运行应用里面的单元测试代码。一个样例如下：

```
from django.test import TestCase
from .models import User

class UserTestCase(TestCase):
    def setUp(self):
        User.objects.create_user(username="lion", password="123455", email="abc@django.com")

    def test_animals_can_speak(self):
        """Animals that can speak are correctly identified"""
        lion = User.objects.get(username="lion")
        self.assertEqual(lion.username, 'lion')
```

测试代码的运行会另外创建一个数据库，测试完之后删除。


## admin页面

```
python manage.py createsuperuser
```

如果你运行上面的命令会提示你某个表格没有创建的错误，那是因为虽然sqlite数据库文件已经自动创建了，而且django默认的用户模型定义代码也已经有了，但具体SQL数据库里面还没有这些表格，你需要执行数据库迁移命令：

```
python manage.py makemigrations
python manage.py migrate
```

然后再运行createsuperuser就可以了。

用创建的用户名和密码登录admin页面，读者可以看到User那里有你刚创建的用户信息。
