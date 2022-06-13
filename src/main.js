import NewProffileView from './view/profile-view.js';
import NewStatisticView from './view/statistics-view.js';
import BoardPresenter from './presenter/boad-presenter.js';
import {render} from './framework/render.js';
import CardModel from './model/card-models.js';
import CommentModel from './model/comment-models.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteStatisticsElement = document.querySelector('.footer__statistics');
const commentModel = new CommentModel();
const commentIds = commentModel.data.map((element) => element.id);
console.log();
const cardModel = new CardModel(commentIds);
const cardCount = cardModel.data.length;

render(new NewProffileView(), siteHeaderElement);
render(new NewStatisticView(cardCount), siteStatisticsElement);

const boardPresenter = new BoardPresenter(siteMainElement, cardModel, commentModel);

boardPresenter.init();
