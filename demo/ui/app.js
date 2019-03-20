import {html,mount,Component} from 'foxview';
import {install} from 'foxview-ui';
import 'foxview-ui/lib/index.css';


// console.log('install :',install);
install('f')


function createButtons(){
    let str = [];
    for(let i = 0; i < 1000; i ++){
        // str.push(html`<f-button>test</f-button>`)
        // str.push(html`<button>test</button>`)
        str.push(html`<button>test</button>`)
    }
    return str;
}



class App extends Component{
    constructor(props) {
        super(props);
        this.state = {
            radioChecked:false,
            radioGroupValue:'orange',
            checkboxGroupValue:['orange']
        }
    }
    
    onCheckboxChange(e){
        console.log('e :',e.detail);
    }
    onCheckboxGroupChange(e){
        console.log('onCheckboxGroupChange :',e.detail);
    }
    onRadioGroupChange(e){
        console.log('onRadioGroupChange e :',e.detail);
    }
    onRadioChange(e){
        console.log('onRadioChange:',e.detail.check);
        // this.setState({
        //     radioChecked:false
        // })
        // thi
    }
    componentDidMount() {
        setTimeout(()=>{
            this.setState({
                radioGroupValue:'apple',
                checkboxGroupValue:['orange','watermelon']
            })
        },1000)
    }
    // componentDidCatch(error, info) {
    //     console.log(error,info);
    // }
    onInputChange(e){
        console.log('in onInputChange :',e.detail)
    }
    render(){
        const {radioGroupValue,checkboxGroupValue,radioChecked,checkboxChecked} = this.state;
        // console.log('radioChecked :',radioChecked);
        const a = 'template'
        return html`
        <div>
            <f-button>
                normal
            </f-button>
            <f-button type="primary">
                primary
            </f-button>
            <f-button type="secondary" size="small">
                secondary
            </f-button>
            <f-button type="primary" warning>
                primary warning
            </f-button>
            <f-button type="secondary" warning size="large">
                secondary warning
            </f-button>
            <f-button type="secondary" warning disabled>
                secondary warning disabled
            </f-button>
        </div>
        <div>
            <f-icon type="smile" size="xxs" ></f-icon> 
            <f-icon type="smile" size="xs"></f-icon>
            <f-icon type="smile" size="small"></f-icon>
            <f-icon type="smile" size="medium"></f-icon>
            <f-icon type="smile" size="large"></f-icon>
            <f-icon type="smile" size="xl"></f-icon>
            <f-icon type="smile" size="xxl"></f-icon>
        </div>
        <div>
            <f-checkbox id="luodan" ?disabled="${true}" ?defaultChecked="${false}" @change="${this.onCheckboxChange}">
            abc
            <span slot="luodan">luodan</span>
            ced
            </f-checkbox>
            <f-radio-group  name="dyf" value="${radioGroupValue}" @change="${this.onRadioGroupChange}">
                <f-radio id="apple" name="abc"  value="apple">apple</f-radio>
                <f-radio id="orange" name="abc"  value="orange">orange</f-radio>
            </f-radio-group> 
            <f-checkbox-group name="luodan" value="${checkboxGroupValue}" @change="${this.onCheckboxGroupChange}">
                <f-checkbox id="apple"  value="apple">apple</f-checkbox>
                <f-checkbox id="orange"  value="orange">orange</f-checkbox>
                <f-checkbox id="watermelon"  value="watermelon">watermelon</f-checkbox>
            </f-checkbox-group> 
            <f-radio ?disabled="${true}" ?checked="${radioChecked}" @change="${this.onRadioChange}">radio</f-radio>
            <div>
                <f-input placeholder="input"  @change="${this.onInputChange}" @focus="${(e)=>{
                    console.log('focus!! :',e.target)
                }}" @pressenter="${()=>{
                    console.log('pressenter!!')
                }}">
                    <span slot="addonBefore"><span>before</span></span>
                    
                </f-input>
                <f-checkbox id="orange1"  value="orange1">orange1</f-checkbox>
                <f-radio id="radio"  value="radio">radio</f-radio>
                <f-switch ?disabled="${false}" checkedLabel="on" unCheckedLabel="off" ?defaultChecked="${true}"></f-switch>
            </div>
            <div>
                <select>
                    <option value="1">A</option>
                    <option value="2">B</option>
                    <option value="3">C</option>
                    <option value="4">D</option>
                    <option value="5">E</option>
                    <option value="6">F</option>
                    <option value="7">G</option>
                </select>
                <f-dropdown>
                    <span>click me</span>
                    <template>
                        <div style="height:100px;color:white;background:black;">I am ${a}</div>
                    </template>
                </f-dropdown>
                
            </div>
        </div>`
    }
}

mount({
    el:'#container',
    // template:html`${createButtons()}`

    // template:html`<f-checkbox defaultIndeterminate="${true}" defaultChecked="${true}" @change="${onChange}">
    //      abc
    //      <span slot="luodan">luodan</span>
    //      ced
    // </f-checkbox>`
    components:{
        app:App
    },
    template:html`<app></app>`
})




// console.log('mount');
// document.getElementById('container').innerHTML = createButtons().join('')