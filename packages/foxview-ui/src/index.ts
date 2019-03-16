import createButton from './button';
import createIcon from './icon';
import './core';

export function install(namespace:string){
    createButton(namespace);
    createIcon(namespace)
}