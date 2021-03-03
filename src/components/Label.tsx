import React from 'react';
import styled from 'styled-components';
import { Color } from 'themes/base';
import { font } from 'styles/utils';

type Props = React.ComponentProps<typeof Wrapper> & {
  text: string;
  children?: React.ReactNode;
  className?: string;
};

export const Label: React.FC<Props> = ({ text, children, ...props }) => (
  <Wrapper {...props}>
    <StyledText>{text}</StyledText>
    {children}
  </Wrapper>
);

type WrapperProps = React.ComponentProps<'label'> & {
  color?: Color;
};

const Wrapper = styled(({ color, font, ...props }) => (
  <label {...props} />
)).attrs<WrapperProps>(props => ({
  color: props.color || 'primary',
  font: 'small',
}))<WrapperProps>`
  ${font};
  color: ${props => props.color && props.theme.color[props.color]};
  display: flex;
  flex-direction: column;
`;

const StyledText = styled.span`
  margin-bottom: ${props => props.theme.spacing.small};
`;
