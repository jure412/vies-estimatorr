import styled from 'styled-components';
import { shade, rgba } from 'polished';
import { font } from 'styles/utils';
import { Color } from 'themes/base';
import { Box } from 'components/Box';

type Props = React.ComponentProps<typeof Box> &
  React.ComponentProps<'button'> & {
    color?: Color;
  };

export const Button = styled(Box).attrs<Props>(props => ({
  type: props.type || 'button',
  font: 'large',
  color: props.color || ('accent' as Color),
  as: 'button',
}))<Props>`
  ${font};
  border-radius: ${props => props.theme.borderRadius};
  font-weight: ${props => props.theme.weight.bold};
  background: ${props => props.color && props.theme.color[props.color]};
  padding: 0 1.25em;
  height: 50px;
  color: #fff;
  border: 0;
  outline: none;
  transition: all 166ms ease-out;

  &:hover,
  &:focus {
    background-color: ${props =>
      props.color && shade(0.25, props.theme.color[props.color])};
  }

  &:active {
    background-color: ${props =>
      props.color && shade(0.5, props.theme.color[props.color])};
    color: ${rgba('#fff', 0.5)};
  }

  &:disabled {
    background-color: ${props =>
      props.color && rgba(props.theme.color[props.color], 0.15)};
    color: ${props => props.color && rgba(props.theme.color[props.color], 0.5)};
  }
`;
