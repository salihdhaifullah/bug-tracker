import { Link, useParams } from "react-router-dom"
import { useEffect } from "react";
import useFetchApi from "../../utils/hooks/useFetchApi";
import formatDate from "../../utils/formatDate";
import CircleProgress from "../../components/utils/CircleProgress";
import Content from "../../components/utils/Content";
import Members from "./Members";
import Tickets from "./Tickets";
import DangerZone from "./DangerZone";
import { useUser } from "../../utils/context/user";
import { FaTasks } from "react-icons/fa";
import Activities from "./Activities";
import Action from "./Action";

interface IProject {
    id: string;
    createdAt: string;
    name: string;
    isPrivate: boolean;
    isReadOnly: boolean;
    members: number;
    tickets: number;
    markdown: string;
    isMember: boolean;
    owner: {
        avatarUrl: string;
        name: string;
        id: string;
    };
}

const Project = () => {
    const { projectId } = useParams();
    const [payload, call] = useFetchApi<IProject>("GET", `project/${projectId}`);
    const [isOwnerPayload, callIsOwner] = useFetchApi<boolean>("GET", `project/is-owner/${projectId}`);

    useEffect(() => {
        call()
        callIsOwner()
    }, [])

    const user = useUser();


    return payload.isLoading
        ? <CircleProgress size="lg" />
        : payload.result === null ? null : (
            <section className="flex flex-col w-full h-full my-10 p-2 flex-grow">

                <div className="flex flex-row w-full h-full gap-3">

                    <Link to={`/profile/${payload.result.owner.id}`} className="w-fit h-fit min-w-[2.5rem] min-h-[2.5rem] flex">
                        <img
                            title="owner"
                            className="rounded-full bg-white dark:bg-black shadow-md w-10 h-10 object-contain"
                            src={payload.result.owner.avatarUrl}
                            alt={`${payload.result.owner.name}`}
                        />
                    </Link>

                    <div className="rounded-lg relative w-full h-full gap-4 flex flex-col shadow-md dark:shadow-secondary/40 bg-white dark:bg-black after:w-0 after:h-0 after:border-t-[7px] after:border-t-transparent after:border-r-[14px] after:border-r-white dark:after:border-r-black after:border-b-[7px] after:border-b-transparent after:absolute after:top-3 after:-left-3">

                        <div className="flex flex-row justify-between items-center border-b-gray-400 dark:border-b-gray-600 p-2 border-b">
                            <div className="flex flex-row gap-2 justify-start items-center">
                                <Link className="w-fit h-fit" to={`/profile/${payload.result.owner.id}`}>
                                    <span
                                        title="owner"
                                        className="text-primary dark:text-secondary font-bold hover:underline">{payload.result.owner.name}</span>
                                </Link>

                                <p title="created at" className="text-gray-600 dark:text-gray-400 text-sm font-normal">{formatDate(payload.result.createdAt)}</p>

                                <Link to={`/my-tasks/${projectId}`}>
                                    <div className="flex flex-row justify-center rounded-md font-bold hover:bg-slate-200 dark:hover:bg-slate-800 text-primary dark:text-secondary p-1 items-center gap-2">
                                        <p>your tasks</p>
                                        <FaTasks />
                                    </div>
                                </Link>

                            </div>

                            {payload.result.owner.id === user?.id ? <Action call={call} projectId={payload.result.id} name={payload.result.name} /> : null}
                        </div>

                        <div className="w-full h-full gap-4 flex flex-col p-4">

                            <h2 className="text-3xl text-primary dark:text-secondary font-bold">{payload.result.name}</h2>

                            {payload.result.isReadOnly ? (
                                <div className="flex  flex-col justify-center w-full">
                                    <div className="flex rounded-md bg-yellow-300 dark:bg-yellow-700 bg-opacity-80 border-black dark:border-white border p-1 w-fit">
                                        <p className="text-center text-gray-900 dark:text-gray-100 text-lg font-bold">this project is archived</p>
                                    </div>
                                </div>
                            ) : null}

                            <Content editable={Boolean(isOwnerPayload?.result)} url={`project/content/${projectId}`} />

                        </div>

                    </div>

                </div>

                <Members />
                <Tickets />
                <Activities />
                <DangerZone {...payload.result} isOwner={Boolean(isOwnerPayload.result)} />

            </section >
        );
};


export default Project;
