import View from './view.js';

const createStatisticTemplate = (count) => `<p>${count} movies inside</p>`;

export default class NewStatisticView extends View {
  constructor(count) {
    super();
    this.count = count;
  }

  getTemplate() {
    return createStatisticTemplate(this.count);
  }
}
