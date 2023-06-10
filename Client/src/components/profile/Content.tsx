import { useEffect, useRef, useState } from "react";
import useFetchApi from "../../utils/hooks/useFetchApi";
import { AiOutlineClose } from "react-icons/ai";
import Editor from "../utils/markdown";
import { useUser } from "../../utils/context/user";
import { MdOutlineModeEditOutline } from "react-icons/md";
import Parser from "../utils/markdown/Parser";
import CircleProgress from "../utils/CircleProgress";

interface IContentProps {
    contentId: string;
}

const Content = (props: IContentProps) => {
    const [md, setMd] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const files = useRef<{ base64: string, previewUrl: string }[]>([]);
    const user = useUser();

    const [_, call] = useFetchApi<unknown, { markdown: string, files: { base64: string, previewUrl: string }[] }>("POST", `content/${props.contentId}`, [])
    const [payload, callGet] = useFetchApi<{ markdown: string }, unknown>("GET", `content/${props.contentId}`, [])

    const handelSubmit = () => {
        for (const file of files.current) { URL.revokeObjectURL(file.previewUrl) };
        files.current = files.current.filter((file) => md.includes(file.previewUrl));
        call({ markdown: md, files: files.current });
        files.current = [];
    }

    useEffect(() => {
        if (!payload.isLoading && payload.result) setMd(payload.result.markdown);
    }, [payload.isLoading])

    useEffect(() => { callGet() }, [])

    return (
        <div className="flex flex-grow min-h-[60vh] my-2 h-fit w-full sm:px-4 md:px-8 lg:px-0 flex-col justify-center items-center">
            <div className="flex flex-col w-full min-h-[50vh] h-full rounded-2xl justify-start items-start bg-white py-4">
                {user?.contentId === props.contentId ? (
                <div onClick={() => setIsEditing((prev) => !prev)} className="flex w-full h-10 justify-end cursor-pointer">
                    {isEditing ? <AiOutlineClose className="text-2xl mr-2 transition-all ease-in-out font-bold text-gray-600" />
                    : <MdOutlineModeEditOutline className="text-2xl mr-2 transition-all ease-in-out font-bold text-gray-600" />}
                </div>
                ) : null}
                {isEditing ? (
                        <Editor md={md} onSubmit={handelSubmit} setMd={setMd} files={files} />
                ) : payload.isLoading ? <CircleProgress size="lg" /> : (
                        <div className="markdown flex flex-col p-2 w-full overflow-hidden h-full" dangerouslySetInnerHTML={{ __html: Parser(md) }}></div>
                )}
            </div>
        </div>
    )
}

export default Content;
