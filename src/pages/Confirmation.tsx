import React from 'react';
import styled from 'styled-components';
import { ReactComponent as ConfirmationGraphic } from 'assets/confirmation.svg';
import { Main } from 'components/Main';
import { Flex } from 'components/Flex';
import { Heading } from 'components/Heading';
import { Footer } from 'components/Footer';
import { Text } from 'components/Text';
import { ButtonLink } from 'components/ButtonLink';

export const Confirmation: React.FC = () => (
  <>
    <StyledMain>
      <Content>
        <ConfirmationGraphic />
        <Heading size="xlarge">
          Your delivery request was sent to Vies team
        </Heading>
        <Copy>
          Our representative will reach out to you to confirm the delivery
          details within the next 6 hours.
        </Copy>
      </Content>
    </StyledMain>
    <StyledFooter>
      <Copy>Need another delivery?</Copy>
      <ButtonLink to="/">Send a new order request</ButtonLink>
    </StyledFooter>
  </>
);

const StyledMain = styled(Main)`
  display: flex;
  flex-direction: column;
`;

const Content = styled(Flex).attrs(() => ({
  margin: [0, 'auto'],
  justify: 'center',
  align: 'center',
  maxWidth: 900,
}))`
  flex: 1 1 auto;
  text-align: center;
`;

const Copy = styled(Text).attrs(() => ({
  as: 'p',
  font: 'large',
}))`
  opacity: 0.5;
  margin-bottom: ${props => props.theme.spacing.small};
`;

const StyledFooter = styled(Footer).attrs(() => ({ background: 'background' }))`
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    width: 100%;
    height: 2px;
    max-width: 900px;
    transform: translateX(-50%);
    background: ${props => props.theme.color.subtle};
  }
`;
