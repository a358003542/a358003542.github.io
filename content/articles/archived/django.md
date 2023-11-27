Slug: django
Date: 20231017
Modified: 20231123

[TOC]



## 自定义命令
自定义命令的好处就是你写的python脚本可以类似在 `python manage.py shell` 环境内使用，比如一些数据库操作就可以直接写上python的ORM操作代码而不用关心数据库连接的问题。

首先是在目标app下面新建一个 `management` 文件夹，然后新建一个 `commands`  文件夹，注意这两个文件夹都要带上 `__init__.py` 文件。

然后commands文件夹里面就可以定义一些python脚本了，这些脚本成为命令可以直接如下调用：

```
python manage.py command_name
```

你可以通过：

```
python manage.py help
```

来查看目前已经有的命令列表。

一个基本的命令脚本编写大概如下所示：

```python
from django.core.management.base import BaseCommand, CommandError
from polls.models import Question as Poll

class Command(BaseCommand):
    help = 'Closes the specified poll for voting'

    def add_arguments(self, parser):
        parser.add_argument('poll_id', nargs='+', type=int)

    def handle(self, *args, **options):
        for poll_id in options['poll_id']:
            try:
                poll = Poll.objects.get(pk=poll_id)
            except Poll.DoesNotExist:
                raise CommandError('Poll "%s" does not exist' % poll_id)

            poll.opened = False
            poll.save()

            self.stdout.write(self.style.SUCCESS('Successfully closed poll "%s"' % poll_id))
```


## 文件上传
请参看rest framework的 FileUploadParser 。在获取到file_obj之后，如下进行写文件动作：

```
       outfile = open('test_out.jpg', 'wb+')

        for chunk in file_obj.chunks():
            outfile.write(chunk)
```

rest framework最后仍然会使用django提供的upload handler。`FILE_UPLOAD_HANDLERS` 默认是：

```
["django.core.files.uploadhandler.MemoryFileUploadHandler",
 "django.core.files.uploadhandler.TemporaryFileUploadHandler"]
```

小文件会写入内存，大文件会写在临时文件上。

MEDIA_ROOT 是用来控制media在本地的存放路径的。MEDIA_URL是用来控制media在url上的前缀显示的。还需要如下将media文件加入额外的静态文件管理：

```
STATICFILES_DIRS = [MEDIA_ROOT]
```
然后django urls.py哪里：

```
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    ......
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

要这样设置下media静态文件的服务。这是测试环境，生产环境请把这行去掉用ngnix这样的web server来进行静态文件服务。




## 日志

django使用python的logging模块来作为的自己的日志系统，所以django项目日志管理的深入学习离不开对于logging模块的深入学习。

首先需要了解如下几个词汇：loggers, handlers, filters, and formatters。

### loggers 

记录器 之前我们运行logging.info，就是调用的默认的记录器，然后一般我们会针对每个python的模块文件创建一个记录器。

```
logger = logging.getLogger(__name__)
```

这个 `__name__` 只是一种简便的命名方法，如果你勤快或者某种情况下有需要的话完全可以自己手工给记录器取个名字。

然后这个 `getLogger` 函数如果你后面指定的名字之前已经定义了（这通常是指在其他第三方模块下定义了），那么你通过这个 `getLogger` 然后指定目标名字就会得到对应的该记录器。这通常对于DIY某个第三方模块的日志记录器有用。

记录器可以挂载或者卸载某个处理器对象或过滤器对象：

- logger.addHandler()
- logger.removeHandler()
- logger.addFilter()
- logger.removeFilter()

记录器通过 `setLevel()` 方法来设置最小记录级别，这个和后面的Handler级别是协作关系。

### handlers 

处理器负责分发日志信息到目标地去。这里主要介绍这几个Handler类：

- StreamHandler 将信息以流的形式输出，这通常指输出到终端
- FileHandler 将信息写入到某个文件中去
- RotatingFileHandler 将信息写入某个文件，如果文件大小超过某个值，则另外新建一个文件继续写。
- TimeRotatingFileHandler 将信息写入某个文件，每隔一段时间，比如说一天，就会自动再新建一个文件再往里面写。

处理器对象也有 `setLevel` 方法，这个前面也提及了，和记录器的 `setLevel` 是协作关系，更详细的描述是，信息先记录器处理并分发给对应的处理器对象，然后再处理器处理再分发到目的地。

处理器可以挂载 格式器 对象和 过滤器 对象。

- handler.setFormatter()
- handler.addFilter()
- handler.removeFilter()



### filters 

过滤器

### formatters 

格式器，具体信息的格式定义。

### 字典统一配置

django的setting.py就会有这样的配置，具体含义还是很明显的，就是定义处理器，格式器，记录器等。

```
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'simple': {
            'format': "%(asctime)s %(name)s [%(levelname)s] %(thread)d %(module)s %(funcName)s %(lineno)s: %(message)s"
        }
    },
    'handlers': {
        'log_file': {
            'class': 'logging.FileHandler',
            'filename': 'django.log',
            'formatter': 'simple',
            'level': 'DEBUG'
        },
    },
    'loggers': {
        'django': {
            'handlers': ['log_file'],
            'level': 'DEBUG',
            'propagate': True,
        },
    }
}
```


## django的session

cookie-session之间交互的 `session_key` django对应还有一个字段：

```
    session_data = models.TextField(_('session data'))
