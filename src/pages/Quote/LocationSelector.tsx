import { Location } from './types';

import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import useSWR from 'swr';
import { useDebounce } from 'use-debounce';
import { ReactComponent as MarkerIcon } from 'assets/icons/marker.svg';
import { AutoSuggest, AutoSuggestItem } from 'components/AutoSuggest';

type Country = Location['country'];

type Place = {
  placeName: string;
  postalCode: string;
  countryCode: Country;
};

type Data = {
  postalCodes: Array<Place>;
};

type Props = Omit<
  React.ComponentProps<typeof StyledAutoSuggest>,
  'onSelectionChange'
> & {
  className?: string;
  country?: Country | Array<Country>;
  defaultSearch?: string;
  selection?: Location;
  onSelectionChange?: (location?: Location) => void;
};

export const LocationSelector: React.FC<Props> = ({
  className,
  selection,
  onSelectionChange = () => {},
  country,
  ...props
}) => {
  const defaultSearch = selection ? selection.place + ',' + selection.zip : '';
  const [search, setSearch] = useState<string>(defaultSearch);
  const [debouncedSearch] = useDebounce(search, 200);
  const [city, zip] = useMemo(() => debouncedSearch.split(', '), [
    debouncedSearch,
  ]);

  const params = useMemo(() => ({ country, city, zip }), [country, city, zip]);
  const { data } = useSWR<Data>(
    search && params.country && params.city
      ? ['/api/postcode-search', params]
      : null
  );

  return (
    <Wrapper className={className}>
      <StyledAutoSuggest
        {...props}
        search={search}
        selection={selection ? `${selection.place}, ${selection.zip}` : ''}
        onSelectionChange={selection => {
          onSelectionChange(JSON.parse(selection));
          setSearch('');
        }}
        onSearchChange={value => {
          onSelectionChange();
          setSearch(value);
        }}
      >
        {data && data.postalCodes ? (
          data.postalCodes.map(place => {
            const value = `${place.placeName}, ${place.postalCode}`;
            const location: Location = {
              zip: place.postalCode,
              place: place.placeName,
              country: place.countryCode.toLowerCase() as Country,
            };

            return (
              <AutoSuggestItem key={value} value={JSON.stringify(location)}>
                {location.place}, {location.zip}
              </AutoSuggestItem>
            );
          })
        ) : (
          <AutoSuggestItem value={''}>Loading&hellip;</AutoSuggestItem>
        )}
      </StyledAutoSuggest>
      <StyledMarkerIcon role="presentation" />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
`;

const StyledMarkerIcon = styled(MarkerIcon)`
  position: absolute;
  top: 50%;
  left: 16px;
  transform: translateY(-50%);
`;

const StyledAutoSuggest = styled(AutoSuggest)`
  padding-left: 45px;
  width: 100%;
`;
