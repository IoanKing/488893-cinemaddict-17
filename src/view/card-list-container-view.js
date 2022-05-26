import AbstractView from '../framework/view/abstract-view.js';

const createContaierTemplate = () => '<div class="films-list__container"></div>';

export default class NewCardListContainerView extends AbstractView {
  constructor() {
    super();
  }

  get template() {
    return createContaierTemplate();
  }
}
