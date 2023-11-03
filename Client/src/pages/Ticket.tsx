import { Link, useParams } from "react-router-dom";
import useFetchApi from "../utils/hooks/useFetchApi";
import CircleProgress from "../components/utils/CircleProgress";
import { useLayoutEffect, useState } from "react";
import Content from "../components/utils/Content";
import formatDate from "../utils/formatDate";
import { useUser } from "../utils/context/user";
import Pagination from "../components/utils/Pagination";

interface ITicket {
    createdAt: string;
    creator: {
        name: string;
        imageUrl: string;
        id: string;
    };
    assignedTo: null | {
        name: string;
        imageUrl: string;
        id: string;
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
    index: number;
    call: () => void
}

const Comment = (props: ICommentProps) => {
    const user = useUser();
    const [_, deleteComment] = useFetchApi("DELETE", `comment/${props.comment.id}`, [], () => {
      props.call();
    });

    return (
        <div key={props.index} className="flex gap-2 flex-col bg-white rounded-md shadow-md">

            <p>created at {formatDate(props.comment.createdAt)}</p>

            <div title="commenter" className="flex gap-2 flex-row justify-start items-center text-gray-600">
                <p>Created By: </p>
                <Link to={`/profile/${props.comment.commenter.id}`}>
                    <div className="flex items-center">
                        <img
                            className="rounded-full shadow-md w-10 h-10 object-contain"
                            src={props.comment.commenter.imageUrl}
                            alt={`${props.comment.commenter.name}`}
                        />
                        <span className="ml-2 font-medium">{props.comment.commenter.name}</span>
                    </div>
                </Link>
            </div>
            <Content handelDelete={deleteComment} editable={props.comment.commenter.id === user?.id} url={`comment/content/${props.comment.id}`} />
        </div>
    )
}

const Ticket = () => {
    const { ticketId } = useParams();
    const [commentPage, setCommentPage] = useState(1);
    const [commentTake, _] = useState(10);

    const [payload, call] = useFetchApi<ITicket>("GET", `ticket/${ticketId}`, []);
    const [commentPayload, callComment] = useFetchApi<{ count: number, comments: IComment[] }>("GET", `comment/${ticketId}`, [commentPage, commentTake]);

    useLayoutEffect(() => { call() }, [])
    useLayoutEffect(() => { callComment() }, [commentPage, commentTake])

    return (!payload.result) || payload.isLoading ? <CircleProgress size="lg" /> : (
        <section className="flex flex-col w-full h-full my-10 p-2 flex-grow gap-2">
            <div className="p-4 rounded-lg shadow-md bg-white">
                <h2 className="text-lg font-semibold">{payload.result.name}</h2>

                <div className="flex flex-col gap-2 my-2">
                    <div title="creator" className="flex gap-2 flex-row justify-start items-center text-gray-600">
                        <p>Created By: </p>
                        <Link to={`/profile/${payload.result.creator.id}`}>
                            <div className="flex items-center">
                                <img
                                    className="rounded-full shadow-md w-10 h-10 object-contain"
                                    src={payload.result.creator.imageUrl}
                                    alt={`${payload.result.creator.name}`}
                                />
                                <span className="ml-2 font-medium">{payload.result.creator.name}</span>
                            </div>
                        </Link>
                    </div>

                    <div title="assigned to" className="flex gap-2 flex-row justify-start items-center text-gray-600">
                        {payload.result.assignedTo ? (
                            <>
                                <p>Assigned To: </p>
                                <Link to={`/profile/${payload.result.assignedTo.id}`}>
                                    <div className="flex items-center">
                                        <img
                                            className="rounded-full shadow-md w-10 h-10 object-contain"
                                            src={payload.result.assignedTo.imageUrl}
                                            alt={`${payload.result.assignedTo.name}`}
                                        />
                                        <span className="ml-2 font-medium">{payload.result.assignedTo.name}</span>
                                    </div>
                                </Link>
                            </>
                        ) : <p>Unassigned</p>}
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <p className="text-gray-600 flex flex-row gap-2">
                        <span className="text-primary font-medium"> Priority: </span>
                        <span> {payload.result.priority} </span>
                    </p>

                    <p className="text-gray-600 flex flex-row gap-2">
                        <span className="text-primary font-medium"> Status: </span>
                        <span> {payload.result.status} </span>
                    </p>

                    <p className="text-gray-600 flex flex-row gap-2">
                        <span className="text-primary font-medium"> Type: </span>
                        <span> {payload.result.type} </span>
                    </p>

                    <p className="text-gray-600 flex flex-row gap-2">
                        <span className="text-primary font-medium"> Created At: </span>
                        <span> {formatDate(payload.result.createdAt)} </span>
                    </p>
                </div>

                <Content editable url={`ticket/content/${ticketId}`} />

            </div>

            <div className="flex gap-2 flex-col">
                {!commentPayload.result ? (
                    <CircleProgress size="md" />
                ) : commentPayload.result.comments.length > 0 && (
                    <>
                        {commentPayload.result.comments.map((comment, index) => (
                            <Comment comment={comment} index={index} call={callComment}/>
                        ))}

                        <Pagination
                            currentPage={commentPage}
                            pages={commentPayload.result?.count || 0}
                            handelOnChange={(newPage) => setCommentPage(newPage)}
                        />
                    </>
                )}
            </div>

            <Content form url={`comment/${ticketId}`} />

        </section>
    )
}


export default Ticket;
