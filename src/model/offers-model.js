import { mockOffers as offers } from '../mocks/offers';

export default class OffersModel {

  constructor() {
    this.offers = [];
  }

  init() {
    this.offers = offers;
  }

  getOffers() {
    return this.offers;
  }
}
