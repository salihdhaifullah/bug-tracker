import { useState } from 'react';
import { HiBars3 } from 'react-icons/hi2';
import { MdClose, MdDashboardCustomize, MdOutlineCreateNewFolder } from 'react-icons/md';
import { BiLogOut, BiLogIn } from 'react-icons/bi';
import { CgProfile } from 'react-icons/cg';
import { Link } from 'react-router-dom';
import { useUser, useUserDispatch } from "../../utils/context/user"
import useFetchApi from "../../utils/hooks/useFetchApi";
import { GrProjects } from 'react-icons/gr';
import Button from '../../components/utils/Button';
import { FaTasks } from 'react-icons/fa';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const user = useUser();
    const userDispatch = useUserDispatch();
    const [logoutPayload, callLogout] = useFetchApi("GET", "auth/logout", [], () => {
        userDispatch({ type: "logout" })
        setIsOpen(false)
    });

    return user ? (
        <>
            <div className='flex flex-col items-center justify-center'>
                <HiBars3 onClick={() => setIsOpen(true)} className="text-4xl text-gray-600 p-1 cursor-pointer rounded-md hover:text-gray-700 hover:bg-slate-200" />
            </div>

            <div className={`${isOpen ? "left-0" : "-left-60"} fixed top-0 transition-all p-2 ease-in-out bg-white rounded-sm shadow-md h-screen w-60`}>
                <div className='w-full h-fit flex justify-between items-center'>

                    <Link to="/" className="flex flex-row justify-center items-center">
                        <img src="/logo.svg" alt="Buegee" title="Buegee" className="w-20 h-10 object-contain" />
                        <p className="text-primary text-xl font-bold">Buegee</p>
                    </Link>

                    <MdClose onClick={() => setIsOpen(false)} className="text-4xl text-gray-600 p-1 cursor-pointer rounded-md hover:text-gray-700 hover:bg-slate-200" />
                </div>


                <div className='flex flex-col mt-4 gap-2 w-full h-full flex-grow'>
                    <Link
                        to="/my-profile"
                        onClick={() => setIsOpen(false)}
                        className="text-primary hover:bg-slate-200 transition-all ease-in-out rounded-md text-xl p-2 flex-row flex gap-2 items-center ">
                        <CgProfile /> <p>your profile</p>
                    </Link>

                    <Link
                        to="/create-project"
                        onClick={() => setIsOpen(false)}
                        className="text-primary hover:bg-slate-200 transition-all ease-in-out rounded-md text-xl p-2 flex-row flex gap-2 items-center ">
                        <MdOutlineCreateNewFolder /> <p>create project</p>
                    </Link>

                    <Link
                        to="/projects"
                        onClick={() => setIsOpen(false)}
                        className="text-primary hover:bg-slate-200 transition-all ease-in-out rounded-md text-xl p-2 flex-row flex gap-2 items-center ">
                        <GrProjects /> <p>your projects</p>
                    </Link>

                    <Link
                        to="/dashboard"
                        onClick={() => setIsOpen(false)}
                        className="text-primary hover:bg-slate-200 transition-all ease-in-out rounded-md text-xl p-2 flex-row flex gap-2 items-center ">
                        <MdDashboardCustomize /> <p>dashboard</p>
                    </Link>

                    <Link
                        to="/my-tasks"
                        onClick={() => setIsOpen(false)}
                        className="text-primary hover:bg-slate-200 transition-all ease-in-out rounded-md text-xl p-2 flex-row flex gap-2 items-center ">
                        <FaTasks /> <p>your tasks</p>
                    </Link>

                    <Button
                        onClick={callLogout}
                        isLoading={logoutPayload.isLoading}
                        className="!text-primary w-full !bg-white hover:!bg-slate-200 !shadow-none font-normal text-xl p-2 flex-row flex gap-2 items-center">
                        <BiLogOut />
                        <p>logout</p>
                    </Button>
                </div>

            </div>
        </>
    ) : (
        <Link
            to="/auth/login"
            onClick={() => setIsOpen(false)}
            className="text-primary hover:bg-slate-200 transition-all ease-in-out rounded-md text-xl p-2 flex-row flex gap-2 items-center ">
            <BiLogIn /> <p>login</p>
        </Link>
    )
}

export default Sidebar;
