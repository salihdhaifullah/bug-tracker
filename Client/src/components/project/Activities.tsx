import { useParams } from "react-router-dom";
import formatDate from "../../utils/formatDate"
import Parser from "../utils/markdown/Parser";
import useFetchApi from "../../utils/hooks/useFetchApi";
import { useLayoutEffect } from "react";
import CircleProgress from "../utils/CircleProgress";

interface IActivity {
    markdown: string;
    createdAt: string;
}

const Activities = () => {
    const {projectId} = useParams();
    const [payload, call] = useFetchApi<IActivity[]>("GET", `activity/activities-table/${projectId}`);

    useLayoutEffect(() => { call() }, [])

    return (
        <div className="relative overflow-x-auto sm:rounded-lg my-10">

            <h2 className="text-3xl font-bold w-full text-center">Activities</h2>

            <table className="w-full text-sm text-left text-gray-500">
            {payload.isLoading || !payload.result ? <CircleProgress size="md" /> : (
                    <>
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3"> date </th>
                        <th scope="col" className="px-6 py-3"> description </th>
                    </tr>
                </thead>

                <tbody>
                    {payload.result.map((activity, index) => (
                        <tr className="bg-white border-b hover:bg-gray-50" key={index}>

                            <td className="px-6 py-4">
                                <div id="parser" className="markdown flex flex-col p-1 w-full overflow-hidden h-full" dangerouslySetInnerHTML={{ __html: Parser(activity.markdown) }}>
                                </div>
                            </td>

                            <td className="px-6 py-4"> {formatDate(activity.createdAt)} </td>
                        </tr>
                    ))}
                </tbody>
                </>
            )}

            </table>
        </div>
    )
}


export default Activities;