import dayjs from 'dayjs';


const isEventExpired = (dueDate) => dueDate && dayjs().isAfter(dueDate, 'D');
const isEventToday = (dueDate) => dueDate && dayjs().isSame(dueDate, 'D');

export { isEventExpired, isEventToday };
