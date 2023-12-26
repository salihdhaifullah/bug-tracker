import Button from "../../../components/utils/Button";
import { useRef, useState } from "react";
import { FiMoreVertical } from "react-icons/fi";
import useOnClickOutside from "../../../utils/hooks/useOnClickOutside";
import DeleteModal from "./DeleteModal";
import UpdateModal from "./UpdateModal";
import { useModalDispatch } from "../../../utils/context/modal";

interface IActionProps {
    id: string;
    title: string;
    call: () => void;
}

const Action = (props: IActionProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const targetRef = useRef<HTMLDivElement>(null);

    useOnClickOutside(targetRef, () => setIsOpen(false));

    const dispatchModal = useModalDispatch();
    return (
        <div ref={targetRef} className="flex w-fit relative">
            <div onClick={() => setIsOpen(!isOpen)} className="p-1 font-normal text-lg dark:text-gray-400 hover:dark:text-gray-200 text-gray-600 hover:text-gray-800 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer">
                <FiMoreVertical />
            </div>

            <div className={`${isOpen ? "scale-100" : "scale-0"} transition-all flex flex-col gap-2 py-2 px-4 bg-white dark:bg-black justify-center items-center absolute right-[80%] -bottom-[50%] rounded shadow-md dark:shadow-secondary/40`}>
                <Button
                    onClick={() => dispatchModal({ type: "open", payload: <DeleteModal {...props} /> })}
                    size="sm" className="w-full">delete</Button>
                <Button
                    onClick={() => dispatchModal({ type: "open", payload: <UpdateModal {...props} /> })}
                    size="sm" className="w-full">update</Button>
            </div>

        </div>
    )
}

export default Action;
