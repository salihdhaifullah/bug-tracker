import { useParams } from "react-router-dom"
import Button from "../../components/utils/Button";
import useFetchApi from "../../utils/hooks/useFetchApi";
import { useLayoutEffect, useMemo, useState } from "react";
import CircleProgress from "../../components/utils/CircleProgress";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import SelectButton from "../../components/utils/SelectButton";
import CreateTicketModal, { priorityOptions, statusOptions, typeOptions } from "../../components/utils/CreateTicketModal";
import SearchFiled from "../../components/utils/SearchFiled";
import Charts from "./Chart";
import TicketsRow from "./TicketsRow";
import { useModalDispatch } from "../../utils/context/modal";
import { Priority, Role, Status, Type } from "../MyTasks";

export interface ITypeChart {
    bugs: number;
    features: number;
}

export interface IStatusChart {
    review: number;
    active: number;
    progress: number;
    resolved: number;
    closed: number;
}

export interface IPriorityChart {
    low: number;
    medium: number;
    high: number;
    critical: number;
}

export interface IChartsData {
    type: ITypeChart;
    status: IStatusChart;
    priority: IPriorityChart;
}

export interface ITicket {
    name: string;
    createdAt: string;
    creator: { name: string, id: string };
    assignedTo: { name: string, id: string, memberId: string } | null;
    priority: Priority;
    status: Status;
    type: Type;
    id: string;
}

const Tickets = () => {
    const { projectId } = useParams();
    const [take, setTake] = useState(10);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [ticketType, setTicketType] = useState("all");
    const [ticketStatus, setTicketStatus] = useState("all");
    const [ticketPriority, setTicketPriority] = useState("all");

    const [rolePayload, callRole] = useFetchApi<Role>("GET", `projects/${projectId}/members/role`);
    const [countPayload, callCount] = useFetchApi<number>("GET", `projects/${projectId}/tickets/table/count?search=${search}&type=${ticketType}&status=${ticketStatus}&priority=${ticketPriority}`, [search, ticketType, ticketStatus, ticketPriority]);
    const [ticketsPayload, callTickets] = useFetchApi<ITicket[]>("GET", `projects/${projectId}/tickets/table/${page}?take=${take}&search=${search}&type=${ticketType}&status=${ticketStatus}&priority=${ticketPriority}`, [page, take, search, ticketType, ticketStatus, ticketPriority]);
    const [projectPayload, callProject] = useFetchApi<{isReadOnly: boolean}>("GET", `projects/${projectId}/read-only`);

    useLayoutEffect(() => { callRole() }, [callRole])
    useLayoutEffect(() => { callProject() }, [callProject])
    useLayoutEffect(() => { callTickets() }, [page, take, ticketType, ticketStatus, ticketPriority, callTickets])
    useLayoutEffect(() => { callCount() }, [ticketType, ticketStatus, ticketPriority, callCount])

    const handelSearch = () => {
        callCount()
        callTickets()
    }

    const handelPrevPage = () => {
        if (page > 1) setPage((prev) => prev - 1)
    }

    const handelNextPage = () => {
        if (countPayload.result && !(page * take >= countPayload.result)) setPage((prev) => prev + 1)
    }

    const dispatchModal = useModalDispatch();

    const handelOpenModal = () => {
        dispatchModal({ type: "open", payload: <CreateTicketModal /> })
    }

    const isOwnerOrMangerAndNotArchived = useMemo(() => (
        rolePayload.result !== null
        && [Role.owner, Role.project_manger].includes(rolePayload.result)
        && projectPayload.result !== null
        && !projectPayload.result.isReadOnly
    ), [projectPayload.result, rolePayload.result])

    return (
        <section className="h-full w-full py-4 md:px-8 px-3 mt-10 gap-8 flex flex-col">

            <div className="w-full dark:bg-black bg-white border border-gray-500 shadow-md dark:shadow-secondary/40 rounded-md justify-center items-center flex flex-col p-2">

                <div className="flex flex-row gap-4 w-full flex-wrap items-center pb-4 p-2 bg-white dark:bg-black justify-between">
                    {isOwnerOrMangerAndNotArchived ? <Button onClick={handelOpenModal}>create ticket</Button> : null}

                    <div className="flex items-center justify-center gap-4 flex-wrap-reverse w-full md:w-auto">
                        <div className="max-w-[400px]">
                            <SearchFiled onClick={handelSearch} label="Search for tickets" value={search} onChange={(e) => setSearch(e.target.value)} />
                        </div>

                        <div className="flex gap-1 flex-row flex-wrap">
                            <SelectButton value={ticketPriority} setValue={setTicketPriority} label="priority" options={["all", ...priorityOptions]} />
                            <SelectButton value={ticketStatus} setValue={setTicketStatus} label="status" options={["all", ...statusOptions]} />
                            <SelectButton value={ticketType} setValue={setTicketType} label="type" options={["all", ...typeOptions]} />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col justify-center items-center w-full gap-4">
                    {ticketsPayload.isLoading || countPayload.isLoading ? <CircleProgress size="lg" className="mb-4" /> : (
                        <>
                            <div className="overflow-x-scroll overflow-y-hidden w-full">
                                <table className="text-sm text-left text-gray-500 w-full">
                                    <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-white dark:bg-black">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 min-w-[150px]"> name </th>
                                            <th scope="col" className="px-6 py-3 min-w-[150px]"> created by </th>
                                            <th scope="col" className="px-6 py-3 min-w-[150px]"> assigned to </th>
                                            <th scope="col" className="px-6 py-3 min-w-[150px]"> created at </th>
                                            <th scope="col" className="px-6 py-3 min-w-[150px]"> priority </th>
                                            <th scope="col" className="px-6 py-3 min-w-[150px]"> status </th>
                                            <th scope="col" className="px-6 py-3 min-w-[150px]"> type </th>
                                            {isOwnerOrMangerAndNotArchived ? <th scope="col" className="px-6 py-3  min-w-[150px]"> action </th> : null}
                                        </tr>
                                    </thead>

                                    <tbody className="before:block before:h-4 after:block after:mb-2">
                                        {ticketsPayload.result !== null && ticketsPayload.result.map((ticket, index) => (
                                            <TicketsRow key={index} isOwnerOrManger={isOwnerOrMangerAndNotArchived} ticket={ticket} call={() => callTickets()} />
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex w-full justify-end items-center flex-row gap-2">
                                {ticketsPayload.result !== null && countPayload.result !== null && (

                                    <>
                                        <p className="dark:text-white">{((page * take) - take) + 1} to {ticketsPayload.result.length === take ? (ticketsPayload.result.length + ((page * take) - take)) : ticketsPayload.result.length} out of {countPayload.result}</p>

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

            <Charts />

        </section>
    )
}


export default Tickets;
