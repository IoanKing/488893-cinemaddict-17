import NewBoardView from '../view/board-view.js';
import NewCardListView from '../view/card-list-view.js';
import NewCardView from '../view/card-view.js';
import NewSortView from '../view/sort-view.js';
import NewButtonShowMoreView from '../view/button-show-view.js';
import NewCardListContainerView from '../view/card-list-container-view.js';
import {render, RenderPosition, remove} from '../framework/render.js';
import NewPopupView from '../view/popup-view.js';
import NoCardView from '../view/no-card-view.js';
import {onEscKeydown} from '../utils.js';

const COUNT_LIST_MOVIES = 5;
const COUNT_LIST_ADDITIONAL = 2;

export default class BoardPresenter {
  #boardContainer = null;
  #boardCards = [];
  #boardComments = null;
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

  #renderSort = () => {
    render(this.#sortComponent, this.#cardComponent.element, RenderPosition.BEFOREBEGIN);
  };

  #renderNoCard = () => {
    render(this.#noCardComponent, this.#cardComponent.element);
  };

  #renderBoard = () => {
    render(this.#boardComponent, this.#boardContainer);
    this.#renderCardList();
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

  #renderCardList = () => {
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

  #renderCard = (card, elementComponent) => {
    const cardComponent = new NewCardView(card);
    const cardComments = this.#boardComments.filter((values) => card.comments.has(values.id));
    const popupComponent = new NewPopupView(card, cardComments);
    const bodyElement = document.querySelector('body');

    const addPopup = () => {
      this.#boardContainer.appendChild(popupComponent.element);
      bodyElement.classList.add('hide-overflow');
    };

    const removePopup = () => {
      this.#boardContainer.removeChild(popupComponent.element);
      bodyElement.classList.remove('hide-overflow');
    };

    const onKeyDown = (evt) => {
      if (onEscKeydown(evt)) {
        evt.preventDefault();
        removePopup();
        document.removeEventListener('keydown', onKeyDown);
      }
    };

    cardComponent.setEditClickHandler(() => {
      addPopup();
      document.addEventListener('keydown', onKeyDown);
    });

    popupComponent.setCloseClickHandler(() => {
      removePopup();
      document.removeEventListener('keydown', onKeyDown);
    });

    popupComponent.setFormSubmitHandler(() => {
      removePopup();
      document.removeEventListener('keydown', onKeyDown);
    });

    render(cardComponent, elementComponent);
  };

  #renderCards = (from, to, component) => {
    this.#boardCards
      .slice(from, to)
      .forEach((card) => this.#renderCard(card, component));
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
