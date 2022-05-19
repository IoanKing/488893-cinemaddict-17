import View from './view.js';

const createFilterTemplate = () => `<nav class="main-navigation">
<a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
<a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">13</span></a>
<a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">4</span></a>
<a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">8</span></a>
</nav>`;

export default class NewFilterView extends View {
  constructor() {
    super();
  }

  get template() {
    return createFilterTemplate();
  }
}
