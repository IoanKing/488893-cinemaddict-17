import NewCardView from '../view/card-view.js';
import {render, replace, remove} from '../framework/render.js';
import PopupPresenter from './popup-presenter.js';
import {UserAction, UpdateType} from '../const.js';

const bodyComponent = document.querySelector('body');

export default class CardPresenter {
  #cardListContainer = null;
  #commentModel = null;
  #card = null;
  #cardComponent = null;
  #changeData = null;
  _callback = {};

  #popupPresentor = null;
  #onPopupOpen = false;

  constructor(cardListContainer, changeData, onPopupOpen) {
    this.#cardListContainer = cardListContainer;
    this.#changeData = changeData;
    this.#onPopupOpen = onPopupOpen;
  }

  init = (card, commentModel) => {
    this.#card = card;
    this.#commentModel = commentModel;
    this.#commentModel.addObserver(this.#onCommentAction);

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
    this.#renderPopup(this.#card, this.#commentModel);
  };

  resetPopup = () => {
    if (this.#popupPresentor !== null) {
      this.#popupPresentor.destroy();
      this.#popupPresentor = null;
    }
  };

  destroy = () => {
    this.#commentModel.removeObserver(this.#onCommentAction);
    remove(this.#cardComponent);
  };

  #renderPopup = (card, comments) => {
    this.#onPopupOpen();
    const popupPresenter = new PopupPresenter(bodyComponent, this.#onPopupChange);
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
    this.#popupPresentor.init(this.#card, this.#commentModel);
  };

  #onCommentAction = (updateType, update) => {
    if (update.cardId !== undefined) {
      if (update.cardId === this.#card.id) {
        this.#changeData(
          UserAction.UPDATE_CARD,
          updateType,
          {...this.#card, comments: this.#card.comments.add(update.id)},
        );
      }
    } else {
      const hasComment = this.#card.comments.has(update.id);
      if (hasComment) {
        this.#card.comments.delete(update.id);
        this.#changeData(
          UserAction.UPDATE_CARD,
          updateType,
          {...this.#card, comments: this.#card.comments},
        );
      }
    }
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
