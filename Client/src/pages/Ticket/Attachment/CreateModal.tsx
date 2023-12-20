import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useFetchApi from "../../../utils/hooks/useFetchApi";
import getContentType from "../../../utils/getContentType";
import toBase64 from "../../../utils/toBase64";
import Modal from "../../../components/utils/Modal";
import TextFiled from "../../../components/utils/TextFiled";
import Button from "../../../components/utils/Button";

interface ICreateModalProps {
    isOpen: boolean;
    call: () => void;
    setIsOpen: Dispatch<SetStateAction<boolean>>
}

const CreateModal = (props: ICreateModalProps) => {
    const { ticketId } = useParams();

    const [title, setTitle] = useState("")
    const [isValidTitle, setIsValidTitle] = useState(false)
    const [data, setData] = useState("")
    const [contentType, setContentType] = useState("")
    const [fileName, setFileName] = useState("")

    useEffect(() => {
        if (!props.isOpen) {
            setTitle("")
            setIsValidTitle(false)
            setData("")
            setFileName("")
            setContentType("")
        }
    }, [props.isOpen])

    const [payload, call] = useFetchApi<unknown, { title: string, data: string, ticketId: string, contentType: string }>("POST", "attachment", [], () => {
        props.setIsOpen(false);
        props.call();
    })

    const handelSubmit = (e: FormEvent) => {
        e.preventDefault()
        call({ title, data, ticketId: ticketId!, contentType });
    }

    const handelChangeFile = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e?.target?.files?.item(0);
        if (file) {
            setFileName(file.name)
            setContentType(getContentType(file.name))
            setData(await toBase64(file));
        }
    }

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleButtonClick = () => {
        if (fileInputRef.current) fileInputRef.current.click();
    };

    return (
        <Modal isOpen={props.isOpen} setIsOpen={props.setIsOpen}>
            <form className="flex flex-col justify-center items-center pb-2 px-4 text-center h-full" onSubmit={handelSubmit}>
                <div className="pb-8 gap-4 flex flex-col w-full justify-center items-center">
                    <h1 className="text-3xl font-black text-blue-700 dark:text-blue-300">add attachment</h1>
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

                    <div className="px-6">
                        <input
                            ref={fileInputRef}
                            onChange={handelChangeFile}
                            type="file"
                            className="hidden"
                            accept="*"
                            id="file-upload"
                        />

                        <label htmlFor="file-upload">
                            <Button className="!whitespace-normal" onClick={handleButtonClick}>{fileName || "upload file"}</Button>
                        </label>
                    </div>
                </div>

                <div className="flex flex-row items-center mt-4 justify-center w-full px-4">
                    <Button
                        isLoading={payload.isLoading}
                        isValid={data.length > 0 && isValidTitle && contentType.length > 0}
                        buttonProps={{ type: "submit" }}
                    >add</Button>
                </div>
            </form>

        </Modal>
    )
}

export default CreateModal;
