import styled from 'styled-components';
import { Link as ReactRouterLink } from 'react-router-dom';
import { shade } from 'polished';

type Props = React.ComponentProps<typeof ReactRouterLink>;

export const Link = styled(ReactRouterLink)<Props>`
  color: ${props => props.theme.color.accent};
  transition: all 166ms ease-out;
  outline: none;

  &:hover {
    color: ${props => shade(0.25, props.theme.color.accent)};
  }

  &:active {
    color: ${props => shade(0.5, props.theme.color.accent)};
  }
`;
