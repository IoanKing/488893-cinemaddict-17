import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {
  getHumanReadableTime,
  getHumanReadableDate,
  onCtrlEnterKeydown
} from '../utils/utils.js';
import he from 'he';

const BLANK_CARD = {
  id: null,
  comments: [],
  filmInfo: {
    title: '',
    alternativeTitle: '',
    totalRating: 0,
    poster: null,
    ageRating: null,
    director: null,
    writers: null,
    actors: null,
    release: {
      date: null,
      releaseCountry: null
    },
    runtime: null,
    genre: null,
    description: ''
  },
  userDetails: {
    watchlist: false,
    isAlreadyWatched: false,
    watchingDate: false,
    favorite: false,
  }
};

/**
 * Получение шаблона списка жанров для фильма.
 * @param {array} genres - Список жанров фтльма.
 * @returns - Шаблон.
 */
const createGenresTemplates = (genres) => {
  let result = '';
  for (const genre of genres) {
    result += `<span class="film-details__genre">${genre}</span>`;
  }
  return result;
};

const createEmotionTemplate = (emotion) => {
  if (emotion !== null) {
    return `<img src="images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">`;
  }
  return '';
};

/**
 * Получение шаблона формы просмотра фильма.
 * @param {object} data - Данные фильма.
 * @returns - Шаблон.
 */
const createPopupTemplate = (data) => {
  const {commentText, emotionIcon, isWatchList, isWatched, isFavorite, card, isDisabled, isSaving} = data;
  const {filmInfo} = card;
  const {comments} = card;

  const watchListClassName = isWatchList
    ? 'film-details__control-button--active'
    : '';

  const watchedClassName  = isWatched
    ? 'film-details__control-button--active'
    : '';

  const favoriteClassName  = isFavorite
    ? 'film-details__control-button--active'
    : '';

  return `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="${filmInfo.poster}" alt="">

            <p class="film-details__age">${filmInfo.ageRating}+</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${filmInfo.title}</h3>
                <p class="film-details__title-original">${filmInfo.alternativeTitle}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${filmInfo.totalRating}</p>
              </div>
            </div>

            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${filmInfo.director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${filmInfo.writers.join(', ')}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${filmInfo.actors.join(', ')}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${getHumanReadableDate(filmInfo.release.date)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${getHumanReadableTime(filmInfo.runtime)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${filmInfo.release.releaseCountry}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">${(filmInfo.genre.length > 1) ? 'Genres' : 'Genre'}</td>
                <td class="film-details__cell">
                  ${createGenresTemplates(filmInfo.genre)}
              </tr>
            </table>

            <p class="film-details__film-description">
            ${filmInfo.description}
            </p>
          </div>
        </div>

        <section class="film-details__controls">
          <button type="button" class="film-details__control-button film-details__control-button--watchlist ${watchListClassName}" id="watchlist" name="watchlist">Add to watchlist</button>
          <button type="button" class="film-details__control-button  film-details__control-button--watched  ${watchedClassName}" id="watched" name="watched">Already watched</button>
          <button type="button" class="film-details__control-button film-details__control-button--favorite  ${favoriteClassName}" id="favorite" name="favorite">Add to favorites</button>
        </section>
      </div>

      <div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${(comments !== null) ? comments.length : ''}</span></h3>

          <ul class="film-details__comments-list">
          </ul>

          <div class="film-details__new-comment">
            <div class="film-details__add-emoji-label">${(isSaving) ? '' : createEmotionTemplate(emotionIcon)}</div>

            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="${isSaving ? 'Saving...' : 'Select reaction below and write comment here'}" name="comment" ${isSaving || isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : he.encode(commentText)}</textarea>
            </label>

            <div class="film-details__emoji-list">
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile" ${(emotionIcon === 'smile') ? 'checked' : ''} ${isSaving || isDisabled ? 'disabled' : ''}>
              <label class="film-details__emoji-label" for="emoji-smile">
                <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping" ${(emotionIcon === 'sleeping') ? 'checked' : ''} ${isSaving || isDisabled ? 'disabled' : ''}>
              <label class="film-details__emoji-label" for="emoji-sleeping">
                <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke" ${(emotionIcon === 'puke') ? 'checked' : ''} ${isSaving || isDisabled ? 'disabled' : ''}>
              <label class="film-details__emoji-label" for="emoji-puke">
                <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry" ${(emotionIcon === 'angry') ? 'checked' : ''} ${isSaving || isDisabled ? 'disabled' : ''}>
              <label class="film-details__emoji-label" for="emoji-angry">
                <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
              </label>
            </div>
          </div>
        </section>
      </div>
    </form>
    </section>`;
};