```

也就是我们在django上接触的session对象就存在这里的。

这个 `session_key` 在django这边如果一开始cookie里面没有则会自动生成。我们知道HTTP协议是无状态的，实际上在引入这样的cookie-session会话机制之后，后续HTTP请求并不能算是无状态的。

一般web服务器的全局变量解决方案也是推荐利用session来完成的，当然本质上仍然是依托数据库来完成的。

cookie-session这一来一回看懂了还不够，关键是还要有这个会话的概念，关键是你的头脑在构想HTTP请求和响应的时候，你要知道这个HTTP请求就好像一个用户自身已经挂载上了用户标识的。

再翻看django源码我们会发现 `AuthenticationMiddleware` 做的一个主要工作就是把 `request.user` 制作好。这个user是调用的auth的backend的认证类的 `get_user(user_id)` 方法来完成的。
而这个user_id：
```
user_id = _get_user_session_key(request)

def _get_user_session_key(request):
    # This value in the session is always serialized to a string, so we need
    # to convert it back to Python whenever we access it.
    return get_user_model()._meta.pk.to_python(request.session[SESSION_KEY])
```
这个 `request.session` 实际上就是对应 `session_data` 的字典表达。 这里面还有点细节问题，但这不是重点。

此外还值得一提的是django的session保存策略和删除策略。django的session并没有删除策略，当用户logout之后django会删除对应的session。django的session_data的保存，推荐修改之后调用：

```
request.session.modified = True
```
更多信息参见官方文档。




## django和celery
本小节主要讲一下celery的基本概念，还有和django的集成问题，更多celery的知识请参阅官方文档，celery的官方文档在 [这里](http://docs.celeryproject.org/en/latest/index.html) 。

首先说一下为什么要使用celery，首先明确任务这个概念，这里讨论的任务是指你的程序主要运行流程中的一些子任务，你的程序主要工作流程中附加的一些子进程或子线程等。比如说Web server的主任务是对HTTP的API请求进行响应，另外一些附加的子进程和子线程都可以叫做子任务，但这里面有些是不需要或者不适合使用celery的，有的子进程或子线程处理的任务本质上仍然是主工作任务的一部分，有的子任务很简单也没必要上celery，有以下应用场景的则推荐使用celery来对这些子任务进行管理：

- 只有那些有特殊调度需求的子任务
- 长时间后台运行的子任务
- 数量很多的子任务


### celery的核心概念

- broker  任务队列服务提供者，celery推荐使用redis或者rabbitmq作为broker。
- task 具体执行的任务，其实就是定义的一些函数。
- backend 用来存储任务之后的输出结果
- worker celery的启动就是开启一个worker。


### django内文件安排
本小节参考了 [这篇文章](https://medium.com/@yehandjoe/celery-4-periodic-task-in-django-9f6b5a8c21c7) 和 [这篇文章](http://geek.csdn.net/news/detail/128791) 。

需要提醒读者的是，django和celery集成现在并不需要额外安装什么插件了，经过下面额外的配置之后其他细节问题都可以参看celery文档了。

首先推荐在你的django `settings.py` 旁新建个 `celeryconfig.py` 文件，有的教程让设置这个配置文件名字为 `celery.py` ，这样很不好，文件名和某个模块名字重复有时会出问题的。里面的内容如下：

```python
import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project_name.settings')

app = Celery('project_name')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()


@app.task(bind=True)
def debug_task(self):
    print('Request: {0!r}'.format(self.request))
```

这个新建的任务不过是方便测试罢了，然后上面几行配置基本上死的。最值得讲的就是这两行：

```
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()
```

第一行是从django的配置对象中读取配置，特别注意的就是那个 `namespace='CELERY'` ，这样只有 `CELERY_` 开头的配置才会读取，而且对应原celery配置的关系是：

```
CELERY_BROKER_URL  -> BROKER_URL
```

我那次就是 `CELERY_BEAT_SCHEDULE` 写成了 `CELERYBEAT_SCHEDULE` 然后发现周期性程序总启动不起来。

第二行也是一个优化细节，从函数名字也可以看到，就是自动发现任务。在你的django的其他app里面新建一个 `tasks.py` ，celery会自动发现你定义的任务。


还是你的django项目的 `settings.py` 那个文件夹里面，`__init__.py` 推荐写上这几行内容：

```
from .celeryconfig import app as celery_app

