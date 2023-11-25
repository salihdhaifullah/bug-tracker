import { Link, redirect, useParams } from "react-router-dom";
import useFetchApi from "../utils/hooks/useFetchApi";
import CircleProgress from "../components/utils/CircleProgress";
import { useEffect, useRef, useState } from "react";
import Content from "../components/utils/Content";
import formatDate from "../utils/formatDate";
import { useUser } from "../utils/context/user";
import Pagination from "../components/utils/Pagination";
import labelsColors from "../utils/lablesColors";
import Button from "../components/utils/Button";
import { FiMoreVertical } from "react-icons/fi";
import useOnClickOutside from "../utils/hooks/useOnClickOutside";
import TicketAction from "../components/TicketAction";

interface ITicket {
    createdAt: string;
    creator: {
        name: string;
        imageUrl: string;
        id: string;
    };
    project: {
        name: string;
        id: string;
    };
    assignedTo: null | {
        name: string;
        imageUrl: string;
        id: string;
        memberId: string;
    };
    name: string;
    priority: string;
    status: string;
    type: string;
}

interface IComment {
    commenter: {
        name: string;
        imageUrl: string;
        id: string;
    };
    createdAt: string;
    id: string;
}


interface ICommentProps {
    comment: IComment;
    call: () => void
}

interface IActionProps {
    commentId: string;
    call: () => void;
}

const Action = (props: IActionProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const [deletePayload, callDelete] = useFetchApi("DELETE", `comment/${props.commentId}`, [], () => {
        props.call();
    });

    const targetRef = useRef<HTMLDivElement>(null);

    useOnClickOutside(targetRef, () => setIsOpen(false));

    return (
        <div ref={targetRef} className="flex w-fit relative">
            <div onClick={() => setIsOpen(!isOpen)} className="p-1 font-normal text-lg rounded-md hover:bg-slate-300 cursor-pointer">
                <FiMoreVertical />
            </div>

            <div className={`${isOpen ? "flex" : "hidden"} flex flex-col py-2 px-4 justify-center gap-2 items-center absolute right-[50%] bottom-[50%] bg-white rounded shadow-md`}>
                <Button isLoading={deletePayload.isLoading} onClick={() => callDelete()} size="xs" className="w-full shadow-sm">delete</Button>
            </div>

        </div>
    )
}


const Comment = (props: ICommentProps) => {
    const user = useUser();

    return (
        <div className="flex flex-row w-full gap-3 max-w-[800px]">

            <Link to={`/profile/${props.comment.commenter.id}`} className="w-fit h-fit min-w-[2.5rem] min-h-[2.5rem] flex">
                <img
                    title="commenter"
                    className="rounded-full bg-white dark:bg-black shadow-md w-10 h-10 object-contain"
                    src={props.comment.commenter.imageUrl}
                    alt={`${props.comment.commenter.name}`}
                />
            </Link>

            <div className="flex gap-2 w-full flex-col bg-white rounded-md shadow-md relative after:w-0 after:h-0 after:border-t-[7px] after:border-t-transparent after:border-r-[14px] after:border-r-white after:border-b-[7px] after:border-b-transparent after:absolute after:top-3 after:-left-3">

                <div className="flex flex-row justify-between items-center border-b-gray-400 p-2 border-b">
                    <div className="flex flex-row gap-2 justify-start items-center">
                        <Link to={`/profile/${props.comment.commenter.id}`}>
                            <span
                                title="commenter"
                                className="text-primary font-bold hover:underline">{props.comment.commenter.name}</span>
                        </Link>

                        <p title="created at" className="text-gray-600 text-sm font-normal">{formatDate(props.comment.createdAt)}</p>
                    </div>
                    <Action call={props.call} commentId={props.comment.id} />
                </div>

                <div className="flex w-full h-full pl-2">
                    <Content editable={props.comment.commenter.id === user?.id} url={`comment/content/${props.comment.id}`} />
                </div>
            </div>
        </div>
    )
}

