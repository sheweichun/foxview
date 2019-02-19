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
defineComponent('my-demo',Demo);

render(
  html`<my-demo></my-demo>`,
  document.getElementById('demo1')
)