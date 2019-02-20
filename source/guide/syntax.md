---
title: 模板语法
type: guide
order: 2
---

## 静态模板渲染

渲染静态模板是最简单的

```js
import {html, render} from 'foxview';
// 声明一个模板
const myTemplate = html`<div>Hello World</div>`;
// 渲染模板
render(myTemplate, document.body);
```

## 动态模板渲染

### 文本绑定

渲染静态模板是最简单的

```js
import {html, render} from 'foxview';
// 声明一个带参模板
const myTemplate = (name)=>html`<div>Hello ${name}</div>`;
// 渲染模板
render(myTemplate('World'), document.body);
//输出<div>Hello World</div>
setTimeout(()=>{
    render(myTemplate('FoxView'), document.body);
    //改变成<div>Hello FoxView</div>
},500)

```


### attribute绑定

```js
import {html, render} from 'foxview';
// 动态设置class
const myTemplate = 
(className)=>html`<div class="${className}">Hello World</div>`;

```


### 事件绑定

```js
import {html, render} from 'foxview';
function onClick(){
    console.log('clicked')
}
// 动态设置class
const myTemplate = 
(className)=>html`<button @click="${onClick}">Click Me!</button>`;

```


### 组合渲染

```js
import {html, render} from 'foxview';
const Left = html`<div>Left</div>`
const Middle = html`<div>Middle</div>`
const Right = html`<div>Right</div>`
render(html`<div>
    ${Left}
    ${Midlle}
    ${Right}
</div>`)
```

#### 条件渲染

```js
html`<div>
    ${count % 2 === 0 ? 
    html`<span color="red">偶数</span>`:
    html`<span>奇数</span>`
    }
</div>
`;
```

#### 列表渲染
```js
html`
  <ul>
    ${items.map((item) => html`<li>${item}</li>`)}
  </ul>
`;
```



## WebComponent特殊语法


WebComponent语法在前面介绍的语法上做了部分的拓展


### property绑定
```js
const myTemplate = (btnType) => 
html`<my-button .type=${btnType}></my-button>`;
```

FoxView会识别 **.[property]** ，给my-button的实例的type赋值为btnType



### boolean绑定
```js
const myTemplate = (disable) => 
html`<input !disabled=${disable}></input>`;
```

FoxView会识别 **![property]** ，将值转成布尔值





