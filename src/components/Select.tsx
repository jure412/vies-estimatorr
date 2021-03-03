import React, { useState } from 'react';
import styled from 'styled-components';
import { ReactComponent as ChevronIcon } from 'assets/icons/chevron.svg';

type Props = Omit<React.ComponentProps<typeof HiddenSelect>, 'onChange'> & {
  onChange?: (value: string) => void;
};

const Select = ({
  defaultValue = '',
  children,
  className,
  onChange = () => {},
  ...props
}: Props) => {
  const [stateValue, setStateValue] = useState<string>(defaultValue);
  const isControlled = props.value != null;
  const value = isControlled ? props.value : stateValue;
  const items = React.Children.toArray(children);

  const valueItem =
    value &&
    items.find(item => {
      const hasValue = item.props.value === value;
      const hasLabelValue = item.props.children === value;
      return hasValue || hasLabelValue;
    });

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const { value } = event.target;

    if (isControlled) {
      onChange(value);
    } else {
      setStateValue(value);
    }
  }

  return (
    <Wrapper>
      <HiddenSelect {...props} value={value} onChange={handleChange}>
        {children}
      </HiddenSelect>
      <FakeSelect className={className} aria-hidden>
        {valueItem?.props?.children || items[0]?.props?.children}
        <ChevronHandle />
      </FakeSelect>
    </Wrapper>
  );
};

const Wrapper = styled.span`
  position: relative;
  display: inline-block;
  z-index: 0;
`;

const HiddenSelect = styled.select`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  z-index: 1;
`;

const FakeSelect = styled.span`
  border-radius: ${props => props.theme.borderRadius};
  background: ${props => props.theme.color.subtle};
  padding: 0 ${props => props.theme.spacing.medium};
  display: inline-flex;
  align-items: center;
  height: 50px;
  border: 2px solid transparent;
  transition: border 166ms ease-out;
  white-space: nowrap;

  ${HiddenSelect}:focus + & {
    border-color: ${props => props.theme.color.accent};
  }
`;

const ChevronHandle = styled(ChevronIcon)`
  margin-left: ${props => props.theme.spacing.tiny};
`;

const SelectItem = styled.option``;

export { Select, SelectItem };