__all__ = ('celery_app',)
```

### celery配置

具体celery的一些配置就统一写在 `settings.py` 文件里面，上面也提到了，都要 `CELERY_` 开头，大体如下所示：

```
CELERY_BROKER_URL = 'redis://localhost:6379'
# CELERY_RESULT_BACKEND = 'redis://localhost:6379'
# CELERY_ACCEPT_CONTENT = ['application/json']
# CELERY_RESULT_SERIALIZER = 'json'
# CELERY_TASK_SERIALIZER = 'json'
CELERY_TIMEZONE = 'Asia/Shanghai'
# schedules
from celery.schedules import crontab

CELERY_BEAT_SCHEDULE = {
    'every_miniute_for_test': {
        'task': 'apps.workflow.tasks.test_celery',
        'schedule': crontab(),
    },
}

```

### 定义任务
好了，定义任务，实际上就是定义一个函数，比如下面这个简单的打印函数来确认celery周期程序是工作着的：

```
from celery import shared_task

@shared_task()
def test_celery():
    print('celery is working.')
```

celery的crontab功能很强大，比如上面的 `crontab()` 就是每分钟执行一次。具体请参看 [官方文档](http://docs.celeryproject.org/en/latest/userguide/periodic-tasks.html) 。

### 启动任务

和celery其他操作都是一样的，就是启动worker：

```
celery -A project_name worker -l info
```

`-A` 选项跟着 celery app的名字，在这里也就是django项目的名字。 `-l` 选项设置日志打印级别。

你还可以加上 `-B` 来同时启动周期性任务。

或者另外开个命令：

```
celery -A project_name beat -l info
```


#### 手工启动一次任务

参考了 [这个网页](https://stackoverflow.com/questions/12900023/how-can-i-run-a-celery-periodic-task-from-the-shell-manually) 。

```
$ python manage.py shell
>>> from myapp.tasks import my_task
>>> eager_result = my_task.apply()

```




## 部署

这里所谓的部署就是用apache或nginx这样的web服务器来对接django项目，说的再具体一点就把django作为一个wsgi程序服务起来。

本文关于apache的部署讲解较为成熟。

### apache

上例子吧：

```
<IfModule !wsgi_module>
    LoadModule wsgi_module modules/mod_wsgi.so
</IfModule>

WSGIPythonHome "/home/wanze/venv"
WSGIPythonPath "/home/wanze/venv/webapp"

<VirtualHost *:80>
    ServerName api.cdwanze.work
	
    WSGIScriptAlias / /home/wanze/venv/webapp/webapp/wsgi.py
	
    <Directory /home/wanze/venv/webapp >
        <IfVersion >= 2.4>
            Require all granted
        </IfVersion>
        <IfVersion < 2.4>
            Order deny,allow
            Allow from all
        </IfVersion>
    </Directory>

	Alias "/static" "/home/wanze/venv/webapp/static"
    
    <Directory  /home/wanze/venv/webapp/static >
        <IfVersion >= 2.4>
            Require all granted
        </IfVersion>
        <IfVersion < 2.4>
            Order deny,allow
            Allow from all
        </IfVersion>
    </Directory>
    
</VirtualHost>
```

- 首先是检测wsgi模块加载了没有，没有把它加载上。
- WSGIPythonHome 这个设置你的python的虚拟环境的所在目录，比如上面的例子 venv/bin下面就是python可执行脚本。
- WSGIPythonPath 这个设置你的Django项目目录所在
- WSGIScriptAlias 这个设置你的WSGI文件所在
- Alias 和下面Directory 设置是服务你的项目的静态文件的。

### 关于静态文件

关于静态文件再补充下，上面服务的静态文件是在项目目录下的static文件夹下，这里所谓的静态文件主要是djano和djangorestframwork等框架带的静态文件，其通过  `python manage.py collectstatic` 命令来生成这些内容。

你需要在settings那里设置 `STATIC_ROOT` 值。

```
STATIC_ROOT= os.path.join(BASE_DIR, 'static')
```



### 多django站点部署问题

多个django站点都通过 `mod_wsgi` 来部署是不能继续像前面那样写： 

```
WSGIScriptAlias / /path/to/mysite.com/mysite/wsgi.py
WSGIPythonHome /path/to/venv
WSGIPythonPath /path/to/mysite.com
```

而必须每个通过deamon模式来（参考了 [这个网页](https://stackoverflow.com/questions/14923083/multiple-sites-in-django) ）：

```
<VirtualHost *:80>
    ServerName api.cdwanze.work
    WSGIDaemonProcess cdwanze_api  processes=1 python-path=/home/wanze/venv/myapi python-home=/home/wanze/venv/ threads=10	
    WSGIProcessGroup cdwanze_api
    WSGIScriptAlias / /home/wanze/venv/myapi/myapi/wsgi.py process-group=cdwanze_api
    ...
