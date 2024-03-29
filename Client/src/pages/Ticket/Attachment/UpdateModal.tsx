import { ChangeEvent, FormEvent, useRef, useState } from "react";
import Button from "../../../components/utils/Button";
import useFetchApi from "../../../utils/hooks/useFetchApi";
import TextFiled from "../../../components/utils/TextFiled";
import toBase64 from "../../../utils/toBase64";
import getContentType from "../../../utils/getContentType";
import { useParams } from "react-router-dom";
import { useModalDispatch } from "../../../utils/context/modal";

interface IUpdateModalProps {
    id: string;
    title: string;
    call: () => void;
}

const UpdateModal = (props: IUpdateModalProps) => {
    const {ticketId, projectId} = useParams();

    const [isFileChange, setIsFileChange] = useState(false)
    const [title, setTitle] = useState(props.title)
    const [isValidTitle, setIsValidTitle] = useState(false)
    const [data, setData] = useState("")
    const [contentType, setContentType] = useState("")
    const [fileName, setFileName] = useState("")

    const dispatchModal = useModalDispatch();
    const [updatePayload, callUpdate] = useFetchApi<unknown, { title?: string, data?: string, contentType?: string }>("PATCH", `projects/${projectId}/tickets/${ticketId}/attachments/${props.id}`, [], () => {
        props.call();
        dispatchModal({type: "close", payload: null})
    })

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handelChangeFile = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e?.target?.files?.item(0);
        if (file) {
            setIsFileChange(true)
            setFileName(file.name)
            setContentType(getContentType(file.name))
            setData(await toBase64(file));
        }
    }

    const handleButtonClick = () => {
        if (fileInputRef.current) fileInputRef.current.click();
    };

    const handelSubmit = (e: FormEvent) => {
        e.preventDefault();

        const obj = {
            title: title === props.title ? undefined : title,
            data: isFileChange ? data : undefined,
            contentType: isFileChange ? contentType : undefined,
        }

        callUpdate(obj);
    }


    return (
            <form onSubmit={handelSubmit} className="flex flex-col justify-center items-center pb-2 px-4 text-center h-full">
                <div className="pb-8 gap-4 flex flex-col w-full justify-center items-center">
                    <h1 className="text-3xl font-black text-blue-700 dark:text-blue-300">update attachment</h1>
                </div>

                <div className="flex-col flex w-full gap-2 mb-4 justify-center items-start">
                    <TextFiled
                        validation={[
                            { validate: (str: string) => str.length <= 50, massage: "max length of title is 50 characters" },
                            { validate: (str: string) => str.length >= 3, massage: "min length of title is 3 characters" }
                        ]}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        label="title"
                        setIsValid={setIsValidTitle}
                    />

                    <div className="pl-6">
                        <input
                            ref={fileInputRef}
                            onChange={handelChangeFile}
                            type="file"
                            className="hidden"
                            accept="*"
                            id="file-upload"
                        />

                        <label htmlFor="file-upload">
                            <Button onClick={handleButtonClick}>{fileName || "upload"}</Button>
                        </label>
                    </div>

                </div>

                <div className="flex flex-row items-center mt-4 justify-center w-full px-4">
                    <Button
                        isLoading={updatePayload.isLoading}
                        isValid={(data.length > 0 && contentType.length > 0) || (isValidTitle && title !== props.title)}
                        buttonProps={{type: "submit"}}
                        >update</Button>
                </div>
            </form>
    )
}

export default UpdateModal
