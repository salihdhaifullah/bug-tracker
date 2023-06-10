import { useEffect, useRef, useState, KeyboardEvent } from "react";
import useFetchApi from "../../utils/hooks/useFetchApi";
import { IUser, useUser } from "../../utils/context/user";
import useOnClickOutside from "../../utils/hooks/useOnClickOutside";
import TextFiled from "../utils/TextFiled";
import { MdOutlineModeEditOutline, MdOutlineSubtitles } from "react-icons/md";
import Button from "../utils/Button";

const Bio = () => {
    const [bio, setBio] = useState("");
    const [isEditing, setIsEditing] = useState(false)
    const bioRef = useRef<null | HTMLDivElement>(null);
    const iconRef = useRef<null | HTMLDivElement>(null);
    const user = useUser() as IUser;

    const [updateBioPayload, call] = useFetchApi<unknown, { bio: string }>("POST", "user/bio", []);

    const [getBioPayload, callGetBio] = useFetchApi<{ bio: string }, unknown>("GET", `user/bio/${user.id}`, []);

    useEffect(() => { callGetBio() }, [])

    useEffect(() => {
        if (!getBioPayload.isLoading && getBioPayload.result) {
            setIsEditing(false)
            setBio(getBioPayload.result.bio)
        }
    }, [getBioPayload.isLoading])

    useOnClickOutside([bioRef, iconRef], () => { setIsEditing(false) });

    const SubmitChanges = () => {
        setIsEditing(false);
        call({ bio });
    }

    const onEnter = (e: KeyboardEvent) => {
        if (e.key === "Enter") SubmitChanges();
    }

    return <div className="flex flex-col w-80 h-full">
        {isEditing && !getBioPayload.isLoading ? (
            <div ref={bioRef} className="flex flex-row gap-0 justify-start items-start w-full h-full">
                <TextFiled
                    icon={MdOutlineSubtitles}
                    inputProps={{ onKeyDown: onEnter }}
                    onChange={(e) => { setBio(e.target.value); setIsEditing(true); }}
                    value={bio}
                    label="Bio"
                    maxLength={100}
                />
                <div className="mt-3">
                    <Button
                        onClick={() => SubmitChanges()}
                        isLoading={updateBioPayload.isLoading}
                        isValid={true}
                    >ok</Button>
                </div>
            </div>
        ) : (
            <div title="edit your bio" className="min-h-[2rem] h-full grid grid-flow-col gap-1 w-full text-center justify-center items-center">

                <div ref={iconRef} onClick={() => setIsEditing(true)} className="flex grid-cols-1 cursor-pointer">
                    <MdOutlineModeEditOutline className="text-2xl font-bold text-gray-600" />
                </div>

                <p className="text-lg  text-gray-800 flex break-all text-center grid-cols-3">
                    {bio}
                </p>
            </div>
        )}
    </div>
}

export default Bio;
