import dayjs from 'dayjs';

const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

const getWeightForNullDate = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
};

const sortCardDate = (cardA, cardB) => {
  const weight = getWeightForNullDate(cardA.filmInfo.release.date, cardB.filmInfo.release.date);

  return weight ?? dayjs(cardA.filmInfo.release.date).diff(dayjs(cardB.filmInfo.release.date));
};

const sortCardRate = (cardA, cardB) => {
  const weight = getWeightForNullDate(cardA.dueDate, cardB.dueDate);

  return weight ?? cardB.filmInfo.totalRating - cardA.filmInfo.totalRating;
};

export {updateItem, sortCardDate, sortCardRate};
