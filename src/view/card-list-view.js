import {createElement} from '../render.js';

const createCardListTemplate = (isExtra) => `<section class="films-list ${(isExtra) ? 'films-list--extra': ''}"><h2 class="films-list__title ${(isExtra) ? '': 'visually-hidden'}">All movies. Upcoming</h2></section>`;

export default class NewCardListView {
  constructor(isExtra = false) {
    this.isExtra = isExtra;
  }

  getTemplate() {
    return createCardListTemplate(this.isExtra);
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
