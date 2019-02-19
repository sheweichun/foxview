---
title: 组件
type: guide
order: 3
---


## 组件注册

```js
import {render,Component,defineComponent} from 'foxview'
class MyComponennt extends Component {
  render(){
    return html`
      <div>Hello World</div>
    `;
  }
}
defineComponent('my-component', MyComponennt);

```


## props

```js
import {render,Component,defineComponent} from 'foxview'
class MyComponennt extends Component {
  render(){
    const {type} = this.props;
    return html`
      <h1>MyComponent</h1>
      <span>my type is : ${type}</span>
    `;
  }
}
defineComponent('my-component', MyComponennt);

const myTemplate = 
(type) => html`<my-component type=${type}></my-component>`

render(myTemplate('primary'),document.body)
```


## 组件生命周期

### shouldComponentUpdate(nextProps,nextState)

### componentDidMount()

### getSnapshotBeforeUpdate(prevProps,prevState)

### componentDidUpdate(prevProps,prevState,snapshot)


## state