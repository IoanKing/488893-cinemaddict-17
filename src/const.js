const Setting = {
  MAX_TEXT_LENGTH: 130,
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
  UPDATE_TASK: 'UPDATE_TASK',
  ADD_TASK: 'ADD_TASK',
  DELETE_TASK: 'DELETE_TASK',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

export {Setting, FilterType, SortType, UserAction, UpdateType};
