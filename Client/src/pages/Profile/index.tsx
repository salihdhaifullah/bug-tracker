import { Link, useParams } from "react-router-dom";
import { useEffect, useLayoutEffect, useState } from "react";
import Content from '../../components/utils/Content';
import useFetchApi from "../../utils/hooks/useFetchApi";
import CircleProgress from "../../components/utils/CircleProgress";
import { useUser } from "../../utils/context/user";
import Image from "./Image";
import Bio from "./Bio";
import Button from "../../components/utils/Button";
import { TbFolders } from "react-icons/tb";

export interface IProfileResult {
  bio: string;
  avatarUrl: string;
  name: string;
}

const Profile = () => {
  const {  userId } = useParams();
  const user = useUser();
  const [payload, call] = useFetchApi<IProfileResult>("GET", `users/${userId}`)

  useLayoutEffect(() => { call() }, [call])

  const [editable, setEditable] = useState(user !== null && user.id === userId);

  useEffect(() => {
    setEditable(user !== null && user.id === userId)
  }, [user, userId])

  return payload.isLoading ? <CircleProgress size="lg" /> : payload.result === null ? null : (
    <section className="flex flex-col gap-2 w-full h-full mt-10 p-2">

      <div className="flex flex-row justify-end w-full items-center">
        <Link to={`/users/${userId}/projects`}>
          <Button size="lg" className="flex-row flex justify-center items-center gap-1">
            <TbFolders />
            <p>projects</p>
          </Button>
        </Link>
      </div>

      <div className="lg:grid lg:grid-cols-8 flex flex-col gap-2 w-full h-full">

        <div className="flex flex-col col-span-3 h-fit justify-center items-center my-2">
          <div className="flex flex-col h-auto w-fit px-4 gap-2 rounded-2xl justify-center items-center bg-white dark:bg-black py-2 shadow-lg dark:shadow-secondary/40">
            <Image data={payload.result} editable={editable} />
            <h1 className="text-gray-800 dark:text-gray-200 font-medium text-2xl">{payload.result.name}</h1>
            <Bio bio={payload.result.bio} userId={userId as string} editable={editable} />
          </div>
        </div>

        <div className="flex flex-col mb-6 col-span-5 items-center justify-center gap-4 w-full h-auto">
          <div className="bg-white dark:bg-black rounded-lg shadow-lg w-full h-fit p-2 lg:m-3 mb-3 dark:shadow-secondary/40">
            <Content editable={editable} url={`users/${userId}/content`} />
          </div>
        </div>

      </div>
    </section>

  )
}

export default Profile;
