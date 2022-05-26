import AbstractView from '../framework/view/abstract-view.js';

const createCardListTemplate = (isExtra, title) => `<section class="films-list ${(isExtra) ? 'films-list--extra': ''}"><h2 class="films-list__title ${(isExtra) ? '': 'visually-hidden'}">${title}</h2></section>`;

export default class NewCardListView extends AbstractView  {
  #isExtra = false;
  #title = '';

  constructor(isExtra = false, title = 'All movies. Upcoming') {
    super();
    this.#isExtra = isExtra;
    this.#title = title;
  }

  get template() {
    return createCardListTemplate(this.#isExtra, this.#title);
  }
}
