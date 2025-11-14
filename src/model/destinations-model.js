import { mockDestinations as destinations } from '../mocks/destinations';

export default class DestinationsModel {

  #destinations = null;

  constructor() {
    this.#destinations = [];
  }

  init() {
    this.#destinations = destinations;
  }

  get destinations() {
    return this.#destinations;
  }
}
