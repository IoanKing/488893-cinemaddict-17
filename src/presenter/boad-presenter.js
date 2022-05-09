import NewBoardView from '../view/board-view.js';
import NewCardListView from '../view/card-list-view.js';
import NewCardView from '../view/card-view.js';
import NewSortView from '../view/sort-view.js';
import NewButtonShowMoreView from '../view/button-show-view.js';
import NewCardListContainerView from '../view/card-list-container-view.js';
import {render} from '../render.js';

export default class BoardPresenter {
  boardComponent = new NewBoardView();
  cardListComponent = new NewCardListView();
  cardListExtra1Component = new NewCardListView(true);
  cardListExtra2Component = new NewCardListView(true);
  cardContainerComponent = new NewCardListContainerView();
  cardExtraContainer1Component = new NewCardListContainerView();
  cardExtraContainer2Component = new NewCardListContainerView();

  init = (boardContainer, dataModel) => {
    this.boardContainer = boardContainer;
    this.dataModel = dataModel;
    this.boardCards  = [...this.dataModel.getData()];

    render(new NewSortView(), this.boardContainer);
    render(this.boardComponent, this.boardContainer);
    render(this.cardListComponent, this.boardComponent.getElement());
    render(this.cardContainerComponent, this.cardListComponent.getElement());

    for (let i = 0; i < this.boardCards.length; i++) {
      render(new NewCardView(this.boardCards[i]), this.cardContainerComponent.getElement());
    }

    render(new NewButtonShowMoreView(), this.cardListComponent.getElement());

    render(this.cardListExtra1Component, this.boardComponent.getElement());
    render(this.cardListExtra2Component, this.boardComponent.getElement());
    render(this.cardExtraContainer1Component, this.cardListExtra1Component.getElement());
    render(this.cardExtraContainer2Component, this.cardListExtra2Component.getElement());

    for (let i = 0; i < this.boardCards.length; i++) {
      render(new NewCardView(this.boardCards[i]), this.cardExtraContainer1Component.getElement());
    }

    for (let i = 0; i < this.boardCards.length; i++) {
      render(new NewCardView(this.boardCards[i]), this.cardExtraContainer2Component.getElement());
    }
  };
}
