Slug: python-builtin-module-configparser
Date: 20231019

[TOC]

## configparser模块


简单的配置文件管理就用python的内置模块configparser。python2对应的模块名字叫 ConfigParser 。

python3之后configparser的使用更加简单了，具体就分为如下几步:

### 新建一个configparser对象

    import configparser
    config = configparser.ConfigParser()

### 读取某个config文件

调用read方法具体读取某个config文件。

    config.read('test.cfg')

### 如同字典一般操作configparser对象

然后接下来就是如同字典一般操作这个configparser对象。其中 'DEFAULT'
是特殊的section，大致如下这样表达:

    config['DEFAULT'] = {'ServerAliveInterval': '45',
                         'Compression': 'yes',
                         'CompressionLevel': '9'}
    config['bitbucket.org'] = {}
    config['bitbucket.org']['User'] = 'hg'
    config['topsecret.server.com'] = {}

### 调用write方法写入

    with open('example.ini', 'w') as configfile:
        config.write(configfile)

### 不默认更改大小写

具体请参看 [这个网页](http://stackoverflow.com/questions/19359556/configparser-reads-capital-keys-and-make-them-lower-case) ，configparser模块默认把 option name 也就是每个section的key
name改成小写，我不太喜欢这种风格，因为将configparser刷成字典值时，我们通常认为字典的key大小写是区分的，可以如下改动，然后就不自动进行小写操作了:

    self.cfg = configparser.ConfigParser()
    self.cfg.optionxform = str## not auto make it lowercase

### configparse处理特殊字符

configparse对于某些特殊字符可能会报错，参考了 [这个问题](https://stackoverflow.com/questions/14340366/configparser-and-string-with) ，推荐使用 `RawConfigParser` ，这样就可以解决问题。


