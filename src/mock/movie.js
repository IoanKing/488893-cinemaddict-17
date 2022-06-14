import {getRandomNumber, getRandomArrayElement} from '../utils/utils.js';
import {genereteMovieInfo} from './movie-info.js';
import {generateUserDetails} from './user-detail.js';
import {nanoid} from 'nanoid';

export const generateCard = (comments) => ({
  id: nanoid(),
  comments: new Set(Array.from({length: getRandomNumber(0, 20)}, () => getRandomArrayElement(comments))),
  filmInfo: genereteMovieInfo(),
  userDetails: generateUserDetails()
});
