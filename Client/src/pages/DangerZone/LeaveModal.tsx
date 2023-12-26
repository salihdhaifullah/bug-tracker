import Button from "../../components/utils/Button"
import useFetchApi from "../../utils/hooks/useFetchApi";
import { IDangerZoneData } from ".";
import { useParams } from "react-router-dom";
import { useModalDispatch } from "../../utils/context/modal";

const LeaveModal = (props: IDangerZoneData) => {
    const {projectId, userId} = useParams()
    const dispatchModal = useModalDispatch();

    const [leaveProjectPayload, callLeaveProject] = useFetchApi("DELETE", `users/${userId}/projects/${projectId}/members`, [props], () => {
        dispatchModal({type: "close", payload: null})
    });

    return (
            <div className="flex flex-col justify-center items-center pb-2 px-8 text-center h-full">

                <div className="pt-4 pb-14 gap-4 flex flex-col w-full justify-center items-center">
                    <h1 className="text-3xl font-black text-blue-700 dark:text-blue-300">{props.name}</h1>
                    {props.isOwner ? (
                        <h2 className="text-xl font-bold text-red-700 dark:text-red-500">your role in this project is owner, if you leave this project, the project will be deleted !</h2>
                    ) : null}
                    <h2 className="text-xl font-bold text-primary dark:text-secondary">are you sure you want to leave this project</h2>

                </div>

                <div className="flex flex-row items-center mt-4 justify-center w-full px-4">
                    <Button isLoading={leaveProjectPayload.isLoading} onClick={() => callLeaveProject()} className="!bg-red-600">{props.isOwner ? "delete" : "leave"}</Button>
                </div>

            </div>
    )
}

export default LeaveModal;
