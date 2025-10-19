import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import duration from 'dayjs/plugin/duration';

dayjs.extend(utc);
dayjs.extend(duration);

const getRandomInteger = (a, b) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
};

const getRandomArrayElement = (array) => array[Math.floor(Math.random() * array.length)];

const isEscapeKey = (evt) => evt.key === 'Escape';

const DateFormat = {
  'short-date': 'MMM DD',
  'full-date': 'YYYY-MM-DD',
  'only-time': 'HH:mm',
  'full-date-and-time': 'YYYY-MM-DDTHH:mm',
  'calendar-date': 'DD/MM/YY'
};

const conversionDate = (date, type) => dayjs.utc(date).utcOffset(1, true).format(DateFormat[type]);

const getDuration = (dateFrom, dateTo) => {

  const startDate = dayjs(dateFrom);
  const endDate = dayjs(dateTo);

  const delta = dayjs.duration(endDate.diff(startDate));

  const minutes = delta.$d.minutes;
  const hours = delta.$d.hours;
  const days = delta.$d.days;

  let times = null;

  if(days > 0) {
    times = [`${days}D`, `${hours}H`, `${minutes}M`];
  }

  if(days === 0 && hours > 0) {
    times = [`${hours}H`, `${minutes}M`];
  }

  if(days === 0 && hours === 0) {
    times = [`${minutes}M`];
  }

  return times.map((item) => parseInt(item, 10) <= 9 ? `0${item}` : item).join(' ');
};

const capitalizeFirstLetter = (word) => word.charAt(0).toUpperCase() + word.slice(1);

export {
  getRandomInteger,
  getRandomArrayElement,
  isEscapeKey,
  conversionDate,
  getDuration,
  capitalizeFirstLetter
};
