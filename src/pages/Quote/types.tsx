export type Country = 'it' | 'si';

export type Spreadsheets = {
  [country: string]: Sheets;
};

export type Sheets = {
  zips: Array<Array<string>>;
  prices: Array<Array<string>>;
  leadTimes: Array<Array<string>>;
};

export type Location = {
  zip: string;
  place: string;
  country: Country;
};

export type DeliveryValues = {
  economy: number;
  standard: number;
  express: number;
};

export type DeliveryDates = {
  economy: Date;
  standard: Date;
  express: Date;
};

export type Pallet = {
  type: string;
  length: number;
  width: number;
  height: number;
  weight: number;
};

export type QuoteData = {
  from: string;
  to: string;
  space: 'FTL' | 'LTL';
  volume: {
    type: 'known' | 'unknown';
    ldm?: number;
    weight?: number;
    pallets?: Array<Pallet>;
  };
  pickup: {
    type:
      | 'today'
      | 'tomorrow'
      | 'days2'
      | 'days3'
      | 'days4'
      | 'days5'
      | 'other';
    date: Date;
  };
  delivery: {
    type: 'economy' | 'standard' | 'express';
    dates: DeliveryDates;
  };
  prices: DeliveryValues;
};
