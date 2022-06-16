import NewBoardView from '../view/board-view.js';
import NewCardListView from '../view/card-list-view.js';
import NewSortView from '../view/sort-view.js';
import NewCardListContainerView from '../view/card-list-container-view.js';
import {render, RenderPosition, remove} from '../framework/render.js';
import NoCardView from '../view/no-card-view.js';
import CardPresenter from './card-presenter.js';
import {sortCardDate, sortCardRate} from '../utils/card.js';
import ShowButtonPresenter from './showbutton-presenter.js';
import FilterPresenter from './filter-presenter.js';
import {Setting, SortType, UpdateType, UserAction} from '../const.js';

export default class BoardPresenter {
  #boardContainer = null;
  #boardComments = [];
  #movieModel = null;
  #commentModel = null;

  #cardPresenter = new Map();
  #currentSortType = SortType.DEFAULT;
  #filterPresenter = null;

  // #sortComponent = new NewSortView();
  #noCardComponent = new NoCardView();
  #boardComponent = new NewBoardView();
  #cardListComponent = new NewCardListView();

  #cardComponent = new NewCardListContainerView();

  #sortComponent = null;
  #showMoreButtonComponent = null;
  #renderedCardCount = 0;

  constructor(boardContainer, movieModel, commentModel) {
    this.#boardContainer = boardContainer;
    this.#movieModel = movieModel;
    this.#commentModel = commentModel;

    this.#movieModel.addObserver(this.#onModelEvent);
  }

  get cards() {
    switch (this.#currentSortType) {
      case SortType.BY_DATE:
        return [...this.#movieModel.cards].sort(sortCardDate);
      case SortType.BY_RATIO:
        return [...this.#movieModel.cards].sort(sortCardRate);
    }
    return this.#movieModel.cards;
  }

  get comments() {
    return [...this.#commentModel.comments];
  }

  init = () => {
    this.#renderedCardCount = Setting.COUNT_LIST_MOVIES;

    this.#renderFilters();
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

    if (resetRenderedCardCount) {
      this.#renderedCardCount = Setting.COUNT_LIST_MOVIES;
    } else {
      this.#renderedCardCount = Math.min(cardCount, this.#renderedCardCount);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };

  // ======= Фильтры =======

  #renderCardListBlock = () => {
    render(this.#cardListComponent, this.#boardComponent.element);
    render(this.#cardComponent, this.#cardListComponent.element);
  };

  #renderFilters = () => {
    if (this.#filterPresenter !== null) {
      this.#filterPresenter.destroy();
    }
    this.#filterPresenter = new FilterPresenter(this.#boardContainer);
    this.#filterPresenter.init(this.cards);
  };

  // ======= Сортировка =======

  #onSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard({resetRenderedCardCount: true});
    this.#renderBoard();
  };

  #onViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_CARD:
        this.#movieModel.updateCard(updateType, update);
        break;
      case UserAction.ADD_CARD:
        this.#movieModel.addCard(updateType, update);
        break;
      case UserAction.DELETE_CARD:
        this.#movieModel.deleteCard(updateType, update);
        break;
    }
  };

  #onModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#renderFilters();
        this.#cardPresenter.get(data.id).init(data, this.comments);
        break;
      case UpdateType.MINOR:
        this.#renderFilters();
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#renderFilters();
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

  // ======= Карточки фильмов =======

  #renderNoCard = () => {
    render(this.#noCardComponent, this.#cardComponent.element);
  };

  #renderCard = (card, component, comments) => {
    const cardPresenter = new CardPresenter(component, this.#onViewAction, this.#onPopupOpend, this.#onCommentAdded);
    cardPresenter.init(card, comments);
    this.#cardPresenter.set(card.id, cardPresenter);
  };

  #renderCards = (cards, component) => {
    cards.forEach((card) => this.#renderCard(card, component, this.comments));
  };

  #onPopupOpend = () => {
    this.#cardPresenter.forEach((presenter) => presenter.resetPopup());
  };

  #onCommentAdded = (element) => {
    this.#commentModel.data = element;
    this.comments = [...this.#commentModel.data];
  };

  // ======= Кнопка Show more =======

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
