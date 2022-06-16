import AbstractView from '../framework/view/abstract-view.js';

const createStatisticTemplate = (count) => `<p>${count} movies inside</p>`;

export default class NewStatisticView extends AbstractView {
  #count = 0;

  constructor(cardModel) {
    super();
    this.#count = cardModel.cards.length;
  }

  get template() {
    return createStatisticTemplate(this.#count);
  }
}
