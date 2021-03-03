import styled from 'styled-components';
import { Color, Font } from 'themes/base';
import { font } from 'styles/utils';

type Props = React.ComponentProps<'h1'> & {
  color?: Color;
  size?: Font;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
};

export const Heading = styled.h1.attrs<Props>(props => ({
  as: props.level && `h${props.level}`,
  font: props.size,
}))<Props>`
  ${font};
  color: ${props => props.color && props.theme.color[props.color]};
  text-align: center;
  margin: ${props => props.theme.spacing.large} 0;
  margin-bottom: ${props =>
    props.size !== 'xlarge' && props.theme.spacing.medium};

  font-weight: ${props =>
    props.size === 'xlarge'
      ? props.theme.weight.light
      : props.theme.weight.normal};
`;
