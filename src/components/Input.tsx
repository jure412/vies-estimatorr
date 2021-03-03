import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import autosizeInput from 'autosize-input';
import { font, size, SizeProps } from 'styles/utils';

export const Input: React.FC<FieldProps> = ({ autosize, ...props }) => {
  const inputRef = useRef(null!);

  useEffect(() => {
    if (autosize) {
      return autosizeInput(inputRef.current);
    }
  }, [autosize]);

  return <Field {...props} autosize={autosize} ref={inputRef} />;
};

type FieldProps = SizeProps &
  React.ComponentProps<'input'> & {
    autosize?: boolean;
  };

/**
 * 1. Allows the autosize to expand width from zero instead of collapse width
 * from automatic input width.
 */

export const Field = styled.input.attrs<FieldProps>(() => ({ font: 'large' }))<
  FieldProps
>`
  ${font};
  ${size};
  color: ${props =>
    props.readOnly ? props.theme.color.textSubtle : props.theme.color.text};
  border-radius: ${props => props.theme.borderRadius};
  background: ${props => props.theme.color.subtle};
  padding: 0 ${props => props.theme.spacing.medium};
  border: 2px solid transparent;
  transition: border 166ms ease-out;
  height: 50px;
  outline: none;
  width: ${props => props.autosize && 0}; /* 1 */

  &:focus {
    border-color: ${props => props.theme.color.accent};
  }

  &::placeholder {
    opacity: 0.2;
  }

  &:read-only {
    color: inherit;
  }
`;
