import NewBoardView from '../view/board-view.js';
import NewCardListView from '../view/card-list-view.js';
import NewSortView from '../view/sort-view.js';
import NewCardListContainerView from '../view/card-list-container-view.js';
import {render, RenderPosition, remove} from '../framework/render.js';
import NoCardView from '../view/no-card-view.js';
import CardPresenter from './card-presenter.js';
import {sortCardDate, sortCardRate} from '../utils/card.js';
import ShowButtonPresenter from './showbutton-presenter.js';
import {Setting, SortType, UpdateType, FilterType} from '../const.js';
import {filter} from '../utils/filter.js';

export default class BoardPresenter {
  #boardContainer = null;
  #cardModel = null;
  #commentModel = null;
  #filterModel = null;

  #cardPresenter = new Map();
  #currentSortType = SortType.DEFAULT;

  #noCardComponent = null;
  #boardComponent = new NewBoardView();
  #cardListComponent = new NewCardListView();

  #cardComponent = new NewCardListContainerView();

  #sortComponent = null;
  #showMoreButtonComponent = null;
  #renderedCardCount = 0;
  #filterType = FilterType.ALL;

  constructor(boardContainer, cardModel, commentModel, filterModel) {
    this.#boardContainer = boardContainer;
    this.#cardModel = cardModel;
    this.#commentModel = commentModel;
    this.#filterModel = filterModel;

    this.#cardModel.addObserver(this.#onCardModelEvent);
    this.#filterModel.addObserver(this.#onCardModelEvent);
  }

  get cards() {
    this.#filterType = this.#filterModel.filter;
    const cards = this.#cardModel.cards;
    const filteredCards = filter[this.#filterType](cards);

    switch (this.#currentSortType) {
      case SortType.BY_DATE:
        return filteredCards.sort(sortCardDate);
      case SortType.BY_RATIO:
        return filteredCards.sort(sortCardRate);
    }
    return filteredCards;
  }

  get comments() {
    return [...this.#commentModel.comments];
  }

  init = () => {
    this.#renderedCardCount = Setting.COUNT_LIST_MOVIES;
    this.#renderBoard();
  };

  #renderBoard = () => {
    const cards = this.cards;
    const cardCount = cards.length;
    render(this.#boardComponent, this.#boardContainer);
    this.#renderCardListBlock();
    this.#renderSort();

    if (cardCount === 0) {
      this.#renderNoCard();
      return;
    }

    this.#renderCards(cards.slice(0, Math.min(cardCount, this.#renderedCardCount)), this.#cardComponent.element);

    if (cardCount > Setting.COUNT_LIST_MOVIES) {
      this.#renderShowMoreButton();
    }
  };

  #clearBoard = ({resetRenderedCardCount = false, resetSortType = false} = {}) => {
    const cardCount = this.cards.length;

    this.#cardPresenter.forEach((presenter) => presenter.destroy());
    this.#cardPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#noCardComponent);
    this.#showMoreButtonComponent.destroy();

    if (this.#noCardComponent) {
      remove(this.#noCardComponent);
    }

    if (resetRenderedCardCount) {
      this.#renderedCardCount = Setting.COUNT_LIST_MOVIES;
    } else {
      this.#renderedCardCount = Math.min(cardCount, this.#renderedCardCount);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };

  #renderCardListBlock = () => {
    render(this.#cardListComponent, this.#boardComponent.element);
    render(this.#cardComponent, this.#cardListComponent.element);
  };

  #onSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard({resetRenderedCardCount: true});
    this.#renderBoard();
  };

  #onCardModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#cardPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetRenderedCardCount: true, resetSortType: true});
        this.#renderBoard();
        break;
    }
  };

  #renderSort = () => {
    this.#sortComponent = new NewSortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#onSortTypeChange);
    render(this.#sortComponent, this.#cardComponent.element, RenderPosition.BEFOREBEGIN);
  };

  #renderNoCard = () => {
    this.#noCardComponent = new NoCardView(this.#filterType);
    render(this.#noCardComponent, this.#cardComponent.element);
  };

  #renderCard = (card, component) => {
    const cardPresenter = new CardPresenter(component, this.#cardModel, this.#commentModel, this.#onPopupOpend);
    cardPresenter.init(card);
    this.#cardPresenter.set(card.id, cardPresenter);
  };

  #renderCards = (cards, component) => {
    cards.forEach((card) => this.#renderCard(card, component));
  };

  #onPopupOpend = () => {
    this.#cardPresenter.forEach((presenter) => presenter.resetPopup());
  };

  #renderShowMoreButton = () => {
    this.#showMoreButtonComponent = new ShowButtonPresenter(this.#boardComponent.element);
    this.#showMoreButtonComponent.init(this.#onShowMoreButtonClick);
  };

  #onShowMoreButtonClick = () => {
    const cardCount = this.cards.length;
    const newRenderedCardCount = Math.min(cardCount, this.#renderedCardCount + Setting.COUNT_LIST_MOVIES);
    const cards = this.cards.slice(this.#renderedCardCount, newRenderedCardCount);

    this.#renderCards(cards, this.#cardComponent.element);
    this.#renderedCardCount = newRenderedCardCount;

    if (this.#renderedCardCount >= cardCount) {
      this.#showMoreButtonComponent.destroy();
    }
  };
}
