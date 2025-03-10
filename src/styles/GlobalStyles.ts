import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    font-family: ${({ theme }) => theme.font.family.primary};
    font-size: 16px;
    line-height: 1.5;
    color: ${({ theme }) => theme.colors.text};
    background-color: ${({ theme }) => theme.colors.background};
    transition: background-color ${({ theme }) => theme.transitions.normal}, color ${({ theme }) => theme.transitions.normal};
  }

  body {
    overflow-x: hidden;
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    transition: color ${({ theme }) => theme.transitions.fast};

    &:hover {
      color: ${({ theme }) => theme.colors.secondary};
    }
  }

  button, input, select, textarea {
    font-family: inherit;
    font-size: inherit;
    color: inherit;
    outline: none;
  }

  button {
    cursor: pointer;
    border: none;
    background: none;
  }

  ul, ol {
    list-style: none;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  .dragging {
    opacity: 0.8;
    transform: scale(1.02);
    z-index: 1;
  }
`;

export default GlobalStyles; 