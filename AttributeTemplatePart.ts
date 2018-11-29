import TemplatePart from "./TemplatePart.js";

type PartList = Array<string | AttributeTemplatePart>

type AttributeTemplatePartOptions = {
  expression: string,
  attribute: Attr,
  element: Element,
  partList: Array<string | AttributeTemplatePart>
}

export function applyPartListToElement(
  element: Element, 
  attribute: Attr, 
  partList: PartList,
): void {
  if (partList.length === 1) {
    const fullTemplate = <AttributeTemplatePart>partList[0]
    if (fullTemplate.valueString === null) {
      element.removeAttributeNS(
        attribute.namespaceURI,
        attribute.localName,
      )
    } else {
      element.setAttributeNS(
        attribute.namespaceURI,
        attribute.localName,
        fullTemplate.value,
      )
    }
  } else {
    let newValue = ''
    for (const part of partList) {
      if (typeof part === 'string') {
        newValue += part
      } else {
        newValue += part.value
      }
    }
    element.setAttributeNS(
      attribute.namespaceURI,
      attribute.localName,
      newValue,
    )
  }
}

export default class AttributeTemplatePart extends TemplatePart {
  private _attribute: Attr
  private _element: Element
  private _partList: PartList
  private _valueString: null | string
  private _expression: string

  constructor({
    expression,
    attribute,
    element,
    partList,
  }: AttributeTemplatePartOptions) {
    super()
    this._expression = expression
    this._attribute = attribute
    this._element = element
    this._partList = partList
    this._valueString = null
  }

  get expression() {
    return this._expression
  }

  get element() {
    return this._element
  }

  get attributeName() {
    return this._attribute.localName
  }

  get attributeNamespace() {
    return this._attribute.namespaceURI
  }

  get valueString() {
    return this._valueString
  }

  get value(): string {
    return this._valueString || ''
  }

  set value(value: string | null) {
    this._valueString = value
    applyPartListToElement(this._element, this._attribute, this._partList)
  }

  // TODO: Implement attribute present
  get attributePresent() {
    return this._element.hasAttribute
  }
}