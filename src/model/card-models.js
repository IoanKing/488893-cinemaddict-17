import {generateCard} from '../mock/movie.js';

export default class CardModel {
  #comments = null;
  #data = null;

  constructor(comments) {
    this.comments = comments;
    this.#data = Array.from({length: 26}, () => generateCard(this.comments));
  }

  get data() {
    return this.#data;
  }
}
