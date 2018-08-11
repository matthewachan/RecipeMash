import React from 'react';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { Input, Button } from 'antd';

const Search = Input.Search;

export default class App extends React.Component {
  render() {
    return (
        <div>
            <Header />
            <Main />
        </div>
    )
  }
};

const Header = () => (
  <h1>I am header.</h1>
);

class Recipes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recipes: []
    };
  }

  componentDidMount() {
    fetch(window.location.href)
    .then(results => {
        return results.json();
    })
    .then(data => {
      let recipes = data.map(recipe => {
            return (<li key={recipe.name}>{recipe.name}</li>)
      });
      this.setState({recipes: recipes});
      console.log(recipes);
    });
  }

  render() {
    return (
      <ul>
        {this.state.recipes}
      </ul>
    )
  }
}
    
const Main = () => (
  <Switch>
    <Route exact path='/' component={Home} />
    <Route path='/recipes' component={Recipes} />
  </Switch>
);

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ingredients: []
        };
        this.addIngredient = this.addIngredient.bind(this);
    }
    
    addIngredient(e) {
        e.preventDefault();
        var text = ReactDOM.findDOMNode(this.refs.ingredient);
        this.setState({ingredients: this.state.ingredients.concat([text.value])});
        text.value = '';
    }


    render() {
        return (
            <div>
                <form onSubmit={this.addIngredient}>
                    <div className='form-group'>
                        <Input className='form-control' ref='ingredient' type='text' placeholder='Enter an ingredient' />
                    </div>
                    <ul>
                        { this.state.ingredients.map(ingredient => <li key={ingredient}>{ingredient}</li>) }
                    </ul>
                </form>
                <Link to={{ pathname: '/recipes', search: '?ingredients=chicken' }}>Mash</Link>
          </div>
        );
    }
}
