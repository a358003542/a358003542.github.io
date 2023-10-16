Slug: ansible
Date: 20191018


[TOC]

## 前言

ansible是一个自动化运维工具，当我们学习到后面之后，就会发现只写一个简单的web app是不够的，常常远程计算机那边的环境需要很多配置，比如后台脚本的执行啊，nginx配置来服务静态文件啊等等。而每个任务都手工用 `ssh` 端来操作的将是非常低效率的了，尤其到后面各个任务繁多，环境需要重复部署的时候。ansible就是解决这一问题的。

第一个例子：假设你现在可以免密钥登录某一个远程服务器了，然后你在 `/etc/ansible/hosts` 这个文件里面把你的服务器名字加进去，然后执行:

```
ansible all -m ping
```

如果一切正常的话其将返回 SUCESS 信息，证明现在你已经通过ansible正常连通你的远程服务器了。



## hosts文件配置

这里讨论的 `/etc/ansible/hosts` 这个文件是所谓的默认 inventory 文件，除了这个默认inventory配置文件之外，还可以写很多其他的配置文件的。而这些配置文件内容大体如下:

```
[webservers]
foo.example.com
 bar.example.com
```

[webservers] 这个字段定义的是所谓的主机组的概念，之前我们随便写上去的那个主机没属于任何主机组，然后一个主机组似乎还可以属于另外一个主机组等，这个有点复杂了。似乎主机组里面的主机可以怎么统一管理，这个后面再说。



### 主机变量设置

组的变量情况请看文档下面，主机变量大体就是后面写上一些值就是了，因为这些变量在定义后playbooks也是可以使用的，而playbooks无疑是后面的重头戏，所以这还是值得提一下的。
```
[atlanta]
host1 http_port=80 maxRequestsPerChild=808
host2 http_port=303 maxRequestsPerChild=909
```

### 主机的其他参数控制

应该大多和具体ssh连接的配置有关吧，比如:
```
some_host         ansible_ssh_port=2222     ansible_ssh_user=manager
```



-   `ansible_ssh_host` 这个一般没啥好设置的，不过可能你的主机名很长，则通过这个设置一下作为具体连接的主机名。而前面写的 `some_host` 只是作为主机别名。如果你的ansible版本号大于2了，那么推荐使用 `ansible_host` 。
-   `ansible_ssh_port` 端口号，默认不需要配置。如果你的ansible版本号大于2了，那么推荐使用 `ansible_port` 。
-   `ansible_ssh_user` ssh登录用户名，默认是你当前电脑的当前登录用户名，这个可能在某些情况下需要配置。如果你的ansible版本号大于2了，那么推荐使用`ansible_user` 。
-   `ansible_ssh_pass`  登录密码，免密钥登录不需要配置。文档说不推荐使用。





## playbooks之熟悉yaml

当然首先需要简单了解下yaml语法，一个简单例子如下:

```yaml
---
# 一位职工记录
name: Example Developer
job: Developer
skill: Elite
employed: True
foods:
    - Apple
    - Orange
    - Strawberry
    - Mango
languages:
    ruby: Elite
    python: Elite
    dotnet: Lame
```

yaml文件一开始都要加上这个:  `---` 。

注释是 `#`

然后相同缩进级别 `-` 开头的表示一个列表，然后其他键值对表示字典，大体就是这样。



## playbook入门

下面是最简单的一个例子，新建这么一个 `first.yaml` 文件:

```yaml
---
- hosts: work
  tasks:
    - name : ping and pong
        ping :
```


然后执行是:
```
ansible-playbook first.yaml
```

这里只是简单的ping pong 了一下，这个配置简单的内容就是主机 work ，这个是在之前提到 `/etc/ansible/hosts` 那个文件里定义的。然后对这个主机执行某个任务 tasks 。这是一个任务列表清单，name 描述了该任务，文字随意。然后执行了 ping 模块。

这个任务确保nginx重启了一次:
```
- name: make sure nginx restarted
  service: name=nginx state=restarted
```

这个任务是确保nginx服务是运行着的:
```
- name: make sure nginx is running
  service: name=nginx state=running
```



## playbook最佳实践

### hosts文件

在项目的文件夹下新建一个hosts文件，其类似之前讨论的 `/etc/ansible/hosts` 文件，然后在本地通过如下语法引入：
```
ansible-playbook -i hosts site.yml
```
​    

### site.yml

刷脚本的主入口

### tags单独运行子任务

在roles文件夹里面新建一个common文件夹，然后common文件夹里面新建一个tasks文件夹，tasks文件夹里面定义一个main.yml，该文件内容大体如下:
```
---

- name: task的名字
  command: ...
```

