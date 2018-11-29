
export default class Anchor extends HTMLElement {
  connectedCallback() {
    this.dispatchEvent(new CustomEvent('connected'))
  }

  disconnectedCallback() {
    this.dispatchEvent(new CustomEvent('disconnected'))
  }
}

customElements.define('template-instantiation-polyfill-anchor', Anchor)