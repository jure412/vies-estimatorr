import styled, { keyframes } from 'styled-components';
import { Color } from 'themes/base';

const droplets = keyframes`
	0%, 15% { opacity: 1; }
	15% { transform: scale(.5); }
	60% { transform: scale(4); }
	60%, 90% { opacity: 0; }
	90% { transform: scale(3); }
	95%, 100% { opacity: 1; }
	100% { transform: scale(1); }
`;

const ripples = keyframes`
	0%, 30% { opacity: 0; transform: scale(1); }
	60% { opacity: .3; }
	90% { transform: scale(3); }
	100% { opacity: 0; };
`;

type Props = {
  color?: Color;
};

export const Loader = styled.span<Props>`
  display: block;
  width: ${props => props.theme.spacing.medium};
  height: ${props => props.theme.spacing.medium};
  position: relative;
  margin: auto;

  &::before,
  &::after {
    content: '';
    position: absolute;
    border-radius: 50%;
    width: 10px;
    height: 10px;
    top: calc(50% - 5px);
    left: calc(50% - 5px);
    animation-duration: 3s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }

  &::before {
    background: ${props => props.color || '#fff'};
    animation-name: ${droplets};
  }

  &::after {
    border: 1px solid ${props => props.color || '#fff'};
    opacity: 0;
    animation-name: ${ripples};
  }
`;
