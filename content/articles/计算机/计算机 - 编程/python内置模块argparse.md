Slug: python-builtin-module-argparse
Date: 20231019

[TOC]

## argparse模块


下面简要介绍了python3的官方文档argparse模块的用法，用于快速制作一个可以刷参数的python脚本。

首先看下面这个简单的情况:

    import argparse
    usage = '''
    this is a example to show argparse usage
    '''
    parser = argparse.ArgumentParser(usage=usage)
    
    args = parser.parse_args()

这是简单的一个例子了，现在脚本还不可以接受任何参数，只可以用 `-h` 或
`--help` 来查看一些信息，如下所示。

    wanze@wanze-ubuntu64:~/桌面$ python3 hello.py -h
    usage: 
    this is a example to show argparse usage
     [-h]
    
    optional arguments:
      -h, --help  show this help message and exit

其首先是新建一个parser，上面ArgumentParser的usage是可选参数，就是命令行的一些描述信息。然后需要调用parser的
`parse_args` 方法，其就是具体将命令行接受的一些参数刷进去。

### 简单添加一个参数

上面的例子太简单了，现在开始简单添加一个参数。

    import argparse
    usage = '''
    this is a example to show argparse usage
    '''
    parser = argparse.ArgumentParser(usage=usage)
    
    parser.add_argument('--config',help="the config file path")
    
    args = parser.parse_args()
    
    print(args)

这样命令行的帮助信息就变成如下所示了:

    wanze@wanze-ubuntu64:~/桌面$ python3 hello.py -h
    usage: 
    this is a example to show argparse usage
    
    optional arguments:
      -h, --help       show this help message and exit
      --config CONFIG  the config file path

如果我们如下输入则有:

    wanze@wanze-ubuntu64:~/桌面$ python3 hello.py --config='config.cfg'
    Namespace(config='config.cfg')

我们看到 `parse_args` 方法返回的是Namespace对象，推荐用 `vars`
函数来将其处理成为字典值，这样会更好地方便后面的使用。

    import argparse
    usage = '''
    this is a example to show argparse usage
    '''
    parser = argparse.ArgumentParser(usage=usage)
    parser.add_argument('-c','--config',help="the config file path")
    args = vars(parser.parse_args())
    
    print(args)
    
    wanze@wanze-ubuntu64:~/桌面$ python3 hello.py -h
    usage: 
    this is a example to show argparse usage
    python3 hello.py
    
    optional arguments:
      -h, --help            show this help message and exit
      -c CONFIG, --config CONFIG
                            the config file path
    wanze@wanze-ubuntu64:~/桌面$ python3 hello.py --config='config.cfg'
    {'config': 'config.cfg'}

上面代码稍作修改，在长名字可选参数前面还可以加上短名字可选参数支持，然后我们看到
`parse_args` 方法经过 `vars`处理之后返回的是字典值。该字典的key默认对应的是长名字可选参数。你还可以自己设置目标参数名:

### 添加参数的其他选项设置

下面演示了如何设置目标参数在脚本中具体对应的变量名:

    import argparse
    usage = '''
    this is a example to show argparse usage
    '''
    parser = argparse.ArgumentParser(usage=usage)
    parser.add_argument('-c','--config',dest="configpath",help="the config file path")
    args = vars(parser.parse_args())
    
    print(args)

然后我们看到字典输入如下:

    wanze@wanze-ubuntu64:~/桌面$ python3 hello.py --config='config.cfg'
    {'configpath': 'config.cfg'}

当然一般就默认设置成为和长名字可选参数一致，没必要这么折腾。类似的你还可以继续用
`add_argument` 方法来添加其他的可选参数，然后 `add_argument`
还有如下一些选项配置:

required=True

:   该参数一定要输入值，否则报错

help

:   描述信息，前面已经看到了。

default

:   该参数的默认值，默认是None，你可以选择设置成另外一个值。

type

:   目标参数的数据类型，默认是字符串，可以设置为int或float。注意设置格式如下，不是字符串的那种设置形式:
​    `parser.add_argument('--delay',type=int)`

必填参数的添加如下所示，除了这个\"target\"名字前面没有 `--`
之外，和可选参数用法大致类似，其刷入args字典之后的key就是\"target\"这个名字。

    parser.add_argument('target',help="必填参数")

不过必填参数和可选参数在某些细节上还是有点差异的，后面会提及。

#### nargs选项设置

