import {createElement} from '../render.js';

const createBoardTemplate = () => '<section class="films"></section>';

export default class NewBoardView {
  getTemplate() {
    return createBoardTemplate();
  }

  getElement() {
    if (!this.element)  {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
