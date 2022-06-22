import {render, remove, replace} from '../framework/render.js';
import NewCommentView from '../view/comment-view.js';
import {UpdateType} from '../const.js';

export default class CommentPresenter {
  #component = null;
  #commentModel = null;
  #comment = null;
  #commentComponent = null;

  constructor(component, commentModel) {
    this.#component = component;
    this.#commentModel = commentModel;
    this.#commentModel.addObserver(this.#onCommentAction);
  }

  init = (comment) => {
    this.#comment = comment;

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
    this.#commentComponent.updateElement({
      isDeleting: true
    });
    this.#commentModel.deleteComment(UpdateType.PATCH, data);
  };

  #onCommentAction = (updateType, update) => {
    switch (updateType) {
      case UpdateType.PATCH:
        if (Object.keys(update).indexOf('id') >= 0) {
          if (update.id === this.#comment.id) {
            this.destroy();
          }
        }
        break;
    }
  };
}
