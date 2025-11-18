import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';

export default class PointModel extends Observable {

  #points = null;
  #pointsApiService = null;
  #offersModel = null;
  #destinationsModel = null;
  #newEventButton = null;

  constructor({pointsApiService, offersModel, destinationsModel, newEventButton}) {
    super();
    this.#points = [];
    this.#pointsApiService = pointsApiService;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#newEventButton = newEventButton;
  }

  async init() {
    try {
      this.#newEventButton.disabled = true;
      await Promise.all([
        this.#destinationsModel.init(),
        this.#offersModel.init()
      ]);
      const points = await this.#pointsApiService.points;
      this.#points = points.map(this.#adaptToClient);
      //window.console.log('this.#points', this.#points);
    } catch (error) {
      this.#points = [];
    }
    this._notify(UpdateType.INIT);
  }

  get points() {
    return this.#points;
  }

  /**
   *
   * @param {string} updateType информация о типе изменения
   * @param {Object} update точка с изменениями
  */
  async updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if(index === -1) {
      throw new Error('Нельзя обновить несуществующую точку');
    }

    try {

      const response = await this.#pointsApiService.updatePoint(update);
      const updatedPoint = this.#adaptToClient(response);

      this.#points = [
        ...this.#points.slice(0, index),
        updatedPoint,
        ...this.#points.slice(index + 1)
      ];

      this._notify(updateType, updatedPoint);

    } catch (error) {
      throw new Error('Не удается обновить точку');
    }
  }

  addPoint(updateType, update) {

    this.#points.push(update);
    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {

    this.#points = this.#points.filter((item) => item.id !== update.id);
    this._notify(updateType);
  }

  #adaptToClient(point) {

    const adaptedPoint = {...point,
      'dateFrom': point.date_from,
      'dateTo': point.date_to,
      'basePrice': point.base_price,
      'isFavorite': point.is_favorite,
    };

    // удаляем ненужные ключи
    delete adaptedPoint.date_from;
    delete adaptedPoint.date_to;
    delete adaptedPoint.is_favorite;
    delete adaptedPoint.base_price;

    return adaptedPoint;
  }
}
