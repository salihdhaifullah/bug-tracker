import { FiMoreVertical } from "react-icons/fi";
import Button from "../../components/utils/Button";
import Modal from "../../components/utils/Modal";
import TextFiled from "../../components/utils/TextFiled";
import { useEffect, useRef, useState } from "react";
import useFetchApi from "../../utils/hooks/useFetchApi";
import useOnClickOutside from "../../utils/hooks/useOnClickOutside";

interface IActionProps {
    projectId: string;
    name: string;
    call: () => void;
}

const Action = (props: IActionProps) => {
    const [name, setName] = useState(props.name);
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);
    const [isValidName, setIsValidName] = useState(false);

    const targetRef = useRef<HTMLDivElement>(null);

    useOnClickOutside(targetRef, () => setIsOpen(false));

    const [payload, call] = useFetchApi<unknown, { projectId: string, name: string }>("PATCH", "project/name", [], () => {
        setIsOpenUpdateModal(false)
        props.call()
    });

    useEffect(() => {
        if (!isOpenUpdateModal) {
            setName("");
        }
    }, [isOpenUpdateModal])

    return (
        <div ref={targetRef} className="flex w-fit relative">
            <div onClick={() => setIsOpen(!isOpen)} className="p-1 font-normal text-lg dark:text-gray-400 hover:dark:text-gray-200 text-gray-600 hover:text-gray-800 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer">
                <FiMoreVertical />
            </div>

            <div className={`${isOpen ? "scale-100" : "scale-0"} transition-all flex flex-col gap-2 py-2 px-4 bg-white dark:bg-black justify-center items-center absolute right-[80%] -bottom-[50%] rounded shadow-md dark:shadow-secondary/40`}>
                <Button onClick={() => setIsOpenUpdateModal(true)} size="sm" className="w-full">update</Button>
            </div>

            <Modal isOpen={isOpenUpdateModal} setIsOpen={setIsOpenUpdateModal}>
                <form onSubmit={() => call({ projectId: props.projectId, name })} className="flex flex-col justify-center items-center pt-4 pb-2 px-4 w-[400px] text-center h-full gap-4">
                    <h1 className="text-3xl py-8 font-bold text-primary dark:text-secondary">change name</h1>

                    <TextFiled
                        validation={[
                            { validate: (str: string) => str.length > 0, massage: "name is required" },
                            { validate: (str: string) => str.length <= 100, massage: "max length of name is 100 character" }
                        ]}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        label="project name"
                        setIsValid={setIsValidName}
                    />

                    <div className="flex flex-row items-center mt-4 justify-between w-full px-4">
                        <Button onClick={() => setIsOpenUpdateModal(false)}>cancel</Button>
                        <Button
                        isLoading={payload.isLoading}
                        buttonProps={{ type: "submit" }}
                        isValid={isValidName}>change</Button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}


export default Action;
