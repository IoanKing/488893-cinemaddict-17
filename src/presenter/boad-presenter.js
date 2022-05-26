import NewBoardView from '../view/board-view.js';
import NewCardListView from '../view/card-list-view.js';
import NewCardView from '../view/card-view.js';
import NewSortView from '../view/sort-view.js';
import NewButtonShowMoreView from '../view/button-show-view.js';
import NewCardListContainerView from '../view/card-list-container-view.js';
import {render} from '../framework/render.js';
import NewPopupView from '../view/popup-view.js';
import NoCardView from '../view/no-card-view.js';
import {onEscKeydown} from '../utils.js';

const COUNT_LIST_MOVIES = 5;
const COUNT_LIST_ADDITIONAL = 2;

export default class BoardPresenter {
  #boardContainer = null;
  #boardCards = null;
  #boardComments = null;
  #movieModel = null;
  #commentModel = null;

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
    render(new NewSortView(), this.#boardContainer);
    render(this.#boardComponent, this.#boardContainer);
    render(this.#cardListComponent, this.#boardComponent.element);
    render(this.#cardComponent, this.#cardListComponent.element);

    //Определение количества отображаемых карточек фильмов для основного блока.
    const defaultListCount = Math.min(this.#boardCards.length, COUNT_LIST_MOVIES);
    //Определение количества отображаемых карточек фильмов для дополнительных блоков «Top rated movies» и «Most commented».
    const additionalListCount = Math.min(this.#boardCards.length, COUNT_LIST_ADDITIONAL);

    if (this.#boardCards.length === 0) {
      render(new NoCardView(), this.#cardComponent.element);
    } else {
      for (let i = 0; i < defaultListCount; i++) {
        this.#renderCard(this.#boardCards[i], this.#cardComponent.element);
      }

      if (this.#boardCards.length > COUNT_LIST_MOVIES) {
        render(this.#showMoreButtonComponent, this.#boardComponent.element);
        this.#showMoreButtonComponent.element.addEventListener('click', this.#onLoadMoreButtonClick);
      }

      render(this.#topListComponent, this.#boardComponent.element);
      render(this.#commentedListComponent, this.#boardComponent.element);
      render(this.#cardTopRatedComponent, this.#topListComponent.element);
      render(this.#cardCommentedComponent, this.#commentedListComponent.element);
      for (let i = 0; i < additionalListCount; i++) {
        this.#renderCard(this.#boardCards[i], this.#cardTopRatedComponent.element);
        this.#renderCard(this.#boardCards[i], this.#cardCommentedComponent.element);
      }
    }
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

    cardComponent.element.querySelector('.film-card__link').addEventListener('click', () => {
      addPopup();
      document.addEventListener('keydown', onKeyDown);
    });

    popupComponent.element.querySelector('.film-details__close-btn').addEventListener('submit', (evt) => {
      evt.preventDefault();
      removePopup();
      document.removeEventListener('keydown', onKeyDown);
    });

    popupComponent.element.querySelector('form').addEventListener('click', (evt) => {
      evt.preventDefault();
      removePopup();
      document.removeEventListener('keydown', onKeyDown);
    });

    render(cardComponent, elementComponent);
  };

  #onLoadMoreButtonClick = (evt) => {
    evt.preventDefault();
    this.#boardCards
      .slice(this.#renderedCardCount, this.#renderedCardCount + COUNT_LIST_MOVIES)
      .forEach((card) => this.#renderCard(card, this.#cardComponent.element));

    this.#renderedCardCount += COUNT_LIST_MOVIES;

    if (this.#renderedCardCount >= this.#boardCards.length) {
      this.#showMoreButtonComponent.element.remove();
      this.#showMoreButtonComponent.removeElement();
    }
  };
}
