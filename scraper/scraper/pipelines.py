# -*- coding: utf-8 -*-

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://doc.scrapy.org/en/latest/topics/item-pipeline.html

import sqlite3

class ScraperPipeline(object):
    def process_item(self, item, spider):
        return item

class RecipePipeline(object):
    # def __init__(self):
    #     self.conn = sqlite3.connect('recipes.db')
    #     self.c = self.conn.cursor()
    
    def open_spider(self, spider):
        self.conn = sqlite3.connect('recipes.db')
        self.c = self.conn.cursor()
        self.c.execute('CREATE TABLE recipes (name text, author text, rating text,published_date text, description text, ingredients text, instructions text, active_time text, total_time text)')


    def close_spider(self, spider):
        self.conn.commit()
        self.conn.close()

    def process_item(self, item, spider):
        self.c.execute(u'INSERT INTO recipes VALUES (\'{}\', \'{}\', \'{}\', \'{}\', \'{}\', \'{}\', \'{}\', \'{}\', \'{}\')'.format(item.get('name', ''), item.get('author', ''), item.get('rating', ''), item.get('published_date', ''),item.get('description', ''), item.get('ingredients', ''), item.get('instructions', ''), item.get('active_time', ''), item.get('total_time', '')))
