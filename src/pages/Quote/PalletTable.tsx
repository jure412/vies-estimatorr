import { Pallet } from './types';

import React, { useState, useEffect, useRef } from 'react';
import styled, { css } from 'styled-components';
import { ReactComponent as CrossIcon } from 'assets/icons/cross.svg';
import { Input } from 'components/Input';
import { Select, SelectItem } from 'components/Select';
import { IconButton } from 'components/IconButton';
import { Text } from 'components/Text';
import {
  Table,
  TableCol,
  TableHead,
  TableFoot,
  TableBody,
  TableRow,
  TableCell,
} from 'components/Table';
import { DEFAULT_PALLETS } from './constants';

type RowId = string;
type PalletType = keyof typeof DEFAULT_PALLETS;

type Props = {
  children: React.ReactNode;
  onAddRowClick?: () => void;
  onLdmChange?: (ldm: number) => void;
};

export const PalletTable: React.FC<Props> = ({
  children,
  onAddRowClick = () => {},
  onLdmChange = () => {},
}) => {
  const prevVolumeRef = useRef<Array<number>>([]);

  function handleLdmChange(index: number, ldm: number) {
    prevVolumeRef.current[index] = ldm;
    const totalLDM = prevVolumeRef.current.reduce((a, b) => a + b);

    onLdmChange(totalLDM);
  }

  return (
    <Table>
      <TableCol width={260} />
      <TableCol width={100} />
      <TableCol width={100} />
      <TableCol width={100} />
      <TableCol width={100} />
      <TableCol width={1} />
      <TableHead>
        <TableRow>
          <TableCell header>#</TableCell>
          <TableCell header>
            Length (<abbr title="Centimeters">cm</abbr>)
          </TableCell>
          <TableCell header>
            Width (<abbr title="Centimeters">cm</abbr>)
          </TableCell>
          <TableCell header>
            Height (<abbr title="Centimeters">cm</abbr>)
          </TableCell>
          <TableCell header>
            Weight (<abbr title="Kilograms">kg</abbr>)
          </TableCell>
          <TableCell>&nbsp;</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              onLdmChange: (ldm: number) => handleLdmChange(index, ldm),
            });
          }
        })}
      </TableBody>
      <TableFoot>
        <TableRow>
          <TableCell colSpan={6}>
            <AddRowButton onClick={onAddRowClick} />
          </TableCell>
        </TableRow>
      </TableFoot>
    </Table>
  );
};

type RowProps = {
  name: string;
  defaultValue?: Pallet;
  onDeleteClick?: () => void;
  onLdmChange?: (ldm: number) => void;
};

