import { Location, Spreadsheets, QuoteData, Pallet } from './types';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { useHistory, useLocation } from 'react-router-dom';
import useSWR from 'swr';
import { useDebounce } from 'use-debounce';
import DatePicker from 'react-datepicker';
import { ReactComponent as SpaceIcon } from 'assets/icons/space.svg';
import { ReactComponent as PickupIcon } from 'assets/icons/pickup.svg';
import { ReactComponent as DeliveryIcon } from 'assets/icons/delivery.svg';
import { ReactComponent as DeliveryExpressIcon } from 'assets/icons/delivery-express.svg';
import { ReactComponent as DeliveryStandardIcon } from 'assets/icons/delivery-standard.svg';
import { ReactComponent as DeliveryEconomyIcon } from 'assets/icons/delivery-economy.svg';
import { ReactDatePickerStyle } from 'styles/ReactDatePickerStyle';
import { useStickyValue } from 'hooks/useStickyValue';
import { formatDate } from 'utils/date';
import { formatPrice } from 'utils/price';
import { has } from 'utils/has';
import { PageLoader } from 'components/PageLoader';
import { Box } from 'components/Box';
import { Flex } from 'components/Flex';
import { Heading } from 'components/Heading';
import { Form } from 'components/Form';
import { Label } from 'components/Label';
import { Input } from 'components/Input';
import { Radio } from 'components/Radio';
import { Button } from 'components/Button';
import { Text } from 'components/Text';
import { Main } from 'components/Main';
import { Footer } from 'components/Footer';
import { Error } from 'components/Error';
import { DEFAULT_PALLETS } from './constants';
import { LocationSelector } from './LocationSelector';
import { PalletTable, PalletTableRow } from './PalletTable';
import {
  hasToday,
  getMaxLeadTimes,
  getLocationLDMPrices,
  getLeadTimesFromLocation,
  getLocationSelectorCountry,
  futureDate,
  leadDate,
} from './utils';

const MAX_LDM = 12;
const WEIGHT_PER_LDM = 1500;

const DATE = {
  TODAY: new Date(),
  TOMORROW: futureDate(1),
  DAYS2: futureDate(2),
  DAYS3: futureDate(3),
  DAYS4: futureDate(4),
  DAYS5: futureDate(5),
};

const ERROR = {
  MISSING_REQUIRED_FIELDS:
    'We were unable to submit the form due to missing delivery or price information.',
  LOCATION_UNMATCHED: [
    'Sorry, we are unable to match your location information in our system.',
    'Please contact us to place your order.',
  ].join(' '),
};

const DEFAULT_DATA = {
  pickup: { type: 'days3' },
  delivery: { type: 'standard' },
  // Force FTL with `9999` (not very explicit but will do for MVP)
  volume: { type: 'known', ldm: 9999 },
};

type DateKey = keyof typeof DATE;

