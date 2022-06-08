import NewFilterView from '../view/filter-view.js';
import {render} from '../framework/render.js';

export default class FilterPresenter {
  #dataModel = null;
  #filterContainer = null;
  #watchlistCount = 0;
  #historyCount = 0;
  #favoritesCount = 0;

  constructor(filterContainer, dataModel) {
    this.#filterContainer = filterContainer;
    this.#dataModel = dataModel;
  }

  init = () => {
    this.#dataModel = [...this.#dataModel.data];

    this.#watchlistCount = this.#dataModel.filter((values) => values.userDetails.watchlist).length;
    this.#historyCount = this.#dataModel.filter((values) => values.userDetails.isAlreadyWatched).length;
    this.#favoritesCount = this.#dataModel.filter((values) => values.userDetails.favorite).length;

    this.#renderFilters(this.#watchlistCount, this.#historyCount, this.#favoritesCount);
  };

  #renderFilters = (watchlistCount, historyCount, favoritesCount) => {
    render(new NewFilterView(watchlistCount, historyCount, favoritesCount), this.#filterContainer);
  };

}
