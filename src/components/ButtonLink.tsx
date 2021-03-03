import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from './Button';

type Props = React.ComponentProps<typeof Link> &
  React.ComponentProps<typeof Button>;

export const ButtonLink = styled(Button).attrs(() => ({
  as: Link,
}))<Props>`
  display: inline-flex;
  align-items: center;
`;
