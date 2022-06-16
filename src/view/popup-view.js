import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {
  getHumanReadableTime,
  getHumanReadableDate,
  getCommentDate,
  onCtrlEnterKeydown,
  // debounce
} from '../utils/utils.js';
import {nanoid} from 'nanoid';

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

/**
 * Получение шаблона комментариев.
 * @param {object} comments - Данные комментариев.
 * @returns - Шаблон.
 */
const createCommentsTemplate = (comments) => {
  let result = '';
  for (const comm of comments) {
    const {emotion, comment, author, date} = comm;
    result += `<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
    </span>
    <div>
      <p class="film-details__comment-text">${comment}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${author}</span>
        <span class="film-details__comment-day">${getCommentDate(date)}</span>
        <button class="film-details__comment-delete">Delete</button>
      </p>
    </div>
  </li>`;
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
const createPopupTemplate = (data, comments) => {
  const {filmInfo, userDetails, commentText, emotionIcon} = data;

  const watchListClassName = userDetails.watchlist
    ? 'film-details__control-button--active'
    : '';

  const watchedClassName  = userDetails.isAlreadyWatched
    ? 'film-details__control-button--active'
    : '';

  const favoriteClassName  = userDetails.favorite
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
            <img class="film-details__poster-img" src="./images/posters/${filmInfo.poster}" alt="">

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
                <td class="film-details__term">Genres</td>
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
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

          <ul class="film-details__comments-list">
            ${createCommentsTemplate(comments)}
          </ul>

          <div class="film-details__new-comment">
            <div class="film-details__add-emoji-label">${createEmotionTemplate(emotionIcon)}</div>

            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${commentText}</textarea>
            </label>

            <div class="film-details__emoji-list">
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile" ${(emotionIcon === 'smile') ? 'checked' : ''}>
              <label class="film-details__emoji-label" for="emoji-smile">
                <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping" ${(emotionIcon === 'sleeping') ? 'checked' : ''}>
              <label class="film-details__emoji-label" for="emoji-sleeping">
                <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke" ${(emotionIcon === 'puke') ? 'checked' : ''}>
              <label class="film-details__emoji-label" for="emoji-puke">
                <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry" ${(emotionIcon === 'angry') ? 'checked' : ''}>
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
  #comments = null;

  constructor(card = BLANK_CARD, comments) {
    super();
    this._state = NewPopupView.parseCardToState(card);
    this.#comments = comments;
    this.#setInnerHandlers();
  }

  static parseCardToState = (card) => ({...card,
    scrollPosition: 0,
    commentId: nanoid(),
    emotionIcon: null,
    commentText: ''
  });

  static parseStateToComment = (state) => {
    const newComment = {
      id: state.commentId,
      text: state.commentText,
      emotion: state.emotionIcon,
    };
    return newComment;
  };

  get template() {
    return createPopupTemplate(this._state, this.#comments);
  }

  get scrollPosition() {
    return this.element.scrollTop;
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
    // debounce(() => {
    //   this._state.commentText = evt.target.value;
    //   console.log(this._state.commentText);
    // });
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
      emotionIcon: evt.target.value,
      commentText: this._state.commentText
    });
    this.element.scrollTop = this._state.scrollPosition;
  };

  #closeClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.closeClick();
  };

  #submitFormHandler = (evt) => {
    if (onCtrlEnterKeydown(evt)) {
      evt.preventDefault();
      this._callback.formSubmit(NewPopupView.parseStateToComment(this._state));
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
    this._callback.watchlistClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  };

  #wathcedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchedClick();
  };
}