const Ticket = () => {
    const { ticketId } = useParams();
    const [commentPage, setCommentPage] = useState(1);
    const [commentTake, _] = useState(10);

    const [payload, call] = useFetchApi<ITicket>("GET", `ticket/${ticketId}`, []);
    const [commentPayload, callComment] = useFetchApi<IComment[]>("GET", `comment/${ticketId}`, [commentPage, commentTake]);
    const [countPayload, callCount] = useFetchApi<number>("GET", `comment/${ticketId}/count`);
    const [isOwnerOrMangerPayload, callIsOwnerOrManger] = useFetchApi<boolean>("GET", `project/is-owner-or-manger/${payload.result?.project.id}`, [payload.result]);

    useEffect(() => {
        call()
        callCount()
    }, [])

    useEffect(() => {
        if (payload.result) callIsOwnerOrManger();
    }, [payload.result])

    useEffect(() => { callComment() }, [commentPage, commentTake])

    const user = useUser();

    return (!payload.result) || payload.isLoading ? <CircleProgress size="lg" /> : (
        <section className="flex flex-col w-full h-full my-10 p-2 flex-grow gap-2">
            <div className="flex flex-row w-full gap-3">

                <Link to={`/profile/${payload.result.creator.id}`} className="w-fit h-fit min-w-[2.5rem] min-h-[2.5rem] flex">
                    <img
                        title="creator"
                        className="rounded-full bg-white dark:bg-black shadow-md w-10 h-10 object-contain"
                        src={payload.result.creator.imageUrl}
                        alt={`${payload.result.creator.name}`}
                    />
                </Link>

                <div className="rounded-lg relative w-full h-full gap-4 flex flex-col shadow-md bg-white after:w-0 after:h-0 after:border-t-[7px] after:border-t-transparent after:border-r-[14px] after:border-r-white after:border-b-[7px] after:border-b-transparent after:absolute after:top-3 after:-left-3">

                    <div className="flex flex-row justify-between items-center border-b-gray-400 p-2 border-b">
                        <div className="flex flex-row gap-2 justify-start items-center">
                            <Link to={`/profile/${payload.result.creator.id}`}>
                                <span
                                    title="creator"
                                    className="text-primary font-bold hover:underline">{payload.result.creator.name}</span>
                            </Link>

                            <p title="created at" className="text-gray-600 text-sm font-normal">{formatDate(payload.result.createdAt)}</p>
                        </div>
                       
                       {(isOwnerOrMangerPayload.result || payload.result.creator.id === user?.id) ?
                                <TicketAction onUpdate={call} onDelete={() => redirect(`/project/${payload.result!.project.id}`)} ticket={{...payload.result, id: ticketId!}}/>
                       : null}

                    </div>


                    <div className="w-full h-full gap-4 flex flex-col p-4">

                        <h2 className="text-3xl font-bold text-primary">{payload.result.name}</h2>

                        <div className="flex text-sm mb-2 flex-row justify-start gap-1 flex-wrap">
                            <span title="type" className={`rounded-sm font-bold border-black w-fit p-1 text-white ${(labelsColors.TYPE as any)[payload.result.type]}`}>{payload.result.type}</span>
                            <span title="priority" className={`rounded-sm font-bold border-black w-fit p-1 text-white ${(labelsColors.PRIORITY as any)[payload.result.priority]}`}>{payload.result.priority}</span>
                            <span title="status" className={`rounded-sm font-bold border-black w-fit p-1 text-white ${(labelsColors.STATUS as any)[payload.result.status]}`}>{payload.result.status}</span>
                        </div>


                        {payload.result.assignedTo ? (
                            <>
                                <Link title="assigned to" className="flex gap-2 items-center flex-row" to={`/profile/${payload.result.assignedTo.id}`}>
                                    <img
                                        className="rounded-full shadow-md w-10 h-10 object-contain"
                                        src={payload.result.assignedTo.imageUrl}
                                        alt={`${payload.result.assignedTo.name}`}
                                    />
                                    <span className="font-bold text-primary hover:underline">{payload.result.assignedTo.name}</span>
                                </Link>
                            </>
                        ) : <p className="font-bold text-primary">unassigned</p>}

                        <Link className="font-bold text-primary text-lg hover:underline" title="project" to={`/project/${payload.result.project.id}`}>{payload.result.project.name}</Link>

                        <Content editable={isOwnerOrMangerPayload.result || payload.result.creator.id === user?.id} url={`ticket/content/${ticketId}`} />
                    </div>

                </div>

            </div>

            <div className="flex w-full justify-center my-10 items-center">
                <div className="flex w-full flex-col max-w-[800px]">
                    <h2 className="text-primary text-2xl font-bold text-start w-full">Comment</h2>
                    <Content call={callComment} form url={`comment/${ticketId}`} />
                </div>
            </div>

            <div className="flex gap-2 flex-col">
                {countPayload.isLoading || commentPayload.isLoading ? <CircleProgress size="md" /> :
                    !(commentPayload.result && countPayload.result && commentPayload.result.length > 0) ? null
                        : (
                            <>
                                {commentPayload.result.map((comment, _) => <Comment key={comment.id} comment={comment} call={callComment} />)}

                                <Pagination
                                    currentPage={commentPage}
                                    pages={Math.ceil(countPayload.result / 10)}
                                    handelOnChange={(newPage) => setCommentPage(newPage)}
                                />
                            </>
                        )}
            </div>

        </section>
    )
}


export default Ticket;
