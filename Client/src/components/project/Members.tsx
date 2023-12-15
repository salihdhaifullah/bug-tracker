import { Link, useParams } from "react-router-dom"
import formatDate from "../../utils/formatDate"
import Button from "../utils/Button";
import { useEffect, useRef, useState } from "react";
import useFetchApi from "../../utils/hooks/useFetchApi";
import CircleProgress from "../utils/CircleProgress";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import SelectButton from "../utils/SelectButton";
import { FiMoreVertical } from "react-icons/fi";
import useOnClickOutside from "../../utils/hooks/useOnClickOutside";
import Modal from "../utils/Modal";
import Select from "../utils/Select";
import rolesColors from "../../utils/rolesColors";
import SearchFiled from "../utils/SearchFiled";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import roles from "../../utils/roles";
import InventModal from "../InventModal";

interface IMember {
    avatarUrl: string;
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

interface IChangeRole {
    memberId: string;
    role: string
}

const Action = (props: IActionProps) => {
    const { projectId } = useParams();
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
    const [isOpenRoleModal, setIsOpenRoleModal] = useState(false);
    const [role, setRole] = useState("");

    const [isChange, setIsChange] = useState(false);

    useEffect(() => {
        if (isChange) props.call();
    }, [isChange])

    const [payloadDelete, callDelete] = useFetchApi("DELETE", `member/delete-member/${projectId}/${props.member.id}`, [], () => {
        setIsOpenDeleteModal(false)
        setIsChange(true)
    })

    const [payloadRole, callRole] = useFetchApi<any, IChangeRole>("PATCH", `member/change-role/${projectId}`, [], () => {
        setIsOpenRoleModal(false)
        setIsChange(true)
    })

    const [isValidRole, setIsValidRole] = useState(false);

    useEffect(() => {
        if (!isOpenRoleModal) setRole("")
    }, [isOpenRoleModal])

    const handelRole = () => {
        callRole({ role, memberId: props.member.id });
    }

    const targetRef = useRef<HTMLDivElement>(null);

    useOnClickOutside(targetRef, () => setIsOpen(false));

    return (
        <div ref={targetRef} className="flex w-fit relative">
            <div onClick={() => setIsOpen(!isOpen)} className="p-1 font-normal text-lg rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer">
                <FiMoreVertical />
            </div>

            <div className={`${isOpen ? "scale-100" : "scale-0"} transition-all flex flex-col py-2 px-4 justify-center gap-2 items-center absolute right-[50%] bottom-[50%] bg-white dark:bg-black rounded shadow-md dark:shadow-secondary/40`}>
                <Button onClick={() => setIsOpenDeleteModal(true)} size="sm" className="w-full">delete</Button>
                <Button onClick={() => setIsOpenRoleModal(true)} size="sm" className="w-full">change role</Button>
            </div>

            <Modal isOpen={isOpenDeleteModal} setIsOpen={setIsOpenDeleteModal}>
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
                        <Button onClick={() => setIsOpenDeleteModal(false)}>cancel</Button>
                        <Button isLoading={payloadDelete.isLoading} onClick={() => callDelete()} className="!bg-red-500">delete</Button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={isOpenRoleModal} setIsOpen={setIsOpenRoleModal}>
                <form onSubmit={() => handelRole()} className="flex flex-col dark:bg-black justify-center items-center py-8 px-4 w-[400px] text-center h-full">

                    <div className="pt-4 pb-8 gap-4 flex flex-col w-full justify-center items-center">
                        <h1 className="text-3xl font-black text-blue-700 dark:text-blue-300">change member role</h1>

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

                    <div className="flex flex-row items-center mt-4 justify-between w-full px-4">
                        <Button onClick={() => {
                            setRole("")
                            setIsOpenRoleModal(false)
                        }}>cancel</Button>

                        <Button
                        isLoading={payloadRole.isLoading}
                         isValid={isValidRole}
                         buttonProps={{ type: "submit" }}
                         >change</Button>
                    </div>
                </form>
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
    useEffect(() => { callMembers() }, [take, page, role])
    useEffect(() => { callCount() }, [role])

    const handelSearch = () => {
        callCount()
        callMembers()
    }

    const handelPrevPage = () => {
        if (page > 1) setPage((prev) => prev - 1)
    }

    const handelNextPage = () => {
        if (countPayload.result && !(page * take >= countPayload.result)) setPage((prev) => prev + 1)
    }

    const [isOpenInviteModal, setIsOpenInviteModal] = useState(false);

    return (
        <div className="my-10">
            <h2 className="text-3xl font-bold w-full mb-10 text-center text-primary dark:text-secondary">Members</h2>

            <div className="w-full bg-white dark:bg-black border border-gray-500 shadow-md dark:shadow-secondary/40 rounded-md justify-center items-center flex flex-col p-2">

                <div className="flex flex-row gap-4 w-full flex-wrap items-center pb-4 p-2 justify-between">
                    <InventModal isOpenModal={isOpenInviteModal} setIsOpenModal={setIsOpenInviteModal} />
                    <Button onClick={() => setIsOpenInviteModal(true)}>invite member</Button>

                    <div className="flex items-center justify-center w-full sm:w-auto">

                        <div className="max-w-[400px]">
                            <SearchFiled label="Search for members" onClick={handelSearch} value={search} onChange={(e) => setSearch(e.target.value)} />
                        </div>

                        <SelectButton label="role" setValue={setRole} value={role} options={[...roles, "owner", "all"]} />
                    </div>
                </div>

                <div className="flex flex-col justify-center items-center w-full gap-4">
                    {membersPayload.isLoading || countPayload.isLoading ? <CircleProgress size="lg" className="mb-4" /> : (
                        <>
                            <div className="overflow-x-scroll dark-scrollbar overflow-y-hidden w-full">
                                <table className="text-sm text-left text-gray-500 w-full">
                                    <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase ">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 min-w-[150px]">  </th>
                                            <th scope="col" className="px-6 py-3 min-w-[150px]"> role </th>
                                            <th scope="col" className="px-6 py-3 min-w-[150px]"> full name </th>
                                            <th scope="col" className="px-6 py-3 min-w-[150px]"> email </th>
                                            <th scope="col" className="px-6 py-3 min-w-[150px]"> joined at </th>
                                            {isOwnerPayload.result ? <th scope="col" className="px-6 py-3  min-w-[150px]"> action </th> : null}
                                        </tr>
                                    </thead>

                                    <tbody className="before:block before:h-4 after:block after:mb-2">
                                        {membersPayload.result !== null && countPayload.result !== null && membersPayload.result.map((member, index) => (
                                            <tr className="bg-white border-b dark:border-gray-600 hover:bg-gray-50 dark:bg-black dark:hover:bg-gray-950" key={index}>

                                                <td className="flex items-center px-6 py-4 min-w-[150px] justify-center text-gray-900 dark:text-gray-100 whitespace-nowrap">
                                                    <Link to={`/profile/${member.id}`}>
                                                        <img className="rounded-full shadow-md dark:shadow-secondary/40 w-10 h-10 object-contain" src={member.avatarUrl} alt={member.name} />
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
                                        <p className="dark:text-white">{((page * take) - take) + 1} to {membersPayload.result.length === take ? (membersPayload.result.length + ((page * take) - take)) : membersPayload.result.length} out of {countPayload.result}</p>

                                        <SelectButton options={[5, 10, 15, 20, 100]} label="take" setValue={setTake} value={take} />

                                        <AiOutlineArrowLeft
                                            onClick={handelPrevPage}
                                            className={`${page === 1 ? "" : "hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"} p-2 rounded-xl shadow-md dark:shadow-secondary/40 cursor-pointer dark:text-white text-4xl`} />


                                        <AiOutlineArrowRight
                                            onClick={handelNextPage}
                                            className={`${page * take >= countPayload.result ? "" : "hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"} p-2 rounded-xl shadow-md dark:shadow-secondary/40 cursor-pointer dark:text-white text-4xl`} />
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </div>

            </div>

            <RolesPieChart />

        </div>
    )
}

export default Members;

const RolesPieChart = () => {
    const { projectId } = useParams();

    const [isNoMembers, setIsNoMembers] = useState(false);

    const [rolesPayload, callRoles] = useFetchApi<{ developers: number, testers: number, projectMangers: number }>("GET", `member/chart/${projectId}`);

    useEffect(() => { callRoles() }, [])

    ChartJS.register(ArcElement, Tooltip, Legend);

    const config = {
        labels: ['developers', 'testers', 'project mangers'],
        datasets: [
            {
                label: 'of members',
                data: [0, 0, 0],
                backgroundColor: [
                    '#d946ef',
                    '#eab308',
                    '#3b82f6'
                ],
                borderColor: [
                    '#701a75',
                    '#713f12',
                    '#1e3a8a'
                ],
                borderWidth: 2,
            },
        ],
    }

    const getData = (result: { developers: number, testers: number, projectMangers: number }) => {
        if (result.developers + result.testers + result.projectMangers === 0) {
            setIsNoMembers(true)
        };
        config.datasets[0].data = [result.developers, result.testers, result.projectMangers]
        return config;
    }

    return (
        isNoMembers ? null :
            <div className="flex justify-center items-center text-center my-4 w-[400px] h-fit rounded-md p-4 shadow-lg bg-white dark:bg-black">
                {rolesPayload.result && !rolesPayload.isLoading
                    ? <Pie data={getData(rolesPayload.result)} />
                    : <CircleProgress size="lg" />
                }
            </div>
    )
}
