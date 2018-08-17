import React from 'react';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { Input, Tag, Button, Layout, List, Avatar, Icon, Form, Row, Col } from 'antd';
const { Header, Footer, Sider, Content } = Layout

const Search = Input.Search;
const FormItem = Form.Item;
const colors = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple'];
function pickColor() {
  return colors[Math.floor(Math.random() * colors.length)];
};

export default class App extends React.Component {
  render() {
    return (
        <div>
            <div><Top /></div>
            <div style={{ padding: '0 50px' }}><Main /></div>
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
    this.loading = true;
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
    this.loading = false;
  }

  render() {
    return (
      <List itemLayout='vertical' loading={this.loading} size='large' dataSource={this.state.recipes} pagination={{pageSize: 5}}
      renderItem={item => (
        <List.Item key={item.name} actions={[<span><Icon type="star" style={{ marginRight: 8 }}/>{item.rating} (XX reviews)</span>]}
       extra={<img width={272} src={item.image_url} />}>
        <List.Item.Meta avatar={<Avatar src={item.image_url} />} 
        title={<a href={item.url}>{item.name}</a>}
        description={item.author}
        />
              {item.ingredients.split('|').map(ingredient => (<Tag color={pickColor()}>{ingredient}</Tag>))}
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
            input: '',
            ingredients: []
        };
        this.addIngredient = this.addIngredient.bind(this);
        this.getQueryString = this.getQueryString.bind(this);
        this.onChangeInput = this.onChangeInput.bind(this);
        this.removeIngredient = this.removeIngredient.bind(this);
    }
    
    addIngredient(e) {
        e.preventDefault();
        var text = this.state.input;
        this.setState({input: '', ingredients: this.state.ingredients.concat([text])});
    }

    onChangeInput(e) {
      this.setState({
        input: e.target.value,
        ingredients: this.state.ingredients
      });
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
    
    removeIngredient(ingredient) {
      let a = this.state.ingredients;
      for (let i = 0; i < a.length; i++) {
        if (a[i] == ingredient) {
          a.splice(i, 1);
          break;
        }
      }
      this.setState({input: this.state.input, ingredients: a});
    }
      



    render() {
        const formItemLayout = {
          labelCol: {
            xs: { span: 12 },
            sm: { span: 12 }
          },
          wrapperCol: {
              xs: { span: 24 },
              sm: { span: 24 }
          }
        };
        const tailFormItemLayout = {
          wrapperCol: {
              xs: { 
                span: 15,
                offset: 12
              },
              sm: { 
                span: 12,
                offset: 12
              }
          }
        };
        return (
            <Row justify='center'>
                <Col span={10}>
                    <h1>Main photo here</h1>
                </Col>
                <Col offset={2} span={8}>
                    <Form className='alignRight' onSubmit={this.addIngredient}>
                        <FormItem className='alignLeft' {...formItemLayout}>
                            <h2>What's in the fridge?</h2>
                        </FormItem>
                        <FormItem {...formItemLayout}>
                            <Input className='form-control' value={this.state.input} onChange={this.onChangeInput} type='text' size='small' suffix={<Icon type="plus" />} placeholder='Add an ingredient' />
                        </FormItem>
                        <FormItem {...formItemLayout}>
                        <List
                            bordered
                            locale={{emptyText: 'No ingredients'}}
                            size='small'
                            dataSource={this.state.ingredients}
                            renderItem={item => (<List.Item key={item} actions={[<span onClick={() => this.removeIngredient(item)}><Icon type='delete'/></span>]} >{item}</List.Item>)}
                        />
                        </FormItem>
                        <FormItem {...tailFormItemLayout}>
                            <Link to={{ pathname: '/recipes', search: this.getQueryString() }}><Button type='primary'>Mash</Button></Link>
                        </FormItem>
                    </Form>
                </Col>
          </Row>
        );
    }
}
