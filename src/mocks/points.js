import { getRandomInteger } from '../utils.js';

export const mockPoints = [
  {
    id: '1',
    basePrice: getRandomInteger(700, 950),
    dateFrom: '2025-10-25T11:55:56.845Z',
    dateTo: '2025-10-25T15:22:13.375Z',
    destination: 'Amsterdam',
    isFavorite: false,
    offers: ['1', '2'],
    type: 'taxi'
  },
  {
    id: '2',
    basePrice: getRandomInteger(250, 350),
    dateFrom: '2025-10-26T11:22:00.000Z',
    dateTo: '2025-10-26T11:52:00.000Z',
    destination: 'Chamonix',
    isFavorite: true,
    offers: ['1', '3', '5'],
    type: 'bus'
  },
  // {
  //   id: '3',
  //   basePrice: 3500,
  //   dateFrom: '2025-10-27T10:55:59.845Z',
  //   dateTo: '2025-10-28T12:55:01.375Z',
  //   destination: 'Italy',
  //   isFavorite: false,
  //   offers: ['1'],
  //   type: 'flight'
  // },
  {
    id: '3',
    basePrice: getRandomInteger(3000, 3500),
    dateFrom: '2025-10-27T10:55:00.000Z',
    dateTo: '2025-10-28T12:56:00.000Z',
    destination: 'Italy',
    isFavorite: false,
    offers: ['1'],
    type: 'flight'
  },
  {
    id: '4',
    basePrice: getRandomInteger(2000, 2500),
    dateFrom: '2025-10-28T10:00:00.000Z',
    dateTo: '2025-10-29T10:00:00.000Z',
    destination: 'Spain',
    isFavorite: false,
    offers: [ ],
    type: 'ship'
  }
];