export const Quote: React.FC = () => {
  const history = useHistory();
  const { state } = useLocation();
  const query = useSWR<Spreadsheets>('/api/country-data');
  const { data: spreadsheets, isValidating, error: spreadsheetsError } = query;
  const [error, setError] = useState<Maybe<string>>();

  const [pickupOtherDate, setPickupOtherDate] = useState<Maybe<Date>>(() => {
    const pickup = state?.quote?.pickup || {};
    return pickup.type === 'other' ? pickup.date : undefined;
  });

  const [fromLocation, setFromLocation] = useState<Maybe<Location>>(
    state?.quote?.from
  );

  const [toLocation, setToLocation] = useState<Maybe<Location>>(
    state?.quote?.to
  );

  const [data, setData] = useState<DeepPartial<QuoteData>>(
    state?.quote || DEFAULT_DATA
  );

  // prevent unnecessary requests for ldm prices
  const stickyLdm = useStickyValue(data.volume?.ldm);
  const [ldm] = useDebounce(stickyLdm, 200);
  const isLoading = isValidating && !spreadsheets;
  const isPickupOther = data.pickup?.type === 'other';
  const canDeletePallet =
    data.volume?.pallets && data.volume.pallets.length > 1;

  const validateLocation = useCallback(
    location => {
      if (
        has(spreadsheets) &&
        has(location) &&
        !spreadsheets[location.country]
      ) {
        setError(ERROR.LOCATION_UNMATCHED);
      }
    },
    [spreadsheets]
  );

  useEffect(() => {
    if (has(spreadsheets) && has(ldm) && has(fromLocation) && has(toLocation)) {
      const prices = getLocationLDMPrices({
        spreadsheets,
        ldm,
        fromLocation,
        toLocation,
      });

      if (prices) {
        setData(prevData => ({ ...prevData, prices }));
      } else {
        setError(ERROR.LOCATION_UNMATCHED);
      }
    }
  }, [spreadsheets, ldm, fromLocation, toLocation]);

  const fromLeadTimes = useMemo(
    () => getLeadTimesFromLocation(spreadsheets, fromLocation),
    [spreadsheets, fromLocation]
  );

  const toLeadTimes = useMemo(
    () => getLeadTimesFromLocation(spreadsheets, toLocation),
    [spreadsheets, toLocation]
  );

  const leadTimes = getMaxLeadTimes(fromLeadTimes, toLeadTimes);
  const dateKey = (data.pickup?.type as string).toUpperCase() as DateKey;
  const pickupDate = isPickupOther ? pickupOtherDate : DATE[dateKey];
  const isValid = has(data.prices);
  let deliveryDates: Maybe<QuoteData['delivery']['dates']>;

  if (leadTimes) {
    const { economy, standard, express } = leadTimes;
    const date = pickupDate || futureDate(6);

    deliveryDates = {
      economy: leadDate(date, economy),
      standard: leadDate(date, standard),
      express: leadDate(date, express),
    };
  }

  function handlePalletDeleteClick(deleteIndex: number) {
    if (canDeletePallet) {
      setData(prevData => {
        const prevPallets = prevData.volume?.pallets as Array<Pallet>;
        const pallets = prevPallets.filter((_, index) => index !== deleteIndex);
        return { ...prevData, volume: { ...prevData.volume, pallets } };
      });
    }
  }

  function handlePalletAddClick() {
    setData(prevData => {
      const prevPallets = prevData?.volume?.pallets;
      const pallet = { type: 'INDUSTRY', ...DEFAULT_PALLETS.INDUSTRY };
      const pallets = [...prevPallets, pallet];
      return { ...prevData, volume: { ...prevData.volume, pallets } };
    });
  }

  function handleFormChange({ data }: { data: unknown }) {
    const quote = data as QuoteData;
    const value = quote?.volume?.ldm;
    let ldm = value && Math.min(value, MAX_LDM);
    let pallets: QuoteData['volume']['pallets'];

    if (quote.volume?.type === 'unknown' && !quote.volume.pallets) {
      pallets = [{ type: 'INDUSTRY', ...DEFAULT_PALLETS.INDUSTRY }];
    }

    if (quote.volume?.type === 'known' && ldm && quote.volume?.weight) {
      const weightLdm = quote.volume.weight / WEIGHT_PER_LDM;
      const weightMaxLdm = Math.min(weightLdm, MAX_LDM);

      if (weightMaxLdm > ldm) {
        ldm = weightLdm;
      }
    }

    setData(prevData => ({
      ...prevData,
      ...quote,
      volume: {
        pallets,
        ...quote.volume,
        ldm,
      },
    }));
  }

  function handleSubmit() {
    setError(undefined);

    if (!isValid) {
      setError(ERROR.MISSING_REQUIRED_FIELDS);
      return;
    }

    const quote = {
      ...data,
      from: fromLocation,
      to: toLocation,
      pickup: { ...data.pickup, date: pickupDate },
      delivery: { ...data.delivery, dates: deliveryDates },
    };

    history.push('/delivery', { quote });
  }

  useEffect(() => validateLocation(fromLocation), [
    validateLocation,
    fromLocation,
  ]);

  useEffect(() => validateLocation(toLocation), [validateLocation, toLocation]);

  return isLoading ? (
    <PageLoader />
  ) : (
    <StyledForm onSubmit={handleSubmit} onChange={handleFormChange}>
      <Main>
        {has(error) && <Error>{error}</Error>}
        {spreadsheetsError ? (
          <Error>
            We're currently down for maintenance. Please try again later.
          </Error>
        ) : (
          <Box margin={[0, 'auto']} maxWidth={900}>
            <Heading size="xlarge">
              Calculate your delivery cost and timeframe
            </Heading>

            <Flex direction="row" spacing={['small', 'small']}>
              <StyledLabel text="From">
                <LocationSelector
                  country={getLocationSelectorCountry(toLocation?.country)}
                  selection={fromLocation}
                  required
                  onSelectionChange={location => {
                    setFromLocation(location);
                    setError(undefined);
                  }}
                />
              </StyledLabel>
              <StyledLabel text="To">
                <LocationSelector
                  country={getLocationSelectorCountry(fromLocation?.country)}
                  selection={toLocation}
                  required
                  onSelectionChange={location => {
                    setToLocation(location);
                    setError(undefined);
                  }}
                />
              </StyledLabel>
            </Flex>

            <HeadingSeparator icon="space">
              How much space do you need?
            </HeadingSeparator>
            <RadioList direction="row" margin={[0, 0, 'medium']}>
              <RadioListItem
                name="space"
                value="FTL"
                required
                checked={data.space === 'FTL'}
                onChange={() => {
                  setData(prevData => ({
                    ...prevData,
                    volume: { ...prevData.volume, ldm: 9999 },
                  }));
                }}
              >
                <TruckImage type="FTL" selected={data.space === 'FTL'} />
                <Text weight="medium">Full truckload (FTL)</Text>
              </RadioListItem>
              <RadioListItem
                name="space"
                value="LTL"
                required
                checked={data.space === 'LTL'}
                onChange={() => {
                  setData(prevData => ({
                    ...prevData,
                    volume: { ...prevData.volume, ldm: 0.5 },
                  }));
                }}
              >
                <TruckImage type="LTL" selected={data.space === 'LTL'} />
                <Text weight="medium">Less than truckload (LTL)</Text>
              </RadioListItem>
            </RadioList>

            {data.space === 'LTL' && (
              <>
                <RadioList margin={[0, 0, 'medium']}>
                  <RadioListItem
                    name="volume[type]"
                    value="known"
                    defaultChecked={data.volume?.type === 'known'}
                    small
                    required
                  >
                    <Text weight="medium">I know exact volume I need</Text>
                  </RadioListItem>
                  <RadioListItem
                    name="volume[type]"
                    value="unknown"
                    defaultChecked={data.volume?.type === 'unknown'}
                    small
                    required
                  >
                    <Text weight="medium">
                      I don't know how much volume I need
                    </Text>
                  </RadioListItem>
                </RadioList>

                {data.volume?.type === 'known' && (
                  <Flex direction="row" spacing={['small', 'small']}>
                    <StyledLabel text="Loading meters needed">
                      <Input
                        name="volume[ldm]"
                        type="number"
                        value={data.volume?.ldm || ''}
                        onChange={() => {}}
                        pattern="[0-9]+"
                        min="0"
                        max="12"
                        step="0.1"
                        required
                      />
                    </StyledLabel>
                    <StyledLabel text="Estimated weight (kg)">
                      <Input
                        name="volume[weight]"
                        type="number"
                        pattern="[0-9]+"
                        maxLength={5}
                        required
                      />
                    </StyledLabel>
                  </Flex>
                )}

                {data.volume?.type === 'unknown' && (
                  <PalletTable
                    onAddRowClick={handlePalletAddClick}
                    onLdmChange={ldm => {
                      setData(prevData => ({
                        ...prevData,
                        volume: { ...prevData.volume, ldm },
                      }));
                    }}
                  >
                    {data.volume.pallets &&
                      data.volume.pallets.map((pallet, index, pallets) => (
                        <PalletTableRow
                          key={index}
                          name={`volume[pallets][${index}]`}
                          defaultValue={pallet as Pallet}
                          onDeleteClick={
                            canDeletePallet
                              ? () => handlePalletDeleteClick(index)
                              : undefined
                          }
                        />
                      ))}
                  </PalletTable>
                )}
              </>
            )}

            {data.space && has(data.prices) && (
              <>
                <HeadingSeparator icon="pickup">
                  Choose your pickup date
                </HeadingSeparator>
                <ReactDatePickerStyle
                  as={RadioList}
                  direction="row"
                  spacing={[0, 'small']}
                >
                  {hasToday() && (
                    <RadioListItem
                      name="pickup[type]"
                      value="today"
                      defaultChecked={data.pickup?.type === 'today'}
                      fill
                      small
                    >
                      <PickupText weight="medium">Today</PickupText>
                      <PickupText font="tiny">
                        {formatDate(DATE.TODAY)}
                      </PickupText>
                    </RadioListItem>
                  )}
                  <RadioListItem
                    name="pickup[type]"
                    value="tomorrow"
                    defaultChecked={data.pickup?.type === 'tomorrow'}
                    fill
                    small
                  >
                    <PickupText weight="medium">Tomorrow</PickupText>
                    <PickupText font="tiny">
                      {formatDate(DATE.TOMORROW)}
                    </PickupText>
                  </RadioListItem>
                  <RadioListItem
                    name="pickup[type]"
                    value="days2"
                    defaultChecked={data.pickup?.type === 'days2'}
                    fill
                    small
                  >
                    <PickupText weight="medium">In 2 days</PickupText>
                    <PickupText font="tiny">
                      {formatDate(DATE.DAYS2)}
                    </PickupText>
                  </RadioListItem>
                  <RadioListItem
                    name="pickup[type]"
                    value="days3"
                    defaultChecked={data.pickup?.type === 'days3'}
                    fill
                    small
                  >
                    <PickupText weight="medium">In 3 days</PickupText>
                    <PickupText font="tiny">
                      {formatDate(DATE.DAYS3)}
                    </PickupText>
                  </RadioListItem>
                  <RadioListItem
                    name="pickup[type]"
                    value="days4"
                    defaultChecked={data.pickup?.type === 'days4'}
                    fill
                    small
                  >
                    <PickupText weight="medium">In 4 days</PickupText>
                    <PickupText font="tiny">
                      {formatDate(DATE.DAYS4)}
                    </PickupText>
                  </RadioListItem>
                  <RadioListItem
                    name="pickup[type]"
                    value="days5"
                    defaultChecked={data.pickup?.type === 'days5'}
                    fill
                    small
                  >
                    <PickupText weight="medium">In 5 days</PickupText>
                    <PickupText font="tiny">
                      {formatDate(DATE.DAYS5)}
                    </PickupText>
                  </RadioListItem>
                  <DatePicker
                    selected={pickupOtherDate}
                    minDate={futureDate(6)}
                    popperPlacement="bottom-end"
                    customInput={
                      <div>
                        <OtherRadioListItem
                          name="pickup[type]"
                          value="other"
                          defaultChecked={data.pickup?.type === 'other'}
                          fill
                          small
                        >
                          <PickupText weight="medium">Other</PickupText>
                          <OtherPickupDate font="tiny">
                            {pickupOtherDate
                              ? formatDate(pickupOtherDate)
                              : 'Custom date'}
                          </OtherPickupDate>
                        </OtherRadioListItem>
                      </div>
                    }
                    onChange={date => {
                      if (date) {
                        setPickupOtherDate(date);
                      }
                    }}
                  />
                </ReactDatePickerStyle>

                <HeadingSeparator icon="delivery">
                  Choose your delivery date
                </HeadingSeparator>
                <RadioList>
                  <RadioListItem
                    name="delivery[type]"
                    value="economy"
                    defaultChecked={data.delivery?.type === 'economy'}
                  >
                    <DeliveryEconomyIcon />
                    <DeliveryText weight="medium">Economy</DeliveryText>
                    <DeliveryText weight="light" opacity={0.5}>
                      Delivered by {formatDate(deliveryDates?.economy) || '-'}
                    </DeliveryText>
                    <DeliveryText font="xlarge">
                      &euro;
                      {data.prices?.economy
                        ? formatPrice(data.prices.economy)
                        : '-'}
                    </DeliveryText>
                  </RadioListItem>

                  <RadioListItem
                    name="delivery[type]"
                    value="standard"
                    defaultChecked={data.delivery?.type === 'standard'}
                  >
                    <DeliveryStandardIcon />
                    <DeliveryText weight="medium">Standard</DeliveryText>
                    <DeliveryText weight="light" opacity={0.5}>
                      Delivered by {formatDate(deliveryDates?.standard) || '-'}
                    </DeliveryText>
                    <DeliveryText font="xlarge">
                      &euro;
                      {data.prices?.standard
                        ? formatPrice(data.prices.standard)
                        : '-'}
                    </DeliveryText>
                  </RadioListItem>
                  <RadioListItem
                    name="delivery[type]"
                    value="express"
                    defaultChecked={data.delivery?.type === 'express'}
                  >
                    <DeliveryExpressIcon />
                    <DeliveryText weight="medium">Express</DeliveryText>
                    <DeliveryText weight="light" opacity={0.5}>
                      Delivered by {formatDate(deliveryDates?.express) || '-'}
                    </DeliveryText>
                    <DeliveryText font="xlarge">
                      &euro;
                      {data.prices?.express
                        ? formatPrice(data.prices.express)
                        : '-'}
                    </DeliveryText>
                  </RadioListItem>
                </RadioList>
              </>
            )}
          </Box>
        )}
      </Main>

      {has(data.space) && (
        <Footer>
          <Button type="submit" disabled={!isValid}>
            Request delivery
          </Button>
        </Footer>
      )}
    </StyledForm>
  );
};

