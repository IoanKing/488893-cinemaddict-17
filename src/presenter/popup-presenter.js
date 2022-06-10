import {render, remove, replace} from '../framework/render.js';
import NewPopupView from '../view/popup-view.js';
import {onEscKeydown} from '../utils.js';

export default class PopupPresenter {
  #comments = null;
  #card = null;

  #elementComponent = document.querySelector('body');
  #popupComponent = null;

  constructor() {
  }

  init = (card, comments) => {
    this.#card = card;
    this.#comments = comments;

    const prevPopupComponent = this.#popupComponent;

    this.#popupComponent = new NewPopupView(this.#card, this.#comments);
    this.#popupComponent.setCloseClickHandler(this.#onCloseClick);
    this.#popupComponent.setFormSubmitHandler(this.#onCloseClick);

    if (prevPopupComponent === null) {
      this.#addPopup();
      return;
    }

    if (this.#elementComponent.contains(prevPopupComponent.element)) {
      replace(this.#elementComponent, prevPopupComponent);
    }

    remove(prevPopupComponent);
  };

  destroy = () => {
    remove(this.#popupComponent);
  };

  #addPopup = () => {
    render(this.#popupComponent, this.#elementComponent);
    this.#elementComponent.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#onKeyDown);
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
}
