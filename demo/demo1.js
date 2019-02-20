import {render,html,defineComponent,Component}   from 'foxview';
const message = "Hello,FoxView"

function onClick(){
  alert('clicked')
}

class Demo extends Component{
  render(){
    return html`<div @click=${onClick}>${message}</div>`
  }
}
defineComponent('my-demo1',Demo);

render(
  html`<my-demo1></my-demo1>`,
  document.getElementById('demo1')
)