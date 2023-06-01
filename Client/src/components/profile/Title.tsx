import { useEffect, useRef, useState, KeyboardEvent } from "react";
import useFetchApi from "../../utils/hooks/useFetchApi";
import { IUser, useUser } from "../../utils/context/user";
import useOnClickOutside from "../../utils/hooks/useOnClickOutside";
import TextFiled from "../utils/TextFiled";
import { MdOutlineModeEditOutline, MdOutlineSubtitles } from "react-icons/md";

const Title = () => {
    const [title, setTitle] = useState("");
    const [isEditing, setIsEditing] = useState(false)
    const TitleRef = useRef<null | HTMLDivElement>(null);
    const iconRef = useRef<null | HTMLDivElement>(null);
    const user = useUser() as IUser;

    const [_, call] = useFetchApi("POST", "user/title", [title], { title });

    const [getTitlePayload, callGetTitle] = useFetchApi<{ title: string }>("GET", `user/title/${user.id}`, []);

    useEffect(() => { callGetTitle() }, [])

    useEffect(() => {
        if (!getTitlePayload.isLoading && getTitlePayload.result) {
            setIsEditing(false)
            setTitle(getTitlePayload.result.title)
        }
    }, [getTitlePayload.isLoading])

    useOnClickOutside([TitleRef, iconRef], () => { setIsEditing(false) });

    const onEnter = (e: KeyboardEvent) => {
        if (e.key === "Enter") {
            setIsEditing(false);
            call();
        }
    }

    return <div className="flex flex-col w-80">
        {isEditing && !getTitlePayload.isLoading ? (
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

export default Title;
