import React, { useState } from 'react';
import styled from 'styled-components';
import { useHistory, useLocation } from 'react-router-dom';
import urlencode from 'urlencode';
import { formatDate } from 'utils/date';
import { formatPrice } from 'utils/price';
import { Form, Data } from 'components/Form';
import { Main } from 'components/Main';
import { Box } from 'components/Box';
import { Heading } from 'components/Heading';
import { Label } from 'components/Label';
import { Input } from 'components/Input';
import { Footer } from 'components/Footer';
import { Button } from 'components/Button';
import { Text } from 'components/Text';
import { Error } from 'components/Error';
import { QuoteData } from './Quote/types';

type Pallets = QuoteData['volume']['pallets'];

export const Delivery: React.FC = () => {
  const history = useHistory();
  const { state } = useLocation();
  const [error, setError] = useState<Maybe<string>>();

  function handleSubmit({ data }: { data: Data }) {
    setError(undefined);

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: urlencode.stringify({
        'form-name': 'Orders',
        ...getQuoteTemplate(state.quote),
        pickupAddress: `${data.pickupAddress}\n${data.pickupPostcode}\n${data.pickupCity}`,
        pickupContact: `${data.pickupName}\n${data.pickupEmail}\n${data.pickupPhone}`,
        deliveryAddress: `${data.deliveryAddress}\n${data.deliveryPostcode}\n${data.deliveryCity}`,
        deliveryContact: `${data.deliveryName}\n${data.deliveryEmail}\n${data.deliveryPhone}`,
      }),
    })
      .then(() => history.push('/success', { quote: state.quote }))
      .catch(() => {
        setError('There was a problem placing your order. Please contact us.');
      });
  }

  return (
    <StyledForm onSubmit={handleSubmit}>
      <Main>
        {error && <Error>{error}</Error>}
        <Box margin={[0, 'auto']} maxWidth={900}>
          <Heading size="xlarge">
            Provide pickup and delivery information
          </Heading>
          <Grid>
            <Fieldset>
              <legend>
                <Label text="Pickup location" htmlFor="pickup-location" />
              </legend>

              <StyledInput
                type="text"
                name="pickupAddress"
                id="pickup-location"
                placeholder="Address"
                required
              />
              <StyledInput
                type="text"
                name="pickupPostcode"
                placeholder="Postcode"
                value={state?.quote?.from.zip}
                required
                readOnly
                tabIndex={-1}
              />
              <StyledInput
                type="text"
                name="pickupCity"
                placeholder="City"
                defaultValue={state?.quote?.from.place}
                required
              />
            </Fieldset>

            <Fieldset>
              <legend>
                <Label
                  text="Contact information for pickup"
                  htmlFor="pickupContact"
                />
              </legend>

              <StyledInput
                type="text"
                name="pickupName"
                id="pickupContact"
                placeholder="Full name"
                required
              />
              <StyledInput
                type="email"
                name="pickupEmail"
                placeholder="Email address"
                required
              />
              <StyledInput
                type="tel"
                name="pickupPhone"
                placeholder="Phone number"
                pattern="[0-9]+"
                required
              />
            </Fieldset>

            <Fieldset>
              <legend>
                <Label text="Delivery location" htmlFor="delivery-location" />
              </legend>

              <StyledInput
                type="text"
                name="deliveryAddress"
                id="delivery-location"
                placeholder="Address"
                required
              />
              <StyledInput
                type="text"
                name="deliveryPostcode"
                placeholder="Postcode"
                value={state?.quote?.to.zip}
                required
                readOnly
                tabIndex={-1}
              />
              <StyledInput
                type="text"
                name="deliveryCity"
                placeholder="City"
                defaultValue={state?.quote?.to.place}
                required
              />
            </Fieldset>

            <Fieldset>
              <legend>
                <Label
                  text="Contact information for delivery"
                  htmlFor="deliveryContact"
                />
              </legend>

              <StyledInput
                type="text"
                name="deliveryName"
                id="deliveryContact"
                placeholder="Full name"
                required
              />
              <StyledInput
                type="email"
                name="deliveryEmail"
                placeholder="Email address"
                required
              />
              <StyledInput
                type="tel"
                name="deliveryPhone"
                placeholder="Phone number"
                pattern="[0-9]+"
                required
              />
            </Fieldset>
          </Grid>
        </Box>
      </Main>
      <Footer>
        <Button
          color="primary"
          margin={[0, 'small', 0, 0]}
          onClick={() => history.push('/', { quote: state.quote })}
        >
          Back
        </Button>
        <Button type="submit">Submit order</Button>
        <Smallprint>
          By submitting this order you will be charged delivery services.
        </Smallprint>
      </Footer>
    </StyledForm>
  );
};

function getQuoteTemplate(quote: QuoteData) {
  let deliveryDate;
  let deliveryPrice;
  let weight = quote.volume.weight;

  switch (quote.delivery.type) {
    case 'economy':
      deliveryDate = quote.delivery.dates.economy;
      deliveryPrice = quote.prices.economy;
      break;
    case 'express':
      deliveryDate = quote.delivery.dates.express;
      deliveryPrice = quote.prices.express;
      break;
    case 'standard':
    default:
      deliveryDate = quote.delivery.dates.standard;
      deliveryPrice = quote.prices.standard;
      break;
  }

  if (quote.volume.type === 'unknown') {
    const pallets = quote.volume.pallets as NonNullable<Pallets>;
    weight = pallets.reduce((a, b) => a + b.weight, 0);
  }

  return {
    from: quote.from,
    to: quote.to,
    space: quote.space,
    volume: quote.volume.ldm,
    weight,
    pickup: formatDate(quote.pickup.date),
    delivery: formatDate(deliveryDate),
    price: '€' + formatPrice(deliveryPrice),
  };
}

const StyledForm = styled(Form)`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  padding-top: ${props => props.theme.spacing.medium};
  grid-gap: ${props => props.theme.spacing.large}
    ${props => props.theme.spacing.small};
`;

const Fieldset = styled.fieldset`
  @media (min-width: 700px) {
    &:nth-child(even) {
      grid-row: 2;
    }
  }
`;

const StyledInput = styled(Input).attrs(() => ({
  width: '100%',
}))`
  & + & {
    margin-top: ${props => props.theme.spacing.small};
  }
`;

const Smallprint = styled(Text).attrs(() => ({
  font: 'small',
  color: 'primary',
}))`
  opacity: 0.5;
  display: block;
  margin-top: ${props => props.theme.spacing.medium};
`;
