import createButton from './button';
import createIcon from './icon';
import createCheckbox from './checkbox';
import createRadio from './radio';
import createRadioGroup from './radio-group';
import createCheckboxGroup from './checkbox-group';
import createInput from './input';
import createSwitch from './switch';
import createDropdown from './dropdown';
import './core';

export function install(n:string){
    createButton(n);
    createIcon(n);
    createCheckbox(n);
    createRadio(n);
    createRadioGroup(n)
    createCheckboxGroup(n);
    createInput(n);
    createSwitch(n);
    createDropdown(n);
}