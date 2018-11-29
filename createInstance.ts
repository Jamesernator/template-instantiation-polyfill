import TemplatePart from './TemplatePart.js'
import TemplateInstance from './TemplateInstance.js'
import NodeTemplatePart from './NodeTemplatePart.js'
import Anchor from './Anchor.js'
import descendantNodes from './descendantNodes.js';
import parseATemplateString from './parseATemplateString.js';

import AttributeTemplatePart, { 
  applyPartListToElement
} from './AttributeTemplatePart.js'

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
  clonedTree.normalize()
  
  const parts: Array<TemplatePart> = []
  const instance = new TemplateInstance(parts, processor)

  instance.appendChild(clonedTree)

  for (const currentNode of [...descendantNodes(instance)]) {
    if (currentNode instanceof Text) {
      const value = currentNode.data.trim()
      const tokens = parseATemplateString(value)
      if (tokens.length === 1 && tokens[0][0] === 'string') {
        continue
      }
      const parentNode = currentNode.parentNode!
      const nextSibling = currentNode.nextSibling

      currentNode.remove()
      
      for (const [tokenType, tokenValue] of tokens) {
        if (tokenType === 'string') {
          parentNode.insertBefore(new Text(tokenValue), nextSibling)
        } else {
          const anchorNode = new Anchor()
          const nodePart = new NodeTemplatePart(tokenValue, anchorNode)
          parts.push(nodePart)
          parentNode.insertBefore(anchorNode, nextSibling)
        }
      }
    } else if (currentNode instanceof HTMLTemplateElement) {
      // TODO: Complete this
    } else if (currentNode instanceof Element) {
      for (const attribute of currentNode.attributes) {
        const value = attribute.value.trim()
        const tokens = parseATemplateString(value)
        if (tokens.length === 1 && tokens[0][0] === 'string') {
          continue
        }

        const partList: Array<string | AttributeTemplatePart> = []
        for (const [tokenType, tokenValue] of tokens) {
          if (tokenType === 'string') {
            partList.push(tokenValue)
          } else {
            const attributePart = new AttributeTemplatePart({
              expression: tokenValue,
              element: currentNode,
              attribute,
              partList,
            })
            partList.push(attributePart)
            parts.push(attributePart)
          }
        }
        applyPartListToElement(currentNode, attribute, partList)
      }
    }
  }

  return instance
}