import TemplatePart from './TemplatePart.js'

type ProcessCallback = (templateInstance: TemplateInstance, state: any) => void

export default class TemplateInstance {
  _parts: Array<TemplatePart>
  _processCallback: ProcessCallback
  constructor(parts: Array<TemplatePart>, processCallback: ProcessCallback) {
    this._parts = parts
    this._processCallback = processCallback
  }

  get parts() {
    return this._parts
  }

  update(state: any) {
    this._processCallback(this, state)
  }
}