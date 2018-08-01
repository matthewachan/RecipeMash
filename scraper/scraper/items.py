# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# https://doc.scrapy.org/en/latest/topics/items.html

import scrapy
import re
import json
from scrapy.loader.processors import Join, MapCompose, TakeFirst

def trim_whitespace(string):
    return re.sub(' +', ' ', string)

def escape_quotes(string):
    return string.replace("'", "''")
    # return json.dumps(string)
    
class Recipe(scrapy.Item):
    # define the fields for your item here like:
    name = scrapy.Field(input_processor=MapCompose(trim_whitespace, escape_quotes), output_processor=Join())
    author= scrapy.Field(input_processor=MapCompose(trim_whitespace, escape_quotes), output_processor=Join())
    rating = scrapy.Field(input_processor=MapCompose(trim_whitespace, escape_quotes), output_processor=Join())
    published_date = scrapy.Field(input_processor=MapCompose(trim_whitespace, escape_quotes), output_processor=Join())
    description = scrapy.Field(input_processor=MapCompose(trim_whitespace, escape_quotes), output_processor=Join())
    ingredients = scrapy.Field(input_processor=MapCompose(trim_whitespace, escape_quotes), output_processor=Join('|'))
    instructions = scrapy.Field(input_processor=MapCompose(trim_whitespace, escape_quotes), output_processor=Join())
    active_time = scrapy.Field(input_processor=MapCompose(trim_whitespace, escape_quotes), output_processor=Join())
    total_time = scrapy.Field(input_processor=MapCompose(trim_whitespace, escape_quotes), output_processor=Join())
    url = scrapy.Field(input_processor=MapCompose(trim_whitespace, escape_quotes), output_processor=Join())
    image_url = scrapy.Field(input_processor=MapCompose(trim_whitespace, escape_quotes), output_processor=Join())
    # pass
