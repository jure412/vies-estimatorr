import styled from 'styled-components';

export const IconButton = styled.button.attrs(props => ({
  type: props.type || 'button',
}))`
  border: 0;
  background: transparent;
  padding: ${props => props.theme.spacing.small};
  margin: -${props => props.theme.spacing.tiny};
  color: ${props => props.theme.color.textSubtle};
  transition: color 166ms ease-out;
  outline: none;

  &:hover,
  &:focus {
    color: ${props => props.theme.color.primary};
  }

  svg {
    display: block;
  }
`;
