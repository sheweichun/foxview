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

### shouldComponentUpdate(nextProps,nextState):Boolean

判断组件是否需要需要更新，返回true表示需要更新，返回false表示不需要更新

### componentDidMount()

组件第一次完成DOM渲染触发

### getSnapshotBeforeUpdate(prevProps,prevState)

在组件对DOM进行更新之前的回调，它的返回值会作为componentDidUpdate中snapshot入参

### componentDidUpdate(prevProps,prevState,snapshot)

组件完成DOM更新触发


## state和setState

state 管理组件内部状态
setState对state进行修改，同时触发组件重新渲染

```js
import {render,Component,defineComponent} from 'foxview'
class MyComponennt extends Component {
  constuctor(props){
    super(props);
    this.state = {
      count : 0
    }
  }
  onAdd(){
    this.setState({
      count:this.state.count
    })
  }
  onMinus(){
    this.setState({
      count:this.state.count
    })
  }
  render(){
    const {count} = this.state;
    return html`
      <h1>MyComponent</h1>
      <!-- 事件回调默认会绑定this -->
      <button @click="${this.onAdd}">add</button>
      <button @click="${this.onMinus}">minus</button>
      <span>count is ${count}</span>
    `;
  }
}
defineComponent('my-component', MyComponennt);

render(html`<my-component ></my-component>`,document.body)
```

## 插槽

插槽即WebComponent中的slot，遵循W3C [webComponent的标准](https://github.com/w3c/webcomponents/blob/gh-pages/proposals/Slots-Proposal.md),组件通过它来控制内容的分发

比如我们定义一个button
```js
import {render,html,Component,defineComponent} from 'foxview'
class Button extends Component {
  render(){
    return html`
      <div class="btn">
          <slot></slot>
      </div>
    `
  }
}
defineComponent('custom-button',Button);

```

然后我们可以像这样渲染

```js
render(html`<custom-button>
    点击我
</custom-button>`,document.body)
```


