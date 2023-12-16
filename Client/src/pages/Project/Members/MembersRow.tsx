import { Link } from "react-router-dom"
import formatDate from "../../../utils/formatDate"
import { IMember } from "."
import Action from "./Action";

interface IMemberRowProps {
    member: IMember;
    isOwner: boolean;
    callMembers: () => void;
}

const MembersRow = (props: IMemberRowProps) => {
    return (
        <tr className="bg-white border-b dark:border-gray-600 hover:bg-gray-50 dark:bg-black dark:hover:bg-gray-950">

            <td className="flex items-center px-6 py-4 min-w-[150px] justify-center text-gray-900 dark:text-gray-100 whitespace-nowrap">
                <Link to={`/profile/${props.member.id}`}>
                    <img className="rounded-full shadow-md dark:shadow-secondary/40 w-10 h-10 object-contain" src={props.member.avatarUrl} alt={props.member.name} />
                </Link>
            </td>

            <td className="px-6 py-4 min-w-[150px]"> {props.member.role} </td>

            <td className="px-6 py-4 min-w-[150px]"> {props.member.name} </td>

            <td className="px-6 py-4 min-w-[150px]"> {props.member.email} </td>

            <td className="px-6 py-4 min-w-[150px]"> {formatDate(props.member.joinedAt)} </td>

            {props.isOwner ? <td className="px-6 py-4 min-w-[150px]"> {props.member.role === "owner" ? null : <Action call={props.callMembers} member={props.member} />} </td> : null}
        </tr>
    )
}

export default MembersRow;
