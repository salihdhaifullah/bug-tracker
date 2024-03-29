import { FormEvent, useState } from "react";
import Select from "../../components/utils/Select";
import Button from "../../components/utils/Button";
import useFetchApi from "../../utils/hooks/useFetchApi";
import { useParams } from "react-router-dom";
import SelectUser from "../../components/utils/SelectUser";
import roles from "../../utils/roles";
import { FaAddressCard } from "react-icons/fa";
import { useModalDispatch } from "../../utils/context/modal";
import { Role } from "../MyTasks";

interface IInviteModalProps {
    call: () => void;
}

const InviteModal = (props: IInviteModalProps) => {
    const [invitedId, setInvitedId] = useState("");
    const [role, setRole] = useState(Role.developer as string);
    const { projectId } = useParams();

    const dispatchModal = useModalDispatch();

    const [payload, call] = useFetchApi<unknown, { invitedId: string, role: string }>("POST", `projects/${projectId}/members`, [projectId], () => {
        props.call();
        dispatchModal({ type: "close", payload: null });
    });

    const handelSubmit = (e: FormEvent) => {
        e.preventDefault();
        call({ invitedId, role });
    }

    return (
        <div className="rounded-xl bg-white dark:bg-black flex flex-col gap-4 w-80 p-2 items-center justify-center">

            <form className="flex-col flex w-full justify-center items-center" onSubmit={handelSubmit}>

                <h1 className="text-primary dark:text-secondary font-bold text-3xl text-center mb-4">Invite User</h1>

                <div className="flex w-full justify-center items-center mb-4">
                    <FaAddressCard className="text-3xl text-primary dark:text-secondary font-extrabold" />
                </div>

                <SelectUser required label="invite user" members={false} setId={setInvitedId} id={invitedId} />

                <Select
                    label="role for user to invite"
                    options={roles}
                    value={role}
                    setValue={setRole}
                />

                <div className="flex mt-2 flex-row justify-center items-center w-full">
                    <Button
                        buttonProps={{ type: "submit" }}
                        isLoading={payload.isLoading}
                        isValid={!!invitedId}>Invite</Button>
                </div>

            </form>

        </div>
    )
}

export default InviteModal;
