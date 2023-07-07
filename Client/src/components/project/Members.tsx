import { Link, useParams } from "react-router-dom"
import formatDate from "../../utils/formatDate"
import Button from "../utils/Button";
import { useLayoutEffect, useRef, useState } from "react";
import useFetchApi from "../../utils/hooks/useFetchApi";
import CircleProgress from "../utils/CircleProgress";
import TextFiled from "../utils/TextFiled";
import { AiOutlineSearch } from "react-icons/ai";
import SelectButton from "../utils/SelectButton";
import { roles } from "../../pages/Invent";
import { FiMoreVertical } from "react-icons/fi";
import useOnClickOutside from "../../utils/hooks/useOnClickOutside";
import Modal from "../utils/Model";

interface IMember {
    imageUrl: string;
    email: string;
    name: string;
    role: string;
    joinedAt: string;
    id: string;
}

interface IActionProps {
    member: IMember
    call: () => void;
}

const Action = (props: IActionProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
    const [isOpenRoleModal, setIsOpenRoleModal] = useState(false);
    const { projectId } = useParams();
    const [role, setRole] = useState("");

    const [payload, callDelete] = useFetchApi("DELETE", `member/delete-member/${projectId}/${props.member.id}`, [], () => {
        props.call();
    })

    const handelDelete = () => {
        callDelete();
    }

    const targetRef = useRef<HTMLDivElement>(null);

    useOnClickOutside(targetRef, () => setIsOpen(false));

    return (
        <div ref={targetRef} className="flex w-fit relative">
            <Button onClick={() => setIsOpen(!isOpen)} className="p-1 px-1 shadow-sm font-normal">
                <FiMoreVertical />
            </Button>

            <div className={`${isOpen ? "flex" : "hidden"} flex flex-col px-2 py-4 justify-center items-center gap-4 w-40 absolute right-[50%] bottom-[50%] z-50 bg-white rounded shadow-md`}>
                <Button onClick={() => setIsOpenDeleteModal(true)} className="w-full shadow-sm">delete member</Button>
                <Button onClick={() => setIsOpenRoleModal(true)} className="w-full shadow-sm">change role</Button>
            </div>

            <Modal id={`${props.member.email}-the-first`} isOpen={isOpenDeleteModal} setIsOpen={setIsOpenDeleteModal}>
                <div className="flex flex-col justify-center  items-center pt-4 pb-2 px-4 w-full h-full">
                    <h1 className="text-xl font-bold text-primary">are you sure you want to delete this member</h1>

                    <div className="w-full justify-center gap-4 pl-2 my-3 items-start flex flex-col">
                        <Link to={`/profile/${props.member.id}`}>
                            <img className="rounded-full shadow-md w-10 h-10 object-contain" src={props.member.imageUrl} alt={props.member.name} />
                        </Link>

                        <p className="flex flex-row gap-2">
                            <span>role: </span>
                            <span className="font-bold text-primary">
                                {props.member.role}
                            </span>
                        </p>
                        <p className="flex flex-row gap-2">
                            <span>name: </span>
                            <span className="font-bold text-primary">
                                {props.member.name}
                            </span>
                        </p>
                        <p className="flex flex-row gap-2">
                            <span>email: </span>
                            <span className="font-bold text-primary">
                                {props.member.email}
                            </span>
                        </p>
                    </div>

                    <div className="flex flex-row items-center mt-4  justify-between w-full px-4">
                        <Button onClick={() => setIsOpenDeleteModal(false)}>cancel</Button>
                        <Button isLoading={payload.isLoading} onClick={() => handelDelete()} className="!bg-red-500">delete</Button>
                    </div>
                </div>
            </Modal>

            <Modal id={`${props.member.email}-the-seconded`} isOpen={isOpenRoleModal} setIsOpen={setIsOpenRoleModal}>
                <div className="flex flex-col justify-center items-center pt-4 pb-2 px-4 w-full h-full">
                    <h1 className="text-xl font-bold text-primary">are you sure you want to delete this member</h1>

                    <div className="w-full justify-center gap-4 pl-2 my-3 items-start flex flex-col">
                        <Link to={`/profile/${props.member.id}`}>
                            <img className="rounded-full shadow-md w-10 h-10 object-contain" src={props.member.imageUrl} alt={props.member.name} />
                        </Link>

                        <p className="flex flex-row gap-2">
                            <span>role: </span>
                            <span className="font-bold text-primary">
                                {props.member.role}
                            </span>
                        </p>
                        <p className="flex flex-row gap-2">
                            <span>name: </span>
                            <span className="font-bold text-primary">
                                {props.member.name}
                            </span>
                        </p>
                        <p className="flex flex-row gap-2">
                            <span>email: </span>
                            <span className="font-bold text-primary">
                                {props.member.email}
                            </span>
                        </p>
                    </div>

                    <div className="flex flex-row items-center mt-4  justify-between w-full px-4">
                        <Button onClick={() => setIsOpenDeleteModal(false)}>cancel</Button>
                        <Button onClick={() => handelDelete()} className="!bg-red-500">delete</Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

const Members = () => {
    const { projectId } = useParams();
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");

    const [isOwnerPayload, callIsOwner] = useFetchApi<boolean>("GET", `project/is-owner/${projectId}`);
    const [payload, call] = useFetchApi<IMember[]>("GET", `member/members-table/${projectId}`);

    useLayoutEffect(() => {
        call();
        callIsOwner();
    }, [])

    return (
        <div className="my-10">
            <h2 className="text-3xl font-bold w-full mb-10 text-center">Members</h2>
            <div className="w-full bg-white border border-gray-500 shadow-md rounded-md justify-center items-center flex flex-col p-2">

                <div className="flex flex-row gap-4 w-full flex-wrap items-center pb-4 p-2 bg-white justify-between">
                    <Link to={`/project/${projectId}/invent`}>
                        <Button>invite member</Button>
                    </Link>

                    <div className="flex items-center justify-center w-full sm:w-auto">

                        <div className="max-w-[400px]">
                            <TextFiled small icon={AiOutlineSearch} label="Search for members" value={search} onChange={(e) => setSearch(e.target.value)} />
                        </div>

                        <SelectButton label="role" setValue={setRoleFilter} value={roleFilter} options={[...roles, "owner", "all"]} />
                    </div>
                </div>

                <div className="overflow-x-scroll w-full">
                    {payload.isLoading || !payload.result ? <CircleProgress size="md" /> : (
                        <table className="text-sm text-left text-gray-500 w-full">
                            <thead className="text-xs text-gray-700 uppercase bg-white">
                                <tr>
                                    <th scope="col" className="px-6 py-3 min-w-[150px]">  </th>
                                    <th scope="col" className="px-6 py-3 min-w-[150px]"> role </th>
                                    <th scope="col" className="px-6 py-3 min-w-[150px]"> full name </th>
                                    <th scope="col" className="px-6 py-3 min-w-[150px]"> email </th>
                                    <th scope="col" className="px-6 py-3 min-w-[150px]"> joined at </th>
                                    {isOwnerPayload.result ? <th scope="col" className="px-6 py-3  min-w-[150px]"> action </th> : null}
                                </tr>
                            </thead>

                            <tbody>
                                {payload.result.map((member, index) => (
                                    <tr className="bg-white border-b hover:bg-gray-50" key={index}>

                                        <td className="flex items-center px-6 py-4 min-w-[150px] justify-center text-gray-900 whitespace-nowrap">
                                            <Link to={`/profile/${member.id}`}>
                                                <img className="rounded-full shadow-md w-10 h-10 object-contain" src={member.imageUrl} alt={member.name} />
                                            </Link>
                                        </td>

                                        <td className="px-6 py-4 min-w-[150px]"> {member.role} </td>

                                        <td className="px-6 py-4 min-w-[150px]"> {member.name} </td>

                                        <td className="px-6 py-4 min-w-[150px]"> {member.email} </td>

                                        <td className="px-6 py-4 min-w-[150px]"> {formatDate(member.joinedAt)} </td>

                                        {isOwnerPayload.result ? <td className="px-6 py-4 min-w-[150px]"> {member.role === "owner" ? null : <Action call={call} member={member} />} </td> : null}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    )
}


export default Members;
