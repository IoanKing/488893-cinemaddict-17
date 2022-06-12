import {render, remove, replace} from '../framework/render.js';
import NewPopupView from '../view/popup-view.js';
import {onEscKeydown} from '../utils.js';

export default class PopupPresenter {
  #comments = null;
  #card = null;
  #changeData = null;

  #elementComponent = null;
  #popupComponent = null;

  constructor(elementComponent, changeData) {
    this.#elementComponent = elementComponent;
    this.#changeData = changeData;
  }

  init = (card, comments) => {
    this.#card = card;
    this.#comments = comments;

    const prevPopupComponent = this.#popupComponent;
    this.#popupComponent = new NewPopupView(this.#card, this.#comments);

    if (prevPopupComponent === null) {
      this.#addPopup();
      document.addEventListener('keydown', this.#onKeyDown);
      return;
    }

    if (this.#elementComponent.contains(prevPopupComponent.element)) {
      replace(this.#popupComponent, prevPopupComponent);
      this.#setHandlers();
    }

    remove(prevPopupComponent);
  };

  get component() {
    return this.#popupComponent;
  }

  destroy = () => {
    this.#removePopup();
  };

  #setHandlers = () => {
    this.#popupComponent.setCloseClickHandler(this.#onCloseClick);
    this.#popupComponent.setWatchlistClickHandler(this.#onWathlistClick);
    this.#popupComponent.setFavoriteClickHandler(this.#onFavoriteClick);
    this.#popupComponent.setWatchedClickHandler(this.#onWatchedClick);
  };

  #addPopup = () => {
    render(this.#popupComponent, this.#elementComponent);
    this.#elementComponent.classList.add('hide-overflow');
    this.#setHandlers();
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

  #onWathlistClick = () => {
    this.#changeData('watchlist');
  };

  #onFavoriteClick = () => {
    this.#changeData('favorite');
  };

  #onWatchedClick = () => {
    this.#changeData('watched');
  };
}
