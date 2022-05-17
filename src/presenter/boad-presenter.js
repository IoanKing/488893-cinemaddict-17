import NewBoardView from '../view/board-view.js';
import NewCardListView from '../view/card-list-view.js';
import NewCardView from '../view/card-view.js';
import NewSortView from '../view/sort-view.js';
import NewButtonShowMoreView from '../view/button-show-view.js';
import NewCardListContainerView from '../view/card-list-container-view.js';
import {render} from '../render.js';
import NewPopupView from '../view/popup-view.js';

const COUNT_LIST_MOVIES = 5;
const COUNT_LIST_ADDITIONAL = 2;

export default class BoardPresenter {
  boardComponent = new NewBoardView();
  cardListComponent = new NewCardListView();
  topListComponent = new NewCardListView(true, 'Top rated');
  commentedListComponent = new NewCardListView(true, 'Most commented');
  cardComponent = new NewCardListContainerView();
  cardTopRatedComponent = new NewCardListContainerView();
  cardCommentedComponent = new NewCardListContainerView();

  init = (boardContainer, movieModel, commentModel) => {
    this.boardContainer = boardContainer;
    this.movieModel = movieModel;
    this.commentModel = commentModel;
    this.boardCards  = [...this.movieModel.data];
    this.boardComments  = [...this.commentModel.data];

    render(new NewSortView(), this.boardContainer);
    render(this.boardComponent, this.boardContainer);
    render(this.cardListComponent, this.boardComponent.element);
    render(this.cardComponent, this.cardListComponent.element);

    //Определение количества отображаемых карточек фильмов для основного блока.
    const defaultListCount = Math.min(this.boardCards.length, COUNT_LIST_MOVIES);
    //Определение количества отображаемых карточек фильмов для дополнительных блоков «Top rated movies» и «Most commented».
    const additionalListCount = Math.min(this.boardCards.length, COUNT_LIST_ADDITIONAL);

    for (let i = 0; i < defaultListCount; i++) {
      render(new NewCardView(this.boardCards[i]), this.cardComponent.element);
    }

    render(new NewButtonShowMoreView(), this.cardListComponent.element);

    render(this.topListComponent, this.boardComponent.element);
    render(this.commentedListComponent, this.boardComponent.element);
    render(this.cardTopRatedComponent, this.topListComponent.element);
    render(this.cardCommentedComponent, this.commentedListComponent.element);

    for (let i = 0; i < additionalListCount; i++) {
      render(new NewCardView(this.boardCards[i]), this.cardTopRatedComponent.element);
    }

    for (let i = 0; i < additionalListCount; i++) {
      render(new NewCardView(this.boardCards[i]), this.cardCommentedComponent.element);
    }

    const firstCard = this.boardCards[0];
    const cardComments = this.boardComments.filter((values) => firstCard.comments.includes(values.id));

    render(new NewPopupView(firstCard, cardComments), this.boardContainer);
  };
}
