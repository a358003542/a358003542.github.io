# -*- coding: utf-8 -*-
"""
Tipue Search
============

A Pelican plugin to serialize generated HTML to JSON
that can be used by jQuery plugin - Tipue Search.

Copyright (c) Talha Mansoor


updated by cdwanze 2019-03-08 for chinese

"""

from __future__ import unicode_literals

import logging
import os.path
import json
from bs4 import BeautifulSoup
from codecs import open
from fenci.segment import Segment

try:
    from urlparse import urljoin
except ImportError:
    from urllib.parse import urljoin

from pelican import signals

seg = Segment()

class Tipue_Search_JSON_Generator(object):

    def __init__(self, context, settings, path, theme, output_path, *null):

        self.output_path = output_path
        self.context = context
        self.siteurl = settings.get('SITEURL')
        self.tpages = settings.get('TEMPLATE_PAGES')
        self.output_path = output_path
        self.json_nodes = []

    def create_json_node(self, page):

        if getattr(page, 'status', 'published') != 'published':
            return

        soup_title = BeautifulSoup(page.title.replace('&nbsp;', ' '), 'html.parser')
        page_title = soup_title.get_text(' ', strip=True).replace('“', '"'). \
            replace('”', '"').replace('’', "'").replace('^', '&#94;')

        soup_text = BeautifulSoup(page.content, 'html.parser')

        # remove pre code
        for s in soup_text.find_all('pre'):
            s.extract()
        
        page_text = soup_text.get_text(' ', strip=True).replace('“', '"'). \
            replace('”', '"').replace('’', "'").replace('¶', ' ').replace('^', '&#94;')

        page_text = ' '.join(page_text.split())

        # limit length to 1000
        page_text = page_text[:1000]

        page_category = page.category.name if getattr(page, 'category', 'None') != 'None' else ''

        page_url = page.url if page.url else '.'

        # 分词加空格
        dict_path = os.path.join(os.path.dirname(__file__), 'blog_dict.txt')

        seg.load_userdict(dict_path)
 
        # 分词方便搜索
        words = seg.lcut(page_text)

        # 停用词去除
        from pywander.nlp.chinese_stop_words import STOP_WORDS
        words = [word for word in words if word not in STOP_WORDS]

        page_text = ' '.join(words)

        node = {'title': page_title,
                'text': page_text,
                'tags': page_category,
                'url': page_url}

        self.json_nodes.append(node)

    def create_tpage_node(self, srclink):

        srcfile = open(os.path.join(self.output_path, self.tpages[srclink]), encoding='utf-8')
        soup = BeautifulSoup(srcfile, 'html.parser')
        page_title = soup.title.string if soup.title is not None else ''
        page_text = soup.get_text()

        # Should set default category?
        page_category = ''
        page_url = urljoin(self.siteurl, self.tpages[srclink])

        node = {'title': page_title,
                'text': page_text,
                'tags': page_category,
                'url': page_url}

        self.json_nodes.append(node)

    def generate_output(self, writer):
        path = os.path.join(self.output_path, 'tipuesearch_content.json')

        pages = self.context['pages'] + self.context['articles']

        for article in self.context['articles']:
            pages += article.translations

        for srclink in self.tpages:
            self.create_tpage_node(srclink)

        all_pages = len(pages)
        excluded_url = [
            '404.html',
            'articles/du-qu-shu-ju.html',
            'articles/shu-ju-hui-tu.html'
        ]
        excluded_url += [f'{self.siteurl}/{url}' for url in excluded_url]
        count = 0
        for page in pages:
            if page.url in excluded_url:
                logging.debug(f'{page.url} skipped for tipue search process.')
                continue

            self.create_json_node(page)
            count += 1

            if count % 10 == 0:
                logging.debug('tipue search processed {percent} %'.format(percent=(count / all_pages) * 100))

        root_node = {'pages': self.json_nodes}

        with open(path, 'w', encoding='utf-8') as fd:
            json.dump(root_node, fd, separators=(',', ':'), ensure_ascii=False, indent=4)


def get_generators(generators):
    return Tipue_Search_JSON_Generator


def register():
    signals.get_generators.connect(get_generators)
