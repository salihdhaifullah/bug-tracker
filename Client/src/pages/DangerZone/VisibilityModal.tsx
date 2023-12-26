import Button from "../../components/utils/Button"
import useFetchApi from "../../utils/hooks/useFetchApi";
import { IDangerZoneData } from ".";
import { useParams } from "react-router-dom";
import { useModalDispatch } from "../../utils/context/modal";

const VisibilityModal = (props: IDangerZoneData) => {
    const { projectId, userId } = useParams()

    const dispatchModal = useModalDispatch();

    const [visibilityProjectPayload, callVisibilityProject] = useFetchApi("PATCH", `users/${userId}/projects/${projectId}/danger-zone/visibility`, [props], () => {
        dispatchModal({ type: "close", payload: null })
    });

    return (
        <div className="flex flex-col justify-center  items-center pb-2 px-8 text-center h-full">

            <div className="pt-4 pb-14 gap-4 flex flex-col w-full justify-center items-center">
                <h1 className="text-3xl font-black text-blue-700 dark:text-blue-300">{props.name}</h1>
                <h2 className="text-xl font-bold text-primary dark:text-secondary">are you sure you want to make this project {props.isPrivate ? "public" : "private"}</h2>
            </div>

            <div className="flex flex-row items-center justify-center w-full px-4">
                <Button isLoading={visibilityProjectPayload.isLoading} onClick={() => callVisibilityProject()} className="!bg-red-600">{props.isPrivate ? "public" : "private"}</Button>
            </div>

        </div>
    )
}

export default VisibilityModal;
