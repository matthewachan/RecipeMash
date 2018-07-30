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
    name = Column(String(150), primary_key=True)
    author = Column(String(50))
    rating = Column(String(5))
    published_date = Column(String(50))
    description = Column(String(1000))
    ingredients = Column(String(5000))
    instructions = Column(String(5000))
    active_time = Column(String(50))
    total_time = Column(String(50))

class RecipePipeline(object):
    # def __init__(self):
    
    def open_spider(self, spider):
        engine = create_engine('mysql+pymysql://mchan:password@recipemash.c6sbwe157jm7.us-east-1.rds.amazonaws.com:3306/recipes')
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
        new_entry = Recipe(name=item.get('name', ''), author=item.get('author', ''), rating=item.get('rating', ''), published_date=item.get('published_date', ''), description=item.get('description', ''), ingredients=item.get('ingredients', ''), instructions=item.get('instructions', ''), active_time=item.get('active_time', ''), total_time=item.get('total_time', ''))
        self.session.add(new_entry)
        # self.c.execute(u'INSERT INTO recipes VALUES (\'{}\', \'{}\', \'{}\', \'{}\', \'{}\', \'{}\', \'{}\', \'{}\', \'{}\')'.format(item.get('name', ''), item.get('author', ''), item.get('rating', ''), item.get('published_date', ''),item.get('description', ''), item.get('ingredients', ''), item.get('instructions', ''), item.get('active_time', ''), item.get('total_time', '')))
