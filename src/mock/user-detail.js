import {generateDate} from '../utils.js';

const Years = {
  MIN: 2015,
  MAX: 2022
};

export const generateUserDetails = () => ({
  watchlist: false,
  isAlreadyWatched: generateDate(Years.MIN, Years.MAX),
  watchingDate: false,
  favorite: false,
});
