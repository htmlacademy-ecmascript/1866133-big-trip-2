export default class DestinationsModel {

  #destinations = null;
  #pointsApiService = null;

  constructor({pointsApiService}) {
    this.#destinations = [];
    this.#pointsApiService = pointsApiService;
  }

  get destinations() {
    return this.#destinations;
  }

  async init() {
    try {
      const destinations = await this.#pointsApiService.destinations;
      this.#destinations = destinations;
    } catch (error) {
      this.#destinations = [];
    }
  }
}
