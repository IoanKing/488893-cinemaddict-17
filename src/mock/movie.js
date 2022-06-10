import {getRandomNumber} from '../utils.js';
import {genereteMovieInfo} from './movie-info.js';
import {generateUserDetails} from './user-detail.js';
import {nanoid} from 'nanoid';

export const generateCard = () => ({
  id: nanoid(),
  comments: new Set(Array.from({length: getRandomNumber(0, 100)}, () => getRandomNumber(0, 200))),
  filmInfo: genereteMovieInfo(),
  userDetails: generateUserDetails()
});
