import { mockPoints as points } from '../mocks/points';
// import { mockOffers as offers } from '../mocks/offers';
// import { mockDestinations as destinations } from '../mocks/destinations';

export default class PointModel {

  constructor() {
    this.points = [];
    // this.offers = [];
    // this.destinations = [];
  }

  init() {
    this.points = points;
    // this.offers = offers;
    // this.destinations = destinations;
  }

  getPoints() {
    return this.points;
  }

  // getOffers() {
  //   return this.offers;
  // }

  // getDestinations() {
  //   return this.destinations;
  // }
}
