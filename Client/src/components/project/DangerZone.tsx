import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import Button from "../utils/Button"
import Modal from "../utils/Model";
import Tag from "../utils/Tag";
import formatDate from "../../utils/formatDate";
import { FiUsers } from "react-icons/fi";
import { BiTask } from "react-icons/bi";
import useFetchApi from "../../utils/hooks/useFetchApi";
import SelectUser from "../utils/SelectUser";


interface IDangerZoneProps {
    id: string;
    createdAt: string;
    name: string;
    isPrivate: boolean;
    isReadOnly: boolean;
    members: number;
    tickets: number;
}


const TransferModal = (props: (IDangerZoneProps & { isOpenTransferModal: boolean, setIsOpenTransferModal: Dispatch<SetStateAction<boolean>> })) => {
    const [transferProjectPayload, callTransferProject] = useFetchApi<unknown, { projectId: string, memberId: string }>("POST", "project/transfer");

    const [isSubmit, setIsSubmit] = useState(false);
    const [isValidId, setIsValidId] = useState(true);
    const [memberId, setMemberId] = useState("")

    const handelTransferProject = useCallback(() => {
        props.setIsOpenTransferModal(false);
        callTransferProject({ projectId: props.id, memberId });
    }, [memberId])

    useEffect(() => {
        setIsSubmit(false)
    }, [props.isOpenTransferModal])

    return (
        <Modal isOpen={props.isOpenTransferModal} setIsOpen={props.setIsOpenTransferModal}>
            <div className="flex flex-col justify-center  items-center pt-4 pb-2 px-4 w-[400px] text-center h-full">

                {isSubmit ? (
                    <>
                        <h2 className="text-xl font-bold text-primary">are you sure you want to transfer this project</h2>
                        <h1 className="text-3xl font-black my-4 text-blue-700">{props.name}</h1>

                        <div className="w-full justify-center gap-4 pl-2 my-3 items-start flex flex-col">

                            <Tag name={`Members ${!Number(props.members) ? "none" : Number(props.members)}`} icon={FiUsers} />

                            <Tag name={`Tickets ${!Number(props.tickets) ? "none" : Number(props.tickets)}`} icon={BiTask} />

                            <Tag name={props.isPrivate ? "private" : "public"} />

                            <Tag name={props.isReadOnly ? "archived" : "unarchived"} />

                            <Tag name={`Created At ${formatDate(props.createdAt)}`} />

                        </div>

                        <div className="flex flex-row items-center mt-4  justify-between w-full px-4">
                            <Button isLoading={transferProjectPayload.isLoading} onClick={() => handelTransferProject()} className="!bg-red-600">transfer</Button>
                            <Button onClick={() => props.setIsOpenTransferModal(false)}>cancel</Button>
                        </div>

                    </>
                ) : (
                    <>
                        <SelectUser notMe setIsValid={setIsValidId} required label="chose user to transfer this project to" route={`members/${props.id}`} setId={setMemberId} id={memberId} />
                        <Button isValid={isValidId} onClick={() => setIsSubmit(true)}>Transfer</Button>
                    </>
                )}

            </div>
        </Modal>
    )
}


