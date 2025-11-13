import {remove, render, RenderPosition} from '../framework/render.js';
import EditPointView from '../view/edit-point-view.js';
import {UserAction, UpdateType, getDefaultPoint} from '../const.js';
import {isEscapeKey} from '../utils/common.js';


export default class NewPointPresenter {

  #pointListContainer = null;
  #handlePointChange = null;
  #handleDestroy = null;
  #pointEditComponent = null;


  constructor({pointListContainer, onPointChange, onDestroy}) {

    this.#pointListContainer = pointListContainer;
    this.#handlePointChange = onPointChange;
    this.#handleDestroy = onDestroy;
  }

  init(offers, destinations) {

    if (this.#pointEditComponent !== null) {
      return;
    }

    this.#pointEditComponent = new EditPointView({
      point: getDefaultPoint(),
      offers: offers,
      destinations: destinations,
      onFormSubmit: this.#handleFormSubmit,
      onDeleteButtonClick: this.#handleDeleteClick
    });

    render(this.#pointEditComponent, this.#pointListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#onDocumentKeydown);
  }

  destroy() {

    if (this.#pointEditComponent === null) {
      return;
    }

    this.#handleDestroy();
    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;
    document.removeEventListener('keydown', this.#onDocumentKeydown);
  }

  #handleFormSubmit = (point) => {

    this.#handlePointChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      // Пока у нас нет сервера, который бы после сохранения
      // выдывал честный id задачи, нам нужно позаботиться об этом самим
      {id: new Date(), ...point},
    );

    this.destroy();
  };

  #handleDeleteClick = () => {
    this.destroy();
  };


  #onDocumentKeydown = (evt) => {

    if (isEscapeKey(evt)) {
      evt.preventDefault();
      this.destroy();
    }

  };
}
