#!/usr/bin/env python
# -*-coding:utf-8-*-


"""
run.bat 在windows下运行方便点 对应的就是 build 命令

"""

import click
import subprocess
import os
import shutil
from pathlib import Path
import threading

PROJECT = 'myblog'
BASEDIR = os.getcwd()
INPUTDIR = os.path.join(BASEDIR, 'content')
OUTPUTDIR = os.path.join(BASEDIR, 'dev_output')
PUBLISHDIR = os.path.join(BASEDIR, 'docs')
CONFFILE = os.path.join(BASEDIR, 'pelicanconf.py')
PUBLISHCONF = os.path.join(BASEDIR, 'publishconf.py')
PORT = 9000


@click.group()
def main():
    pass


def copy_mathjax(dest):
    mathjax_foldername = 'MathJax-2.7.7'
    dest_folder = os.path.join(dest, mathjax_foldername)
    if os.path.exists(dest_folder):
        click.echo(f'{mathjax_foldername} already exists.')
    else:
        shutil.copytree(mathjax_foldername, dest_folder)
        click.echo(f'{mathjax_foldername} copyed.')


@main.command()
def devserve():
    """
    devbuild your pelican project
    """
    click.echo("start devbuild your pelican project...")
    
    # copy_mathjax(OUTPUTDIR)
    
    def devbuild():
        cmd = "pelican -r {INPUTDIR} -o {OUTPUTDIR} -s {CONFFILE}".format(
            INPUTDIR=INPUTDIR,
            OUTPUTDIR=OUTPUTDIR,
            CONFFILE=CONFFILE
        )
        click.echo('start run cmd: {0}'.format(cmd))
        subprocess.call(cmd, shell=True)

    def serve():
        while not os.path.exists(OUTPUTDIR):
            import time
            time.sleep(1)

        os.chdir(OUTPUTDIR)
        serve_cmd = 'python -m http.server {PORT}'.format(PORT=PORT)
        click.echo('start run cmd: {0}'.format(serve_cmd))
        subprocess.call(serve_cmd, shell=True)

    t0 = threading.Thread(target=devbuild)
    t0.start()

    t = threading.Thread(target=serve)
    t.start()

    threads = []
    threads.append(t0)
    threads.append(t)

    for t in threads:
        try:
            t.join()
        except KeyboardInterrupt as e:
            print('用户取消了')


@main.command()
def build():
    """
    build your pelican project
    """
    click.echo("start build your pelican project...")
    # copy_mathjax(PUBLISHDIR)
    
    cmd = "pelican {INPUTDIR} -o {PUBLISHDIR} -s {PUBLISHCONF}".format(
        INPUTDIR=INPUTDIR,
        PUBLISHCONF=PUBLISHCONF,
        PUBLISHDIR=PUBLISHDIR
    )

    click.echo('start run cmd: {0}'.format(cmd))
    ret = subprocess.call(cmd, shell=True)

    click.echo('running result is:{0}'.format(ret))

    


@main.command()
def devclean():
    """
    clean your dev output
    """
    click.echo("start clean your output folder...")
    rm(OUTPUTDIR, recursive=True)


def normalized_path_obj(path='.'):
    """
    默认支持 ~ 符号

    返回的是 Path 对象
    :param path:
    :return:
    """
    if isinstance(path, Path):
        return path.expanduser()
    elif isinstance(path, str):
        if path.startswith('~'):
            path = os.path.expanduser(path)
        return Path(path)
    else:
        raise TypeError


def rm(path, recursive=False):
    """
    the function can remove file or empty directory(default).

    use `shutil.rmtree` to remove the non-empty directory,you need add `recursive=True`

    """
    path = normalized_path_obj(path)
    if recursive:
        shutil.rmtree(path)
    else:
        if path.is_file():
            path.unlink()
        else:
            path.rmdir()


if __name__ == '__main__':
    main()
