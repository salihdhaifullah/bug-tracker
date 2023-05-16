import { useState } from 'react';
import { FaBars } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import { BiLogOut, BiLogIn } from 'react-icons/bi';

import { Link } from 'react-router-dom';

import { useUser, useUserDispatch } from "../../utils/context/user"
import useFetchApi from "../../utils/hooks/useFetchApi";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const user = useUser();
    const userDispatch = useUserDispatch();
    const [_, call] = useFetchApi("GET", "auth/logout", []);

    const handelLogout = () => {
        call();
        userDispatch({ type: "logout" })
    }

    return (
        <>
            <div className='flex flex-col items-center justify-center'>
                <FaBars onClick={() => setIsOpen((prev) => !prev)} className="text-4xl text-gray-600 p-1 cursor-pointer rounded-md hover:text-gray-700 hover:bg-slate-200" />
            </div>

            <div
                className={`${isOpen ? "right-0" : "-right-60"} absolute top-0 transition-all p-2 ease-in-out bg-white rounded-sm shadow-md h-screen w-60`}>
                <div className='w-full h-fit flex justify-between items-center'>

                    {user && (
                        <img
                            className="rounded-full shadow-md w-10 h-10 object-contain"
                            src={`/api/files/public/${user.imageId}`}
                            alt={user.fullName} />
                    )}

                    <MdClose onClick={() => setIsOpen((prev) => !prev)} className="text-4xl text-gray-600 p-1 cursor-pointer rounded-md hover:text-gray-700 hover:bg-slate-200" />

                </div>


                <div className='flex flex-col mt-4 gap-2 w-full h-full flex-grow'>
                    {!user ? (
                        <Link
                            to="/auth/login"
                            className="text-primary hover:bg-slate-200 transition-all ease-in-out rounded-md text-xl p-2 flex-row flex gap-2 items-center ">
                           <BiLogIn /> <p>login</p>
                        </Link>
                    ) : (
                        <button onClick={handelLogout}
                            className="text-primary hover:bg-slate-200 transition-all ease-in-out rounded-md text-xl p-2 flex-row flex gap-2 items-center ">
                            <BiLogOut /> <p>logout</p>
                        </button>
                    )}
                </div>
            </div>
        </>
    )
}

export default Sidebar;
