# -*- coding: utf-8 -*-

import logging
import os.path
import json
from codecs import open

from bs4 import BeautifulSoup
from fenci.segment import Segment
from pelican import signals

logger = logging.getLogger(__name__)
seg = Segment()

"""
{'url': {}}
"""
search_content = {}



def clean_html_content(html_content):
    """
    用beautifulsoup4 来进行一些网页清洗工作
    """
    soup = BeautifulSoup(html_content, 'html5lib')

    # remove pre code
    for s in soup.find_all('pre'):
        s.extract()

    page_text = soup.get_text()

    return page_text

def process_text(page_text):
    """
    分词和一些自然语言处理
    """
    # 分词加空格
    dict_path = os.path.join(os.path.dirname(__file__), "blog_dict.txt")

    seg.load_userdict(dict_path)

    # 分词方便搜索
    words = seg.lcut(page_text)

    # 停用词去除
    from pywander.nlp.nltk_stopwords import multiple_stopwords

    stopwords = multiple_stopwords("english", "chinese")

    words = [word for word in words if word not in stopwords]

    # limit length to 1000
    # words = words[:1000]

    page_text = " ".join(words)
    return page_text


def add_search_content(generator, content):
    article = content

    if getattr(article, "status", "published") != "published":
        return

    title = article.title
    url = article.url
    page_text = article.summary

    node = {
        "url": url,
        "title": process_text(title),
        "text": process_text(page_text),
    }

    search_content[url] = node


def search_content_output(pelican_obj):
    output_path = pelican_obj.output_path
    path = os.path.join(output_path, "search_content.json")

    with open(path, "w", encoding="utf-8-sig") as fd:
        json.dump(search_content, fd, ensure_ascii=False, indent=4)


def register():
    signals.article_generator_write_article.connect(add_search_content)
    signals.finalized.connect(search_content_output)
