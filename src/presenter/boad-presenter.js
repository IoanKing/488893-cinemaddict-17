import NewBoardView from '../view/board-view.js';
import NewCardListView from '../view/card-list-view.js';
import NewSortView from '../view/sort-view.js';
import NewCardListContainerView from '../view/card-list-container-view.js';
import {render, RenderPosition} from '../framework/render.js';
import NoCardView from '../view/no-card-view.js';
import CardPresenter from './card-presenter.js';
import {updateItem} from '../utils.js';
import ShowButtonPresenter from './showbutton-presenter.js';
import FilterPresenter from './filter-presenter.js';

const COUNT_LIST_MOVIES = 5;
// const COUNT_LIST_ADDITIONAL = 2;

export default class BoardPresenter {
  #boardContainer = null;
  #boardCards = [];
  #boardComments = [];
  #movieModel = null;
  #commentModel = null;

  #cardPresenter = new Map();
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

  #renderFilters = () => {
    this.#filterPresenter = new FilterPresenter(this.#boardContainer);
    this.#filterPresenter.init(this.#boardCards);
  };

  #renderSort = () => {
    render(this.#sortComponent, this.#cardComponent.element, RenderPosition.BEFOREBEGIN);
  };

  #renderNoCard = () => {
    render(this.#noCardComponent, this.#cardComponent.element);
  };

  #renderCardListBlock = () => {
    render(this.#cardListComponent, this.#boardComponent.element);
  };

  #renderCardBlock = () => {
    render(this.#cardComponent, this.#cardListComponent.element);
  };

  #renderCardsList = () => {
    this.#renderCards(this.#renderedCardCount, this.#renderedCardCount + COUNT_LIST_MOVIES, this.#cardComponent.element);

    this.#renderedCardCount += COUNT_LIST_MOVIES;

    if (this.#boardCards.length > COUNT_LIST_MOVIES) {
      this.#renderShowMoreButton();
    }
  };

  #clearCardsList = () => {
    this.#cardPresenter.forEach((presenter) => presenter.destroy());
    this.#cardPresenter.clear();
    this.#renderedCardCount = COUNT_LIST_MOVIES;
    this.#showMoreButtonComponent.destroy();
  };

  #renderCard = (card, elementComponent, comments) => {
    const cardPresenter = new CardPresenter(elementComponent, this.#onCardChange, this.#onPopupOpend);
    cardPresenter.init(card, comments);
    this.#cardPresenter.set(card.id, cardPresenter);
  };

  #onCardChange = (updatedCard) => {
    this.#boardCards = updateItem(this.#boardCards, updatedCard);
    const currentCard = this.#cardPresenter.get(updatedCard.id);
    currentCard.init(updatedCard, this.#boardComments);
    this.#filterPresenter.destroy();
    this.#renderFilters();
  };

  #onPopupOpend = () => {
    this.#cardPresenter.forEach((presenter) => presenter.resetPopup());
  };

  #renderCards = (from, to, elementComponent) => {
    this.#boardCards
      .slice(from, to)
      .forEach((card) => this.#renderCard(card, elementComponent, this.#boardComments));
  };

  #renderShowMoreButton = () => {
    this.#showMoreButtonComponent.init(this.#onShowMoreButtonClick);
  };

  #onShowMoreButtonClick = () => {
    this.#renderCards(this.#renderedCardCount, this.#renderedCardCount + COUNT_LIST_MOVIES, this.#cardComponent.element);

    this.#renderedCardCount += COUNT_LIST_MOVIES;

    if (this.#renderedCardCount >= this.#boardCards.length) {
      this.#showMoreButtonComponent.destroy();
    }
  };
}
