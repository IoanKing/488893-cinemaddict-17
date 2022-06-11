import NewCardView from '../view/card-view.js';
import {render, replace, remove} from '../framework/render.js';

export default class CardPresenter {
  #cardListContainer = null;
  #comments = null;
  #card = null;
  #cardComponent = null;
  #changeData = null;
  #cardComments = null;
  _callback = {};

  constructor(cardListContainer, changeData) {
    this.#cardListContainer = cardListContainer;
    this.#changeData = changeData;
  }

  init = (card, comments) => {
    this.#card = card;
    this.#comments = comments;

    this.#cardComments = this.#comments.filter((values) => this.#card.comments.has(values.id));

    const prevCardComponent = this.#cardComponent;

    this.#cardComponent = new NewCardView(this.#card);

    if (prevCardComponent === null) {
      render(this.#cardComponent, this.#cardListContainer);
      this.#cardComponent.setWatchlistClickHandler(this.#onWathlistClick);
      return;
    }

    if (this.#cardListContainer.contains(prevCardComponent.element)) {
      replace(this.#cardComponent, prevCardComponent);
    }

    remove(prevCardComponent);
  };

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.#cardComponent.setEditClickHandler(this.#popupClickHandler);
  };

  #popupClickHandler = () => {
    this._callback.click(this.#card, this.#cardComments);
  };

  destroy = () => {
    remove(this.#cardComponent);
  };

  #onWathlistClick = () => {
    this.#changeData({...this.#card, watchlist: !this.#card.userDetails.watchlist});
  };
}
