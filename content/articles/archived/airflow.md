Slug: airflow
Date: 20190911

[TOC]

## 前言

airflow和luigi模块相比有以下优点：

1. 通用的DAG概念来描述工作流，更专业点。
2. 集成系统的crontab从而支持周期性任务，这样airflow就只能在linux系统下运行了。
3. 图形界面很美观，功能更强大。

老实说我不喜欢crontab，如果只是简单调度，用apscheduler或者之类的工具简单写下就能集成到你的软件系统中去，而再复杂点的工作流，任务流程等等管理，都推荐使用airflow这样的框架来管理。

而至于说到大数据上的那些流式数据处理工具，实际上只有百分之几的公司因为业务需要必须上大数据，大部分公司是没必要上大数据的，因为大数据引入了太多的复杂度了，如果没有必要，而仅仅追求时髦去玩大数据，那显然是违背我们程序界公认的KISS原则的【Keep it simple and stupid.】。



### 安装airflow

```
pip install apache-airflow
```



### 推荐起步

推荐 项目工作目录下 `.env` 文件下写上：

```
export AIRFLOW_HOME=.
```

这样使用pipenv或者其他工具在当前目录激活工作环境的时候，也自动激活了airflow在当前目录下工作的配置。这样我们airflow相关works配置的相关代码都放在这里。

激活虚拟环境后，然后我们有如下操作：

### 初始化数据库

```
airflow initdb
```



### 启动webserver

```
airflow webserver
```



## 使用其他数据库

刚开始玩下sqlite3数据库，后面正式运行还是要上正式的数据库，sqlalchemy支持的数据库airflow都支持。然后 sqlite3数据库是不支持 LocalExecutor 的，但是一开始搭建项目和大概项目百分之八九十代码还没确定下来和测试好，还是推荐使用sqlite3数据库。LocalExecutor相比较默认的 SequentialExecutor 其一次只能运行一个任务的，而LocalExecutor 是支持多进程运行任务的，这在后面还是很有用的。

所有的任务运行情况在数据库中都做好记录：

```
pipenv install apache-airflow[postgres]
```

然后 `airflow.cfg` 哪里配好这些配置：

- sql_alchemy_conn

## 正式运行必做的配置

正式运行很多配置都要想好，配置好，其中有些配置是必做修改的：

