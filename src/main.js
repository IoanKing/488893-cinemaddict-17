import NewProffileView from './view/profile-view.js';
import NewFilterView from './view/filter-view.js';
import NewStatisticView from './view/statistics-view.js';
import BoardPresenter from './presenter/boad-presenter.js';
import {render} from './render.js';
import CardModel from './model/movie-models.js';
import CommentModel from './model/comment-models.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteStatisticsElement = document.querySelector('.footer__statistics');
const boardPresenter = new BoardPresenter();
const commentModel = new CommentModel();
const commentIds = commentModel.data.map((element) => element.id);
const cardModel = new CardModel(commentIds);
const cardCount = cardModel.data.length;

render(new NewProffileView(), siteHeaderElement);
render(new NewFilterView(), siteMainElement);
render(new NewStatisticView(cardCount), siteStatisticsElement);
boardPresenter.init(siteMainElement, cardModel, commentModel);
