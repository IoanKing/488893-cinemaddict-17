import {createElement} from '../render.js';

const createContaierTemplate = () => '<div class="films-list__container"></div>';

export default class NewCardListContainerView {
  getTemplate() {
    return createContaierTemplate();
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
