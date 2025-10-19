import { POINT_TYPES } from '../const.js';
import { capitalizeFirstLetter, conversionDate } from '../utils/utils.js';
import AbstractView from '../framework/view/abstract-view.js';

const formatOfferTitle = (title) => title.split(' ').join('-').toLowerCase();

export default class EditPointView extends AbstractView {

  #point = null;
  #offers = null;
  #destinations = null;
  #handleFormSubmit = null;
  #handleEditClick = null;

  constructor({point, offers, destinations, onFormSubmit, onEditButtonClick}) {
    super();
    this.#point = point;
    this.#offers = offers;
    this.#destinations = destinations;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleEditClick = onEditButtonClick;

    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
  }

  get template() {
    return createEditPointTemplate(this.#point, this.#offers, this.#destinations);
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit();
  };

  #editClickHandler = () => {
    this.#handleEditClick();
  };
}


function createEditPointTemplate(point, offers, destinations) {
  const { basePrice, dateFrom, dateTo, destination, type } = point;

  // все возможные предложения для данного типа точки
  const typeOffers = offers.find((offer) => offer.type === type).offers;

  // массив предложений для данной конкретной точки
  const pointOffers = typeOffers.filter((typeOffer) => point.offers.includes(typeOffer.id));

  const pointDestination = destinations.find((dest) => dest.id === destination);
  const { description, pictures } = pointDestination || {};
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

  const destinationOptionsHtml = destinations.map((dest) => (
    `<option value=${dest.name}></option>`
  ));

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

  const picturesListHtml = pictures.map((picture) => `
      <img
        class="event__photo"
        src='${picture.src}'
        alt='${picture.description}'
      >
  `);

  return (
    `
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
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
              class="event__label  event__type-output"
              for="event-destination-${pointId}"
            >
              ${capitalizeFirstLetter(type)}
            </label>
            <input
              class="event__input  event__input--destination"
              id="event-destination-${pointId}"
              type="text" name="event-destination"
              value=${destination}
              list="destination-list-${pointId}"
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
              value="${conversionDate(dateFrom, 'calendar-date')} ${conversionDate(dateFrom, 'only-time')}"
            >
            &mdash;
            <label class="visually-hidden" for="event-end-time-${pointId}">To</label>
            <input
              class="event__input  event__input--time"
              id="event-end-time-${pointId}"
              type="text"
              name="event-end-time"
              value="${conversionDate(dateTo, 'calendar-date')} ${conversionDate(dateTo, 'only-time')}"
            >
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-${pointId}">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-${pointId}" type="text" name="event-price" value=${basePrice}>
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          ${offersListHtml}

          ${pointDestination ? (
      `<section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${description}</p>
            ${pictures.length > 0 ? (
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
