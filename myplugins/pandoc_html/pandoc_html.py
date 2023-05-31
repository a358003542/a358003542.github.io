# -*- coding: utf-8 -*-
"""
pandoc_html
"""

from os import path
from bs4 import BeautifulSoup
from pelican import contents
from pelican.readers import HTMLReader
from pelican import signals
from pelican.utils import pelican_open

import logging

logger = logging.getLogger(__name__)


class PandocHtmlReader(HTMLReader):
    enabled = True

    file_extensions = ['pandochtml']

    def read(self, filename):
        """Parse content and metadata of HTML files"""
        with pelican_open(filename) as content:
            parser = self._HTMLParser(self.settings, filename)
            parser.feed(content)
            parser.close()

        metadata = {}
        for k in parser.metadata:
            metadata[k] = self.process_metadata(k, parser.metadata[k])
        
        return parser.body, metadata


def extract_phtml_toc(content):
    if isinstance(content, contents.Static):
        return

    soup = BeautifulSoup(content._content, 'html.parser')
    filename = content.source_path
    extension = path.splitext(filename)[1][1:]
    toc = None

    # pthml reader
    if not toc and PandocHtmlReader.enabled and extension in PandocHtmlReader.file_extensions:
        toc = soup.find('nav', id='TOC')

    if toc:
        toc.extract()
        content._content = soup.decode()
 
        toc.name = 'div'
        toc['class']  = 'toc'
        toc_content = toc.decode()

        content.toc = toc_content
        
        if content.toc.startswith('<html>'):
            content.toc = content.toc[12:-14]


def add_reader(readers):
    readers.reader_classes['pandochtml'] = PandocHtmlReader
    
def register():
    signals.readers_init.connect(add_reader)
    signals.content_object_init.connect(extract_phtml_toc)
