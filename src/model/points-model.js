import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';

export default class PointsModel extends Observable {

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

  get points() {
    return this.#points;
  }

  async init() {
    this.#newEventButton.disabled = true;
    try {
      await Promise.all([
        this.#destinationsModel.init(),
        this.#offersModel.init()
      ]);
      const points = await this.#pointsApiService.points;
      this.#points = points.map(this.#adaptToClient);
      this.#newEventButton.disabled = false;
      this._notify(UpdateType.INIT);
    } catch (error) {
      this.#points = [];
      this._notify(UpdateType.ERROR);
    }
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

  async addPoint(updateType, update) {
    try {
      const response = await this.#pointsApiService.addPoint(update);
      const newPoint = this.#adaptToClient(response);
      this.#points.push(newPoint);
      this._notify(updateType, newPoint);
    } catch (error) {
      throw new Error('Не удается добавить новую точку');
    }
  }

  async deletePoint(updateType, update) {
    try {
      await this.#pointsApiService.deletePoint(update);
      this.#points = this.#points.filter((item) => item.id !== update.id);
      this._notify(updateType);
    } catch (error) {
      throw new Error('Не удается удалить точку');
    }
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
