import NewBoardView from '../view/board-view.js';
import NewCardListView from '../view/card-list-view.js';
import NewSortView from '../view/sort-view.js';
import NewCardListContainerView from '../view/card-list-container-view.js';
import {render, RenderPosition} from '../framework/render.js';
import NoCardView from '../view/no-card-view.js';
import CardPresenter from './card-presenter.js';
import {updateItem, sortCardDate, sortCardRate} from '../utils/card.js';
import ShowButtonPresenter from './showbutton-presenter.js';
import FilterPresenter from './filter-presenter.js';
import {Setting, SortType} from '../const.js';

export default class BoardPresenter {
  #boardContainer = null;
  #boardCards = [];
  #boardComments = [];
  #movieModel = null;
  #commentModel = null;

  #cardPresenter = new Map();
  #currentSortType = SortType.DEFAULT;
  #sourcedBoardCards = [];
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

  init = () => {
    this.#boardCards  = [...this.#movieModel.data];
    this.#sourcedBoardCards = [...this.#movieModel.data];
    this.#boardComments  = [...this.#commentModel.data];

    this.#showMoreButtonComponent = new ShowButtonPresenter(this.#boardComponent.element);

    this.#renderBoard();
  };

  #renderBoard = () => {
    render(this.#boardComponent, this.#boardContainer);
    this.#renderFilters();
    this.#renderCardListBlock();
    this.#renderCardBlock();
    this.#renderSort();

    if (this.#boardCards.length === 0) {
      this.#renderNoCard();
      return;
    }

    this.#renderCardsList();
  };

  // ======= Фильтры =======

  #renderFilters = () => {
    this.#filterPresenter = new FilterPresenter(this.#boardContainer);
    this.#filterPresenter.init(this.#boardCards);
  };

  // ======= Сортировка =======

  #sortCards = (sortType) => {
    switch (sortType) {
      case SortType.BY_DATE:
        this.#boardCards.sort(sortCardDate);
        break;
      case SortType.BY_RATIO:
        this.#boardCards.sort(sortCardRate);
        break;
      default:
        this.#boardCards = [...this.#sourcedBoardCards];
    }

    this.#currentSortType = sortType;
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortCards(sortType);
    this.#clearCardsList();
    this.#renderCardsList();
  };

  #renderSort = () => {
    render(this.#sortComponent, this.#cardComponent.element, RenderPosition.BEFOREBEGIN);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  // ======= Блоки с карточками =======

  #renderCardListBlock = () => {
    render(this.#cardListComponent, this.#boardComponent.element);
  };

  #renderCardBlock = () => {
    render(this.#cardComponent, this.#cardListComponent.element);
  };

  // ======= Карточки фильмов =======

  #renderNoCard = () => {
    render(this.#noCardComponent, this.#cardComponent.element);
  };

  #renderCardsList = () => {
    this.#renderCards(this.#renderedCardCount, this.#renderedCardCount + Setting.COUNT_LIST_MOVIES, this.#cardComponent.element);

    this.#renderedCardCount += Setting.COUNT_LIST_MOVIES;

    if (this.#boardCards.length > Setting.COUNT_LIST_MOVIES) {
      this.#renderShowMoreButton();
    }
  };

  #clearCardsList = () => {
    this.#cardPresenter.forEach((presenter) => presenter.destroy());
    this.#cardPresenter.clear();
    this.#renderedCardCount = Setting.COUNT_LIST_MOVIES;
    this.#showMoreButtonComponent.destroy();
  };

  #renderCard = (card, elementComponent, comments) => {
    const cardPresenter = new CardPresenter(elementComponent, this.#onCardChange, this.#onPopupOpend, this.#onCommentAdded);
    cardPresenter.init(card, comments);
    this.#cardPresenter.set(card.id, cardPresenter);
  };

  #onCardChange = (updatedCard) => {
    this.#boardCards = updateItem(this.#boardCards, updatedCard);
    this.#sourcedBoardCards = updateItem(this.#boardCards, updatedCard);
    const currentCard = this.#cardPresenter.get(updatedCard.id);
    currentCard.init(updatedCard, this.#boardComments);
    this.#filterPresenter.destroy();
    this.#renderFilters();
  };

  #renderCards = (from, to, elementComponent) => {
    this.#boardCards
      .slice(from, to)
      .forEach((card) => this.#renderCard(card, elementComponent, this.#boardComments));
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
    this.#renderCards(this.#renderedCardCount, this.#renderedCardCount + Setting.COUNT_LIST_MOVIES, this.#cardComponent.element);

    this.#renderedCardCount += Setting.COUNT_LIST_MOVIES;

    if (this.#renderedCardCount >= this.#boardCards.length) {
      this.#showMoreButtonComponent.destroy();
    }
  };
}
