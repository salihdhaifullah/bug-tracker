import { useEffect, useRef, useState } from "react";
import useFetchApi from "../../utils/hooks/useFetchApi";
import { AiOutlineClose } from "react-icons/ai";
import Editor from "../utils/markdown";
import { MdOutlineModeEditOutline } from "react-icons/md";
import Parser from "../utils/markdown/Parser";
import CircleProgress from "../utils/CircleProgress";

interface IContentProps {
    isAllowedToEdit?: boolean;
    getUrl: string
    postUrl: string
}

const Content = (props: IContentProps) => {
    const [md, setMd] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const files = useRef<{ base64: string, previewUrl: string }[]>([]);

    const [_, call] = useFetchApi<any, { markdown: string, files: { base64: string, previewUrl: string }[] }>("POST", props.postUrl, [])
    const [payload, callGet] = useFetchApi<{ markdown: string }>("GET", props.getUrl, [])

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
        <div className="flex flex-grow h-fit w-full flex-col">
            <div className="flex flex-col w-full h-full rounded-2xl justify-start items-start bg-white">
                {props.isAllowedToEdit !== false ? (
                <div onClick={() => setIsEditing((prev) => !prev)} className="flex w-full h-8 justify-end cursor-pointer">
                    {isEditing ? <AiOutlineClose className="text-2xl mr-2 transition-all ease-in-out font-bold text-gray-600" />
                    : <MdOutlineModeEditOutline className="text-2xl mr-2 transition-all ease-in-out font-bold text-gray-600" />}
                </div>
                ) : null}
                {isEditing ? (
                        <Editor md={md} onSubmit={handelSubmit} setMd={setMd} files={files} />
                ) : payload.isLoading ? <CircleProgress size="lg" /> : (
                        <div className="markdown flex flex-col p-1 w-full overflow-hidden h-full" dangerouslySetInnerHTML={{ __html: Parser(md) }}></div>
                )}
            </div>
        </div>
    )
}

export default Content;
