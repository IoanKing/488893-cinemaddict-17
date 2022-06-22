import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { getCommentDate} from '../utils/utils.js';
import he from 'he';

/**
 * Получение шаблона комментариев.
 * @param {object} data - Данные комментариев.
 * @returns - Шаблон.
 */
const createCommentTemplate = (data) => {
  const {emotion, comment, author, date, isDeleting} = data;
  return `<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
    </span>
    <div>
      <p class="film-details__comment-text">${he.encode(comment)}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${author}</span>
        <span class="film-details__comment-day">${getCommentDate(date)}</span>
        <button class="film-details__comment-delete">Delete</button>
      </p>
    </div>
  </li>`;
};

export default class NewCommentView extends AbstractStatefulView {
  #comment = null;

  constructor(comment) {
    super();
    this._state = NewCommentView.parseCommentToState(comment);
  }

  static parseCommentToState = (comment) => ({
    ...comment,
    isDeleting: false
  });

  static parseStateToComment = (state) => {
    const newComment = {...state};
    delete newComment.isDeleting;
    return newComment;
  };


  get template() {
    return createCommentTemplate(this._state);
  }

  setDeleteHandler = (callback) => {
    this._callback.deleteComment = callback;
    this.element.querySelector('.film-details__comment-delete').addEventListener('click', this.#deleteCommentHandler);
  };

  #deleteCommentHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteComment(NewCommentView.parseStateToComment(this._state));
  };
}
