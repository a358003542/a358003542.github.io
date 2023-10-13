Slug: django
Date: 20190405

[TOC]




## Beginning
### 安装django
django是一个python模块，所以首先请确认自己配置好了python环境，最好是python虚拟环境，这一块我就不赘述了。

### 新建项目
通过以下命令新建一个django项目

```
django-admin startproject project-name
```
不过一般这个时候我们已经把项目文件夹和python环境配置好了，所以这个时候用如下命令就在当前文件夹创建个人认为会更好一些：

```
django-admin startproject project-name .
```

你会看到在当前文件夹下面多了一个 `manage.py` 文件。然后多了一个你项目名字的文件夹，里面有：

- settings.py 这是配置文件
- urls.py 这是URL声明
- wsgi.py 这是WSGI入口
- asgi.py 这个以前没有，我简单了解了一下，是从django3开始加入进来了，提供了ASGI入口。如果读者熟悉python的asyncio模块的话，那么这里简单说明一下就是django从version3开始支持异步了读者大概就明白了，更多细节后面再讨论。

### 运行项目

```
python manage.py runserver localhost:8080
```

后面控制服务器监听的localhost或者外网0.0.0.0，然后就是端口号。

默认项目采用的是sqlite数据库，暂时先这么用着。

### 新建一个应用

```
python manage.py startapp app_name
```

这里顺便说一下，有一些项目你可能找不到 manager.py 这个文件了，其实这个文件就是一个便捷入口罢了，所有的命令一样都可以通过 django-admin 命令来运行的。

新建的应用里面有：

- migrations 和数据库迁移相关
- admin.py admin页面相关
- apps.py 应用的配置
- models.py MVC框架模式的模型层代码
- tests.py 测试代码
- views.py MVC框架模式的视图层代码

上面的MVC框架模式指的是MVC应用程序会分成三个组件：模型、视图和控制器。这种设计理念最早是源于桌面应用程序，而后为各个Web应用程序所继承。

### 总览
如果读者熟悉flask框架或者其他Web应用框架，那么对django具体做了一些什么事情是不会感到陌生的，而这里继续往下面讨论的话，对python的Web应用框架该做一些什么事情进行一些总览的讨论是很有裨益的。

HTTP请求包到了你的服务器，一般会有一个nginx或者apache的Web服务器，其会分析你的HTTP请求包里面的URL，具体到Web服务器这边了主要是分析URL里面的path参数，然后根据path参数来决定不同的行为。比如说很多静态图片HTTP请求一边是不会到django那边去的，这些静态内容的URL请求会直接由nginx或者apache来返回HTTP响应包。

还有一部分URL里面的path在Web服务器那边是定义为由某个WSGI服务接管的，对于这些URL的HTTP请求，Web服务器只是起到代理性质，将该请求传递给WSGI服务即可，这里所说的WSGI服务就是django提供的。这部分URL又会分成很多不同的类型，在代码上的表现就是通过编写urls.py这个文件来实现URL的进一步分发，分发过来的HTTP请求包会继续往下面传递，这里HTTP请求包当然早就不是原生的文本格式了，而是方便程序员开发应用程序进行了很多友好的封装。分发过去的HTTP请求包会继续分发到视图层也就是views.py这个文件里面的某个视图函数上，具体HTTP响应包的内容就是由这个视图函数决定。

基本上这就是最简单的WSGI应用的工作流程了，至于网页内容的模板引擎生成，后台数据处理上的ORM模型设计等那就是后续扩展内容了。所以下面先着重讨论url分发和视图层这两块内容，然后就其他扩展内容进行讨论。



## url分发
django的项目模板生成功能已经创建了一个 `urls.py` 文件，django是希望程序员们将django项目的所有应用的url分发工作都几种放在这里管理，那我们就顺势而为吧。

其默认的内容如下:

```python
from django.contrib import admin
from django.urls import path

urlpatterns = [
    path('admin/', admin.site.urls),
]
```

下面我们要实现Web应用程序的HelloWorld，也就是根URL在网页上显示文本内容HelloWorld。

读者请看下面代码：

