import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { has } from 'utils/has';
import { Flex } from 'components/Flex';

export const Error = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<Maybe<HTMLDivElement>>();

  useEffect(() => {
    if (has(ref.current)) {
      ref.current.focus();
    }
  }, []);

  return (
    <ErrorMessage tabIndex={-1} ref={ref}>
      {children}
    </ErrorMessage>
  );
};

const ErrorMessage = styled(Flex).attrs(() => ({
  background: 'danger',
  align: 'center',
  justify: 'center',
  padding: ['small'],
  margin: [0],
  font: 'tiny',
  forwardedAs: 'p',
}))`
  color: #fff;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
`;