export default class NewPopupView extends AbstractStatefulView {
  #onEmotionChange = null;

  constructor(card = BLANK_CARD, onEmotionChange) {
    super();
    this._state = NewPopupView.parseCardToState(card);
    this.#onEmotionChange = onEmotionChange;
    this.#setInnerHandlers();
  }

  static parseCardToState = (data) => ({
    card: {...data},
    scrollPosition: 0,
    emotionIcon: null,
    commentText: '',
    isWatchList: data.userDetails.watchlist,
    isWatched: data.userDetails.isAlreadyWatched,
    isFavorite: data.userDetails.favorite,
    isDisabled: false,
    isSaving: false
  });

  static parseStateToComment = (state) => {
    const newComment = {
      movieId: state.card.id,
      comment: state.commentText,
      emotion: state.emotionIcon,
      isSaving: state.isSaving
    };
    return newComment;
  };

  static parseStateToCard = (state) => {
    const updatedCard = {...state};
    delete updatedCard.scrollPosition;
    delete updatedCard.commentId;
    delete updatedCard.emotionIcon;
    delete updatedCard.commentText;
    delete updatedCard.isDisabled;
    delete updatedCard.isSaving;
    return updatedCard;
  };

  get template() {
    return createPopupTemplate(this._state);
  }

  get scrollPosition() {
    return this._state.scrollPosition;
  }

  set scrollPosition(position) {
    this.element.scrollTop = position;
  }

  setScrollHandler = () => {
    this.element.addEventListener('scroll', () => {
      this._state.scrollPosition = this.element.scrollTop;
    });
  };

  #setInnerHandlers = () => {
    this.element
      .querySelectorAll('.film-details__emoji-item')
      .forEach((element) => element.addEventListener('click', this.#onEmotionClick));
    this.element
      .querySelector('.film-details__comment-input')
      .addEventListener('input', this.#commentInputHandler);
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
  };

  #commentInputHandler = (evt) => {
    evt.preventDefault();
    this._state.commentText = evt.target.value;
  };

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('.film-details__comment-input').addEventListener('keydown', this.#submitFormHandler);
  };

  setCloseClickHandler = (callback) => {
    this._callback.closeClick = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#closeClickHandler);
  };

  #onEmotionClick = (evt) => {
    evt.preventDefault();
    this.updateElement({
      ...this._state,
      emotionIcon: evt.target.value
    });
    this.#onEmotionChange();
    this.element.scrollTop = this._state.scrollPosition;
  };

  #closeClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.closeClick();
  };

  #submitFormHandler = (evt) => {
    if (onCtrlEnterKeydown(evt)) {
      evt.preventDefault();
      if (this._state.emotionIcon !== null) {
        this._state.isDisabled = true;
        this._state.isSaving = true;
        this._callback.formSubmit(NewPopupView.parseStateToComment(this._state));
        this._state.emotionIcon = null;
        this._state.commentText = '';
      }
    }
  };

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#watchlistClickHandler);
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#favoriteClickHandler);
  };

  setWatchedClickHandler = (callback) => {
    this._callback.watchedClick = callback;
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#wathcedClickHandler);
  };

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      ...this._state,
      isWatchList: !this._state.isWatchList
    });
    this.element.scrollTop = this._state.scrollPosition;
    this._callback.watchlistClick(NewPopupView.parseStateToCard(this._state));
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      ...this._state,
      isFavorite: !this._state.isFavorite
    });
    this.element.scrollTop = this._state.scrollPosition;
    this._callback.favoriteClick(NewPopupView.parseStateToCard(this._state));
  };

  #wathcedClickHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      ...this._state,
      isWatched: !this._state.isWatched
    });
    this.element.scrollTop = this._state.scrollPosition;
    this._callback.watchedClick(NewPopupView.parseStateToCard(this._state));
  };
}