```
from urllib.parse import urlsplit
url = 'https://docs.djangoproject.com/zh-hans/4.0/ref/urls/#django.urls.path'
urlsplit(url)
SplitResult(scheme='https', netloc='docs.djangoproject.com', path='/zh-hans/4.0/ref/urls/', query='', fragment='django.urls.path')
```

一般我们说URL里面的path就是指的那部分，所以根URL的path为空字符串。


```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('app_test.urls')),
]
```
然后在 app_test 应用下新增 `urls.py` 文件，内容如下：

```python
from django.urls import path
from .views import index

urlpatterns = [
    path('', index, name='index'),
]
```

视图函数index内容如下：

```
from django.http import HttpResponse


def index(request):
    return HttpResponse('HelloWorld')
```

解释：
- path的用法是 `path(route, view, kwargs=None, name=None)` 意思是那个path分发给那个视图函数，这个path分发的名字叫什么。
- include 总django项目的`urls.py` 是不方便引入各个视图函数的，通过include可以将各个子应用的url分发模式给引入进来。django引入include的意思是path分发之后截断，然后剩余的path字符串再分发给子应用的urls.py里面定义的url分发机制。
- 视图函数不是这里的讨论重点，简单了解下即可，我们知道HTTP响应也是有规定格式的，django提供了便捷的 `HttpResponse` 类来封装出HTTP响应信息。更多信息请参见下一章关于视图层的讨论。



### url上带参数
即使是这种情况也是推荐使用path而不是 `re_path` ，


```python
from django.urls import path

from . import views

urlpatterns = [
    path('add/<int:a>/<int:b>', views.add, name='add'),
]
```
url上的参数经过处理后将作为可选参数传递给视图函数，即： `add(request, a=1, b=2)` 。

- <username> 默认是字符串




### url定义name

`name` 这个参量大体类似于flask的 `endpoint` 的概念，然后django还有的 `reverse` 函数，其大体类似于flask的 `url_for` 的概念。

比如上面视图函数的 add 对应的url我们可以如下获得:

```
from django.core.urlresolvers import reverse
reverse('add',args=(1,2))
```

然后在模板中有:

```
<a href="{% url 'add' 1 2 %}">link</a>
```

上面提到的reverse函数返回的url字符串还不是完整的url，而只是相对url。如果我们要获取全站的完整url则可以使用 `request.build_absolute_uri(location)` ，如果不指定location则默认是当前的url。



## 应用配置
原则上django的应用和项目是可以分离的，安装是非常灵活的。 `INSTALLED_APPS` 的目的是查找目标应用的 `apps.py` 里面的 `AppConfig` 子类，然后根据这个对象来获得目标应用的一些配置信息。比如 `name` 就是具体该应用的指向地。

关于上面的讨论如果只是默认的写法可能会不太注意，但如果稍微调整下django项目的文件夹结构，则可能会出问题，所以下面我再详细说明下。

以下面的文件夹结构来举例：
```
--apps
    --app_user
    --

manage.py    
```

`INSTALLED_APPS` 要引入应用 app_user 是：

```
INSTALLED_APPS = [
    'apps.app_user',
]
```
一般会在app_user里面新建一个 `apps.py` 文件，里面有内容：

```
from django.apps import AppConfig


class AppUserConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.app_user'
```

**注意：** AppConfig的name属性并不是简单的名字那么简单，其有特殊含义：代表指向该应用的完整python引入路径。也就是你在当前项目根目录下运行： `import apps.app_user` 是可行的。

默认是 `DEFAULT_AUTO_FIELD` 配置的，通过 `default_auto_field` 可以配置本应用的隐式主键类型。


### ready方法
可以通过重写 `ready` 方法，来初始化本app的一些信号配置。

关于信号这块在信号那一小节集中讨论。

### app_label
默认是 name的最后一段内容，这个app_label参数还是很重要的，比如引用外键，第一段就是app_label，第二个就是模型的名字。比如 `user.has_perm` 方法接受的参数第一段就是app_label，第二段是权限的code name。


## 模型层
模型层的代码是放在models.py这个文件里面的，模型层本章内容会特别的多，初学者不可能一下就掌握的，慢慢摸索和学习。

