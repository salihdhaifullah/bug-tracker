import { Link } from "react-router-dom"
import Sidebar from "./Sidebar";
import { useUser } from "../../utils/context/user";
import { FaMoon, FaSun } from "react-icons/fa";
import { useTheme, useThemeDispatch } from "../../utils/context/theme";


const Header = () => {
    const user = useUser();
    const theme = useTheme();
    const themeDispatch = useThemeDispatch();

    return (
        <header className="flex flex-row fixed top-0 w-full min-h-[8vh] z-[11] justify-between items-center text-primary dark:bg-black bg-white p-2 shadow-lg dark:shadow-secondary/40">
            <div className="flex flex-row gap-2">
                <Sidebar />
                <Link to="/" className="flex flex-row justify-center items-center">
                    <img src="/logo.svg" alt="Buegee" title="Buegee" className="w-20 h-10 object-contain" />
                    <p className="text-primary dark:text-secondary text-xl font-bold">Buegee</p>
                </Link>
            </div>

            {user && (
                <div className="flex flex-row justify-center gap-4 items-center">

                    <div onClick={() => themeDispatch({ type: theme === "dark" ? "light" : "dark" })} className="flex dark:text-secondary p-1 dark:hover:bg-slate-700 justify-center cursor-pointer items-center rounded-md hover:bg-slate-300 text-primary font-bold text-2xl">
                        {theme === "dark" ? <FaMoon /> : <FaSun />}
                    </div>

                    <div className="flex justify-center items-center">
                        <img
                            className="rounded-full dark:shadow-secondary/40 shadow-md w-8 h-8 object-contain"
                            src={user.avatarUrl}
                            alt={user.name} />

                    </div>
                </div>
            )}
        </header>
    )
}

export default Header;
