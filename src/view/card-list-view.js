import View from './view.js';

const createCardListTemplate = (isExtra) => `<section class="films-list ${(isExtra) ? 'films-list--extra': ''}"><h2 class="films-list__title ${(isExtra) ? '': 'visually-hidden'}">All movies. Upcoming</h2></section>`;

export default class NewCardListView extends View  {
  constructor(isExtra = false) {
    super();
    this.isExtra = isExtra;
  }

  getTemplate() {
    return createCardListTemplate(this.isExtra);
  }
}
