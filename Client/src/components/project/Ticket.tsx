import { Link } from "react-router-dom";
import User from "./User";
import { ITicket } from ".";
import formatDate from "../../utils/formatDate";

const Ticket = ({ ticket }: { ticket: ITicket }) => {
    return (
        <div className="p-4 border rounded-lg shadow-sm">

            <Link to={`/tickets/${ticket.id}`} className="link">
                {ticket.name}
            </Link>
            <div className="flex flex-row gap-2">
                <p className="text-sm text-gray-600">Created by: </p>
                <User user={ticket.creator} />
            </div>
            <div className="flex flex-row gap-2">
                <p className="text-sm text-gray-600">Assigned to: </p>
                {ticket.assignedTo ? <User user={ticket.assignedTo} /> : 'None'}
            </div>

            <p className="text-sm text-gray-600">Created at: {formatDate(ticket.createdAt)}</p>
            <p className="text-sm text-gray-600">Priority: {ticket.priority}</p>
            <p className="text-sm text-gray-600">Status: {ticket.status}</p>
            <p className="text-sm text-gray-600">Type: {ticket.type}</p>

        </div>
    );
};

export default Ticket;
