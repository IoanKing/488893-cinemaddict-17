import {generateCard} from '../mock/movie.js';

export default class CardModel {
  data = Array.from({length: 200}, generateCard);

  getData = () => this.data;
}
