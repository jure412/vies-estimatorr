import { Pallet } from './types';

export const DEFAULT_PALLETS: {
  INDUSTRY: Pallet;
  EPAL: Pallet;
  CUSTOM: Partial<Pallet>;
} = {
  INDUSTRY: {
    type: 'INDUSTRY',
    length: 100,
    width: 120,
    height: 120,
    weight: 50,
  },
  EPAL: {
    type: 'EPAL',
    length: 120,
    width: 80,
    height: 120,
    weight: 50,
  },
  CUSTOM: {
    type: 'CUSTOM',
  },
};
