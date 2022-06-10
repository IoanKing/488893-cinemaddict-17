import NewCardView from '../view/card-view.js';
import {render, replace, remove} from '../framework/render.js';
import PopupPresenter from './popup-presenter.js';

export default class CardPresenter {
  #cardListContainer = null;
  #comments = null;
  #card = null;
  #cardComponent = null;
  #changeData = null;

  #bodyComponent = document.querySelector('body');

  constructor(cardListContainer, changeData) {
    this.#cardListContainer = cardListContainer;
    this.#changeData = changeData;
  }

  init = (card, comments) => {
    this.#card = card;
    this.#comments = comments;

    const prevCardComponent = this.#cardComponent;

    this.#cardComponent = new NewCardView(this.#card);

    if (prevCardComponent === null) {
      render(this.#cardComponent, this.#cardListContainer);
      this.#cardComponent.setEditClickHandler(this.#onEditClick);
      this.#cardComponent.setWatchlistClickHandler(this.#onWathlistClick);
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
    const popupPresenter = new PopupPresenter(this.#bodyComponent);
    popupPresenter.init(this.#card, cardComments);
  };

  #onWathlistClick = () => {
    this.#changeData({...this.#card.userDetails, watchlist: !this.#card.userDetails.watchlist});
  };
}
