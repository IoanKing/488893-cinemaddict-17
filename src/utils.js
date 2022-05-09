/**
* Функция возвращающая случайное целое число из переданного диапазона
* включительно.
* источник: https://up.htmlacademy.ru/profession/fullstack/2/javascript/25/tasks/7
*
* @param {number} a - Значение диапазона (либо минимальное либо максимальное).
* @param {number} b - Значение диапазона (либо минимальное либо максимальное).
* @return {number} - Целое число
*/
const getRandomNumber = (a, b) => {
  const lower = Math.ceil(Math.min(Math.abs(a), Math.abs(b)));
  const upper = Math.floor(Math.max(Math.abs(a), Math.abs(b)));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
};

/**
 * Функция возвращающая случайное число с плавающей точкой из переданного
 * диапазона включительно.
 * источник: https://up.htmlacademy.ru/profession/fullstack/2/javascript/25/tasks/7
 *
 * @param {number} a - Значение диапазона (либо минимальное либо максимальное).
 * @param {number} b - Значение диапазона (либо минимальное либо максимальное).
 * @param {number} decimalPlaces - Число знаков после зяпятой.
 * @return {number} - Число с плавающей точкой
 */
const getRandomFloat = (a, b, decimalPlaces = 1) => {
  const lower = Math.min(Math.abs(a), Math.abs(b));
  const upper = Math.max(Math.abs(a), Math.abs(b));
  const result = Math.random() * (upper - lower) + lower;
  return +result.toFixed(decimalPlaces);
};

/**
* Функция возвращающая случайный элемент массива.
*
* @param {array} elements - Массив с элементами.
* @return {object} - Элемент массива.
*/
const getRandomArrayElement = (elements) => {
  const result = elements[getRandomNumber(0, elements.length - 1)];
  return result;
};

/**
* Функция возвращающая массив случайной длины из списка значений.
* (без повторений).
*
* @param {array} list - список значений.
* @return {array} - массив значений.
*/
const getRandomList = (list) => {
  const count = getRandomNumber(1, list.length - 1);
  const selectionList = list.slice();
  const result = [];

  for (let i = 0; i < count; i++) {
    const randomIndex = getRandomNumber(0, selectionList.length - 1);
    result.push(selectionList[randomIndex]);
    selectionList.splice(randomIndex, 1);
  }

  return result;
};

/**
* Функция возвращающая массив случайной длины из списка значений.
* (с повторениями).
*
* @param {array} list - список значений.
* @param {number} maxRange - максимальный размер длинны массива.
* @return {array} - массив значений.
*/
const getRandomArrayList = (list, maxRange = 10) => {
  const count = getRandomNumber(0, maxRange);
  const result = Array.from({ length: count }, () => list[getRandomNumber(0, list.length - 1)]);

  return result;
};

function getLastDayOfMonth(year, month) {
  const date = new Date(year, month + 1, 0);
  return date.getDate();
}

const generateDate = (min, max) => {
  const year = getRandomNumber(min, max);
  const month = getRandomNumber(1,12);
  const day = getRandomNumber(1,31);
  const lastMonthDay = getLastDayOfMonth(year, month);
  const correctDay = (lastMonthDay < day) ? lastMonthDay : day;

  return `${year}-${(month>=10)? month : `0${month}`}-${(correctDay>=10)? correctDay : `0${correctDay}`}T00:00:00.000Z`;
};

export {getRandomNumber, getRandomFloat, getRandomArrayElement, getRandomList, getRandomArrayList, generateDate};
