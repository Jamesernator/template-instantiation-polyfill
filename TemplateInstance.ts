import TemplatePart from './TemplatePart.js'
import AttributeTemplatePart from './AttributeTemplatePart.js';
import NodeTemplatePart from './NodeTemplatePart.js';
import InnerTemplatePart from './InnerTemplatePart.js';

type TemplateProcessor = {
  create?: (templateInstance: TemplateInstance, state: any) => void,
  process: (templateInstance: TemplateInstance, state: any) => void,
}

function isAttributeTemplatePart(part: TemplatePart): part is AttributeTemplatePart {
  return part instanceof AttributeTemplatePart
}

function isInnerTemplatePart(part: TemplatePart): part is InnerTemplatePart {
  return part instanceof InnerTemplatePart
}

function isNodeTemplatePart(part: TemplatePart): part is NodeTemplatePart {
  return part instanceof NodeTemplatePart
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

  get attributeParts(): Array<AttributeTemplatePart> {
    return this._parts.filter(isAttributeTemplatePart)
  }

  get innerParts(): Array<InnerTemplatePart> {
    return this._parts.filter(isInnerTemplatePart)
  }

  get nodeParts(): Array<NodeTemplatePart> {
    return this._parts.filter(isNodeTemplatePart)
  }

  update(state: any) {
    this._processor.process(this, state)
  }
}