import StatisticPresenter from './presenter/statistic-presenter.js';
import BoardPresenter from './presenter/boad-presenter.js';
import CardModel from './model/card-models.js';
import CommentModel from './model/comment-models.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import ProfilePresenter from './presenter/profile-presenter.js';
import CardsApiService from './card-api-service.js';

const AUTHORIZATION = 'Basic er893jdzbdw';
const END_POINT = 'https://17.ecmascript.pages.academy/cinemaddict';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteStatisticsElement = document.querySelector('.footer__statistics');

const filterModel = new FilterModel();
const cardModel = new CardModel(new CardsApiService(END_POINT, AUTHORIZATION));
const commentModel = new CommentModel(new CardsApiService(END_POINT, AUTHORIZATION));

const profilePresenter = new ProfilePresenter(siteHeaderElement, cardModel);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, cardModel);
const boardPresenter = new BoardPresenter(siteMainElement, cardModel, commentModel, filterModel);
new StatisticPresenter(siteStatisticsElement, cardModel);

profilePresenter.init();
filterPresenter.init();
boardPresenter.init();
cardModel.init();


