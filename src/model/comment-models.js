import {generateComment} from '../mock/comment.js';
import Observable from '../framework/observable.js';

export default class CommentModel extends Observable {
  #data = Array.from({length: 200}, generateComment);

  get data() {
    return this.#data;
  }

  set data(element) {
    const newElement = generateComment(element);
    this.#data.push(newElement);
  }
}