type TruckImageProps = {
  type: 'FTL' | 'LTL';
  selected: boolean;
};

const TruckImage = ({ type, selected }: TruckImageProps) => {
  const image = selected ? `${type}-selected.png` : `${type}-default.png`;

  return (
    <Box
      as="img"
      src={`/assets/${image}`}
      width="180"
      height="110"
      margin={[0, 0, 'medium']}
    />
  );
};

const StyledForm = styled(Form)`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  max-width: 100%;
`;

const StyledLabel = styled(Label).attrs(() => ({
  color: 'textSubtle',
}))`
  flex: 1 1 auto;
`;

const HEADING_ICONS = {
  space: SpaceIcon,
  pickup: PickupIcon,
  delivery: DeliveryIcon,
};

type HeadingSeparatorProps = React.ComponentProps<typeof Heading> & {
  children: React.ReactNode;
  icon?: keyof typeof HEADING_ICONS;
};

const HeadingSeparator = ({
  children,
  icon,
  ...props
}: HeadingSeparatorProps) => {
  const Icon: React.ComponentType<any> | undefined =
    icon && HEADING_ICONS[icon];

  return (
    <StyledHeading size="large" level={2} {...props}>
      <Separator>
        {Icon && <IconSpacing as={Icon} />}
        {children}
      </Separator>
    </StyledHeading>
  );
};

