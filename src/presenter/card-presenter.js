import NewCardView from '../view/card-view.js';
import {render, replace, remove} from '../framework/render.js';
import PopupPresenter from './popup-presenter.js';

export default class CardPresenter {
  #cardListContainer = null;
  #comments = null;
  #card = null;
  #cardComponent = null;

  constructor(cardListContainer) {
    this.#cardListContainer = cardListContainer;
  }

  init = (card, comments) => {
    this.#card = card;
    this.#comments = comments;

    const prevCardComponent = this.#cardComponent;

    this.#cardComponent = new NewCardView(this.#card);
    this.#cardComponent.setEditClickHandler(this.#onEditClick);

    if (prevCardComponent === null) {
      render(this.#cardComponent, this.#cardListContainer);
      return;
    }

    if (this.#cardListContainer.contains(prevCardComponent.element)) {
      replace(this.#cardComponent, prevCardComponent);
    }

    remove(prevCardComponent);
  };

  destroy = () => {
    remove(this.#cardComponent);
  };

  #onEditClick = () => {
    const cardComments = this.#comments.filter((values) => this.#card.comments.has(values.id));
    const popupPresenter = new PopupPresenter();
    popupPresenter.init(this.#card, cardComments);
  };
}
