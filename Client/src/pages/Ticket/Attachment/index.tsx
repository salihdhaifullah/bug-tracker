import { useParams } from "react-router-dom"
import formatDate from "../../../utils/formatDate"
import Button from "../../../components/utils/Button";
import { useEffect, useState } from "react";
import useFetchApi from "../../../utils/hooks/useFetchApi";
import CircleProgress from "../../../components/utils/CircleProgress";
import CreateAttachmentModal from "./CreateModal";
import Action from "./Action";

interface IAttachment {
    id: string;
    title: string;
    url: string;
    createdAt: string;
}

const Attachment = (props: { isCreator: boolean }) => {
    const { ticketId, userId, projectId } = useParams();
    const [isOpenCreateAttachmentModal, setIsOpenCreateAttachmentModal] = useState(false);
    const [attachmentsPayload, callAttachments] = useFetchApi<IAttachment[]>("GET", `users/${userId}/projects/${projectId}/tickets/${ticketId}/attachments`);

    useEffect(() => { callAttachments() }, [])

    return (
        <>
            {props.isCreator && <div className="flex flex-row gap-4 w-full flex-wrap items-center pb-4 p-2 bg-white dark:bg-black justify-between">
                <Button onClick={() => setIsOpenCreateAttachmentModal(prev => !prev)}>add attachment</Button>
                <CreateAttachmentModal setIsOpen={setIsOpenCreateAttachmentModal} isOpen={isOpenCreateAttachmentModal} call={callAttachments} />
            </div>}

            {attachmentsPayload.result === null || attachmentsPayload.result.length === 0 ? (
                attachmentsPayload.isLoading ? <CircleProgress size="lg" className="mb-4" /> : null
            ) : (
                <div className="w-full justify-center items-center flex flex-col px-2">

                    <h2 className="text-xl text-primary mb-6 dark:text-secondary font-bold w-full text-center">attachments</h2>

                    <div className="flex flex-col justify-center items-start w-full gap-4">
                        {attachmentsPayload.result.map((attachment, index) => (
                            <div className="flex flex-row justify-between w-full items-center" key={index}>

                                <a target="_blank" className="link w-[50%]" href={attachment.url}>
                                    {attachment.title}
                                </a>

                                <p className="dark:text-gray-200 text-gray-800 w-[30%]"> {formatDate(attachment.createdAt)} </p>

                                {props.isCreator && <Action call={callAttachments} id={attachment.id} title={attachment.title} />}
                            </div>
                        ))}
                    </div>

                </div>
            )}
        </>
    )
}

export default Attachment;
