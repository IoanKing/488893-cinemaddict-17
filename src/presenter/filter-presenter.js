import NewFilterView from '../view/filter-view.js';
import {render, RenderPosition, remove} from '../framework/render.js';

export default class FilterPresenter {
  #cards = null;
  #container = null;
  #component = null;
  #filterPresentor = null;
  #currentFilterType = null;
  #filters = [];

  constructor(container, currentFilterType) {
    this.#container = container;
    this.#currentFilterType = currentFilterType;
  }

  init = (cards) => {
    this.#cards = [...cards.cards];

    this.#filters.push({
      type: 'all',
      name: 'All movies',
      count: this.#cards.length,
    });

    this.#filters.push({
      type: 'watchlist',
      name: 'Watchlist',
      count: this.#cards.filter((values) => values.userDetails.watchlist).length
    });

    this.#filters.push({
      type: 'history',
      name: 'History',
      count: this.#cards.filter((values) => values.userDetails.isAlreadyWatched).length
    });

    this.#filters.push({
      type: 'favorites',
      name: 'Favorites',
      count: this.#cards.filter((values) => values.userDetails.favorite).length
    });

    this.#renderFilters();
  };

  destroy() {
    remove(this.#component);
  }

  #renderFilters = () => {
    if (this.#filterPresentor !== null) {
      this.#filterPresentor.destroy();
    }
    this.#component = new NewFilterView(this.#filters, this.#currentFilterType);
    render(this.#component, this.#container, RenderPosition.BEFOREBEGIN);
    this.#filterPresentor = this.#component;
  };

}
