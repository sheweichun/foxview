

import {html,svg,defineWebComponent as defineComponent,WebComponent,createRef,property,customElement} from 'foxview';




@customElement('my-btn')
class MyButton extends WebComponent{
  @property({type:String}) message = "message_test"
  @property({type:Number}) counter = 3
  @property({type:String}) color = 'red'
  static get properties(){
    return {
      message:{
        type:String
      },
      counter:{
        type:String
      }
    }
  }
  constructor(props) {
    super(props);
  }
  componentDidMount(){
    this.shadowRoot.addEventListener('click',()=>{
      console.log('click shadow dom');
    })
  }
  add(e){
    e.stopPropagation();
    this.counter++;
    // this.requestUpdate();
  }
  minus(){
    this.counter--;
  }
  renderPart(){
    if(this.props.counter % 2 === 0){
      return html`<div a>偶数</div>`
    }else{
      return html`<div b>奇数</div>`
    }
  }
  renderList(){
    let ret = [];
    for(let i = 0; i < this.counter; i++){
      ret.push(html`<li>${i}</li>`)
    }
    if(this.counter > 3) return '';
    return ret;
  }
  render(){
    const {message,counter,color} = this.props;
      return html`
      <style>
          :host{
              background:${color};
              color:var(--color);
          }
      </style>
      <button @click=${this.add}>${message || 'hello'}</button>
      <button @click=${this.minus}>${'minus'}</button>
      <slot name="abc"></slot>
      <slot name="default" @click=${this.clickHandler}></slot>
      <div>计数器:${counter}</div>
      ${this.renderPart()}
      <ul>
          ${this.renderList()}
      </ul>
      `;
  }
}

@customElement('my-div')
class MyDiv extends WebComponent{
    constructor() {
        super();
        setTimeout(()=>{
            this.color = 'blue';
            this.requestUpdate()
        },2000)
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
        <div style="background:${this.color};width:100px;height:100px;">${this.content},<span>color:${this.color}</span></div>
        `;
    }
}

@customElement('my-clock')
class LitClock extends WebComponent {

    get date() { return this._date || new Date(); }
    set date(v) { this._date = v; }
  
    constructor() {
      super();
      this.inputRef = createRef();
      setInterval(() => {
        this.date = new Date();
        this.requestUpdate()
      }, 1000);
    }
    componentDidMount() {
      console.log('inputRef :',this.inputRef);
    }
    
    render() {
    const minuteTicks = (() => {
    const lines = [];
    for (let i = 0; i < 60; i++) {
        lines.push(svg`
        <line 
            class='minor'
            y1='42'
            y2='45'
            transform='rotate(${360 * i / 60})'/>
        `);
    }
    return lines;
    })();
    
    const hourTicks = (() => {
    const lines = [];
    for (let i = 0; i < 12; i++) {
        lines.push(svg`
        <line 
            class='major'
            y1='32'
            y2='45'
            transform='rotate(${360 * i / 12})'/>
        `);
    }
    return lines;
    })();
      const a = 'our';
      return html`
        <style>
          :host {
            display: block;
          }
          .square {
            position: relative;
            width: 100%;
            height: 0;
            padding-bottom: 100%;
          }
          
          svg {
            position: absolute;
            width: 100%;
            height: 100%;
          }
          
          .clock-face {
            stroke: #333;
            fill: white;
          }
          
          .minor {
            stroke: #999;
            stroke-width: 0.5;
          }
          
          .major {
            stroke: #333;
            stroke-width: 1;
          }
          
          .hour {
            stroke: #333;
          }
          
          .minute {
            stroke: #666;
          }
          
          .second, .second-counterweight {
            stroke: rgb(180,0,0);
          }
          
          .second-counterweight {
            stroke-width: 3;
          }
        </style>
        <div class='square'> <!-- so the SVG keeps its aspect ratio -->
        <div .class='${'abc'}abc${'123'}'>swc</div>
        <input ref="${this.inputRef}" ?disabled="${true}"/> 
          <svg viewBox='0 0 100 100'>
            <!-- first create a group and move it to 50,50 so
                all co-ords are relative to the center -->
            <g transform='translate(50,50)'>
              <circle class='clock-face' r='48'/>
              ${minuteTicks}
              ${hourTicks}
      
              <!-- hour hand -->
              <line class=h${a} y1='2' y2='-20'
                transform='rotate(${ 30 * this.date.getHours() + this.date.getMinutes() / 2 })'/>
      
              <!-- minute hand -->
              <line class='minute' y1='4' y2='-30'
                transform='rotate(${ 6 * this.date.getMinutes() + this.date.getSeconds() / 10 })'/>
      
              <!-- second hand -->
              <g transform='rotate(${ 6 * this.date.getSeconds() })'>
                <line class='second' y1='10' y2='-38'/>
                <line class='second-counterweight' y1='10' y2='2'/>
              </g>
            </g>
          </svg>
        </div>
      `;
    }
}  
console.dir(MyButton);
console.dir(WebComponent);
window.addEventListener('load',function(){
    const div = document.querySelector('my-div')
    // div.content = 'world';
    div.setAttribute('swc','world')
    const btn = document.querySelector('my-btn');
    
    setTimeout(()=>{
      // btn.setAttribute('message','click me!!!');
      btn.setAttribute('message','clickme!!!')
      btn.setAttribute('counter','5')
      btn.setAttribute('color','yellow')
      // btn.message = 'click me!!!!!!'
      document.getElementById('after').innerHTML = 'change after'
      // document.body.style.setProperty('--color','yellow');
      // setTimeout(()=>{
      //   document.body.removeChild(btn)
      // },1000)
    },1000)
    // render(html`<div>${'test'}</div>`,document.getElementById('container'))
    // render(html`<div>${'demo'}</div>`,document.getElementById('container'))
})
