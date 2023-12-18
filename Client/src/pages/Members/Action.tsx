import { IActionProps } from ".";
import { useRef, useState } from "react";
import useOnClickOutside from "../../utils/hooks/useOnClickOutside";
import { FiMoreVertical } from "react-icons/fi";
import Button from "../../components/utils/Button";
import DeleteModal from "./DeleteModal";
import RoleModal from "./RoleModal";

const Action = (props: IActionProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
    const [isOpenRoleModal, setIsOpenRoleModal] = useState(false);

    const targetRef = useRef<HTMLDivElement>(null);

    useOnClickOutside(targetRef, () => setIsOpen(false));
    return (
        <div ref={targetRef} className="flex w-fit relative">
            <div onClick={() => setIsOpen(!isOpen)} className="p-1 font-normal text-lg rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer">
                <FiMoreVertical />
            </div>

            <div className={`${isOpen ? "scale-100" : "scale-0"} transition-all flex flex-col py-2 px-4 justify-center gap-2 items-center absolute right-[50%] bottom-[50%] bg-white dark:bg-black rounded shadow-md dark:shadow-secondary/40`}>
                <Button onClick={() => setIsOpenDeleteModal(true)} size="sm" className="w-full">delete</Button>
                <Button onClick={() => setIsOpenRoleModal(true)} size="sm" className="w-full">change role</Button>
            </div>


            <DeleteModal setIsOpenModal={setIsOpenDeleteModal} isOpenModal={isOpenDeleteModal} call={props.call} member={props.member} />
            <RoleModal setIsOpenModal={setIsOpenRoleModal} isOpenModal={isOpenRoleModal} call={props.call} member={props.member} />
        </div>
    )
}

export default Action;
