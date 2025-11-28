
export default class OffersModel {

  #offers = null;
  #pointsApiService = null;

  constructor({pointsApiService}) {
    this.#offers = [];
    this.#pointsApiService = pointsApiService;
  }

  get offers() {
    return this.#offers;
  }

  async init() {
    try {
      const offers = await this.#pointsApiService.offers;
      this.#offers = offers;
    } catch (error) {
      this.#offers = [];
    }
  }
}
