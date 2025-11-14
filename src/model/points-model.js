import { mockPoints as points } from '../mocks/points.js';
import Observable from '../framework/observable.js';


export default class PointModel extends Observable {

  #points = null;

  constructor() {
    super();
    this.#points = [];
  }

  init() {
    this.#points = points;
  }

  get points() {
    return this.#points;
  }

  /**
   *
   * @param {string} updateType информация о типе изменения
   * @param {Object} update точка с изменениями
  */
  updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if(index === -1) {
      throw new Error('Нельзя обновить несуществующую точку');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      update,
      ...this.#points.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {

    this.#points.push(update);
    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {

    this.#points = this.#points.filter((item) => item.id !== update.id);
    this._notify(updateType);
  }
}
