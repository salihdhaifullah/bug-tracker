import { useCallback } from "react";
import Button from "../../../components/utils/Button"
import Modal from "../../../components/utils/Modal";
import useFetchApi from "../../../utils/hooks/useFetchApi";
import { IModalProps } from ".";

const VisibilityModal = (props: IModalProps & { isPrivate: boolean }) => {
    const [visibilityProjectPayload, callVisibilityProject] = useFetchApi("GET", `project/visibility/${props.id}`, [props]);

    const handelVisibilityProject = useCallback(() => {
        props.setIsOpenModal(false);
        callVisibilityProject();
    }, [])

    return (
        <Modal isOpen={props.isOpenModal} setIsOpen={props.setIsOpenModal}>
            <div className="flex flex-col justify-center  items-center pt-4 pb-2 px-4 w-[400px] text-center h-full">

                <div className="pt-4 pb-14 gap-4 flex flex-col w-full justify-center items-center">
                    <h1 className="text-3xl font-black text-blue-700 dark:text-blue-300">{props.name}</h1>
                    <h2 className="text-xl font-bold text-primary dark:text-secondary">are you sure you want to make this project {props.isPrivate ? "public" : "private"}</h2>
                </div>

                <div className="flex flex-row items-center justify-between w-full px-4">
                    <Button isLoading={visibilityProjectPayload.isLoading} onClick={handelVisibilityProject} className="!bg-red-600">{props.isPrivate ? "public" : "private"}</Button>
                    <Button onClick={() => props.setIsOpenModal(false)}>cancel</Button>
                </div>

            </div>
        </Modal>
    )
}

export default VisibilityModal;
