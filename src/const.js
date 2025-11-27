const POINT_TYPES = ['taxi',
  'bus',
  'train',
  'ship',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant'
];

const DateFormat = {
  SHORT_DATE: 'MMM D',
  FULL_DATE: 'YYYY-MM-DD',
  ONLY_TIME: 'HH:mm',
  FULL_DATE_AND_TIME: 'YYYY-MM-DDTHH:mm',
  CALENDAR_DATE: 'DD/MM/YY',
  SHORT_DATE_REVERSE: 'D MMM'
};

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past'
};

const SortType = {
  DEFAULT: 'sort-day',
  TIME: 'sort-time',
  PRICE: 'sort-price'
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT'
};

const UpdateType = {
  PATCH: 'PACTH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT'
};

const getDefaultPoint = () => ({
  basePrice: 0,
  dateFrom: '',
  dateTo: '',
  destination: null,
  isFavorite: false,
  offers: [],
  type: POINT_TYPES[5]
});

export { POINT_TYPES,
  DateFormat,
  FilterType,
  SortType,
  UserAction,
  UpdateType,
  getDefaultPoint
};
