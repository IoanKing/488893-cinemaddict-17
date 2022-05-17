import {createElement} from '../render.js';

export default class View {
  #element = null;

  get element() {
    if (!this.#element)  {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
