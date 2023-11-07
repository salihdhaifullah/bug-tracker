import { Link } from "react-router-dom"
import Sidebar from "./Sidebar";
import { useUser } from "../../utils/context/user";
import { MdOutlineNotifications } from "react-icons/md"
import { useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

const Header = () => {
    const user = useUser();
    const [isDark, setIsDark] = useState(false)

    return (
        <header className="flex flex-row fixed top-0 w-full min-h-[8vh] z-[11] justify-between items-center text-primary border-b-gray-600 bg-white p-2 shadow-xl">
            <div className="flex flex-row gap-2">
                <Sidebar />
                <Link to="/" className="flex flex-row justify-center items-center">
                    <img src="/logo.svg" alt="Buegee" title="Buegee" className="w-20 h-10 object-contain" />
                    <p className="text-primary text-xl font-bold">Buegee</p>
                </Link>
            </div>

            {user && (
                <div className="flex flex-row justify-center gap-4 items-center">

                    <div className="flex justify-center cursor-pointer items-center rounded-sm hover:bg-slate-300 text-primary font-bold text-2xl">
                        <MdOutlineNotifications />
                    </div>

                    <div onClick={() => setIsDark((prev) => !prev)} className="flex justify-center cursor-pointer items-center rounded-sm hover:bg-slate-300 text-primary font-bold text-2xl">
                       {isDark ? <FaMoon /> : <FaSun /> }
                    </div>
                    
                    <div className="flex justify-center items-center">
                        <img
                            className="rounded-full shadow-md w-8 h-8 object-contain"
                            src={user.imageUrl}
                            alt={user.name} />

                    </div>
                </div>
            )}
        </header>
    )
}

export default Header;
