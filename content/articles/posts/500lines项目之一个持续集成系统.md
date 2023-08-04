Slug: 500lines-continuous-integration-system
Date: 20201207
Tags: 500lines



[TOC]

## 前言

本文讨论的500lines项目的一个简单的持续集成系统文章在这里：[(aosabook.org)](http://aosabook.org/en/500L/a-continuous-integration-system.html) 。

持续集成系统简称CI system，其作用主要是当有新的代码提交时，确保该提交没有中断任何测试。因此持续集成系统主要工作就是获取新的代码提交，运行测试并报告结果。

一个简单的持续集成系统包含三个部分：一个观察组件，一个测试任务分发器和一个测试任务运行器。

一个理想的持续集成系统应该是能容错的和承压的，如果是单机器单进程运行上面的三个任务则是不能容错和承压的。所以接下来项目在设计上让这三个任务或者说三个组件是分开的三个进程。然后这三个进程之间通信采用套接字形式，也因此现在该持续集成系统具有分布式的特性了。

这种分布式设计进一步可以引入计算机架构设计上的故障切换机制，即某个机器发生故障了，马上另外一个备用的机器将会顶替其工作。

我对该项目代码进行了一些修改，具体参见 [a358003542/500lines_ci: 500lines a continuous integration system (github.com)](https://github.com/a358003542/500lines_ci) 。项目python代码更新为了python3版本。项目为了更具平台扩展性使用gitpython而不适用sh脚本。



## 观察组件

观察组件是 `repo_observer.py` 文件。

```python
import argparse
import os
import socket
import time

from git import Repo
from loguru import logger

from helpers import COMMIT_ID_FILE, run_or_fail, communicate
from helpers import COMMUNICATE_OK, COMMUNICATE_STATUS

logger.add("repo_observer.log")


def poll():
    parser = argparse.ArgumentParser()
    parser.add_argument("--dispatcher-server",
                        help="dispatcher host:port, " \
                             "by default it uses localhost:8888",
                        default="localhost:8888",
                        action="store")
    parser.add_argument("repo", metavar="REPO", type=str,
                        help="path to the repository this will observe")
    args = parser.parse_args()
    dispatcher_host, dispatcher_port = args.dispatcher_server.split(":")

    while True:
        update_repo(args.repo)

        if os.path.isfile(COMMIT_ID_FILE):
            try:
                response = communicate(dispatcher_host,
                                       int(dispatcher_port),
                                       COMMUNICATE_STATUS)
            except socket.error as e:
                raise Exception(
                    "Could not communicate with dispatcher server: %s" % e)
            if response == COMMUNICATE_OK:
                commit = ""
                with open(COMMIT_ID_FILE, "r") as f:
                    commit = f.readline()

                response = communicate(dispatcher_host,
                                       int(dispatcher_port),
                                       f"dispatch:{commit}")
                if response != COMMUNICATE_OK:
                    raise Exception("Could not dispatch the test: %s" %
                                    response)
                logger.debug("dispatched!")
            else:
                # Something wrong happened to the dispatcher
                raise Exception("Could not dispatch the test: %s" %
                                response)
        time.sleep(5)


def update_repo(path):
    repo = Repo(path)
    git = repo.git

    run_or_fail(git.reset, args=('HEAD',), kwargs={'hard': True},
                info='Could not reset git')

    # get the most recent commit
    log_info = run_or_fail(git.log, args=('-n1',),
                           info="Could not call 'git log' on repository")

    last_commit_id = log_info.split()[1]

    run_or_fail(git.pull,
                info="Could not pull from repository")

    new_log_info = run_or_fail(git.log, args=('-n1',),
                               info="Could not call 'git log' on repository")

    new_commit_id = new_log_info.split()[1]

    if new_commit_id != last_commit_id:
        logger.debug('found changes.')
        with open(COMMIT_ID_FILE, 'wt', encoding='utf8') as f:
            print(new_commit_id, file=f)


if __name__ == "__main__":
    poll()

```

观察组件通过分析clone的观察仓库的commit_it和更新仓库后的commit_id，如果发现不同，则说明仓库代码有变化，那么将会把最新的commit_id写入一个文件中。

后面发现了这个文件将会向任务分发器发送一个信号，分发一个新的任务。观察组件套接字信号交流上很简单，此外还有一个状态确认和OK返回。

## 任务分发器

任务分发器是 `dispatcher.py` 。

```python

import argparse
import os
import re
import socket
import socketserver
import time
import threading

from loguru import logger

from helpers import communicate, COMMUNICATE_PING, COMMUNICATE_PONG, \
    COMMUNICATE_STATUS, COMMUNICATE_OK, COMMUNICATE_REGISTER, \
    COMMUNICATE_DISPATCH, COMMUNICATE_RESULT

logger.add("dispatcher.log")


# Shared dispatcher code
def dispatch_tests(server, commit_id):
    # NOTE: usually we don't run this forever
    while True:
        logger.debug("trying to dispatch to runners")
        for runner in server.runners:
            response = communicate(runner["host"],
                                   int(runner["port"]),
                                   f"runtest:{commit_id}")
            if response == COMMUNICATE_OK:
                logger.debug(f"adding id {commit_id}")
                server.dispatched_commits[commit_id] = runner
                if commit_id in server.pending_commits:
                    server.pending_commits.remove(commit_id)
                return  # first response runner
        time.sleep(2)


class ThreadingTCPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    runners = []  # Keeps track of test runner pool
    dead = False  # Indicate to other threads that we are no longer running
    dispatched_commits = {}  # Keeps track of commits we dispatched
    pending_commits = []  # Keeps track of commits we have yet to dispatch


class DispatcherHandler(socketserver.BaseRequestHandler):
    """
    The RequestHandler class for our dispatcher.
    This will dispatch test runners against the incoming commit
    and handle their requests and test results
    """

    command_re = re.compile(r"(\w+)(:.+)*")
    BUF_SIZE = 1024

    def handle(self):
        # self.request is the TCP socket connected to the client
        self.data = self.request.recv(self.BUF_SIZE).decode().strip()

        command_groups = self.command_re.match(self.data)
        if not command_groups:
            self.request.sendall("Invalid command".encode())
            return

        command = command_groups.group(1)
        if command == COMMUNICATE_STATUS:
            logger.debug("COMMUNICATE_STATUS")

            self.request.sendall(COMMUNICATE_OK.encode())

        elif command == COMMUNICATE_REGISTER:
            address = command_groups.group(2)
            host, port = re.findall(r":(\w*)", address)
            runner = {"host": host, "port": port}
            logger.debug(f"COMMUNICATE_REGISTER: runner on {host}:{port}")

            self.server.runners.append(runner)
            self.request.sendall(COMMUNICATE_OK.encode())

        elif command == COMMUNICATE_DISPATCH:
            logger.debug("COMMUNICATE_DISPATCH")
            commit_id = command_groups.group(2)[1:]
            if not self.server.runners:
                self.request.sendall("No runners are registered".encode())
            else:
                # The coordinator can trust us to dispatch the test
                self.request.sendall(COMMUNICATE_OK.encode())
                dispatch_tests(self.server, commit_id)

        elif command == COMMUNICATE_RESULT:
            logger.debug("COMMUNICATE_RESULT")
            results = command_groups.group(2)[1:]
            results = results.split(":")
            commit_id = results[0]
            length_msg = int(results[1])
            # 3 is the number of ":" in the sent command
            remaining_buffer = self.BUF_SIZE - (
                    len(command) + len(commit_id) + len(results[1]) + 3)
            if length_msg > remaining_buffer:
                self.data += self.request.recv(
                    length_msg - remaining_buffer).decode().strip()
            del self.server.dispatched_commits[commit_id]

            if not os.path.exists("test_results"):
                os.makedirs("test_results")

            with open("test_results/%s" % commit_id, "w") as f:
                data = self.data.split(":")[3:]
                data = "\n".join(data)
                f.write(data)

            self.request.sendall(COMMUNICATE_OK.encode())
        else:
            self.request.sendall("Invalid command".encode())


def serve():
    parser = argparse.ArgumentParser()
    parser.add_argument("--host",
                        help="dispatcher's host, by default it uses localhost",
                        default="localhost",
                        action="store")
    parser.add_argument("--port",
                        help="dispatcher's port, by default it uses 8888",
                        default=8888,
                        action="store")
    args = parser.parse_args()

    # Create the server
    server = ThreadingTCPServer((args.host, int(args.port)), DispatcherHandler)
    logger.debug(f'serving on {args.host}:{int(args.port)}')

    # Create a thread to check the runner pool
    def runner_checker(server):
        def manage_commit_lists(runner):
            for commit, assigned_runner in server.dispatched_commits.items():
                if assigned_runner == runner:
                    del server.dispatched_commits[commit]
                    # runner is not ok, remove it to pending list
                    server.pending_commits.append(commit)
                    break
            server.runners.remove(runner)

        while not server.dead:
            time.sleep(1)
            for runner in server.runners:
                try:
                    response = communicate(runner["host"],
                                           int(runner["port"]),
                                           COMMUNICATE_PING)
                    if response != COMMUNICATE_PONG:
                        logger.debug(f"removing runner {runner}")
                        manage_commit_lists(runner)
                except socket.error as e:
                    manage_commit_lists(runner)

    # this will kick off tests that failed
    def redistribute(server):
        while not server.dead:
            for commit in server.pending_commits:
                logger.debug("running redistribute")
                logger.debug(server.pending_commits)
                dispatch_tests(server, commit)
                time.sleep(5)

    runner_heartbeat = threading.Thread(target=runner_checker, args=(server,))
    redistributor = threading.Thread(target=redistribute, args=(server,))

    try:
        runner_heartbeat.start()
        redistributor.start()
        # Activate the server; this will keep running until you
        # interrupt the program with Ctrl+C or Cmd+C
        server.serve_forever()
    except (KeyboardInterrupt, Exception):
        # if any exception occurs, kill the thread
        server.dead = True

        runner_heartbeat.join()
        redistributor.join()


if __name__ == "__main__":
    serve()

```

任务分发器在任务上和套接字信号上稍微复杂了一点。后面那两个子线程任务主要就是完成这个工作：任务运行器健康度检查，如果某个任务运行器突然挂掉了，那么将会把之前分配给的任务再发一次。

核心流程继续之前的dispatch命令来就直接运行`dispatch_tests` 来实际分发任务了。

任务分发器在套接字信号上一是STATUS-OK回报，一是任务运行器刚开始需要在任务分发器这边注册的。最后RESULT只是一个后续任务运行之后结果收集机制。

## 任务运行器

任务运行器是 `test_runner.py` 这个文件。

```python

import argparse
import errno
import os
import re
import socket
import socketserver
import time
import threading
import unittest

from git import Repo
from loguru import logger

from helpers import run_or_fail, communicate, COMMIT_ID_FILE, COMMUNICATE_OK, \
    COMMUNICATE_STATUS, COMMUNICATE_PING, COMMUNICATE_PONG, COMMUNICATE_RUNTEST, \
    COMMUNICATE_RESULT

logger.add("test_runner.log")


class ThreadingTCPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    dispatcher_server = None
    # Holds the dispatcher server host/port information
    last_communication = None
    # Keeps track of last communication from dispatcher
    busy = False  # Status flag
    dead = False  # Status flag


class TestHandler(socketserver.BaseRequestHandler):
    """
    The RequestHandler class for our server.
    """

    command_re = re.compile(r"(\w+)(:.+)*")

    def handle(self):
        # self.request is the TCP socket connected to the client
        self.data = self.request.recv(1024).decode().strip()
        command_groups = self.command_re.match(self.data)
        command = command_groups.group(1)

        if not command:
            self.request.sendall("Invalid command".encode())
            return
        if command == COMMUNICATE_PING:
            logger.debug("COMMUNICATE_PING")
            self.server.last_communication = time.time()
            self.request.sendall(COMMUNICATE_PONG.encode())

        elif command == COMMUNICATE_RUNTEST:
            logger.debug(f"got runtest command: am I busy? {self.server.busy}")
            if self.server.busy:
                logger.debug("COMMUNICATE_BUSY")
                self.request.sendall("BUSY".encode())
            else:
                self.request.sendall(COMMUNICATE_OK.encode())
                logger.debug("COMMUNICATE_RUNTEST")
                commit_id = command_groups.group(2)[1:]
                self.server.busy = True
                self.run_tests(commit_id,
                               self.server.repo_folder)
                self.server.busy = False
        else:
            self.request.sendall("Invalid command".encode())

    def run_tests(self, commit_id, repo_folder):
        # update git repo
        test_runner_script(repo_folder, commit_id)

        if os.path.exists("results"):
            os.remove("results")

        # run the tests
        test_folder = os.path.join(repo_folder, "tests")
        suite = unittest.TestLoader().discover(test_folder)
        result_file = open("results", "w")
        unittest.TextTestRunner(result_file).run(suite)
        result_file.close()

        with open("results", 'r') as result_file:
            # give the dispatcher the results
            output = result_file.read()
            communicate(self.server.dispatcher_server["host"],
                        int(self.server.dispatcher_server["port"]),
                        f"{COMMUNICATE_RESULT}:{commit_id}:{len(output)}:{output}")


def serve():
    range_start = 8900
    parser = argparse.ArgumentParser()
    parser.add_argument("--host",
                        help="runner's host, by default it uses localhost",
                        default="localhost",
                        action="store")
    parser.add_argument("--port",
                        help="runner's port, by default it uses values >=%s" % range_start,
                        action="store")
    parser.add_argument("--dispatcher-server",
                        help="dispatcher host:port, by default it uses " \
                             "localhost:8888",
                        default="localhost:8888",
                        action="store")
    parser.add_argument("repo", metavar="REPO", type=str,
                        help="path to the repository this will observe")
    args = parser.parse_args()

    runner_host = args.host
    runner_port = None
    tries = 0
    if not args.port:
        runner_port = range_start
        while tries < 100:
            try:
                server = ThreadingTCPServer((runner_host, runner_port),
                                            TestHandler)
                logger.debug(server)
                logger.debug(runner_port)
                break
            except socket.error as e:
                if e.errno == errno.EADDRINUSE:
                    tries += 1
                    runner_port = runner_port + tries
                    continue
                else:
                    raise e
        else:
            raise Exception("Could not bind to ports in range %s-%s" % (
                range_start, range_start + tries))
    else:
        runner_port = int(args.port)
        server = ThreadingTCPServer((runner_host, runner_port), TestHandler)

    server.repo_folder = args.repo

    dispatcher_host, dispatcher_port = args.dispatcher_server.split(":")
    server.dispatcher_server = {"host": dispatcher_host,
                                "port": dispatcher_port}

    response = communicate(server.dispatcher_server["host"],
                           int(server.dispatcher_server["port"]),
                           "register:%s:%s" %
                           (runner_host, runner_port))

    if response != COMMUNICATE_OK:
        raise Exception("Can't register with dispatcher!")
    else:
        # first register runner need init last_communication
        server.last_communication = time.time()

    def dispatcher_checker(server):
        # Checks if the dispatcher went down. If it is down, we will shut down
        # if since the dispatcher may not have the same host/port
        # when it comes back up.
        while not server.dead:
            time.sleep(5)
            if (time.time() - server.last_communication) > 10:
                try:
                    response = communicate(
                        server.dispatcher_server["host"],
                        int(server.dispatcher_server["port"]),
                        COMMUNICATE_STATUS)
                    if response != COMMUNICATE_OK:
                        logger.debug("Dispatcher is no longer functional")
                        server.shutdown()
                        return
                except socket.error as e:
                    logger.error("Can't communicate with dispatcher: {e}")
                    server.shutdown()
                    return

    t = threading.Thread(target=dispatcher_checker, args=(server,))
    try:
        t.start()
        # Activate the server; this will keep running until you
        # interrupt the program with Ctrl-C
        server.serve_forever()
    except (KeyboardInterrupt, Exception):
        # if any exception occurs, kill the thread
        server.dead = True
        t.join()


def test_runner_script(path, commit_id):
    if os.path.exists(COMMIT_ID_FILE):
        os.remove(COMMIT_ID_FILE)

    repo = Repo(path)
    git = repo.git

    run_or_fail(git.clean, args=('-d', '-f', '-x'),
                info='Could not clean repository')
    run_or_fail(git.pull, info='Could not call git pull')
    run_or_fail(git.reset, args=(commit_id,), kwargs={'hard': True},
                info='Could not update to given commit hash')


if __name__ == "__main__":
    serve()

```

任务运行器一是刚开始需要向任务分发器回报，其次任务分发器那边会不断地询问各个人物运行器的健康度，任务运行器这边需要写好PING-PONG消息机制。

后面还多一个子线程是一种完善策略，保证任务分发器挂掉了这边任务运行器也会自动结束。

任务运行首先更新git仓库，然后通过unittest来运行tests文件夹下的测试代码，结果临时保存到了results文件下面。然后继续利用利用搭建好的套接字交流机制来通过result命令将运行后的结果发给任务分发器。

## 总结

最后运行仍然和原来一样：

```
python dispatcher.py
python test_runner.py <path/to/test_repo_clone_runner>
python repo_observer.py --dispatcher-server=localhost:8888 <path/to/repo_clone_obs>
```

对原仓库进行了文件更改，将会触发dispatch，继而触发任务分发器的runtest命令。

值得一提的是 `dispatched_commits` 里面的runner记录是必须在后面result报告完之后才会被删除，如果在这个过程中某个runner挂掉了，那么任务分发器的那个任务仍然是未完成状态，等下你再启动一个新的runner，将会分配任务给这个新的runner。

这个项目在分布式任务管理上的设计值得学习体会，同时上面的编码会大量涉及到套接字相关网络编程的东西，这些基础知识也需要读者掌握。