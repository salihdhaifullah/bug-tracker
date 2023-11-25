import { Link, useParams } from "react-router-dom"
import formatDate from "../../utils/formatDate"
import Button from "../utils/Button";
import useFetchApi from "../../utils/hooks/useFetchApi";
import { useEffect, useState } from "react";
import CircleProgress from "../utils/CircleProgress";
import TextFiled from "../utils/TextFiled";
import { AiOutlineArrowLeft, AiOutlineArrowRight, AiOutlineSearch } from "react-icons/ai";
import SelectButton from "../utils/SelectButton";
import { priorityOptions, statusOptions, typeOptions } from "../../pages/CreateTicket";
import labelsColors from "../../utils/lablesColors";
import TicketAction from "../TicketAction";

interface ITicket {
    name: string;
    createdAt: string;
    creator: { name: string, id: string };
    assignedTo: { name: string, id: string, memberId: string } | null;
    priority: string;
    status: string;
    type: string;
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
    const [isOwnerOrMangerPayload, callIsOwnerOrManger] = useFetchApi<boolean>("GET", `project/is-owner-or-manger/${projectId}`);

    const [countPayload, callCount] = useFetchApi<number>("GET", `ticket/tickets-count/${projectId}?search=${search}&type=${ticketType}&status=${ticketStatus}&priority=${ticketPriority}`, [search, ticketType, ticketStatus, ticketPriority]);
    const [ticketsPayload, callTickets] = useFetchApi<ITicket[]>("GET", `ticket/tickets/${projectId}?page=${page}&take=${take}&search=${search}&type=${ticketType}&status=${ticketStatus}&priority=${ticketPriority}`, [page, take, search, ticketType, ticketStatus, ticketPriority]);

    useEffect(() => { callIsOwnerOrManger() }, [])
    useEffect(() => { callTickets() }, [page, take, search, ticketType, ticketStatus, ticketPriority])
    useEffect(() => { callCount() }, [search, ticketType, ticketStatus, ticketPriority])

    const handelPrevPage = () => {
        if (page > 1) setPage((prev) => prev - 1)
    }

    const handelNextPage = () => {
        if (countPayload.result && !(page * take >= countPayload.result)) setPage((prev) => prev + 1)
    }

    return (
        <div className="my-10">
            <h2 className="text-3xl font-bold w-full mb-10 text-center">Tickets</h2>
            <div className="w-full bg-white border border-gray-500 shadow-md rounded-md justify-center items-center flex flex-col p-2">

                <div className="flex flex-row gap-4 w-full flex-wrap items-center pb-4 p-2 bg-white justify-between">
                    <Link to={`/project/${projectId}/create-ticket`}>
                        <Button>create ticket</Button>
                    </Link>

                    <div className="flex items-center justify-center w-full sm:w-auto">
                        <div className="max-w-[400px]">
                            <TextFiled small icon={AiOutlineSearch} label="Search for tickets" value={search} onChange={(e) => setSearch(e.target.value)} />
                        </div>

                        <div className="flex gap-1 flex-row flex-wrap">
                            <SelectButton value={ticketPriority} setValue={setTicketPriority} label="priority" options={["all", ...priorityOptions]} />
                            <SelectButton value={ticketStatus} setValue={setTicketStatus} label="status" options={["all", ...statusOptions]} />
                            <SelectButton value={ticketType} setValue={setTicketType} label="type" options={["all", ...typeOptions]} />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col justify-center items-center w-full gap-4">
                    {ticketsPayload.isLoading || ticketsPayload.result === null || countPayload.isLoading || countPayload.result == null ? <CircleProgress size="lg" className="mb-4" /> : (
                        <>
                            <div className="overflow-x-scroll overflow-y-hidden w-full">
                                <table className="text-sm text-left text-gray-500 w-full">
                                    <thead className="text-xs text-gray-700 uppercase bg-white">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 min-w-[150px]"> name </th>
                                            <th scope="col" className="px-6 py-3 min-w-[150px]"> created by </th>
                                            <th scope="col" className="px-6 py-3 min-w-[150px]"> assigned to </th>
                                            <th scope="col" className="px-6 py-3 min-w-[150px]"> created at </th>
                                            <th scope="col" className="px-6 py-3 min-w-[150px]"> priority </th>
                                            <th scope="col" className="px-6 py-3 min-w-[150px]"> status </th>
                                            <th scope="col" className="px-6 py-3 min-w-[150px]"> type </th>
                                            {isOwnerOrMangerPayload.result ? <th scope="col" className="px-6 py-3  min-w-[150px]"> action </th> : null}
                                        </tr>
                                    </thead>

                                    <tbody className="before:block before:h-4">
                                        {ticketsPayload.result.map((ticket, index) => (
                                            <tr className="bg-white border-b hover:bg-gray-50" key={index}>

                                                <td className="px-6 py-4 min-w-[150px]">
                                                    <Link to={`/tickets/${ticket.id}`} className="link">
                                                        {ticket.name}
                                                    </Link>
                                                </td>

                                                <td className="px-6 py-4 min-w-[150px]">
                                                    <Link to={`/profile/${ticket.creator.id}`} className="link">
                                                        {ticket.creator.name}
                                                    </Link>
                                                </td>

                                                <td className="px-6 py-4 min-w-[150px]">
                                                    {ticket.assignedTo ?
                                                        <Link to={`/profile/${ticket.assignedTo.id}`} className="link">
                                                            {ticket.assignedTo.name}
                                                        </Link>
                                                        : 'None'}
                                                </td>

                                                <td className="px-6 py-4 min-w-[150px]">{formatDate(ticket.createdAt)}</td>
                                                <td className="px-6 py-4 min-w-[150px]">
                                                    <p className={`rounded-md font-bold border-black w-fit p-1 text-white ${(labelsColors.PRIORITY as any)[ticket.priority]}`}>{ticket.priority}</p>
                                                </td>
                                                <td className="px-6 py-4 min-w-[150px]">
                                                    <p className={`rounded-md font-bold border-black w-fit p-1 text-white ${(labelsColors.STATUS as any)[ticket.status]}`}>{ticket.status}</p>
                                                </td>
                                                <td className="px-6 py-4 min-w-[150px]">
                                                    <p className={`rounded-md font-bold border-black w-fit p-1 text-white ${(labelsColors.TYPE as any)[ticket.type]}`}>{ticket.type}</p>
                                                </td>

                                                {isOwnerOrMangerPayload.result ?
                                                    <td className="px-6 py-4 min-w-[150px]">
                                                        <TicketAction onDelete={callTickets} onUpdate={callTickets} ticket={ticket} />
                                                    </td>
                                                    : null}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex w-full justify-end items-center flex-row gap-2">

                                <p>{((page * take) - take) + 1} to {ticketsPayload.result.length === take ? (ticketsPayload.result.length + ((page * take) - take)) : ticketsPayload.result.length} out of {countPayload.result}</p>

                                <SelectButton options={[5, 10, 15, 20, 100]} label="take" setValue={setTake} value={take} />

                                <AiOutlineArrowLeft
                                    onClick={handelPrevPage}
                                    className={`${page === 1 ? "" : "hover:bg-slate-200 cursor-pointer"} p-2 rounded-xl shadow-md text-4xl`} />

                                <AiOutlineArrowRight
                                    onClick={handelNextPage}
                                    className={`${page * take >= countPayload.result ? "" : "hover:bg-slate-200 cursor-pointer"} p-2 rounded-xl shadow-md text-4xl`} />
                            </div>
                        </>
                    )}
                </div>
            </div>


        </div>
    )
}


export default Tickets;
