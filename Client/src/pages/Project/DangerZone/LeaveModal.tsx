import { useCallback } from "react";
import Button from "../../../components/utils/Button"
import Modal from "../../../components/utils/Modal";
import useFetchApi from "../../../utils/hooks/useFetchApi";
import { IModalProps } from ".";

const LeaveModal = (props: IModalProps & { isOwner: boolean }) => {
    const [leaveProjectPayload, callLeaveProject] = useFetchApi("PATCH", `member/leave/${props.id}`, [props]);
    const handelLeaveProject = useCallback(() => {
        props.setIsOpenModal(false);
        callLeaveProject();
    }, [])


    return (
        <Modal isOpen={props.isOpenModal} setIsOpen={props.setIsOpenModal}>
            <div className="flex flex-col justify-center  items-center pt-4 pb-2 px-4 w-[400px] text-center h-full">

                <div className="pt-4 pb-14 gap-4 flex flex-col w-full justify-center items-center">
                    <h1 className="text-3xl font-black text-blue-700 dark:text-blue-300">{props.name}</h1>
                    <h2 className="text-xl font-bold text-primary dark:text-secondary">are you sure you want to leave this project</h2>
                    {props.isOwner ? (
                        <h2 className="text-xl font-bold text-red-700 dark:text-red-500">your role in this project is owner, if you leave this project, the project will be deleted !</h2>
                    ) : null}
                </div>

                <div className="flex flex-row items-center mt-4  justify-between w-full px-4">
                    <Button isLoading={leaveProjectPayload.isLoading} onClick={handelLeaveProject} className="!bg-red-600">{props.isOwner ? "delete" : "leave"}</Button>
                    <Button onClick={() => props.setIsOpenModal(false)}>cancel</Button>
                </div>

            </div>
        </Modal>
    )
}

export default LeaveModal;
