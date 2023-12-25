import { FaMoon, FaSun } from "react-icons/fa";
import { useTheme, useThemeDispatch } from "../../utils/context/theme";
import { BiLogOut, BiLogIn } from 'react-icons/bi';
import { Link, useNavigate } from 'react-router-dom';
import { useUser, useUserDispatch } from "../../utils/context/user"
import useFetchApi from "../../utils/hooks/useFetchApi";
import ButtonBase from "../utils/ButtonBase";
import { useState } from "react";
import SearchFiled from "../utils/SearchFiled";
import useQuery from "../../utils/hooks/useQuery";
import { MdMoreVert } from "react-icons/md";
import Modal from "../utils/Modal";

const Header = () => {
    const user = useUser();
    const theme = useTheme();
    const query = useQuery();
    const [search, setSearch] = useState(query.get("search") || "");
    const themeDispatch = useThemeDispatch();
    const navigate = useNavigate();
    const userDispatch = useUserDispatch();
    const [logoutPayload, callLogout] = useFetchApi("DELETE", "auth/logout", [], () => {
        userDispatch({ type: "logout" })
        setIsOpenModal(false)
    });

    const handelSearch = () => {
        setIsOpenModal(false)
        navigate(`/search?search=${search}`)
    }

    const [isOpenModal, setIsOpenModal] = useState(false)

    return (
        <header className="flex flex-row fixed top-0 w-full z-[11] justify-between items-center text-primary dark:bg-black bg-white p-2 shadow-lg dark:shadow-secondary/40">
            <div className="flex flex-row gap-2 justify-between sm:justify-normal w-full sm:w-auto">
                <Link to="/" className="flex flex-row justify-center items-center">
                    <img src="/logo.svg" alt="Buegee" title="Buegee" className="w-20 h-10 object-contain" />
                    <p className="text-primary dark:text-secondary text-xl font-bold">Buegee</p>
                </Link>

                <div className="flex sm:hidden flex-row gap-4">
                    <div onClick={() => setIsOpenModal(true)} className="flex dark:text-secondary p-1 h-fit self-center dark:hover:bg-slate-700 justify-center cursor-pointer items-center rounded-md hover:bg-slate-300 text-primary font-bold text-xl">
                        <MdMoreVert />
                    </div>

                    {user && (
                        <div className="flex justify-center items-center">
                            <Link to={`/users/${user.id}`} title="your profile">
                                <img
                                    className="rounded-full dark:shadow-secondary/40 shadow-md w-8 h-8 object-cover"
                                    src={user.avatarUrl}
                                    alt={user.name} />
                            </Link>
                        </div>
                    )}
                </div>

                <div className="sm:flex hidden">

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
            </div>

            <div className="sm:flex hidden flex-row justify-center gap-4 items-center">

                <div className="max-w-[400px]">
                    <SearchFiled onClick={handelSearch} label="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>

                <div
                    onClick={() => themeDispatch({ type: theme === "dark" ? "light" : "dark" })}
                    className="flex dark:text-secondary p-1 dark:hover:bg-slate-700 justify-center cursor-pointer items-center rounded-md hover:bg-slate-300 text-primary font-bold text-2xl">
                    {theme === "dark" ? <FaMoon /> : <FaSun />}
                </div>

                {user && (
                    <div className="flex justify-center items-center">
                        <Link to={`/users/${user.id}`} title="your profile">
                            <img
                                className="rounded-full dark:shadow-secondary/40 shadow-md w-8 h-8 object-cover"
                                src={user.avatarUrl}
                                alt={user.name} />
                        </Link>
                    </div>
                )}
            </div>


            <Modal isOpen={isOpenModal} setIsOpen={setIsOpenModal}>
                <div className="rounded-xl bg-white dark:bg-black h-full flex-1 flex flex-col gap-4 p-2 items-start justify-evenly">

                    <ButtonBase
                        onClick={() => {
                            setIsOpenModal(false)
                            themeDispatch({ type: theme === "dark" ? "light" : "dark" })
                        }} className="w-full text-primary dark:text-secondary hover:bg-slate-200 dark:hover:bg-slate-800 transition-all ease-in-out rounded-md text-xl flex-row flex gap-1 items-center">
                        {theme === "dark" ? <FaMoon /> : <FaSun />}
                        <p>change theme</p>
                    </ButtonBase>

                    {user === null ? (
                        <Link
                            to="/auth/login"
                            onClick={() => setIsOpenModal(false)}
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
            </Modal>
        </header>
    )
}

export default Header;
