#!/usr/bin/env python
# -*- coding: utf-8 -*- #

import os
import sys
from pathlib import Path

from pywander.pathlib import gen_allfile

BASE_DIR = Path(__file__).resolve().parent
sys.path.append(str(BASE_DIR))

# apply patches
import mypatches

# article.summary 最大长度 搜索功能也是基于此 网页显示再适当截断
SUMMARY_MAX_LENGTH = 1000

# set the author metadata
AUTHOR = 'wanze'

# the filename decide the title metadata
FILENAME_METADATA = '(?P<title>.*)'

# set default category
DEFAULT_CATEGORY = 'other'
# the sub folder name not decide the category name
USE_FOLDER_AS_CATEGORY = True
# show the pages
DISPLAY_PAGES_ON_MENU = True

SITENAME = "万泽的博客"
SITEURL = ''

PATH = 'content'
ARTICLE_PATHS = ['articles']
ARTICLE_EXCLUDES = []

TIMEZONE = 'Asia/Shanghai'

# set default date
DEFAULT_DATE = 'fs'
DEFAULT_LANG = 'zh_cn'

DEFAULT_DATE_FORMAT = '%Y年 %b %-d日'

#  disable feed generation
FEED_ATOM = None
FEED_RSS = None
FEED_ALL_ATOM = None
FEED_ALL_RSS = None
CATEGORY_FEED_ATOM = None
CATEGORY_FEED_RSS = None
TRANSLATION_FEED_ATOM = None
TRANSLATION_FEED_RSS = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None
TAG_FEED_ATOM = None
TAG_FEED_RSS = None


# 不要自动删除的文件
OUTPUT_RETENTION = [".git"]

# Blog roll
LINKS = (('MyGitHub', 'http://www.github.com/a358003542'),
         ('MyEmail', 'a358003542@outlook.com'),)

# Uncomment following line if you want document-relative URLs when developing
# RELATIVE_URLS = True

# static path copy it to the destination
STATIC_PATHS = ['images',
                'data',
                'extra',
                'html_pages',
                ]

EXTRA_PATH_METADATA = {
    'extra/favicon.ico': {'path': 'favicon.ico'},
}

ARTICLE_URL = 'articles/{slug}.html'  # articles 里面的内容
ARTICLE_SAVE_AS = ARTICLE_URL
PAGE_URL = '{slug}.html'  # pages 文件夹里面的内容
PAGE_SAVE_AS = PAGE_URL


# disable author page
AUTHOR_URL = 'author/{slug}.html'
AUTHOR_SAVE_AS = ''
# disable category page
CATEGORY_URL = 'categorys/{slug}/index.html'
CATEGORY_SAVE_AS = ''
# disable tag page
TAG_URL = 'tags/{slug}.html'
TAG_SAVE_AS = ''



######################### MARKDOWN CONFIG #################
from markdown.extensions.toc import slugify_unicode
MARKDOWN = {
    'extensions': [
        'codehilite',
        'toc',
        'fenced_code',
        'extra',
        'meta',
        'footnotes',
        'md4mathjax'
    ],
    'extension_configs': {
        'codehilite': {'css_class': 'highlight',
                       'guess_lang': False},
        'toc':{
            'toc_depth': '2-3',
            'slugify': slugify_unicode
        }
    },
    'output_format': 'html',
}
#############################################################


################## theme ##########################
# changing theme
THEME = 'mytheme'

SITE_DESCRIPTION = '欢迎来到本网站，希望本网站的文章能够对您有所帮助。'



########################## template ############################
# need articles or dates or page_name jinja2 env variables
DIRECT_TEMPLATES = ['index', 'categories', 'archives']

# disable parse html
READERS = {'html': None}

# auto add template pages
# not include the articles and dates jinja2 env variables
template_file_startpath = 'content/template_pages'
TEMPLATE_PAGES = {}
for template_src in gen_allfile(startpath=template_file_startpath, filetype="html$"):
    template_dest = template_src
    template_src = os.path.join('template_pages', template_src)
    TEMPLATE_PAGES[template_src] = template_dest



################################### plugin #################
PLUGIN_PATHS = ['myplugins']

PLUGINS = ['extract_toc', 'search_content', 'sitemap', 'pandoc_html', 'bookref']


SITEMAP = {
    'format': 'xml',
    'priorities': {
        'articles': 0.8,
        'indexes': 0.2,
        'pages': 0.5
    },
    'changefreqs': {
        'articles': 'weekly',
        'indexes': 'weekly',
        'pages': 'monthly'
    },
    'exclude': ['tags/', 'categorys/']
}

##################################################################
BOOKREFAUTHOR_SAVE_AS = 'bookref_author/{slug}.html'
BOOKREFAUTHOR_URL = 'bookref_author/{slug}.html'


def archives_dates_to_json(dates):
    result = []
    for article in dates:
        item = {
            "url": article.url,
            "title": article.title,
            "subtitle": article.subtitle if hasattr(article, "subtitle") else "",
            "datetime": article.date.isoformat(),
            "locale_date": article.locale_date,
        }
        result.append(item)
    return result


JINJA_FILTERS = {
    "archives_dates_to_json": archives_dates_to_json,
}
