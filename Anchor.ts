
export default class Anchor extends HTMLElement {
  constructor() {
    super()
    this.style.display = 'none'
  }

  connectedCallback() {
    this.dispatchEvent(new CustomEvent('connected'))
  }

  disconnectedCallback() {
    this.dispatchEvent(new CustomEvent('disconnected'))
  }
}

customElements.define('template-instantiation-polyfill-anchor', Anchor)