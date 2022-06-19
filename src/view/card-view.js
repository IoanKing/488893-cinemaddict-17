import AbstractView from '../framework/view/abstract-view.js';
import {getYearDate, getHumanReadableTime, getDescriptionShort} from '../utils/utils.js';

/**
 * Получение шаблона карточки фильма.
 * @param {object} data - Данные для генерации шаблона.
 * @returns {string} - Шаблон.
 */
const createCardTemplate = (data) => {
  const {title, totalRating, poster, description, genre, runtime, release} = data.filmInfo;
  const {watchlist, isAlreadyWatched, favorite} = data.userDetails;
  const commentCount = data.comments.size;

  const watchListClassName = watchlist
    ? 'film-card__controls-item--active'
    : '';

  const watchedClassName  = isAlreadyWatched
    ? 'film-card__controls-item--active'
    : '';

  const favoriteClassName  = favorite
    ? 'film-card__controls-item--active'
    : '';

  return `<article class="film-card">
    <a class="film-card__link">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${totalRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${getYearDate(release.date)}</span>
        <span class="film-card__duration">${getHumanReadableTime(runtime)}</span>
        <span class="film-card__genre">${genre.join(', ')}</span>
      </p>
      <img src="./images/posters/${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${getDescriptionShort(description)}</p>
      <span class="film-card__comments">${commentCount} comments</span>
    </a>
    <div class="film-card__controls">
      <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${watchListClassName}" type="button">Add to watchlist</button>
      <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${watchedClassName}" type="button">Mark as watched</button>
      <button class="film-card__controls-item film-card__controls-item--favorite ${favoriteClassName}" type="button">Mark as favorite</button>
    </div>
    </article>`;
};

/** Класс карточки фильма. */
export default class NewCardView extends AbstractView {
  #card = null;

  constructor(card) {
    super();
    this.#card = card;
  }

  get template() {
    return createCardTemplate(this.#card);
  }

  setEditClickHandler = (callback) => {
    this._callback.editClick = callback;
    this.element.querySelector('.film-card__link').addEventListener('click', this.#editClickHandler);
  };

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.element
      .querySelector('.film-card__controls-item--add-to-watchlist')
      .addEventListener('click', (evt) => {
        this.#cardControlClickHandler(evt, this._callback.watchlistClick);
      });
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element
      .querySelector('.film-card__controls-item--favorite')
      .addEventListener('click', (evt) => {
        this.#cardControlClickHandler(evt, this._callback.favoriteClick);
      });
  };

  setWatchedClickHandler = (callback) => {
    this._callback.watchedClick = callback;
    this.element
      .querySelector('.film-card__controls-item--mark-as-watched')
      .addEventListener('click', (evt) => {
        this.#cardControlClickHandler(evt, this._callback.watchedClick);
      });
  };

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.editClick();
  };

  #cardControlClickHandler = (evt, callback) => {
    evt.preventDefault();
    callback();
  };
}
