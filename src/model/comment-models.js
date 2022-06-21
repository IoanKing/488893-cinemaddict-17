import Observable from '../framework/observable.js';
import {UpdateType} from '../const.js';

export default class CommentModel extends Observable {
  #comments = null;
  #commentApiService = null;

  constructor(commentApiService) {
    super();
    this.#commentApiService = commentApiService;
  }

  init = async (movie) => {
    try {
      const comments = await this.#commentApiService.getComments(movie);
      this.#comments = comments.map(this.#adaptToClient);
    } catch(err) {
      this.#comments = [];
    }
    this._notify(UpdateType.INIT);
  };

  get comments () {
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
      throw new Error('Can\'t delete unexisting comment');
    }

    this.#comments = [
      ...this.#comments.slice(0, index),
      ...this.#comments.slice(index + 1),
    ];

    this._notify(updateType, update);
  };

  #adaptToClient = (comment) => {
    const adaptedComment = {...comment};
    return adaptedComment;
  };
}
