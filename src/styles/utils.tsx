import { css, StyledProps } from 'styled-components';
import { Font, Spacing } from 'themes/base';

type Size = number | string;

export type SizeProps = {
  width?: Size;
  maxWidth?: Size;
  minWidth?: Size;
  height?: Size;
  maxHeight?: Size;
  minHeight?: Size;
};

export function size() {
  return css`
    width: ${getSizeValue('width')};
    max-width: ${getSizeValue('maxWidth')};
    min-width: ${getSizeValue('minWidth')};
    height: ${getSizeValue('height')};
    max-height: ${getSizeValue('maxHeight')};
    min-height: ${getSizeValue('minHeight')};
  `;
}

export function getSizeValue<P>(prop: keyof SizeProps) {
  return (props: StyledProps<P & SizeProps>) => {
    const value = props[prop];

    return value != null
      ? `${value}${typeof value === 'number' ? 'px' : ''}`
      : undefined;
  };
}

export type FontProps = {
  font?: Font;
};

export function font<P>(props: StyledProps<P & FontProps>) {
  return css`
    font-size: ${props.font && props.theme.font[props.font].size};
    font-family: ${props.font && props.theme.font[props.font].family};
    line-height: ${props.font && props.theme.font[props.font].line};
  `;
}

type SpacingValue = Array<'auto' | 0 | Spacing>;

export type SpacingProps = {
  margin?: SpacingValue;
  padding?: SpacingValue;
};

export function spacing<P>(props: StyledProps<P & SpacingProps>) {
  const getValue = (prop: keyof SpacingProps) => {
    const spacing = props[prop];

    return spacing
      ? spacing
          .map(s => (s ? (s === 'auto' ? s : props.theme.spacing[s]) : 0))
          .join(' ')
      : undefined;
  };

  return css`
    padding: ${getValue('padding')};
    margin: ${getValue('margin')};
  `;
}

export const visuallyHidden = css`
  position: absolute;
  clip: rect(1px, 1px, 1px, 1px);
  overflow: hidden;
  height: 1px;
  width: 1px;
`;
