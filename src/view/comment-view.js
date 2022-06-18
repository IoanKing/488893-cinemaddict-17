import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { getCommentDate} from '../utils/utils.js';

/**
 * Получение шаблона комментариев.
 * @param {object} data - Данные комментариев.
 * @returns - Шаблон.
 */
const createCommentTemplate = (data) => {
  const {emotion, comment, author, date} = data;
  return `<li class="film-details__comment">
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
};

export default class NewCommentView extends AbstractStatefulView {
  #comment = null;

  constructor(comment) {
    super();
    this.#comment = comment;
  }

  get template() {
    return createCommentTemplate(this.#comment);
  }
}
