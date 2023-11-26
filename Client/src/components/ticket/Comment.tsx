import { useRef, useState } from "react";
import useFetchApi from "../../utils/hooks/useFetchApi";
import useOnClickOutside from "../../utils/hooks/useOnClickOutside";
import { FiMoreVertical } from "react-icons/fi";
import Button from "../utils/Button";
import { useUser } from "../../utils/context/user";
import Content from "../utils/Content";
import { Link } from "react-router-dom";
import formatDate from "../../utils/formatDate";

export interface IComment {
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

export default Comment;
