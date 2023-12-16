import { Dispatch, FormEvent, SetStateAction, useEffect, useState } from "react";
import Select from "../../components/utils/Select";
import Button from "../../components/utils/Button";
import useFetchApi from "../../utils/hooks/useFetchApi";
import { useParams } from "react-router-dom";
import SelectUser from "../../components/utils/SelectUser";
import roles from "../../utils/roles";
import Modal from "../../components/utils/Modal";
import { FaAddressCard } from "react-icons/fa";

interface IInviteModalProps {
    isOpenModal: boolean;
    setIsOpenModal: Dispatch<SetStateAction<boolean>>;
}

const InviteModal = (props: IInviteModalProps) => {
    const [inventedId, setInvitedId] = useState("");
    const [role, setRole] = useState("developer");
    const { projectId } = useParams();

    const [isValidRole, setIsValidRole] = useState(true);
    const [isValidId, setIsValidId] = useState(true);

    const [payload, call] = useFetchApi<any, { inventedId: string, role: string }>("POST", `member/invent/${projectId}`, [projectId], () => {
        props.setIsOpenModal(false);
    });

    useEffect(() => {
        if (!props.isOpenModal) {
            setRole("developer");
            setInvitedId("");
        }
    }, [props.isOpenModal])


    const handelSubmit = (e: FormEvent) => {
        e.preventDefault();
        call({ inventedId, role });
    }

    const handelCancel = () => {
        props.setIsOpenModal(false);
    }

    return (
        <Modal isOpen={props.isOpenModal} setIsOpen={props.setIsOpenModal}>
            <div className="rounded-xl bg-white dark:bg-black flex flex-col gap-4 w-80 p-2 pt-6 items-center justify-center">

                <form className="flex-col flex w-full justify-center items-center" onSubmit={handelSubmit}>

                    <h1 className="text-primary dark:text-secondary font-bold text-3xl text-center mb-4">Invite User</h1>

                    <div className="flex w-full justify-center items-center mb-4">
                        <FaAddressCard className="text-3xl text-primary dark:text-secondary font-extrabold" />
                    </div>

                    <SelectUser setIsValid={setIsValidId} required label="invent user" route={`not-members/${projectId}`} setId={setInvitedId} id={inventedId} />

                    <Select
                        label="role for user to invent"
                        validation={[{ validate: (str) => roles.includes(str), massage: "un-valid role" }]}
                        options={roles}
                        value={role}
                        setValue={setRole}
                        setIsValid={setIsValidRole}
                    />

                    <div className="flex mt-2 flex-row justify-evenly items-center w-full">
                        <Button
                            buttonProps={{ type: "submit" }}
                            isLoading={payload.isLoading}
                            isValid={isValidRole && isValidId}>Invite</Button>

                        <Button onClick={handelCancel}>cancel</Button>
                    </div>

                </form>

            </div>
        </Modal>
    )
}

export default InviteModal;
