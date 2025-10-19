import AbstractView from '../framework/view/abstract-view.js';

export default class ListEmptyView extends AbstractView {
  get template() {
    return createListEmptyTemplate();
  }
}

function createListEmptyTemplate() {
  return (
    `<p class="trip-events__msg">
      Click New Event to create your first point
    </p>`
  );
}
