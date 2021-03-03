export const theme = {
  borderRadius: '4px',
  breakpoints: {
    medium: '650px',
  },
  color: {
    primary: '#17213B',
    secondary: '#2F61DE',
    tertiary: '#EFF2F9',
    accent: '#1FC833',
    danger: '#DF2C29',
    text: '#4E4E4E',
    textOnPrimary: '#ffffff',
    textSubtle: '#BABAB8',
    background: '#ffffff',
    subtle: '#F3F3F3',
  },
  spacing: {
    tiny: '5px',
    small: '10px',
    medium: '20px',
    large: '40px',
    xlarge: '60px',
  },
  font: {
    tiny: {
      family: 'Roboto',
      size: '12px',
      line: 1.16,
    },
    small: {
      family: 'Roboto',
      size: '14px',
      line: 1.14,
    },
    normal: {
      family: 'Roboto',
      size: '18px',
      line: 1.16,
    },
    large: {
      family: 'Roboto',
      size: '20px',
      line: 1.2,
    },
    xlarge: {
      family: 'Roboto',
      size: '36px',
      line: 1.16,
    },
  },
  weight: {
    light: 300,
    normal: 400,
    medium: 500,
    bold: 700,
  },
};

export type Color = keyof typeof theme.color;
export type Spacing = keyof typeof theme.spacing;
export type Font = keyof typeof theme.font;
export type Weight = keyof typeof theme.weight;
