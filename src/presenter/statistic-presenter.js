import StatisticView from '../view/statistics-view.js';
import {render} from '../framework/render.js';

export default class StatisticPresenter {
  #cardModel = null;
  #statisticComponent = null;
  #component = null;

  constructor(component, cardModel) {
    this.#cardModel = cardModel;
    this.#component = component;

    this.#cardModel.addObserver(this.#cardUpdateEvent);
  }

  init = () => {
    this.#statisticComponent = new StatisticView(this.#cardModel);
    render(this.#statisticComponent, this.#component);
  };

  #cardUpdateEvent = () => {
    this.init();
    this.#cardModel.removeObserver(this.#cardUpdateEvent);
  };

}
