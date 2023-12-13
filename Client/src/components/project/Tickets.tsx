import { Link, useParams } from "react-router-dom"
import formatDate from "../../utils/formatDate"
import Button from "../utils/Button";
import useFetchApi from "../../utils/hooks/useFetchApi";
import { useEffect, useState } from "react";
import CircleProgress from "../utils/CircleProgress";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import SelectButton from "../utils/SelectButton";
import { priorityOptions, statusOptions, typeOptions } from "../../pages/CreateTicket";
import labelsColors from "../../utils/labelsColors";
import TicketAction from "../TicketAction";
import SearchFiled from "../utils/SearchFiled";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

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
    useEffect(() => { callTickets() }, [page, take, ticketType, ticketStatus, ticketPriority])
    useEffect(() => { callCount() }, [ticketType, ticketStatus, ticketPriority])


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

    ChartJS.register(ArcElement, Tooltip, Legend);

    const data = {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
            {
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };
    return (
        <div className="my-10">
            <h2 className="text-3xl font-bold w-full mb-10 text-center text-primary dark:text-secondary">Tickets</h2>
            <div className="pb-8 px-4 flex flex-row gap-2 justify-between flex-wrap">

                <div className="transition-all opacity-90 hover:opacity-100 hover:scale-100 scale-90 bg-primary dark:bg-secondary text-gray-100 dark:text-gray-900 py-6 px-12 rounded-lg flex flex-row text-center gap-2">
                    <p className="text-lg font-bold">review</p>
                    <p className="text-xl font-bold">2</p>
                </div>

                <div className="transition-all opacity-90 hover:opacity-100 hover:scale-100 scale-90 bg-primary dark:bg-secondary text-gray-100 dark:text-gray-900 py-6 px-12 rounded-lg flex flex-row text-center gap-2">
                    <p className="text-lg font-bold">active</p>
                    <p className="text-xl font-bold">6</p>
                </div>

                <div className="transition-all opacity-90 hover:opacity-100 hover:scale-100 scale-90 bg-primary dark:bg-secondary text-gray-100 dark:text-gray-900 py-6 px-12 rounded-lg flex flex-row text-center gap-2">
                    <p className="text-lg font-bold">progress</p>
                    <p className="text-xl font-bold">31</p>
                </div>

                <div className="transition-all opacity-90 hover:opacity-100 hover:scale-100 scale-90 bg-primary dark:bg-secondary text-gray-100 dark:text-gray-900 py-6 px-12 rounded-lg flex flex-row text-center gap-2">
                    <p className="text-lg font-bold">resolved</p>
                    <p className="text-xl font-bold">4</p>
                </div>

                <div className="transition-all opacity-90 hover:opacity-100 hover:scale-100 scale-90 bg-primary dark:bg-secondary text-gray-100 dark:text-gray-900 py-6 px-12 rounded-lg flex flex-row text-center gap-2">
                    <p className="text-lg font-bold">closed</p>
                    <p className="text-xl font-bold">17</p>
                </div>

            </div>

            <div className="pb-8 px-4 ml-10 flex flex-row gap-2 justify-between flex-wrap">

                <div className="transition-all opacity-90 hover:opacity-100 hover:scale-100 scale-90 bg-primary dark:bg-secondary text-gray-100 dark:text-gray-900 py-6 px-12 rounded-lg flex flex-row text-center gap-2">
                    <p className="text-lg font-bold">low</p>
                    <p className="text-xl font-bold">2</p>
                </div>

                <div className="transition-all opacity-90 hover:opacity-100 hover:scale-100 scale-90 bg-primary dark:bg-secondary text-gray-100 dark:text-gray-900 py-6 px-12 rounded-lg flex flex-row text-center gap-2">
                    <p className="text-lg font-bold">medium</p>
                    <p className="text-xl font-bold">6</p>
                </div>

                <div className="transition-all opacity-90 hover:opacity-100 hover:scale-100 scale-90 bg-primary dark:bg-secondary text-gray-100 dark:text-gray-900 py-6 px-12 rounded-lg flex flex-row text-center gap-2">
                    <p className="text-lg font-bold">high</p>
                    <p className="text-xl font-bold">31</p>
                </div>

                <div className="transition-all opacity-90 hover:opacity-100 hover:scale-100 scale-90 bg-primary dark:bg-secondary text-gray-100 dark:text-gray-900 py-6 px-12 rounded-lg flex flex-row text-center gap-2">
                    <p className="text-lg font-bold">critical</p>
                    <p className="text-xl font-bold">4</p>
                </div>

            </div>

            <div className="w-full dark:bg-black bg-white border border-gray-500 shadow-md dark:shadow-secondary/40 rounded-md justify-center items-center flex flex-col p-2">

                <div className="flex flex-row gap-4 w-full flex-wrap items-center pb-4 p-2 bg-white dark:bg-black justify-between">
                    <Link to={`/project/${projectId}/create-ticket`}>
                        <Button>create ticket</Button>
                    </Link>

                    <div className="flex items-center justify-center w-full sm:w-auto">
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
                                            {isOwnerOrMangerPayload.result ? <th scope="col" className="px-6 py-3  min-w-[150px]"> action </th> : null}
                                        </tr>
                                    </thead>

                                    <tbody className="before:block before:h-4 after:block after:mb-2">
                                        {ticketsPayload.result !== null && countPayload.result !== null && ticketsPayload.result.map((ticket, index) => (
                                            <tr className="dark:bg-black dark:hover:bg-gray-950 bg-white border-b dark:border-gray-600 hover:bg-gray-50" key={index}>

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
                                                    <p className={`rounded-md font-bold dark:border-white border-black w-fit p-1 dark:text-black text-white ${(labelsColors.PRIORITY as any)[ticket.priority]}`}>{ticket.priority}</p>
                                                </td>
                                                <td className="px-6 py-4 min-w-[150px]">
                                                    <p className={`rounded-md font-bold dark:border-white border-black w-fit p-1 dark:text-black text-white ${(labelsColors.STATUS as any)[ticket.status]}`}>{ticket.status}</p>
                                                </td>
                                                <td className="px-6 py-4 min-w-[150px]">
                                                    <p className={`rounded-md font-bold dark:border-white border-black w-fit p-1 dark:text-black text-white ${(labelsColors.TYPE as any)[ticket.type]}`}>{ticket.type}</p>
                                                </td>

                                                {isOwnerOrMangerPayload.result ?
                                                    <td className="px-6 py-4 min-w-[150px]">
                                                        <TicketAction onDelete={callTickets} onUpdate={callTickets} ticket={{ ...ticket, projectId: projectId! }} />
                                                    </td>
                                                    : null}
                                            </tr>
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

            <div className="flex flex-row justify-between my-4">
                <div className="flex justify-center items-center w-[400px] h-fit rounded-md p-4 shadow-lg bg-white dark:bg-black">
                    <Pie data={data} />
                </div>
                <div className="flex justify-center items-center w-[400px] h-fit rounded-md p-4 shadow-lg bg-white dark:bg-black">
                    <Pie data={data} />
                </div>
            </div>

        </div>
    )
}


export default Tickets;