const useVisibilityModal = (props: IDangerZoneProps): [() => JSX.Element, Dispatch<SetStateAction<boolean>>] => {
    const [isOpenVisibilityModal, setIsOpenVisibilityModal] = useState(false);
    const [visibilityProjectPayload, callVisibilityProject] = useFetchApi<unknown, unknown>("GET", `project/visibility/${props.id}`, [props]);
    const handelVisibilityProject = useCallback(() => {
        setIsOpenVisibilityModal(false);
        callVisibilityProject();
    }, [])


    return [() => (
        <Modal isOpen={isOpenVisibilityModal} setIsOpen={setIsOpenVisibilityModal}>
            <div className="flex flex-col justify-center  items-center pt-4 pb-2 px-4 w-[400px] text-center h-full">
                <h2 className="text-xl font-bold text-primary">are you sure you want to make this project {props.isPrivate ? "public" : "private"}</h2>
                <h1 className="text-3xl font-black my-4 text-blue-700">{props.name}</h1>

                <div className="w-full justify-center gap-4 pl-2 my-3 items-start flex flex-col">

                    <Tag name={`Members ${!Number(props.members) ? "none" : Number(props.members)}`} icon={FiUsers} />

                    <Tag name={`Tickets ${!Number(props.tickets) ? "none" : Number(props.tickets)}`} icon={BiTask} />

                    <Tag name={props.isPrivate ? "private" : "public"} />

                    <Tag name={props.isReadOnly ? "archived" : "unarchived"} />

                    <Tag name={`Created At ${formatDate(props.createdAt)}`} />

                </div>

                <div className="flex flex-row items-center mt-4  justify-between w-full px-4">
                    <Button isLoading={visibilityProjectPayload.isLoading} onClick={handelVisibilityProject} className="!bg-red-600">{props.isPrivate ? "public" : "private"}</Button>
                    <Button onClick={() => setIsOpenVisibilityModal(false)}>cancel</Button>
                </div>

            </div>
        </Modal>
    ), setIsOpenVisibilityModal]
}

const useArchiveModal = (props: IDangerZoneProps): [() => JSX.Element, Dispatch<SetStateAction<boolean>>] => {
    const [isOpenArchiveModal, setIsOpenArchiveModal] = useState(false);
    const [archiveProjectPayload, callArchiveProject] = useFetchApi<unknown, unknown>("GET", `project/archive/${props.id}`, [props]);
    const handelArchiveProject = useCallback(() => {
        setIsOpenArchiveModal(false);
        callArchiveProject();
    }, [])


    return [() => (
        <Modal isOpen={isOpenArchiveModal} setIsOpen={setIsOpenArchiveModal}>
            <div className="flex flex-col justify-center  items-center pt-4 pb-2 px-4 w-[400px] text-center h-full">
                <h2 className="text-xl font-bold text-primary">are you sure you want to {props.isReadOnly ? "unarchive" : "archive"} this project</h2>
                <h1 className="text-3xl font-black my-4 text-blue-700">{props.name}</h1>

                <div className="w-full justify-center gap-4 pl-2 my-3 items-start flex flex-col">

                    <Tag name={`Members ${!Number(props.members) ? "none" : Number(props.members)}`} icon={FiUsers} />

                    <Tag name={`Tickets ${!Number(props.tickets) ? "none" : Number(props.tickets)}`} icon={BiTask} />

                    <Tag name={props.isPrivate ? "private" : "public"} />
                    <Tag name={props.isReadOnly ? "archived" : "unarchived"} />

                    <Tag name={`Created At ${formatDate(props.createdAt)}`} />

                </div>

                <div className="flex flex-row items-center mt-4  justify-between w-full px-4">
                    <Button isLoading={archiveProjectPayload.isLoading} onClick={handelArchiveProject} className="!bg-red-600">{props.isReadOnly ? "unarchive" : "archive"}</Button>
                    <Button onClick={() => setIsOpenArchiveModal(false)}>cancel</Button>
                </div>

            </div>
        </Modal>
    ), setIsOpenArchiveModal]
}