然后site.yml里面如下定义：
```yaml
---
- name: ansible 必要参数侦测
  hosts: all
  remote_user: root

  roles:
    - {role: common, tags: ['common']}
```


然后只运行某个子任务如下利用tags来完成。
```
ansible-playbook -i hosts site.yml --tags=common
```
​    

### 临时加上某个 tags 任务

```yaml
- name: create odoo superuser
  shell: su - postgres -c "createuser -s {{ user }}"
  tags:
    - psql_user
```

### role的全局参数

全局参数放在 `group_vars` 文件夹的 all 文件里面，其也是一个简单的yaml文件。

### role里的局部参数

这些参数推荐在site.yml文件对应的role哪里定义，如下所示定义了一个 `folder_name` 变量 ：
```yaml
roles:
  - {role: update-sdsomweb, folder_name: "resource/install_venv", tags:  ['update-sdsomweb']}
```

我们看到ansible-playbook就最基本的配置编写和使用还是很简单的，关键是具体任务那边要熟悉好一些特定的模块。



## playbook之模块

官方模块很多，内容很丰富，这里就不赘述了，请参看官方文档。



## 如何实现本地安装

在hosts里面添加一行：

```
localhost ansible_connection=local
```

同时需要注意本地安装不需要提供ssh用户名和密码了，然后也不需要上传ssh key了，所以如果你之前有上传操作的应该加上这么一行：

```
when: ansible_connection != "local"
```


​    

## 将压缩包解压包远程机器目标点

值得一提是unarchive模块最近才支持 `remote_src` 模式，所以推荐还是采用本地压缩包源然后解压过去的方式。
```yaml
- name: 解压 apr 
  unarchive:
    src: "{{folder_name}}/apr-1.5.2.tar.gz"
    dest: /root
```

## rsync风格的将某个文件夹复制过去

为什么不利用copy模块，因为scp如果文件夹里面结构稍微复杂点就会很慢，这时推荐使用 synchronize 模块：
```
- name: 上传源
  synchronize: src=resource/winstore dest=/root mode=push
```

值得一提的是，rsync那边如果远程机器不是免密码ssh连接的话，这时又要输入密码，所以推荐你的playbook一开始就将pub密钥传过去，然后rsync功能需要远程机装了libselinux-python和 rsync 这两个软件包。

```
- name: 上传ssh key
  authorized_key: user=root key="{{ lookup('file', '/home/what/.ssh/id_rsa.pub') }}"
```

这里的user是登录远程机器的用户名。


## 如何获得远程机器的更多参数信息

ansible的 setup 模块能够获得远程机器很多有用的信息，甚至能够知道远程机器运行的虚拟机软件是什么。不过你可能需要一些更多信息，比如远程机器默认的python版本是多少，这个时候我们可以用如下方式来获得：

```
- name: get python version
  command: python -c 'import sys;print("{0}.{1}".format(sys.version_info.major,sys.version_info.minor))'
  register: python_version_check
```

这里的register注册的是执行上述命令command之后的返回结果，在ansible整个运行时里都是可以用，具体结果你可能还需要通过 `python_version_check.stdout` 这样的方式获得。


## command和 shell的区别

command和shell在很多情况下似乎都没有区别，shell严格意义上来讲就类似于你在shell中执行了某个命令，其可以使用bash的一些环境变量等，后面应该没事会优先考虑使用shell模块吧。



## 如何在pip的虚拟环境下工作