```

其中 `WSGIProcessGroup` 目前来看名字是随意的，但必须写。然后在定义daemon进程的时候 `python-path` 是定义到你的django project那里， `python-home` 是定义到你的python虚拟环境那里。



### 文件权限问题

除了上面设置好 Directory 之外，你可能还会遇到其他某些文件的读写权限问题，在查看日志的时候发现提示说那个文件没有权限读写了。这个时候首先要明确httpd的执行User和Group是谁，然后在看目标文件夹或文件的具体权限。

Django项目的wsgi文件是需要有执行权限的。还有Django项目操纵数据库，比如sqlite3这种文件数据库，你可能也会遇到读写权限问题。

还有值得一提的是如果某个母文件夹没有可执行权限，那么里面的所有文件都是不可见的。

### nginx

nginx要对接wsgi接口需要uwsgi这个模块将wsgi接口服务起来。

```
pip install uwsgi
```

更多细节请参看uwsgi的 [官方文档](http://uwsgi-docs.readthedocs.io/en/latest/tutorials/Django_and_nginx.html) 。

ngnix的配置如下：

```
upstream django {
    server 127.0.0.1:8001; 
}

server {
    location / {
        uwsgi_pass  django;
        include     /path/to/your/mysite/uwsgi_params; 
    }
}
```



#### nginx serve 静态文件

```
server {
    listen      80;
    ......
 
    client_max_body_size 75M;
 
    location /media  {
        alias /path/to/media;
    }
 
    location /static {
        alias /path/to/static;
    }
    
    ......
}
```



更多nginx配置细节请参看我写的关于nginx配置的专门的文章。



### 对外部署必看

django项目如果对外部署的话，因为python是一个动态脚本语言，所以会有很多安全性的问题需要检查，否则你的项目对外会很不安全。本文主要参看官方文档的 [这里](https://docs.djangoproject.com/en/2.0/howto/deployment/checklist/) 。

第一当然首先是确保 `DEBUG=False` ，对外开着 `DEBUG=True` 那简单是开玩笑了。

然后是运行：

```
python manage.py check --deploy
```

#### settings.py 里密钥外置

settings.py 文件里面不要有任何密钥信息，包括 `SECRET_KEY` 你的数据库连接信息或者其他密钥等等，所有这些信息都应该作为环境变量引入或者从某个配置文件中读取出来。

#### ALLOWED_HOSTS

要某是限定好域名，要某是你的nginx服务器那边对入口请求已经做好了限定，凡是不认识的域名HOST请求都抛出444错误：

```
server {
    listen 80 default_server;
    return 444;
}
```




### django的csrf-token机制
django的csrf token机制对于django的学习新手来说还是很头疼的，因为这个时候还没有太多精力去深究这里面的东西，但有时常常对新手的一些测试开发工作造成困扰。

通过debug和简单阅读django的源码之后，下面简单介绍下csrf token的基本作用原理。

其是一个django中间件，每个请求来了都会试着读取cookie里面的csrftoken这个值。

```
Cookie: csrftoken=?????
```

这个只是要在request.META里面装载一个值，对后面的流程没有影响。

具体起作用的是进入每个视图函数之前 `process_view` ，这里面逻辑还有有一些，下面择重点说一下。

如果是GET之类安全的方法会直接放行。

POST方法首先看POST对象带没带csrfmiddlewaretoken这个值，这是走页面表单，那个隐含标签，然后POST过来的时候自带的。

如果没有则可能走AJAX的，会试着读取X-CSRFToken这个HEADER。

综合上面两个总要获取到一个值，这个值要和Cookie里面的csrftoken这个值是对应上的。对应上就通过了，对应不上或者为空则csrf token核对失败。


![img]({static}/images/2023/csrf_token_1.png)



看了一下默认的csrftoken的有效期是一年，因为csrftoken还有同源判断，这可能是django将这个有效期设置得这么长的原因吧。

cookie里面的那个sessionid有效期就短得多了，那个sessionid如果泄露了，黑客就可以让服务器相信这个请求是另外一个人了。当然了django默认的sessionid加密只要不泄露，还是很安全的，你要说黑客已经物理入侵了，那黑客早就已经攻破防线了，而不是django的这个机制不够安全的问题了。JWT等加强版token更安全无非是token有效期时间更短等等。

就我们这种可以打开开发者工具的这种，已经是物理级别的暴露了，任何加密方式，目标请求都是可以伪造出去的。毕竟HTTP协议请求的机制就摆在那里的。




## Deprecate

### 模型python2兼容性

为了提高模型python2兼容性，推荐模型定义上加个如下装饰器。

```
from django.utils.encoding import python_2_unicode_compatible


@python_2_unicode_compatible 
class Question(models.Model):
    # ...
    def __str__(self):
        return self.question_text
