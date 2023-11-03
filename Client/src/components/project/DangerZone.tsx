import { useCallback, useState } from "react";
import Button from "../utils/Button"
import Modal from "../utils/Model";
import Tag from "../utils/Tag";
import formatDate from "../../utils/formatDate";
import { FiUsers } from "react-icons/fi";
import { BiTask } from "react-icons/bi";
import useFetchApi from "../../utils/hooks/useFetchApi";


interface IDangerZoneProps {
    id: string;
    createdAt: string;
    name: string;
    isPrivate: boolean;
    members: number;
    tickets: number;
}

const DangerZone = (props: IDangerZoneProps) => {
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
    const [deleteProjectPayload, callDeleteProject] = useFetchApi<unknown, unknown>("DELETE", `project/${props.id}`, [props]);
    const handelDeleteProject = useCallback(() => {
        setIsOpenDeleteModal(false);
        callDeleteProject();
    }, [])

    return (
        <div className='w-full bg-white border border-gray-500 shadow-md rounded-md justify-center items-center flex flex-col p-2'>

            <Modal isOpen={isOpenDeleteModal} setIsOpen={setIsOpenDeleteModal}>
                <div className="flex flex-col justify-center  items-center pt-4 pb-2 px-4 w-[400px] text-center h-full">
                    <h2 className="text-xl font-bold text-primary">are you sure you want to delete this project</h2>
                    <h1 className="text-3xl font-black my-4 text-blue-700">{props.name}</h1>

                    <div className="w-full justify-center gap-4 pl-2 my-3 items-start flex flex-col">

                        <Tag name={`Members ${!Number(props.members) ? "none" : Number(props.members)}`} icon={FiUsers} />

                        <Tag name={`Tickets ${!Number(props.tickets) ? "none" : Number(props.tickets)}`} icon={BiTask} />

                        <Tag name={props.isPrivate ? "private" : "public"} />

                        <Tag name={`Created At ${formatDate(props.createdAt)}`} />

                    </div>

                    <div className="flex flex-row items-center mt-4  justify-between w-full px-4">
                        <Button isLoading={deleteProjectPayload.isLoading}  onClick={handelDeleteProject} className="!bg-red-600">delete</Button>
                        <Button onClick={() => setIsOpenDeleteModal(false)}>cancel</Button>
                    </div>

                </div>
            </Modal>

            <div className='flex flex-row w-full items-center justify-between p-2 border-b border-gray-500'>
                <div className="flex flex-col">
                    <h3 className="text-primary font-bold">Change repository visibility</h3>
                    <p className="text-primary">This repository is currently {props.isPrivate ? "private" : "public"}.</p>
                </div>
                <Button size="md" className="text-red-700  hover:bg-red-600">visibility</Button>
            </div>


            <div className='flex flex-row w-full items-center justify-between p-2 border-b border-gray-500'>
                <div className="flex flex-col">
                    <h3 className="text-primary font-bold">Transfer ownership</h3>
                    <p className="text-primary">Transfer this project to another user</p>
                </div>
                <Button size="md" className="text-red-700 hover:bg-red-600">Transfer</Button>
            </div>


            <div className='flex flex-row w-full items-center justify-between p-2 border-b border-gray-500'>
                <div className="flex flex-col">
                    <h3 className="text-primary font-bold">Archive project</h3>
                    <p className="text-primary">Mark this project as archived and read-only</p>
                </div>
                <Button size="md" className="text-red-700 hover:bg-red-600">Archive</Button>
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
