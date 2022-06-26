const Setting = {
  MAX_TEXT_LENGTH: 140,
  COUNT_LIST_MOVIES: 5,
  COUNT_LIST_ADDITIONAL: 2,
};

const FilterType = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITE: 'favotites',
};

const SortType = {
  DEFAULT: 'default',
  BY_DATE: 'date',
  BY_RATIO: 'ratio',
};

const UserAction = {
  UPDATE_CARD: 'UPDATE_CARD',
  ADD_CARD: 'ADD_CARD',
  DELETE_CARD: 'DELETE_CARD',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

const CommentAction = {
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

const RankType = {
  NO_RANK: '',
  NOVICE: 'novice',
  FAN: 'fan',
  MOVIE_BUF: 'movie buf'
};

const RankCount = {
  NO_RANK: 0,
  NOVICE: 10,
  FAN: 20,
};

export {Setting, FilterType, SortType, UserAction, UpdateType, CommentAction, RankType, RankCount};
