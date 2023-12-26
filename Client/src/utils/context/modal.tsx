import { Dispatch, ReactElement, createContext, useContext, useReducer } from 'react';

interface IModal {
    isOpen: boolean;
    children: ReactElement[] | ReactElement | string | null;
}

interface IModalAction {
    type: "open" | "close";
    payload: ReactElement[] | ReactElement | string | null;
}

const modalInit: IModal = {
    isOpen: false,
    children: null
}

const ModalContext = createContext<IModal>(modalInit);
const ModalDispatchContext = createContext<Dispatch<IModalAction>>(() => null);

export function useModal() {
    return useContext(ModalContext);
}

export function useModalDispatch() {
    return useContext(ModalDispatchContext);
}

function ModalReducer(modal: IModal, action: IModalAction): IModal {
    if (action.type === "open") {
        modal = { isOpen: true, children: action.payload };
    }
    else {
        modal = { isOpen: false, children: null };
    }

    return modal;
}

export default function ModalProvider({ children }: { children: ReactElement }) {
    const [Modal, dispatchModal] = useReducer(ModalReducer, modalInit);

    return (
        <ModalContext.Provider value={Modal}>
            <ModalDispatchContext.Provider value={dispatchModal}>
                {children}
            </ModalDispatchContext.Provider>
        </ModalContext.Provider>
    );
}
