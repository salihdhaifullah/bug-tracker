import { useNavigate } from "react-router-dom";
import { useUser } from "../utils/context/user"
import { useEffect } from "react";
import Image from '../components/profile/Image';
import Title from '../components/profile/Title';
import Content from '../components/profile/Content';

const MyProfile = () => {
    const user = useUser();
    const navigate = useNavigate();

    useEffect(() => { user === null ?? navigate("/auth/login") }, [user])

    return !user ? null : (
        <section className="flex flex-col lg:flex-row justify-between gap-2 w-full h-full flex-grow p-2">
            <div className="flex flex-col w-full lg:w-fit lg:h-[70vh] h-auto justify-center items-center lg:justify-start my-2">
                <div className="flex flex-col w-fit px-2 sm:px-4 md:px-8 lg:px-2 gap-2 rounded-2xl justify-center items-center bg-white py-2">
                    <Image />
                    <h1 className="text-gray-800 font-medium text-2xl">{user.fullName}</h1>
                    <Title />
                    <hr className="bg-gray-500 w-full h-[2px] rounded-md" />
                </div>
            </div>
            <Content />
        </section>
    )
}

export default MyProfile;
