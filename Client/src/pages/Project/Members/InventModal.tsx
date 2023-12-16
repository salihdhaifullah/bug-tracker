import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Select from "../../../components/utils/Select";
import Button from "../../../components/utils/Button";
import useFetchApi from "../../../utils/hooks/useFetchApi";
import { useParams } from "react-router-dom";
import SelectUser from "../../../components/utils/SelectUser";
import roles from "../../../utils/roles";
import Modal from "../../../components/utils/Modal";
import { MdOutlineCreateNewFolder } from "react-icons/md";


interface IInventModalProps {
    isOpenModal: boolean;
    setIsOpenModal: Dispatch<SetStateAction<boolean>>;
}

const InventModal = (props: IInventModalProps) => {
    const [inventedId, setInventedId] = useState("");
    const [role, setRole] = useState("developer");
    const { projectId } = useParams();

    const [isValidRole, setIsValidRole] = useState(true);
    const [isValidId, setIsValidId] = useState(true);

    const [payload, call] = useFetchApi<any, { inventedId: string, role: string }>("POST", `member/invent/${projectId}`, [projectId], () => {
        props.setIsOpenModal(false);
        setRole("developer");
        setInventedId("")
    });

    useEffect(() => {
        if (!props.isOpenModal) {
            setRole("developer");
            setInventedId("");
        }
    }, [props.isOpenModal])

    const handelSubmit = () => {
        call({ inventedId, role });
    }

    return (
        <Modal isOpen={props.isOpenModal} setIsOpen={props.setIsOpenModal}>
            <div className="rounded-xl bg-white dark:bg-black flex flex-col gap-4 w-80 p-2 pt-6 items-center justify-center">

                <form className="flex-col flex w-full justify-center items-center" onSubmit={handelSubmit}>

                    <h1 className="text-primary dark:text-secondary font-bold text-3xl text-center mb-4">Create Project</h1>

                    <div className="flex w-full justify-center items-center mb-4">
                        <MdOutlineCreateNewFolder className="text-3xl text-gray-800 dark:text-gray-200 font-extrabold" />
                    </div>

                    <SelectUser setIsValid={setIsValidId} required label="invent user to this project" route={`not-members/${projectId}`} setId={setInventedId} id={inventedId} />

                    <Select
                        label="role for user to invent"
                        validation={[{ validate: (str) => roles.includes(str), massage: "un-valid role" }]}
                        options={roles}
                        value={role}
                        setValue={setRole}
                        setIsValid={setIsValidRole}
                    />

                    <div className="flex mt-2 flex-col justify-center items-center w-full">
                        <Button
                            buttonProps={{ type: "submit" }}
                            isLoading={payload.isLoading}
                            isValid={isValidRole && isValidId}>Invent</Button>
                    </div>

                </form>

            </div>
        </Modal>
    )
}

export default InventModal;
