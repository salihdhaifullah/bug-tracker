import { useEffect, useRef, useState } from "react";
import useFetchApi from "../../utils/hooks/useFetchApi";
import { AiOutlineClose } from "react-icons/ai";
import Editor from "../utils/markdown";
import { useUser } from "../../utils/context/user";
import { MdOutlineModeEditOutline } from "react-icons/md";
import Parser from "../utils/markdown/Parser";
import CircleProgress from "../utils/CircleProgress";

const Content = () => {
    const [md, setMd] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    let files = useRef<{ base64: string, previewUrl: string }[]>([]);
    const user = useUser();

    const [_, call] = useFetchApi("POST", "user/profile", [md, files], { markdown: md, files: files.current })
    const [payload, callGet] = useFetchApi<{ markdown: string }>("GET", `user/profile/${user?.id}`, [])

    const handelSubmit = () => {
        call();
    }

    useEffect(() => {
        if (!payload.isLoading && payload.result) setMd(payload.result.markdown);
    }, [payload.isLoading])

    useEffect(() => { callGet() }, [])

    return (
        <div className="flex flex-grow min-h-[60vh] my-2 h-fit w-full sm:px-4 md:px-8 lg:px-0 flex-col justify-center items-center">
            <div className="flex flex-col w-full h-full rounded-2xl justify-start items-start bg-white py-4">
                {isEditing ? (
                    <>
                        <div onClick={() => setIsEditing(false)} className="flex w-full h-10 justify-end cursor-pointer">
                            <AiOutlineClose className="text-2xl mr-2 transition-all ease-in-out font-bold text-gray-600" />
                        </div>
                        <Editor md={md} onSubmit={handelSubmit} setMd={setMd} files={files} />
                    </>
                ) : payload.isLoading ? <CircleProgress size="lg" /> : (
                    <>
                        <div onClick={() => setIsEditing(true)} className="flex w-full h-10 justify-end cursor-pointer">
                            <MdOutlineModeEditOutline className="text-2xl mr-2 transition-all ease-in-out font-bold text-gray-600" />
                        </div>
                        <div className="markdown flex flex-col p-2 w-full overflow-hidden  h-full" dangerouslySetInnerHTML={{ __html: Parser(md) }}></div>
                    </>
                )}
            </div>
        </div>
    )
}

export default Content;
