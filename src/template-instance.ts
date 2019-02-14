import {RenderOptions,Peon,ITemplateResult} from './type';
// import {TemplateResult} from './template-result';
// import {clone} from './dom';
// import {marker,matchLastAttributeName,boundAttributeSuffix, markerRegex} from './template';

type PrepareMap = {
    [key:number]:Function
}


export class TemplateInstance {
    private _peons: Array<Peon> = [];
    template: ITemplateResult;
    options: RenderOptions;
    fragment:DocumentFragment;
    mounted:boolean = false;
    constructor(
        options: RenderOptions) {
      this.options = options;
    }
    private _prepareFrament(templateResult:ITemplateResult){
        const {peons,fragment} = this.options.templateProcessor(templateResult,this.options)
        this.fragment = fragment;
        this._peons = peons;
    }
    setValue(newTemplate:ITemplateResult){
        if(!this.fragment){
            this._prepareFrament(newTemplate);
        }
        this.template = newTemplate;
        this._peons.forEach((_peon)=>{
            _peon.setValue(this.template.values);
        })
    }
    commit(){
        this._peons.forEach((_peon)=>{
            _peon.commit && _peon.commit();
        })
    }
    _destroy(){
        this._peons.forEach((_peon)=>{
            _peon.destroy && _peon.destroy();
        })
        this._peons = null;
    }
    isSameTemplate(newTemplate:ITemplateResult){
        if(this.template.type !== newTemplate.type) return false;
        const oldStrings = this.template.strings;
        const newStrings = newTemplate.strings;
        const oldLen = oldStrings.length;
        if(oldLen !== newStrings.length){
            return false;
        }
        for(let i = 0; i < oldLen; i++){
            if(oldStrings[i] !== newStrings[i]){
                return false;
            }
        }
        return true;
    }
}