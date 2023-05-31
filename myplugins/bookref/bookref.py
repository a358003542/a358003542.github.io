# -*- coding: utf-8 -*-

from pelican import signals
from collections import defaultdict
from pelican.urlwrappers import URLWrapper
from pelican.writers import Writer

class BookrefAuthor(URLWrapper):
    pass

def process_bookref_metadata(generator):
    generator.bookref_authors = defaultdict(list)

    for article in generator.articles:
        if article.template == 'bookref':
            bookauthors = getattr(article, 'bookauthor', '')
            if bookauthors:
                bookauthors = [i.strip() for i in bookauthors.split('&')]

                # 封装
                bookauthors = [BookrefAuthor(i, generator.settings) for i in bookauthors]

                article.bookref_authors = bookauthors

                for bookauthor in bookauthors:
                    generator.bookref_authors[bookauthor].append(article)

def process_bookref_output(generator, writer):
    bookref_author_template = generator.get_template('bookref_author')


    for aut, articles in generator.bookref_authors.items():
        dates = [article for article in generator.dates if article in articles]


        writer.write_file(aut.save_as, bookref_author_template, generator.context,
                url=aut.url, bookref_author=aut, articles=articles, dates=dates,
                template_name='bookref_author', blog=True,
                page_name=aut.page_name, all_articles=generator.articles)

def register():
    signals.article_generator_pretaxonomy.connect(process_bookref_metadata)

    signals.article_writer_finalized.connect(process_bookref_output)