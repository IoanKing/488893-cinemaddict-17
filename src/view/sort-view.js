import {createElement} from '../render.js';

const createFilterTemplate = () => `<ul class="sort">
<li><a href="#" class="sort__button sort__button--active">Sort by default</a></li>
<li><a href="#" class="sort__button">Sort by date</a></li>
<li><a href="#" class="sort__button">Sort by rating</a></li>
</ul>`;

export default class NewFilterView {
  getTemplate() {
    return createFilterTemplate();
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
