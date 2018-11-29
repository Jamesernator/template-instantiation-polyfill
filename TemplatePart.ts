
export default class TemplatePart {
  _expression: string
  constructor(expression: string) {
    this._expression = expression    
  }

  get expression() {
    return this._expression
  }

  get value(): string {
    throw new Error("must be implemented by subclass")
  }

  set value(_) {
    throw new Error("must be implemented by subclass")
  }
}