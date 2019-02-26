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
// console.log('defineComponent :',defineComponent);
// defineComponent('my-demo1',Demo);

render(
  html`<my-demo1></my-demo1>`,
  document.getElementById('demo1'),{
    components:{
      'my-demo1':Demo
    }
  }
)