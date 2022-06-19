import {generateCard} from '../mock/movie.js';
import Observable from '../framework/observable.js';

export default class CardModel extends Observable {
  #comments = null;
  #cards = null;
  #cardsApiService = null;

  // constructor(comments) {
  //   super();
  //   this.comments = comments;
  //   this.#cards = Array.from({length: 26}, () => generateCard(this.comments));
  // }

  constructor(cardsApiService) {
    super();
    this.#cardsApiService = cardsApiService;

    this.#cardsApiService.movies.then((cards) => {
      console.log(cards);
      // Есть проблема: cтруктура объекта похожа, но некоторые ключи называются иначе,
      // а ещё на сервере используется snake_case, а у нас camelCase.
      // Можно, конечно, переписать часть нашего клиентского приложения, но зачем?
      // Есть вариант получше - паттерн "Адаптер"
    });
  }

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
}
