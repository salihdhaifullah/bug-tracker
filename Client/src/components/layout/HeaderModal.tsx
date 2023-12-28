import { FaMoon, FaSun } from "react-icons/fa";
import { BiLogOut, BiLogIn } from 'react-icons/bi';
import { Link, useNavigate } from 'react-router-dom';
import ButtonBase from "../utils/ButtonBase";
import SearchFiled from "../utils/SearchFiled";
import { useTheme, useThemeDispatch } from "../../utils/context/theme";
import { useModalDispatch } from "../../utils/context/modal";
import { useUser, useUserDispatch } from "../../utils/context/user";
import useQuery from "../../utils/hooks/useQuery";
import { useState } from "react";
import useFetchApi from "../../utils/hooks/useFetchApi";

const HeaderModal = () => {
    const themeDispatch = useThemeDispatch()
    const dispatchModal = useModalDispatch()
    const userDispatch = useUserDispatch();

    const theme = useTheme();
    const user = useUser();
    const query = useQuery();

    const [search, setSearch] = useState(query.get("search") || "");

    const navigate = useNavigate();

    const [logoutPayload, callLogout] = useFetchApi("DELETE", "auth/logout", [], () => {
        userDispatch({ type: "logout" })
        dispatchModal({ payload: null, type: "close" })
    });

    const handelSearch = () => {
        navigate(`/search?search=${search}`)
        dispatchModal({payload: null, type: "close"})
    }

    const handelTheme = () => {
        themeDispatch({ type: theme === "dark" ? "light" : "dark" })
        dispatchModal({ payload: null, type: "close" })
    }

    return (
        <div className="rounded-xl bg-white dark:bg-black h-full flex-1 flex flex-col gap-4 p-2 items-start justify-evenly">

            <ButtonBase
                onClick={() => handelTheme()}
                className="w-full text-primary dark:text-secondary hover:bg-slate-200 dark:hover:bg-slate-800 transition-all ease-in-out rounded-md text-xl flex-row flex gap-1 items-center">
                {theme === "dark" ? <FaMoon /> : <FaSun />}
                <p>change theme</p>
            </ButtonBase>

            {user === null ? (
                <Link
                    to="/auth/login"
                    onClick={() => dispatchModal({ payload: null, type: "close" })}
                    className="w-full text-primary dark:text-secondary hover:bg-slate-200 dark:hover:bg-slate-800 transition-all ease-in-out rounded-md text-xl flex-row flex gap-1 items-center">
                    <BiLogIn /> <p>login</p>
                </Link>
            ) : (
                <ButtonBase
                    onClick={() => callLogout()}
                    isLoading={logoutPayload.isLoading}
                    className="w-full text-primary dark:text-secondary hover:bg-slate-200 dark:hover:bg-slate-800 transition-all ease-in-out rounded-md text-xl flex-row flex gap-1 items-center">
                    <BiLogOut />
                    <p>logout</p>
                </ButtonBase>
            )}

            <div className="w-full">
                <SearchFiled onClick={handelSearch} label="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>

        </div>
    )
}

export default HeaderModal;
