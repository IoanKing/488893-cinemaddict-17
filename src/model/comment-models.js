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

  addComment= async (updateType, update) => {
    try {
      const response = await this.#commentApiService.addComment(update);
      const newComment = this.#adaptToClient(response);
      this.#comments = [newComment, ...this.#comments];
      this._notify(updateType, newComment);
    } catch(err) {
      console.log(err);
      throw new Error('Can\'t add comment');
    }
  };

  deleteComment = async (updateType, update) => {
    const index = this.#comments.findIndex((comment) => comment.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    try {
      // Обратите внимание, метод удаления задачи на сервере
      // ничего не возвращает. Это и верно,
      // ведь что можно вернуть при удалении задачи?
      await this.#commentApiService.deleteComment(update);
      this.#comments = [
        ...this.#comments.slice(0, index),
        ...this.#comments.slice(index + 1),
      ];
      this._notify(updateType);
    } catch(err) {
      console.log(err);
      throw new Error('Can\'t delete comment');
    }
  };

  #adaptToClient = (comment) => {
    const adaptedComment = {...comment};
    return adaptedComment;
  };
}
