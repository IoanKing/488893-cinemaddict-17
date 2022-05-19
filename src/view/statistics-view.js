import View from './view.js';

const createStatisticTemplate = (count) => `<p>${count} movies inside</p>`;

export default class NewStatisticView extends View {
  #count = 0;

  constructor(count) {
    super();
    this.#count = count;
  }

  get template() {
    return createStatisticTemplate(this.#count);
  }
}
