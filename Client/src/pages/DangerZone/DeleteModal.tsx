import Button from "../../components/utils/Button"
import useFetchApi from "../../utils/hooks/useFetchApi";
import { IDangerZoneModalProps } from ".";
import { useParams } from "react-router-dom";
import { useModalDispatch } from "../../utils/context/modal";

const DeleteModal = (props: IDangerZoneModalProps) => {
    const { projectId } = useParams()

    const dispatchModal = useModalDispatch();

    const [deleteProjectPayload, callDeleteProject] = useFetchApi("DELETE", `projects/${projectId}`, [props], () => {
        dispatchModal({ type: "close", payload: null })
    });


    return (
        <div className="flex flex-col justify-center items-center pb-2 px-8 text-center h-full">

            <div className="pt-4 pb-14 gap-4 flex flex-col w-full justify-center items-center">
                <h1 className="text-3xl font-black text-blue-700 dark:text-blue-300">{props.name}</h1>
                <h2 className="text-xl font-bold text-primary dark:text-secondary">are you sure you want to delete this project</h2>
            </div>

            <div className="flex flex-row items-center mt-4 justify-center w-full px-4">
                <Button isLoading={deleteProjectPayload.isLoading} onClick={() => callDeleteProject()} className="!bg-red-600">delete</Button>
            </div>

        </div>
    )
}

export default DeleteModal;
