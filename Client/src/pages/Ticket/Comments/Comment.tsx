import { useUser } from "../../../utils/context/user";
import Content from "../../../components/utils/Content";
import { Link, useParams } from "react-router-dom";
import formatDate from "../../../utils/formatDate";
import Action from "./Action";
import { IComment } from ".";

interface ICommentProps {
    comment: IComment;
    isReadOnly: boolean;
    call: () => void
}

const Comment = (props: ICommentProps) => {
    const user = useUser();
    const { projectId, ticketId } = useParams();

    return (
        <div className="flex flex-row w-full gap-3">

            <Link to={`/users/${props.comment.commenter.id}`} className="w-12 h-12 hidden sm:flex">
                <img
                    title="commenter"
                    className="rounded-full bg-white dark:bg-black shadow-md w-10 h-10 object-cover"
                    src={props.comment.commenter.avatarUrl}
                    alt={`${props.comment.commenter.name}`}
                />
            </Link>

            <div className="flex gap-2 w-full flex-col dark:shadow-secondary/40 bg-white dark:bg-black rounded-md shadow-md sm:left-arrow">

                <div className="flex flex-row justify-between items-center border-b-gray-400 dark:border-b-gray-600 p-2 border-b">
                    <div className="flex flex-row gap-2 justify-start items-center">

                        <Link to={`/users/${props.comment.commenter.id}`} className="w-12 h-12 sm:hidden flex">
                            <img
                                title="commenter"
                                className="rounded-full bg-white dark:bg-black shadow-md w-10 h-10 object-cover"
                                src={props.comment.commenter.avatarUrl}
                                alt={`${props.comment.commenter.name}`}
                            />
                        </Link>

                        <Link to={`/users/${props.comment.commenter.id}`}>
                            <span
                                title="commenter"
                                className="text-primary dark:text-secondary font-bold hover:underline">{props.comment.commenter.name}</span>
                        </Link>

                        <p title="created at" className="text-gray-600 dark:text-gray-400 text-sm font-normal">{formatDate(props.comment.createdAt)}</p>
                    </div>
                    {user === null || props.isReadOnly ? null : (
                        <Action call={props.call} commentId={props.comment.id} />
                    )}
                </div>

                <div className="flex w-full h-full pl-2">
                    <Content editable={props.comment.commenter.id === user?.id && !props.isReadOnly} url={`projects/${projectId}/tickets/${ticketId}/comments/${props.comment.id}/content`} />
                </div>
            </div>
        </div>
    )
}

export default Comment;
