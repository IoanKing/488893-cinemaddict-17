import {createElement} from '../render.js';

const createButtonShowMoreTemplate = () => '<button class="films-list__show-more">Show more</button>';

export default class NewButtonShowMoreView {
  getTemplate() {
    return createButtonShowMoreTemplate();
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
