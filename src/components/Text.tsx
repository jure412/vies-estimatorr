import React from 'react';
import styled from 'styled-components';
import { Color, Weight } from 'themes/base';
import { font, FontProps } from 'styles/utils';

type Props = React.ComponentProps<'span'> &
  FontProps & {
    color?: Color;
    weight?: Weight;
    opacity?: number;
  };

export const Text = styled.span<Props>`
  ${font};
  color: ${props => props.color && props.theme.color[props.color]};
  font-weight: ${props => props.weight && props.theme.weight[props.weight]};
  opacity: ${props => props.opacity};
  margin: 0;
`;
