
const updateItem = (points, updatedPoint) =>
  points.map((item) => item.id === updatedPoint.id ? updatedPoint : item);


export { updateItem };
