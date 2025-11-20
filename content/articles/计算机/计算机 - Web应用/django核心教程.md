Slug: django-core-tutorial
Date: 20190405
Modified: 20231123


[TOC]


## 初识Django
首先是搭建好项目的python依赖环境，最好是虚拟环境，虚拟环境里面安装好一些python模块，比如当然包含django模块依赖，这块讨论我就从简了。

如果读者对django有了一定的了解，并且手头上已经积累了一个django启动项目骨架，比如说参考我创建的这个项目： [djangowander](https://github.com/a358003542/djangowander) ，那么可以利用你手头上的项目模板来快速创建。而对于初学者，则运行如下命令来创建django项目骨架：

```
django-admin startproject project-name
```

不过一般这个时候我们已经把项目文件夹和python环境配置好了，所以这是推荐在你的项目文件夹运行：

```
django-admin startproject project-name .
```

你会看到在当前文件夹下面多了一个 `manage.py` 文件，然后还有其他一些文件夹和文件。这个建议初学者简单了解下即可，后面都会慢慢接触和熟悉的。


然后如下启动本django项目：

```
python manage.py runserver 
```

打开网页就能看到django的展示页面了。django默认配置一开始是使用的sqlite数据库，默认admin页面是可以查看的。读者可以到 `/admin` 那里看一下，这个admin页面的首次登录你需要创建一个超级用户：

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


### django做了什么事
HTTP请求包到了你的服务器，比如nginx服务器，其会分析你的HTTP请求包里面的URL，具体是分析URL里面的path参数，然后根据path参数来决定不同的行为。比如说很多静态图片HTTP请求一般是不会到django那边去的，这些静态内容的URL请求会直接由nginx来返回HTTP响应包。

还有一部分URL里面的path在Web服务器那边是定义为由某个WSGI服务接管，对于这些URL的HTTP请求，Web服务器只是起到代理性质，将该请求传递给WSGI服务即可，这里所说的WSGI服务就是django提供的。这部分URL又会分成很多不同的类型，在代码上的表现就是通过编写urls.py这个文件来实现URL的进一步分发，分发过来的HTTP请求包会继续往下面传递，这里HTTP请求包当然早就不是原生的文本格式了，而是方便程序员开发应用程序进行了很多友好的封装。分发过去的HTTP请求包会继续分发到视图层也就是views.py这个文件里面的某个视图函数上，具体HTTP响应包的内容就是由这个视图函数决定。

具体该视图函数在处理过程中可能会请求SQL数据库里面的资源，这个时候就要使用models.py里面定义的模型层的代码了，具体叫做SQL数据库的ORM封装。

当然上面的讨论是很简单很粗浅的。


## settings.py
settings.py在django项目早期搭建中，是一个会经常修改的文件，但是在项目后期等项目依赖环境基本稳定之后这个文件就很少变动了。

这里的配置不仅有django自身的一些配置，也有项目django第三方依赖的一些配置，还可能有项目的其他环境变量。

毕竟settings.py也是代码，为了做到代码尽可能稳定和少变动，我推荐的做法是将一些变动的环境代码都放在 `.env` 环境变量文件里面，然后settings.py 里面根据环境变量的不同行为略有不同，这样做的第二个好处就是出于安全性的考虑，一些隐私信息也不会放在代码里面。

开发，测试，部署等有的项目做法是采用不同的settings.py文件，我不推荐这样的做法，一方面是这么做会造成很大的代码冗余，另外在开发中因为不同的代码文件要维护也常常造成困扰，推荐的做法是合理编写settings.py里面的代码，通过环境变量文件调配来实现不同环境的切换。


## urls.py
其默认的内容如下:

```python
from django.contrib import admin
from django.urls import path

urlpatterns = [
    path('admin/', admin.site.urls),
]
```


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



## models.py
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


### admin.py
简单的admin站点配置就是：

```
admin.site.register(Profile)
```
即添加对应的模型类，更复杂的则需要继承自 `forms.ModelForm` ，然后进行一些管理页面上的调配。


## apps.py
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