### 数据库的配置
数据库的配置主要是settings.py的 **DATABASES** 哪里。默认配置是：

```
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
```

前面随便用下sqlite问题不大，但既然到这里开始认真讨论模型层和数据库相关了，那么推荐使用更正式的postgresql或者mysql会更合适些。

下载binaries版postgresql，然后运行：
```
source/pgsql/bin/initdb -D ./pgdata -U postgres -W -E UTF8 -A scram-sha-256
```

然后运行：
```
source/pgsql/bin/pg_ctl -D ./pgdata -l logfile start
```

启动postgresql server服务。然后双击pgadmin4.exe程序。

利用pgadmin4新建一个用户 `django_test` ，添加密码，增加Can Login 和 Create database权限。

然后利用pgadmin4新建一个 `django_test` 数据库，更改用户所有者为 `django_test` 。



然后配置更改如下：
```
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'django_test',
        'USER': 'django_test',
        'PASSWORD': 'django_test',
        'HOST': 'localhost',
        'PORT': '5432'
    }
}
```

**然后注意正确设置好配置的 TIME_ZONE ** 。

然后注意设置好 **INSTALLED_APPS** ，里面有你所有的app的名字，没有加进去的应用是没有进入django的数据库迁移管理的。

### 数据库迁移
刚开始模型定义没有发生变动，则运行：

```
python manage.py migrate
```
应用数据库迁移操作即可。如果后面有应用模型定义发生了变动，则需要执行：

```
python manage.py makemigrations

python manage.py migrate
```

### 定义模型
本小节只是讨论django的ORM模型的定义语法细节，对SQL数据库相关知识不作讨论。

我们看到下面这个例子：
```python
from django.db import models

class Question(models.Model):
    question_text = models.CharField(max_length=200)
    pub_date = models.DateTimeField('date published')
```

现在请读者将这个模型添加到你的应用的models.py文件里面，然后将目标应用添加到 `INSTALLED_APPS` 里面。然后执行数据库迁移操作。然后请读者打开pgadmin然后继续下面的讨论。

django所有的ORM模型都要继承自 `Model` 类，再看到Question这个类，我们可以看到新建了一个表格 `app_test_question` ，这个表格的名字后半部分就是根据这个类的名字来的。再继续看表格里面的信息。有主键id，有question_test字段，其实变长字符串类型，最大长度200。然后后面还有一个字段pub_date，其是timestamp字段，在postgresql那边，其会接受python的datetime对象，会进行一些额外的数据处理再填入SQL字段。

#### 字段类型

##### 数值
- IntegerField 整型
- BigIntegerField 大整数

##### 布尔
BooleanField bool 值

##### 字符
- CharField 定义字符串类型，需要设置最大长度 `max_length` 这个属性。

- TextField 大段文字用这个。

##### 日期时间

- DateField 对应python中的 `datetime.date` 对象。
- DateTimeField 对应python中的 `datetime.datetime` 对象。

- **BinaryField:** raw data





#### 字段可选参数
##### verbose_name
一般字段的第一个参数人们会写上一个字符串，比如：

```
username = models.CharField('username', max_length=150)
```
这个第一个参数其实是在设置 `verbose_name` 这个参数。这个叫做该字段的备注名，不一定要设置的和字段名一样的，具体该字段在数据库那边对应的名字由 `db_column` 设置，如果没指定，则基于这个字段名自动生成，总之，这个字段备用名和数据库那边的字段具体的名字完全没有关系的。

ForeignKey, ManyToManyField 和 OneToOneField 接受的第一个参数必须是对应的模型的类名，如果要设置字段备注名，则后面加上 `verbose_name` 参数进行设置即可。

##### default
设置该字段的默认值，注意default还可以接受一个函数对象。

##### null
设置为True，则该自动会自动填充sql中的NULL值。一般字符串类型字段是推荐设置默认为空空字符串，但也只是一个建议。然后如果一个CharField设置了 `unique=True` 和 `black=True` ，则这个时候是一定要设置 `null=True` 的，因为存储多个空白值会违反唯一性约束。

##### blank
如果设置为True，则该字段是允许为空的，其和null的区别是null是说数据库那边的可以设置为NULL，而blank是说显示的验证环节可以允许为空。

