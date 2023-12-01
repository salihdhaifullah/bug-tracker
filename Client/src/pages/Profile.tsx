import { useParams } from "react-router-dom";
import { useEffect } from "react";
import Content from '../components/utils/Content';
import useFetchApi from "../utils/hooks/useFetchApi";
import CircleProgress from "../components/utils/CircleProgress";
import { useUser } from "../utils/context/user";
import Image from "../components/myProfile/Image";
import Bio from "../components/myProfile/Bio";
import Projects from "./Projects";

export interface IProfilePageResult {
  bio: string;
  avatarUrl: string;
  name: string;
}

const Profile = () => {
  const { userId } = useParams();
  const user = useUser();
  const [payload, call] = useFetchApi<IProfilePageResult>("GET", `user/profile-page/${userId}`)

  useEffect(() => { call() }, [])

  return payload.isLoading ? <CircleProgress size="lg" /> : payload.result === null ? null : (
    <section className="lg:grid lg:grid-cols-7 flex flex-col gap-2 w-full h-full mt-10 p-2">


      <div className="flex flex-col col-span-2 h-fit justify-center items-center my-2">
        <div className="flex flex-col  h-auto w-fit px-2 sm:px-4 md:px-8 lg:px-2 gap-2 rounded-2xl justify-center items-center bg-white dark:bg-black py-2 shadow-lg dark:shadow-secondary/40">
          <Image user={payload.result} />
          <h1 className="text-gray-800 dark:text-gray-200 font-medium text-2xl">{payload.result.name}</h1>
          <Bio />
        </div>
      </div>

      <div className="flex flex-col mb-6 col-span-5 items-center justify-center gap-4 w-full h-auto">
        <div className="bg-white dark:bg-black rounded-lg shadow-lg w-full h-fit p-2 lg:m-3 mb-3 dark:shadow-secondary/40">
          <Content editable={user !== null && user.id === userId} url={`user/profile/${userId}`} />
        </div>

        <Projects />
      </div>


    </section>
  )
}

export default Profile;
