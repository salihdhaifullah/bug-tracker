import { Link, useParams } from "react-router-dom"
import formatDate from "../../utils/formatDate"
import Button from "../utils/Button";
import useFetchApi from "../../utils/hooks/useFetchApi";
import { useLayoutEffect, useRef, useState } from "react";
import CircleProgress from "../utils/CircleProgress";
import TextFiled from "../utils/TextFiled";
import { AiOutlineArrowLeft, AiOutlineArrowRight, AiOutlineSearch } from "react-icons/ai";
import SelectButton from "../utils/SelectButton";
import useOnClickOutside from "../../utils/hooks/useOnClickOutside";
import { FiMoreVertical } from "react-icons/fi";
import Modal from "../utils/Model";
import { priorityOptions, statusOptions, typeOptions } from "../../pages/CreateTicket";
import Select from "../utils/Select";
import SelectUser from "../utils/SelectUser";

interface ITicket {
    name: string;
    createdAt: string;
    creator: { name: string, id: string };
    assignedTo: { name: string, id: string } | null;
    priority: string;
    status: string;
    type: string;
    id: string;
}

interface IActionProps {
    ticket: ITicket
    call: () => void;
}

const Action = (props: IActionProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
    const [name, setName] = useState(props.ticket.name);
    const [type, setType] = useState(props.ticket.type);
    const [priority, setPriority] = useState(props.ticket.priority);
    const [status, setStatus] = useState(props.ticket.status);
    const [memberId, setMemberId] = useState(props.ticket.assignedTo?.id || "");
    const [isValidName, setIsValidName] = useState(true);
    const [isValidType, setIsValidType] = useState(true);
    const [isValidPriority, setIsValidPriority] = useState(true);
    const [isValidStatus, setIsValidStatus] = useState(true);
    const { projectId } = useParams();

    const [deleteTicketPayload, callDeleteTicket] = useFetchApi("DELETE", `ticket/${props.ticket.id}`, [], () => {
        props.call()
    })

    const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);
    const targetRef = useRef<HTMLDivElement>(null);
    useOnClickOutside(targetRef, () => setIsOpen(false));

    const [updateTicketPayload, callUpdateTicket] = useFetchApi<unknown, { name: string, type: string, priority: string, status: string, memberId?: string }>("PATCH", `ticket/${props.ticket.id}`, [], () => {
        props.call()
    });

    return (
        <div ref={targetRef} className="flex w-fit relative">
            <Button onClick={() => setIsOpen(!isOpen)} className="p-1 px-1 shadow-sm font-normal">
                <FiMoreVertical />
            </Button>

            <div className={`${isOpen ? "flex" : "hidden"} flex flex-col px-2 py-4 justify-center items-center gap-4 w-40 absolute right-[50%] bottom-[50%] z-50 bg-white rounded shadow-md`}>
                <Button onClick={() => setIsOpenDeleteModal(true)} className="w-full shadow-sm">delete ticket</Button>
                <Button onClick={() => setIsOpenUpdateModal(true)} className="w-full shadow-sm">update ticket</Button>
            </div>

            <Modal isOpen={isOpenDeleteModal} setIsOpen={setIsOpenDeleteModal}>
                <div className="flex flex-col justify-center items-center pt-4 pb-2 px-4 w-[400px] text-center h-full">
                    <h1 className="text-xl font-bold text-primary">are you sure you want to delete this ticket</h1>

                    <div className="w-full justify-center gap-4 pl-2 my-3 items-start flex flex-col">
                        <p className="flex flex-row gap-2">
                            <span>name: </span>
                            <span className="font-bold text-primary">
                                {props.ticket.name}
                            </span>
                        </p>

                        <p className="flex flex-row gap-2">
                            <span>priority: </span>
                            <span className="font-bold text-primary">
                                {props.ticket.priority}
                            </span>
                        </p>

                        <p className="flex flex-row gap-2">
                            <span>status: </span>
                            <span className="font-bold text-primary">
                                {props.ticket.status}
                            </span>
                        </p>

                        <p className="flex flex-row gap-2">
                            <span>type: </span>
                            <span className="font-bold text-primary">
                                {props.ticket.type}
                            </span>
                        </p>
                    </div>

                    <div className="flex flex-row items-center mt-4  justify-between w-full px-4">
                        <Button onClick={() => setIsOpenDeleteModal(false)}>cancel</Button>
                        <Button isLoading={deleteTicketPayload.isLoading} onClick={() => callDeleteTicket()} className="!bg-red-500">delete</Button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={isOpenUpdateModal} setIsOpen={setIsOpenUpdateModal}>
                <div className="rounded-xl bg-white flex flex-col gap-4 w-80 p-2 pt-6 items-center justify-center">
                    <h1 className="text-primary font-bold text-2xl text-center">update ticket</h1>

                    <div className="flex-col flex w-full justify-center items-center">

                        <TextFiled
                            validation={[
                                { validate: (str: string) => str.length <= 100, massage: "max length of ticket name is 100 characters" },
                                { validate: (str: string) => str.length >= 3, massage: "min length of ticket name is 3 characters" }
                            ]}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            label="ticket name"
                            setIsValid={setIsValidName}
                        />

                        <Select
                            value={type}
                            options={typeOptions}
                            validation={[
                                { validate: (str: string) => typeOptions.includes(str), massage: "un-valid ticket type" }
                            ]}
                            setIsValid={setIsValidType}
                            setValue={setType}
                            label="ticket type"
                        />

                        <Select
                            value={priority}
                            options={priorityOptions}
                            validation={[
                                { validate: (str: string) => priorityOptions.includes(str), massage: "un-valid ticket priority" }
                            ]}
                            setValue={setPriority}
                            setIsValid={setIsValidPriority}
                            label="ticket priority"
                        />

                        <Select
                            value={status}
                            options={statusOptions}
                            validation={[
                                { validate: (str: string) => statusOptions.includes(str), massage: "un-valid ticket status" }
                            ]}
                            setValue={setStatus}
                            setIsValid={setIsValidStatus}
                            label="ticket status"
                        />

                        <SelectUser search={props.ticket.assignedTo?.name} label="chose user to assign this ticket to" route={`members/${projectId}`} setId={setMemberId} id={memberId} />

                        <div className="flex flex-row items-center mt-4  justify-between w-full px-4">
                            <Button onClick={() => setIsOpenUpdateModal(false)}>cancel</Button>
                            <Button isValid={isValidName && isValidType && isValidStatus && isValidPriority} isLoading={updateTicketPayload.isLoading} onClick={() =>  callUpdateTicket({ name, type, priority, status, memberId: !memberId.length ? undefined : memberId })}>update</Button>
                        </div>

                    </div>

                </div>
            </Modal>
        </div>
    )
}

