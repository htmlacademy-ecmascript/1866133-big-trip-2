import AbstractView from '../framework/view/abstract-view.js';

export default class ListPointsView extends AbstractView {
  get template() {
    return createListPointsTemplate();
  }
}

function createListPointsTemplate() {
  return (
    `
      <ul class="trip-events__list">
      </ul>
    `
  );
}
