import { ChangeEvent, useEffect, useState } from "react";
import { IUser, useUser, useUserDispatch } from "../../utils/context/user";
import useFetchApi from "../../utils/hooks/useFetchApi";
import toWEBPImage from "../../utils/toWEBPImage";

const Image = () => {
    const [base64, setBase64] = useState("")
    const user = useUser() as IUser;
    const dispatchUser = useUserDispatch();

    const [_, call] = useFetchApi<{ avatarUrl: string }, { data: string, contentType: string }>("POST", "user/avatar", [], (payload) => {
        dispatchUser({
            type: "add",
            payload: {
                ...user,
                avatarUrl: payload.avatarUrl
            }
        });
    });

    useEffect(() => {
        if (base64.length) call({ data: base64, contentType: "webp" });
    }, [base64]);

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
                    className="rounded-full cursor-pointer shadow-md w-60 h-60 object-contain"
                    src={user.avatarUrl}
                    alt={user.name} />
            </label>
        </>
    )
}

export default Image;
