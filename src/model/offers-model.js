import { mockOffers as offers } from '../mocks/offers';

export default class OffersModel {

  #offers = null;

  constructor() {
    this.#offers = [];
  }

  init() {
    this.#offers = offers;
  }

  get offers() {
    return this.#offers;
  }
}
