import { render } from '../framework/render';
import ListSortView from '../view/list-sort-view.js';
import ListPointsView from '../view/list-points-view.js';
import ListEmptyView from '../view/list-empty-view.js';
import PointPresenter from './point-presenter.js';
import { updateItem } from '../utils/common.js';
import { sortDay, sortTime, sortPrice} from '../utils/event.js';
import { SortType } from '../const.js';

export default class TripPresenter {

  #container = null;
  #pointModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #points = [];
  #offers = [];
  #destinations = [];

  #sortComponent = null;
  #pointsListComponent = new ListPointsView();
  #pointPresenters = new Map();
  #currentSortType = SortType.DEFAULT;
  #sortedPoints = [];

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

  #sortPoints = (sortType) => {
    switch(sortType) {
      case SortType.TIME:
        this.#sortedPoints = this.#points.toSorted(sortTime);
        break;
      case SortType.PRICE:
        this.#sortedPoints = this.#points.toSorted(sortPrice);
        break;
      default: this.#sortedPoints = this.#points.toSorted(sortDay);
    }

    this.#currentSortType = sortType;
  };


  #handleSortFormChange = (sortType) => {

    if(this.#currentSortType === sortType) {
      return;
    }

    this.#sortPoints(sortType);
    this.#clearPointList();

    this.#renderPointList(this.#sortedPoints);
  };


  #renderSort() {
    this.#sortComponent = new ListSortView({onSortFormChange: this.#handleSortFormChange });
    render(this.#sortComponent, this.#container);
  }


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

  #renderPointList(points) {
    render(this.#pointsListComponent, this.#container);
    for (const point of points) {
      this.#renderPoint(point);
    }
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

    this.#renderSort();
    this.#renderPointList(this.#points);
  }
}


