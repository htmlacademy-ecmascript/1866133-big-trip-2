import { POINT_TYPES, getDefaultPoint } from '../const.js';
import { capitalizeFirstLetter } from '../utils/common.js';
import { conversionDate } from '../utils/event.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const formatOfferTitle = (title) => title.split(' ').join('-').toLowerCase();

export default class EditPointView extends AbstractStatefulView {

  #offers = null;
  #destinations = null;
  #handleFormSubmit = null;
  #handleDeleteClick = null;
  #handleEditClick = null;
  #datepickerFrom = null;
  #datepickerTo = null;

  constructor({point, offers, destinations, onFormSubmit, onDeleteButtonClick, onEditButtonClick}) {
    super();
    this.#offers = offers;
    this.#destinations = destinations;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleDeleteClick = onDeleteButtonClick;
    this.#handleEditClick = onEditButtonClick;
    this._setState(EditPointView.parsePointToState(point));

    this._restoreHandlers();
  }

  get template() {
    return createEditPointTemplate(this._state, this.#offers, this.#destinations);
  }

  removeElement() {
    super.removeElement();

    if(this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }

    if(this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  }

  reset(point) {
    this.updateElement(
      EditPointView.parsePointToState(point)
    );
  }

  _restoreHandlers() {
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);

    const rollupButton = this.element.querySelector('.event__rollup-btn');
    if(rollupButton) {
      rollupButton.addEventListener('click', this.#editClickHandler);
    }

    const priceInput = this.element.querySelector('.event__input--price');

    if(priceInput) {
      priceInput.addEventListener('input', this.#priceInputHandler);
    }

    this.element.querySelector('.event__type-group').addEventListener('change', this.#typeEventChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('input', this.#destinationChangeHandler);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formDeleteClickHandler);

    const offersContainer = this.element.querySelector('.event__available-offers');
    if(offersContainer) {
      offersContainer.addEventListener('change', this.#offersChangeHandler);
    }

    this.#setDatePicker();
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    const destinationInput = document.querySelector('.event__input--destination');
    const valideValues = this.#destinations.map((dest) => dest.name);
    if (valideValues.includes(destinationInput.value)) {
      this.#handleFormSubmit(EditPointView.parseStateToPoint(this._state));
    }
  };

  #editClickHandler = () => {
    this.#handleEditClick();
  };

  #formDeleteClickHandler = () => {
    this.#handleDeleteClick(EditPointView.parseStateToPoint(this._state));
  };

  #priceInputHandler = (evt) => {
    this._setState({...this._state, basePrice: +evt.target.value});
  };

  #typeEventChangeHandler = (evt) => {
    this.updateElement({...this._state, type: evt.target.value, offers: []});
  };

  #destinationChangeHandler = (evt) => {
    const selectedDestination = this.#destinations.find((dest) => dest.name === evt.target.value);

    if (selectedDestination) {
      this.updateElement({...this._state, destination: selectedDestination.id});
    }
  };

  #offersChangeHandler = () => {
    const checkedOfferIds = Array.from(
      this.element.querySelectorAll('.event__offer-checkbox:checked'))
      .map((element) => element.dataset.offerId);

    this._setState({...this._state, offers: checkedOfferIds});
  };

  #dateFromCloseHandler = ([userDate]) => {
    this._setState({...this._state, dateFrom: userDate});
    this.#datepickerTo.set('minDate', this._state.dateFrom);
  };

  #dateToCloseHandler = ([userDate]) => {
    this._setState({...this._state, dateTo: userDate});
  };

  #setDatePicker() {
    const [dateFromElement, dateToElement] = this.element.querySelectorAll('.event__input--time');

    const commonConfig = {
      dateFormat: 'd/m/y H:i',
      enableTime: true,
      locale: {firstDayOfWeek: 1},
      'time_24hr': true
    };

    this.#datepickerFrom = flatpickr(
      dateFromElement,
      { ...commonConfig,
        defaultDate: this._state.dateFrom,
        onClose: this.#dateFromCloseHandler
      }
    );

    this.#datepickerTo = flatpickr(
      dateToElement,
      { ...commonConfig,
        defaultDate: this._state.dateTo,
        onClose: this.#dateToCloseHandler,
        minDate: this._state.dateFrom
      }
    );

  }

  static parsePointToState = (point) => point;

  static parseStateToPoint(state){
    const point = {...state};
    return point;
  }
}


