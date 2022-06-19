import NewCardView from '../view/card-view.js';
import {render, replace, remove} from '../framework/render.js';
import PopupPresenter from './popup-presenter.js';
import {UpdateType} from '../const.js';

const bodyComponent = document.querySelector('body');

export default class CardPresenter {
  #cardListContainer = null;
  #commentModel = null;
  #comments = null;
  #card = null;
  #cardComponent = null;
  #cardModel = null;
  _callback = {};

  #popupPresentor = null;
  #onPopupOpen = false;

  constructor(cardListContainer, cardModel, commentModel, onPopupOpen) {
    this.#cardListContainer = cardListContainer;
    this.#commentModel = commentModel;
    this.#onPopupOpen = onPopupOpen;
    this.#cardModel = cardModel;
    this.#commentModel.addObserver(this.#onCommentAction);
  }

  init = (card) => {
    this.#card = card;

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
    return this.#cardModel.cards.find((element) => this.#card.id === element.id);
  }

  #setHandlers = () => {
    this.#cardComponent.setEditClickHandler(this.#popupClickHandler);
    this.#cardComponent.setWatchlistClickHandler(() => this.#onControlActionClick('watchlist'));
    this.#cardComponent.setFavoriteClickHandler(() => this.#onControlActionClick('favorite'));
    this.#cardComponent.setWatchedClickHandler(() => this.#onControlActionClick('watched'));
  };

  #popupClickHandler = () => {
    this.#renderPopup(this.#card);
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

  #renderPopup = (card) => {
    this.#commentModel.init(card);
    this.#onPopupOpen();
    const popupPresenter = new PopupPresenter(bodyComponent, this.#cardModel, this.#commentModel);
    this.#commentModel.init(card);
    popupPresenter.init(card);

    this.#popupPresentor = popupPresenter;
  };

  #onCommentAction = (updateType, update) => {
    switch (updateType) {
      case UpdateType.INIT:
        // this.#comments = this.#commentModel.comments;
        break;
      default:
        if (update.cardId !== undefined) {
          if (update.cardId === this.#card.id) {
            this.#cardModel.updateCard(
              updateType,
              {...this.#card, comments: this.#card.comments.add(update.id)},
            );
          }
        } else {
          const hasComment = this.#card.comments.has(update.id);
          if (hasComment) {
            this.#card.comments.delete(update.id);
            this.#cardModel.updateCard(
              updateType,
              {...this.#card, comments: this.#card.comments},
            );
          }
        }
    }
  };

  #onControlActionClick = (controlAction) => {
    const watchlistDetail = (controlAction === 'watchlist') ? !this.#card.userDetails.watchlist : this.#card.userDetails.watchlist;

    const isAlreadyWatchedDetail = (controlAction === 'watched') ? !this.#card.userDetails.isAlreadyWatched : this.#card.userDetails.isAlreadyWatched;

    const watchingDateDetail = (controlAction === 'watched') ? new Date().toUTCString() : this.#card.userDetails.watchingDate;

    const favoriteDetail = (controlAction === 'favorite') ? !this.#card.userDetails.favorite : this.#card.userDetails.favorite;

    this.#cardModel.updateCard(
      UpdateType.MINOR,
      {...this.#card, userDetails: {
        ...this.#card.userDetails,
        watchlist: watchlistDetail,
        isAlreadyWatched: isAlreadyWatchedDetail,
        watchingDate: watchingDateDetail,
        favorite: favoriteDetail,
      }},
    );
  };
}