##### db_column
设置该字段具体在数据库中对应的名字。

##### db_index
设置为 `True` 则表示该字段开启索引。

##### unique
字段唯一约束

##### choices 
choices的变动就会创建一个新的数据库迁移，因此choices应用情景只是某些固定的选项的情况。

```
YEAR_IN_SCHOOL_CHOICES = [
    (FRESHMAN, 'Freshman'),
    (SOPHOMORE, 'Sophomore'),
    (JUNIOR, 'Junior'),
    (SENIOR, 'Senior'),
    (GRADUATE, 'Graduate'),
]
year_in_school = models.CharField(
    max_length=2,
    choices=YEAR_IN_SCHOOL_CHOICES,
    default=FRESHMAN,
)
```

choices的第一个值是实际存储到数据库里面的值，第二个值是用于表单显示的值。

##### help_text
关于该字段的额外帮助信息，这个在admin页面是可以看到具体该字段的提示文本的。


##### unique_for_date
比如title字段设置:

```
    unique_for_date="pub_date"
```

则 title字段和 pub_date 字段都不能相同。也就是在某个日期内某个title只能有唯一值。可以看作一种 `unique_together` 的应用。


#### 元类数据

```
    ...
    class Meta:
        db_table = 'table_name'

```

- db_table 具体指定实际创建的table表格的名字。
- abstract 将不会创建表格，该模型为抽象模型。

#### 模型基类
```python
class BaseModel(models.Model):
    class Meta:
        abstract = True

    updated_at= models.DateTimeField(auto_now=True)
    created_at= models.DateTimeField(auto_now_add=True)
```

后面的模型都可以继承自该基类，基类是不会创建表格的，因为其Meta设置了 `abstract=True` 。DateTimeField加上 `auto_now=True` ，那么该模型每次 `save` 操作都会自动更新最新日期。 然后 `auto_now_add=True` 即该记录第一次创建时设置最新的日期。

如果DateTimeField使用了 auto_now 或者 auto_now_add 这两个选项了就不要使用default选项了，还有就是自动插入的默认的时间是由 `django.utils.timezone.now()` 获得的。

比如后面你想获得六个小时之前的所有记录那么可以如下查询：

```
    checktime = timezone.now() - timedelta(hours=6)
    result = result.exclude(created_at__gt= checktime)
```


#### ORM关系
一般来说ORM关系有四种，多对一，多对多，一对一，一对多。其中django只需要实现多对一，反向查询就自动实现了一对多关系。

##### 一对一关系
用 **OneToOneField** 来实现两个模型之间某两个字段的一对一关系。

##### 多对一关系
**ForeignKey:** 外键引用，如果该字段的名字是user，那么实际存储在表格中的名字是user_id，你可以通过 `db_column` 来实际控制该表格的名字。- 

我们通常说的onetomany关系就是通过定义ForeignKey来获得的。比如：

```
class City(models.Model):
     name = models.CharField(max_length=60)
     state = models.CharField(max_length=40)
     zipcode = models.IntegerField()

class Address(models.Model):
     number = models.IntegerField()
     street = models.CharField(max_length=100)
     city = models.ForeignKey(City)

```

