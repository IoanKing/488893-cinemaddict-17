import View from './view.js';

const createButtonShowMoreTemplate = () => '<button class="films-list__show-more">Show more</button>';

export default class NewButtonShowMoreView extends View {
  constructor() {
    super();
  }

  get template() {
    return createButtonShowMoreTemplate();
  }
}
