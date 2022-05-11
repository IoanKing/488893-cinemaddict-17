import {getRandomArrayElement, getRandomDate} from '../utils.js';

const commentEmotions = ['smile', 'sleeping', 'puke', 'angry'];

const Years = {
  MIN: 2018,
  MAX: 2022
};

const authors = [
  'Lorem ipsum',
  'Ut morbi',
  'Labore et dolore',
  'Viverra orci',
  'Nascetur ridiculus',
  'Tempor nec feugiat',
  'Tristique senectus',
  'Facilisis gravid',
  'Non curabitur',
  'Sem nulla',
  'Enim praesent',
  'Placerat duis',
];

const comments = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  'Ut morbi tincidunt augue interdum velit euismod in pellentesque massa.',
  'Imperdiet sed euismod nisi porta lorem.',
  'Est velit egestas dui id. ',
  'Viverra orci sagittis eu volutpat.',
  'Tempor nec feugiat nisl pretium fusce.',
  'Enim nunc faucibus a pellentesque sit.',
  'Et netus et malesuada fames ac turpis.',
  'Facilisis gravida neque convallis a.',
  'Tristique senectus et netus et.',
  'Non curabitur gravida arcu ac tortor dignissim convallis.',
  'Sem nulla pharetra diam sit.',
  'Placerat duis ultricies lacus sed turpis tincidunt.',
  'Dis parturient montes nascetur ridiculus.',
  'Enim praesent elementum facilisis leo vel fringilla est.',
];

let commentCount = 0;

/**
 * Генерация комментариев.
 * @returns {object} - Комментарий.
 */
export const generateComment = () => ({
  id: commentCount++,
  author: getRandomArrayElement(authors),
  comment: getRandomArrayElement(comments),
  date: getRandomDate(Years.MIN, Years.MAX),
  emotion: getRandomArrayElement(commentEmotions),
});
