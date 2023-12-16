import { FiMoreVertical } from "react-icons/fi";
import { priorityOptions, statusOptions, typeOptions } from "./CreateTicketModal";
import Button from "./Button";
import Modal from "./Modal";
import Select from "./Select";
import SelectUser from "./SelectUser";
import TextFiled from "./TextFiled";
import useOnClickOutside from "../../utils/hooks/useOnClickOutside";
import { FormEvent, useEffect, useRef, useState } from "react";
import useFetchApi from "../../utils/hooks/useFetchApi";
import { Link } from "react-router-dom";

interface ITicket {
    name: string;
    createdAt: string;
    creator: { name: string, id: string };
    assignedTo: { name: string, id: string, memberId: string } | null;
    priority: string;
    status: string;
    type: string;
    id: string;
    projectId: string;
}


interface IActionProps {
    ticket: ITicket
    onDelete?: () => void;
    onUpdate?: () => void;
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

    const targetRef = useRef<HTMLDivElement>(null);

    const handelCancel = () => {
        setName(props.ticket.name);
        setType(props.ticket.type);
        setPriority(props.ticket.priority);
        setStatus(props.ticket.status);
        setMemberId(props.ticket.assignedTo?.memberId || "");
        setIsOpenUpdateModal(false)
    }

    useEffect(() => {
        if (!isOpenUpdateModal) handelCancel()
    }, [isOpenUpdateModal])

    const [isDelete, setIsDelete] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);

    useEffect(() => {
        if (isDelete && props?.onDelete) props.onDelete();
    }, [isDelete])

    const [deleteTicketPayload, callDeleteTicket] = useFetchApi("DELETE", `ticket/${props.ticket.id}`, [], () => {
        setIsOpenDeleteModal(false);
        setIsDelete(true);
    })

    useEffect(() => {
        if (isUpdate && props?.onUpdate) props.onUpdate();
    }, [isUpdate])

    const [updateTicketPayload, callUpdateTicket] = useFetchApi<unknown, { name: string, type: string, priority: string, status: string, memberId?: string }>("PATCH", `ticket/${props.ticket.id}`, [], () => {
        setIsOpenUpdateModal(false);
        setIsUpdate(true);
    });

    useOnClickOutside(targetRef, () => setIsOpen(false));

    const handelSubmit = (e: FormEvent) => {
        e.preventDefault();
        callUpdateTicket({ name, type, priority, status, memberId: !memberId.length ? undefined : memberId })
    }

    return (
        <div ref={targetRef} className="flex w-fit relative">
            <div onClick={() => setIsOpen(!isOpen)} className="p-1 font-normal text-lg dark:text-gray-400 hover:dark:text-gray-200 text-gray-600 hover:text-gray-800 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer">
                <FiMoreVertical />
            </div>

            <div className={`${isOpen ? "scale-100" : "scale-0"} transition-all flex flex-col gap-2 py-2 px-4 bg-white dark:bg-black justify-center items-center absolute right-[80%] -bottom-[50%] rounded shadow-md dark:shadow-secondary/40`}>
                <Button onClick={() => setIsOpenDeleteModal(true)} size="sm" className="w-full">delete</Button>
                <Button onClick={() => setIsOpenUpdateModal(true)} size="sm" className="w-full">update</Button>
            </div>

            <Modal isOpen={isOpenDeleteModal} setIsOpen={setIsOpenDeleteModal}>
                <div className="flex flex-col bg-white dark:bg-black justify-center items-center pt-4 pb-2 px-4 w-[400px] text-center h-full">
                    <div className="pt-4 pb-14 gap-4 flex flex-col w-full justify-center items-center">
                        <h1 className="text-3xl font-black text-blue-700 dark:text-blue-300">
                            <Link to={`/ticket/${props.ticket.id}`}>{props.ticket.name}</Link>
                        </h1>
                        <h2 className="text-xl font-bold text-primary dark:text-secondary">are you sure you want to delete this ticket</h2>
                    </div>

                    <div className="flex flex-row items-center mt-4  justify-between w-full px-4">
                        <Button onClick={() => setIsOpenDeleteModal(false)}>cancel</Button>
                        <Button isLoading={deleteTicketPayload.isLoading} onClick={() => callDeleteTicket()} className="!bg-red-500">delete</Button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={isOpenUpdateModal} setIsOpen={setIsOpenUpdateModal}>
                <div className="rounded-xl bg-white dark:bg-black flex flex-col gap-4 w-80 p-2 pt-6 items-center justify-center">
                    <div className="pb-4 gap-4 flex flex-col w-full text-center justify-center items-center">
                        <h1 className="text-3xl font-black text-blue-700 dark:text-blue-300">{props.ticket.name}</h1>
                        <h2 className="text-xl font-bold text-primary dark:text-secondary">are you sure you want to update this ticket</h2>
                    </div>

                    <form className="flex-col flex w-full justify-center items-center" onSubmit={handelSubmit}>

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

                        <SelectUser search={props.ticket.assignedTo?.name} label="assign to" route={`members/${props.ticket.projectId}`} setId={setMemberId} id={memberId} />

                        <div className="flex flex-row items-center mt-4  justify-between w-full px-4">
                            <Button onClick={handelCancel}>cancel</Button>
                            <Button
                                isValid={isValidName && isValidType && isValidStatus && isValidPriority}
                                isLoading={updateTicketPayload.isLoading}
                                buttonProps={{ type: "submit" }}
                            >update</Button>
                        </div>

                    </form>

                </div>
            </Modal>
        </div>
    )
}

export default TicketAction;
