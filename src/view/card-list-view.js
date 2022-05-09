import View from './view.js';

const createCardListTemplate = (isExtra, title) => `<section class="films-list ${(isExtra) ? 'films-list--extra': ''}"><h2 class="films-list__title ${(isExtra) ? '': 'visually-hidden'}">${title}</h2></section>`;

export default class NewCardListView extends View  {
  constructor(isExtra = false, title = 'All movies. Upcoming') {
    super();
    this.isExtra = isExtra;
    this.title = title;
  }

  getTemplate() {
    return createCardListTemplate(this.isExtra, this.title);
  }
}
