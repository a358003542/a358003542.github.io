# -*- coding: utf-8 -*-

import logging
import os.path
import json
from codecs import open
from fenci.segment import Segment
from pelican import signals

logger = logging.getLogger(__name__)
seg = Segment()

"""
{'url': {}}
"""
search_content = {}


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
    words = words[:1000]

    page_text = " ".join(words)
    return page_text


def add_search_content(generator, content):
    article = content

    if getattr(article, "status", "published") != "published":
        return

    source_path = article.source_path
    title = article.title
    content = article.content
    url = article.url

    with open(source_path, "r", encoding="utf-8-sig") as infile:
        raw_content = infile.read()

        from .convert_to_plain_text import convert_to_plain_text

        page_text = convert_to_plain_text(raw_content)

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
