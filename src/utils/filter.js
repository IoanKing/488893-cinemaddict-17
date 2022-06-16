import {FilterType} from '../const';

const filter = {
  [FilterType.ALL]: (cards) => cards.filter((card) => card.userDetails.watchlist),
  [FilterType.WATCHLIST]: (cards) => cards.filter((card) => card.userDetails.isAlreadyWatched),
  [FilterType.HISTORY]: (cards) => cards.filter((card) => card.userDetails.isAlreadyWatched),
  [FilterType.FAVORITE]: (cards) => cards.filter((card) => card.userDetails.favorite),
};

export {filter};
