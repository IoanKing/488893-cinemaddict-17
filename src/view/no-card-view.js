import AbstractView from '../framework/view/abstract-view.js';

const createNoCardTemplate = () => (
  '<h2 class="films-list__title">There are no movies in our database</h2>'
);

/** Класс заглушки. */
export default class NewCardView extends AbstractView {
  #card = null;

  constructor() {
    super();
  }

  get template() {
    return createNoCardTemplate(this.#card);
  }
}
