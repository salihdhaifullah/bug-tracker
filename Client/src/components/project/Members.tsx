import { Link, useParams } from "react-router-dom"
import formatDate from "../../utils/formatDate"
import Button from "../utils/Button";
import { useEffect, useRef, useState } from "react";
import useFetchApi from "../../utils/hooks/useFetchApi";
import CircleProgress from "../utils/CircleProgress";
import TextFiled from "../utils/TextFiled";
import { AiOutlineArrowLeft, AiOutlineArrowRight, AiOutlineSearch } from "react-icons/ai";
import SelectButton from "../utils/SelectButton";
import { roles } from "../../pages/Invent";
import { FiMoreVertical } from "react-icons/fi";
import useOnClickOutside from "../../utils/hooks/useOnClickOutside";
import Modal from "../utils/Model";
import Select from "../utils/Select";

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
    const { projectId } = useParams();
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
    const [isOpenRoleModal, setIsOpenRoleModal] = useState(false);
    const [role, setRole] = useState("");

    const [payloadDelete, callDelete] = useFetchApi("DELETE", `member/delete-member/${projectId}/${props.member.id}`, [], () => {
        props.call();
    })

    interface IChangeRole {
        memberId: string;
        role: string
    }

    const [payloadRole, callRole] = useFetchApi<any, IChangeRole>("PATCH", `member/change-role/${projectId}`, [], () => {
        props.call();
    })

    const [isValidRole, setIsValidRole] = useState(false);


    const handelRole = () => {
        callRole({
            role,
            memberId: props.member.id
        });
    }

    const targetRef = useRef<HTMLDivElement>(null);

    useOnClickOutside(targetRef, () => setIsOpen(false));

    return (
        <div ref={targetRef} className="flex w-fit relative">
            <Button onClick={() => setIsOpen(!isOpen)} className="p-1 px-1 shadow-sm font-normal">
                <FiMoreVertical />
            </Button>

            <div className={`${isOpen ? "flex" : "hidden"} flex flex-col py-2 px-4 justify-center gap-2 items-center absolute right-[50%] bottom-[50%] bg-white rounded shadow-md`}>
                <Button onClick={() => setIsOpenDeleteModal(true)} size="xs" className="w-full shadow-sm">delete member</Button>
                <Button onClick={() => setIsOpenRoleModal(true)} size="xs" className="w-full shadow-sm">change role</Button>
            </div>

            <Modal isOpen={isOpenDeleteModal} setIsOpen={setIsOpenDeleteModal}>
                <div className="flex flex-col justify-center  items-center pt-4 pb-2 px-4 w-[400px] text-center h-full">
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
                        <Button isLoading={payloadDelete.isLoading} onClick={() => callDelete()} className="!bg-red-500">delete</Button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={isOpenRoleModal} setIsOpen={setIsOpenRoleModal}>
                <div className="flex flex-col justify-center items-center pt-4 pb-2 px-4 w-[400px] text-center h-full">
                    <h1 className="text-xl font-bold text-primary">change member role from {props.member.role} to {role}</h1>

                    <div className="w-full justify-center pl-2 mt-3 items-start flex flex-col">
                        <Select
                            options={roles.filter((r) => r !== props.member.role)}
                            setValue={setRole}
                            value={role}
                            validation={[{ validate: (str) => roles.includes(str), massage: "un-valid member role" }]}
                            label="select new role"
                            setIsValid={setIsValidRole}
                        />
                    </div>

                    <div className="flex flex-row items-center mt-4  justify-between w-full px-4">
                        <Button onClick={() => setIsOpenRoleModal(false)}>cancel</Button>
                        <Button isLoading={payloadRole.isLoading} isValid={isValidRole} onClick={() => handelRole()}>change</Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

const Members = () => {
    const { projectId } = useParams();
    const [search, setSearch] = useState("");
    const [role, setRole] = useState("all");
    const [take, setTake] = useState(10);
    const [page, setPage] = useState(1);

    const [isOwnerPayload, callIsOwner] = useFetchApi<boolean>("GET", `project/is-owner/${projectId}`);
    const [membersPayload, callMembers] = useFetchApi<IMember[]>("GET", `member/members-table/${projectId}?take=${take}&page=${page}&role=${role}&search=${search}`, [take, page, role, search]);
    const [countPayload, callCount] = useFetchApi<number>("GET", `member/members-count/${projectId}?role=${role}&search=${search}`, [role, search]);

    useEffect(() => { callIsOwner() }, [])
    useEffect(() => { callMembers() }, [take, page, role, search])
    useEffect(() => { callCount() }, [role, search])

    const handelPrevPage = () => {
        if (page > 1) setPage((prev) => prev - 1)
    }

    const handelNextPage = () => {
        if (countPayload.result && !(page * take >= countPayload.result)) setPage((prev) => prev + 1)
    }

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

                        <SelectButton label="role" setValue={setRole} value={role} options={[...roles, "owner", "all"]} />
                    </div>
                </div>

                <div className="flex flex-col justify-center items-center w-full gap-4">
                    {membersPayload.isLoading || countPayload.isLoading ? <CircleProgress size="lg" className="mb-4" /> : (
                        <>
                            <div className="overflow-x-scroll overflow-y-hidden w-full">
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

                                    <tbody className="before:block before:h-4">
                                        {membersPayload.result !== null && countPayload.result !== null && membersPayload.result.map((member, index) => (
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

                                                {isOwnerPayload.result ? <td className="px-6 py-4 min-w-[150px]"> {member.role === "owner" ? null : <Action call={callMembers} member={member} />} </td> : null}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex w-full justify-end items-center flex-row gap-2">
                                {countPayload.result !== null && membersPayload.result !== null && (
                                    <>
                                        <p>{((page * take) - take) + 1} to {membersPayload.result.length === take ? (membersPayload.result.length + ((page * take) - take)) : membersPayload.result.length} out of {countPayload.result}</p>

                                        <SelectButton options={[5, 10, 15, 20, 100]} label="take" setValue={setTake} value={take} />

                                        <AiOutlineArrowLeft
                                            onClick={handelPrevPage}
                                            className={`${page === 1 ? "" : "hover:bg-slate-200 cursor-pointer"} p-2 rounded-xl shadow-md text-4xl`} />


                                        <AiOutlineArrowRight
                                            onClick={handelNextPage}
                                            className={`${page * take >= countPayload.result ? "" : "hover:bg-slate-200 cursor-pointer"} p-2 rounded-xl shadow-md text-4xl`} />
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </div>

            </div>
        </div>
    )
}

export default Members;
