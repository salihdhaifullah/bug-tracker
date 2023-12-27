import { Link, useParams } from "react-router-dom"
import Button from "./Button";
import { ITicket } from "./TicketAction";
import useFetchApi from "../../utils/hooks/useFetchApi";
import { useModalDispatch } from "../../utils/context/modal";

const TicketDeleteModal = (props: {ticket: ITicket, call?: () => void}) => {
    const { projectId } = useParams();

    const dispatchModal = useModalDispatch();

    const [deleteTicketPayload, callDeleteTicket] = useFetchApi("DELETE", `projects/${projectId}/tickets/${props.ticket.id}`, [], () => {
        props?.call && props.call();
        dispatchModal({type: "close", payload: null});
    })

    return (
        <div className="flex flex-col bg-white dark:bg-black justify-center items-center pb-2 text-center h-full">
            <div className="pt-4 pb-12 gap-4 flex flex-col w-full justify-center items-center">
                <h1 className="text-3xl font-black text-blue-700 dark:text-blue-300">
                    <Link to={`/projects/${projectId}/tickets/${props.ticket.id}`}>{props.ticket.name}</Link>
                </h1>
                <h2 className="text-xl font-bold text-primary dark:text-secondary">are you sure you want to delete this ticket</h2>
            </div>

            <div className="flex flex-row items-center mt-4  justify-center w-full px-4">
                <Button isLoading={deleteTicketPayload.isLoading} onClick={() => callDeleteTicket()} className="!bg-red-500">delete</Button>
            </div>
        </div>
    )
}

export default TicketDeleteModal
