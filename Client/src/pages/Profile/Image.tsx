import { ChangeEvent, useEffect, useState } from "react";
import { useUser, useUserDispatch } from "../../utils/context/user";
import useFetchApi from "../../utils/hooks/useFetchApi";
import toWEBPImage from "../../utils/toWEBPImage";
import { IProfileResult } from ".";
import { useParams } from "react-router-dom";

interface IImageProps {
    editable: boolean;
    data: IProfileResult;
}

const Image = (props: IImageProps) => {
    const { userId } = useParams();
    const [base64, setBase64] = useState("")
    const dispatchUser = useUserDispatch();
    const user = useUser();

    const [_, call] = useFetchApi<{ avatarUrl: string }, { data: string, contentType: string }>("PATCH", `users/${userId}/avatar`, [], (payload) => {
        dispatchUser({
            type: "add",
            payload: {
                ...user!,
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
        props.editable ? (
            <>
                <input
                    onChange={handelChangeImage} type="file" className="hidden" accept="image/*" id="file-upload" />

                <label htmlFor="file-upload">
                    <img
                        title="change image"
                        className="rounded-full cursor-pointer shadow-md w-60 h-60 object-cover"
                        src={user?.avatarUrl}
                        alt={user?.name} />
                </label>
            </>
        ) : (
            <>
                <img
                    title="change image"
                    className="rounded-full cursor-pointer shadow-md w-60 h-60 object-cover"
                    src={props.data.avatarUrl}
                    alt={props.data.name} />
            </>
        )
    )
}

export default Image;