const IconSpacing = styled.span`
  margin-right: ${props => props.theme.spacing.small};
  color: ${props => props.theme.color.textSubtle};
`;

const StyledHeading = styled(Heading)`
  overflow: hidden;
`;

const Separator = styled.span`
  position: relative;
  padding: 0 ${props => props.theme.spacing.medium};
  vertical-align: middle;
  display: inline-block;

  &::before,
  &::after {
    content: '';
    background: ${props => props.theme.color.subtle};
    position: absolute;
    height: 2px;
    top: 50%;
    transform: translateY(-50%);
    width: 900px;
  }

  &::before {
    right: 100%;
  }

  &::after {
    left: 100%;
  }
`;

const RadioList = styled(Flex).attrs(() => ({
  direction: 'row',
  spacing: ['small', 'small'],
}))``;

const RadioListItem = styled(Radio)`
  flex: 1;
`;

const OtherRadioListItem = styled(RadioListItem)`
  display: flex;
`;

const PickupText = styled(Text)`
  display: block;
  white-space: nowrap;

  & + & {
    margin-top: 4px;
  }
`;

const OtherPickupDate = styled(PickupText)`
  text-transform: uppercase;
`;

const DeliveryText = styled(Text).attrs(() => ({
  as: 'p',
}))`
  margin-top: ${props => props.theme.spacing.small};
`;
