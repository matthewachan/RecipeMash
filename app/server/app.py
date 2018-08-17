from flask import Flask, render_template, request, redirect, Response
from functools import reduce
import os
import sys
from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker
from sqlalchemy import create_engine
import pymysql
import json

app = Flask(__name__, static_folder='../static/dist', template_folder='../static')

Base = declarative_base()

class Recipe(Base):
    __tablename__ = 'recipe'
    name = Column(String(150), primary_key=True)
    author = Column(String(50))
    rating = Column(String(5))
    published_date = Column(String(50))
    description = Column(String(1000))
    ingredients = Column(String(2500))
    instructions = Column(String(2500))
    active_time = Column(String(50))
    total_time = Column(String(50))
    url = Column(String(300, convert_unicode=True))
    image_url = Column(String(300, convert_unicode=True))

engine = create_engine('mysql+pymysql://mchan:password@recipemash.c6sbwe157jm7.us-east-1.rds.amazonaws.com:3306/recipes')

DBSession = sessionmaker(bind=engine)

session = DBSession()

# results = session.query(Recipe).all()
# print results.name
# print results.author
# print results.ingredients

# session.close()
ingredients = []


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def index(path):
    return render_template('index.html', ingredients=ingredients)

@app.route('/ingredient', methods=['POST'])
def add_ingredient():
    ingredient = request.form['ingredient']
    ingredients.append(ingredient)
    return redirect('/')

@app.route('/query')
def list_recipes():
    query = request.args.get('ingredients')
    ingredients = query.split(',')
    criteria = reduce((lambda x, y: x + "%" + y), ingredients)
    results = session.query(Recipe).filter(Recipe.ingredients.ilike('%{}%'.format(criteria))).order_by(Recipe.rating.desc()).all()
    results = map((lambda x: { 'name': x.name, 'author': x.author, 'rating': x.rating, 'published_date': x.published_date, 'description': x.description, 'ingredients': x.ingredients, 'instructions': x.instructions, 'active_time': x.active_time, 'total_time': x.total_time, 'url': x.url, 'image_url': x.image_url }), results)
    return json.dumps(results)


if __name__ == '__main__':
    app.run(debug=True)