const Tickets = () => {
    const { projectId } = useParams();
    const [take, setTake] = useState(10);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [ticketType, setTicketType] = useState("all");
    const [ticketStatus, setTicketStatus] = useState("all");
    const [ticketPriority, setTicketPriority] = useState("all");
    const [payload, call] = useFetchApi<{ tickets: ITicket[], count: number }>("GET", `ticket/tickets-table/${projectId}?page=${page}&take=${take}&search=${search}&type=${ticketType}&status=${ticketStatus}&priority=${ticketPriority}`, [page, take, search, ticketType, ticketStatus, ticketPriority]);

    const [isOwnerPayload, callIsOwner] = useFetchApi<boolean>("GET", `project/is-owner-or-manger/${projectId}`);

    useLayoutEffect(() => { callIsOwner() }, [])
    useLayoutEffect(() => { call() }, [page, take, search, ticketType, ticketStatus, ticketPriority])

    const handelPrevPage = () => {
        if (page > 1) setPage((prev) => prev - 1)
    }

    const handelNextPage = () => {
        if (payload.result && !(page * take >= payload.result.count)) setPage((prev) => prev + 1)
    }

    // update options
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
                    {payload.isLoading || payload.result === null ? <CircleProgress size="lg" className="mb-4" /> : (
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
                                            {isOwnerPayload.result ? <th scope="col" className="px-6 py-3  min-w-[150px]"> action </th> : null}
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {payload.result.tickets.map((ticket, index) => (
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
                                                <td className="px-6 py-4 min-w-[150px]">{ticket.priority}</td>
                                                <td className="px-6 py-4 min-w-[150px]">{ticket.status}</td>
                                                <td className="px-6 py-4 min-w-[150px]">{ticket.type}</td>

                                                {isOwnerPayload.result ?
                                                    <td className="px-6 py-4 min-w-[150px]">
                                                        <Action call={call} ticket={ticket} />
                                                    </td>
                                                    : null}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex w-full justify-end items-center flex-row gap-2">

                                <p>{((page * take) - take) + 1} to {payload.result.tickets.length === take ? (payload.result.tickets.length + ((page * take) - take)) : payload.result.tickets.length} out of {payload.result.count}</p>

                                <SelectButton options={[5, 10, 15, 20, 100]} label="take" setValue={setTake} value={take} />

                                <AiOutlineArrowLeft
                                    onClick={handelPrevPage}
                                    className={`${page === 1 ? "" : "hover:bg-slate-200 cursor-pointer"} p-2 rounded-xl shadow-md text-4xl`} />

                                <AiOutlineArrowRight
                                    onClick={handelNextPage}
                                    className={`${page * take >= payload.result.count ? "" : "hover:bg-slate-200 cursor-pointer"} p-2 rounded-xl shadow-md text-4xl`} />
                            </div>
                        </>
                    )}
                </div>
            </div>


        </div>
    )
}


export default Tickets;
