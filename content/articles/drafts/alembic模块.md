Status: draft
[TOC]

alembic模块有什么，如果读者熟悉django的话，那么可以将其类比为django里面的makemigrations和migrate相关的命令，简单来说，其管理数据库版本，进行数据库迁移工作。随着我们对于数据库操作的使用频繁，我相信读者就会开始慢慢感受到数据库迁移管理的必要性，实际上我相信读者会从一开始不愿意将这些东西加入代码版本控制，到后来开始主动要将其加入代码版本控制。



更多关于alembic的使用请参看官方文档，下面就一些基本的使用概念说一下。



## 基本使用

### 初始化alembic项目

```
alembic init alembic
```

然后当前目录下会多一个 `alembic.ini` 文件，这个配置文件里面有很多重要的配置，其中 `sqlalchemy.url` 是必配的。



###  根据models.py来

类似于django的 models.py 文件里面定义一些模型，我们利用sqlalchemy模块也可以定义一些模型文件，然后根据这个模型文件的定义，我们可以利用alembic来自动根据你的数据库的一些更改：

```
alembic revision --autogenerate -m "add_some_key"
```



你需要定义好 alembic 文件下的 `env.py` 里面的 target_metadata 这个变量：

```
from myapp.models import Base
target_metadata = Base.metadata
```

然后其会自动生成一些版本控制的py文件，有 upgrade 和 downgrade 操作。



### 升级

```
alembic upgrade head  # head是最新的版本，你也可以指定版本号
```



你也可以管理多个模型文件，多个表格对象，更多细节请参看官方文档，后面有时间本文也会详细补充之。 TODO。



