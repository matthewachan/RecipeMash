# -*- coding: utf-8 -*-

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://doc.scrapy.org/en/latest/topics/item-pipeline.html

import os
import sys
from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker
from sqlalchemy import create_engine
import pymysql
# import sqlite3

class ScraperPipeline(object):
    def process_item(self, item, spider):
        return item

Base = declarative_base()
class Recipe(Base):
    __tablename__ = 'recipe'
    name = Column(String(150, convert_unicode=True), primary_key=True)
    author = Column(String(50, convert_unicode=True))
    rating = Column(String(5, convert_unicode=True))
    num_reviews = Column(String(20, convert_unicode=True))
    prepare_again_rating = Column(String(5, convert_unicode=True))
    published_date = Column(String(50, convert_unicode=True))
    description = Column(String(1000, convert_unicode=True))
    ingredients = Column(String(5000, convert_unicode=True))
    ingredients_html = Column(String(5000, convert_unicode=True))
    instructions = Column(String(5000, convert_unicode=True))
    active_time = Column(String(50, convert_unicode=True))
    total_time = Column(String(50, convert_unicode=True))
    url = Column(String(300, convert_unicode=True))
    image_url = Column(String(300, convert_unicode=True))


class RecipePipeline(object):
    # def __init__(self):
    
    def open_spider(self, spider):
        engine = create_engine('mysql+pymysql://mchan:password@recipemash.c6sbwe157jm7.us-east-1.rds.amazonaws.com:3306/recipes', pool_pre_ping=True, pool_recycle=3600)
        Base.metadata.create_all(engine)
        Base.metadata.bind=engine
        DBSession = sessionmaker(bind=engine)
        self.session = DBSession()
        # self.conn = sqlite3.connect('recipes.db')
        # self.c = self.conn.cursor()
        # self.c.execute('CREATE TABLE recipes (name text, author text, rating text,published_date text, description text, ingredients text, instructions text, active_time text, total_time text)')


    def close_spider(self, spider):
        self.session.commit()
        self.session.close()
        # self.conn.commit()
        # self.conn.close()

    def process_item(self, item, spider):
        if not self.session.query(Recipe).filter_by(name=item.get('name')).first():
            new_entry = Recipe(name=item.get('name', ''), author=item.get('author', ''), rating=item.get('rating', ''), num_reviews=item.get('num_reviews', ''), prepare_again_rating=item.get('prepare_again_rating', ''),  published_date=item.get('published_date', ''), description=item.get('description', ''), ingredients=item.get('ingredients', ''), ingredients_html=item.get('ingredients_html', ''),  instructions=item.get('instructions', ''), active_time=item.get('active_time', ''), total_time=item.get('total_time', ''), url=item.get('url', ''), image_url=item.get('image_url', ''))
            self.session.add(new_entry)
        # self.c.execute(u'INSERT INTO recipes VALUES (\'{}\', \'{}\', \'{}\', \'{}\', \'{}\', \'{}\', \'{}\', \'{}\', \'{}\')'.format(item.get('name', ''), item.get('author', ''), item.get('rating', ''), item.get('published_date', ''),item.get('description', ''), item.get('ingredients', ''), item.get('instructions', ''), item.get('active_time', ''), item.get('total_time', '')))
