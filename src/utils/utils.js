import dayjs from 'dayjs';
import dayjsRandom from 'dayjs-random';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(dayjsRandom);
dayjs.extend(duration);
dayjs.extend(relativeTime);

const ESC_ALL_BROWSERS = 'Escape';
const ESC_IE = 'Esc';
const ENTER_ALL_BROWSERS = 'Enter';
const DEBOUNCE_TIME = 500;

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

/**
 * Получение случаной даты в формате UTC за заданный период.
 * @param {number} min - год начала периода.
 * @param {number} max - год окончания периода.
 * @returns {string} - Дата в формате UTC.
 */
const getRandomDate = (min, max) => {
  const beginDate = dayjs(new Date(min, 1, 1));
  const endDate = dayjs(new Date(max, 1, 1));

  return dayjs.between(beginDate, endDate).format();
};

/**
 * Получение человекочитаемого Года из даты в формате UTC.
 * @param {string} date - дата в формате UTC.
 * @returns - Год.
 */
const getYearDate = (date) => dayjs(date).format('YYYY');

/**
 * Получение человекочитаемого Года из даты в формате UTC.
 * @param {string} date - дата в формате UTC.
 * @returns - Год.
 */
const getHumanReadableDate = (date) => dayjs(date).format('DD MMM YYYY');

/**
 * Получение человекочитаемой даты для коммантериев из формата UTC.
 * @param {string} date - дата в формате UTC.
 * @returns {string} - Дата.
 */
const getCommentDate = (date) => dayjs(date).format('YYYY/MM/DD HH:mm');

/**
 * Получение человекочитаемой длительности фильма.
 * @param {number} time - Длительность в минутах.
 * @returns {string} - Длительность в часах и минутах.
 */
const getHumanReadableTime = (time) => {
  let result = '';
  const durations = dayjs.duration(time, 'minutes');
  const hours = durations.hours();
  const minutes = durations.minutes();
  result += (hours > 0) ? `${hours}h ` : '';
  result += `${minutes}m`;
  return result;
};

/**
 * Проверка нажатия клавишы ESC.
 * @returns {boolean}
 */
const onEscKeydown = (evt) => evt.key === ESC_ALL_BROWSERS || evt.key === ESC_IE;

/**
 * Проверка нажатия клавишы CTRL + ENTER.
 * @returns {boolean}
 */
const onCtrlEnterKeydown = (evt) =>(evt.ctrlKey || evt.metaKey) && evt.key === ENTER_ALL_BROWSERS;

/**
 * Устранения дребезга.
 * @param {object} cb - Collback функция.
 * @param {number} timeoutDelay - Задержка выполнения функции.
 * @returns - Выполнение Collback функции с задержкой.
 */
const debounce = (cb, timeoutDelay = DEBOUNCE_TIME) => {
  let timeoutId;
  return (...rest) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => cb.apply(null, rest), timeoutDelay);
  };
};

export {
  getRandomNumber,
  getRandomFloat,
  getRandomArrayElement,
  getRandomList,
  getRandomArrayList,
  getRandomDate,
  getYearDate,
  getHumanReadableTime,
  getHumanReadableDate,
  getCommentDate,
  onEscKeydown,
  onCtrlEnterKeydown,
  debounce
};
