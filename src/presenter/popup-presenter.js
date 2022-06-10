import {render, remove} from '../framework/render.js';
import NewPopupView from '../view/popup-view.js';
import {onEscKeydown} from '../utils.js';

export default class PopupPresenter {
  #comments = null;
  #card = null;

  #elementComponent = null;
  #popupComponent = null;

  constructor(elementComponent) {
    this.#elementComponent = elementComponent;
  }

  init = (card, comments) => {
    this.#card = card;
    this.#comments = comments;

    this.#popupComponent = new NewPopupView(this.#card, this.#comments);

    this.#addPopup();
    this.#popupComponent.setCloseClickHandler(this.#onCloseClick);
    this.#popupComponent.setFormSubmitHandler(this.#onCloseClick);
  };

  destroy = () => {
    this.#removePopup();
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
