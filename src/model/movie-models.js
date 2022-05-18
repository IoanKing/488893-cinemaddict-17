import {generateCard} from '../mock/movie.js';

export default class CardModel {
  #data = Array.from({length: 14}, generateCard);

  get data() {
    return this.#data;
  }
}