export const PalletTableRow: React.FC<RowProps> = ({
  name,
  defaultValue,
  onDeleteClick,
  onLdmChange = () => {},
}) => {
  const prevValueRef = useRef<Maybe<Pallet>>();
  const [value, setValue] = useState<Pallet>(
    defaultValue || DEFAULT_PALLETS.INDUSTRY
  );

  function handleTypeChange(type: PalletType) {
    const defaultPallet = DEFAULT_PALLETS[type] as Pallet;
    setValue(defaultPallet);
  }

  function handleValueChange(changes: Partial<Pallet>) {
    setValue(prevValue => ({ ...prevValue, ...changes, type: 'CUSTOM' }));
  }

  useEffect(() => {
    const prevValue = JSON.stringify(prevValueRef.current);
    const currentValue = JSON.stringify(value);
    const hasValueChanged = prevValue !== currentValue;
    const hasEveryValue = Object.keys(value).every(
      key => value[key as keyof Pallet] !== undefined
    );

    if (hasValueChanged && hasEveryValue) {
      const ldm = getLDM(value as GetLDMInput);
      onLdmChange(ldm);
      prevValueRef.current = value;
    }
  }, [value, onLdmChange]);

  useEffect(() => {}, []);

  return (
    <TableRow>
      <StyledTableCellSelect>
        1{' '}
        <StyledSelect
          name={`${name}[type]`}
          value={value.type}
          onChange={handleTypeChange}
        >
          <SelectItem value="INDUSTRY">Industry pallet</SelectItem>
          <SelectItem value="EPAL">EPAL</SelectItem>
          <SelectItem value="CUSTOM">Custom</SelectItem>
        </StyledSelect>
      </StyledTableCellSelect>
      <TableCell>
        <Label>
          <StyledInput
            name={`${name}[length]`}
            value={value.length || ''}
            placeholder={defaultValue && String(defaultValue.length)}
            required
            onChange={event => {
              handleValueChange({
                length: Number(event.target.value),
              });
            }}
          />{' '}
          <Unit title="Centimeters">cm</Unit>
        </Label>
      </TableCell>
      <TableCell>
        <Label>
          <StyledInput
            name={`${name}[width]`}
            value={value.width || ''}
            placeholder={defaultValue && String(defaultValue.width)}
            required
            onChange={event => {
              handleValueChange({
                width: Number(event.target.value),
              });
            }}
          />{' '}
          <Unit title="Centimeters">cm</Unit>
        </Label>
      </TableCell>
      <TableCell>
        <Label>
          <StyledInput
            name={`${name}[height]`}
            value={value.height || ''}
            placeholder={defaultValue && String(defaultValue.height)}
            required
            onChange={event => {
              handleValueChange({
                height: Number(event.target.value),
              });
            }}
          />{' '}
          <Unit title="Centimeters">cm</Unit>
        </Label>
      </TableCell>
      <TableCell>
        <Label>
          <StyledInput
            name={`${name}[weight]`}
            value={value.weight || ''}
            placeholder={defaultValue && String(defaultValue.weight)}
            maxLength={5}
            required
            onChange={event => {
              handleValueChange({
                weight: Number(event.target.value),
              });
            }}
          />{' '}
          <Unit title="Kilograms">kg</Unit>
        </Label>
      </TableCell>
      <TableCell>
        <IconButton
          disabled={!onDeleteClick}
          style={!onDeleteClick ? { visibility: 'hidden' } : undefined}
        >
          <CrossIcon onClick={onDeleteClick} />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

type GetLDMInput = {
  length: number;
  width: number;
  height: number;
  weight: number;
};

function getLDM({ length, width, height, weight }: GetLDMInput) {
  const option1 = calculateOptionOneLDM(length, width);
  const option2 = calculateOptionTwoLDM(length, width, height);
  const option3 = calculateOptionThreeLDM(weight);

  return Math.max(option1, option2, option3);
}

function cmToMeters(value: number) {
  return value / 100;
}

function calculateOptionOneLDM(length: number, width: number) {
  return (cmToMeters(length) * cmToMeters(width)) / 2.4;
}

function calculateOptionTwoLDM(length: number, width: number, height: number) {
  return (cmToMeters(length) * cmToMeters(width) * cmToMeters(height)) / 5;
}

function calculateOptionThreeLDM(weight: number) {
  return weight / 1750;
}

const fieldStyles = css`
  padding: ${props => props.theme.spacing.tiny};
  height: auto;
  color: inherit;
  margin: -4px;
`;

const StyledTableCellSelect = styled(TableCell)`
  white-space: nowrap;
`;

const StyledSelect = styled(Select)`
  ${fieldStyles};
  /* margin-left: ${props => props.theme.spacing.small}; */
`;

const Label = styled.label`
  white-space: nowrap;
`;

const StyledInput = styled(Input).attrs(props => ({
  type: 'tel',
  autosize: true,
  pattern: '[0-9]+',
  maxLength: props.maxLength || 3,
}))`
  ${fieldStyles};
  padding-left: 2px;
  padding-right: 2px;
`;

const Unit = styled(Text).attrs(() => ({
  as: 'abbr',
  color: 'textSubtle',
}))``;

const AddRowButton = styled(Text).attrs(() => ({
  as: 'button',
  type: 'button',
  font: 'small',
  color: 'textSubtle',
  children: 'Add new',
}))`
  background: transparent;
  border: 0;
  width: 100%;
  height: 100%;
  outline: none;
  transition: color 166ms ease-out;

  &:hover,
  &.focus-visible:focus {
    color: inherit;
  }
`;
