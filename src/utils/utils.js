const getRandomInteger = (a, b) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
};

const getRandomArrayElement = (array) => array[Math.floor(Math.random() * array.length)];

const isEscapeKey = (evt) => evt.key === 'Escape';

const capitalizeFirstLetter = (word) => word.charAt(0).toUpperCase() + word.slice(1);

export {
  getRandomInteger,
  getRandomArrayElement,
  isEscapeKey,
  capitalizeFirstLetter
};
