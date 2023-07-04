import { Link, useParams } from "react-router-dom"
import formatDate from "../../utils/formatDate"
import Button from "../utils/Button";
import useFetchApi from "../../utils/hooks/useFetchApi";
import { useLayoutEffect } from "react";
import CircleProgress from "../utils/CircleProgress";

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

const Tickets = () => {
    const { projectId } = useParams();
    const [payload, call] = useFetchApi<ITicket[]>("GET", `ticket/tickets-table/${projectId}`);

    useLayoutEffect(() => { call() }, [])

    return (
        <div className="my-10">

            <h2 className="text-3xl font-bold w-full mb-10 text-center">Tickets</h2>
            <div className="w-full overflow-x-auto bg-white border border-gray-500 shadow-md rounded-md justify-center items-center flex flex-col p-2">

                <div className="flex flex-row gap-4 mt-4 items-center pb-4 p-2 bg-white justify-between">

                    <div className="flex flex-row gap-4 mt-4 items-center">
                        <h2 className="text-xl font-bold">Tickets</h2>
                        <Link to={`/project/${projectId}/create-ticket`}>
                            <Button size="sm">create ticket</Button>
                        </Link>
                    </div>

                    <div className="flex items-center justify-center">
                        <label htmlFor="table-search-users" className="sr-only">Search</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg className="w-5 h-5 text-gray-500" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path></svg>
                            </div>
                            <input type="text" id="table-search-users" className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500" placeholder="Search for users" />
                        </div>
                    </div>

                </div>

                {payload.isLoading || !payload.result ? <CircleProgress size="md" /> : (

                    <table className="w-full text-sm text-left text-gray-500">

                        <thead className="text-xs text-gray-700 uppercase bg-white">

                            <tr>
                                <th scope="col" className="px-6 py-3"> name </th>
                                <th scope="col" className="px-6 py-3"> created by </th>
                                <th scope="col" className="px-6 py-3"> assigned to </th>
                                <th scope="col" className="px-6 py-3"> created at </th>
                                <th scope="col" className="px-6 py-3"> priority </th>
                                <th scope="col" className="px-6 py-3"> status </th>
                                <th scope="col" className="px-6 py-3"> type </th>
                            </tr>

                        </thead>

                        <tbody>
                            {payload.result.map((ticket, index) => (
                                <tr className="bg-white border-b hover:bg-gray-50" key={index}>

                                    <td>
                                        <Link to={`/tickets/${ticket.id}`} className="link">
                                            {ticket.name}
                                        </Link>
                                    </td>

                                    <td className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap">
                                        <Link to={`/profile/${ticket.creator.id}`} className="link">
                                            {ticket.creator.name}
                                        </Link>
                                    </td>

                                    <td className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap">
                                        {ticket.assignedTo ?
                                            <Link to={`/profile/${ticket.assignedTo.id}`} className="link">
                                                {ticket.assignedTo.name}
                                            </Link>
                                            : 'None'}
                                    </td>

                                    <td className="px-6 py-4">{formatDate(ticket.createdAt)}</td>
                                    <td className="px-6 py-4">{ticket.priority}</td>
                                    <td className="px-6 py-4">{ticket.status}</td>
                                    <td className="px-6 py-4">{ticket.type}</td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}


export default Tickets;