```

以前不加这个装饰器，python2之前用的是 `__unicode__` 方法。



### 重置migrations
本小节讨论价值不大，如果你是想清空本数据库的数据，则flush即可。如果你还不满意，那么直接删除整个数据库即可，没必要专门针对某个表格来较劲。

一般的方法把migrations文件删掉，把表格删掉并不能成功，因为他们忽视了django_migrations这个表格里面的数据（参考了 [这个网页](https://stackoverflow.com/questions/23755523/how-to-reset-migrations-in-django-1-7)）。

如果你把 `django_migrations` 里面的对应app的迁移数据删掉，然后再makemigrations和migrate，那么就更重新开始的一样。

```
python manage.py makemigrations app_name
python manage.py migrate app_name
```


### 处理列表对象
不推荐下面的处理方式了，现在一般数据库都支持JSONField，用JSONField存储列表即可，用下面方式还不一定稳定好用。

我们需要自定义一个model的新Field对象来解决这个问题，具体就叫做ListField。

```
def parse_to_python(value):
    try:
        value = ast.literal_eval(value)
        return value
    except Exception as e:
        rasie ValidationError


class ListField(models.TextField):
    """
    存储python列表对象
    """
    description = _("Stores a python list")

    def __init__(self, *args, **kwargs):
        super(ListField, self).__init__(*args, **kwargs)

    def to_python(self, value):
        if value is None:
            value = value

        if isinstance(value, list):
            return value

        return parse_to_python(value)

    def get_prep_value(self, value):
        if value is None:
            return value

        value = six.text_type(value)
        return value

    def value_to_string(self, obj):
        value = self.value_from_object(obj)
        return self.get_prep_value(value)

    def from_db_value(self, value, expression, connection, context):
        if value is None:
            return value

        return parse_to_python(value)

```

- `from_db_value` 当数据从数据库里面读取出来，总会调用这个方法。包括（including in aggregates and [`values()`](https://docs.djangoproject.com/en/1.11/ref/models/querysets/#django.db.models.query.QuerySet.values) calls。 所以这是最重要最核心的一个定制方法，其含义是很明显的，不用多说了。

  ------

这四个方法大体如下流程：

```
python  <- to_python  <-   from_db_value<- database

python ->value_to_string -> get_prep_value -> database

```

**NOTICE** 上图主要是方便读者理解，实际上django并不是这样逐个处理的。按照官方文档的说法 `to_python` 和django的反序列（deserialization ）有关，其还必须处理好三种情况：None，目标对象，字符串情况。

`value_to_string` 和序列化有关，和`to_python` 是相对的。`get_prep_value` 和我们在输入get(what='20170809') 执行查询是有关，讲过其转化成为sql实际查询中用到的字符串（比如说datetimefield）就做了一些额外的处理工作。 



## 附录

### 翻译

django的翻译其实已经很便捷了，因为我关注于后台api的编写，所以实际上很多教程说的：

```
TEMPLATES = [
    {
        ...
        'OPTIONS': {
            'context_processors': [
                ...
                'django.template.context_processors.i18n',
            ],
        },
    },
]
```

这个配置只和模板输出的翻译有关，有需要再加上。

然后MIDDLESWARES 哪里要加上：

```
    'django.middleware.locale.LocaleMiddleware',
```

然后就是这些配置：

```
LANGUAGE_CODE = 'zh-Hans'

USE_I18N = True
```

设置好你的语言代码，这是没有问题的。

我看了一下 django restframework 的翻译管理相关，发现大体这样配置就可以了，很多教程说的设置 `LOCALE_PATHS` 变量觉得没必要，默认的每个app下面的locale文件夹够用了。

然后就是目标py文件下的 字符串 如下装饰之：

```
from django.utils.translation import ugettext_lazy as _
...

        if username is None:
            raise TypeError(_('Users must have a username.'))
```

Model字段定义的名字可以加上，verbose_name 可以加上，然后异常信息可以加上等等。

加完了之后运行：

```
django-admin makemessages -l zh_Hans 
```

app下面没有locale文件夹的创建个就是了，某些文件你不想管，比如 manage.py ，那么加上 `--ignore` 选项即可。

windows下不是很方便，推荐在linux服务器下创建了目标 django.po 文件，然后再修改文件即可。其中po文件的头部有些东西，估计：

```
"Language: zh-Hans\n"
```

已经是必填的，其他有时间也填上吧。

然后运行:

```
django-admin compilemessages 
```

如果不出意外的，翻译就已经生效了。


### 模板层

模板基本的样子如下，下面有模板继承，block ，循环，过滤，之类的。熟悉jinja2模板的同学稍微看下大致是个什么意思就已经清楚了。

```django
{% extends "base_generic.html" %}
{% block title %}{{ section.title }}{% endblock %}
{% block content %}
<h1>{{ section.title }}</h1>
{% for story in story_list %}
<h2>
  <a href="{{ story.get_absolute_url }}">
    {{ story.headline|upper }}
  </a>
</h2>
<p>{{ story.tease|truncatewords:"100" }}</p>
{% endfor %}
{% endblock %}

```

#### django如何查找模板的

在django的settings.py哪里有：

```
PROJECT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

