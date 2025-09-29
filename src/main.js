import Presenter from './presenter/presenter';
import { render } from './render';
import ListFilterView from './view/list-filter-view';

const headerElement = document.querySelector('.page-header');
const filtersContainer = headerElement.querySelector('.trip-controls__filters');

const mainElement = document.querySelector('.page-main');
const tripEventsContainer = mainElement.querySelector('.trip-events');

const presenter = new Presenter({container: tripEventsContainer});

render(new ListFilterView(), filtersContainer);

presenter.init();
