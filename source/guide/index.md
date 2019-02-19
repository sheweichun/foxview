---
title: 介绍
type: guide
order: 1
---

## FoxView 是什么

foxView用于构建[webComponent](https://developer.mozilla.org/zh-CN/docs/Web/Web_Components)和用户界面的声明式框架，在渲染[webComponent](https://developer.mozilla.org/zh-CN/docs/Web/Web_Components)和用户界面的时候共享同一套渲染引擎技术，统一开发模式



## 起步


尝试 FoxView 最简单的方法是使用 [JSFiddle 上的 Hello World 例子](https://jsfiddle.net/luodan/ham1qrg9/3/)。

[安装教程](/guide/installation.html)给出了更多安装 FoxView 的方式


## 声明式渲染



Foxview采用模板语法来声明式地将数据渲染：

``` html
<div id="app">
</div>
```
``` js
const {render,html} = FoxView
const message = "Hello,FoxView"

render(
  html`<div>${message}</div>`,
  document.getElementById('app')
)
```




## 条件与循环



通过条件判断一个元素是否显示：

``` html
<div id="app-1">
</div>
```
``` js
const {render,html} = FoxView
let show = true

function renderCondition(flag){
  return  flag ? 
    html`<span style="color:red;">您看到我了</span>`:
    html`<span>你看不到我</span>`
}

render(
  html`<div>${renderCondition(show)}</div>`,
  document.getElementById('app-1')
)
```


通过循环来渲染一个项目列表：

``` html
<div id="app-2">
</div>
```
``` js
const {render,html} = FoxView

function renderList(data){
  return  data.map((text)=>{
    return html`<li>
      <span>${text}</span>
    </li>`
  })
}
render(
  html`<ol>
    ${renderList([
      '第一项',
      '第二项',
      '第三项'
    ])}
  </ol>`,
  document.getElementById('app-2')
)
```


## 处理用户输入


我们的应用需要响应用户的操作，FoxView通过在事件属性前加上@来添加事件监听器

``` html
<div id="app-3">
</div>
```
``` js
const {render,html} = FoxView

function clickMe(e){
  alert('clicked:',e)
}
render(
  html`<button @click=${clickMe}>click me</button>`,
  document.getElementById('app-3')
)
```



## 组件化应用构建

FoxView还提供了组件化和定义自定义元素([webComponent](https://developer.mozilla.org/zh-CN/docs/Web/Web_Components))的能力(组件化是我们开发大型应用最基础的能力)




### 组件化


[JSFiddle 上的 计数器 例子](https://jsfiddle.net/luodan/zmk6u480/3/)。

定义一个组件很简单：

``` js
const {render,html,Component,defineComponent} = FoxView
// 定义名为 counter 的计数器组件
class Counter extends Component{
  constructor(props){
    super(props);
    this.state = {
      count:props.initValue
    }
  }
  add(){
    this.setState({
      count:this.state.count + 1
    })
  }
  minus(){
    this.setState({
      count:this.state.count - 1
    })
  }
  render(){
    return html`<div>
      <button @click=${this.add}>add</button>
      <button @click=${this.minus}>minus</button>
      <div>
        result:${this.state.count}
      </div>
    </div>`
  }
}
defineComponent('counter', Counter)
```

现在你可以用它构建另一个模板：


``` html
<div id="app-4">
</div>
```

``` js
//加载定义Counter的js内容,此处省略
const {render,html} = FoxView


render(
  html`<div>
    <counter initValue="${5}"></counter>
  </div>`,
  document.getElementById('app-4')
)
```




### 与自定义元素的关系

你可能已经注意到 Vue 组件非常类似于**自定义元素**——它是 [Web 组件规范](https://www.w3.org/wiki/WebComponents/)的一部分，这是因为 Vue 的组件语法部分参考了该规范。例如 Vue 组件实现了 [Slot API](https://github.com/w3c/webcomponents/blob/gh-pages/proposals/Slots-Proposal.md) 与 `is` 特性。但是，还是有几个关键差别：

1. Web 组件规范仍然处于草案阶段，并且未被所有浏览器原生实现。相比之下，Vue 组件不需要任何 polyfill，并且在所有支持的浏览器 (IE9 及更高版本) 之下表现一致。必要时，Vue 组件也可以包装于原生自定义元素之内。

2. Vue 组件提供了纯自定义元素所不具备的一些重要功能，最突出的是跨组件数据流、自定义事件通信以及构建工具集成。

## 准备好了吗？

我们刚才简单介绍了 Vue 核心最基本的功能——本教程的其余部分将涵盖这些功能以及其它高级功能更详细的细节，所以请务必读完整个教程！

<div id="video-modal" class="modal"><div class="video-space" style="padding: 56.25% 0 0 0; position: relative;"></div></div>
