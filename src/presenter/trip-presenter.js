import { render } from '../framework/render';
import ListSortView from '../view/list-sort-view.js';
import ListPointsView from '../view/list-points-view.js';
import ListEmptyView from '../view/list-empty-view.js';
import PointPresenter from './point-presenter.js';
import { updateItem } from '../utils/common.js';
export default class TripPresenter {

  #container = null;
  #pointModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #points = [];
  #offers = [];
  #destinations = [];

  #sortComponent = new ListSortView();
  #pointsListComponent = new ListPointsView();
  #pointPresenters = new Map();

  constructor({ container, pointModel, offersModel, destinationsModel }) {
    this.#container = container;
    this.#pointModel = pointModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
  }

  init() {
    this.#points = [...this.#pointModel.points()];
    this.#offers = [...this.#offersModel.offers()];
    this.#destinations = [...this.#destinationsModel.destinations()];

    this.#renderTripBoard();
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handlePointChange = (updatedPoint) => {
    this.#points = updateItem(this.#points, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      offers: this.#offers,
      destinations: this.#destinations,
      pointListContainer: this.#pointsListComponent.element,
      onPointChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange
    });

    this.#pointPresenters.set(point.id, pointPresenter);
    pointPresenter.init(point);
  }

  #clearPointList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  #renderTripBoard() {

    if (this.#points.length === 0) {
      render(new ListEmptyView(), this.#container);
      return;
    }

    render(this.#sortComponent, this.#container);
    render(this.#pointsListComponent, this.#container);

    for (const point of this.#points) {
      this.#renderPoint(point);
    }
  }
}


