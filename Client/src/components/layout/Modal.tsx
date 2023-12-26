import { useModal, useModalDispatch } from "../../utils/context/modal";
import { useRef } from "react";
import useOnClickOutside from "../../utils/hooks/useOnClickOutside";
import { MdClose } from "react-icons/md";

const Modal = () => {
    const modal = useModal();
    const dispatchModal = useModalDispatch();
    const modalRef = useRef<HTMLDivElement | null>(null);

    const handelClose = () => {
        dispatchModal({ payload: null, type: "close" })
    }

    useOnClickOutside(modalRef, () => { handelClose() });

    return (
        <div ref={modalRef} className="p-2 fixed max-w-[90vw] max-h-[95vh] overflow-y-auto w-fit top-0 shadow-2xl dark:shadow-secondary/40 left-0 right-0 bottom-0 m-auto min-h-[35vh] h-fit bg-white dark:bg-black rounded-md flex flex-col z-[100]">
            <div onClick={handelClose} className="flex m-2 dark:text-secondary p-1 h-fit self-end dark:hover:bg-slate-700 justify-center cursor-pointer items-center rounded-md hover:bg-slate-300 text-primary font-bold text-3xl">
                <MdClose />
            </div>
            {modal.children}
        </div>
    )
}

export default Modal;
