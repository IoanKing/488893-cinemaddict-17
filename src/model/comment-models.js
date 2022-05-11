import {generateComment} from '../mock/comment.js';

export default class CommentModel {
  data = Array.from({length: 200}, generateComment);

  getData = () => this.data;
}
