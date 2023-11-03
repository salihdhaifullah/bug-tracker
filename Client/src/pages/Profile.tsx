import { useParams } from "react-router-dom";
import { useEffect } from "react";
import Content from '../components/utils/Content';
import useFetchApi from "../utils/hooks/useFetchApi";
import CircleProgress from "../components/utils/CircleProgress";

interface IProfilePageResult {
  bio: string;
  imageUrl: string;
  name: string;
}

const Profile = () => {
  const { userId } = useParams();
  const [payload, call] = useFetchApi<IProfilePageResult>("GET", `user/profile-page/${userId}`)

  useEffect(() => { call() }, [])

  return payload.isLoading || !payload.result ? <CircleProgress size="lg"/> : (
    <section className="flex flex-col lg:flex-row justify-between gap-2 w-full h-full flex-grow p-2">
      <div className="flex flex-col w-full lg:w-fit lg:h-[60vh] justify-center items-center lg:justify-start my-2">
        <div className="flex flex-col h-full w-fit px-2 sm:px-4 md:px-8 lg:px-2 gap-2 rounded-2xl justify-center items-center bg-white py-2">
          <img
            title="change image"
            className="rounded-full cursor-pointer shadow-md w-60 h-60 object-contain"
            src={payload.result.imageUrl}
            alt={payload.result.name} />

          <h1 className="text-gray-800 font-medium text-2xl">{payload.result.name}</h1>

          <div className="w-80 h-fit grid grid-flow-col gap-1 text-center justify-center items-center">
            <p className="text-lg text-gray-800 flex break-all text-center grid-cols-3">
              {payload.result.bio}
            </p>
          </div>

          <hr className="bg-gray-500 w-full h-[2px] rounded-md" />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-2 w-full h-full flex-grow min-h-[200px] lg:m-3 mb-3 flex flex-col">
        <Content url={`user/profile/${userId}`} />
      </div>
    </section>
  )
}

export default Profile;
