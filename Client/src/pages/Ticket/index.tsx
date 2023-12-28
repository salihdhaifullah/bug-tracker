import { Link, useParams } from "react-router-dom";
import useFetchApi from "../../utils/hooks/useFetchApi";
import CircleProgress from "../../components/utils/CircleProgress";
import { useLayoutEffect } from "react";
import Content from "../../components/utils/Content";
import formatDate from "../../utils/formatDate";
import { useUser } from "../../utils/context/user";
import labelsColors from "../../utils/labelsColors";
import TicketAction from "../../components/utils/TicketAction";
import Comments from "./Comments";
import Attachment from "./Attachment";
import { Priority, Status, Type } from "../MyTasks";

interface ITicket {
    createdAt: string;
    creator: {
        name: string;
        avatarUrl: string;
        id: string;
    };
    project: {
        name: string;
        id: string;
    };
    assignedTo: null | {
        name: string;
        avatarUrl: string;
        id: string;
        memberId: string;
    };
    name: string;
    priority: Priority;
    status: Status;
    type: Type;
}



const Ticket = () => {
    const { ticketId, projectId } = useParams();
    const [payload, call] = useFetchApi<ITicket>("GET", `projects/${projectId}/tickets/${ticketId}`, []);
    const [rolePayload, callRole] = useFetchApi<string>("GET", `projects/${projectId}/members`);

    useLayoutEffect(() => { call() }, [call])

    useLayoutEffect(() => {
        if (payload.result) callRole();
    }, [callRole, payload.result])

    const user = useUser();

    return payload.isLoading ? <CircleProgress size="lg" /> : payload.result === null ? null : (
        <section className="flex flex-col w-full h-full my-10 p-2 flex-grow">
            <div className="flex flex-row w-full h-full gap-3">

                <Link to={`/users/${payload.result.creator.id}`} className="w-12 h-12 hidden sm:flex">
                    <img
                        title="creator"
                        className="rounded-full bg-white dark:bg-black shadow-md w-10 h-10 object-cover"
                        src={payload.result.creator.avatarUrl}
                        alt={`${payload.result.creator.name}`}
                    />
                </Link>

                <div className="rounded-lg w-full h-full gap-4 flex flex-col shadow-md dark:shadow-secondary/40 bg-white dark:bg-black sm:left-arrow">

                    <div className="flex flex-row justify-between items-center border-b-gray-400 dark:border-b-gray-600 p-2 border-b">
                        <div className="flex flex-row gap-2 justify-start items-center">
                            <Link to={`/users/${payload.result.creator.id}`} className="w-12 h-12 sm:hidden flex">
                                <img
                                    title="creator"
                                    className="rounded-full bg-white dark:bg-black shadow-md w-10 h-10 object-cover"
                                    src={payload.result.creator.avatarUrl}
                                    alt={`${payload.result.creator.name}`}
                                />
                            </Link>

                            <Link className="w-fit h-fit" to={`/users/${payload.result.creator.id}`}>
                                <span
                                    title="creator"
                                    className="text-primary dark:text-secondary font-bold hover:underline">{payload.result.creator.name}</span>
                            </Link>

                            <p title="created at" className="text-gray-600 dark:text-gray-400 text-sm font-normal">{formatDate(payload.result.createdAt)}</p>
                        </div>

                        {(rolePayload.result !== null && ["owner", "project_manger"].includes(rolePayload.result) || payload.result.creator.id === user?.id) ?
                            <TicketAction onUpdate={() => call()} ticket={{ ...payload.result, id: ticketId as string, projectId: payload.result.project.id }} />
                            : null}

                    </div>


                    <div className="w-full h-full gap-4 flex flex-col p-4">

                        <h2 className="text-3xl font-bold text-primary dark:text-secondary">{payload.result.name}</h2>

                        <div className="flex text-sm mb-2 flex-row justify-start gap-1 flex-wrap">
                            <span title="type" className={`rounded-sm font-bold border-black w-fit p-1 text-white dark:border-white dark:text-black ${(labelsColors.TYPE)[payload.result.type]}`}>{payload.result.type}</span>
                            <span title="priority" className={`rounded-sm font-bold border-black w-fit p-1 text-white dark:border-white dark:text-black ${(labelsColors.PRIORITY)[payload.result.priority]}`}>{payload.result.priority}</span>
                            <span title="status" className={`rounded-sm font-bold border-black w-fit p-1 text-white dark:border-white dark:text-black ${(labelsColors.STATUS)[payload.result.status]}`}>{payload.result.status}</span>
                        </div>


                        {payload.result.assignedTo ? (
                            <>
                                <Link title="assigned to" className="flex gap-2 w-fit h-fit items-center flex-row" to={`/users/${payload.result.assignedTo.id}`}>
                                    <img
                                        className="rounded-full shadow-md w-10 h-10 object-cover"
                                        src={payload.result.assignedTo.avatarUrl}
                                        alt={`${payload.result.assignedTo.name}`}
                                    />
                                    <span className="font-bold text-primary dark:text-secondary hover:underline">{payload.result.assignedTo.name}</span>
                                </Link>
                            </>
                        ) : <p className="font-bold text-primary dark:text-secondary">unassigned</p>}

                        <Link className="font-bold w-fit h-fit text-primary dark:text-secondary text-lg hover:underline" title="project" to={`/projects/${payload.result.project.id}`}>{payload.result.project.name}</Link>

                        <Content editable={rolePayload.result !== null && ["owner", "project_manger"].includes(rolePayload.result) || payload.result.creator.id === user?.id} url={`projects/${projectId}/tickets/${ticketId}/content`} />

                        <Attachment isCreator={payload.result.creator.id === user?.id} />
                    </div>

                </div>

            </div>

            <Comments />

        </section>
    )
}


export default Ticket;
