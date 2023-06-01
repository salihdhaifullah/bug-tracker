import { ChangeEvent, useEffect, useState } from "react";
import { IUser, useUser } from "../../utils/context/user";
import useFetchApi from "../../utils/hooks/useFetchApi";
import { toWEBPImage } from "../../utils";

const Image = () => {
    const [base64, setBase64] = useState("")
    const [change, SetChange] = useState(false);
    const user = useUser() as IUser;

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
                    className="rounded-full cursor-pointer shadow-md w-60 h-60 object-contain"
                    src={`/api/files/public/${user.imageId}?${change}`} // to force react to rerender the image
                    alt={user.fullName} />
            </label>
        </>
    )
}

export default Image;
