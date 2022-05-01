import {createElement} from '../render.js';

const createCardListExtraTemplate = () => `<section class="films-list films-list--extra">
<h2 class="films-list__title">Top rated</h2>
</section>`;

export default class NewCardListExtraView {
  getTemplate() {
    return createCardListExtraTemplate();
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
