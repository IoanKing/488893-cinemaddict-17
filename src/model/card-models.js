import {generateCard} from '../mock/movie.js';
import Observable from '../framework/observable.js';

export default class CardModel extends Observable {
  #comments = null;
  #data = null;

  constructor(comments) {
    super();
    this.comments = comments;
    this.#data = Array.from({length: 26}, () => generateCard(this.comments));
  }

  get data() {
    return this.#data;
  }
}
