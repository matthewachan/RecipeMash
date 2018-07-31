from flask import Flask, render_template, request, redirect
from functools import reduce
import os
import sys
from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker
from sqlalchemy import create_engine
import pymysql

app = Flask(__name__)

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

engine = create_engine('mysql+pymysql://mchan:password@recipemash.c6sbwe157jm7.us-east-1.rds.amazonaws.com:3306/recipes')

DBSession = sessionmaker(bind=engine)

session = DBSession()

# results = session.query(Recipe).all()
# print results.name
# print results.author
# print results.ingredients

# session.close()
ingredients = []

@app.route('/')
def index():
    return render_template('index.html', ingredients=ingredients)

@app.route('/ingredient', methods=['POST'])
def add_ingredient():
    ingredient = request.form['ingredient']
    ingredients.append(ingredient)
    return redirect('/')

@app.route('/recipes')
def list_recipes():
    # return ingredients[0]
    criteria = reduce((lambda x, y: x + "%" + y), ingredients)
    results = session.query(Recipe).filter(Recipe.ingredients.ilike('%{}%'.format(criteria))).all()
    # print recipes[0].ingredients
    # for recipe in recipes:
        # print recipe.name
    return render_template('recipes.html', recipes=results)


if __name__ == '__main__':
    app.run(debug=True)
