import { IActivity } from ".";
import formatDate from "../../utils/formatDate";
import useMarkdown from "../../components/utils/markdown/useMarkdown";

const ActivitiesRow = (props: IActivity) => {
    const jsx = useMarkdown(props.content);

    return (
        <tr className="bg-white dark:bg-black hover:dark:bg-gray-950 border-b dark:border-gray-600 hover:bg-gray-50">
            <td className="px-6 py-4 min-w-[150px]">{jsx}</td>
            <td className="px-6 py-4 min-w-[150px]">{formatDate(props.createdAt, true)}</td>
        </tr>
    )
}


export default ActivitiesRow;
