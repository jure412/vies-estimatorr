import { createGlobalStyle } from 'styled-components';
import { normalize } from 'polished';

export const GlobalStyle = createGlobalStyle`
  ${normalize()};

  *,
  *:before,
  *:after {
    box-sizing: border-box;
    position: relative;
  }

  html {
    font-size: ${props => props.theme.font.normal.size};
    font-family: ${props => props.theme.font.normal.family}, sans-serif;
    font-weight: ${props => props.theme.weight.normal};
    color: ${props => props.theme.color.text};
  }


  body {
    background: ${props => props.theme.color.primary};
    min-width: 320px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #root {
    min-height: 100vh;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  h1, h2, h3, h4, h5, h6,
  input,
  select,
  textarea,
  button {
    font: inherit;
    line-height: inherit;
    -webkit-font-smoothing: inherit;
    color: inherit;
  }

  fieldset {
    border: 0;
    padding: 0;
    margin: 0;
  }

  ul,
  ol {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  svg,
  img {
    vertical-align: middle;
  }

  abbr {
    text-decoration: none !important;
    border: 0 !important;
  }

  :focus {
    /* warning to add appropriate focus styles */
    outline: 1px solid red;
  }
`;
