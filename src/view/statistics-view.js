import AbstractView from '../framework/view/abstract-view.js';

const createStatisticTemplate = (count) => `<p>${count} movies inside</p>`;

export default class NewStatisticView extends AbstractView {
  #count = 0;

  constructor(count) {
    super();
    this.#count = count;
  }

  get template() {
    return createStatisticTemplate(this.#count);
  }
}
