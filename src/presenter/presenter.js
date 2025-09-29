import {render} from '../render';
import ListSortView from '../view/list-sort-view';
import ListPointsView from '../view/list-points-view';
import EditPointView from '../view/edit-point-view';
import PointView from '../view/point-view';

export default class Presenter {

  sortComponent = new ListSortView();
  listComponent = new ListPointsView();

  constructor({container}) {
    this.container = container;
  }

  init() {

    render(this.sortComponent, this.container);
    render(this.listComponent, this.container);
    render(new EditPointView(), this.listComponent.getElement());

    for (let i = 0; i < 3; i++) {
      render(new PointView(), this.listComponent.getElement());
    }
  }
}
