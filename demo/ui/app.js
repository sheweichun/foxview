import {html,mount} from 'foxview';
import {install} from 'foxview-ui';
import 'foxview-ui/lib/index.css';


// console.log('install :',install);
install('f')


function createButtons(){
    let str = [];
    for(let i = 0; i < 1000; i ++){
        // str.push(html`<f-button>test</f-button>`)
        // str.push(html`<button>test</button>`)
        str.push(`<button>test</button>`)
    }
    return str;
}

mount({
    el:'#container',
    // template:html`${createButtons()}`
    template:html`
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
    </div>`
})




// console.log('mount');
// document.getElementById('container').innerHTML = createButtons().join('')