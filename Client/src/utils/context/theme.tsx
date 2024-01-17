import { Dispatch, ReactElement, createContext, useContext, useReducer } from 'react';

type Theme = "dark" | "light";

const getTheme = (): Theme => {
    const theme = localStorage.getItem("theme");

    if (theme) return theme as Theme;
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return "dark";
    else return "light";
}


const theme: Theme = getTheme();

if (theme === "dark") document.documentElement.classList.add('dark')
else document.documentElement.classList.remove('dark')

type IThemeAction = {
    type: Theme;
}

const ThemeContext = createContext<Theme>(theme);
const ThemeDispatchContext = createContext<Dispatch<IThemeAction>>(() => null);

export function useTheme() {
    return useContext(ThemeContext);
}

export function useThemeDispatch() {
    return useContext(ThemeDispatchContext);
}

function ThemeReducer(theme: Theme, action: IThemeAction): Theme {
    localStorage.setItem("theme", action.type)
    if (action.type === "dark") document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
    theme = action.type;
    return theme;
}

export default function ThemeProvider({ children }: { children: ReactElement }) {
    const [Theme, dispatchTheme] = useReducer(ThemeReducer, theme);

    return (
        <ThemeContext.Provider value={Theme}>
            <ThemeDispatchContext.Provider value={dispatchTheme}>
                {children}
            </ThemeDispatchContext.Provider>
        </ThemeContext.Provider>
    );
}
