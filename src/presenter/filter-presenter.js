import NewFilterView from '../view/filter-view.js';
import {render, RenderPosition, remove} from '../framework/render.js';

export default class FilterPresenter {
  #cards = null;
  #container = null;
  #watchlistCount = 0;
  #historyCount = 0;
  #favoritesCount = 0;
  #component = null;
  #filterPresentor = null;

  constructor(container) {
    this.#container = container;
  }

  init = (cards) => {
    this.#cards = [...cards];

    this.#watchlistCount = this.#cards.filter((values) => values.userDetails.watchlist).length;
    this.#historyCount = this.#cards.filter((values) => values.userDetails.isAlreadyWatched).length;
    this.#favoritesCount = this.#cards.filter((values) => values.userDetails.favorite).length;

    this.#renderFilters(this.#watchlistCount, this.#historyCount, this.#favoritesCount);
  };

  destroy() {
    remove(this.#component);
  }

  #renderFilters = (watchlistCount, historyCount, favoritesCount) => {
    if (this.#filterPresentor !== null) {
      this.#filterPresentor.destroy();
    }
    this.#component = new NewFilterView(watchlistCount, historyCount, favoritesCount);
    render(this.#component, this.#container, RenderPosition.BEFOREBEGIN);
    this.#filterPresentor = this.#component;
  };

}
