import { useState } from "react";
import Button from "../../components/utils/Button"
import useFetchApi from "../../utils/hooks/useFetchApi";
import SelectUser from "../../components/utils/SelectUser";
import { IDangerZoneModalProps } from ".";
import { useParams } from "react-router-dom";
import { useModalDispatch } from "../../utils/context/modal";

const TransferModal = (props: IDangerZoneModalProps) => {
    const {projectId } = useParams()
    const [isSubmit, setIsSubmit] = useState(false);
    const [memberId, setMemberId] = useState("")

    const dispatchModal = useModalDispatch();

    const [transferProjectPayload, callTransferProject] = useFetchApi<unknown, { projectId: string, memberId: string }>("PATCH", `projects/${projectId}/danger-zone/transfer`, [], () => {
        dispatchModal({type: "close", payload: null})
    });

    return (
            <div className="flex flex-col justify-center items-center pb-2 px-8 text-center h-full">

                {isSubmit ? (
                    <>
                        <div className="pt-4 pb-14 gap-4 flex flex-col w-full justify-center items-center">
                            <h1 className="text-3xl font-black text-blue-700 dark:text-blue-300">{props.name}</h1>
                            <h2 className="text-xl font-bold text-primary dark:text-secondary">are you sure you want to transfer this project</h2>
                        </div>

                        <div className="flex flex-row items-center mt-10 justify-center w-full px-4">
                            <Button isLoading={transferProjectPayload.isLoading} onClick={() => callTransferProject({ projectId: projectId as string, memberId })} className="!bg-red-600">transfer</Button>
                        </div>

                    </>
                ) : (
                    <>
                        <div className="pt-4 pb-10 gap-4 flex flex-col w-full justify-center items-center">
                            <h1 className="text-3xl font-black text-blue-700 dark:text-blue-300">{props.name}</h1>
                            <h2 className="text-xl font-bold text-primary dark:text-secondary">select user to transfer this project to</h2>
                        </div>

                        <div className="flex flex-col gap-8 p-2 w-full items-start">
                            <SelectUser notMe required label="select user" members={true} setId={setMemberId} id={memberId} />
                            <Button isValid={!!memberId} onClick={() => setIsSubmit(true)}>Transfer</Button>
                        </div>
                    </>
                )}
            </div>
    )
}

export default TransferModal;
