import NewCardView from '../view/card-view.js';
import {render} from '../framework/render.js';
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

    this.#cardComponent = new NewCardView(this.#card);
    this.#cardComponent.setEditClickHandler(this.#onEditClick);

    render(this.#cardComponent, this.#cardListContainer);
  };

  #onEditClick = () => {
    const cardComments = this.#comments.filter((values) => this.#card.comments.has(values.id));
    const popupPresenter = new PopupPresenter(this.#card, cardComments);
    popupPresenter.init();
  };
}
