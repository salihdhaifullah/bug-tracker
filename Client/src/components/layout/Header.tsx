import { Link } from "react-router-dom"
import Sidebar from "./Sidebar";
import { useUser } from "../../utils/context/user";
import { MdOutlineNotifications } from "react-icons/md"
import { FaMoon, FaSun } from "react-icons/fa";
import useTheme from "../../utils/hooks/useTheme";


const Header = () => {
    const user = useUser();
    const [isDark, setIsDark] = useTheme();

    return (
        <header className="flex flex-row fixed top-0 w-full min-h-[8vh] z-[11] justify-between items-center text-primary dark:bg-black bg-white p-2 shadow-lg dark:shadow-secondary">
            <div className="flex flex-row gap-2">
                <Sidebar />
                <Link to="/" className="flex flex-row justify-center items-center">
                    <img src="/logo.svg" alt="Buegee" title="Buegee" className="w-20 h-10 object-contain" />
                    <p className="text-primary dark:text-secondary text-xl font-bold">Buegee</p>
                </Link>
            </div>

            {user && (
                <div className="flex flex-row justify-center gap-4 items-center">

                    <div className="flex justify-center cursor-pointer items-center dark:text-secondary rounded-md hover:bg-slate-300 p-1 dark:hover:bg-slate-700 text-primary font-bold text-2xl">
                        <MdOutlineNotifications />
                    </div>

                    <div onClick={() => setIsDark((prev) => !prev)} className="flex dark:text-secondary p-1 dark:hover:bg-slate-700 justify-center cursor-pointer items-center rounded-md hover:bg-slate-300 text-primary font-bold text-2xl">
                        {isDark ? <FaMoon /> : <FaSun />}
                    </div>

                    <div className="flex justify-center items-center">
                        <img
                            className="rounded-full dark:shadow-secondary shadow-md w-8 h-8 object-contain"
                            src={user.imageUrl}
                            alt={user.name} />

                    </div>
                </div>
            )}
        </header>
    )
}

export default Header;
