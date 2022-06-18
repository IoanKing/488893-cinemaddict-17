import {render, remove, replace} from '../framework/render.js';
import NewPopupView from '../view/popup-view.js';
import {onEscKeydown} from '../utils/utils.js';
import CommentPresenter from '../presenter/comment-presenter.js';
import {UpdateType} from '../const.js';

export default class PopupPresenter {
  #commentModel = null;
  #card = null;
  #changeData = null;

  #elementComponent = null;
  #popupComponent = null;
  #position = 0;
  #commentPresentor = new Map();

  constructor(elementComponent, changeData) {
    this.#elementComponent = elementComponent;
    this.#changeData = changeData;
  }

  init = (card, commentModel) => {
    this.#card = card;
    this.#commentModel = commentModel;
    this.#commentModel.addObserver(this.#renderCommentList);

    const prevPopupComponent = this.#popupComponent;
    this.#popupComponent = new NewPopupView(this.#card, this.comments, this.#onEmotionClick);

    if (prevPopupComponent === null) {
      this.#addPopup();
      document.addEventListener('keydown', this.#onKeyDown);
      return;
    }

    if (this.#elementComponent.contains(prevPopupComponent.element)) {
      this.#position = prevPopupComponent.scrollPosition;
      replace(this.#popupComponent, prevPopupComponent);
      this.#popupComponent.scrollPosition = this.#position;
      this.#setHandlers();
    }

    remove(prevPopupComponent);
  };

  get component() {
    return this.#popupComponent;
  }

  get comments() {
    return this.#commentModel.comments.filter((values) => this.#card.comments.has(values.id));
  }

  get commentListComponent() {
    return this.#popupComponent.element.querySelector('.film-details__comments-list');
  }

  destroy = () => {
    this.#removePopup();
  };

  #renderComment = (comment) => {
    const commentsPresenter = new CommentPresenter(this.commentListComponent);
    commentsPresenter.init(comment, this.#commentModel);

    this.#commentPresentor.set(comment.id, commentsPresenter);
  };

  #onCommentAdd = (data) => {
    this.#commentModel.addComment(UpdateType.PATCH, data);
  };

  #onEmotionClick = () => {
    this.#renderCommentList();
    this.#setHandlers();
  };

  #renderCommentList = () => {
    if (this.#commentPresentor !== null) {
      this.#commentPresentor.forEach((presenter) => presenter.destroy());
      this.#commentPresentor.clear();
    }
    this.comments.forEach((comment) => this.#renderComment(comment));
  };

  #setHandlers = () => {
    this.#popupComponent.setScrollHandler();
    this.#popupComponent.setFormSubmitHandler(this.#onSubmit);
    this.#popupComponent.setCloseClickHandler(this.#onCloseClick);
    this.#popupComponent.setWatchlistClickHandler(() => this.#onCardControlClick('watchlist'));
    this.#popupComponent.setFavoriteClickHandler(() => this.#onCardControlClick('favorite'));
    this.#popupComponent.setWatchedClickHandler(() => this.#onCardControlClick('watched'));
  };

  #onSubmit = (element) => {
    this.#onCommentAdd(element);
    this.#removePopup();
  };

  #addPopup = () => {
    render(this.#popupComponent, this.#elementComponent);
    this.#elementComponent.classList.add('hide-overflow');
    this.#setHandlers();
    this.#renderCommentList(this.comments);
  };

  #removePopup = () => {
    this.#elementComponent.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#onKeyDown);
    remove(this.#popupComponent);
  };

  #onKeyDown = (evt) => {
    if (onEscKeydown(evt)) {
      evt.preventDefault();
      this.#removePopup();
    }
  };

  #onCloseClick = () => {
    this.#removePopup();
  };

  #onCardControlClick = (listName) => {
    this.#changeData(listName);
    this.#renderCommentList(this.comments);
  };
}
