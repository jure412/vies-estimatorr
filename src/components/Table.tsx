import React from 'react';
import styled from 'styled-components';

const Table = ({ children }: { children: React.ReactNode }) => (
  <Scrollable>
    <Wrapper>{children}</Wrapper>
  </Scrollable>
);

const Scrollable = styled.div`
  overflow-x: auto;
  max-width: 100%;
`;

const Wrapper = styled.table`
  border-spacing: 0 2px;
  width: 100%;
`;

type TableColProps = {
  width?: number;
};

// Must use a styled div to utilise styled-components prop whitelist
const Col = styled.colgroup``;
const TableCol = styled(({ width, ...props }) => <Col {...props} />)<
  TableColProps
>`
  width: ${props => props.width && `${props.width}px`};
`;

const TableHead = styled.thead`
  font-size: 10px;
  font-weight: ${props => props.theme.weight.bold};
  text-transform: uppercase;
`;

const TableFoot = styled.tfoot``;

const TableBody = styled.tbody``;
const TableRow = styled.tr``;

type TableCellProps = React.ComponentProps<'td'> & {
  header?: boolean;
};

const TableCell = styled.td.attrs<TableCellProps>(props => ({
  as: props.header && 'th',
}))<TableCellProps>`
  text-align: left;
  padding: 0;
  padding-left: ${props => props.theme.spacing.medium};
  padding-top: ${props => props.theme.spacing.tiny};
  padding-bottom: ${props => props.theme.spacing.tiny};
  height: 50px;

  &:last-child {
    padding-right: 15px;
  }

  ${TableHead} & {
    background-color: ${props => props.theme.color.primary};
    color: ${props => props.theme.color.textOnPrimary};
    height: 26px;

    &:first-child {
      border-top-left-radius: ${props => props.theme.borderRadius};
    }

    &:last-child {
      border-top-right-radius: ${props => props.theme.borderRadius};
    }
  }

  ${TableFoot} &,
  ${TableBody} & {
    background-color: ${props => props.theme.color.subtle};
  }
`;

export {
  Table,
  TableCol,
  TableHead,
  TableFoot,
  TableBody,
  TableRow,
  TableCell,
};
