import PointsModel from './model/points-model.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destinations-model.js';
import FilterModel from './model/filter-model.js';
import TripPresenter from './presenter/trip-presenter';
import FilterPresenter from './presenter/filter-presenter.js';
import PointsApiService from './points-api-service.js';

const AUTHORIZATION = 'Basic zf7H3yVbQ2mD0v9s8';
const END_POINT = 'https://22.objects.htmlacademy.pro/big-trip';

const headerElement = document.querySelector('.page-header');
const tripMainContainer = headerElement.querySelector('.trip-main');
const newEventButton = tripMainContainer.querySelector('.trip-main__event-add-btn');
const filtersContainer = tripMainContainer.querySelector('.trip-controls__filters');
const mainElement = document.querySelector('.page-main');
const tripEventsContainer = mainElement.querySelector('.trip-events');

newEventButton.addEventListener('click', onNewEventButtonClick);

const pointsApiService = new PointsApiService(END_POINT, AUTHORIZATION);

const offersModel = new OffersModel({pointsApiService});
const destinationsModel = new DestinationsModel({pointsApiService});
const pointsModel = new PointsModel({
  pointsApiService,
  offersModel,
  destinationsModel,
  newEventButton
});

const filterModel = new FilterModel();


const tripPresenter = new TripPresenter({
  headerContainer: tripMainContainer,
  container: tripEventsContainer,
  pointsModel,
  offersModel,
  destinationsModel,
  filterModel,
  handleNewPointFormClose
});

const filterPresenter = new FilterPresenter({
  filterContainer: filtersContainer,
  filterModel,
  pointsModel
});

function handleNewPointFormClose() {
  newEventButton.disabled = false;
}


function onNewEventButtonClick() {
  tripPresenter.createPoint();
  newEventButton.disabled = true;
}

pointsModel.init();
filterPresenter.init();
tripPresenter.init();
