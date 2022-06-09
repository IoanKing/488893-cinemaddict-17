import {render, remove} from '../framework/render.js';
import NewPopupView from '../view/popup-view.js';
import {onEscKeydown} from '../utils.js';

export default class PopupPresenter {
  #comments = null;
  #card = null;

  #elementComponent = document.querySelector('body');
  #popupComponent = null;

  constructor(card, comments) {
    this.#card = card;
    this.#comments = comments;
  }

  init = () => {
    this.#popupComponent = new NewPopupView(this.#card, this.#comments);
    this.#popupComponent.setCloseClickHandler(this.#onCloseClick);
    this.#popupComponent.setFormSubmitHandler(this.#onCloseClick);
    this.#addPopup();
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
