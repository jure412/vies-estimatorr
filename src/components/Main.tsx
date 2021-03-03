import styled from 'styled-components';
import { Box } from './Box';

export const Main = styled(Box).attrs(() => ({
  as: 'main',
  padding: ['medium', 'medium', 'large'],
  background: 'background',
}))`
  flex: 1 0 auto;
`;
