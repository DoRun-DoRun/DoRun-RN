import 'styled-components/native';
import {ThemeType} from './theme';

declare module 'styled-components/native' {
  export interface DefaultTheme extends ThemeType {
    black: string;
    white: string;
    gray1: string;
    gray2: string;
    gray3: string;
    gray4: string;
    gray5: string;
    gray6: string;
    gray7: string;
    primary1: string;
    primary2: string;
    secondary1: string;
    secondary2: string;
    green: string;
    red: string;
    yellow: string;
    background: string;
    undefined: null;
  }
}
