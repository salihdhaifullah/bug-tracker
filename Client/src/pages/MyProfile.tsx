import { useNavigate } from "react-router-dom";
import { useUser } from "../utils/context/user"
import { useEffect } from "react";
import Image from '../components/myProfile/Image';
import Bio from '../components/myProfile/Bio';
import Content from '../components/utils/Content';

const MyProfile = () => {
    const user = useUser();
    const navigate = useNavigate();

    useEffect(() => { user === null ?? navigate("/auth/login") }, [user])

    return !user ? null : (
        <section className="flex flex-col lg:flex-row justify-between gap-2 w-full h-full flex-grow mt-10 p-2">
            <div className="flex flex-col w-full lg:w-fit lg:h-[60vh] h-auto justify-center items-center lg:justify-start my-2">
                <div className="flex flex-col h-auto w-fit px-2 sm:px-4 md:px-8 lg:px-2 gap-2 rounded-2xl justify-center items-center bg-white dark:bg-black py-2 shadow-lg dark:shadow-secondary">
                    <Image />
                    <h1 className="text-gray-800 dark:text-gray-200 font-medium text-2xl">{user.name}</h1>
                    <Bio />
                </div>
            </div>
            <div className="bg-white dark:bg-black rounded-lg shadow-lg w-full h-fit p-2 lg:m-3 mb-3 dark:shadow-secondary">
                <Content editable url={`user/profile/${user.id}`} />
            </div>
        </section>
    )
}

export default MyProfile;
