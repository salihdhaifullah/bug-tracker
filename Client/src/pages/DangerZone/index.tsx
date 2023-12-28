import { useLayoutEffect } from "react";
import Button from "../../components/utils/Button"
import DeleteModal from "./DeleteModal";
import ArchiveModal from "./ArchiveModal";
import VisibilityModal from "./VisibilityModal";
import TransferModal from "./TransferModal";
import LeaveModal from "./LeaveModal";
import useFetchApi from "../../utils/hooks/useFetchApi";
import { useParams } from "react-router-dom";
import CircleProgress from "../../components/utils/CircleProgress";
import { useModalDispatch } from "../../utils/context/modal";

interface IDangerZoneData {
    name: string;
    isPrivate: boolean;
    isReadOnly: boolean;
    isOwner: boolean;
}

export interface IDangerZoneModalProps extends IDangerZoneData {
    call: () => void;
}


const DangerZone = () => {
    const { projectId } = useParams();
    const [payload, call] = useFetchApi<IDangerZoneData>("GET", `projects/${projectId}/danger-zone`);

    useLayoutEffect(() => { call() }, [call])

    const dispatchModal = useModalDispatch();

    return (
        <section className="h-full w-full py-4 md:px-8 px-3 mt-10 gap-8 flex flex-col">
            {payload.isLoading ? <CircleProgress size="lg" /> : payload.result === null ? null : (
                <div className='w-full bg-white dark:bg-black border border-gray-500 shadow-md dark:shadow-secondary/40 rounded-md justify-center items-center flex flex-col p-2'>

                    {!payload.result.isOwner ? null : (
                        <>
                            <div className='flex flex-row w-full items-center justify-between p-2 border-b border-gray-500'>
                                <div className="flex flex-col">
                                    <h3 className="text-primary dark:text-secondary font-bold">change project visibility</h3>
                                    <p className="text-primary dark:text-secondary">This project is currently {payload.result.isPrivate ? "private" : "public"}.</p>
                                </div>
                                <Button
                                    onClick={() => dispatchModal({ type: "open", payload: <VisibilityModal {...payload.result as IDangerZoneData} call={() => call()} /> })}
                                    className="!text-red-700 hover:!bg-red-600 dark:!text-red-500 dark:hover:!bg-red-400">visibility</Button>
                            </div>


                            <div className='flex flex-row w-full items-center justify-between p-2 border-b border-gray-500'>
                                <div className="flex flex-col">
                                    <h3 className="text-primary dark:text-secondary font-bold">transfer ownership</h3>
                                    <p className="text-primary dark:text-secondary">transfer this project to another user</p>
                                </div>
                                <Button
                                    onClick={() => dispatchModal({ type: "open", payload: <TransferModal {...payload.result as IDangerZoneData} call={() => call()} /> })}
                                    className="!text-red-700 hover:!bg-red-600 dark:!text-red-500 dark:hover:!bg-red-400">transfer</Button>
                            </div>


                            <div className='flex flex-row w-full items-center justify-between p-2 border-b border-gray-500'>
                                <div className="flex flex-col">
                                    <h3 className="text-primary dark:text-secondary font-bold">{payload.result.isReadOnly ? "unarchive project" : "archive project"}</h3>
                                    <p className="text-primary dark:text-secondary">Mark this project as {payload.result.isReadOnly ? "unarchive and read-write" : "archived and read-only"}</p>
                                </div>
                                <Button
                                    onClick={() => dispatchModal({ type: "open", payload: <ArchiveModal {...payload.result as IDangerZoneData} call={() => call()} /> })}
                                    className="!text-red-700 hover:!bg-red-600 dark:!text-red-500 dark:hover:!bg-red-400">{payload.result.isReadOnly ? "unarchive" : "archive"}</Button>
                            </div>

                            <div className='flex flex-row w-full items-center justify-between p-2 border-b border-gray-500'>
                                <div className="flex flex-col">
                                    <h3 className="text-primary dark:text-secondary font-bold">delete project</h3>
                                    <p className="text-primary dark:text-secondary">Once you delete a project, there is no going back. Please be certain.</p>
                                </div>
                                <Button
                                    onClick={() => dispatchModal({ type: "open", payload: <DeleteModal {...payload.result as IDangerZoneData} call={() => call()} /> })}
                                    className="!text-red-700 hover:!bg-red-600 dark:!text-red-500 dark:hover:!bg-red-400">delete</Button>
                            </div>
                        </>
                    )}

                    <div className='flex flex-row w-full items-center justify-between p-2'>
                        <div className="flex flex-col">
                            <h3 className="text-primary dark:text-secondary font-bold">leave project</h3>
                            <p className="text-primary dark:text-secondary">When you leave a project, you will no longer be a member.</p>
                        </div>
                        <Button
                            onClick={() => dispatchModal({ type: "open", payload: <LeaveModal {...payload.result as IDangerZoneData} call={() => call()} /> })}
                            className="!text-red-700 hover:!bg-red-600 dark:!text-red-500 dark:hover:!bg-red-400">leave</Button>
                    </div>
                </div>
            )}
        </section>
    )
}

export default DangerZone;
