import { Link, useParams } from "react-router-dom";
import useFetchApi from "../utils/hooks/useFetchApi";
import CircleProgress from "../components/utils/CircleProgress";
import { useCallback, useEffect } from "react";
import Content from "../components/utils/Content";
import formatDate from "../utils/formatDate";
import { useUser } from "../utils/context/user";
import { useNavigate, useLocation } from 'react-router-dom';

import labelsColors from "../utils/labelsColors";
import TicketAction from "../components/TicketAction";
import Comments from "../components/ticket/Comments";
import Attachment from "../components/ticket/Attachment";

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
    priority: string;
    status: string;
    type: string;
}



const Ticket = () => {
    const { ticketId } = useParams();
    const [payload, call] = useFetchApi<ITicket>("GET", `ticket/${ticketId}`, []);
    const [isOwnerOrMangerPayload, callIsOwnerOrManger] = useFetchApi<boolean>("GET", `project/is-owner-or-manger/${payload.result?.project.id}`, [payload.result]);

    const navigate = useNavigate();
    const location = useLocation();

    const handelDelete = useCallback(() => {
        const previousPath = location.state?.from || '/';

        if (location.key !== 'initial' && previousPath !== location.pathname) {
            navigate(-1);
        } else {
            navigate(`/project/${payload.result?.project.id}`);
        }
    }, [payload.result])

    useEffect(() => { call() }, [])

    useEffect(() => {
        if (payload.result) callIsOwnerOrManger();
    }, [payload.result])

    const user = useUser();

    return payload.isLoading ? <CircleProgress size="lg" /> : payload.result === null ? null : (
        <section className="flex flex-col w-full h-full my-10 p-2 flex-grow overflow-y-hidden">
            <div className="flex flex-row w-full h-full gap-3">

                <Link to={`/profile/${payload.result.creator.id}`} className="w-fit h-fit min-w-[2.5rem] min-h-[2.5rem] flex">
                    <img
                        title="creator"
                        className="rounded-full bg-white dark:bg-black shadow-md w-10 h-10 object-contain"
                        src={payload.result.creator.avatarUrl}
                        alt={`${payload.result.creator.name}`}
                    />
                </Link>

                <div className="rounded-lg relative w-full h-full gap-4 flex flex-col shadow-md dark:shadow-secondary/40 bg-white dark:bg-black after:w-0 after:h-0 after:border-t-[7px] after:border-t-transparent after:border-r-[14px] after:border-r-white dark:after:border-r-black after:border-b-[7px] after:border-b-transparent after:absolute after:top-3 after:-left-3">

                    <div className="flex flex-row justify-between items-center border-b-gray-400 dark:border-b-gray-600 p-2 border-b">
                        <div className="flex flex-row gap-2 justify-start items-center">
                            <Link className="w-fit h-fit" to={`/profile/${payload.result.creator.id}`}>
                                <span
                                    title="creator"
                                    className="text-primary dark:text-secondary font-bold hover:underline">{payload.result.creator.name}</span>
                            </Link>

                            <p title="created at" className="text-gray-600 dark:text-gray-400 text-sm font-normal">{formatDate(payload.result.createdAt)}</p>
                        </div>

                        {(isOwnerOrMangerPayload.result || payload.result.creator.id === user?.id) ?
                            <TicketAction onUpdate={call} onDelete={handelDelete} ticket={{ ...payload.result, id: ticketId!, projectId: payload.result.project.id }} />
                            : null}

                    </div>


                    <div className="w-full h-full gap-4 flex flex-col p-4">

                        <h2 className="text-3xl font-bold text-primary dark:text-secondary">{payload.result.name}</h2>

                        <div className="flex text-sm mb-2 flex-row justify-start gap-1 flex-wrap">
                            <span title="type" className={`rounded-sm font-bold border-black w-fit p-1 text-white dark:border-white dark:text-black ${(labelsColors.TYPE as any)[payload.result.type]}`}>{payload.result.type}</span>
                            <span title="priority" className={`rounded-sm font-bold border-black w-fit p-1 text-white dark:border-white dark:text-black ${(labelsColors.PRIORITY as any)[payload.result.priority]}`}>{payload.result.priority}</span>
                            <span title="status" className={`rounded-sm font-bold border-black w-fit p-1 text-white dark:border-white dark:text-black ${(labelsColors.STATUS as any)[payload.result.status]}`}>{payload.result.status}</span>
                        </div>


                        {payload.result.assignedTo ? (
                            <>
                                <Link title="assigned to" className="flex gap-2 w-fit h-fit items-center flex-row" to={`/profile/${payload.result.assignedTo.id}`}>
                                    <img
                                        className="rounded-full shadow-md w-10 h-10 object-contain"
                                        src={payload.result.assignedTo.avatarUrl}
                                        alt={`${payload.result.assignedTo.name}`}
                                    />
                                    <span className="font-bold text-primary dark:text-secondary hover:underline">{payload.result.assignedTo.name}</span>
                                </Link>
                            </>
                        ) : <p className="font-bold text-primary dark:text-secondary">unassigned</p>}

                        <Link className="font-bold w-fit h-fit text-primary dark:text-secondary text-lg hover:underline" title="project" to={`/project/${payload.result.project.id}`}>{payload.result.project.name}</Link>

                        <Content editable={isOwnerOrMangerPayload.result || payload.result.creator.id === user?.id} url={`ticket/content/${ticketId}`} />
                    </div>

                </div>

            </div>

            <Attachment />
            <Comments />

        </section>
    )
}


export default Ticket;