参考了 [这个网页](http://stackoverflow.com/questions/26402123/ansible-creating-a-virtualenv) ，如下所示是在目标虚拟环境文件夹下根据requirements.txt文件夹描述来安装那些目标python模块到虚拟环境中。
```yaml
- name: Install requirements
  pip: 
    requirements: /my_app/requirements.txt
    virtualenv: /user/home/venvs/myenv
    virtualenv_python: python3.4
```


## 如何安装本地的rpm包
有兴趣的可以看一下ansible的 `yum` 模块，不过要实现免网络完全利用本地下载的rpm包来安装的话用这个模块似乎并不是很好用，因为其并不能很好地处理各个模块之间的依赖。推荐就直接调用shell模块，如下所示：
```
- name: install rpms
  shell: yum localinstall -yC --disablerepo=* `ls /path/to/rpms/*.rpm` 
```

具体这些rpm包如果是base的，那么推荐用：
```
yum install yum-utils
yum install --downloadonly --downloaddir=. the_rpm_name
```

来下载之。如果来自epel，那么推荐在 [pkgs.org](https://pkgs.org/) 搜名字，在 [这个网站](http://dl.fedoraproject.org/pub/epel/7/x86_64/) 下载。


## 删除文件或文件夹

删除文件或文件夹推荐使用 file 模块而不是调用rm命令，如下所示：
```
- name: 确保目标venv文件夹不存在
  file: path=/opt/sdsom/venv state=absent
```


## 如何微调配置文件

一般配置文件在远程机器上已经有个原样了，只是某几行需要修改一下，这个时候用lineinfile模块来微调这些配置很是适宜的。
```yaml
- name: 调配apache的 httpd.conf 
  lineinfile: 
    dest: /etc/apache/conf/httpd.conf 
    regexp: "{{item.regexp}}" 
    insertafter: "{{item.insertafter}}"
    line: "{{item.line}}"
  with_items:
    - {regexp: "^Listen ", insertafter: "^#Listen ", line: "Listen 8880"}
    - {regexp: "^User ", insertafter: "^#User ",line: "User sdsadmin"}
    - {regexp: "^Group ", insertafter: "^#Group ",line: "Group sdsadmin"}
    - {regexp: "^ServerName ", insertafter: "^#ServerName ",line: "ServerName {{server_name}}"}
```


上面这个例子的意思就是用 regexp 来匹配目标行， 然后替换为内容 line 。insertafter是如果匹配到那个了，则将line插入到该行的后面。

下面这个例子是插入一行new line：
```yaml
- name: Load config files from the config directory conf.d/*.conf
  lineinfile:
    dest: /etc/apache/conf/httpd.conf
    line: "{{item.line}}"
  with_items:
    - {line: "Include conf.d/*.conf"}
```


此外template模块可以利用本地的模板文件（jinja2模块系统）来生成一个配置文件。

## 只在某个版本的操作系统下才执行某个动作

用 `when` 语句来表达，下面的意思是只在远程机器操作系统是CentOS而且版本号是7.2时才执行某个动作（参考了 [这个网页](https://raymii.org/s/tutorials/Ansible_-_Only_if_on_specific_distribution_or_distribution_version.html)。
```
- name: only for centos7.2 do some tweak
  command: ...
  when: ansible_distribution == 'CentOS' and ansible_distribution_version.startswith('7.2')
```


`ansible_distribution` 还可能是 Ubuntu ，Debian ， Red Hat Enterprise Linux 等。

## register的用法
比如说我们写上这么一个简单的 test.yml 文件，内容如下：

```yaml
---

- hosts: localhost

  tasks:

  - name: test
    shell: date
    register: test

  - name: debug
    debug: msg="{{ test['stdout'] }}"
```



然后我们运行：
```
ansible-playbook -i "localhost," -c local test.yml
```


运行结果就显示之前运行的那个date命令的结果已经注册到ansible的全局变量池里面去了，名字通过register来赋值，然后在后面的jinja2模板系统中都可以调用的。




## with_items的用法
这个具体请参看官方文档的 [这里](http://docs.ansible.com/ansible/playbooks_loops.html) 。


## 换行写或者一行写
这个是个小细节，官方文档看了一些就会看到这两种形式，不多说了。



## lookup的用法
lookup上面在上传ssh key的时候已经用到过一次了， 这个在ansible里面也是一个高级应用。

## command 模块的skip判断

如下加上`creates` 参数来作为这个command是否跳过的判断标准，如果该文件存在则认为command已经执行过了则会跳过。

## local_action是什么

`local_action` 是 `delegate_to: 127.0.0.1`  的缩写，简单来说就是只在本机或说操作机上执行某个动作。这里顺便提一下 `delegate_to` 的含义，是指定某个主机执行某个动作，是脱离ansible默认的由inventory输出的那个几个hosts的，也就是这个 `delegate_to` 的主机可以是默认的那个几个hosts中的一个，也可以是其他主机。

```yaml
tasks:

- name: take out of load balancer pool
  local_action: command /usr/bin/take_out_of_pool {{ inventory_hostname }}
```



## handlers是什么

```yaml
- name: template configuration file
  template: src=template.j2 dest=/etc/foo.conf
  notify:
     - restart memcached
     - restart apache
```

```yaml
handlers:
    - name: restart memcached
      # The service module was used, but you could use whatever module you wanted
      service: name=memcached state=restarted
    - name: restart apache
      service: name=apache state=restarted
```

有时你会在playbook的某个role下面看到hanlders这个文件夹，简单来说就是某个任务如果执行了（跳过的不算，只有真正执行也就是changed state返回了），然后将执行notify: 下面定义的一些hanlders任务。



## 参考资料



1.  [ansible官方文档](http://docs.ansible.com/ansible/index.html)  ，这里有个翻译的 [中文ansible官方文档](http://ansible-tran.readthedocs.io/en/latest/index.html) 。
2.  [you-should-know-ansible](http://codeheaven.io/15-things-you-should-know-about-ansible/) 这篇文章写了一些关于ansible的东西写得挺好的。

