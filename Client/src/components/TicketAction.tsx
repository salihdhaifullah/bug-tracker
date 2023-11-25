import { FiMoreVertical } from "react-icons/fi";
import { priorityOptions, statusOptions, typeOptions } from "../pages/CreateTicket";
import Button from "./utils/Button";
import Modal from "./utils/Model";
import Select from "./utils/Select";
import SelectUser from "./utils/SelectUser";
import TextFiled from "./utils/TextFiled";
import useOnClickOutside from "../utils/hooks/useOnClickOutside";
import { useEffect, useRef, useState } from "react";
import useFetchApi from "../utils/hooks/useFetchApi";
import { useParams } from "react-router-dom";

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


interface IActionProps {
    ticket: ITicket
    onDelete: () => void;
    onUpdate: () => void;
}

const TicketAction = (props: IActionProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
    const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);
    const [name, setName] = useState(props.ticket.name);
    const [type, setType] = useState(props.ticket.type);
    const [priority, setPriority] = useState(props.ticket.priority);
    const [status, setStatus] = useState(props.ticket.status);
    const [memberId, setMemberId] = useState(props.ticket.assignedTo?.memberId || "");
    const [isValidName, setIsValidName] = useState(true);
    const [isValidType, setIsValidType] = useState(true);
    const [isValidPriority, setIsValidPriority] = useState(true);
    const [isValidStatus, setIsValidStatus] = useState(true);
    const { projectId } = useParams();

    const targetRef = useRef<HTMLDivElement>(null);

    const [deleteTicketPayload, callDeleteTicket] = useFetchApi("DELETE", `ticket/${props.ticket.id}`, [], () => {
        setIsOpenDeleteModal(false);
        props.onDelete();
    })

    const [updateTicketPayload, callUpdateTicket] = useFetchApi<unknown, { name: string, type: string, priority: string, status: string, memberId?: string }>("PATCH", `ticket/${props.ticket.id}`, [], () => {
        setIsOpenUpdateModal(false);
        props.onUpdate();
    });

    useOnClickOutside(targetRef, () => setIsOpen(false));

    return (
        <div ref={targetRef} className="flex w-fit relative">
            <div onClick={() => setIsOpen(!isOpen)} className="p-1 font-normal text-lg rounded-md hover:bg-slate-300 cursor-pointer">
                <FiMoreVertical />
            </div>

            <div className={`${isOpen ? "scale-100" : "scale-0"} flex transition-all flex-col py-2 px-4 bg-white justify-center items-center gap-1 absolute right-[80%] -bottom-[50%] rounded shadow-md`}>
                <Button onClick={() => setIsOpenDeleteModal(true)} size="sm" className="w-full shadow-sm">delete</Button>
                <Button onClick={() => setIsOpenUpdateModal(true)} size="sm" className="w-full shadow-sm">update</Button>
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
                            <Button isValid={isValidName && isValidType && isValidStatus && isValidPriority} isLoading={updateTicketPayload.isLoading} onClick={() => callUpdateTicket({ name, type, priority, status, memberId: !memberId.length ? undefined : memberId })}>update</Button>
                        </div>

                    </div>

                </div>
            </Modal>
        </div>
    )
}

export default TicketAction;
