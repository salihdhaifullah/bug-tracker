import { useParams } from "react-router-dom";
import useFetchApi from "../../../utils/hooks/useFetchApi";
import { useRef, useState } from "react";
import Editor from "../../../components/utils/markdown";

interface ICreateCommentProps {
    call: () => void;
}

const CreateComment = (props: ICreateCommentProps) => {
    const { projectId, ticketId} = useParams();

    const [md, setMd] = useState("");
    const files = useRef<{ base64: string, previewUrl: string }[]>([]);

    const [createPayload, call] = useFetchApi<unknown, { markdown: string, files: { base64: string, previewUrl: string }[] }>("POST", `projects/${projectId}/tickets/${ticketId}/comments`, [], () => {
        if (props?.call) props.call();
    })

    const handelSubmit = () => {
        for (const file of files.current) URL.revokeObjectURL(file.previewUrl);
        files.current = files.current.filter((file) => md.includes(file.previewUrl));
        call({ markdown: md, files: files.current });
        files.current = [];
    }

    return (
        <div className="flex flex-col h-auto w-full">
            <div className="flex flex-col w-full h-fit min-h-[200px] rounded-2xl justify-start items-start bg-white dark:bg-black">
                <Editor isLoading={createPayload.isLoading} md={md} setMd={setMd} files={files}  onSubmit={handelSubmit}  />
            </div>
        </div>
    )
}

export default CreateComment;
