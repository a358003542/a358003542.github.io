import os
from pelican import signals


def add_source_folder_to_articles(generator):
    """
    适配Windows/Linux/macOS，为文章添加source_folder属性（Pelican 4.11）
    """
    for article in generator.articles:
        # 1. 获取相对路径（兼容Windows路径格式）
        if hasattr(article, 'relative_source_path') and article.relative_source_path:
            relative_path = article.relative_source_path
            # 额外处理：Windows下relative_source_path可能混有/，统一转为os.sep
            relative_path = relative_path.replace('/', os.sep)
        else:
            content_dir = generator.settings.get('PATH', 'content')
            content_dir = os.path.abspath(content_dir)
            relative_path = os.path.relpath(article.filename, content_dir)

        # 2. 跨平台分割路径（核心：用os.sep而非硬编码）
        folder_parts = relative_path.split(os.sep)
        article.source_folder = folder_parts[0] if folder_parts else 'root'


def register():
    signals.article_generator_pretaxonomy.connect(add_source_folder_to_articles)