import {createElement} from '../render.js';

const createStatisticTemplate = () => '<p>130 291 movies inside</p>';

export default class NewStatisticView {
  getTemplate() {
    return createStatisticTemplate();
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
