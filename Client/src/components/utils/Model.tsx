import { ReactElement, useCallback, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import useOnClickOutside from '../../utils/hooks/useOnClickOutside';

interface IModalProps {
    children: ReactElement[] | ReactElement;
    isOpen: boolean;
    setIsOpen: (bool: boolean) => void;
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
        if (props.isOpen) openCallback();
        else closeCallback();
    }, [props.isOpen])

    useOnClickOutside(modalRef, () => { closeCallback() })

    return ReactDOM.createPortal(
        !props.isOpen ? null : (
            <div className="p-2 fixed w-[70vw] top-0 left-0 right-0 bottom-0 m-auto h-[35vh] bg-white rounded-md shadow-md flex flex-col" ref={modalRef}>
                {props.children}
            </div>
        ),
        document.getElementById('modal-root')!
    );
}

export default Modal;
