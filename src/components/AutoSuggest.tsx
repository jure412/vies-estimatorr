import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import uniqid from 'uniqid';
import { Input } from './Input';

const KEY = {
  DOWN: 40,
  UP: 38,
  ESCAPE: 27,
  ENTER: 13,
};

type Props = TextboxProps & {
  search: string;
  selection: string;
  onSearchChange?: (search: string) => void;
  onSelectionChange?: (selection: string) => void;
};

const AutoSuggest: React.FC<Props> = ({
  search,
  selection,
  onSearchChange = () => {},
  onSelectionChange = () => {},
  children,
  ...props
}) => {
  const blurRef = useRef<number>(0);
  const { current: id } = useRef<string>(uniqid());
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const isOpen = activeIndex != null;

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const search = event.target.value;

    onSearchChange(search);
    setActiveIndex(search ? 0 : null);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    const key = event.keyCode;

    switch (key) {
      case KEY.ESCAPE:
        onSearchChange('');
        close();
        break;
      case KEY.UP:
      case KEY.DOWN:
        setActiveIndex(activeIndex => {
          if (activeIndex != null) {
            const nextIndex = activeIndex + (key === KEY.DOWN ? 1 : -1);
            const constrainedIndex = nextIndex % React.Children.count(children);
            return constrainedIndex > 0 ? constrainedIndex : 0;
          }
          return activeIndex;
        });
        break;
      case KEY.ENTER:
        const matches = React.Children.toArray(children);
        const child = activeIndex != null && matches[activeIndex];
        const selection = React.isValidElement(child) && child.props.value;

        if (selection) {
          event.preventDefault();
          onSelectionChange(selection);
          close();
        }

        break;
    }
  }

  function handleBlur() {
    blurRef.current = setTimeout(() => {
      if (!selection) {
        onSearchChange('');
      }

      close();
    }, 250);
  }

  function close() {
    setActiveIndex(null);
  }

  return (
    <Wrapper>
      <Combobox expanded={isOpen} aria-owns={`${id}-listbox`}>
        <Textbox
          {...props}
          id={`${id}-input`}
          aria-labelledby={`${id}-label`}
          aria-controls={`${id}-listbox`}
          aria-activedescendant={
            isOpen ? `${id}-item-${activeIndex}` : undefined
          }
          expanded={isOpen}
          value={selection || search}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
        />
      </Combobox>

      {isOpen && (
        <Items id={`${id}-listbox`} aria-labelledby={`${id}-label`}>
          {React.Children.map(children, (child, index) => {
            return (
              React.isValidElement(child) &&
              React.cloneElement(child, {
                id: `${id}-item-${index}`,
                focus: activeIndex != null && activeIndex === index,
                onClick: (selection: string) => {
                  clearTimeout(blurRef.current);
                  onSelectionChange(selection);
                  close();
                },
              })
            );
          })}
          {React.Children.count(children) === 0 && (
            <EmptyMessage>
              Sorry, we are unable to match `{search}` in our system. Please
              contact us to place your order.
            </EmptyMessage>
          )}
        </Items>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
  border-radius: ${props => props.theme.borderRadius};
`;

type ComboboxProps = {
  expanded?: boolean;
};

const Combobox = styled.div.attrs<ComboboxProps>(props => ({
  role: 'combobox',
  'aria-expanded': props.expanded || false,
  'aria-haspopup': 'listbox',
}))<ComboboxProps>``;

type TextboxProps = {
  expanded?: boolean;
};

const Textbox = styled(Input).attrs<TextboxProps>(() => ({
  'aria-autocomplete': 'list',
}))<TextboxProps>`
  &,
  &:focus {
    border-radius: ${props => props.theme.borderRadius};
    border: ${props =>
      props.expanded && `2px solid ${props.theme.color.accent}`};
    border-bottom-color: ${props => props.expanded && 'transparent'};
    border-bottom-left-radius: ${props => props.expanded && 0};
    border-bottom-right-radius: ${props => props.expanded && 0};
  }
`;

const Items = styled.ul.attrs(() => ({
  role: 'listbox',
}))`
  background: ${props => props.theme.color.background};
  border-radius: ${props => props.theme.borderRadius};
  border: 2px solid ${props => props.theme.color.accent};
  box-shadow: 0 12px 10px -10px rgba(0, 0, 0, 0.2);
  border-top: 0;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  position: absolute;
  margin-top: -2px;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 1;
  max-height: 200px;
  overflow-y: auto;
`;

type ItemProps = React.ComponentProps<typeof ItemWrapper> & {
  value: string;
  index?: number;
};

const AutoSuggestItem: React.FC<ItemProps> = ({
  children,
  value,
  focus,
  onClick = () => {},
  ...props
}) => {
  const ref = useRef<HTMLInputElement | null>();

  useEffect(() => {
    if (focus && ref.current) {
      ref.current.scrollIntoView(false);
    }
  }, [focus]);

  return (
    <ItemWrapper
      {...props}
      ref={ref}
      focus={focus}
      onClick={() => onClick(value)}
    >
      {children}
    </ItemWrapper>
  );
};

type ItemWrapperProps = React.ComponentProps<'li'> & {
  focus?: boolean;
};

const ItemWrapper = styled.li.attrs(() => ({
  role: 'option',
}))<ItemWrapperProps>`
  padding: ${props => props.theme.spacing.medium};
  font-weight: ${props => props.theme.weight.medium};
  color: ${props =>
    props.focus ? props.theme.color.accent : props.theme.color.text};
  transition: color 166ms ease-out;

  & + & {
    padding-top: 0;
  }

  &:hover {
    color: ${props => props.theme.color.accent};
  }
`;

const EmptyMessage = styled.li`
  padding: ${props => props.theme.spacing.medium};
  color: ${props => props.theme.color.textSubtle};
`;

export { AutoSuggest, AutoSuggestItem };
