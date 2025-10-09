import PointModel from './model/points-model';
import OffersModel from './model/offers-model';
import DestinationsModel from './model/destinations-model';
import TripPresenter from './presenter/trip-presenter';
import { render } from './render';
import ListFilterView from './view/list-filter-view';

const headerElement = document.querySelector('.page-header');
const filtersContainer = headerElement.querySelector('.trip-controls__filters');

const mainElement = document.querySelector('.page-main');
const tripEventsContainer = mainElement.querySelector('.trip-events');

const pointModel = new PointModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();

pointModel.init();
offersModel.init();
destinationsModel.init();

const tripPresenter = new TripPresenter({
  container: tripEventsContainer,
  pointModel: pointModel,
  offersModel: offersModel,
  destinationsModel: destinationsModel
});

render(new ListFilterView(), filtersContainer);
tripPresenter.init();
