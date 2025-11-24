import { FilterType } from '../const.js';
import { isEventExpired, isEventToday } from './event.js';


const filter = {
  [FilterType.EVERYTHING]: (points) => (points),
  [FilterType.FUTURE]: (points) =>
    (points.filter(((point) => !isEventExpired(point.dateFrom)))),
  [FilterType.PRESENT]: (points) => (points.filter(((point) => isEventToday(point.dateFrom)))),
  [FilterType.PAST]: (points) => (points.filter(((point) => isEventExpired(point.dateTo)))),
};

export { filter };
