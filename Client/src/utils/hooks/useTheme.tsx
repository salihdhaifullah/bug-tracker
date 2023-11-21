import { useEffect, useState } from "react";

const useTheme = (): [boolean, React.Dispatch<React.SetStateAction<boolean>>] => {
    const [isDark, setIsDark] = useState(false)

    useEffect(() => {
        const theme = localStorage.getItem("theme");
        if (theme && theme === "dark") {
            setIsDark(true);
            return;
        }
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setIsDark(true);
        }
    }, [])

    useEffect(() => {
        localStorage.setItem("theme", isDark ? "dark" : "light")
        if (isDark) document.documentElement.classList.add('dark')
        else document.documentElement.classList.remove('dark')
    }, [isDark])

    return [isDark, setIsDark];
}

export default useTheme;
