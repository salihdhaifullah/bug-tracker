import { FaMoon, FaSun } from "react-icons/fa";
import { useTheme, useThemeDispatch } from "../../utils/context/theme";
import { BiLogOut, BiLogIn } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import { useUser, useUserDispatch } from "../../utils/context/user"
import useFetchApi from "../../utils/hooks/useFetchApi";
import ButtonBase from "../utils/ButtonBase";

const Header = () => {
    const user = useUser();
    const theme = useTheme();
    const themeDispatch = useThemeDispatch();

    const userDispatch = useUserDispatch();
    const [logoutPayload, callLogout] = useFetchApi("GET", "auth/logout", [], () => {
        userDispatch({ type: "logout" })
    });

    return (
        <header className="flex flex-row fixed top-0 w-full min-h-[8vh] z-[11] justify-between items-center text-primary dark:bg-black bg-white p-2 shadow-lg dark:shadow-secondary/40">
            <div className="flex flex-row gap-2">
                <Link to="/" className="flex flex-row justify-center items-center">
                    <img src="/logo.svg" alt="Buegee" title="Buegee" className="w-20 h-10 object-contain" />
                    <p className="text-primary dark:text-secondary text-xl font-bold">Buegee</p>
                </Link>

                {user === null ? (
                    <Link
                        to="/auth/login"
                        className="w-fit text-primary dark:text-secondary hover:bg-slate-200 dark:hover:bg-slate-800 transition-all ease-in-out rounded-md text-xl flex-row flex gap-1 items-center">
                        <BiLogIn /> <p>login</p>
                    </Link>
                ) : (
                    <ButtonBase
                        onClick={() => callLogout()}
                        isLoading={logoutPayload.isLoading}
                        className="w-fit text-primary dark:text-secondary hover:bg-slate-200 dark:hover:bg-slate-800 transition-all ease-in-out rounded-md text-xl flex-row flex gap-1 items-center">
                        <BiLogOut />
                        <p>logout</p>
                    </ButtonBase>
                )}
            </div>

            <div className="flex flex-row justify-center gap-4 items-center">

                <div onClick={() => themeDispatch({ type: theme === "dark" ? "light" : "dark" })} className="flex dark:text-secondary p-1 dark:hover:bg-slate-700 justify-center cursor-pointer items-center rounded-md hover:bg-slate-300 text-primary font-bold text-2xl">
                    {theme === "dark" ? <FaMoon /> : <FaSun />}
                </div>

                {user && (
                    <div className="flex justify-center items-center">
                        <Link to={`/profile/${user.id}`} title="your profile">
                            <img
                                className="rounded-full dark:shadow-secondary/40 shadow-md w-8 h-8 object-contain"
                                src={user.avatarUrl}
                                alt={user.name} />
                        </Link>
                    </div>
                )}
            </div>
        </header>
    )
}

export default Header;
