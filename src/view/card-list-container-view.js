import View from './view.js';

const createContaierTemplate = () => '<div class="films-list__container"></div>';

export default class NewCardListContainerView extends View {
  constructor() {
    super();
  }

  getTemplate() {
    return createContaierTemplate();
  }
}
