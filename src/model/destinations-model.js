import { mockDestinations as destinations } from '../mocks/destinations';

export default class DestinationsModel {

  constructor() {
    this.destinations = [];
  }

  init() {
    this.destinations = destinations;
  }

  getDestinations() {
    return this.destinations;
  }
}
