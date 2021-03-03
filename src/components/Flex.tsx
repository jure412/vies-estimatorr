import React from 'react';
import styled from 'styled-components';
import { Box } from './Box';
import { getSizeValue } from 'styles/utils';

type Align = 'flex-start' | 'flex-end' | 'center';

type Props = React.ComponentProps<typeof Box> & {
  direction?: 'row' | 'column';
  wrap?: boolean;
  align?: Align;
  justify?: Align;
};

const BoxWithoutFlexProps = React.forwardRef<typeof Box, Props>(
  ({ direction, wrap, align, justify, ...props }: Props, ref) => (
    <Box {...props} ref={ref} />
  )
);

export const Flex = styled(BoxWithoutFlexProps).attrs<Props>(props => ({
  direction: props.direction ?? 'column',
  wrap: props.wrap ?? true,
}))<Props>`
  display: flex;
  flex-direction: ${props => props.direction};
  align-items: ${props => props.align};
  justify-content: ${props => props.justify};
  flex-wrap: ${props => props.wrap && 'wrap'};
  min-width: ${props => getSizeValue('minWidth')(props) || 0};
  min-height: ${props => getSizeValue('minHeight')(props) || 0};
`;
