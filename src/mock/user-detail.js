import {getRandomDate, getRandomNumber} from '../utils.js';

const Years = {
  MIN: 2015,
  MAX: 2022
};

export const generateUserDetails = () => ({
  watchlist: Boolean(getRandomNumber(0, 1)),
  isAlreadyWatched: Boolean(getRandomNumber(0, 1)),
  watchingDate: getRandomDate(Years.MIN, Years.MAX),
  favorite: Boolean(getRandomNumber(0, 1)),
});