一个city有多个address，但是一个address只能有一个city，也就是一个外键映射到city那边。所以我觉得ForeignKey更确切的表示是manytoone关系，当某个模型有一个外键属性是，也就是可以有多个记录指向同一个它物 [参阅了这篇文章](https://chrisbartos.com/articles/how-to-implement-one-to-many-relationship-in-django/)。

##### 多对多关系
用 **ManyToManyField** 来实现多对多关系。

读者请参阅我写的 [sqlalchemy模块](https://a358003542.github.io/articles/sqlalchemy-module.html) 一文， 那里写得比较详细。


#### 多字段组合唯一

参考了 [这个网页](https://stackoverflow.com/questions/28712848/composite-primary-key-in-django) ，具体就是在 `Meta`  那里定义 `unique_together` 属性。

```
    ...
    title = models.CharField(max_length=255)
    gzh_id = models.CharField(max_length=255, null=True, blank=True)
    ...
   class Meta:
        db_table = 'article'
        unique_together = ("title","gzh_id")

```


#### 自动设置主键
如果你定义的模型里面没有字段给定选项 `primary_key=True` ，也就是你的模型里面没有主键字段，则django会自动为你的模型创建一个名叫 `id` 的字段。如果该模型所在的应用里面没有设置 `AppConfig.default_auto_field` ，则id字段的字段类型由 `DEFUALT_AUTO_FIELD` 全局配置指定，默认是：

```
DEFAULT_AUTO_FIELD = 'django.db.models.AutoField'
```

如果你的应用配置指定了该值，比如：
```
    default_auto_field = 'django.db.models.BigAutoField'
```
则id字段类型为你指定的值。


### 模型的使用

模型的使用最核心的部分就是查询操作，至于修改记录，则具体查询获得目标记录了，修改属性然后save即可。

#### 新建记录

```
from people.models import Person
Person.objects.create(name="WeizhongTu", age=24)

```

但是要注意如果你插入一条记录出现主键重复问题了，那么程序是会返回异常的。一般推荐使用 `get_or_create` 方法：

```
obj, created = Person.objects.get_or_create(first_name='John', last_name='Lennon',
                  defaults={'birthday': date(1940, 10, 9)})

```

上面这个语句有查询的效果也有新建记录的效果。写的这些属性首先将进行get操作，大体是如下的加强版：

```
try:
    obj = Person.objects.get(first_name='John', last_name='Lennon')
except Person.DoesNotExist:
    obj = Person(first_name='John', last_name='Lennon', birthday=date(1940, 10, 9))
    obj.save()

```

而如果单纯使用get方法，如果记录不存在那么会抛出 **DoesNotExist** 异常；如果找到多个记录，会抛出 **MultipleObjectsReturned ** 异常。 get_or_created 方法如果找到多个记录也会抛出  **MultipleObjectsReturned ** 异常。

这样 `get_or_created ` 方法将确保总是插入一条记录或者取得记录。其中created=True则表明target是新建的记录。

然后是如何理解 defaults 这样选项，defaults里面定义的属性不会参与get查询过程，其参与的是在没有找到记录的情况下，设置某些值。

#### 查询记录

首先说一下获取所有的记录：

```
result = Person.objects.all()

```

其返回的是 QuerySet 对象，QuerySet对象可以继续进行下一步的查询操作。比如下面可以继续：

```
result = result.filter(name="abc")

```

当然就上面的例子来说直接使用filter方法即可：

```
result = Person.objects.filter(name="abc")

```


#### select_related
```
queryset = Organization.objects.select_related('user')
```
返回一个 QuerySet，它将跟随外键关系，在执行查询时选择额外的相关对象数据。这是一个性能提升器，它导致一个更复杂的单一查询，但意味着以后使用外键关系将不需要数据库查询。

官方文档就是上面这句话，个人不是特别理解。

#### 查询外键关联表格属性
Entry和Blog是manytoone干系，下面根据外键关联的表格的某个字段属性执行查询[过滤]操作。
```
Entry.objects.filter(blog__name='Beatles Blog')
```

#### 排序

QuerySet对象可以进一步排序：

```
result = result.order_by('what')

```

#### reverse

```
result = result.reverse()

```

#### exclude

排除某些记录，下面是排除created_at这个字段值大于某个时间的值：

```
result = result.exclude(created_at__gt= checktime)

```

#### offset and limit

```
result = result[offset: offset+limit]

```



#### 删除某个记录

找到目标记录的instance，然后调用 `delete` 方法即可。

#### 确定某记录是否存在

前面已经谈到了一些查询操作，而如果读者只是单纯的想确定某记录是否存在，那么使用 `exists` 方法是最快和最简便的。参考了 [这个网页](https://stackoverflow.com/questions/2690521/django-check-for-any-exists-for-a-query) 。



```
if Article.objects.filter(unique_id= unique_id).exists():
    ...

```

#### 关系的使用
manytoone关系请参看官方文档的 [这里](https://docs.djangoproject.com/zh-hans/4.0/topics/db/examples/many_to_one/)。

ManytoOne关系也就是由 ForeignKey 定义的关系，如果是引用外键的那个对象，那么直接 `a.b` 即可，如果是反向onetomany那种，则最好你在定义的时候就定义好 `related_name` ，（参考了 [这个问题](https://stackoverflow.com/questions/19799955/django-get-the-set-of-objects-from-many-to-one-relationship) ）那么引用如下：

```
b.related_name
```

OnetoOne关系的使用非常简单， `a.b` 或者 `b.a` 都是可以的。

#### 从数据库刷新对象
可以通过调用模型实例的 `refresh_from_db` 方法来从数据库中更新数据：

```python
def test_update_result(self):
    obj = MyModel.objects.create(val=1)
    MyModel.objects.filter(pk=obj.pk).update(val=F('val') + 1)
    # At this point obj.val is still 1, but the value in the database
    # was updated to 2. The object's updated value needs to be reloaded
    # from the database.
    obj.refresh_from_db()
    self.assertEqual(obj.val, 2)
```

#### queryset的update方法
queryset的update方法应该是对应SQL语句的UPDATE语句：

如果只是更新一个记录的某个字段并不需要其他操作的模型层代码最好是如下写：
```
Entry.objects.filter(id=10).update(comments_on=False)
```
而不是这样写：
```
e = Entry.objects.get(id=10)
e.comments_on = False
e.save()
```

直接用update方法会更高效一些，但是效率固然是一方面，也要记住你的post_save，pre_save信号是依赖save方法的调用的，如果你的模型有这方面信号依赖，那么要慎重改动。此外还有如果你的程序逻辑对save方法进行了重载并加入了一些额外的逻辑，那么也要慎重改动。

#### 更多的自定义方法
模型类类似python的其他类一样可以加入更多的自定义方法，这些方法的作用对象是本模型实例。而模型管理类则是不能直接获取到模型实例的，需要查询动作。

#### 原生SQL语句查询
```
Manager.raw(raw_query, params=(), translations=None)
```

#### 模型的继承
1. 利用抽象基类来实现模型的继承，来避免模型字段的重复输入。抽象基类被继承时其Meta定义的属性也会被合理有选择性地继承。

2. 多表继承

3. 代理模型，不修改数据库字段相关信息，只是在修改python面对模型层数据的行为。

```
rom django.db import models

class Person(models.Model):
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)

class MyPerson(Person):
    class Meta:
        proxy = True

    def do_something(self):
        # ...
        pass
```
代理模型和原模型都是在操作同一个数据库表格。可以通过代理模型来定义另外一种排序方法。


#### 两个模型实例的==比较
比较的是pk主键值。

#### create方法
```python
def create(self,**kwargs):
    obj=self.model(**kwargs)
    self._for_write=True
    obj.save(force_insert=True,using=self.db)
    return obj
```
django的queryset的create方法最后也会调用实例的save方法。

### 跨关系查询
Entry manytoone blog

可以如下用双下划线来实现跨关系查询，django在幕后自动处理SQL的join关系。
```
Entry.objects.filter(blog__name='Beatles Blog')
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


## 视图层
视图层的代码是放在views.py这个文件里面的。因为本文会更加关注于Restful风格的后台API的编写，所以对于django视图层这块的讨论基本上略过了。


## API设计
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





## django rest framework

### APIView
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

#### Request对象
APIView视图类下面定义get，post等方法，默认第一个参数是request参数，即Request对象，这个对象有：

- query_params 其对应的是URL参数上解析获得的参数，一般情况是GET方法的URL上的参数，但其他方法也可能会有。

- data 其对应的是HTTP请求体BODY部分的解析内容，对于Restful风格API来说，一种常见的情况就是POST，PUT上传递过来的json字典值。而更厉害的是对于传过来的文件，表单其都有不错的支持。

- user 如果请求经过认证了会返回相应的用户记录，你编写auth类的时候会知道的，如果没有认证，那么返回 `AnonymousUser`



#### Response对象
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



### 序列化
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
#### Serializer类
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

#### ModelSerializer
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

#### 查看ModelSerializer默认配置
python manage.py shell

```
from myapp.serializers import AccountSerializer
serializer = AccountSerializer()
print(repr(serializer))
```

#### source参数
source对于字段的一般含义如下所示：
```
    if self.source is None:
        self.source = field_name
```

 默认为None，然后赋值为字段名。扩展的用法如下：

 1. `URLField(source='get_absolute_url')` 根据序列化类的方法来获得值
 2. `EmailField(source='user.email')` 通过关系字段获得扩展属性，注意如果关系字段为NULL则会报错，最好设置下default值。

#### partial参数
默认序列化类需要传入所有required字段数据，否则将抛出验证异常，可以传入 `partial=True` 来允许部分更新。


#### is_valid 方法
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

#### read_only和write_only
序列化类的某个字段设置为 `read_only` 则该字段不会进入 read 和 update 方法的 `validated_data` 参数，但可以用于 `.data` 的序列化展示数据。

如果某个字段设置为 `write_only` ，则该字段不会 `.data` 的序列化数据展示，但会进入 read 和 update 方法的 `validated_data` 参数中。

#### SerializerMethodField
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

#### 在序列化类里面引用request.user

参考了 [这个问题](https://stackoverflow.com/questions/30203652/how-to-get-request-user-in-django-rest-framework-serializer) ，在序列化类里面需要通过 `self.context['request']` 来获取 request 对象，进而获取 user对象。

```
user =  self.context['request'].user

```

### 渲染器
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

### JWT认证
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

#### refresh token
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




### 自定义身份认证
写自己的身份认证类，继承自 `BaseAuthentication` ，然后重写 `authenticate(self, request)` 方法，认证成功则返回 `(user, auth)` ，否则返回None。request.user 是当前登录的用户实例， request.auth 是当前登录auth的信息。

某些情况下身份认证失败你可能想要抛出 `AuthenticationFailed` 异常。



### 自定义权限管理类

自定义权限管理类，继承自 `BasePermission` ，然后实现下面一个两个方法：

- has_permission(self, request, view)
- has_object_permission(self, request, view, obj)

如果请求被授予权限，则返回True，如果没有权限则返回False。

自定义权限管理类还可以加上 `message` 属性，用户权限没通过抛出 `PermissionDenied` 异常的额外显示信息。


## 测试
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

## admin站点
简单的admin站点配置就是：

```
admin.site.register(Profile)
```
即添加对应的模型类，更复杂的则需要继承自 `forms.ModelForm` ，然后进行一些管理页面上的调配。

这块不做过多介绍了，有需要的结合文档和源码慢慢研究。

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




## 备用

### pycharm的python console配置django环境
其他独立的python脚本也是类似的配置原理：

1. 配置环境变量： `DJANGO_SETTINGS_MODULE=what.settings`
2. 加上这样两句：

```
import django
django.setup()
```

### 文件上传
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



### 自定义命令
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



### 创建超级用户
最开始创建的项目就把admin url挂上去了，你可以去 `/admin` 这个url下看一下，要想登录的需要如下创建一个超级用户：

```
python manage.py createsuperuser
```

### 交互式环境
进入python交互环境，这个和纯python交互环境的区别就是里面可以直接使用django里面的一些东西了，比如你定义的模型对象就可以直接使用了。这个对你开发进行测试工作非常有用！

```
python manage.py shell
```

或者进入sql实现的交互环境:

```
python manage.py dbshell
```


### 编码规范
- 模型字段名应当全部小写，使用下划线代替驼峰命名。



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







#### django的变量怎么传给javascript

**NOTICE: 现在不推荐这种写法了，推荐走ajax通道传数据。**



django的视图函数在render的时候通过context字典值，里面的各个字段的值将传给django的模板里的变量，这个我们是知道的了，那么django的变量怎么进而传递给javascript呢。本小节参考了 [这个网页](https://stackoverflow.com/questions/7165656/passing-objects-from-django-to-javascript-dom) 。

首先要传递的字段建议如下json封装下：

```
from django.core.serializers.json import DjangoJSONEncoder
{
	what : json.dumps(data['content_images'], cls=DjangoJSONEncoder)
}
```

然后在javascript那边：

```
var what = JSON.parse("{{ what | safe | escapejs }}")
```

注意 `safe` 和 `escapejs` 过滤器。










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

## 附录
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