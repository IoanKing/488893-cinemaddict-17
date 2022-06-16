import NewCardView from '../view/card-view.js';
import {render, replace, remove} from '../framework/render.js';
import PopupPresenter from './popup-presenter.js';
import {UserAction, UpdateType, CommentAction} from '../const.js';

const bodyComponent = document.querySelector('body');

export default class CardPresenter {
  #cardListContainer = null;
  #comments = null;
  #card = null;
  #cardComponent = null;
  #changeData = null;
  _callback = {};

  #popupPresentor = null;
  #onPopupOpen = false;
  #addComment = null;

  constructor(cardListContainer, changeData, onPopupOpen, addComment) {
    this.#cardListContainer = cardListContainer;
    this.#changeData = changeData;
    this.#onPopupOpen = onPopupOpen;
    this.#addComment = addComment;
  }

  init = (card, comments) => {
    this.#card = card;
    this.#comments = comments.filter((values) => this.#card.comments.has(values.id));

    const prevCardComponent = this.#cardComponent;

    this.#cardComponent = new NewCardView(this.#card);

    if (prevCardComponent === null) {
      render(this.#cardComponent, this.#cardListContainer);
      this.#setHandlers();
      return;
    }

    if (this.#cardListContainer.contains(prevCardComponent.element)) {
      replace(this.#cardComponent, prevCardComponent);
      this.#setHandlers();
    }

    remove(prevCardComponent);
  };

  get card() {
    return this.#card;
  }

  #setHandlers = () => {
    this.#cardComponent.setEditClickHandler(this.#popupClickHandler);
    this.#cardComponent.setWatchlistClickHandler(this.#onWathlistClick);
    this.#cardComponent.setFavoriteClickHandler(this.#onFavoriteClick);
    this.#cardComponent.setWatchedClickHandler(this.#onWatchedClick);
  };

  #popupClickHandler = () => {
    this.#renderPopup(this.#card, this.#comments);
  };

  resetPopup = () => {
    if (this.#popupPresentor !== null) {
      this.#popupPresentor.destroy();
      this.#popupPresentor = null;
    }
  };

  destroy = () => {
    remove(this.#cardComponent);
  };

  #renderPopup = (card, comments) => {
    this.#onPopupOpen();
    const popupPresenter = new PopupPresenter(bodyComponent, this.#onPopupChange, this.#onCommentAdd);
    popupPresenter.init(card, comments);

    this.#popupPresentor = popupPresenter;
  };

  #onPopupChange = (targetClick) => {
    switch (targetClick) {
      case ('watchlist'):
        this.#onWathlistClick();
        break;
      case ('favorite'):
        this.#onFavoriteClick();
        break;
      case ('watched'):
        this.#onWatchedClick();
        break;
    }
    this.#popupPresentor.init(this.#card, this.#comments);
  };

  #onCommentAdd = (element) => {
    this.#addComment(
      CommentAction.ADD_COMMENT,
      UpdateType.PATCH,
      element,
    );
    this.#changeData(
      UserAction.UPDATE_CARD,
      UpdateType.PATCH,
      {...this.#card, comments: this.#card.comments.add(element.id)},
    );
  };

  #onWathlistClick = () => {
    this.#changeData(
      UserAction.UPDATE_CARD,
      UpdateType.MINOR,
      {...this.#card, userDetails: {
        ...this.#card.userDetails,
        watchlist: !this.#card.userDetails.watchlist
      }},
    );
  };

  #onFavoriteClick = () => {
    this.#changeData(
      UserAction.UPDATE_CARD,
      UpdateType.MINOR,
      {...this.#card, userDetails: {
        ...this.#card.userDetails,
        favorite: !this.#card.userDetails.favorite
      }});
  };

  #onWatchedClick = () => {
    this.#changeData(
      UserAction.UPDATE_CARD,
      UpdateType.MINOR,
      {...this.#card, userDetails: {
        ...this.#card.userDetails,
        isAlreadyWatched: !this.#card.userDetails.isAlreadyWatched,
        watchingDate: new Date().toUTCString(),
      }});
  };
}
