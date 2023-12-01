import { ReactElement, useCallback, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import useOnClickOutside from '../../utils/hooks/useOnClickOutside';

interface IModalProps {
    children: ReactElement[] | ReactElement | string;
    isOpen: boolean
    setIsOpen: (b: boolean) => void
}

const Modal = (props: IModalProps) => {
    const modalRef = useRef<HTMLDivElement | null>(null);
    const rootRef = useRef(document.getElementById("root")!);
    const htmlRef = useRef(document.querySelector("body")!);

    const closeCallback = useCallback(() => {
        props.setIsOpen(false);
        rootRef.current.className = "";
        htmlRef.current.className = "";
    }, [])

    const openCallback = useCallback(() => {
        props.setIsOpen(true);
        rootRef.current.className = "blur-sm";
        htmlRef.current.className = "overflow-y-hidden";
    }, [])

    useEffect(() => {
        if (props.isOpen) openCallback()
        else closeCallback()
    }, [props.isOpen])

    useOnClickOutside(modalRef, () => { if (props.isOpen && modalRef.current) closeCallback(); })

    return !props.isOpen ? null : ReactDOM.createPortal((
            <div className="p-2 fixed w-fit top-0 border border-gray-900 dark:border-gray-100 shadow-2xl dark:shadow-secondary/40 left-0 right-0 bottom-0 m-auto min-h-[35vh] h-fit bg-white dark:bg-black rounded-md flex flex-col">
                {props.children}
            </div>
        ),document.getElementById('modal-root')!
    );
}

export default Modal;
