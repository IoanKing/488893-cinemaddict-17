import ProffileView from '../view/profile-view.js';
import {render, remove, replace} from '../framework/render.js';

export default class ProfilePresenter {
  #cardModel = null;
  #profileComponent = null;
  #parentComponent = null;

  constructor(component, cardModel) {
    this.#cardModel = cardModel;
    this.#parentComponent = component;

    this.#cardModel.addObserver(this.#cardUpdateEvent);
  }

  init = () => {
    const prevProfileComponent = this.#profileComponent;
    this.#profileComponent = new ProffileView(this.#cardModel);

    if (prevProfileComponent === null) {
      render(this.#profileComponent, this.#parentComponent);
      return;
    }

    replace(this.#profileComponent, prevProfileComponent);
    remove(prevProfileComponent);
  };

  #cardUpdateEvent = () => {
    this.init();
  };

}
