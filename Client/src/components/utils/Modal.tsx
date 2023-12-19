import { ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import useOnClickOutside from '../../utils/hooks/useOnClickOutside';
import { MdClose } from 'react-icons/md';

interface IModalProps {
    children: ReactElement[] | ReactElement | string;
    isOpen: boolean
    setIsOpen: (b: boolean) => void
}

const Modal = (props: IModalProps) => {
    const modalRef = useRef<HTMLDivElement | null>(null);
    const rootRef = useRef(document.getElementById("root")!);
    const bodyRef = useRef(document.querySelector("body")!);
    const [isOpen, setIsOpen] = useState(false);

    const closeCallback = useCallback(() => {
        if (modalRef.current === null) return;
        props.setIsOpen(false);
        rootRef.current.className = "";
        bodyRef.current.className = "";
    }, [])

    const openCallback = useCallback(() => {
        rootRef.current.className = "blur-sm";
        bodyRef.current.className = "overflow-y-hidden";
    }, [])

    useEffect(() => {
        if (props.isOpen) {
            openCallback();
            setIsOpen(true);
        }
        else {
            closeCallback();
            setIsOpen(false);
        }
    }, [props.isOpen])

    useOnClickOutside(modalRef, () => { closeCallback() });

    return !isOpen ? null : ReactDOM.createPortal((
            <div ref={modalRef} className="p-2 fixed max-w-[90vw] max-h-[95vh] overflow-y-auto w-fit top-0 shadow-2xl dark:shadow-secondary/40 left-0 right-0 bottom-0 m-auto min-h-[35vh] h-fit bg-white dark:bg-black rounded-md flex flex-col">
                <div onClick={() => props.setIsOpen(false)} className="flex m-2 dark:text-secondary p-1 h-fit self-end dark:hover:bg-slate-700 justify-center cursor-pointer items-center rounded-md hover:bg-slate-300 text-primary font-bold text-3xl">
                    <MdClose />
                </div>
                {props.children}
            </div>
        ),document.getElementById('modal-root')!
    );
}

export default Modal;
