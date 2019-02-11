

import Illidan,{html,defineComponent,Component} from 'illidan';



defineComponent('my-btn',class MyButton extends Component{
    render(){
        return html`
        <style>
            :host{
                background:blue;
                color:white;
            }
        </style>
        <button>add</button>
        `;
    }
})

defineComponent('my-div',class MyDiv extends Component{
    constructor() {
        super();
    }
    get color(){
        return this._color || 'red'
    }
    set color(_color){
        this._color = _color;
    }
    get content(){
        return this._content || 'hello'
    }
    set content(_content){
        this._content = _content;
    }
    static get observedAttributes() {return ['swc']; } 
    render(){
        return html`
        <div style="background:${this.color};width:100px;height:100px;">${this.content}</div>
        `;
    }
})


window.addEventListener('load',function(){
    const div = document.querySelector('my-div')
    // div.content = 'world';
    div.setAttribute('swc','world')
})
