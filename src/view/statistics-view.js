import View from './view.js';

const createStatisticTemplate = () => '<p>130 291 movies inside</p>';

export default class NewStatisticView extends View {
  constructor() {
    super();
  }

  getTemplate() {
    return createStatisticTemplate();
  }
}
