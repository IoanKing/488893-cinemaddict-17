import AbstractView from '../framework/view/abstract-view.js';

const createStatisticTemplate = (count) => `<p>${count} movies inside</p>`;

export default class StatisticView extends AbstractView {
  #cardModel = null;

  get count() {
    return this.#cardModel.cards.length;
  }

  constructor(cardModel) {
    super();
    this.#cardModel = cardModel;
  }

  get template() {
    return createStatisticTemplate(this.count);
  }
}
