import NewCardView from '../view/card-view.js';
import {render, replace, remove} from '../framework/render.js';
import PopupPresenter from './popup-presenter.js';
import {UpdateType} from '../const.js';

const bodyComponent = document.querySelector('body');

export default class CardPresenter {
  #cardListContainer = null;
  #commentModel = null;
  #card = null;
  #cardComponent = null;
  #cardModel = null;
  _callback = {};

  #popupPresenter = null;
  #onPopupOpen = false;
  #popupScroll = null;

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
    if (this.#popupPresenter !== null) {
      this.#popupPresenter.destroy();
      this.#popupPresenter = null;
    }
  };

  destroy = () => {
    this.#commentModel.removeObserver(this.#onCommentAction);
    remove(this.#cardComponent);
  };

  #renderPopup = (card) => {
    this.#commentModel.init(card);
    this.#onPopupOpen();
    const popupPresenter = new PopupPresenter(bodyComponent, this.#cardModel, this.#commentModel, this.#saveScroll, this.#popupScroll);
    popupPresenter.init(card);

    this.#popupPresenter = popupPresenter;
  };

  #saveScroll = (scroll) => {
    console.log(scroll);
    if (scroll) {
      this.#popupScroll = scroll;
    }
  };

  #onCommentAction = async (updateType) => {
    switch (updateType) {
      case UpdateType.PATCH:
        try {
          await this.#cardModel.updateCard(
            updateType,
            {...this.#card},
          );
          if (this.#popupPresenter) {
            this.resetPopup();
            this.#renderPopup(this.#card);
          }
        } catch {
          break;
        }
        break;
      case UpdateType.MINOR:
      case UpdateType.MAJOR:
        this.#cardModel.updateCard(
          updateType,
          {...this.#card},
        );
    }
  };

  #onControlActionClick = async (controlAction) => {
    const watchlistDetail = (controlAction === 'watchlist') ? !this.#card.userDetails.watchlist : this.#card.userDetails.watchlist;

    const isAlreadyWatchedDetail = (controlAction === 'watched') ? !this.#card.userDetails.isAlreadyWatched : this.#card.userDetails.isAlreadyWatched;

    const watchingDateDetail = (controlAction === 'watched') ? new Date().toUTCString() : this.#card.userDetails.watchingDate;

    const favoriteDetail = (controlAction === 'favorite') ? !this.#card.userDetails.favorite : this.#card.userDetails.favorite;

    try {
      await this.#cardModel.updateCard(
        UpdateType.MINOR,
        {...this.#card, userDetails: {
          ...this.#card.userDetails,
          watchlist: watchlistDetail,
          isAlreadyWatched: isAlreadyWatchedDetail,
          watchingDate: watchingDateDetail,
          favorite: favoriteDetail,
        }},
      );
    } catch(err) {
      this.setAborting();
    }
  };

  setAborting = () => {
    this.#cardComponent.shake();

    if (this.#popupPresenter !== null) {
      this.#popupPresenter.setAborting();
    }
  };
}
