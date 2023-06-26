import { useParams } from "react-router-dom";
import useFetchApi from "../utils/hooks/useFetchApi";
import CircleProgress from "../components/utils/CircleProgress";
import { useEffect } from "react";

interface ITicket {
    createdAt: string;
    creator: {
        firstName: string;
        lastName: string;
        imageUrl: string;
        id: string;
    };
    assignedTo: null | {
        firstName: string;
        lastName: string;
        imageUrl: string;
        id: string;
    };
    name: string;
    priority: string;
    status: string;
    type: string;
    comments: {
        id: string;
        commenterId: string;
    }[]
}


const Ticket = () => {
    const { ticketId } = useParams();

    const [payload, call] = useFetchApi<ITicket>("GET", `ticket/${ticketId}`, []);
    useEffect(() => { call() }, [])

    return (!payload.result) || payload.isLoading ? <CircleProgress size="lg" /> : (
        <div className="p-4 rounded-lg shadow-md bg-white">
            <h2 className="text-lg font-semibold">{payload.result.name}</h2>
            <p className="text-gray-600">Created by {payload.result.creator.firstName} {payload.result.creator.lastName}</p>
            <p className="text-gray-600">Assigned to {payload.result.assignedTo ? `${payload.result.assignedTo.firstName} ${payload.result.assignedTo.lastName}` : 'Unassigned'}</p>
            <p className="text-gray-600">Priority: {payload.result.priority}</p>
            <p className="text-gray-600">Status: {payload.result.status}</p>
            <p className="text-gray-600">Type: {payload.result.type}</p>
            <p className="text-gray-600">Comments:</p>
            <ul>
                {payload.result.comments.map(comment => (
                    <li key={comment.id}>{comment.id}</li>
                ))}
            </ul>
        </div>
    )
}


export default Ticket;
