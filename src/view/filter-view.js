import AbstractView from '../framework/view/abstract-view.js';

const createFilterTemplate = (watchlistCount, historyCount, favoritesCount) => `<nav class="main-navigation">
<a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
<a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${watchlistCount}</span></a>
<a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${historyCount}</span></a>
<a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${favoritesCount}</span></a>
</nav>`;

export default class NewFilterView extends AbstractView {
  #watchlistCount = 0;
  #historyCount = 0;
  #favoritesCount = 0;

  constructor(watchlistCount, historyCount, favoritesCount) {
    super();
    this.#watchlistCount = watchlistCount;
    this.#historyCount = historyCount;
    this.#favoritesCount = favoritesCount;
  }

  get template() {
    return createFilterTemplate(this.#watchlistCount, this.#historyCount, this.#favoritesCount);
  }
}
