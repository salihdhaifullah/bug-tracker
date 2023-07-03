import { Link, useParams } from "react-router-dom"
import formatDate from "../../utils/formatDate"
import Button from "../utils/Button";
import Invent from "./Invent";
import { useLayoutEffect, useState } from "react";
import useFetchApi from "../../utils/hooks/useFetchApi";
import CircleProgress from "../utils/CircleProgress";

interface IMember {
    imageUrl: string;
    email: string;
    name: string;
    role: string;
    joinedAt: string;
    id: string;
}

const Members = () => {
    const [openInvite, setOpenInvite] = useState(false);

    const { projectId } = useParams();
    const [payload, call] = useFetchApi<IMember[]>("GET", `member/members-table/${projectId}`);

    useLayoutEffect(() => { call() }, [])

    return (
        <div className="relative overflow-x-auto sm:rounded-lg my-10">
            <Invent openInvite={openInvite} setOpenInvite={setOpenInvite} />

            <h2 className="text-3xl font-bold w-full text-center">Members</h2>
            <div className="flex flex-row gap-4 mt-4 items-center pb-4 p-2 bg-white justify-between">

                <Button onClick={() => setOpenInvite(true)}>invite member</Button>

                <div className="flex items-center justify-center">
                    <label htmlFor="table-search-users" className="sr-only">Search</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg className="w-5 h-5 text-gray-500" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path></svg>
                        </div>
                        <input type="text" id="table-search-users" className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500" placeholder="Search for users" />
                    </div>
                </div>
            </div>


            <table className="w-full text-sm text-left text-gray-500">
                {payload.isLoading || !payload.result ? <CircleProgress size="md" /> : (
                    <>
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">

                            <tr>
                                <th scope="col" className="px-6 py-3">  </th>
                                <th scope="col" className="px-6 py-3"> role </th>
                                <th scope="col" className="px-6 py-3"> full name </th>
                                <th scope="col" className="px-6 py-3"> email </th>
                                <th scope="col" className="px-6 py-3"> joined at </th>
                                <th scope="col" className="px-6 py-3"> action </th>
                            </tr>

                        </thead>

                        <tbody>
                            {payload.result.map((member, index) => (
                                <tr className="bg-white border-b hover:bg-gray-50" key={index}>

                                    <td className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap">
                                        <Link to={`/profile/${member.id}`}>
                                            <img className="rounded-full shadow-md w-10 h-10 object-contain" src={member.imageUrl} alt={`${member.name}`} />
                                        </Link>
                                    </td>

                                    <td className="px-6 py-4"> {member.role} </td>

                                    <td className="px-6 py-4"> {member.name} </td>

                                    <td className="px-6 py-4"> {member.email} </td>

                                    <td className="px-6 py-4"> {formatDate(member.joinedAt)} </td>

                                    <td className="px-6 py-4">
                                        {member.role === "owner" ? null : <Button>delete member</Button>}
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </>
                )}

            </table>
        </div>
    )
}


export default Members;
