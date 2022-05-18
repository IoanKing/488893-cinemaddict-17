import {generateCard} from '../mock/movie.js';

export default class CardModel {
  #data = Array.from({length: 13}, generateCard);

  get data() {
    return this.#data;
  }
}