nargs设置之后该参数在脚本中具体对应的变量将是一个列表。其中nargs可以设置为一个数字，比如
`nargs=4` ，则脚本对该参数将接受4个输入值，然后将其收集进一个列表里面。

此外还有:

`nargs='*'`

:   这通常是对可选参数进行设置，当然也可以作用于必填参数，但这让必填参数失去意义了。其将收集任意多的输入参数值，而如果多个可选参数之间这样使用星号是可以的，具体请参看官方文档。

`nargs='+'`

:   这通常作用于必填参数，其意义有点类似于正则表达式里面的'+'号，和上面的'\*'号比起来其必须有一个输入值，否则将报错。

`nargs='?'`

:   这个'?'号具体使用情况挺复杂的，我不太喜欢，而且其和nargs其他的一些设置比较起来显得有点格格不入。首先其对应的变量值不是列表而是单个值！其次其改变了默认值的行为。如果该参数不输入，比如`--foo` 这个东西完全不输入在命令行里面，那么foo默认取default的值，如果加入了​  `--foo` 这个东西但是后面又不跟值，则foo取 **const** 选项赋的值。不太喜欢这个东西。

下面给出一个完整的例子:

```python
import argparse
usage = '''
resize the image
'''

def main():
    parser = argparse.ArgumentParser(usage=usage)
    parser.add_argument('-c','--config',dest="configpath",help="the config file path")
    parser.add_argument('inputimg',help="the input image",nargs='+')
    parser.add_argument('--width',help="the input image",type=int)

    args = vars(parser.parse_args())

    configpath = args['configpath']
    width = args['width']
    inputimg = args['inputimg']

    for inputimg in args['inputimg']:
        print('resize image')
        print('the input image is {}'.format(inputimg))
        print('the target width is {}'.format(width))
if __name__ == '__main__':
    main()
```

具体运行情况如下所示:

    wanze@wanze-ubuntu64:~/图片$ python3 resizeimg.py --help
    usage: 
    resize the image
    
    positional arguments:
      inputimg              the input image
    
    optional arguments:
      -h, --help            show this help message and exit
      -c CONFIGPATH, --config CONFIGPATH
                            the config file path
      --width WIDTH         the input image
    
    wanze@wanze-ubuntu64:~/图片$ python3 resizeimg.py --width=300 *.png
    resize image
    the input image is 2015-01-27 13:16:46 的屏幕截图.png
    the target width is 300
    resize image
    the input image is 2015-05-03 18:17:19屏幕截图.png
    the target width is 300
    resize image
    the input image is 2015-05-03 18:20:45屏幕截图.png
    the target width is 300
    ....

### 命令行选项关联其他动作

parser的 `add_argument` 方法的 `action`
参数就是用来控制命令行选项关联的动作的，一般都不需要设置，就是默认的
`store` ，也就是存储值。类似的有 `store_const` , `store_true` 和
`store_false` 。

#### store\_const

如果是默认的store，则通常是需要指明具体值的，如果设置action为
`store_const` 了:

    parser.add_argument('--foo', action='store_const', const=42)

那么如下就会自动设置该值，这和default默认值的区别是这个选项的值要求是某个常量值。

    >> python3 test2.py --foo
    Namespace(foo=42)

#### store\_true 和 store\_false

如果写为:

    parser.add_argument('--foo', action='store_true')

则其存储的就是 `True` 值:

    >> python3 test2.py --foo 
    Namespace(foo=True)

这里主要是要讲定义自己的动作，就是类似 `--version`
这样的用法，是一种影响程序整个工作流的选项，官方文档推荐通过子类化
`argparse.Action` 的方法，还是有点麻烦的。然后发现 *click*
模块非常好（一个解决创建命令行脚本工具问题推荐使用的第三方模块），处理这个问题也很容易:

```python
import click

def print_version(ctx, param, value):
    if not value or ctx.resilient_parsing:
        return
    click.echo('Version 1.0')
    ctx.exit()

def quick(ctx,param,value):
    print(ctx,param,value)
    ctx.exit()

@click.command()
@click.option('--version', is_flag=True, callback=print_version,
              expose_value=False, is_eager=True)
@click.option('--quick',callback=quick,is_flag=True)
def hello():
    while True:
        userinput = input('input:')
        click.echo(userinput)

        if userinput == 'exit':
            break
if __name__ == '__main__':
    hello()
```

这里的ctx和param到click模块那边再细讲吧，我们看到整个过程比argparse美观多了。


