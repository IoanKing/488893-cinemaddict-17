import NewBoardView from '../view/board-view.js';
import NewCardListView from '../view/card-list-view.js';
import NewSortView from '../view/sort-view.js';
import NewButtonShowMoreView from '../view/button-show-view.js';
import NewCardListContainerView from '../view/card-list-container-view.js';
import {render, RenderPosition, remove} from '../framework/render.js';
import NoCardView from '../view/no-card-view.js';
import CardPresenter from './card-presenter.js';

const COUNT_LIST_MOVIES = 5;
const COUNT_LIST_ADDITIONAL = 2;

export default class BoardPresenter {
  #boardContainer = null;
  #boardCards = [];
  #boardComments = [];
  #cardPresenter = new Map();
  #movieModel = null;
  #commentModel = null;

  #sortComponent = new NewSortView();
  #noCardComponent = new NoCardView();
  #boardComponent = new NewBoardView();
  #cardListComponent = new NewCardListView();

  #topListComponent = new NewCardListView(true, 'Top rated');
  #commentedListComponent = new NewCardListView(true, 'Most commented');

  #cardComponent = new NewCardListContainerView();
  #cardTopRatedComponent = new NewCardListContainerView();
  #cardCommentedComponent = new NewCardListContainerView();

  #showMoreButtonComponent = new NewButtonShowMoreView();

  #renderedCardCount = COUNT_LIST_MOVIES;

  constructor(boardContainer, movieModel, commentModel) {
    this.#boardContainer = boardContainer;
    this.#movieModel = movieModel;
    this.#commentModel = commentModel;
  }

  init = () => {
    this.#boardCards  = [...this.#movieModel.data];
    this.#boardComments  = [...this.#commentModel.data];
    this.#renderBoard();
  };

  #renderBoard = () => {
    render(this.#boardComponent, this.#boardContainer);
    this.#renderCardListBlock();
    this.#renderCardBlock();
    this.#renderSort();

    if (this.#boardCards.length === 0) {
      this.#renderNoCard();
      return;
    }

    this.#renderCardsList();
    this.#renderCardsTopList();
    this.#renderCardsCommentedList();
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

    if (this.#boardCards.length > COUNT_LIST_MOVIES) {
      this.#renderLoadMoreButton();
    }
  };

  #clearCardsList = () => {
    this.#cardPresenter.forEach((presenter) => presenter.destroy());
    this.#cardPresenter.clear();
    this.#renderedCardCount = COUNT_LIST_MOVIES;
    remove(this.#showMoreButtonComponent);
  };

  #renderCardsTopList = () => {
    render(this.#topListComponent, this.#boardComponent.element);
    render(this.#cardTopRatedComponent, this.#topListComponent.element);
    this.#renderCards(this.#renderedCardCount, this.#renderedCardCount + COUNT_LIST_ADDITIONAL, this.#cardTopRatedComponent.element);
  };

  #renderCardsCommentedList = () => {
    render(this.#commentedListComponent, this.#boardComponent.element);
    render(this.#cardCommentedComponent, this.#commentedListComponent.element);
    this.#renderCards(this.#renderedCardCount, this.#renderedCardCount + COUNT_LIST_ADDITIONAL, this.#cardCommentedComponent.element);
  };

  #renderCard = (card, elementComponent, comments) => {
    const cardPresenter = new CardPresenter(elementComponent);

    cardPresenter.init(card, comments);

    this.#cardPresenter.set(card.id, cardPresenter);
  };

  #renderCards = (from, to, elementComponent) => {
    this.#boardCards
      .slice(from, to)
      .forEach((card) => this.#renderCard(card, elementComponent, this.#boardComments));
  };

  #renderLoadMoreButton = () => {
    render(this.#showMoreButtonComponent, this.#boardComponent.element);
    this.#showMoreButtonComponent.setClickHandler(this.#onLoadMoreButtonClick);
  };

  #onLoadMoreButtonClick = () => {
    this.#renderCards(this.#renderedCardCount, this.#renderedCardCount + COUNT_LIST_MOVIES, this.#cardComponent.element);

    this.#renderedCardCount += COUNT_LIST_MOVIES;

    if (this.#renderedCardCount >= this.#boardCards.length) {
      remove(this.#showMoreButtonComponent);
    }
  };
}
