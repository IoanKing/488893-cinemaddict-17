import Observable from '../framework/observable.js';
import {UpdateType} from '../const.js';

export default class CardModel extends Observable {
  #comments = null;
  #cards = [];
  #cardsApiService = null;

  constructor(cardsApiService) {
    super();
    this.#cardsApiService = cardsApiService;
  }

  init = async () => {
    try {
      const cards = await this.#cardsApiService.movies;
      this.#cards = cards.map(this.#adaptToClient);
    } catch(err) {
      this.#cards = [];
    }
    this._notify(UpdateType.INIT);
  };

  get cards() {
    return this.#cards;
  }

  updateCard = (updateType, update) => {
    const index = this.#cards.findIndex((card) => card.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting card');
    }

    this.#cards = [
      ...this.#cards.slice(0, index),
      update,
      ...this.#cards.slice(index + 1),
    ];
    this._notify(updateType, update);
  };

  addCard = (updateType, update) => {
    this.#cards = [
      update,
      ...this.#cards,
    ];

    this._notify(updateType, update);
  };

  deleteCard = (updateType, update) => {
    const index = this.#cards.findIndex((card) => card.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting card');
    }

    this.#cards = [
      ...this.#cards.slice(0, index),
      ...this.#cards.slice(index + 1),
    ];

    this._notify(updateType);
  };

  #adaptToClient = (movie) => {
    const adaptedCard = {...movie,
      id: movie['id'],
      userDetails: {
        isAlreadyWatched: movie['user_details']['already_watched'],
        watchingDate: movie['user_details']['watching_date'],
        watchlist: movie['user_details']['watchlist'],
        favorite: movie['user_details']['favorite']
      },
      filmInfo: {
        title: movie['film_info']['title'],
        alternativeTitle: movie['film_info']['alternative_title'],
        totalRating: movie['film_info']['total_rating'],
        poster: movie['film_info']['poster'],
        ageRating: movie['film_info']['age_rating'],
        director: movie['film_info']['director'],
        writers: movie['film_info']['writers'],
        actors: movie['film_info']['actors'],
        release: {
          date: movie['film_info']['release']['date'],
          releaseCountry: movie['film_info']['release']['release_country']
        },
        runtime: movie['film_info']['reruntimelease'],
        genre: movie['film_info']['genre'],
        description: movie['film_info']['description']
      }
    };

    delete adaptedCard['user_details'];
    delete adaptedCard['film_info'];

    return adaptedCard;
  };
}
