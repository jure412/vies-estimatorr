import React from 'react';
import styled, { css } from 'styled-components';
import { Color, Spacing, Weight } from 'themes/base';
import {
  font,
  FontProps,
  size,
  SizeProps,
  spacing,
  SpacingProps,
} from 'styles/utils';

type Props = React.ComponentProps<'div'> &
  SizeProps &
  FontProps &
  SpacingProps & {
    background?: Color;
    spacing?: Array<0 | Spacing>;
    color?: Color;
    weight?: Weight;
    rounded?: boolean;
  };

export const Box = styled(
  ({
    spacing,
    margin,
    padding,
    width,
    maxWidth,
    minWidth,
    height,
    maxHeight,
    minHeight,
    font,
    background,
    color,
    weight,
    rounded,
    ...props
  }) => <div {...props} />
)<Props>`
  ${font};
  ${size};
  ${spacing};
  font-weight: ${props => props.weight && props.theme.weight[props.weight]};
  color: ${props => props.color && props.theme.color[props.color]};
  border-radius: ${props => props.rounded && props.theme.borderRadius};

  background: ${props =>
    props.background && props.theme.color[props.background]};

  ${props => {
    if (props.spacing) {
      const [top, left] = props.spacing;
      const topSpacing = top && props.theme.spacing[top];
      const leftSpacing = left && props.theme.spacing[left];

      return (
        (topSpacing || leftSpacing) &&
        css`
          margin-top: ${topSpacing && `-${topSpacing}`};
          margin-left: ${leftSpacing && `-${leftSpacing}`};

          & > * {
            margin-top: ${topSpacing};
            margin-left: ${leftSpacing};
          }
        `
      );
    }
  }}
`;
