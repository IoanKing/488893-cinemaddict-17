import {getRandomNumber} from '../utils.js';
import {genereteMovieInfo} from './movie-info.js';
import {generateUserDetails} from './user-detail.js';

let movieCount = 0;

export const generateCard = () => ({
  id: movieCount++,
  comments: new Set(Array.from({length: getRandomNumber(0, 100)}, () => getRandomNumber(0, 200))),
  filmInfo: genereteMovieInfo(),
  userDetails: generateUserDetails()
});
