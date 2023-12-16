import { Link, useParams } from "react-router-dom"
import formatDate from "../../../utils/formatDate"
import Button from "../../../components/utils/Button";
import { useEffect, useState } from "react";
import useFetchApi from "../../../utils/hooks/useFetchApi";
import CircleProgress from "../../../components/utils/CircleProgress";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import SelectButton from "../../../components/utils/SelectButton";
import { useUser } from "../../../utils/context/user";
import SearchFiled from "../../../components/utils/SearchFiled";
import CreateAttachmentModal from "./CreateModal";
import Action from "./Action";

interface IAttachment {
    creator: {
        name: string;
        id: string;
    };
    id: string;
    title: string;
    url: string;
    createdAt: string;
}

const Attachment = () => {
    const { ticketId } = useParams();
    const [search, setSearch] = useState("");
    const [take, setTake] = useState(10);
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState("latest");
    const [isOpenCreateAttachmentModal, setIsOpenCreateAttachmentModal] = useState(false);

    const [attachmentsPayload, callAttachments] = useFetchApi<IAttachment[]>("GET", `attachment/attachments/${ticketId}?take=${take}&page=${page}&search=${search}&sort=${sort}`, [take, page, search, sort]);
    const [countPayload, callCount] = useFetchApi<number>("GET", `attachment/attachments-count/${ticketId}?search=${search}`, [search]);

    useEffect(() => { callAttachments() }, [take, page, sort])
    useEffect(() => { callCount() }, [])

    const handelUpdate = () => {
        callCount();
        callAttachments();
    }

    const handelPrevPage = () => {
        if (page > 1) setPage((prev) => prev - 1)
    }

    const handelNextPage = () => {
        if (countPayload.result && !(page * take >= countPayload.result)) setPage((prev) => prev + 1)
    }

    const user = useUser();

    return (
        <div className="my-10">
            <h2 className="text-3xl text-primary dark:text-secondary font-bold w-full mb-10 text-center">attachments</h2>
            <div className="w-full bg-white dark:bg-black border border-gray-500 shadow-md dark:shadow-secondary rounded-md justify-center items-center flex flex-col p-2">

                <div className="flex flex-row gap-4 w-full flex-wrap items-center pb-4 p-2 bg-white dark:bg-black justify-between">

                    <Button onClick={() => setIsOpenCreateAttachmentModal(prev => !prev)}>add attachment</Button>
                    <CreateAttachmentModal setIsOpen={setIsOpenCreateAttachmentModal} isOpen={isOpenCreateAttachmentModal} call={callAttachments} />

                    <div className="flex items-center justify-center w-full sm:w-auto">

                        <div className="max-w-[400px]">
                            <SearchFiled onClick={handelUpdate} label="Search for attachments" value={search} onChange={(e) => setSearch(e.target.value)} />
                        </div>

                <div className="flex flex-row gap-4 w-full flex-wrap items-center pb-4 p-2 bg-white dark:bg-black justify-between">
                    <SelectButton label="sort by date" setValue={setSort} value={sort} options={["latest", "oldest"]} />
                </div>


                    </div>
                </div>

                <div className="flex flex-col justify-center items-center w-full gap-4">
                    {attachmentsPayload.isLoading || countPayload.isLoading ? <CircleProgress size="lg" className="mb-4" /> : (
                        <>
                            <div className="overflow-x-scroll overflow-y-hidden w-full">
                                <table className="text-sm text-left text-gray-500 w-full">
                                    <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-white dark:bg-black">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 min-w-[150px]"> title </th>
                                            <th scope="col" className="px-6 py-3 min-w-[150px]"> uploaded by </th>
                                            <th scope="col" className="px-6 py-3 min-w-[150px]"> uploaded at </th>
                                            <th scope="col" className="px-6 py-3  min-w-[150px]"> action </th>
                                        </tr>
                                    </thead>

                                    <tbody className="before:block before:h-4 after:block after:mb-2">
                                        {attachmentsPayload.result !== null && countPayload.result !== null && attachmentsPayload.result.map((attachment, index) => (
                                            <tr className="bg-white dark:bg-black border-b dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-950" key={index}>

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

                                                {attachment.creator.id === user?.id ? <td className="px-6 py-4 min-w-[150px]"> <Action call={callAttachments} id={attachment.id} title={attachment.title} /> </td> : null}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex w-full justify-end items-center flex-row gap-2">
                                {attachmentsPayload.result !== null && countPayload.result !== null && (
                                    <>
                                        <p className="dark:text-white">{((page * take) - take) + 1} to {attachmentsPayload.result.length === take ? (attachmentsPayload.result.length + ((page * take) - take)) : attachmentsPayload.result.length} out of {countPayload.result}</p>

                                        <SelectButton options={[5, 10, 15, 20, 100]} label="take" setValue={setTake} value={take} />

                                        <AiOutlineArrowLeft
                                            onClick={handelPrevPage}
                                            className={`${page === 1 ? "" : "hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"} p-2 dark:bg-black dark:shadow-secondary/40 dark:text-white rounded-xl shadow-md text-4xl`} />

                                        <AiOutlineArrowRight
                                            onClick={handelNextPage}
                                            className={`${page * take >= countPayload.result ? "" : "hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"} p-2 dark:bg-black dark:shadow-secondary/40 dark:text-white rounded-xl shadow-md text-4xl`} />
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
