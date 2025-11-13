import PointModel from './model/points-model';
import OffersModel from './model/offers-model';
import DestinationsModel from './model/destinations-model';
import FilterModel from './model/filter-model.js';
import TripPresenter from './presenter/trip-presenter';
import FilterPresenter from './presenter/filter-presenter.js';

const headerElement = document.querySelector('.page-header');
const newEventButton = headerElement.querySelector('.trip-main__event-add-btn');
const filtersContainer = headerElement.querySelector('.trip-controls__filters');
const mainElement = document.querySelector('.page-main');
const tripEventsContainer = mainElement.querySelector('.trip-events');

newEventButton.addEventListener('click', onNewEventButtonClick);

const pointModel = new PointModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();
const filterModel = new FilterModel();


pointModel.init();
offersModel.init();
destinationsModel.init();


const tripPresenter = new TripPresenter({
  container: tripEventsContainer,
  pointModel,
  offersModel,
  destinationsModel,
  filterModel,
  onNewPointDestroy: handleNewPointFormClose
});

const filterPresenter = new FilterPresenter({
  filterContainer: filtersContainer,
  filterModel,
  pointModel
});

function handleNewPointFormClose() {
  newEventButton.disabled = false;
}


function onNewEventButtonClick() {
  tripPresenter.createPoint();
  newEventButton.disabled = true;
}


filterPresenter.init();
tripPresenter.init();
