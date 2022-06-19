import NewStatisticView from './view/statistics-view.js';
import BoardPresenter from './presenter/boad-presenter.js';
import {render} from './framework/render.js';
import CardModel from './model/card-models.js';
import CommentModel from './model/comment-models.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import ProfilePresenter from './presenter/profile-presenter.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteStatisticsElement = document.querySelector('.footer__statistics');

const commentModel = new CommentModel();
const filterModel = new FilterModel();
const commentIds = commentModel.comments.map((element) => element.id);
const cardModel = new CardModel(commentIds);

const profilePresenter = new ProfilePresenter(siteHeaderElement, cardModel);
const filterPresentor = new FilterPresenter(siteMainElement, filterModel, cardModel);
const boardPresenter = new BoardPresenter(siteMainElement, cardModel, commentModel, filterModel);

profilePresenter.init();
filterPresentor.init();
boardPresenter.init();

render(new NewStatisticView(cardModel), siteStatisticsElement);
