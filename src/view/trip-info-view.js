import AbstractView from '../framework/view/abstract-view';
import { DateFormat, conversionDate } from '../utils/event';

export default class TripInfoView extends AbstractView {

  #points = [];
  #destinations = [];
  #offers = [];

  constructor({points, destinations, offers}) {
    super();
    this.#points = points;
    this.#destinations = destinations;
    this.#offers = offers;
  }

  get template() {
    return createTripInfoTemplate(this.#points, this.#destinations, this.#offers);
  }
}

function createTripInfoTitle(points, destinations) {

  if(points.length > 3) {
    const firstCity = destinations.find((item) => item.id === points[0].destination).name;
    const lastCity = destinations.find((item) => item.id === points.at(-1).destination).name;

    return `${firstCity}&nbsp;&mdash;&nbsp;...&nbsp;&mdash;&nbsp;${lastCity}`;
  }

  return points.map((point) => destinations.find((dest) => dest.id === point.destination).name).join(' &mdash; ');
}

function getTripDuration(points) {
  let startDate = conversionDate(points[0].dateFrom, DateFormat.ShortDateReverse);
  const endDate = conversionDate(points.at(-1).dateTo, DateFormat.ShortDateReverse);

  if(startDate.slice(-3) === endDate.slice(-3)) {
    startDate = startDate.slice(0, 2);
  }

  return `${startDate} &mdash; ${endDate}`;
}

function getTotalPrice(points, offers) {
  const mainPrice = points.reduce((accum, point) => accum + point.basePrice, 0);

  let additionalPrice = 0;

  points.forEach((point) => {

    if(point.offers.length > 0) {
      const needOffer = offers.find((offer) => offer.type === point.type);
      const sum = point.offers
        .map((id) => needOffer.offers.find((offer) => offer.id === id))
        .map((item) => item.price)
        .reduce((accum, price) => accum + price, 0);

      additionalPrice += sum;
    }
  });

  return mainPrice + additionalPrice;
}

function createTripInfoTemplate(points, destinations, offers) {

  const tripInfoTitle = createTripInfoTitle(points, destinations);
  const tripDuration = getTripDuration(points);
  const totalPrice = getTotalPrice(points, offers);

  return (
    ` <section class="trip-main__trip-info  trip-info">
        <div class="trip-info__main">
          <h1 class="trip-info__title">${tripInfoTitle}</h1>

          <p class="trip-info__dates">${tripDuration}</p>
        </div>

        <p class="trip-info__cost">
          Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
        </p>
      </section>
    `
  );
}
