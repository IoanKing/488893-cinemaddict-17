import AbstractView from '../framework/view/abstract-view.js';

const createButtonShowMoreTemplate = () => '<button class="films-list__show-more">Show more</button>';

export default class NewButtonShowMoreView extends AbstractView {
  constructor() {
    super();
  }

  get template() {
    return createButtonShowMoreTemplate();
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.addEventListener('click', this.#clickHandler);
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };
}
