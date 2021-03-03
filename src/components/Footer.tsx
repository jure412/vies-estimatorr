import styled from 'styled-components';
import { Box } from './Box';

export const Footer = styled(Box).attrs(() => ({
  as: 'footer',
  padding: ['large'],
  background: 'tertiary',
}))`
  flex: 0 0 auto;
  text-align: center;
`;
