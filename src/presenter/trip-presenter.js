import { render, remove, RenderPosition } from '../framework/render';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import TripInfoView from '../view/trip-info-view.js';
import ListSortView from '../view/list-sort-view.js';
import ListPointsView from '../view/list-points-view.js';
import ListEmptyView from '../view/list-empty-view.js';
import LoadingView from '../view/loading-view.js';
import PointPresenter from './point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import { sortDay, sortTime, sortPrice} from '../utils/event.js';
import { SortType, UserAction, FilterType, UpdateType } from '../const.js';
import { filter } from '../utils/filter';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000
};

export default class TripPresenter {

  #headerContainer = null;
  #container = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #filterModel = null;
  #sortComponent = null;
  #noPointComponent = null;
  #tripInfoComponent = null;
  #pointsListComponent = new ListPointsView();
  #loadingComponent = new LoadingView();
  #pointPresenters = new Map();
  #newPointPresenter = null;
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.EVERYTHING;
  #isLoading = true;
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });


  constructor({
    headerContainer,
    container,
    pointModel,
    offersModel,
    destinationsModel,
    filterModel,
    onNewPointDestroy}) {

    this.#headerContainer = headerContainer;
    this.#container = container;
    this.#pointsModel = pointModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#filterModel = filterModel;

    this.#newPointPresenter = new NewPointPresenter({
      pointListContainer: this.#pointsListComponent.element,
      onPointChange: this.#handleViewAction,
      onDestroy: onNewPointDestroy
    });

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);

    switch(this.#currentSortType) {
      case SortType.TIME:
        return filteredPoints.toSorted(sortTime);
      case SortType.PRICE:
        return filteredPoints.toSorted(sortPrice);
    }
    return filteredPoints.toSorted(sortDay);
  }

  get destinations() {
    return this.#destinationsModel.destinations;
  }

  get offers() {
    return this.#offersModel.offers;
  }

  init() {
    this.#renderTripBoard();
  }

  createPoint() {
    this.#currentSortType = SortType.DEFAULT;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init(this.offers, this.destinations);
  }

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };


  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // update - обновленные данные
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenters.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch (error) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;

      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch (error) {
          this.#newPointPresenter.setAborting();
        }
        break;

      case UserAction.DELETE_POINT:
        this.#pointPresenters.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch (error) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    // В зависимости от типа изменений решаем, что делать:
    // обновить часть списка (например, когда добавили в избранное)
    // обновить весь список (например, когда удалили точку)
    // обновить всю доску (например, при переключении фильтра)
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters?.get(data.id)?.init(data);
        remove(this.#tripInfoComponent);
        this.#renderTripInfo();
        break;
      case UpdateType.MINOR:
        this.#clearTripBoard();
        this.#renderTripBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearTripBoard({resetSortType: true});
        this.#renderTripBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderTripBoard();
        break;
    }
  };

  #handleSortFormChange = (sortType) => {

    if(this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearTripBoard();
    this.#renderTripBoard(true);
  };

  #renderTripInfo(sortChange) {

    if (!sortChange) {

      const points = this.points;
      const destinations = this.destinations;
      const offers = this.offers;

      this.#tripInfoComponent = new TripInfoView({
        points,
        destinations,
        offers
      });

    }

    render(this.#tripInfoComponent, this.#headerContainer, RenderPosition.AFTERBEGIN);
  }


  #renderSort() {
    this.#sortComponent = new ListSortView({
      currentSortType: this.#currentSortType,
      onSortFormChange: this.#handleSortFormChange
    });
    render(this.#sortComponent, this.#container);
  }


  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      offers: [...this.offers],
      destinations: [...this.destinations],
      pointListContainer: this.#pointsListComponent.element,
      onPointChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange
    });

    this.#pointPresenters.set(point.id, pointPresenter);
    pointPresenter.init(point);
  }

  #renderPointList(points) {
    points.forEach((point) => this.#renderPoint(point));
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#container);
  }

  #renderNoPoints() {

    this.#noPointComponent = new ListEmptyView({
      filterType: this.#filterType
    });

    render(this.#noPointComponent, this.#container);
  }


  #clearTripBoard({resetSortType = false} = {}) {

    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    remove(this.#tripInfoComponent);
    remove(this.#sortComponent);
    remove(this.#loadingComponent);

    if (this.#noPointComponent) {
      remove(this.#noPointComponent);
    }

    if(resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }

  }

  #renderTripBoard(sortChange = false) {

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    const pointCount = this.points.length;
    const destinationCount = this.destinations.length;
    const offerCount = this.offers.length;

    if (pointCount === 0 || destinationCount === 0 || offerCount === 0) {
      this.#renderNoPoints();
      return;
    }

    this.#renderTripInfo(sortChange);
    this.#renderSort();
    render(this.#pointsListComponent, this.#container);
    this.#renderPointList(this.points);
  }
}