const useDeleteModal = (props: IDangerZoneProps): [() => JSX.Element, Dispatch<SetStateAction<boolean>>] => {
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
    const [deleteProjectPayload, callDeleteProject] = useFetchApi<unknown, unknown>("DELETE", `project/${props.id}`, [props]);
    const handelDeleteProject = useCallback(() => {
        setIsOpenDeleteModal(false);
        callDeleteProject();
    }, [])


    return [() => (
        <Modal isOpen={isOpenDeleteModal} setIsOpen={setIsOpenDeleteModal}>
            <div className="flex flex-col justify-center  items-center pt-4 pb-2 px-4 w-[400px] text-center h-full">
                <h2 className="text-xl font-bold text-primary">are you sure you want to delete this project</h2>
                <h1 className="text-3xl font-black my-4 text-blue-700">{props.name}</h1>

                <div className="w-full justify-center gap-4 pl-2 my-3 items-start flex flex-col">

                    <Tag name={`Members ${!Number(props.members) ? "none" : Number(props.members)}`} icon={FiUsers} />

                    <Tag name={`Tickets ${!Number(props.tickets) ? "none" : Number(props.tickets)}`} icon={BiTask} />

                    <Tag name={props.isPrivate ? "private" : "public"} />

                    <Tag name={props.isReadOnly ? "archived" : "unarchived"} />
                    <Tag name={`Created At ${formatDate(props.createdAt)}`} />

                </div>

                <div className="flex flex-row items-center mt-4  justify-between w-full px-4">
                    <Button isLoading={deleteProjectPayload.isLoading} onClick={handelDeleteProject} className="!bg-red-600">delete</Button>
                    <Button onClick={() => setIsOpenDeleteModal(false)}>cancel</Button>
                </div>

            </div>
        </Modal>
    ), setIsOpenDeleteModal]
}

const DangerZone = (props: IDangerZoneProps) => {

    const [DeleteModal, setIsOpenDeleteModal] = useDeleteModal(props);
    const [ArchiveModal, setIsOpenArchiveModal] = useArchiveModal(props);
    const [VisibilityModal, setIsOpenVisibilityModal] = useVisibilityModal(props);
    const [isOpenTransferModal, setIsOpenTransferModal] = useState(false);

    return (
        <div className='w-full bg-white border border-gray-500 shadow-md rounded-md justify-center items-center flex flex-col p-2'>
            <DeleteModal />
            <ArchiveModal />
            <VisibilityModal />
            <TransferModal   {...props} isOpenTransferModal={isOpenTransferModal} setIsOpenTransferModal={setIsOpenTransferModal} />

            <div className='flex flex-row w-full items-center justify-between p-2 border-b border-gray-500'>
                <div className="flex flex-col">
                    <h3 className="text-primary font-bold">change project visibility</h3>
                    <p className="text-primary">This project is currently {props.isPrivate ? "private" : "public"}.</p>
                </div>
                <Button size="md" onClick={() => setIsOpenVisibilityModal(true)} className="text-red-700  hover:bg-red-600">visibility</Button>
            </div>


            <div className='flex flex-row w-full items-center justify-between p-2 border-b border-gray-500'>
                <div className="flex flex-col">
                    <h3 className="text-primary font-bold">transfer ownership</h3>
                    <p className="text-primary">transfer this project to another user</p>
                </div>
                <Button size="md" onClick={() => setIsOpenTransferModal(true)} className="text-red-700 hover:bg-red-600">transfer</Button>
            </div>


            <div className='flex flex-row w-full items-center justify-between p-2 border-b border-gray-500'>
                <div className="flex flex-col">
                    <h3 className="text-primary font-bold">{props.isReadOnly ? "unarchive project" : "archive project"}</h3>
                    <p className="text-primary">Mark this project as {props.isReadOnly ? "unarchived and read-write" : "archived and read-only"}</p>
                </div>
                <Button size="md" onClick={() => setIsOpenArchiveModal(true)} className="text-red-700 hover:bg-red-600">{props.isReadOnly ? "unarchive" : "archive"}</Button>
            </div>


            <div className='flex flex-row w-full items-center justify-between p-2 border-b border-gray-500'>
                <div className="flex flex-col">
                    <h3 className="text-primary font-bold">Delete project</h3>
                    <p className="text-primary">Once you delete a project, there is no going back. Please be certain.</p>
                </div>
                <Button size="md" onClick={() => setIsOpenDeleteModal(true)} className="text-red-700 hover:bg-red-600">Delete</Button>
            </div>

        </div>
    )
}

export default DangerZone