- executor 正式运行，推荐切换为 LocalExecutor 这样支持多进程运行，分布式可以考虑 CeleryExecutor
- 请启用 `airflow scheduler`  好让你配置的任务能够自动周期运行。
- 请参看 airflow [github仓库源码](https://github.com/apache/incubator-airflow) 的scripts文件夹的systemd或者upstart来配置你的服务脚本。



## 实际编写dags

```python
"""
Code that goes along with the Airflow tutorial located at:
https://github.com/airbnb/airflow/blob/master/airflow/example_dags/tutorial.py
"""
from airflow import DAG
from airflow.operators.bash_operator import BashOperator
from datetime import datetime, timedelta


default_args = {
    'owner': 'airflow',
    'depends_on_past': False,
    'start_date': datetime(2015, 6, 1),
    'email': ['airflow@example.com'],
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
    # 'queue': 'bash_queue',
    # 'pool': 'backfill',
    # 'priority_weight': 10,
    # 'end_date': datetime(2016, 1, 1),
}

dag = DAG('tutorial', default_args=default_args)

# t1, t2 and t3 are examples of tasks created by instantiating operators
t1 = BashOperator(
    task_id='print_date',
    bash_command='date',
    dag=dag)

t2 = BashOperator(
    task_id='sleep',
    bash_command='sleep 5',
    retries=3,
    dag=dag)

templated_command = """
    {% for i in range(5) %}
        echo "{{ ds }}"
        echo "{{ macros.ds_add(ds, 7)}}"
        echo "{{ params.my_param }}"
    {% endfor %}
"""

t3 = BashOperator(
    task_id='templated',
    bash_command=templated_command,
    params={'my_param': 'Parameter I passed in'},
    dag=dag)

t2.set_upstream(t1)
t3.set_upstream(t1)
```

配置DAG的参数：

- owner 任务所有者
- depends_on_past 
- start_date
- email
- email_on_failure
- email_on_retry
- retries
- retry_delay

### BashOperator

调用bash命令：

- task_id 任务名字
- bash_command 实际bash命令 
  我们看到它还支持jinja2的模板语法，当然最后输出和执行的还是bash命令
- retries 重试次数

整个脚本实际上就是一个 DAG 结构配置描述文件，具体你的其他python代码写在其他地方都是可以的。我们看到这里：

```
t2.set_upstream(t1)
t3.set_upstream(t1)
```

每个任务在一个目标dag里面就是一个节点，这里设置节点t2的上一个节点是t1，t3的上一个节点是t1。



### PythonOperator

我是个深度python爱好者，所以让我们进一步讨论下PythonOperator吧：

```
from airflow.operators import PythonOperator
```

在这里重点强调一点：

dags只是一些有关任务的配置文件，其他一切python函数之类的都移到其他地方，作为python模块引入，强烈推荐 pipenv 的 `-e` 风格。

```
task = PythonOperator(
    task_id = '这里是任务的名字' ,
    python_callable = func,
    provide_context=True,
    dag = dag
)
```

你看到上面还有一个参数 `provide_context=True` ，默认是False，如果设置为True，那么你的函数将接受额外的两个参数：

```
def func(ds, **kwargs):
```

其中ds是当前的执行时间，然后kwargs里面还有更多的参数，具体请参看官方文档的API的 Macors 哪里。

### 测试某个任务

```
airflow test dag_id task_id date
```

这样测试某个任务是不会在数据库中有记录的。



## 调度的时间控制

scheduler调度的时间控制说的非常清楚：

1. 首先调度会从 `start_date` 开始计算，但是如果的dag设置了 `catchup = False` ，那么将只会从最新的dag间隔序列算起。
2. 其次调度的间隔序列基于你设置的 `schedule_interval` 属性，将时间分成一个一个片段，目标dag被运行是在目标间隔时间过完之后。



## clear某个dag

有的时候某个时间片的dag你想要再重新运行一次，那么你可以在UI上点击那个时间片的dag，然后点击 `Clear` 。

如果时间片较多的话可以运行命令：

```
airflow clear -s start_dt -e end_dt dag_id
```

## backfill某个dag

backfill和test的不同是运行状态会进入数据库并记录下来，有的时候你会更改临时更改 `start_date` ，这个时候一般之前的那些 scheduler不会照顾到，我重启来 scheduler也没有照顾到。通过backfill可以设定一个时间片段，然后执行目标dag

```
airflow backfill dag_id -s start_dt -e end_dt 
```



## 杂谈

关于大数据处理这块，之前写过一篇小文章谈过一点，一个核心的点就是  `处理任务碎片化` ，airflow给我们提供的框架就是一种基于 时间片的过程 让大数据的 处理任务碎片化，从而每个处理小片段的状态都记录好然后可回溯。

比如说你的程序在某个时间片上抛出一个异常，有意或者无意的 `raise Exception` ，那么airflow记录的这个小处理片段就会标记为failed失败状态，而如果你点击它，然后clear清楚这个状态，那么这个任务在scheduler的调度下，过一会又会启动这个任务。

而你的任务运行没有问题的话，那么这个任务运行完之后就会标记 sucess ，那么这个小时间片下的数据以后就不会处理了。

一个好的建议是设置好数据库的 updated_time ，然后根据 updated_time 来切分数据时间片，当然某些情况写 插入时间的切分就够用了，必须要额外的记录更新时间。





## 参考资料

1. airflow官方文档
2. [airflow tutorial](https://github.com/hgrif/airflow-tutorial)
3. [etl with airflow](https://gtoonstra.github.io/etl-with-airflow/index.html)