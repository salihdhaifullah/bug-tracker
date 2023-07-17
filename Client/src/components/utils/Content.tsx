import { useLayoutEffect, useRef, useState } from "react";
import useFetchApi from "../../utils/hooks/useFetchApi";
import { AiOutlineClose } from "react-icons/ai";
import Editor from "./markdown";
import { MdOutlineModeEditOutline } from "react-icons/md";
import Parser from "./markdown/Parser";
import CircleProgress from "./CircleProgress";
import { MdDeleteForever } from "react-icons/md";

interface IContentProps {
    url: string;
    form?: boolean;
    editable?: boolean;
    handelDelete?: () => void
}

const Content = (props: IContentProps) => {
    const [md, setMd] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const files = useRef<{ base64: string, previewUrl: string }[]>([]);

    const [_, call] = useFetchApi<any, { markdown: string, files: { base64: string, previewUrl: string }[] }>("POST", props.url, [])
    const [payload, callGet] = useFetchApi<{ markdown: string }>("GET", props.url, [])

    const handelSubmit = () => {
        for (const file of files.current) { URL.revokeObjectURL(file.previewUrl) };
        files.current = files.current.filter((file) => md.includes(file.previewUrl));
        call({ markdown: md, files: files.current });
        files.current = [];
        setIsEditing(false);
    }

    useLayoutEffect(() => { callGet() }, [])

    useLayoutEffect(() => {
        if (!payload.isLoading && payload.result) setMd(payload.result.markdown);
    }, [payload.isLoading])

    const handelCancel = () => {
        if (!payload.isLoading && payload.result) setMd(payload.result.markdown);
        setIsEditing(false)
    }

    return (
        <div className="flex flex-col h-auto w-full">
            <div className="flex flex-col w-full h-fit min-h-[200px] rounded-2xl justify-start items-start bg-white">
                {payload.isLoading ? <CircleProgress size="lg" /> : (
                    <>
                        {!props.editable || props.form ? null : (
                            <div className="flex w-full h-8 justify-end items-center gap-2">
                                {(props.handelDelete && props.editable) && <MdDeleteForever className="text-2xl text-red-600 mr-2 transition-all ease-in-out cursor-pointer font-bold"  onClick={() => props.handelDelete!()} /> }
                                {isEditing ? <AiOutlineClose onClick={() => setIsEditing(false)} className="text-2xl mr-2 transition-all ease-in-out cursor-pointer font-bold text-gray-600" />
                                    : <MdOutlineModeEditOutline onClick={() => setIsEditing(true)} className="text-2xl mr-2 transition-all ease-in-out cursor-pointer font-bold text-gray-600" />}
                            </div>
                        )}

                        {isEditing || props.form ? <Editor md={md} onSubmit={handelSubmit} onCancel={props.form ? undefined : handelCancel} setMd={setMd} files={files} />
                            : <div id="parser" className="markdown flex flex-col p-1 w-full overflow-hidden h-full" dangerouslySetInnerHTML={{ __html: Parser(md) }}></div>}
                    </>
                )}
            </div>
        </div>
    )
}

export default Content;
