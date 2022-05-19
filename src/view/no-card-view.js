import View from './view.js';

const createNoCardTemplate = () => (
  '<h2 class="films-list__title">There are no movies in our database</h2>'
);

/** Класс заглушки. */
export default class NewCardView extends View {
  #card = null;

  constructor() {
    super();
  }

  get template() {
    return createNoCardTemplate(this.#card);
  }
}
