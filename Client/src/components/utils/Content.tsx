import { useEffect, useRef, useState } from "react";
import useFetchApi from "../../utils/hooks/useFetchApi";
import { AiOutlineClose } from "react-icons/ai";
import Editor from "./markdown";
import { MdOutlineModeEditOutline } from "react-icons/md";
import useMarkdown from "./markdown/useMarkdown";
import CircleProgress from "./CircleProgress";

interface IContentProps {
    contentId: string;
    editable?: boolean;
    call?: () => void;
}

const Content = (props: IContentProps) => {
    const [md, setMd] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [payload, callGet] = useFetchApi<{ markdown: string }>("GET", `contents/${props.contentId}`, [])


    const files = useRef<{ base64: string, previewUrl: string }[]>([]);

    const [createPayload, call] = useFetchApi<any, { markdown: string, files: { base64: string, previewUrl: string }[] }>("PATCH", `contents/${props.contentId}`, [], () => {
        if (props?.call) props.call();
    })

    const handelSubmit = () => {
        for (const file of files.current) { URL.revokeObjectURL(file.previewUrl) };
        files.current = files.current.filter((file) => md.includes(file.previewUrl));
        call({ markdown: md, files: files.current });
        files.current = [];
        setIsEditing(false);
    }

    const handelCancel = () => {
        if (!payload.isLoading && payload.result) setMd(payload.result.markdown);
        setIsEditing(false)
    }

    useEffect(() => {
        callGet()
    }, [])

    useEffect(() => {
        if (!payload.isLoading && payload.result) setMd(payload.result.markdown);
    }, [payload.isLoading])

    const jsx = useMarkdown(md);

    return (
        <div className="flex flex-col h-auto w-full">
            <div className="flex flex-col w-full h-fit min-h-[200px] rounded-2xl justify-start items-start bg-white dark:bg-black">
                {payload.isLoading ? <CircleProgress size="lg" /> : (
                    <>
                        {!props.editable ? null : (
                            <div className="flex w-full h-8 justify-end items-center gap-2">
                                {isEditing ? <AiOutlineClose onClick={() => setIsEditing(false)} className="text-2xl mr-2 transition-all ease-in-out cursor-pointer font-bold text-gray-600 dark:text-gray-300" />
                                    : <MdOutlineModeEditOutline onClick={() => setIsEditing(true)} className="text-2xl mr-2 transition-all ease-in-out cursor-pointer font-bold text-gray-600 dark:text-gray-300" />}
                            </div>
                        )}

                        {isEditing ? <Editor isLoading={createPayload.isLoading} md={md} onSubmit={handelSubmit} onCancel={handelCancel} setMd={setMd} files={files} />
                            : <div id="parser" className="flex flex-col p-1 w-full overflow-hidden h-full">{jsx}</div>}
                    </>
                )}
            </div>
        </div>
    )
}

export default Content;
