
import gorilla
from pelican.contents import Content, memoized

from bs4 import BeautifulSoup

gs = gorilla.Settings(allow_hit=True)


"""


"""


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


@memoized
def get_summary(self, siteurl):
    """Returns the summary of an article.

    This is based on the summary metadata if set, otherwise truncate the
    content.
    """
    if 'summary' in self.metadata:
        return self.metadata['summary']

    if self.settings['SUMMARY_MAX_LENGTH'] is None:
        return self.content

    content = self.content

    text = clean_html_content(content)

    # origin_length = len(text)

    text = text[:self.settings['SUMMARY_MAX_LENGTH']]
    # current_length = len(text)

    # if origin_length > current_length:
    #     text += self.settings['SUMMARY_END_SUFFIX']

    return text


patch = gorilla.Patch(Content, 'get_summary', get_summary, settings=gs)
gorilla.apply(patch)