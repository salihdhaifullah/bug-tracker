import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Button from "../../components/utils/Button"
import DeleteModal from "./DeleteModal";
import ArchiveModal from "./ArchiveModal";
import VisibilityModal from "./VisibilityModal";
import TransferModal from "./TransferModal";
import LeaveModal from "./LeaveModal";
import useFetchApi from "../../utils/hooks/useFetchApi";
import { useParams } from "react-router-dom";
import CircleProgress from "../../components/utils/CircleProgress";

export interface IData {
    name: string;
    isPrivate: boolean;
    isReadOnly: boolean;
    isOwner: boolean;
    isMember: boolean;
}

export interface IModalProps {
    name: string;
    isOpenModal: boolean;
    setIsOpenModal: Dispatch<SetStateAction<boolean>>;
}

const DangerZone = () => {
    const { projectId, userId } = useParams()
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
    const [isOpenArchiveModal, setIsOpenArchiveModal] = useState(false);
    const [isOpenVisibilityModal, setIsOpenVisibilityModal] = useState(false);
    const [isOpenTransferModal, setIsOpenTransferModal] = useState(false);
    const [isOpenLeaveModal, setIsOpenLeaveModal] = useState(false);

    const [payload, call] = useFetchApi<IData>("GET", `users/${userId}/projects/${projectId}/danger-zone`);

    useEffect(() => {
        call();
    }, [])

    return (
        <section className="h-full w-full py-4 md:px-8 px-3 mt-10 gap-8 flex flex-col">

            {payload.isLoading ? <CircleProgress size="lg" /> : payload.result === null ? null : (
                <div className='w-full bg-white dark:bg-black border border-gray-500 shadow-md dark:shadow-secondary/40 rounded-md justify-center items-center flex flex-col p-2'>
                    <DeleteModal {...payload.result} isOpenModal={isOpenDeleteModal} setIsOpenModal={setIsOpenDeleteModal} />
                    <ArchiveModal {...payload.result} isOpenModal={isOpenArchiveModal} setIsOpenModal={setIsOpenArchiveModal} />
                    <VisibilityModal {...payload.result} isOpenModal={isOpenVisibilityModal} setIsOpenModal={setIsOpenVisibilityModal} />
                    <TransferModal {...payload.result} isOpenModal={isOpenTransferModal} setIsOpenModal={setIsOpenTransferModal} />
                    <LeaveModal {...payload.result} isOpenModal={isOpenLeaveModal} setIsOpenModal={setIsOpenLeaveModal} />

                    {!payload.result.isOwner ? null : (
                        <>
                            <div className='flex flex-row w-full items-center justify-between p-2 border-b border-gray-500'>
                                <div className="flex flex-col">
                                    <h3 className="text-primary dark:text-secondary font-bold">change project visibility</h3>
                                    <p className="text-primary dark:text-secondary">This project is currently {payload.result.isPrivate ? "private" : "public"}.</p>
                                </div>
                                <Button onClick={() => setIsOpenVisibilityModal(true)} className="!text-red-700 hover:!bg-red-600 dark:!text-red-500 dark:hover:!bg-red-400">visibility</Button>
                            </div>


                            <div className='flex flex-row w-full items-center justify-between p-2 border-b border-gray-500'>
                                <div className="flex flex-col">
                                    <h3 className="text-primary dark:text-secondary font-bold">transfer ownership</h3>
                                    <p className="text-primary dark:text-secondary">transfer this project to another user</p>
                                </div>
                                <Button onClick={() => setIsOpenTransferModal(true)} className="!text-red-700 hover:!bg-red-600 dark:!text-red-500 dark:hover:!bg-red-400">transfer</Button>
                            </div>


                            <div className='flex flex-row w-full items-center justify-between p-2 border-b border-gray-500'>
                                <div className="flex flex-col">
                                    <h3 className="text-primary dark:text-secondary font-bold">{payload.result.isReadOnly ? "unarchive project" : "archive project"}</h3>
                                    <p className="text-primary dark:text-secondary">Mark this project as {payload.result.isReadOnly ? "unarchive and read-write" : "archived and read-only"}</p>
                                </div>
                                <Button onClick={() => setIsOpenArchiveModal(true)} className="!text-red-700 hover:!bg-red-600 dark:!text-red-500 dark:hover:!bg-red-400">{payload.result.isReadOnly ? "unarchive" : "archive"}</Button>
                            </div>

                            <div className='flex flex-row w-full items-center justify-between p-2 border-b border-gray-500'>
                                <div className="flex flex-col">
                                    <h3 className="text-primary dark:text-secondary font-bold">delete project</h3>
                                    <p className="text-primary dark:text-secondary">Once you delete a project, there is no going back. Please be certain.</p>
                                </div>
                                <Button onClick={() => setIsOpenDeleteModal(true)} className="!text-red-700 hover:!bg-red-600 dark:!text-red-500 dark:hover:!bg-red-400">delete</Button>
                            </div>
                        </>
                    )}

                    {payload.result.isMember ? (
                        <div className='flex flex-row w-full items-center justify-between p-2'>
                            <div className="flex flex-col">
                                <h3 className="text-primary dark:text-secondary font-bold">leave project</h3>
                                <p className="text-primary dark:text-secondary">When you leave a project, you will no longer be a member.</p>
                            </div>
                            <Button onClick={() => setIsOpenLeaveModal(true)} className="!text-red-700 hover:!bg-red-600 dark:!text-red-500 dark:hover:!bg-red-400">leave</Button>
                        </div>
                    ) : null}
                </div>
            )}
        </section>
    )
}

export default DangerZone;
