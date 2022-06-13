import {generateComment} from '../mock/comment.js';

export default class CommentModel {
  #data = Array.from({length: 200}, generateComment);

  get data() {
    return this.#data;
  }

  set data(element) {
    const newElement = generateComment(element);
    this.#data.push(newElement);
  }
}
