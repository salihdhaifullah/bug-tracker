import { FormEvent, useState } from 'react'
import { IMember } from '.';
import useFetchApi from '../../utils/hooks/useFetchApi';
import { Link, useParams } from 'react-router-dom';
import rolesColors from '../../utils/rolesColors';
import Select from '../../components/utils/Select';
import roles from '../../utils/roles';
import Button from '../../components/utils/Button';
import { useModalDispatch } from '../../utils/context/modal';


interface IRoleModalProps {
    member: IMember;
    call: () => void;
}

const RoleModal = (props: IRoleModalProps) => {
    const { projectId, userId } = useParams();
    const [role, setRole] = useState("");

    const dispatchModal = useModalDispatch();

    const [payloadRole, callRole] = useFetchApi<any, { role: string }>("PATCH", `users/${userId}/projects/${projectId}/members/${props.member.id}`, [], () => {
        props.call()
        dispatchModal({ type: "close", payload: null })
    })

    const [isValidRole, setIsValidRole] = useState(false);

    const handelSubmit = (e: FormEvent) => {
        e.preventDefault();
        callRole({ role });
    }

    return (
        <form onSubmit={handelSubmit} className="flex flex-col dark:bg-black justify-center items-center pb-2 px-8 text-center h-full">

            <div className="pb-8 gap-4 flex flex-col w-full justify-center items-center">
                <h1 className="text-3xl font-black text-blue-700 dark:text-blue-300">change member role</h1>

                <div className="flex flex-col gap-6 mt-6 text-xl font-bold text-primary dark:text-secondary">

                    <div className="flex flex-row justify-start items-center gap-4">
                        <img className="rounded-full shadow-md dark:shadow-secondary/40 w-10 h-10 object-cover" src={props.member.avatarUrl} alt={props.member.name} />
                        <Link className="link" to={`/users/${props.member.id}`}>{props.member.name}</Link>
                    </div>

                    <div className={`font-bold px-1 py-px rounded-xl shadow-md dark:shadow-secondary/40 ${(rolesColors as any)[props.member.role]}`}>
                        <span>{props.member.role}</span>
                    </div>

                </div>

            </div>

            <div className="w-full justify-start items-start flex flex-col">
                <Select
                    options={roles.filter((r) => r !== props.member.role)}
                    setValue={setRole}
                    value={role}
                    validation={[{ validate: (str) => roles.includes(str), massage: "un-valid member role" }]}
                    label="select new role"
                    setIsValid={setIsValidRole}
                />
            </div>

            <div className="flex flex-row items-center mt-4 justify-center w-full px-4">
                <Button
                    isLoading={payloadRole.isLoading}
                    isValid={isValidRole}
                    buttonProps={{ type: "submit" }}
                >change</Button>
            </div>
        </form>
    )
}

export default RoleModal;