TEMPLATES=[
{
'BACKEND':'django.template.backends.django.DjangoTemplates',
'DIRS':[
os.path.join(PROJECT_DIR,'templates'),
],
```

默认是在每个app下的templates文件里都会递归遍历查找的，这里DIRS加上了另外一个文件夹，也就是现在settings.py所在的那个文件夹下如果有templates文件夹也会去遍历的。



模板文件最后都会合并的，所以就存在模板的覆盖机制了，为了避免无谓的覆盖，一般模板原则上推荐的结构是在templates下面，不管是那个app下面，都再新建一个目标app的名字，再新建模板文件。当然对于稍小的项目直接扔在templates下面问题不大。



比如你想覆盖django自带的admin界面，就要在templates下面新建一个admin文件夹，具体什么模板文件，你要研究下django的源码了。



### 多数据库处理

一个django项目里面可能因为某些原因，某些app需要单独操作另外的数据库，这种情况你首先在 `settings` 那里定义好数据库的配置：

```
    DATABASES = {
        'default': {
			...
        },
        'newdb': {
            'ENGINE': 'django.db.backends.mysql',
			...
        },
```

然后加上这个dbroute对象：

```
DATABASE_ROUTERS = ['articles.dbrouter.ArticlesRouter']
```

然后在你的app那里定义好dbroute对象：

```django
class ArticlesRouter(object):
    def db_for_read(self, model, **hints):
        if model._meta.app_label == 'articles':
            return 'articles'
        return None

    def db_for_write(self, model, **hints):
        if model._meta.app_label == 'articles':
            return 'articles'
        return None

    def allow_relation(self, obj1, obj2, **hints):
        if obj1._meta.app_label == 'articles' or \
            obj2._meta.app_label == 'articles':
            return True
        return None

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        if app_label == 'articles':
            return db == 'articles'
        return None
```

从上面的代码可以看出来，你定义的模型 `Meta` 那里必须定义好 `app_label` 属性。更多信息请参看官方文档的 [这里](https://docs.djangoproject.com/en/1.11/topics/db/multi-db) 。

### 获取模型对应的表格的名字

参看 [这个网页](http://stackoverflow.com/questions/233045/how-to-read-the-database-table-name-of-a-model-instance) 。

答: 

```
model_instance._meta.db_table
```

### 如何使用好django的ImageField

参考了 [这篇文章](http://gregblogs.com/django-saving-an-image-using-imagefield-explain-a-little/) 。

ImageField和FileField很类似，除了还多了 `width` 和 `height` 属性，然后就是在上传的时候确保文件是图片文件。

具体在模型文件中的定义如下:

```
banner = models.ImageField(upload_to=game_2048_images, blank=True,
                           storage=OverwriteStorage(), default="placeholder.jpg")

```

上面的 `upload_to` 是控制图片在计算机中的保存路径，可以直接指定一个文件夹路径，但这通常不够灵活，这里通过一个函数来实现更加灵活的路径指定:

```
def game_2048_images(instance, filename):
    """
    where image upload to.
    """
    return 'game/2048/images/{}/{}'.format(instance.user.username, filename)

```

这里具体路径是根据你在 `settings` 里面指定的 `MEDIA_ROOT` 而来，然后再指定里面的具体的文件夹路径。我们看到函数还可以接受具体模型对应的实例，从而建立自动根据user用户名来分配不同的文件夹路径。

`storage=OverwriteStorage()` 实现了如果文件名重复则覆盖的逻辑:

```
class OverwriteStorage(FileSystemStorage):
    '''
    存储文件或图片，如果文件名重复则覆盖。
    '''

    def get_available_name(self, name):
        if self.exists(name):
            os.remove(os.path.join(settings.MEDIA_ROOT, name))
        return name

```

ImageField 可以和rest\_framework的序列化类形成很好的联动，最后序列化之后返回的是文件路径url字符串，测试的时候我们可以如下用django来挂载这些静态资源文件，实际运营的时候则推荐用nginx怎么设置一下url分发。

```
from django.conf.urls.static import static
from django.conf import settings

if settings.DEBUG:
    urlpatterns += static('/data/', document_root=settings.MEDIA_ROOT)

```

在保存传过来的图片文件的时候，常规构建form对象也是可行的:

```
form = Game2048InfoForm(
    request.POST, request.FILES, instance=target_info)

if form.is_valid():
    new_game_info = form.save()
else:
    logger.warning('form invalid')

```

否则你需要通过:

```
request.FILES['imgfield']

```

这样的语法来获取图片内容。

### django的messages系统

本小节主要参看了 [这个网页](https://www.webforefront.com/django/setupdjangomessages.html) 。

使用django的messages系统，首先需要如下所示在settings里面进行一些配置：

```
INSTALLED_APPS = [
    'django.contrib.messages',
    ......

MIDDLEWARE_CLASSES = [
    'django.contrib.messages.middleware.MessageMiddleware',
    ......

TEMPLATES = [
    {
         'OPTIONS': {
            'context_processors': [
                'django.contrib.messages.context_processors.messages',
                ......

```

然后在views那边，使用 `messages.add_message()` 来往django信息系统里面发送一个信息，此外还有如下的这些快捷方法：

- messages.debug()
- messages.info()
- messages.success()
- messages.warning()
- messages.error()

你还可以如下设置每个request请求下的信息系统级别：

```
from django.contrib import messages
messages.set_level(request, messages.DEBUG)

```

下面我定义了一个简单的flash函数

```python
def flash(request, title, text, level='info'):
    """
    利用django的message系统发送一个信息，对接模板的sweetalert。
    """
    level_map = {
        'info': messages.INFO,
        'debug': messages.DEBUG,
        'success': messages.SUCCESS,
        'warning': messages.WARNING,
        'error': messages.ERROR
        }

    level = level_map[level]

    messages.add_message(request, level, text, extra_tags=title)
    return 'ok'
```

之所以做这样的封装是为了更好地对接sweetalert这个javascript库，然后模块加入如下内容从而从而实现信息的具体弹出行为。

```
{% if messages %}
<script src="{% static 'js/sweetalert.min.js' %}"></script>
<script>
{% for msg in messages %}
    sweetAlert({
        title: '{{msg.extra_args}}',
        text: '{{ msg.message }}',
        type: '{{ msg.level_tag }}',
      })
{% endfor %}
</script>
{% endif %}
```

### csrf认证失败

一般提到的表单那边加上：

```
<form method="post">{% csrf_token %}
```

但后来我还是遇到csrf认证失败问题，最后参考 [这个问题的答案](https://stackoverflow.com/questions/38841109/csrf-validation-does-not-work-on-django-using-https) 如下设置才可以。

```
CSRF_TRUSTED_ORIGINS = ['www.cdwanze.work']
```
### 创建可复用的app

创建可复用的app会极大的降低你的目标django项目的复杂度，如果可能，将你的app打造成可复用的风格总是首选。

#### 制作django-what的pypi包

有关pypi包的制作就不赘述了，下面主要在官方文档 [这里](https://docs.djangoproject.com/en/1.11/intro/reusable-apps/) 的基础上讨论一些问题。

#### 测试问题

我试着如下安装测试过程：

```
python setup.py sdist
pip install dist/what.tar.gz
```

然后安装官方文档，在INSTALL_APPS那里设置好。app是可以正常使用的。但在安装测试过程中，这实在有点繁琐了。推荐还是将整个app文件夹复制到你的测试webapp那边去，然后一边修改一边看。测试好了再把内容同步到pypi安装包那边去。

#### migrations问题

官方文档之所以选择制作sdist和用pip install tar包这种风格是有原因的，经测试egg包在访问上很成问题，只有用pip安装这种方法，在site-packages那边你安装才是文件夹风格而不是那种egg文件。这样你等下执行：

```
python manage.py makemigrations app_name
```

才会成功。

而且实际生成的迁移文件就放在site-packages那里的目标文件夹下的。所以你制作pypi包的时候不要把migrations文件夹里面的其他迁移文件包含进去了，要包含就包含 `__init__.py` 文件即可。

当然就算你不是制作django的目标pypi包，其他django项目在 `.gitignore` 文件上加上这一行总是不错的：

```
*/migrations/*
```

PS: 我知道stackoverflow那边都认为应该加上，还有人专门写了长篇大论认为应该加上。我确定的只有一点：早期测试开发过程，所有的migrations文件夹里面都只有 `__init__.py` 这个空白文件，保持代码整洁，在测试开发阶段不花精力在这上面，这是没有争议的。


### mysql数据库配置参考
如果读者想使用mysql数据库，那么下面的配置可作参考：

```
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.mysql',
            'NAME': "database_name",
            'USER': "root",
            'PASSWORD': "",
            'HOST': "localhost", 
            'PORT': "3306",
            'OPTIONS': {
                'charset': 'utf8'
            }
        }
    }
```

一般会加上 charset 是 utf8这个选项，当然mysql那边你也需要设置好字符编码。有的时候如下设置init_command 来设置字符编码可以让你获得更好的字符编码兼容性。

```
    'OPTIONS': {
        'init_command': 'SET character_set_database=utf8 ,\
        character_set_server=utf8,\
        character_set_connection=utf8,\
        collation_connection=utf8_unicode_ci',
        'charset': 'utf8'
    }
```



### 使用多个数据库

有的时候你需要使用多个数据库，最常见的情况是某个单独的app使用另外一个数据库。

首先你需要再加上另外一个数据库的定义：

```
    DATABASES = {
        'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': "database_name",
        'USER': "root",
        'PASSWORD': "",
        'HOST': "localhost",
        'PORT': "3306",
        'OPTIONS': {
            'charset': 'utf8'
            }
        },
        'youapp': {
            'ENGINE': 'django.db.backends.mysql',
            'NAME': 'youapp',
            'USER': 'root',
            'PASSWORD': '',
            'HOST': '',
            'PORT': '',
            'OPTIONS': {'charset': 'utf8'}
        },
    }
```

然后在你的app那边新建一个dbrouter文件，里面定义一个YourRouter类。

```
DATABASE_ROUTERS = ['youapp.dbrouter.YourRouter']
```

在这个类里面如下定义一些数据库选择行为：

**NOTICE: 在这个app中定义的模型记得都要加上app_label这个meta属性。**

```
class YourRouter(object):
    def db_for_read(self, model, **hints):
        if model._meta.app_label == 'youapp':
            return 'youapp'
        return None

    def db_for_write(self, model, **hints):
        if model._meta.app_label == 'youapp':
            return 'youapp'
        return None

    def allow_relation(self, obj1, obj2, **hints):
        if obj1._meta.app_label == 'youapp' or \
            obj2._meta.app_label == 'youapp':
            return True
        return None

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        if app_label == 'youapp':
            return db == 'youapp'
        return None
```


### 模型层实战

#### 扩展用户模型
本小节主要参考了这篇 [不错的文章](https://simpleisbetterthancomplex.com/tutorial/2016/07/22/how-to-extend-django-user-model.html) 。

一般扩展django自带的用户模型，最常见的就下面两种情况【实际上下面讨论的两种情况你可能都会用到】：

##### User和Profile
你对django原有的用户登录机制，也就是基于session和cookies那一套是满意的，但是觉得django原有的User里面用户的信息太少了不是很满意。那么可以新建一个Profile模型，然后将User和Profile建立onetoone关系。User那边是django原有的登录相关的东西，Profile这边是存放着更多的用户资料信息。一般在代码实践上会采用如下的信号机制：


```python
from django.db.models.signals import post_save
from django.dispatch import receiver

from apps.profiles.models import Profile

from .models import User

@receiver(post_save, sender=User)
def create_related_profile(sender, instance, created, *args, **kwargs):
    # Notice that we're checking for `created` here. We only want to do this
    # the first time the `User` instance is created. If the save that caused
    # this signal to be run was an update action, we know the user already
    # has a profile.
    if instance and created:
        instance.profile = Profile.objects.create(user=instance)
```

从而保证每新建一个User就会新建一个对应的Profile记录。用户删除没必要删除记录，更改 `is_active` 布尔值即可。

##### 自定义User模型
你可能对django默认的auth机制，也就是基于session cookies的那套认证不太满意，那么你干脆直接建立自己的User模型，一般推荐还是继承自 `AbstractBaseUser` ， `AbstractBaseUser`里面做的很多工作都是和password这个字段相关的，一般来说django实现的这部分密码处理的代码就真的没必要自己去实现了。

然后你需要在settings里面定义好:

```
AUTH_USER_MODEL = 'app_user.User'
```

指向你刚自定义的模型类。

继承之后一般还推荐继承 `PermissionsMixin` 这个类。关于这块下面还会简单讨论点，但既然都自定义用户模型了，还是推荐参看django的源码，就是 `django.contrib.auth` 应用。

这三个字段属性有特殊含义，都是可以自己设置的：

```
    USERNAME_FIELD = 'username'
    EMAIL_FIELD = 'email'
    REQUIRED_FIELDS = ['email']
```

然后你需要写好 objects 这个 UserManager ，其继承自 `BaseUserManager` ，你可以做其他一些定制，这个对应的就是之前我们看到的 `Model.objects.what` 之类的这种用法。在这里你需要根据自己的情况定义好： 

- create_user
- create_superuser

##### 其他内容
- REQUIRED_FIELDS 对django没有什么影响，唯一的影响就是createsuperuser的时候会弹出该字段的输入提示，一般没有设置 `blank = True` 的字段都可以加到该字段里面。

- EMAIL_FIELD 影响 `get_email_field_name` 方法

- USERNAME_FIELD ModelBackend的authenticate方法默认会先试着用 username+passworld来进行，如果你指定其他字段，则会试着从那个字段+passworld的方式来进行认证。




### 自定义身份认证
写自己的身份认证类，继承自 `BaseAuthentication` ，然后重写 `authenticate(self, request)` 方法，认证成功则返回 `(user, auth)` ，否则返回None。request.user 是当前登录的用户实例， request.auth 是当前登录auth的信息。

某些情况下身份认证失败你可能想要抛出 `AuthenticationFailed` 异常。



### 自定义权限管理类

自定义权限管理类，继承自 `BasePermission` ，然后实现下面一个两个方法：

- has_permission(self, request, view)
- has_object_permission(self, request, view, obj)

如果请求被授予权限，则返回True，如果没有权限则返回False。

自定义权限管理类还可以加上 `message` 属性，用户权限没通过抛出 `PermissionDenied` 异常的额外显示信息。

## pycharm配置django环境
pycharm下面的python console配置好django环境，其他独立的python脚本也是类似的配置：

1. 配置环境变量： `DJANGO_SETTINGS_MODULE=what.settings`
2. 加上这样两句：

```
import django
django.setup()
```