import AbstractView from '../framework/view/abstract-view.js';

const createContainerTemplate = () => '<div class="films-list__container"></div>';

export default class NewCardListContainerView extends AbstractView {
  constructor() {
    super();
  }

  get template() {
    return createContainerTemplate();
  }
}
