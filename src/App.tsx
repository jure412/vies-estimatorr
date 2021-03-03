import React, { Suspense, useState } from 'react';
import styled from 'styled-components';
import { Switch, Route, Redirect, useLocation } from 'react-router-dom';
import { StickyContainer, Sticky } from 'react-sticky';
import { rgba } from 'polished';
import ClickOutside from 'react-click-outside';
import qs from 'qs';
import { SWRConfig } from 'swr';
import { ReactComponent as ChevronIcon } from 'assets/icons/chevron.svg';
import { useAuth } from './AuthProvider';
import { useViewer } from 'hooks/useViewer';
import { PageLoader } from 'components/PageLoader';
import { Flex } from 'components/Flex';
import { Text } from 'components/Text';
import { Link } from 'components/Link';
import { Quote } from 'pages/Quote';

const Delivery = React.lazy(() =>
  import('pages/Delivery').then(module => ({ default: module.Delivery }))
);

const Confirmation = React.lazy(() =>
  import('pages/Confirmation').then(module => ({
    default: module.Confirmation,
  }))
);

function fetcher(path: string, params: { [key: string]: any }) {
  const query = encodeURI(qs.stringify(params, { indices: false }));
  const url = path.replace('/api', '/.netlify/functions');
  return fetch(url + '?' + query)
    .then(res => res.json())
    .then(({ data, error }) => {
      if (error) {
        throw error;
      }
      return data;
    });
}

export const App = () => {
  const { state } = useLocation();

  return (
    <StickyContainer>
      <SWRConfig
        value={{
          fetcher,
          revalidateOnFocus: false,
          refreshInterval: 0,
        }}
      >
        <Flex minHeight="100vh">
          <Sticky>
            {({ style }) => (
              <Header style={style}>
                <StyledLogoLink to="/">
                  <img
                    width="70"
                    src="assets/vies-logo.png"
                    alt="Vies Logistics"
                  />
                </StyledLogoLink>
                <UserMenu />
              </Header>
            )}
          </Sticky>

          <Suspense fallback={<PageLoader />}>
            <Switch>
              <Route path="/" exact>
                <Quote />
              </Route>

              <Route path="/delivery">
                {state?.quote ? <Delivery /> : <Redirect to="/" />}
              </Route>

              <Route path="/success">
                <Confirmation />
              </Route>

              <Route>
                <Redirect to="/" />
              </Route>
            </Switch>
          </Suspense>
        </Flex>
      </SWRConfig>
    </StickyContainer>
  );
};

const Header = styled(Flex).attrs(() => ({
  forwardedAs: 'header',
  background: 'primary',
  minHeight: 50,
  align: 'center',
  direction: 'row',
}))`
  padding-left: ${props => props.theme.spacing.small};
  z-index: 1;
`;

const StyledLogoLink = styled(Link)`
  flex: 0 0 auto;
  margin-right: auto;
  margin-bottom: ${props => props.theme.spacing.tiny};
`;

const UserMenu = () => {
  const viewer = useViewer();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { logout } = useAuth();

  return (
    <UserMenuWrapper onClickOutside={() => setIsOpen(false)}>
      <UserButton onClick={() => setIsOpen(isOpen => !isOpen)}>
        <Text font="small">{viewer.company.name}</Text>
        <StyledChevronIcon />
      </UserButton>
      {isOpen && (
        <UserMenuPopup>
          <UserMenuEmail>{viewer.email}</UserMenuEmail>
          <Link
            to="/logout"
            onClick={event => {
              event.preventDefault();
              logout();
            }}
          >
            Log out
          </Link>
        </UserMenuPopup>
      )}
    </UserMenuWrapper>
  );
};

const UserMenuWrapper = styled(Flex).attrs(() => ({
  forwardedAs: ClickOutside,
}))`
  position: relative;
  align-self: stretch;
  color: ${props => props.theme.color.textOnPrimary};
  text-align: right;
`;

const UserButton = styled(Flex).attrs(() => ({
  forwardedAs: 'button',
  direction: 'row',
  align: 'center',
}))`
  border: 0;
  background: ${rgba('#000', 0.2)};
  padding: 0 ${props => props.theme.spacing.medium};
  transition: background 166ms ease-out;
  align-self: stretch;
  outline: none;
  flex: 1 1 auto;

  &:hover,
  &.focus-visible:focus {
    background: ${rgba('#000', 0.5)};
  }
`;

const UserMenuPopup = styled(Flex).attrs(() => ({
  padding: ['medium'],
  rounded: true,
}))`
  background: #121a2f;
  position: absolute;
  top: 100%;
  right: 0;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
`;

const UserMenuEmail = styled(Text)`
  margin-bottom: ${props => props.theme.spacing.medium};
`;

const StyledChevronIcon = styled(ChevronIcon)`
  margin-left: ${props => props.theme.spacing.small};
`;
