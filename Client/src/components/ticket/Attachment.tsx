import { Link, useParams } from "react-router-dom"
import formatDate from "../../utils/formatDate"
import Button from "../utils/Button";
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import useFetchApi from "../../utils/hooks/useFetchApi";
import CircleProgress from "../utils/CircleProgress";
import TextFiled from "../utils/TextFiled";
import { AiOutlineArrowLeft, AiOutlineArrowRight, AiOutlineSearch } from "react-icons/ai";
import SelectButton from "../utils/SelectButton";
import { FiMoreVertical } from "react-icons/fi";
import useOnClickOutside from "../../utils/hooks/useOnClickOutside";
import Modal from "../utils/Model";
import { useUser } from "../../utils/context/user";
import toBase64 from "../../utils/toBase64";

interface IAttachment {
    creator: {
        name: string;
        id: string;
    };
    title: string;
    url: string;
    createdAt: string;
}

interface IActionProps {
    attachment: IAttachment
    call: () => void;
}

interface ICreateAttachmentModalProps {
    isOpen: boolean;
    call: () => void;
    setIsOpen: Dispatch<SetStateAction<boolean>>
}

const CreateAttachmentModal = (props: ICreateAttachmentModalProps) => {
    const [title, setTitle] = useState("")
    const [isValidTitle, setIsValidTitle] = useState(false)
    const [data, setData] = useState("")
    const [contentType, setContentType] = useState("")
    const { ticketId } = useParams();

    const [fileName, setFileName] = useState("")

    const [payload, call] = useFetchApi<unknown, { title: string, data: string, ticketId: string, contentType: string }>("POST", "attachment", [], () => {
        props.call();
        props.setIsOpen(false);
    })

    const resetState = () => {
        setTitle("")
        setIsValidTitle(false)
        setData("")
        setFileName("")
        setContentType("")
    }

    const handelChangeFile = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e?.target?.files?.item(0);
        if (file) {
            setFileName(file.name)
            setContentType(file.type)
            setData(await toBase64(file));
        }
    }

    return (
        <Modal isOpen={props.isOpen} setIsOpen={props.setIsOpen}>
            <div className="flex flex-col justify-center  items-center pt-4 pb-2 px-4 w-[400px] text-center h-full">
                <h1 className="text-xl font-bold text-primary">add attachment</h1>
                <div className="flex-col flex w-full justify-center items-center">

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

                    <div className="w-full my-4 px-6 justify-start flex-col items-center">
                        <input onChange={handelChangeFile} type="file" className="hidden" accept="*" id="file-upload" />

                        <label htmlFor="file-upload">
                            <div className="rounded-md cursor-pointer w-fit shadow-md bg-secondary text-primary p-1 font-bold text-start hover:text-white dark:hover:text-black">{fileName || "upload"}</div>
                        </label>
                    </div>

                    <div className="flex flex-row items-center mt-4  justify-between w-full px-4">
                        <Button onClick={() => {
                            resetState()
                            props.setIsOpen(false)
                        }}
                        >cancel</Button>

                        <Button
                            isLoading={payload.isLoading}
                            isValid={data.length > 0 && isValidTitle && contentType.length > 0}
                            onClick={() => call({ title, data, ticketId: ticketId!, contentType })}
                        >add</Button>
                    </div>

                </div>
            </div>

        </Modal>
    )
}


