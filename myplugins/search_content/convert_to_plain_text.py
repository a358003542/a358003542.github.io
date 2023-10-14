from markdown import Extension, Markdown

from xml.etree.ElementTree import ProcessingInstruction
from xml.etree.ElementTree import Comment, ElementTree


"""
https://github.com/kostyachum/python-markdown-plain-text
"""


def _serialize_plain_text(write, elem):
    tag = elem.tag
    text = elem.text

    if tag is Comment:
        pass
    elif tag is ProcessingInstruction:
        pass
    elif tag is None:
        if text:
            write(text)
        for e in elem:
            _serialize_plain_text(write, e)
    else:
        if text:
            if text == "[TOC]":
                pass
            elif tag.lower() not in ["script", "style", "code"]:
                write(text)
        for e in elem:
            _serialize_plain_text(write, e)

    if elem.tail:
        write(elem.tail)


def _write_plain_text(root):
    assert root is not None
    data = []
    write = data.append
    _serialize_plain_text(write, root)
    return "".join(data)


def to_plain_text(element):
    return _write_plain_text(ElementTree(element).getroot())


class PlainTextExtension(Extension):
    def extendMarkdown(self, md):
        md.serializer = to_plain_text
        md.stripTopLevelTags = False

        md.set_output_format = lambda x: x


def convert_to_plain_text(text):
    """
    将markdown转成无标记的文本，额外的有code代码部分被移除了。
    """
    md = Markdown(extensions=[PlainTextExtension(), "meta"])
    return md.convert(text)
