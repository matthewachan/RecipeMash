import React from 'react';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { Input, Button, Layout, List, Avatar, Icon } from 'antd';
const { Header, Footer, Sider, Content, Row, Col } = Layout

const Search = Input.Search;

export default class App extends React.Component {
  render() {
    return (
        <div>
            <div><Top /></div>
            <div><Main /></div>
        </div>
    )
  }
};

const Top = () => (
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
    let url = window.location.href;
    let params = url.slice(url.indexOf('?'), url.length);
    fetch('http://' + window.location.host + '/query' + params)
    .then(results => {
        return results.json();
    })
    .then(data => {
      this.setState({recipes: data});
    });
  }

  render() {
    return (
      <List itemLayout='vertical' size='large' dataSource={this.state.recipes} pagination={{pageSize: 5}}
      renderItem={item => (
        <List.Item key={item.name} 
        extra={<img width={272} src={item.image_url} />}>
        <List.Item.Meta avatar={<Avatar src={item.image_url} />} 
        title={<a href={item.url}>{item.name}</a>}
        description={item.author}
        />
            {item.ingredients}
        </List.Item>
      )}
      />
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
        this.getQueryString = this.getQueryString.bind(this);
    }
    
    addIngredient(e) {
        e.preventDefault();
        var text = ReactDOM.findDOMNode(this.refs.ingredient);
        this.setState({ingredients: this.state.ingredients.concat([text.value])});
        text.value = '';
    }
    
    getQueryString() {
      let ingredients = this.state.ingredients;
      let params = '';
      if (ingredients.length > 1) {
        params = ingredients.reduce((string, x) => string + ',' + x);
      } 
      else {
        params = ingredients[0];
      }
      return '?ingredients=' + params;
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
                <Link to={{ pathname: '/recipes', search: this.getQueryString() }}>Mash</Link>
          </div>
        );
    }
}
