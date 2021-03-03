import React from 'react';
import styled from 'styled-components';

type Props = React.ComponentProps<typeof Input> &
  FakeInputProps & {
    children: React.ReactNode;
  };

export const Radio: React.FC<Props> = ({
  fill,
  small,
  className,
  children,
  ...props
}) => (
  <Wrapper className={className}>
    <Input {...props} type="radio" />
    <FakeInput fill={fill} small={small}>
      {children}
    </FakeInput>
  </Wrapper>
);

const Wrapper = styled.span`
  position: relative;
  display: inline-flex;
  z-index: 0;
`;

const Input = styled.input.attrs(() => ({ type: 'radio' }))`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  z-index: 1;
`;

type FakeInputProps = {
  small?: boolean;
  fill?: boolean;
};

// omit custom props from DOM
const FakeInput = styled(({ fill, small, ...props }) => <span {...props} />)<
  FakeInputProps
>`
  border: 2px solid ${props => props.theme.color.subtle};
  border-radius: ${props => props.theme.borderRadius};
  padding: ${props => props.theme.spacing[props.small ? 'medium' : 'large']};
  color: ${props => props.theme.color.primary};
  background: ${props => props.fill && props.theme.color.subtle};
  transition: all 166ms ease-out;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;

  ${Input}:hover + & {
    border-color: ${props => props.theme.color.accent};
  }

  ${Input}:checked + & {
    border-color: ${props => props.theme.color.secondary};
    color: ${props => props.theme.color.secondary};
    background: transparent;
  }

  ${Input}.focus-visible:focus + & {
    border-color: ${props => props.theme.color.accent};
  }
`;
