import { render, replace, remove } from '../framework/render';
import EditPointView from '../view/edit-point-view';
import PointView from '../view/point-view';
import { isEscapeKey } from '../utils/utils';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

export default class TripPresenter {

  #point = null;
  #offers = null;
  #destinations = null;
  #pointListContainer = null;
  #pointComponent = null;
  #pointEditComponent = null;
  #handlePointChange = null;
  #handleModeChange = null;
  #mode = Mode.DEFAULT;


  constructor({offers, destinations, pointListContainer, onPointChange, onModeChange}) {
    this.#offers = offers;
    this.#destinations = destinations;
    this.#pointListContainer = pointListContainer;
    this.#handlePointChange = onPointChange;
    this.#handleModeChange = onModeChange;
  }


  init(point) {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;


    this.#pointComponent = new PointView({
      point: this.#point,
      offers: this.#offers,
      destinations: this.#destinations,
      onEditButtonClick: this.#handleFormOpen,
      onFavoriteButtonClick: this.#handleFavoriteClick
    });

    this.#pointEditComponent = new EditPointView({
      point: this.#point,
      offers: this.#offers,
      destinations: this.#destinations,
      onFormSubmit: this.#handleFormSubmit,
      onEditButtonClick: this.#handleFormClose
    });

    if(prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#pointComponent, this.#pointListContainer);
      return;
    }

    if(this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if(this.#mode === Mode.EDITING) {
      replace(this.#pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  desrtroy() {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  }

  resetView() {
    if(this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToCard();
    }
  }

  #replaceCardToForm() {
    replace(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#onDocumentKeydown);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToCard() {
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#onDocumentKeydown);
    this.#mode = Mode.DEFAULT;
  }

  #handleFavoriteClick = () => {
    this.#handlePointChange({...this.#point, isFavorite: !this.#point.isFavorite});
  };

  #onDocumentKeydown = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      this.#replaceFormToCard();
    }
  };

  #handleFormOpen = () => {
    this.#replaceCardToForm();
  };

  #handleFormClose = () => {
    this.#replaceFormToCard();
    this.resetView();
  };

  #handleFormSubmit = (point) => {
    this.#handlePointChange(point);
    this.#replaceFormToCard();
    document.removeEventListener('keydown', this.#onDocumentKeydown);
  };
}
