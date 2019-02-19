export class TemplateInstance {
    constructor(options) {
        this._peons = [];
        this.mounted = false;
        this.options = options;
    }
    _prepareFrament(templateResult) {
        const { peons, fragment } = this.options.templateProcessor(templateResult, this.options);
        this.fragment = fragment;
        this._peons = peons;
    }
    setValue(newTemplate) {
        if (!this.fragment) {
            this._prepareFrament(newTemplate);
        }
        this.template = newTemplate;
        this._peons.forEach((_peon) => {
            _peon.setValue(this.template.values);
        });
    }
    commit() {
        this._peons.forEach((_peon) => {
            _peon.commit && _peon.commit();
        });
    }
    _destroy() {
        this._peons.forEach((_peon) => {
            _peon.destroy && _peon.destroy();
        });
        this._peons = null;
    }
    isSameTemplate(newTemplate) {
        if (this.template.type !== newTemplate.type)
            return false;
        const oldStrings = this.template.strings;
        const newStrings = newTemplate.strings;
        const oldLen = oldStrings.length;
        if (oldLen !== newStrings.length) {
            return false;
        }
        for (let i = 0; i < oldLen; i++) {
            if (oldStrings[i] !== newStrings[i]) {
                return false;
            }
        }
        return true;
    }
}
