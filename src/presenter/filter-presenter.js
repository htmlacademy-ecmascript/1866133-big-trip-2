import { render, replace, remove } from '../framework/render.js';
import ListFilterView from '../view/list-filter-view';
import { filter } from '../utils/filter.js';
import { FilterType, UpdateType } from '../const.js';


export default class FilterPresenter {


  #filterContainer = null;
  #filterModel = null;
  #pointsModel = null;
  #filterComponent = null;

  constructor({filterContainer, filterModel, pointsModel}) {

    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#pointsModel = pointsModel;


    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const points = this.#pointsModel.points;

    return Object.values(FilterType).map((type) => ({
      type,
      count: filter[type](points).length
    }));
  }


  init() {

    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new ListFilterView({
      filters,
      currentFilterType: this.#filterModel.filter,
      handleFilterTypeChange: this.#handleFilterTypeChange
    });

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);

    remove(prevFilterComponent);
  }


  #handleModelEvent = () => {
    this.init();
  };


  #handleFilterTypeChange = (filterType) => {

    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };

}
