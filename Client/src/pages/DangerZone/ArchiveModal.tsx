import Button from "../../components/utils/Button"
import useFetchApi from "../../utils/hooks/useFetchApi";
import { IDangerZoneData } from ".";
import { useParams } from "react-router-dom";
import { useModalDispatch } from "../../utils/context/modal";

const ArchiveModal = (props: IDangerZoneData) => {
    const { projectId, userId } = useParams()
    const dispatchModal = useModalDispatch();

    const [archiveProjectPayload, callArchiveProject] = useFetchApi("PATCH", `users/${userId}/projects/${projectId}/danger-zone/archive`, [props], () => {
        dispatchModal({ type: "close", payload: null })
    });

    return (
        <div className="flex flex-col justify-center items-center pb-2 px-8 text-center h-full">

            <div className="pt-4 pb-14 gap-4 flex flex-col w-full justify-center items-center">
                <h1 className="text-3xl font-black text-blue-700 dark:text-blue-300">{props.name}</h1>
                <h2 className="text-xl font-bold text-primary dark:text-secondary">are you sure you want to {props.isReadOnly ? "unarchive" : "archive"} this project</h2>
            </div>

            <div className="flex flex-row items-center mt-4 justify-center w-full px-4">
                <Button isLoading={archiveProjectPayload.isLoading} onClick={() => callArchiveProject()} className="!bg-red-600">{props.isReadOnly ? "unarchive" : "archive"}</Button>
            </div>

        </div>
    )
}

export default ArchiveModal;
