import TemplatePart from "./TemplatePart.js";
import Anchor from "./Anchor.js";

export default class NodeTemplatePart extends TemplatePart {
  private _expression: string
  private _anchor: Node
  private _replacementNodes: Array<ChildNode>
  
  constructor(expression: string, anchorNode: Anchor) {
    super()
    this._expression = expression
    this._anchor = anchorNode
    this._replacementNodes = []

    anchorNode.addEventListener('connected', () => {
      this._replaceNodes()
    })

    anchorNode.addEventListener('disconnected', () => {
      if (!this._anchor.isConnected) {
        for (const node of this._replacementNodes) {
          node.remove()
        }
      }
    })

    this._replaceNodes()
  }

  private _replaceNodes(): void {
    if (this._anchor.isConnected) {
      const referenceNode = this._anchor.nextSibling
      for (const node of this._replacementNodes) {
        this._anchor.parentNode!.insertBefore(node, referenceNode)
      }
    }
  }

  get expression() {
    return this._expression
  }

  get replacementNodes() {
    return this._replacementNodes
  }

  get value() {
    let value = ''
    for (const node of this._replacementNodes) {
      value += node.textContent
    }
    return value
  }

  set value(value) {
    const singleTextNode
      = this._replacementNodes.length === 1
      && this._replacementNodes[0] instanceof Text

    if (singleTextNode) {
      const firstNode = <Text>this._replacementNodes[0]
      firstNode.data = value
    } else {
      for (const node of this._replacementNodes) {
        node.remove()
      }
      const text = new Text(value)
      this._replacementNodes = [text]
      this._replaceNodes()
    }
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
}