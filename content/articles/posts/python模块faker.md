Slug: python-module-faker
Date: 20191018

[TOC]


## 简介

faker模块是一个很有特色的模块，所以其在github上得到的star也较多。其可以用来生成一些伪数据，比如用来做测试用途等等。其github项目地址在 [这里](https://github.com/joke2k/faker) 。

该项目支持pip安装:

    pip install Faker

其使用还是很简单的，大概如下所示:

```python
from faker import Factory

faker = Factory.create()

for i in range(50):
    print(faker.name())
```

然后中文名字例子如下，就是在Factory的create方法那里指定语言locale（默认是"en\_EN"）:

```python
from faker import Factory

faker = Factory.create('zh_CN')

for i in range(100):
    print(faker.name())
```

## faker所含方法清单

-   **address():** 地址
-   **text():** 显示一段随机文本，没有中文化。
-   **mime\_type():** model/x3d+xml
-   **chrome():** 随机的user\_agent , 这个很有用。
-   **firefox():** 火狐随机user\_agent
-   **internet\_explorer():** ie随意user\_agent
-   **opera():** opera
-   **safari():** safari
-   **user\_agent():** 更加浏览器随意的user\_agent
-   **phone\_number():** 随意的电话号码
-   **boolean():** 随意的bool值
-   **country\_code():** 城市代码
-   **language\_code():** en
-   **locale():** zh\_CN
-   **md5():** 随意的md5值
-   **null\_boolean():** None or True or False
-   **sha1():** sha1值
-   **sha256():** 随意sha256值

此外还有:

    fake.linux_platform_token()        # X11; Linux x86_64
    fake.linux_processor()             # x86_64
    fake.mac_platform_token()          # Macintosh; U; PPC Mac OS X 10_7_6
    fake.mac_processor()                # U; PPC
    fake.windows_platform_token()      # Windows 98; Win 9x 4.90
    
    fake.company_email()               # ggreenfelder@ortizmedhurst.com
    fake.domain_name()                 # mayer.com
    fake.domain_word()                 # gusikowski
    fake.email()                       # gbrakus@johns.net
    fake.free_email()                  # abbey60@yahoo.com
    fake.free_email_domain()           # hotmail.com
    fake.ipv4()                        # 81.132.249.71
    fake.ipv6()                        # 4c55:8c8b:54b5:746d:44ed:c7ab:486a:a50e
    fake.safe_email()                  # amalia49@example.com
    fake.slug()                        # TypeError
    fake.tld()                         # net
    fake.uri()                         # http://www.parker.com/
    fake.uri_extension()               # .asp
    fake.uri_page()                    # terms
    fake.uri_path()                    # explore/list/app
    fake.url()                         # http://dubuque.info/
    fake.user_name()                   # goodwin.edwin
    
    fake.bs()                          # maximize end-to-end infrastructures
    fake.catch_phrase()                # Multi-tiered analyzing instructionset
    fake.company()                     # Stanton-Luettgen
    fake.company_suffix()              # Group
    
    fake.am_pm()                       # AM
    fake.century()                     # IX
    fake.date()                        # 1985-02-17
    fake.date_time()                   # 1995-06-08 14:46:50
    fake.date_time_ad()                # 1927-12-17 23:08:46
    fake.date_time_between()           # 1999-08-22 22:49:52
    fake.date_time_this_century()      # 1999-07-24 23:35:49
    fake.date_time_this_decade()       # 2008-01-27 01:08:37
    fake.date_time_this_month()        # 2012-11-12 14:13:04
    fake.date_time_this_year()         # 2012-05-19 00:40:00
    fake.day_of_month()                # 23
    fake.day_of_week()                 # Friday
    fake.iso8601()                     # 2009-04-09T21:30:02
    fake.month()                       # 03
    fake.month_name()                  # April
    fake.time()                        # 06:16:50
    fake.timezone()                    # America/Noronha
    fake.unix_time()                   # 275630166
    fake.year()                        # 2002
    
    fake.first_name()                  # Elton
    fake.last_name()                   # Schowalter
    fake.name()                        # Susan Pagac III
    fake.prefix()                      # Ms.
    fake.suffix()                      # V
    
    fake.address()                     # 044 Watsica Brooks
                                         West Cedrickfort, SC 35023-5157
    fake.building_number()             # 319
    fake.city()                        # Kovacekfort
    fake.city_prefix()                 # New
    fake.city_suffix()                 # ville
    fake.country()                     # Monaco
    fake.geo_coordinate()              # 148.031951
    fake.latitude()                    # 154.248666
    fake.longitude()                   # 109.920335
    fake.postcode()                    # 82402-3206
    fake.secondary_address()           # Apt. 230
    fake.state()                       # Nevada
    fake.state_abbr()                  # NC
    fake.street_address()              # 793 Haskell Stravenue
    fake.street_name()                 # Arvilla Valley
    fake.street_suffix()               # Crescent
    
    fake.paragraph()                   # Itaque quia harum est autem inventore quisquam eaque. Facere mollitia repudiandae
                                         qui et voluptas. Consequatur sunt ullam blanditiis aliquam veniam illum voluptatem.
    fake.paragraphs()                  # ['Alias porro soluta eum voluptate. Iste consequatur qui non nam.',
                                            'Id eum sint eius earum veniam fugiat ipsum et. Et et occaecati at labore
                                            amet et. Rem velit inventore consequatur facilis. Eum consequatur consequatur
                                            quis nobis.', 'Harum autem autem totam ex rerum adipisci magnam adipisci.
                                            Qui modi eos eum vel quisquam. Tempora quas eos dolorum sint voluptatem
                                            tenetur cum. Recusandae ducimus deleniti magnam ullam adipisci ipsa.']
    fake.sentence()                    # Eum magni soluta unde minus nobis.
    fake.sentences()                   # ['Ipsam eius aut veritatis iusto.',
                                            'Occaecati libero a aut debitis sunt quas deserunt aut.',
                                            'Culpa dolor voluptatum laborum at et enim.']
    fake.text()                        # Dicta quo eius possimus quae eveniet cum nihil. Saepe sint non nostrum.
                                         Sequi est sit voluptate et eos eum et. Pariatur non sunt distinctio magnam.
    fake.word()                        # voluptas
    fake.words()                       # ['optio', 'et', 'voluptatem']

## 设置随机种子

    from faker import Faker
    fake = Faker()
    fake.seed(4321)
    
    print fake.name()   # Margaret Boehm

## 语言locale代码

    bg_BG - Bulgarian
    cs_CZ - Czech
    de_DE - German
    dk_DK - Danish
    el_GR - Greek
    en_CA - English (Canada)
    en_GB - English (Great Britain)
    en_US - English (United States)
    es_ES - Spanish (Spain)
    es_MX - Spanish (Mexico)
    fa_IR - Persian (Iran)
    fi_FI - Finnish
    fr_FR - French
    hi_IN - Hindi
    it_IT - Italian
    ja_JP - Japanese
    ko_KR - Korean
    lt_LT - Lithuanian
    lv_LV - Latvian
    ne_NP - Nepali
    nl_NL - Dutch (Netherlands)
    no_NO - Norwegian
    pl_PL - Polish
    pt_BR - Portuguese (Brazil)
    pt_PT - Portuguese (Portugal)
    ru_RU - Russian
    sl_SI - Slovene
    sv_SE - Swedish
    tr_TR - Turkish
    zh_CN - Chinese (China)
    zh_TW - Chinese (Taiwan)