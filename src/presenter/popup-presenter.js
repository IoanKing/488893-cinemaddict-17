import {render, remove, replace, RenderPosition} from '../framework/render.js';
import NewPopupView from '../view/popup-view.js';
import {onEscKeydown} from '../utils/utils.js';
import CommentPresenter from '../presenter/comment-presenter.js';
import {UpdateType} from '../const.js';
import LoadingView from '../view/loading-view.js';

export default class PopupPresenter {
  #commentModel = null;
  #card = null;
  #cardModel = null;

  #elementComponent = null;
  #popupComponent = null;
  #position = 0;
  #commentPresentor = new Map();
  #loadingComponent = new LoadingView();
  #isLoading = true;

  constructor(elementComponent, cardModel, commentModel) {
    this.#elementComponent = elementComponent;
    this.#commentModel = commentModel;
    this.#cardModel = cardModel;
    this.#commentModel.addObserver(this.#onCommentAction);
  }

  get card() {
    return this.#cardModel.cards.find((element) => this.#card.id === element.id);
  }

  get component() {
    return this.#popupComponent;
  }

  get commentListComponent() {
    return this.#popupComponent.element.querySelector('.film-details__comments-list');
  }

  init = (card) => {
    this.#card = card;

    const prevPopupComponent = this.#popupComponent;

    this.#popupComponent = new NewPopupView(this.card, this.#commentModel, this.#onEmotionClick);

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

  destroy = () => {
    this.#commentModel.removeObserver(this.#onCommentAction);
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

  #onCommentAction = (updateType) => {
    switch (updateType) {
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderCommentList();
        break;
    }
  };

  #renderLoading = () => {
    render(this.#loadingComponent, this.commentListComponent, RenderPosition.AFTERBEGIN);
  };

  #renderCommentList = () => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (this.#commentPresentor !== null) {
      this.#commentPresentor.forEach((presenter) => presenter.destroy());
      this.#commentPresentor.clear();
    }
    if (this.#commentModel.comments !== null) {
      this.#commentModel.comments.forEach((comment) => this.#renderComment(comment));
    }
    remove(this.#loadingComponent);
  };

  #setHandlers = () => {
    this.#popupComponent.setScrollHandler();
    this.#popupComponent.setFormSubmitHandler(this.#onSubmit);
    this.#popupComponent.setCloseClickHandler(this.#onCloseClick);
    this.#popupComponent.setWatchlistClickHandler(this.#onCardControlClick);
    this.#popupComponent.setFavoriteClickHandler(this.#onCardControlClick);
    this.#popupComponent.setWatchedClickHandler(this.#onCardControlClick);
  };

  #onSubmit = (element) => {
    this.#onCommentAdd(element);
    this.#removePopup();
  };

  #addPopup = () => {
    render(this.#popupComponent, this.#elementComponent);
    this.#elementComponent.classList.add('hide-overflow');
    this.#setHandlers();
    this.#renderCommentList();
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

  #onCardControlClick = (data) => {
    const {card, isWatchList, isWatched, isFavorite} = data;

    this.#cardModel.updateCard(
      UpdateType.MINOR,
      {...card, userDetails: {
        ...card.userDetails,
        watchlist: isWatchList,
        isAlreadyWatched: isWatched,
        favorite: isFavorite,
      }},
    );
    this.#renderCommentList();
    this.#setHandlers();
  };
}
