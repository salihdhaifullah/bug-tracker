import { useParams } from "react-router-dom";
import useFetchApi from "../../utils/hooks/useFetchApi";
import { useLayoutEffect, useMemo, useState } from "react";
import CircleProgress from "../../components/utils/CircleProgress";
import SelectButton from "../../components/utils/SelectButton";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import ActivitiesRow from "./ActivitiesRow";

export interface IActivity {
    content: string;
    createdAt: string;
}

const Activities = () => {
    const { projectId } = useParams();
    const [text, setText] = useState("");
    const [take, setTake] = useState(10);
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState("latest");

    const [activitiesPayload, callActivities] = useFetchApi<IActivity[]>("GET", `projects/${projectId}/activities/${page}?take=${take}&sort=${sort}`, [take, page, sort]);
    const [countPayload, callCount] = useFetchApi<number>("GET", `projects/${projectId}/activities/count`);

    useLayoutEffect(() => { callActivities() }, [take, page, sort, callActivities])
    useLayoutEffect(() => { callCount() }, [callCount])

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
        <section className="h-full w-full py-4 md:px-8 px-3 mt-10 gap-8 flex flex-col">

            <div className="w-full bg-white dark:bg-black border border-gray-500 shadow-md dark:shadow-secondary/40 rounded-md justify-center items-center flex flex-col p-2">

                <div className="flex flex-row gap-4 w-full flex-wrap items-center pb-4 p-2 bg-white dark:bg-black justify-between">
                    <SelectButton label="sort by date" setValue={setSort} value={sort} options={["latest", "oldest"]} />
                </div>

                <div className="flex flex-col justify-center items-center w-full gap-4">
                    {activitiesPayload.isLoading || countPayload.isLoading ? <CircleProgress size="lg" className="mb-4" /> : (
                        <>
                            <div className="overflow-x-scroll overflow-y-hidden w-full">
                                <table className="text-sm text-left text-gray-500 w-full">
                                    <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-white dark:bg-black">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 min-w-[150px]"> description </th>
                                            <th scope="col" className="px-6 py-3 min-w-[150px]"> date </th>
                                        </tr>
                                    </thead>

                                    <tbody className="after:block after:mb-2">
                                        {activitiesPayload.result !== null && activitiesPayload.result.map((activity, index) => (
                                            <ActivitiesRow key={index} {...activity} />
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex w-full justify-end items-center flex-row gap-2">
                                <p className="dark:text-white">{text}</p>

                                <SelectButton options={[5, 10, 15, 20, 100]} label="take" setValue={setTake} value={take} />

                                {countPayload.result !== null && (
                                    <>
                                        <AiOutlineArrowLeft
                                            onClick={handelPrevPage}
                                            className={`${page === 1 ? "" : "hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"} p-2 dark:bg-black dark:text-white dark:shadow-secondary/40 rounded-xl shadow-md text-4xl`} />

                                        <AiOutlineArrowRight
                                            onClick={handelNextPage}
                                            className={`${page * take >= countPayload.result ? "" : "hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"} p-2 dark:bg-black dark:text-white dark:shadow-secondary/40 rounded-xl shadow-md text-4xl`} />
                                    </>
                                )}

                            </div>
                        </>
                    )}
                </div>
            </div>

        </section>
    )
}

export default Activities;
