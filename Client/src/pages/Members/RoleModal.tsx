import { Dispatch, FormEvent, SetStateAction, useEffect, useState } from 'react'
import { IChangeRole, IMember } from '.';
import useFetchApi from '../../utils/hooks/useFetchApi';
import { Link, useParams } from 'react-router-dom';
import Modal from '../../components/utils/Modal';
import rolesColors from '../../utils/rolesColors';
import Select from '../../components/utils/Select';
import roles from '../../utils/roles';
import Button from '../../components/utils/Button';


interface IRoleModalProps {
    member: IMember;
    setIsOpenModal: Dispatch<SetStateAction<boolean>>;
    isOpenModal: boolean;
    call: () => void;
}

const RoleModal = (props: IRoleModalProps) => {
    const { projectId } = useParams();
    const [role, setRole] = useState("");
    const [payloadRole, callRole] = useFetchApi<any, IChangeRole>("PATCH", `member/change-role/${projectId}`, [], () => {
        props.setIsOpenModal(false)
        props.call()
    })

    const [isValidRole, setIsValidRole] = useState(false);

    useEffect(() => {
        if (!props.isOpenModal) setRole("")
    }, [props.isOpenModal])

    const handelSubmit = (e: FormEvent) => {
        e.preventDefault();
        callRole({ role, memberId: props.member.id });
    }

    return (
        <Modal isOpen={props.isOpenModal} setIsOpen={props.setIsOpenModal}>
            <form onSubmit={handelSubmit} className="flex flex-col dark:bg-black justify-center items-center pb-2 px-8 text-center h-full">

                <div className="pb-8 gap-4 flex flex-col w-full justify-center items-center">
                    <h1 className="text-3xl font-black text-blue-700 dark:text-blue-300">change member role</h1>

                    <div className="flex flex-col gap-6 mt-6 text-xl font-bold text-primary dark:text-secondary">

                        <div className="flex flex-row justify-start items-center gap-4">
                            <img className="rounded-full shadow-md dark:shadow-secondary/40 w-10 h-10 object-contain" src={props.member.avatarUrl} alt={props.member.name} />
                            <Link className="link" to={`/profile/${props.member.id}`}>{props.member.name}</Link>
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
        </Modal>
    )
}

export default RoleModal;
