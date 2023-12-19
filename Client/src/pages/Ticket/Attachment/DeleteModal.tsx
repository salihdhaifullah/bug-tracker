import { Dispatch, SetStateAction } from "react";
import Button from "../../../components/utils/Button";
import Modal from "../../../components/utils/Modal";
import useFetchApi from "../../../utils/hooks/useFetchApi";

interface IDeleteModalProps {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    id: string;
    title: string;
    call: () => void;
}

const DeleteModal = (props: IDeleteModalProps) => {
    const [deletePayload, callDelete] = useFetchApi("DELETE", `attachment/${props.id}`, [], () => {
        props.setIsOpen(false);
        props.call();
    })

    return (
        <Modal isOpen={props.isOpen} setIsOpen={props.setIsOpen}>
            <div className="flex flex-col justify-center items-center pb-2 px-4 w-[400px] text-center h-full">
                <div className="pt-4 pb-14 gap-4 flex flex-col w-full justify-center items-center">
                    <h1 className="text-3xl font-black text-blue-700 dark:text-blue-300">{props.title}</h1>
                    <h2 className="text-xl font-bold text-primary dark:text-secondary">are you sure you want to delete this attachment</h2>
                </div>

                <div className="flex flex-row items-center justify-center w-full px-4">
                    <Button isLoading={deletePayload.isLoading} onClick={() => callDelete()} className="!bg-red-500">delete</Button>
                </div>
            </div>
        </Modal>
    )
}

export default DeleteModal;
