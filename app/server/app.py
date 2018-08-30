from flask import Flask, render_template, request, redirect, Response
from functools import reduce
import os
import sys
from sqlalchemy import Column, ForeignKey, Integer, String, cast
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker
from sqlalchemy import create_engine
import pymysql
import json

app = Flask(__name__, static_folder='../static/dist', template_folder='../static')

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
    results = session.query(Recipe).filter(Recipe.ingredients.ilike('%{}%'.format(criteria))).order_by(cast(Recipe.rating, Integer).desc(), cast(Recipe.num_reviews, Integer).desc()).all()
    results = map((lambda x: { 'name': x.name, 'author': x.author, 'rating': x.rating, 'num_reviews': x.num_reviews, 'prepare_again_rating': x.prepare_again_rating, 'published_date': x.published_date, 'description': x.description, 'ingredients': x.ingredients, 'ingredients_html': x.ingredients_html, 'instructions': x.instructions, 'active_time': x.active_time, 'total_time': x.total_time, 'url': x.url, 'image_url': x.image_url }), results)
    return json.dumps(results)


if __name__ == '__main__':
    app.run(debug=True)
