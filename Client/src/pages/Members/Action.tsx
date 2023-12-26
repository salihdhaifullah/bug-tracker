import { IActionProps } from ".";
import { useRef, useState } from "react";
import useOnClickOutside from "../../utils/hooks/useOnClickOutside";
import { FiMoreVertical } from "react-icons/fi";
import Button from "../../components/utils/Button";
import DeleteModal from "./DeleteModal";
import RoleModal from "./RoleModal";
import { useModalDispatch } from "../../utils/context/modal";

const Action = (props: IActionProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const targetRef = useRef<HTMLDivElement>(null);
    useOnClickOutside(targetRef, () => setIsOpen(false));

    const dispatchModal = useModalDispatch();


    return (
        <div ref={targetRef} className="flex w-fit relative">
            <div onClick={() => setIsOpen(!isOpen)} className="p-1 font-normal text-lg rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer">
                <FiMoreVertical />
            </div>

            <div className={`${isOpen ? "scale-100" : "scale-0"} transition-all flex flex-col py-2 px-4 justify-center gap-2 items-center absolute right-[50%] bottom-[50%] bg-white dark:bg-black rounded shadow-md dark:shadow-secondary/40`}>
                <Button
                    onClick={() => dispatchModal({ type: "open", payload: <DeleteModal call={props.call} member={props.member} /> })}
                    size="sm" className="w-full">delete</Button>
                <Button
                    onClick={() => dispatchModal({ type: "open", payload: <RoleModal call={props.call} member={props.member} /> })}
                    size="sm" className="w-full">change role</Button>
            </div>

        </div>
    )
}

export default Action;
