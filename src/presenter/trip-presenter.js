import { render, replace } from '../framework/render';
import ListSortView from '../view/list-sort-view';
import ListPointsView from '../view/list-points-view';
import EditPointView from '../view/edit-point-view';
import PointView from '../view/point-view';
import { isEscapeKey } from '../utils';

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


  #renderTripBoard() {
    render(this.#sortComponent, this.#container);
    render(this.#pointsListComponent, this.#container);

    for (const point of this.#points) {
      this.#renderPoint(point, this.#offers, this.#destinations);
    }
  }


  #renderPoint(point, offers, destinations) {
    const onDocumentKeydown = (evt) => {
      if (isEscapeKey(evt)) {
        evt.preventDefault();
        replaceFormToCard();
        document.removeEventListener('keydown', onDocumentKeydown);
      }
    };

    const pointComponent = new PointView({
      point,
      offers,
      destinations,
      onEditButtonClick: () => {
        replaceCardToForm();
        document.addEventListener('keydown', onDocumentKeydown);
      }
    });

    const pointEditComponent = new EditPointView({
      point,
      offers,
      destinations,
      onFormSubmit: () => {
        replaceFormToCard();
        document.removeEventListener('keydown', onDocumentKeydown);
      },
      onEditButtonClick: () => {
        replaceFormToCard();
        document.removeEventListener('keydown', onDocumentKeydown);
      }
    });

    function replaceCardToForm() {
      replace(pointEditComponent, pointComponent);
    }

    function replaceFormToCard() {
      replace(pointComponent, pointEditComponent);
    }

    render(pointComponent, this.#pointsListComponent.element);
  }
}


