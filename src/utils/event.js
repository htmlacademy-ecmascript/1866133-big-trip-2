import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);


const DateFormat = {
  ShortDate: 'MMM D',
  FullDate: 'YYYY-MM-DD',
  OnlyTime: 'HH:mm',
  FullDateAndTime: 'YYYY-MM-DDTHH:mm',
  CalendarDate: 'DD/MM/YY',
  ShortDateReverse: 'D MMM'
};

const conversionDate = (date, formatTemplate) => dayjs(date).format(formatTemplate);

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


const isEventExpired = (dueDate) => dueDate && dayjs().isAfter(dueDate, 'minute');
const isEventToday = (dueDate) => dueDate && dayjs().isSame(dueDate, 'D');

const sortDay = (PointA, PointB) => dayjs(PointA.dateFrom) - dayjs(PointB.dateFrom);

const sortTime = (PointA, PointB) =>
  (dayjs(PointB.dateTo).diff(dayjs(PointB.dateFrom))) - (dayjs(PointA.dateTo).diff(dayjs(PointA.dateFrom)));

const sortPrice = (PointA, PointB) => PointB.basePrice - PointA.basePrice;

const isDatesDifference = (pointA, pointB) => (
  pointA.dateFrom !== pointB.dateFrom ||
  pointA.basePrice !== pointB.basePrice ||
  getDuration(pointA.dateFrom, pointA.dateTo) !== getDuration(pointB.dateFrom, pointB.dateTo)
);

export {
  DateFormat,
  conversionDate,
  getDuration,
  isEventExpired,
  isEventToday,
  sortDay,
  sortTime,
  sortPrice,
  isDatesDifference
};
