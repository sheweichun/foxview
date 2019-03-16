import { RenderOptions, ITemplateResult ,RenderOptionComponents} from './type';
import { NodePart } from './part';
import { removeNodes, clone } from './dom';
import templateProcessor from './template-processor';
import assign from './util/assign';

export function shadowRender(
  result: ITemplateResult,
  container: Element | DocumentFragment,
  options?: Partial<RenderOptions>
) {
  //@ts-ignore
  let part = container.$$part;
  if (part === undefined) {
    // removeNodes(container, container.firstChild);
    if(options.styleElement){
      container.appendChild(options.styleElement);
    }
    part = new NodePart(
      assign(
        {},
        {
          templateProcessor,
          templateClone: clone
        },
        options
      )
    );
    part.appendInto(container);
    //@ts-ignore
    container.$$part = part;
  }
  part.setValue(result);
  part.commit();
  return part;
}

export function render(
  result: ITemplateResult,
  container: Element | DocumentFragment,
  options?: Partial<RenderOptions>
) {
  return shadowRender(
    result,
    container,
    assign({}, options, {
      notInWebComponent: true
    })
  );
}

type FoxViewOption = {
  el:Element | string,
  template:ITemplateResult,
  components?:RenderOptionComponents
}


export function mount(opt:FoxViewOption){
  let el = opt.el;
  if(typeof el === 'string'){
      el = document.querySelector(el)
  }else{
      el = opt.el as Element;
  }
  render(opt.template,el,{
      components:opt.components || {}
  })
}

export function unmount(container: Element | DocumentFragment){
  //@ts-ignore
  if(container == null || container.$$part == null) return;
  //@ts-ignore
  const _part = container.$$part as NodePart
  _part.destroy();
}