import { mockPoints as points } from '../mocks/points';

export default class PointModel {

  #points = null;

  constructor() {
    this.#points = [];
  }

  init() {
    this.#points = points;
  }

  points() {
    return this.#points;
  }
}
