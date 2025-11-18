//import { mockDestinations as destinations } from '../mocks/destinations';
//import { UpdateType } from '../const.js';

export default class DestinationsModel {

  #destinations = null;
  #pointsApiService = null;

  constructor({pointsApiService}) {
    this.#destinations = [];
    this.#pointsApiService = pointsApiService;
  }

  async init() {
    try {
      const destinations = await this.#pointsApiService.destinations;
      this.#destinations = destinations;
      window.console.log('this.#destinations', this.#destinations);
    } catch (error) {
      this.#destinations = [];
    }
  }

  get destinations() {
    return this.#destinations;
  }
}
