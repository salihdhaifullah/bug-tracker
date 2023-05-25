import { useNavigate, useParams } from "react-router-dom";
import { IUser, useUser } from "../utils/context/user"
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { toWEBPImage } from "../utils";
import useFetchApi from "../utils/hooks/useFetchApi";
import TextFiled from "../components/utils/TextFiled";
import { MdOutlineModeEditOutline, MdOutlineSubtitles } from "react-icons/md";
import useOnClickOutside from "../utils/hooks/useOnClickOutside";

const Profile = () => {
  const user = useUser();
  const navigate = useNavigate();


  useEffect(() => {
    user === null ?? navigate("/auth/login");
  }, [user])

  return !user ? null : (
    <section className="flex flex-col w-full h-full flex-grow my-10 p-2">

      <div className="w-full  flex flex-col justify-center items-center bg-white p-2">
        <Image user={user} />
        <h1 className="text-gray-800 font-medium text-2xl">{user.fullName}</h1>
        <Title />
      </div>

    </section>
  )
}

export default Profile;



const Title = (props: { title?: string }) => {
  const [title, setTitle] = useState(props.title || "");
  const [isEditing, setIsEditing] = useState(!props.title)
  const TitleRef = useRef<null | HTMLDivElement>(null);
  const iconRef = useRef<null | HTMLDivElement>(null);

  const { userId } = useParams();
  const [_, call] = useFetchApi("POST", "user/title", [title], { title });

  const [getTitlePayload, callGetTitle] = useFetchApi<{ title: string }>("GET", `user/title/${userId}`, []);

  useEffect(() => { callGetTitle() }, [])
  useEffect(() => {
    if (!getTitlePayload.isLoading && getTitlePayload.result) {
      setIsEditing(false)
      setTitle(getTitlePayload.result.title)
    }
  }, [getTitlePayload.isLoading])

  useOnClickOutside([TitleRef, iconRef], () => { setIsEditing(false) });

  const onEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsEditing(false);
      call();
    }
  }

  return <div className="flex flex-col w-80">
    {isEditing || !title.length ? (
      <TextFiled
        icon={MdOutlineSubtitles}
        inputProps={{ onKeyDown: onEnter }}
        ref={TitleRef}
        onChange={(e) => { setTitle(e.target.value); setIsEditing(true); }}
        value={title}
        label="Bio"
        maxLength={100}
      />
    ) : (
      <div title="edit your bio" className="group grid grid-flow-col gap-1 w-full text-center justify-center items-center">

        <div ref={iconRef} onClick={() => setIsEditing(true)} className="flex grid-cols-1 cursor-pointer">
          <MdOutlineModeEditOutline className="group-hover:text-2xl transition-all ease-in-out text-[0px] font-bold text-gray-600" />
        </div>

        <p className="text-lg  text-gray-800 flex break-all text-center grid-cols-3">
          {title}
        </p>
      </div>
    )}
  </div>
}


const Image = ({ user }: { user: IUser }) => {

  const [base64, setBase64] = useState("")
  const [change, SetChange] = useState(false);


  const [_, call] = useFetchApi("POST", "user/upload-profile", [base64],
    { data: base64, contentType: "webp" }, (_) => { SetChange(!change) });

  useEffect(() => { if (base64.length) call() }, [base64]);

  const handelChangeImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files?.item(0);
    if (file) setBase64(await toWEBPImage(file));
  }

  return (
    <>
      <input
        onChange={handelChangeImage} type="file" className="hidden" accept="image/*" id="file-upload" />

      <label htmlFor="file-upload">
        <img
          title="change image"
          className="rounded-full cursor-pointer shadow-md w-40 h-40 object-contain"
          src={`/api/files/public/${user.imageId}?${change}`} // to force react to rerender the image
          alt={user.fullName} />
      </label>
    </>
  )
}
