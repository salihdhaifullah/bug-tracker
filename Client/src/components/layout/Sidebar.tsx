import { useState } from 'react';
import { HiBars3 } from 'react-icons/hi2';
import { MdClose, MdOutlineCreateNewFolder } from 'react-icons/md';
import { BiLogOut, BiLogIn } from 'react-icons/bi';
import { CgProfile } from 'react-icons/cg';
import { Link } from 'react-router-dom';
import { useUser, useUserDispatch } from "../../utils/context/user"
import useFetchApi from "../../utils/hooks/useFetchApi";
import { GrProjects } from 'react-icons/gr';
import Button from '../../components/utils/Button';

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

            <div className={`${isOpen ? "right-0" : "-right-60"} fixed top-0 transition-all p-2 ease-in-out bg-white rounded-sm shadow-md h-screen w-60`}>
                <div className='w-full h-fit flex justify-between items-center'>

                    <img
                        className="rounded-full shadow-md w-10 h-10 object-contain"
                        src={user.imageUrl}
                        alt={user.name} />

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


                    <Button
                        onClick={callLogout}
                        isLoading={logoutPayload.isLoading}
                        className="!text-primary !bg-white hover:!bg-slate-200 !shadow-none font-normal text-xl p-2 flex-row flex gap-2 items-center">
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
