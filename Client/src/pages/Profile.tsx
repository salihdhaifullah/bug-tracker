import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../utils/context/user"
import { ChangeEvent, useEffect, useState } from "react";
import { toWEBPImage } from "../utils";
import useFetchApi from "../utils/hooks/useFetchApi";

const Profile = () => {
  const { userId } = useParams();

  const user = useUser();
  const navigate = useNavigate();
  const [base64, setBase64] = useState("")
  const [chnage, counter] = useState(1);

  const [_, call] = useFetchApi("POST", "user/upload-profile", [base64],
  { data: base64, contentType: "webp" }, (_) => { counter((prev) => 1 + prev) });


  useEffect(() => { if (base64.length) call() }, [base64]);

  const handelChangeImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files?.item(0);
    if (file) setBase64(await toWEBPImage(file));
  }

  return user === null ? navigate("/auth/login") : (
    <section className="flex flex-col w-full h-full flex-grow my-10 p-2">
      <div className="grid grid-flow-col grid-cols-2 w-full gap-2">

        <div className="w-full grid-cols-2 flex flex-col justify-center items-center bg-white p-2">

          <input
            onChange={handelChangeImage} type="file" className="hidden" accept="image/*" id="file-upload" />

          <label htmlFor="file-upload">
            <img
              title="change image"
              className="rounded-full cursor-pointer shadow-md w-40 h-40 object-contain"
              src={`/api/files/public/${user.imageId}?${chnage}`}
              alt={user.fullName} />
          </label>

          <h1 className="text-2xl font-extralight text-gray-800">{user.fullName}</h1>
          <p className="text-base text-gray-800">hello Im Salih from libya</p>
        </div>

        <div className="w-full grid-cols-2 flex flex-col bg-black"> projects </div>

      </div>
    </section>
  )
}

export default Profile;
