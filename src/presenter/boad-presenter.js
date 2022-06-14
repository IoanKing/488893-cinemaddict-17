import NewBoardView from '../view/board-view.js';
import NewCardListView from '../view/card-list-view.js';
import NewSortView from '../view/sort-view.js';
import NewCardListContainerView from '../view/card-list-container-view.js';
import {render, RenderPosition} from '../framework/render.js';
import NoCardView from '../view/no-card-view.js';
import CardPresenter from './card-presenter.js';
import {sortCardDate, sortCardRate} from '../utils/card.js';
import ShowButtonPresenter from './showbutton-presenter.js';
import FilterPresenter from './filter-presenter.js';
import {Setting, SortType} from '../const.js';

export default class BoardPresenter {
  #boardContainer = null;
  // #boardCards = [];
  // #sourcedBoardCards = [];
  #boardComments = [];
  #movieModel = null;
  #commentModel = null;

  #cardPresenter = new Map();
  #currentSortType = SortType.DEFAULT;
  #filterPresenter = null;

  #sortComponent = new NewSortView();
  #noCardComponent = new NoCardView();
  #boardComponent = new NewBoardView();
  #cardListComponent = new NewCardListView();

  #cardComponent = new NewCardListContainerView();

  #showMoreButtonComponent = null;
  #renderedCardCount = 0;

  constructor(boardContainer, movieModel, commentModel) {
    this.#boardContainer = boardContainer;
    this.#movieModel = movieModel;
    this.#commentModel = commentModel;
  }

  get cards() {
    switch (this.#currentSortType) {
      case SortType.BY_DATE:
        return [...this.#movieModel.data].sort(sortCardDate);
      case SortType.BY_RATIO:
        return [...this.#movieModel.data].sort(sortCardRate);
    }
    return this.#movieModel.data;
  }

  init = () => {
    this.#boardComments  = [...this.#commentModel.data];

    this.#showMoreButtonComponent = new ShowButtonPresenter(this.#boardComponent.element);

    this.#renderBoard();
  };

  #renderBoard = () => {
    render(this.#boardComponent, this.#boardContainer);
    this.#renderFilters();
    this.#renderSort();

    if (this.cards.length === 0) {
      this.#renderNoCard();
      return;
    }

    this.#renderCardsList();
  };

  // ======= Фильтры =======

  #renderFilters = () => {
    this.#filterPresenter = new FilterPresenter(this.#boardContainer);
    this.#filterPresenter.init(this.cards);
  };

  // ======= Сортировка =======

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearCardsList();
    this.#renderCardsList();
  };

  #renderSort = () => {
    render(this.#sortComponent, this.#cardComponent.element, RenderPosition.BEFOREBEGIN);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  // ======= Карточки фильмов =======

  #renderNoCard = () => {
    render(this.#noCardComponent, this.#cardComponent.element);
  };

  #renderCardsList = () => {
    const cardCount = this.cards.length;
    const cards = this.cards.slice(0, Math.min(cardCount, Setting.COUNT_LIST_MOVIES));

    render(this.#cardListComponent, this.#boardComponent.element);
    render(this.#cardComponent, this.#cardListComponent.element);

    this.#renderCards(cards, this.#cardComponent.element);

    if (cardCount > Setting.COUNT_LIST_MOVIES) {
      this.#renderShowMoreButton();
    }
  };

  #clearCardsList = () => {
    this.#cardPresenter.forEach((presenter) => presenter.destroy());
    this.#cardPresenter.clear();
    this.#renderedCardCount = Setting.COUNT_LIST_MOVIES;
    this.#showMoreButtonComponent.destroy();
  };

  #renderCard = (card, component, comments) => {
    const cardPresenter = new CardPresenter(component, this.#onCardChange, this.#onPopupOpend, this.#onCommentAdded);
    cardPresenter.init(card, comments);
    this.#cardPresenter.set(card.id, cardPresenter);
  };

  #onCardChange = (updatedCard) => {
    this.#cardPresenter.get(updatedCard.id).init(updatedCard, this.#boardComments);
    this.#filterPresenter.destroy();
    this.#renderFilters();
  };

  #renderCards = (cards, component) => {
    cards.forEach((card) => this.#renderCard(card, component, this.#boardComments));
  };

  #onPopupOpend = () => {
    this.#cardPresenter.forEach((presenter) => presenter.resetPopup());
  };

  #onCommentAdded = (element) => {
    this.#commentModel.data = element;
    this.#boardComments  = [...this.#commentModel.data];
  };

  // ======= Кнопка Show more =======

  #renderShowMoreButton = () => {
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
