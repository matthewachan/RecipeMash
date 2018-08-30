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
      <Col span={24}>
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
    this.queryRecipes = this.queryRecipes.bind(this);
    this.removeIngredient = this.removeIngredient.bind(this);
  }

  queryRecipes(params) {
    let ingredients = params.slice(params.indexOf('=') + 1, params.length);
    let base_url = 'http://' + window.location.host;
    let endpoint = base_url + '/query' + params;
    let url = base_url + '/recipes' + params;
    fetch(endpoint)
    .then(results => {
        return results.json();
    })
    .then(data => {
      this.setState({ingredients: ingredients.split(','), recipes: data});
    });
    this.loading = false;
    window.history.pushState('', 'Recipe Mash', url);
  }

  componentDidMount() {
    let url = window.location.href;
    let params = url.slice(url.indexOf('?'), url.length);
    this.queryRecipes(params);
  }

  removeIngredient(ingredient) {
    let a = this.state.ingredients.slice()
    a.splice(a.indexOf(ingredient), 1).join(',');
    let s = '?ingredients=' + a
    console.log(s);
    return s;
  }


  getSearchTerms() {
    let list = [];
    for (let i = 0; i < this.state.ingredients.length; i++) {
      let item = this.state.ingredients[i];
      list.push(<Tag key={item} closable onClose={() => this.queryRecipes(this.removeIngredient(item))}>{item}</Tag>);
    }
    return list;
  }

  render() {
    return (
      <div>
      <div style={{ paddingTop: '35px'}}><Top /></div>
        <Row style={{ padding: '15px 50px' }} justify='center'>
            <Col span={24}>
                <List id='recipe-list' header={<div>Search terms: { this.getSearchTerms() }<Link to='/'><span style={{ float: 'right'}}><Icon type='arrow-left' />&nbsp;Back to search</span></Link></div>} itemLayout='vertical' loading={this.loading} size='large' dataSource={this.state.recipes} pagination={{pageSize: 5}}
                renderItem={item => (
                  <List.Item key={item.name} actions={[<span><Icon type='star' style={{ marginRight: 8 }}/>{item.rating} ({item.num_reviews} reviews)</span>, <span><Icon type='heart' style={{ marginRight: 8 }}/>{item.prepare_again_rating ? 'Make it again: ' + item.prepare_again_rating : ''}</span>]}
                 extra={<img width={272} style={{ display: 'inline-block' }} src={item.image_url ? item.image_url : ""} />}>
                  <List.Item.Meta avatar={<Avatar src={item.image_url} />} 
                  title={<a href={item.url}>{item.name.replace("''", "'")}</a>}
                  description={item.total_time ? 'Cooking Time: ' + item.total_time : ''}
                  />
                    <div>
                      <strong>Ingredients:</strong>
                      <div style={{columns: 2, listStylePosition: 'inside'}} dangerouslySetInnerHTML={{__html: item.ingredients_html}}>
                      </div>
                    </div>
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
                <Col offset={8} span={8}>
                    <div className='transbox'>
                    <Form className='alignRight' onSubmit={this.addIngredient}>
                        <FormItem className='alignLeft' {...formItemLayout}>
                            <h1>What's in the fridge?</h1>
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
                            renderItem={item => (<List.Item key={item} actions={[<span onClick={() => this.removeIngredient(item)}><Icon className='delete-icon' type='delete'/></span>]} >{item}</List.Item>)}
                        />
                        </FormItem>
                        <FormItem {...tailFormItemLayout}>
                            <Link to={{ pathname: '/recipes', search: this.getQueryString() }}><Button size='large' disabled={this.state.disabled} type='primary'>MASH</Button></Link>
                        </FormItem>
                    </Form>
                    </div>
                </Col>
          </Row>
          </div>
        );
    }
}
