import { render } from '../render';
import ListSortView from '../view/list-sort-view';
import ListPointsView from '../view/list-points-view';
import EditPointView from '../view/edit-point-view';
import PointView from '../view/point-view';
//import { getDefaultPoint } from '../const';

export default class TripPresenter {

  sortComponent = new ListSortView();
  pointsListComponent = new ListPointsView();

  constructor({container, pointModel, offersModel, destinationsModel}) {
    this.container = container;
    this.pointModel = pointModel;
    this.offersModel = offersModel;
    this.destinationsModel = destinationsModel;
  }

  init() {
    const points = this.pointModel.getPoints();
    const offers = this.offersModel.getOffers();
    const destinations = this.destinationsModel.getDestinations();

    render(this.sortComponent, this.container);
    render(this.pointsListComponent, this.container);
    //render(new EditPointView(getDefaultPoint(), destinations, offers), this.pointsListComponent.getElement());
    render(new EditPointView(points[1], offers, destinations), this.pointsListComponent.getElement());

    for (const point of points) {
      render(new PointView(point, offers, destinations), this.pointsListComponent.getElement());
    }
  }
}
