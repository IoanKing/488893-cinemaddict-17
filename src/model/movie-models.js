import {generateCard} from '../mock/movie.js';

export default class CardModel {
  datas = Array.from({length: 5}, generateCard);

  getData = () => this.datas;
}
