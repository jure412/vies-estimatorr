import { format } from 'date-fns';

export const formatDate = (date = new Date()) => format(date, 'dd.MM.yyyy');
