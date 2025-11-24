const isEscapeKey = (evt) => evt.key === 'Escape';

const capitalizeFirstLetter = (word) => word.charAt(0).toUpperCase() + word.slice(1);

export { isEscapeKey, capitalizeFirstLetter };
