Slug: python-builtin-module-csv
Date: 20231019

[TOC]

## csv模块

csv模块的使用主要是 `reader` 和 `writer` 两个函数，此外还提供了 `DictReader` 和 `DictWriter` 两个基于 reader和 writer的两个辅助类。reader和writer是接受的文件对象，具体使用参见官方的样例：

```python
import csv

with open('eggs.csv', 'w', newline='') as csvfile:
    spamwriter = csv.writer(csvfile, delimiter=' ',
                            quotechar='|', quoting=csv.QUOTE_MINIMAL)
    spamwriter.writerow(['Spam'] * 5 + ['Baked Beans'])
    spamwriter.writerow(['Spam', 'Lovely Spam', 'Wonderful Spam'])

with open('eggs.csv', newline='') as csvfile:
    spamreader = csv.reader(csvfile, delimiter=' ', quotechar='|')
    for row in spamreader:
        print(', '.join(row))
```

reader和writer两个函数后面接受的参数根据你的需要定制，具体就是所谓的csv方言格式。首先你可能不需要做任何修改，默认是采用的excel格式的csv方言：


```python
class excel(Dialect):
    """Describe the usual properties of Excel-generated CSV files."""
    delimiter = ','
    quotechar = '"'
    doublequote = True
    skipinitialspace = False
    lineterminator = '\r\n'
    quoting = QUOTE_MINIMAL
```

下面就这些字段的含义作出说明：

- **delimiter**  分隔符，这个意义很明显。
- **lineterminator**  换行符，这个意义也很明显，目前主要就两种： `\r\n`  和 `\n` 。
- **skipinitialspace**  默认是False，其主要是对于如果你将空格设置为分隔符时有意义，这样后面字符开始的空格将会被忽略，其他情况设置为True或者False区别不大。
- **quoting**  设置quote规则
- csv.QUOTE_MINIMAL 意思是只有在需要的情况下才加上双引号，比如逗号在字符串里面，双引号在字符串里面，换行符号在字符串里面等等。
  
- csv.QUOTE_ALL 意思是都加上双引号，即使是数字。
  
- csv.QUOTE_NONNUMERIC 数字不加，字符串都加上双引号。（只有在这种情况下csv模块才会正确将数字解析为float类型）
  
- csv.QUOTE_NONE 都不加（此时需要设置好escapechar选项）
- **quotechar** 设置quote具体的字符，一般设置为双引号。
- **doublequote** 用来处理双引号在字符串中的情况，默认是True，字符串将会双引号之外再加上双引号，如果设置为False，会前面加上一个 `escapechar` 。

如果你对csv的输出格式并没有太多要求或者和excel格式是一致的，那么简单的csv文件的读写如下所示，是不需要太多参数的：

```python
import csv

with open('eggs.csv', 'w', newline='', encoding='utf8') as csvfile:
    spamwriter = csv.writer(csvfile)
    spamwriter.writerow(['Spam'] * 5 + ['Baked Beans'])
    spamwriter.writerow(['Spam', 'Lovely Spam', 'Wonderful Spam'])

with open('eggs.csv', newline='', encoding='utf8') as csvfile:
    spamreader = csv.reader(csvfile)
    for row in spamreader:
        print(', '.join(row))
```




### 编写自己的csv方言


如之前所示你可以指定一些csv方言的选项，或者如下所示定义一个你的csv方言类：

```python
import csv

class YourDialectCSV(csv.Dialect):
    delimiter = ',' # 分隔符
    quotechar = '"' # quote符号
    doublequote = True # 双引号在字符中的情况
    skipinitialspace = True # 分隔符后空白忽略
    lineterminator = '\n' # 换行符
    quoting = csv.QUOTE_MINIMAL # 最小quote

csv.register_dialect("YourDialectCSV", YourDialectCSV)
```

这样后面你使用csv模块的reader和writer函数加上 `dialect='YourDialectCSV'`  即可。

### DictReader和DictWriter类

对于开头一行是字段名的csv文件，推荐使用DictReader和DictWriter两个类，两个类初始实例化的时候同样可以接受dialect选项或其他参数，这些参数会原封不动传递给reader

```python
class DictReader:
    def __init__(self, f, fieldnames=None, restkey=None, restval=None,
                 dialect="excel", *args, **kwds):
		self.reader = reader(f, dialect, *args, **kwds)

class DictWriter:
    def __init__(self, f, fieldnames, restval="", extrasaction="raise",
                 dialect="excel", *args, **kwds):
		self.writer = writer(f, dialect, *args, **kwds)
```

所以之前的讨论同样使用，具体使用很简单，如下看下官方样例即可：

```python
with open('names.csv', 'w', newline='', encoding='utf8') as csvfile:
    fieldnames = ['first_name', 'last_name']
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

    writer.writeheader()
    writer.writerow({'first_name': 'Baked', 'last_name': 'Beans'})
    writer.writerow({'first_name': 'Lovely', 'last_name': 'Spam'})
    writer.writerow({'first_name': 'Wonderful', 'last_name': 'Spam'})

with open('names.csv', newline='', encoding='utf8') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        print(row['first_name'], row['last_name'])
```

