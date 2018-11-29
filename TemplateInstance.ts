import TemplatePart from './TemplatePart.js'

type TemplateProcessor = {
  create?: (templateInstance: TemplateInstance, state: any) => void,
  process: (templateInstance: TemplateInstance, state: any) => void,
}

export default class TemplateInstance extends DocumentFragment {
  _parts: Array<TemplatePart>
  _processor: TemplateProcessor
  constructor(parts: Array<TemplatePart>, processor: TemplateProcessor) {
    super()
    this._parts = parts
    this._processor = processor
  }

  get parts() {
    return this._parts
  }

  update(state: any) {
    this._processor.process(this, state)
  }
}