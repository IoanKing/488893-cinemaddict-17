import {render, remove, replace} from '../framework/render.js';
import NewCommentView from '../view/comment-view.js';
import {UpdateType} from '../const.js';

export default class CommentPresenter {
  #component = null;
  #commentModel = null;
  #comment = null;
  #commentComponent = null;

  constructor(component) {
    this.#component = component;
  }

  init = (comment, commentModel) => {
    this.#comment = comment;
    this.#commentModel = commentModel;

    const prevCommentComponent = this.#commentComponent;

    this.#commentComponent = new NewCommentView(this.#comment);

    if (prevCommentComponent === null) {
      render(this.#commentComponent, this.#component);
      this.#setHandlers();
      return;
    }

    if (this.#component.contains(prevCommentComponent.element)) {
      replace(this.#commentComponent, prevCommentComponent);
      this.#setHandlers();
    }

    remove(prevCommentComponent);
  };

  destroy = () => {
    remove(this.#commentComponent);
  };

  #setHandlers = () => {
    this.#commentComponent.setDeleteHandler(this.#onDeleteComment);
  };

  #onDeleteComment = (data) => {
    this.#commentModel.deleteComment(UpdateType.PATCH, data);
    this.destroy();
  };
}
