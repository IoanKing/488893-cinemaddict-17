import NewButtonShowMoreView from '../view/button-show-view.js';
import {render, remove} from '../framework/render.js';

export default class ShowButtonPresenter {
  #component = null;
  #elementComponent = null;
  #callback = null;

  constructor(elementComponent) {
    this.elementComponent = elementComponent;
  }

  init = (cb) => {
    this.#callback = cb;
    this.#component = new NewButtonShowMoreView();
    this.#renderShowMoreButton();
  };

  destroy = () => {
    remove(this.#component);
  };

  #renderShowMoreButton = () => {
    render(this.#component, this.elementComponent);
    this.#component.setClickHandler(this.#callback);
  };
}
