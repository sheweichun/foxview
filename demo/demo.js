import {html,defineComponent,Component,render} from 'illidan';


class Demo extends Component{
    constructor(props) {
        super(props);
        this.state = {
            couter : 1
        }
    }
    
    render(){
        const {couter} = this.state;
        return html`<div>
            <span>{this.counter}</span>
        </div>`
    }
}
defineComponent('demo',Demo)



render(html`<demo></demo>`,document.getElementById('container'))