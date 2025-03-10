import 'styled-components';
import { DefaultTheme } from 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
      success: string;
      danger: string;
      warning: string;
      info: string;
      light: string;
      dark: string;
      background: string;
      text: string;
      border: string;
      modalOverlay: string;
      columnBackground: string;
      taskBackground: string;
      lowPriority: string;
      mediumPriority: string;
      highPriority: string;
      inputBackground: string;
      hover: string;
    };
    font: {
      family: {
        primary: string;
      };
      size: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
        xxl: string;
      };
      weight: {
        light: number;
        regular: number;
        medium: number;
        semiBold: number;
        bold: number;
      };
    };
    spacing: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      xxl: string;
    };
    borderRadius: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
      xxl: string;
    };
    shadows: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    transitions: {
      fast: string;
      normal: string;
      slow: string;
    };
    zIndex: {
      modal: number;
      dropdown: number;
      header: number;
    };
  }
} 