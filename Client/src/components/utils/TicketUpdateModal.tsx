import { FormEvent, useState } from 'react'
import Button from './Button'
import Select from './Select'
import SelectUser from './SelectUser'
import TextFiled from './TextFiled'
import { ITicket } from './TicketAction'
import { useParams } from 'react-router-dom'
import useFetchApi from '../../utils/hooks/useFetchApi'
import { useModalDispatch } from '../../utils/context/modal'
import { priorityOptions, statusOptions, typeOptions } from './CreateTicketModal'

const TicketUpdateModal = (props: {ticket: ITicket, call?: () => void}) => {
    const {userId, projectId} = useParams();

    const [name, setName] = useState(props.ticket.name);
    const [type, setType] = useState(props.ticket.type);
    const [priority, setPriority] = useState(props.ticket.priority);
    const [status, setStatus] = useState(props.ticket.status);
    const [memberId, setMemberId] = useState(props.ticket.assignedTo?.memberId || "");
    const [isValidName, setIsValidName] = useState(true);
    const [isValidType, setIsValidType] = useState(true);
    const [isValidPriority, setIsValidPriority] = useState(true);
    const [isValidStatus, setIsValidStatus] = useState(true);

    const dispatchModal = useModalDispatch();

    const [updateTicketPayload, callUpdateTicket] = useFetchApi<unknown, { name: string, type: string, priority: string, status: string, memberId?: string }>("PATCH", `users/${userId}/projects/${projectId}/tickets/${props.ticket.id}`, [], () => {
        props?.call && props.call();
        dispatchModal({type: "close", payload: null});
    });


    const handelSubmit = (e: FormEvent) => {
        e.preventDefault();
        callUpdateTicket({ name, type, priority, status, memberId: !memberId.length ? undefined : memberId })
    }

    return (
        <div className="rounded-xl bg-white dark:bg-black flex flex-col gap-4 pb-2 items-center justify-center">
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

                <SelectUser search={props.ticket.assignedTo?.name} label="assign to" members={true} setId={setMemberId} id={memberId} />

                <div className="flex flex-row items-center mt-4 justify-center w-full px-4">
                    <Button
                        isValid={isValidName && isValidType && isValidStatus && isValidPriority}
                        isLoading={updateTicketPayload.isLoading}
                        buttonProps={{ type: "submit" }}
                    >update</Button>
                </div>

            </form>

        </div>
    )
}

export default TicketUpdateModal
