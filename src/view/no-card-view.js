import AbstractView from '../framework/view/abstract-view.js';
import {FilterType} from '../const.js';

const NoCardTextType = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.WATCHLIST]: 'There are no movies to watch now',
  [FilterType.HISTORY]: 'There are no watched movies now',
  [FilterType.FAVORITE]: 'There are no favorite movies now',
};

const createNoCardTemplate = (filterType) => {
  const noCardTextValue = NoCardTextType[filterType];
  return `<h2 class="films-list__title">${noCardTextValue}</h2>`;
};

/** Класс заглушки. */
export default class NewCardView extends AbstractView {
  #filterType = null;

  constructor(filterType) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createNoCardTemplate(this.#filterType);
  }
}
