import { addDays } from 'date-fns';
import { has } from 'utils/has';
import {
  Country,
  Location,
  Spreadsheets,
  DeliveryValues,
  Sheets,
} from './types';

export function hasToday() {
  const timeZone = 'Europe/Madrid';
  const cetString = new Date().toLocaleString('en', { timeZone });
  const cetDate = new Date(cetString);

  return cetDate.getHours() <= 13;
}

export function getMaxLeadTimes(
  leadTimesA?: DeliveryValues,
  leadTimesB?: DeliveryValues
) {
  return leadTimesA && leadTimesB
    ? leadTimesA.standard > leadTimesB.standard
      ? leadTimesA
      : leadTimesB
    : undefined;
}

export function getLocationLDMPrices({
  spreadsheets,
  ldm,
  fromLocation,
  toLocation,
}: {
  spreadsheets: Spreadsheets;
  ldm: number;
  fromLocation: Location;
  toLocation: Location;
}) {
  const fromData = spreadsheets[fromLocation.country];
  const toData = spreadsheets[toLocation.country];
  const fromPrefix = getZipPrefix(fromLocation.country, fromLocation.zip);
  const toPrefix = getZipPrefix(toLocation.country, toLocation.zip);

  if (has(fromData) && has(toData) && has(fromPrefix) && has(toPrefix)) {
    const fromPrice = getPrice(fromData, ldm, fromPrefix);
    const toPrice = getPrice(toData, ldm, toPrefix);

    if (has(fromPrice) && has(toPrice)) {
      return getPrices({ fromPrice, toPrice });
    }
  }
}

export function getLeadTimesFromLocation(
  spreadsheets?: Spreadsheets,
  location?: Location
) {
  if (has(spreadsheets) && has(location)) {
    const country = location.country;
    const zipPrefix = getZipPrefix(country, location.zip);

    if (spreadsheets[country] && zipPrefix) {
      return getLeadTimes({
        spreadsheets: spreadsheets[country],
        zipPrefix,
      });
    }
  }
}

export function getLocationSelectorCountry(
  country?: Country
): Country | Array<Country> {
  const defaultCountry: Array<Country> = ['it', 'si'];
  const countryMap = { si: 'it', it: 'si' };
  return country ? (countryMap[country] as Country) : defaultCountry;
}

const MULTIPLIER_ECONOMY =
  process.env.REACT_APP_DELIVERY_PRICE_MULTIPLIER_ECONOMY;
const MULTIPLIER_STANDARD =
  process.env.REACT_APP_DELIVERY_PRICE_MULTIPLIER_STANDARD;
const MULTIPLIER_EXPRESS =
  process.env.REACT_APP_DELIVERY_PRICE_MULTIPLIER_EXPRESS;

function getPrices({
  fromPrice,
  toPrice,
}: {
  fromPrice: number;
  toPrice: number;
}) {
  const totalPrice = fromPrice + toPrice;
  const prices = {
    economy: totalPrice * Number(MULTIPLIER_ECONOMY),
    standard: totalPrice * Number(MULTIPLIER_STANDARD),
    express: totalPrice * Number(MULTIPLIER_EXPRESS),
  };

  if (
    Object.keys(prices).every(key => !isNaN(prices[key as keyof typeof prices]))
  ) {
    return prices;
  }
}

function getPrice(data: Sheets, ldm: number, prefix: string): Maybe<number> {
  const { zips, prices } = data;
  let priceZoneIndex: Maybe<number>;
  let price: Maybe<number>;

  for (let row of zips) {
    const [zone, zipsString] = row;
    const zips = zipsString.split(/,\s?/);

    if (zips.includes(prefix)) {
      priceZoneIndex = prices[0].indexOf(zone);
      break;
    }
  }

  if (!priceZoneIndex) {
    return;
  }

  for (let row of prices) {
    const rowLdm = row[0];

    if ((rowLdm && rowLdm === 'FTL') || Number(rowLdm) >= ldm) {
      price = Number(row[priceZoneIndex]);
      break;
    }
  }

  return price;
}

function getZipPrefix(country: string, zip: string) {
  switch (country) {
    case 'it':
      return zip.slice(0, 2);
    case 'si':
      return zip.slice(0, 1);
    default:
      return null;
  }
}

function getLeadTimes({
  spreadsheets,
  zipPrefix,
}: {
  spreadsheets: Sheets;
  zipPrefix: string;
}) {
  const { zips: zipSheet, leadTimes: deliverySheet } = spreadsheets;
  let priceZone: Maybe<string>;
  let leadTimes: Maybe<DeliveryValues>;

  for (let row of zipSheet) {
    const [zone, zipsString] = row;
    const zips = zipsString.split(/,\s?/);

    if (zips.includes(zipPrefix)) {
      priceZone = zone;
      break;
    }
  }

  for (let row of deliverySheet) {
    const [zone, economy, standard, express] = row;

    if (zone === priceZone) {
      leadTimes = {
        economy: Number(economy),
        standard: Number(standard),
        express: Number(express),
      };
      break;
    }
  }

  return leadTimes;
}

export const futureDate = (days: number) => addDays(new Date(), days);

export const leadDate = (date = new Date(), leadHours: number) => {
  return addDays(date, leadHours / 24);
};
