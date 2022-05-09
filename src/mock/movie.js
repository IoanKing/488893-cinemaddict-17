import {getRandomNumber} from '../utils.js';
import {genereteMovieInfo} from './movie-info.js';
import {generateUserDetails} from './user-detail.js';

export const generateCard = () => ({
  id: getRandomNumber(1, 100),
  comments: Array.from({length: getRandomNumber(0, 10)}, () => getRandomNumber(1, 100)),
  filmInfo: genereteMovieInfo(),
  userDetails: generateUserDetails()
});
