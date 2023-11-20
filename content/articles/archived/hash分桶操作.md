Slug: hashfen-tong-cao-zuo
Date: 20200405



hashlib的md5算法作为实践级别的算法有一个很大的特点那就是输出的位数长度是固定的，这样很方面进行下一步的输出再分桶操作：

```python
import random
import string
import hashlib
from operator import add
from functools import reduce
from collections import defaultdict


def md5(key):
    return hashlib.md5(key.encode()).hexdigest()


def mapping(hashkey, n=10):
    return reduce(add, [ord(i) for i in hashkey]) % n
```

各个位数相加参考了 [这个网站](http://www.mathcs.emory.edu/~cheung/Courses/323/Syllabus/Map/hash.html) ，但具体各个位数相加是否保证了分桶的均匀性，老实说我是不大确切的，如下做了一个简单的测试：

```python

data = defaultdict(lambda: 0)


def random_string_generator():
    data = []
    random_length = random.randint(1, 100)
    for i in range(random_length):
        x = random.choice(string.ascii_lowercase + string.digits + ' ')
        data.append(x)
    return ''.join(data)


for i in range(100000):
    s = random_string_generator()

    c = mapping(md5(s))
    print(f'"{s}" mapping to bukket {c}')

    data[c] += 1

print(data)
```

初步看来随机生成的各种各样的字符串最终分桶基本上是均匀的。虽然我知道md5算法是能够保证每个位数上的随机，但进行ord处理得到数字，相加再取模，是否也是保证均匀性的，我只能说这是猜的，需要严格的数学证明。