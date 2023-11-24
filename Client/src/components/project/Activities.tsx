import { useParams } from "react-router-dom";
import formatDate from "../../utils/formatDate"
import useFetchApi from "../../utils/hooks/useFetchApi";
import { useEffect, useMemo, useState } from "react";
import CircleProgress from "../utils/CircleProgress";
import SelectButton from "../utils/SelectButton";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";

interface IActivity {
    content: string;
    createdAt: string;
}

const Activities = () => {
    const { projectId } = useParams();
    const [text, setText] = useState("");
    const [take, setTake] = useState(10);
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState("oldest");

    const [activitiesPayload, callActivities] = useFetchApi<IActivity[]>("GET", `activity/activities/${projectId}?page=${page}&take=${take}&sort=${sort}`, [take, page, sort]);
    const [countPayload, callCount] = useFetchApi<number>("GET", `activity/activities-count/${projectId}`);

    useEffect(() => { callActivities() }, [take, page, sort])
    useEffect(() => { callCount() }, [])

    useMemo(() => {
        if (!activitiesPayload.result) return;

        setText(`${((page * take) - take) + 1} to
        ${activitiesPayload.result.length === take
                ? (activitiesPayload.result.length + ((page * take) - take))
                : activitiesPayload.result.length}
        out of ${countPayload.result}`)

    }, [countPayload.result, activitiesPayload.result, take, page])

    const handelPrevPage = () => {
        if (page > 1) setPage((prev) => prev - 1)
    }

    const handelNextPage = () => {
        if (countPayload.result && !(page * take >= countPayload.result)) setPage((prev) => prev + 1)
    }

    return (
        <div className="my-10">
            <h2 className="text-3xl font-bold w-full mb-10 text-center">Activities</h2>
            <div className="w-full bg-white border border-gray-500 shadow-md rounded-md justify-center items-center flex flex-col p-2">

                <div className="flex flex-row gap-4 w-full flex-wrap items-center pb-4 p-2 bg-white justify-between">
                    <SelectButton label="sort by date" setValue={setSort} value={sort} options={["oldest", "latest"]} />
                </div>

                <div className="flex flex-col justify-center items-center w-full gap-4">
                    {activitiesPayload.isLoading || countPayload.isLoading || !countPayload.result || !activitiesPayload.result ? <CircleProgress size="lg" className="mb-4" /> : (
                        <>
                            <div className="overflow-x-scroll overflow-y-hidden w-full">
                                <table className="text-sm text-left text-gray-500 w-full">
                                    <thead className="text-xs text-gray-700 uppercase bg-white">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 min-w-[150px]"> description </th>
                                            <th scope="col" className="px-6 py-3 min-w-[150px]"> date </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {activitiesPayload.result.map((activity, index) => (
                                            <tr className="bg-white border-b hover:bg-gray-50" key={index}>
                                                <td className="px-6 py-4 min-w-[150px]">{activity.content}</td>
                                                <td className="px-6 py-4 min-w-[150px]">{formatDate(activity.createdAt, true)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex w-full justify-end items-center flex-row gap-2">
                                <p>{text}</p>

                                <SelectButton options={[5, 10, 15, 20, 100]} label="take" setValue={setTake} value={take} />

                                <AiOutlineArrowLeft
                                    onClick={handelPrevPage}
                                    className={`${page === 1 ? "" : "hover:bg-slate-200 cursor-pointer"} p-2 rounded-xl shadow-md text-4xl`} />

                                <AiOutlineArrowRight
                                    onClick={handelNextPage}
                                    className={`${page * take >= countPayload.result ? "" : "hover:bg-slate-200 cursor-pointer"} p-2 rounded-xl shadow-md text-4xl`} />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}


export default Activities;
