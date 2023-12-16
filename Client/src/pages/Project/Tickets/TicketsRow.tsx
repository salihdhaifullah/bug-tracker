import { Link, useParams } from 'react-router-dom';
import { ITicket } from '.'
import formatDate from '../../../utils/formatDate';
import TicketAction from '../../../components/utils/TicketAction';
import labelsColors from '../../../utils/labelsColors';

interface ITicketsRowProps {
    ticket: ITicket;
    isOwnerOrManger: boolean | null;
    call: () => void;
};

const TicketsRow = (props: ITicketsRowProps) => {
    const { projectId } = useParams();

    return (
        <tr className="dark:bg-black dark:hover:bg-gray-950 bg-white border-b dark:border-gray-600 hover:bg-gray-50">

            <td className="px-6 py-4 min-w-[150px]">
                <Link to={`/tickets/${props.ticket.id}`} className="link">
                    {props.ticket.name}
                </Link>
            </td>

            <td className="px-6 py-4 min-w-[150px]">
                <Link to={`/profile/${props.ticket.creator.id}`} className="link">
                    {props.ticket.creator.name}
                </Link>
            </td>

            <td className="px-6 py-4 min-w-[150px]">
                {props.ticket.assignedTo ?
                    <Link to={`/profile/${props.ticket.assignedTo.id}`} className="link">
                        {props.ticket.assignedTo.name}
                    </Link>
                    : 'None'}
            </td>

            <td className="px-6 py-4 min-w-[150px]">{formatDate(props.ticket.createdAt)}</td>
            <td className="px-6 py-4 min-w-[150px]">
                <p className={`rounded-md font-bold dark:border-white border-black w-fit p-1 dark:text-black text-white ${(labelsColors.PRIORITY as any)[props.ticket.priority]}`}>{props.ticket.priority}</p>
            </td>
            <td className="px-6 py-4 min-w-[150px]">
                <p className={`rounded-md font-bold dark:border-white border-black w-fit p-1 dark:text-black text-white ${(labelsColors.STATUS as any)[props.ticket.status]}`}>{props.ticket.status}</p>
            </td>
            <td className="px-6 py-4 min-w-[150px]">
                <p className={`rounded-md font-bold dark:border-white border-black w-fit p-1 dark:text-black text-white ${(labelsColors.TYPE as any)[props.ticket.type]}`}>{props.ticket.type}</p>
            </td>

            {props.isOwnerOrManger ?
                <td className="px-6 py-4 min-w-[150px]">
                    <TicketAction onDelete={props.call} onUpdate={props.call} ticket={{ ...props.ticket, projectId: projectId! }} />
                </td>
                : null}
        </tr>
    )
}

export default TicketsRow
