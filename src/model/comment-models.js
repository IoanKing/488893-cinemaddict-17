import {generateComment} from '../mock/comment.js';
import Observable from '../framework/observable.js';

export default class CommentModel extends Observable {
  #comments = Array.from({length: 200}, generateComment);

  get comments() {
    return this.#comments;
  }

  addComment = (updateType, update) => {
    const newElement = generateComment(update);
    this.#comments = [
      newElement,
      ...this.#comments,
    ];

    this._notify(updateType, update);
  };

  deleteComment = (updateType, update) => {
    const index = this.#comments.findIndex((comment) => comment.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting card');
    }

    this.#comments = [
      ...this.#comments.slice(0, index),
      ...this.#comments.slice(index + 1),
    ];

    this._notify(updateType);
  };
}
