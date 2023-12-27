import { useParams } from "react-router-dom";
import Pagination from "../../../components/utils/Pagination";
import useFetchApi from "../../../utils/hooks/useFetchApi";
import CircleProgress from "../../../components/utils/CircleProgress";
import { useEffect, useState } from "react";
import Comment from "./Comment";
import CreateComment from "./CreateComment";

export interface IComment {
    commenter: {
        name: string;
        avatarUrl: string;
        id: string;
    };
    createdAt: string;
    id: string;
}

const commentTake = 10;

const Comments = () => {
    const { ticketId, projectId } = useParams();

    const [commentPage, setCommentPage] = useState(1);

    const [commentPayload, callComment] = useFetchApi<IComment[]>("GET", `projects/${projectId}/tickets/${ticketId}/comments`, [commentPage, commentTake]);
    const [countPayload, callCount] = useFetchApi<number>("GET", `projects/${projectId}/tickets/${ticketId}/comments/count`);

    useEffect(() => { callCount() }, [callCount])
    useEffect(() => { callComment() }, [callComment, commentPage])

    const call = () => {
        callComment()
        callCount()
    }

    return (
        <div className="flex flex-col justify-center items-center w-full h-auto my-10">
            <div className="flex w-full h-full justify-center items-center">
                <div className="flex w-full h-full flex-col max-w-[800px]">
                    <CreateComment call={() => call()} />
                </div>
            </div>

            <div className="flex gap-6 flex-col w-full my-10">
                {countPayload.isLoading || commentPayload.isLoading ? <CircleProgress size="md" /> :
                    !(commentPayload.result && countPayload.result && commentPayload.result.length > 0) ? null
                        : (
                            <>
                                {commentPayload.result.map((comment) => <Comment key={comment.id} comment={comment} call={() => callComment()} />)}

                                <Pagination
                                    currentPage={commentPage}
                                    pages={Math.ceil(countPayload.result / 10)}
                                    handelOnChange={(newPage) => setCommentPage(newPage)}
                                />
                            </>
                        )}
            </div>
        </div>
    )
}

export default Comments;
