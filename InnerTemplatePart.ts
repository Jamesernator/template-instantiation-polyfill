import TemplatePart from "./TemplatePart.js";
import Anchor from "./Anchor.js";
import defaultTemplateProcessor from "./defaultTemplateProcessor.js";
import createInstance from "./createInstance.js";

export default class InnerTemplatePart extends TemplatePart {
  private _templateElement: HTMLTemplateElement
  private _anchor: Anchor
  private _replacementNodes: Array<ChildNode>

  constructor(templateElement: HTMLTemplateElement, anchor: Anchor) {
    super()
    this._templateElement = templateElement
    this._anchor = anchor
    this._replacementNodes = []
  }

  private _replaceNodes(): void {
    if (this._anchor.isConnected) {
      const referenceNode = this._anchor.nextSibling
      for (const node of this._replacementNodes) {
        this._anchor.parentNode!.insertBefore(node, referenceNode)
      }
    }
  }

  get directive() {
    return this._templateElement.getAttribute('type')
  }

  get replacementNodes() {
    return this._replacementNodes
  }

  get template() {
    return this._templateElement
  }

  replace(nodes: Array<string | ChildNode>) {
    const newReplacementNodes = [...nodes]
      .map(value => {
        if (typeof value === 'string') {
          return new Text(value)
        } else {
          return value
        }
      })
    for (const node of this._replacementNodes) {
      node.remove()
    }

    this._replacementNodes = newReplacementNodes
    this._replaceNodes()
  }

  replaceHTML(html: string) {
    const templateElement = document.createElement('template')
    templateElement.innerHTML = html
    const nodes = [...templateElement.content.childNodes]

    this._replacementNodes = nodes
    this._replaceNodes()
  }

  replaceInstance(state: any, processor=defaultTemplateProcessor) {
    const nodes = createInstance(this._templateElement, {
      state,
      processor,
    }).childNodes
    this.replace([...nodes])
  }
}
