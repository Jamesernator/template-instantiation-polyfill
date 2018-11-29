import TemplatePart from './TemplatePart.js'
import TemplateInstance from './TemplateInstance.js'
import NodeTemplatePart from './NodeTemplatePart.js'
import Anchor from './Anchor.js'


type TemplateProcessor = {
  create?: (templateInstance: TemplateInstance, state: any) => void,
  process: (templateInstance: TemplateInstance, state: any) => void,
}

type CreateInstanceOptions = {
  state?: any,
  processor?: TemplateProcessor,
}

const defaultProcessor = {
  process(templateInstance: TemplateInstance, state: any) {
    for (const part of templateInstance.parts) {
      if (part.expression in state) {
        part.value = state[part.expression]
      }
    }
  },
}

export default function createInstance(
  htmlTemplate: HTMLTemplateElement,
  { state={}, processor=defaultProcessor }: CreateInstanceOptions={},
) {
  const clonedTree = htmlTemplate.content.cloneNode(true)
  const { create, process } = processor
  
  const parts: Array<TemplatePart> = []
  const instance = new TemplateInstance(parts, process)

  
}