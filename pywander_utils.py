import re
import os
from pathlib import Path

def normalized_path(path: str | Path) -> str:
    """
    将路径规范化 支持 ~ 符号

    返回的是字符串
    """
    if isinstance(path, Path):
        return str(path.expanduser())
    elif isinstance(path, str):
        if path.startswith('~'):
            path = os.path.expanduser(path)
        return path
    else:
        raise TypeError
    
def to_absolute_path(path):
    """
    返回标准化的绝对路径
    在normalized_path的基础上还引入当前路径添加等
    """
    return os.path.abspath(normalized_path(path))

def gen_all_file(start_path='.', filetype="", exclude_folder_name=None):
    """
    利用os.walk 遍历某个目录，收集其内的文件，返回一系列的文件*绝对*路径。

    >>> list(gen_all_file('pywander', filetype='py$')) # doctest: +SKIP
['D:\\github\\pywander\\pywander\\cache.py',
 'D:\\github\\pywander\\pywander\\common.py',
 'D:\\github\\pywander\\pywander\\compat.py',
 'D:\\github\\pywander\\pywander\\config.py',
 ...

    第一个可选参数 start_path  默认值 '.'
    第二个可选参数  filetype  正则表达式模板 默认值是"" 其作用是只选择某些文件
    如果是空值，则所有的文件都将被选中。比如 "html$|pdf$" 将只选中 html和pdf文件。
    第三个可选参数 exclude_folder_name 列出一些想要排除文件夹的名字

    """
    for root, dirs, files in os.walk(start_path):
        if exclude_folder_name is not None:
            for exclude_folder in exclude_folder_name:
                if exclude_folder in dirs:
                    # 将不会再访问
                    dirs.remove(exclude_folder)

        folder_path = to_absolute_path(os.path.join(root))

        for file in files:
            file_path = os.path.join(folder_path, file)

            file_name, file_ext = os.path.splitext(file)
            if filetype:
                if re.search(filetype, file_ext):
                    yield file_path
            else:
                yield file_path


def gen_all_file2(start_path='.', filetype="", exclude_folder_name=None):
    """
    利用os.walk 遍历某个目录，收集其内的文件，返回一系列的文件的*相对*路径。

    >>> list(gen_all_file2('pywander', filetype='py$')) # doctest: +SKIP
['pywander\\cache.py',
 'pywander\\common.py',
...

    第一个可选参数 start_path  默认值 '.'
    第二个可选参数  filetype  正则表达式模板 默认值是"" 其作用是只选择某些文件
    如果是空值，则所有的文件都将被选中。比如 "html$|pdf$" 将只选中 html和pdf文件。
    第三个可选参数 exclude_folder_name 列出一些想要排除文件夹的名字

    """
    for file_path in gen_all_file(start_path=start_path, filetype=filetype,
                                  exclude_folder_name=exclude_folder_name):
        yield os.path.relpath(file_path)


def gen_all_file3(start_path='.', filetype="", exclude_folder_name=None):
    """
    利用os.walk 遍历某个目录，收集其内的文件，返回 (文件路径列表, 本路径下的文件列表)

    >>> list(gen_all_file3('pywander', filetype='py$')) # doctest: +SKIP
[(['pywander'], 'cache.py'),
 (['pywander'], 'common.py'),
 (['pywander'], 'compat.py'),
 (['pywander'], 'config.py'),
 ...

    第一个可选参数 start_path  默认值 '.'
    第二个可选参数  filetype  正则表达式模板 默认值是"" 其作用是只选择某些文件
    如果是空值，则所有的文件都将被选中。比如 "html$|pdf$" 将只选中 html和pdf文件。
    第三个可选参数 exclude_folder_name 列出一些想要排除文件夹的名字
    """
    for file_path in gen_all_file2(start_path=start_path, filetype=filetype,
                                  exclude_folder_name=exclude_folder_name):
        root, file_name = os.path.split(file_path)
        dirlist = root.split(os.path.sep)
        item = (dirlist, file_name)
        yield item

def remove_first_directory(path):
    """
    移除文件路径的第一个目录

    """
    path_split = path.split(os.path.sep)
    if len(path_split) > 1:
        return os.path.join(*path_split[1:])
    else:
        raise ValueError(f'输入有误，给定的文件路径没有目录')