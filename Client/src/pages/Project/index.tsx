import { Link, useParams } from "react-router-dom"
import { useLayoutEffect, useMemo } from "react";
import useFetchApi from "../../utils/hooks/useFetchApi";
import formatDate from "../../utils/formatDate";
import CircleProgress from "../../components/utils/CircleProgress";
import Content from "../../components/utils/Content";
import { useUser } from "../../utils/context/user";
import { FaListUl, FaTasks } from "react-icons/fa";
import Action from "./Action";
import Button from "../../components/utils/Button";
import { MdOutlineWarning } from "react-icons/md";
import { FiUsers } from "react-icons/fi";
import { RxActivityLog } from 'react-icons/rx';

interface IProject {
    id: string;
    createdAt: string;
    name: string;
    isReadOnly: boolean;
    isMember: boolean;
    owner: {
        avatarUrl: string;
        name: string;
        id: string;
    };
}

const Project = () => {
    const { projectId } = useParams();
    const [payload, call] = useFetchApi<IProject>("GET", `projects/${projectId}`);
    const user = useUser();

    const isOwner = useMemo(() => (
        user !== null &&
        payload.result !== null &&
        user.id === payload.result.owner.id
    ), [payload.result, user]);

    useLayoutEffect(() => { call() }, [call])

    return payload.isLoading
        ? <CircleProgress size="lg" />
        : payload.result === null ? null : (
            <section className="flex flex-col w-full h-full my-10 p-2 flex-grow">

                <div className="flex flex-wrap-reverse flex-row justify-end sm:ml-10 items-center sm:gap-6 gap-2 mb-6">

                    {payload.result.isMember ? (
                        <Link to={`/projects/${projectId}/tickets/assigned`}>
                            <Button className="flex-row flex gap-2 justify-center items-center">
                                <p>your tasks</p>
                                <FaTasks />
                            </Button>
                        </Link>
                    ) : null}

                    <Link to={`/projects/${projectId}/members`}>
                        <Button className="flex-row flex gap-2 justify-center items-center">
                            <p>members</p>
                            <FiUsers />
                        </Button>
                    </Link>

                    <Link to={`/projects/${projectId}/tickets`}>
                        <Button className="flex-row flex gap-2 justify-center items-center">
                            <p>tickets</p>
                            <FaListUl />
                        </Button>
                    </Link>

                    <Link to={`/projects/${projectId}/activities`}>
                        <Button className="flex-row flex gap-2 justify-center items-center">
                            <p>activities</p>
                            <RxActivityLog />
                        </Button>
                    </Link>

                    {payload.result.isMember ? (
                        <Link to={`/projects/${projectId}/danger-zone`}>
                            <Button className="flex-row flex gap-2 justify-center items-center">
                                <p>danger zone</p>
                                <MdOutlineWarning />
                            </Button>
                        </Link>
                    ) : null}

                </div>

                <div className="flex flex-row w-full h-full gap-3">

                    <Link to={`/users/${payload.result.owner.id}`} className="w-12 h-12 hidden sm:flex">
                        <img
                            title="owner"
                            className="rounded-full bg-white dark:bg-black shadow-md w-10 h-10 object-cover"
                            src={payload.result.owner.avatarUrl}
                            alt={`${payload.result.owner.name}`}
                        />
                    </Link>

                    <div className="rounded-lg w-full h-full gap-4 flex flex-col shadow-md dark:shadow-secondary/40 bg-white dark:bg-black sm:left-arrow">

                        <div className="flex flex-row justify-between items-center border-b-gray-400 dark:border-b-gray-600 p-2 border-b">
                            <div className="flex flex-row gap-2 justify-start items-center">

                                <Link to={`/users/${payload.result.owner.id}`} className="w-12 h-12 sm:hidden flex">
                                    <img
                                        title="owner"
                                        className="rounded-full bg-white dark:bg-black shadow-md dark:shadow-secondary/40 w-10 h-10 object-cover"
                                        src={payload.result.owner.avatarUrl}
                                        alt={`${payload.result.owner.name}`}
                                    />
                                </Link>

                                <Link className="w-fit h-fit" to={`/users/${payload.result.owner.id}`}>
                                    <span
                                        title="owner"
                                        className="text-primary dark:text-secondary font-bold hover:underline">{payload.result.owner.name}</span>
                                </Link>

                                <p title="created at" className="text-gray-600 dark:text-gray-400 text-sm font-normal">{formatDate(payload.result.createdAt)}</p>

                            </div>

                            {isOwner ? <Action call={() => call()} name={payload.result.name} /> : null}
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

                            <Content editable={isOwner} url={`projects/${projectId}/content`} />

                        </div>

                    </div>

                </div>

            </section >
        );
};


export default Project;
