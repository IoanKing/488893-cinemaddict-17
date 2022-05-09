import NewBoardView from '../view/board-view.js';
import NewCardListView from '../view/card-list-view.js';
import NewCardView from '../view/card-view.js';
import NewSortView from '../view/sort-view.js';
import NewButtonShowMoreView from '../view/button-show-view.js';
import NewCardListContainerView from '../view/card-list-container-view.js';
import {render} from '../render.js';
import NewPopupView from '../view/popup-view.js';

const MAX_DEFALT_MOVIES = 5;
const MAX_EXTRA_MOVIES = 2;

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
    this.boardCards  = [...this.movieModel.getData()];
    this.boardComments  = [...this.commentModel.getData()];

    render(new NewSortView(), this.boardContainer);
    render(this.boardComponent, this.boardContainer);
    render(this.cardListComponent, this.boardComponent.getElement());
    render(this.cardComponent, this.cardListComponent.getElement());

    for (let i = 0; i < Math.min(this.boardCards.length, MAX_DEFALT_MOVIES); i++) {
      render(new NewCardView(this.boardCards[i]), this.cardComponent.getElement());
    }

    render(new NewButtonShowMoreView(), this.cardListComponent.getElement());

    render(this.topListComponent, this.boardComponent.getElement());
    render(this.commentedListComponent, this.boardComponent.getElement());
    render(this.cardTopRatedComponent, this.topListComponent.getElement());
    render(this.cardCommentedComponent, this.commentedListComponent.getElement());

    for (let i = 0; i < Math.min(this.boardCards.length, MAX_EXTRA_MOVIES); i++) {
      render(new NewCardView(this.boardCards[i]), this.cardTopRatedComponent.getElement());
    }

    for (let i = 0; i < Math.min(this.boardCards.length, MAX_EXTRA_MOVIES); i++) {
      render(new NewCardView(this.boardCards[i]), this.cardCommentedComponent.getElement());
    }

    const firstCard = this.boardCards[0];
    const cardComments = this.boardComments.filter((values) => firstCard.comments.includes(values.id));

    render(new NewPopupView(firstCard, cardComments), this.boardContainer);
  };
}
