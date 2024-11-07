Slug: python-builtin-module-threading
Date: 20241106
Modified: 20241107

[TOC]

## threading模块
本文简要介绍了python的内置模块threading, 更多内容请参看 [官方文档](https://docs.python.org/zh-cn/3/library/threading.html).


### 什么是线程
我们知道各个进程之间可以看作彼此独立的程序, 但是进程的开销非常昂贵, 因为不同的进程是抢占系统资源的关系, 于是在操作系统之上开发出了更轻量化的解决方案来解决同一时间处理不同任务的需求. 同一进程下的不同线程是共享本进程的大部分资源的, 这大大地降低了系统资源开销, 然后进程之下各个线程是可以直接共享某些公共变量的, 而进程之间完全是独立的程序根本不存在这种可能性.

对于CPU密集任务, 开多个进程来申请更多的系统资源才是王道; 而对于IO密集性任务, 开多个线程则是更合适的解决方案. 


## Thread类
通过Thread类来新建一个线程，其中 `target` 来给出该线程等下执行要调用的函数, 然后调用 `start` 方法来启动该线程.

你可以继承Thread类来新建一个线程类, 这个时候你需要重载 `run` 方法来定义该线程等下要做的事情. 上面提到的target指向某函数, start之后也是调用内置的run方法还是调用该函数.

下面是一个简单的例子:

```
import random, threading

result = []

def randchar_number(i):
    number_list = list(range(48,58))
    coden = random.choice(number_list)
    result.append(chr(coden))
    print('thread:', i)

for i in range(8):
    t = threading.Thread(target = randchar_number, args=(i,))
    t.start()

print(''.join(result))

thread: 0
thread: 1
thread: 2
thread: 3
thread: 4
thread: 5
thread: 6
thread: 7
22972371
```

**注意: 控制参数后面那个逗号必须加上。**


### 守护线程
可以通过设置 `daemon=True` 来让该线程成为守护线程, 主线程不是守护线程, 如果主线程上面的程序流程已经走完了, 但是某个子线程还没有走完, 该子线程是非守护线程, 这时python程序不会自动退出, 还会卡在那里. python程序只在没有存活的非守护线程之后才会自动退出. 

一般来说监听性质的线程必须设置为守护线程, 因为该线程从工作性质来说会在那里循环永远也走不完的, 当然你也可以设置某种信号机制在工作都做完之后发送信号告诉该线程可以退出循环了,但没有这个必要, 主线程做好工作都做完的判断阻塞程序就好.



## 线程锁
python有两种类型线程锁 `Lock` 和 `RLock` ，其都是通过 `acquire` 来获取锁和 `release` 来释放锁。当一个线程试着访问某个unlocked的锁，`acquire` 将立即返回；如果访问的是locked的锁，那么该线程将阻塞，直到一个 `release` 释放了该锁。

RLock和Lock的区别是RLock可以被相同的线程acquire多次，RLock人们也称之为递归锁，如果你的某个（递归）函数在某个线程中多次访问资源，而这时被允许的，那么你应该使用RLock。

RLock常和with语句一起使用：

```
lock = threading.RLock()
with lock:
    do something...
```
