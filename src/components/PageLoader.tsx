import styled, { keyframes } from 'styled-components';
import { timingFunctions } from 'polished';
import { Box } from 'components/Box';

export const grow = keyframes`
	from {
		width: 0;
	}
  to {
    width: 100%;
  }
`;

export const PageLoader = styled(Box).attrs<React.ComponentProps<typeof Box>>(
  props => ({ background: props.background || 'background' })
)`
  height: 100vh;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 4px;
    background: ${props => props.theme.color.secondary};
    animation: ${grow} 2s ${timingFunctions('easeInOutCubic')} infinite;
  }
`;
