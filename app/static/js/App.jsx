import React from 'react';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { Input, Tag, Button, Layout, List, Avatar, Icon, Form, Row, Col } from 'antd';
const { Header, Footer, Sider, Content } = Layout

const Search = Input.Search;
const FormItem = Form.Item;

const colors = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple'];

function pickColor() {
  return 'geekblue';
};

export default class App extends React.Component {
  render() {
    return (
        <div>
            <div ><Main /></div>
        </div>
    )
  }
};

const Top = () => (
  <Row justify='center'>
      <Col span={10} offset={7}>
          <h1 className='alignCenter' id='banner'><Link to={{ pathname: '/' }}>RECIPE MASH</Link></h1>
      </Col>
  </Row>
);

class Recipes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ingredients: [],
      recipes: []
    };
    this.loading = true;
    this.getSearchTerms = this.getSearchTerms.bind(this);
  }

  componentDidMount() {
    let url = window.location.href;
    let params = url.slice(url.indexOf('?'), url.length);
    let ingredients = params.slice(params.indexOf('=')+1, params.length);
    fetch('http://' + window.location.host + '/query' + params)
    .then(results => {
        return results.json();
    })
    .then(data => {
      this.setState({ingredients: ingredients.split(','), recipes: data});
    });
    this.loading = false;
  }

  getSearchTerms() {
    let list = [];
    for (let i = 0; i < this.state.ingredients.length; i++) {
      let item = this.state.ingredients[i];
      list.push(<Tag key={item} closable onClose={() => console.log('Removing ' + item)}>{item}</Tag>);
    }
    return list;
  }

  render() {
    return (
      <div>
      <div style={{ paddingTop: '35px'}}><Top /></div>
        <Row style={{ padding: '15px 50px' }} justify='center'>
            <Col span={24}>
                <List header={<div>Search terms: { this.getSearchTerms() }</div>} itemLayout='vertical' loading={this.loading} size='large' dataSource={this.state.recipes} pagination={{pageSize: 5}}
                renderItem={item => (
                  <List.Item key={item.name} actions={[<span><Icon type="star" style={{ marginRight: 8 }}/>{item.rating} (XX reviews)</span>]}
                 extra={<img width={272} style={{ display: 'inline-block' }} src={item.image_url ? item.image_url : ""} />}>
                  <List.Item.Meta avatar={<Avatar src={item.image_url} />} 
                  title={<a href={item.url}>{item.name}</a>}
                  description={item.total_time}
                  />
                    <ul style={{columns: 2, listStylePosition: 'inside'}}>
                        {item.ingredients.split('|').map(ingredient => (<li >{ingredient}</li>))}
                    </ul>
                  </List.Item>
                )}
                />
          </Col>
        </Row>
      </div>
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
            disabled: true,
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
        this.setState({input: '', disabled: false, ingredients: this.state.ingredients.concat([text])});
    }

    onChangeInput(e) {
      this.setState({
        input: e.target.value,
        disabled: this.state.disabled,
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
      let isDisabled = true;
      if (a.length > 0) {
        isDisabled = false;
      }
      this.setState({input: this.state.input, disabled: isDisabled, ingredients: a});
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
            <div className='bg'>
            <div style={{ paddingTop: '35px' }}><Top /></div>
            <Row style={{ padding: '15px 50px' }} justify='center'>
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
                        <List id='ingredient-list'
                            bordered
                            locale={{emptyText: 'No ingredients'}}
                            size='small'
                            dataSource={this.state.ingredients}
                            renderItem={item => (<List.Item key={item} actions={[<span onClick={() => this.removeIngredient(item)}><Icon type='delete'/></span>]} >{item}</List.Item>)}
                        />
                        </FormItem>
                        <FormItem {...tailFormItemLayout}>
                            <Link to={{ pathname: '/recipes', search: this.getQueryString() }}><Button size='large' disabled={this.state.disabled} type='primary'>MASH</Button></Link>
                        </FormItem>
                    </Form>
                </Col>
          </Row>
          </div>
        );
    }
}