function createEditPointTemplate(point, offers, destinations) {
  const { dateFrom, dateTo, destination, type } = point;

  // все возможные предложения для данного типа точки
  const typeOffers = offers.find((offer) => offer.type === type).offers;

  // массив предложений для данной конкретной точки
  const pointOffers = typeOffers.filter((typeOffer) => point.offers.includes(typeOffer.id));

  const pointDestination = destinations.find((dest) => dest.id === destination) || getDefaultPoint();
  const { description, pictures } = pointDestination;
  const pointId = point.id || 0;

  const typesListHtml = POINT_TYPES.map((pointType) => (
    `<div class="event__type-item">
        <input
          id="event-type-${pointType}-${pointId}"
          class="event__type-input  visually-hidden"
          type="radio"
          name="event-type"
          value=${pointType}
          ${pointType === type ? 'checked' : ''}
        >
        <label
          class="event__type-label event__type-label--${pointType}"
          for="event-type-${pointType}-${pointId}"
          ${pointType === type ? 'checked' : ''}
        >
          ${capitalizeFirstLetter(pointType)}
        </label>
    </div> `
  ));

  const destinationOptionsHtml = destinations.map((dest) => `<option value=${dest.name}></option>`);


  const offersListHtml = typeOffers.length > 0
    ? `<section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
          ${typeOffers.map((typeOffer) => (
    `<div class="event__offer-selector">
              <input
                class="event__offer-checkbox  visually-hidden"
                id="event-offer-${formatOfferTitle(typeOffer.title)}-${pointId}"
                type="checkbox"
                name="event-offer-luggage"
                ${pointOffers.some((item) => item.id === typeOffer.id) ? 'checked' : ''}
                data-offer-id="${typeOffer.id}"
              >
              <label class="event__offer-label" for="event-offer-${formatOfferTitle(typeOffer.title)}-${pointId}">
                <span class="event__offer-title">${typeOffer.title}</span>
                &plus;&euro;&nbsp;
                <span class="event__offer-price">${typeOffer.price}</span>
              </label>
            </div>`
  )).join('')}
        </div>
      </section>`
    : '';

  const picturesListHtml = (pictures && pictures.length > 0)
    ? pictures.map((picture) =>
      `<img
        class="event__photo"
        src='${picture.src}'
        alt='${picture.description}'
      >`)
    : '';


  return (
    `
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post" autocomplete="off">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-${pointId}">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${pointId}" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${typesListHtml.join('')}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label
              class="event__label event__type-output"
              for="event-destination-${pointId}"
            >
              ${capitalizeFirstLetter(type)}
            </label>
            <input
              class="event__input event__input--destination"
              id="event-destination-${pointId}"
              type="text"
              name="event-destination"
              value='${pointDestination.name ? pointDestination.name : ''}'
              list="destination-list-${pointId}"
              required
            >
            <datalist id="destination-list-${pointId}">
              ${destinationOptionsHtml.join('')}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-${pointId}">From</label>
            <input
              class="event__input  event__input--time"
              id="event-start-time-${pointId}"
              type="text"
              name="event-start-time"
              /*value="${conversionDate(dateFrom, 'calendar-date')} ${conversionDate(dateFrom, 'only-time')}"*/
              value="${dateFrom ? `${conversionDate(dateFrom, 'calendar-date')} ${conversionDate(dateFrom, 'only-time')}` : ''}"

            >
            &mdash;
            <label class="visually-hidden" for="event-end-time-${pointId}">To</label>
            <input
              class="event__input  event__input--time"
              id="event-end-time-${pointId}"
              type="text"
              name="event-end-time"
              value="${dateTo ? `${conversionDate(dateTo, 'calendar-date')} ${conversionDate(dateTo, 'only-time')}` : ''}"

            >
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-${pointId}">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input
              class="event__input  event__input--price"
              id="event-price-${pointId}"
              type="number"
              min="1"
              name="event-price"
              value=${point.basePrice}>
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">${pointDestination.name ? 'Delete' : 'Cansel'}</button>
          ${pointDestination.name ? (`<button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>`)
      : ''}
        </header>
        <section class="event__details">
          ${offersListHtml}

          ${pointDestination.description ? (
      `<section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${description}</p>
            ${pictures && pictures.length > 0 ? (
        `<div class="event__photos-container">
                <div class="event__photos-tape">
                  ${picturesListHtml.join('')}
                </div>
            </div>`)
        : ''}
          </section>`)
      : ''}
        </section>
      </form>
    </li>
    `
  );
}
