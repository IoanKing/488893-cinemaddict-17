import NewProffileView from './view/profile-view.js';
import NewStatisticView from './view/statistics-view.js';
import BoardPresenter from './presenter/boad-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import {render} from './framework/render.js';
import CardModel from './model/movie-models.js';
import CommentModel from './model/comment-models.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteStatisticsElement = document.querySelector('.footer__statistics');
const commentModel = new CommentModel();
const commentIds = commentModel.data.map((element) => element.id);
const cardModel = new CardModel(commentIds);
const cardCount = cardModel.data.length;

render(new NewProffileView(), siteHeaderElement);
render(new NewStatisticView(cardCount), siteStatisticsElement);

const filterPresenter = new FilterPresenter(siteMainElement, cardModel);
const boardPresenter = new BoardPresenter(siteMainElement, cardModel, commentModel);

filterPresenter.init();
boardPresenter.init();
