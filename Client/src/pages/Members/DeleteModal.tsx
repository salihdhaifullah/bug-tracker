import useFetchApi from '../../utils/hooks/useFetchApi'
import { IMember } from '.'
import { Link, useParams } from 'react-router-dom';
import Button from '../../components/utils/Button';
import rolesColors from '../../utils/rolesColors';
import { useModalDispatch } from '../../utils/context/modal';

interface IDeleteModalProps {
    member: IMember;
    call: () => void;
}

const DeleteModal = (props: IDeleteModalProps) => {
    const { projectId } = useParams();

    const dispatchModal = useModalDispatch();
    const [payloadDelete, callDelete] = useFetchApi("DELETE", `projects/${projectId}/members/${props.member.id}`, [], () => {
        props.call()
        dispatchModal({ type: "close", payload: null })
    })

    return (
        <div className="flex flex-col justify-center dark:bg-black items-center pb-2 px-8 text-center h-full">

            <div className="pb-8 gap-4 flex flex-col w-full justify-center items-center">
                <h1 className="text-3xl font-black text-blue-700 dark:text-blue-300">delete member</h1>

                <div className="flex flex-col gap-6 mt-6 text-xl font-bold text-primary dark:text-secondary">
                    <div className="flex flex-row justify-start items-center gap-4">
                        <img className="rounded-full shadow-md dark:shadow-secondary/40 w-10 h-10 object-cover" src={props.member.avatarUrl} alt={props.member.name} />
                        <Link className="link" to={`/users/${props.member.id}`}>{props.member.name}</Link>
                    </div>

                    <div className={`font-bold px-1 py-px rounded-xl shadow-md dark:shadow-secondary/40 ${rolesColors[props.member.role]}`}>
                        <span>{props.member.role}</span>
                    </div>

                </div>
            </div>

            <div className="flex flex-row items-center mt-4 justify-center w-full px-4">
                <Button isLoading={payloadDelete.isLoading} onClick={() => callDelete()} className="!bg-red-500">delete</Button>
            </div>
        </div>
    )
}

export default DeleteModal;