const Action = (_: IActionProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
    const [isOpenRoleModal, setIsOpenRoleModal] = useState(false);

    const targetRef = useRef<HTMLDivElement>(null);

    useOnClickOutside(targetRef, () => setIsOpen(false));

    return (
        <div ref={targetRef} className="flex w-fit relative">
            <div onClick={() => setIsOpen(!isOpen)} className="p-1 shadow-sm font-normal cursor-pointer hover:bg-slate-300 rounded-md">
                <FiMoreVertical />
            </div>

            <div className={`${isOpen ? "flex" : "hidden"} flex flex-col py-2 px-4 justify-center gap-2 items-center absolute right-[50%] bottom-[50%] bg-white rounded shadow-md`}>
                <Button onClick={() => setIsOpenDeleteModal(true)} size="xs" className="w-full shadow-sm">delete</Button>
                <Button onClick={() => setIsOpenRoleModal(true)} size="xs" className="w-full shadow-sm">update</Button>
            </div>

            <Modal isOpen={isOpenDeleteModal} setIsOpen={setIsOpenDeleteModal}>
                <div className="flex flex-col justify-center  items-center pt-4 pb-2 px-4 w-[400px] text-center h-full">
                    <h1 className="text-xl font-bold text-primary">delete modal</h1>


                    <div className="flex flex-row items-center mt-4  justify-between w-full px-4">
                        <Button onClick={() => setIsOpenDeleteModal(false)}>cancel</Button>
                        <Button className="!bg-red-500">delete</Button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={isOpenRoleModal} setIsOpen={setIsOpenRoleModal}>
                <div className="flex flex-col justify-center items-center pt-4 pb-2 px-4 w-[400px] text-center h-full">
                    <h1 className="text-xl font-bold text-primary">update modal</h1>


                    <div className="flex flex-row items-center mt-4  justify-between w-full px-4">
                        <Button onClick={() => setIsOpenRoleModal(false)}>cancel</Button>
                        <Button>change</Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}


const Attachment = () => {
    const { ticketId } = useParams();
    const [search, setSearch] = useState("");
    const [take, setTake] = useState(10);
    const [page, setPage] = useState(1);
    const [isOpenCreateAttachmentModal, setIsOpenCreateAttachmentModal] = useState(false);

    const [attachmentsPayload, callAttachments] = useFetchApi<IAttachment[]>("GET", `attachment/attachments/${ticketId}?take=${take}&page=${page}&search=${search}`, [take, page, search]);
    const [countPayload, callCount] = useFetchApi<number>("GET", `attachment/attachments-count/${ticketId}?search=${search}`, [search]);

    useEffect(() => { callAttachments() }, [take, page, search])
    useEffect(() => { callCount() }, [search])

    const handelPrevPage = () => {
        if (page > 1) setPage((prev) => prev - 1)
    }

    const handelNextPage = () => {
        if (countPayload.result && !(page * take >= countPayload.result)) setPage((prev) => prev + 1)
    }

    const user = useUser();

    return (
        <div className="my-10">
            <h2 className="text-3xl font-bold w-full mb-10 text-center">attachments</h2>
            <div className="w-full bg-white border border-gray-500 shadow-md rounded-md justify-center items-center flex flex-col p-2">

                <div className="flex flex-row gap-4 w-full flex-wrap items-center pb-4 p-2 bg-white justify-between">

                    <Button onClick={() => setIsOpenCreateAttachmentModal(prev => !prev)}>add attachment</Button>
                    <CreateAttachmentModal setIsOpen={setIsOpenCreateAttachmentModal} isOpen={isOpenCreateAttachmentModal} call={callAttachments} />

                    <div className="flex items-center justify-center w-full sm:w-auto">

                        <div className="max-w-[400px]">
                            <TextFiled small icon={AiOutlineSearch} label="Search for attachments" value={search} onChange={(e) => setSearch(e.target.value)} />
                        </div>

                    </div>
                </div>

                <div className="flex flex-col justify-center items-center w-full gap-4">
                    {attachmentsPayload.isLoading || countPayload.isLoading ? <CircleProgress size="lg" className="mb-4" /> : (
                        <>
                            <div className="overflow-x-scroll overflow-y-hidden w-full">
                                <table className="text-sm text-left text-gray-500 w-full">
                                    <thead className="text-xs text-gray-700 uppercase bg-white">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 min-w-[150px]"> title </th>
                                            <th scope="col" className="px-6 py-3 min-w-[150px]"> uploaded by </th>
                                            <th scope="col" className="px-6 py-3 min-w-[150px]"> uploaded at </th>
                                            <th scope="col" className="px-6 py-3  min-w-[150px]"> action </th>
                                        </tr>
                                    </thead>

                                    <tbody className="before:block before:h-4">
                                        {attachmentsPayload.result !== null && countPayload.result !== null && attachmentsPayload.result.map((attachment, index) => (
                                            <tr className="bg-white border-b hover:bg-gray-50" key={index}>

                                                <td className="px-6 py-4 min-w-[150px]">
                                                    <a target="_blank" className="link" href={attachment.url}>
                                                        {attachment.title}
                                                    </a>
                                                </td>

                                                <td className="px-6 py-4 min-w-[150px]">
                                                    <Link className="link" to={`/profile/${attachment.creator.id}`}>
                                                        {attachment.creator.name}
                                                    </Link>
                                                </td>

                                                <td className="px-6 py-4 min-w-[150px]"> {formatDate(attachment.createdAt)} </td>

                                                {attachment.creator.id === user?.id ? <td className="px-6 py-4 min-w-[150px]"> <Action call={callAttachments} attachment={attachment} /> </td> : null}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex w-full justify-end items-center flex-row gap-2">
                                {attachmentsPayload.result !== null && countPayload.result !== null && (
                                    <>
                                        <p>{((page * take) - take) + 1} to {attachmentsPayload.result.length === take ? (attachmentsPayload.result.length + ((page * take) - take)) : attachmentsPayload.result.length} out of {countPayload.result}</p>

                                        <SelectButton options={[5, 10, 15, 20, 100]} label="take" setValue={setTake} value={take} />

                                        <AiOutlineArrowLeft
                                            onClick={handelPrevPage}
                                            className={`${page === 1 ? "" : "hover:bg-slate-200 cursor-pointer"} p-2 rounded-xl shadow-md text-4xl`} />

                                        <AiOutlineArrowRight
                                            onClick={handelNextPage}
                                            className={`${page * take >= countPayload.result ? "" : "hover:bg-slate-200 cursor-pointer"} p-2 rounded-xl shadow-md text-4xl`} />
                                    </>
                                )}

                            </div>
                        </>
                    )}
                </div>

            </div>
        </div>
    )
}

export default Attachment;
