import {getRandomArrayElement} from '../utils.js';

const commentEmotions = ['smile', 'sleeping', 'puke', 'angry'];

export const getComment = () => ({
  id: null,
  author: null,
  comment: null,
  date: null,
  emotion: getRandomArrayElement(commentEmotions),
});
