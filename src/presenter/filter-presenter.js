import NewFilterView from '../view/filter-view.js';
import {render, RenderPosition, remove} from '../framework/render.js';

export default class FilterPresenter {
  #data = null;
  #container = null;
  #watchlistCount = 0;
  #historyCount = 0;
  #favoritesCount = 0;
  #component = null;

  constructor(container) {
    this.#container = container;
  }

  init = (data) => {
    this.#data = [...data];

    this.#watchlistCount = this.#data.filter((values) => values.userDetails.watchlist).length;
    this.#historyCount = this.#data.filter((values) => values.userDetails.isAlreadyWatched).length;
    this.#favoritesCount = this.#data.filter((values) => values.userDetails.favorite).length;

    this.#renderFilters(this.#watchlistCount, this.#historyCount, this.#favoritesCount);
  };

  destroy() {
    remove(this.#component);
  }

  #renderFilters = (watchlistCount, historyCount, favoritesCount) => {
    this.#component = new NewFilterView(watchlistCount, historyCount, favoritesCount);
    render(this.#component, this.#container, RenderPosition.BEFOREBEGIN);
  };

}
