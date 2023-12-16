import { useParams } from "react-router-dom";
import Pagination from "../../../components/utils/Pagination";
import Content from "../../../components/utils/Content";
import useFetchApi from "../../../utils/hooks/useFetchApi";
import CircleProgress from "../../../components/utils/CircleProgress";
import { useEffect, useState } from "react";
import Comment from "./Comment";

export interface IComment {
    commenter: {
        name: string;
        avatarUrl: string;
        id: string;
    };
    createdAt: string;
    id: string;
}

const Comments = () => {
    const { ticketId } = useParams();

    const [commentPage, setCommentPage] = useState(1);
    const [commentTake, _] = useState(10);

    const [commentPayload, callComment] = useFetchApi<IComment[]>("GET", `comment/${ticketId}`, [commentPage, commentTake]);
    const [countPayload, callCount] = useFetchApi<number>("GET", `comment/${ticketId}/count`);

    useEffect(() => { callCount() }, [])
    useEffect(() => { callComment() }, [commentPage, commentTake])

    return (
        <>
            <div className="flex w-full justify-center my-10 items-center">
                <div className="flex w-full flex-col max-w-[800px]">
                    <h2 className="text-primary dark:text-secondary text-2xl font-bold text-start w-full">Comment</h2>
                    <Content call={callComment} form url={`comment/${ticketId}`} />
                </div>
            </div>

            <div className="flex gap-6 flex-col">
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
        </>
    )
}

export default Comments;
