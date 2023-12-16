import { useParams } from "react-router-dom"
import Button from "../../../components/utils/Button";
import { useEffect, useState } from "react";
import useFetchApi from "../../../utils/hooks/useFetchApi";
import CircleProgress from "../../../components/utils/CircleProgress";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import SelectButton from "../../../components/utils/SelectButton";
import SearchFiled from "../../../components/utils/SearchFiled";
import roles from "../../../utils/roles";
import InventModal from "./InventModal";
import MembersRow from "./MembersRow";
import RolesPieChart from "./RolesPieChart";

export interface IMember {
    avatarUrl: string;
    email: string;
    name: string;
    role: string;
    joinedAt: string;
    id: string;
}

export interface IActionProps {
    member: IMember
    call: () => void;
}

export interface IChangeRole {
    memberId: string;
    role: string
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

    const [isOpenInviteModal, setIsOpenInviteModal] = useState(false);

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
                    {membersPayload.isLoading || isOwnerPayload.isLoading ? <CircleProgress size="lg" className="mb-4" /> : (
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
                                        {membersPayload.result !== null && isOwnerPayload.result !== null && membersPayload.result.map((member, index) => (
                                            <MembersRow key={index} callMembers={callMembers} member={member} isOwner={isOwnerPayload.result as boolean}/>
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
