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

  #onDeleteComment = async (data) => {
    try {
      this.#commentComponent.updateElement({
        isDeleting: true
      });
      await this.#commentModel.deleteComment(UpdateType.PATCH, data);
    } catch(err) {
      this.setAborting();
    }
  };

  setAborting = () => {
    this.#commentComponent.updateElement({
      isDeleting: false
    });
    this.#commentComponent.shake();
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
