import numeral from 'numeral';

export const formatPrice = (price: number) => numeral(price).format('00.00');
