const isEscapeKey = (evt) => evt.key === 'Escape';

const capitalizeFirstLetter = (word) => word.charAt(0).toUpperCase() + word.slice(1);

const updateItem = (points, updatedPoint) =>
  points.map((item) => item.id === updatedPoint.id ? updatedPoint : item);


export { isEscapeKey,
  capitalizeFirstLetter,
  updateItem };
