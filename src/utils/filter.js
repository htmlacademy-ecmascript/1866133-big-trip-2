import { FilterType } from '../const';
import { isEventExpired, isEventToday } from './event';


const filter = {
  [FilterType.EVERYTHING]: (points) => (points),
  [FilterType.FUTURE]: (points) =>
    (points.filter(((point) =>
      !isEventExpired(point.dateFrom) && !isEventExpired(point.dateFrom)))),
  [FilterType.PRESENT]: (points) => (points.filter(((point) => isEventToday(point.dateFrom)))),
  [FilterType.PAST]: (points) => (points.filter(((point) => isEventExpired(point.dateFrom)))),
};

export { filter };
