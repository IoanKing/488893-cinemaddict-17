import dayjs from 'dayjs';
import dayjsRandom from 'dayjs-random';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import {Setting} from '../const.js';

dayjs.extend(dayjsRandom);
dayjs.extend(duration);
dayjs.extend(relativeTime);

const ESC_ALL_BROWSERS = 'Escape';
const ESC_IE = 'Esc';
const ENTER_ALL_BROWSERS = 'Enter';
const DEBOUNCE_TIME = 500;

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
 * @param {object} cb - callback функция.
 * @param {number} timeoutDelay - Задержка выполнения функции.
 * @returns - Выполнение callback функции с задержкой.
 */
const debounce = (cb, timeoutDelay = DEBOUNCE_TIME) => {
  let timeoutId;
  return (...rest) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => cb.apply(null, rest), timeoutDelay);
  };
};

/**
 * Обрезка текста более заданого количества символов.
 * @param {string} text - Исходный текст.
 * @returns - Обрезанный текст.
 */
const getDescriptionShort = (text) => `${text.substring(0, Setting.MAX_TEXT_LENGTH)}${(text.length > Setting.MAX_TEXT_LENGTH) ? '...' : ''} `;

export {
  getYearDate,
  getHumanReadableTime,
  getHumanReadableDate,
  getCommentDate,
  onEscKeydown,
  onCtrlEnterKeydown,
  debounce,
  getDescriptionShort
};
