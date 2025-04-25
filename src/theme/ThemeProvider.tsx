import React, {createContext, useContext} from 'react';
import {Palette, light} from './palette';

type ThemeContextValue = {theme: Palette};

const ThemeContext = createContext<ThemeContextValue>({theme: light});

export const ThemeProvider: React.FC<{
  value?: Palette;
  children: React.ReactNode;
}> = ({value = light, children}) => (
  <ThemeContext.Provider value={{theme: value}}>
    {children}
  </ThemeContext.Provider>
);

/** 어디서든 사용: const {theme} = useTheme(); */
export const useTheme = () => useContext(ThemeContext);
