import {html,defineComponent,Component,render} from 'illidan';


class Demo extends Component{
    constructor(props) {
        super(props);
        this.state = {
            flag : false
        }
    }
    onClick(){
        this.setState({
            flag : !this.state.flag
        })
    }
    renderCom(){
        if(this.state.flag){
            return html`<rect color=${{
                value:'blue'
            }}></rect>`
        }
        return html`<counter></counter>`
    }
    render(){
        
        return html`<div >
            <button @click=${this.onClick}>click me22</button>
            ${this.renderCom()}
            <slot></slot>
            <slot name="swc"></slot>
        </div>`
    }
}
defineComponent('demo',Demo)

class Counter extends Component{
    constructor(props) {
        super(props);
        this.state = {
            couter : 2
        }
    }
    onClick(){
        console.log('click');
    }
    render(){
        const {couter} = this.state;
        return html`<div @click=${this.onClick}>
            <span>${couter}</span>
        </div>`
    }
}
defineComponent('counter',Counter)

class Rect extends Component{
    constructor(props) {
        super(props);
        this.state = {
            couter : 1
        }
    }
    onClick(){
        console.log('click');
    }
    render(){
        const {color} = this.props;
        return html`<div  style="width:100px;height:200px;background:${color ? color.value : 'yellow'};" @click=${this.onClick}>
            <span>${this.state.couter}</span>
        </div>`
    }
}
defineComponent('rect',Rect)


class App extends Component{
    constructor(props) {
        super(props);
        this.state = {
            counter:1
        }
    }
    
    onClick(){
        this.setState({
            counter:this.state.counter+1
        })
    }
    render(){
        const {counter} = this.state;
        return html`<demo>
            <div slot="swc">
                <button @click=${this.onClick}>slot click</button>
            </div>
            <div>I am a slot!!!${counter}</div>
        </demo>`
    }
}
defineComponent('app',App)
render(html`<app></app>`,document.getElementById('container'))
