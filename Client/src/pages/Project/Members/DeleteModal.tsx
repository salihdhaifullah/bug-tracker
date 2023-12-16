import { Dispatch, SetStateAction } from 'react'
import useFetchApi from '../../../utils/hooks/useFetchApi'
import { IMember } from '.'
import { Link, useParams } from 'react-router-dom';
import Modal from '../../../components/utils/Modal';
import Button from '../../../components/utils/Button';
import rolesColors from '../../../utils/rolesColors';

interface IDeleteModalProps {
    member: IMember;
    setIsOpenModal: Dispatch<SetStateAction<boolean>>;
    isOpenModal: boolean;
    call: () => void;
}

const DeleteModal = (props: IDeleteModalProps) => {
    const { projectId } = useParams();

    const [payloadDelete, callDelete] = useFetchApi("DELETE", `member/delete-member/${projectId}/${props.member.id}`, [], () => {
        props.setIsOpenModal(false)
        props.call()
    })

    return (
        <Modal isOpen={props.isOpenModal} setIsOpen={props.setIsOpenModal}>
            <div className="flex flex-col justify-center dark:bg-black items-center pt-4 pb-2 px-4 w-[400px] text-center h-full">

                <div className="pt-4 pb-8 gap-4 flex flex-col w-full justify-center items-center">
                    <h1 className="text-3xl font-black text-blue-700 dark:text-blue-300">delete member</h1>

                    <div className="flex flex-col gap-2 text-xl font-bold text-primary dark:text-secondary">

                        <div className="flex flex-row justify-start items-center gap-2">
                            <img className="rounded-full shadow-md dark:shadow-secondary/40 w-10 h-10 object-contain" src={props.member.avatarUrl} alt={props.member.name} />
                            <Link className="link" to={`/profile/${props.member.id}`}>{props.member.name}</Link>
                        </div>

                        <div className={`font-bold px-1 py-px rounded-xl shadow-md dark:shadow-secondary/40 ${(rolesColors as any)[props.member.role]}`}>
                            <span>{props.member.role}</span>
                        </div>

                    </div>
                </div>

                <div className="flex flex-row items-center mt-4 justify-between w-full px-4">
                    <Button onClick={() => props.setIsOpenModal(false)}>cancel</Button>
                    <Button isLoading={payloadDelete.isLoading} onClick={() => callDelete()} className="!bg-red-500">delete</Button>
                </div>
            </div>
        </Modal>
    )
}

export default DeleteModal
