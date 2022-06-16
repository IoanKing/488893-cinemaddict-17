import NewProffileView from './view/profile-view.js';
import NewStatisticView from './view/statistics-view.js';
import BoardPresenter from './presenter/boad-presenter.js';
import {render} from './framework/render.js';
import CardModel from './model/card-models.js';
import CommentModel from './model/comment-models.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteStatisticsElement = document.querySelector('.footer__statistics');
const commentModel = new CommentModel();
const filterModel = new FilterModel();
const commentIds = commentModel.comments.map((element) => element.id);
const cardModel = new CardModel(commentIds);
const cardCount = cardModel.cards.length;

render(new NewProffileView(), siteHeaderElement);
render(new NewStatisticView(cardCount), siteStatisticsElement);

const filterPresentor = new FilterPresenter(siteMainElement, filterModel.filter);
const boardPresenter = new BoardPresenter(siteMainElement, cardModel, commentModel);
filterPresentor.init(cardModel);
boardPresenter.init();
