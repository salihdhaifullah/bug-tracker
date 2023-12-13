import { Link, useParams } from "react-router-dom"
import { useEffect, useRef, useState } from "react";
import useFetchApi from "../utils/hooks/useFetchApi";
import formatDate from "../utils/formatDate";
import CircleProgress from "../components/utils/CircleProgress";
import Content from "../components/utils/Content";
import Members from "../components/project/Members";
import Tickets from "../components/project/Tickets";
import Activities from "../components/project/Activities";
import DangerZone from "../components/project/DangerZone";
import useOnClickOutside from "../utils/hooks/useOnClickOutside";
import { FiMoreVertical } from "react-icons/fi";
import Button from "../components/utils/Button";
import Modal from "../components/utils/Modal";
import TextFiled from "../components/utils/TextFiled";
import { useUser } from "../utils/context/user";
import { FaTasks } from "react-icons/fa";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';

interface IProject {
    id: string;
    createdAt: string;
    name: string;
    isPrivate: boolean;
    isReadOnly: boolean;
    members: number;
    tickets: number;
    markdown: string;
    owner: {
        avatarUrl: string;
        name: string;
        id: string;
    };
}

interface IActionProps {
    projectId: string;
    name: string;
    call: () => void;
}

const Action = (props: IActionProps) => {
    const [name, setName] = useState(props.name);
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);
    const [isValidName, setIsValidName] = useState(false);
    const [isChange, setIsChange] = useState(false);

    const targetRef = useRef<HTMLDivElement>(null);

    useOnClickOutside(targetRef, () => setIsOpen(false));

    const [payload, call] = useFetchApi<unknown, { projectId: string, name: string }>("PATCH", "project/name", [], () => {
        setIsOpenUpdateModal(false)
        setIsChange(true)
    });

    useEffect(() => {
        if (isChange) props.call();
    }, [isChange])

    return (
        <div ref={targetRef} className="flex w-fit relative">
            <div onClick={() => setIsOpen(!isOpen)} className="p-1 font-normal text-lg dark:text-gray-400 hover:dark:text-gray-200 text-gray-600 hover:text-gray-800 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer">
                <FiMoreVertical />
            </div>

            <div className={`${isOpen ? "scale-100" : "scale-0"} transition-all flex flex-col gap-2 py-2 px-4 bg-white dark:bg-black justify-center items-center absolute right-[80%] -bottom-[50%] rounded shadow-md dark:shadow-secondary/40`}>
                <Button onClick={() => setIsOpenUpdateModal(true)} size="sm" className="w-full">update</Button>
            </div>

            <Modal isOpen={isOpenUpdateModal} setIsOpen={setIsOpenUpdateModal}>
                <div className="flex flex-col justify-center items-center pt-4 pb-2 px-4 w-[400px] text-center h-full gap-4">
                    <h1 className="text-3xl py-8 font-bold text-primary dark:text-secondary">change name</h1>

                    <TextFiled
                        validation={[
                            { validate: (str: string) => str.length > 0, massage: "name is required" },
                            { validate: (str: string) => str.length <= 100, massage: "max length of name is 100 character" }
                        ]}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        label="project name"
                        setIsValid={setIsValidName}
                    />

                    <div className="flex flex-row items-center mt-4 justify-between w-full px-4">
                        <Button onClick={() => setIsOpenUpdateModal(false)}>cancel</Button>
                        <Button isLoading={payload.isLoading} onClick={() => call({ projectId: props.projectId, name })} isValid={isValidName}>change</Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
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



    ChartJS.register(
        ArcElement,
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Tooltip,
        Legend,
        Title);

    const data = {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
            {
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Chart.js Line Chart',
            },
        },
    };

    const Linedata = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'Dataset 1',
                data: [23, 423, 2324, 25532, 523232, 25323, 2353352],
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            }
        ],
    };

    return payload.isLoading
        ? <CircleProgress size="lg" />
        : payload.result === null ? null : (
            <section className="flex flex-col w-full h-full my-10 p-2 flex-grow">
                <div className="pb-8 px-4 ml-10 flex flex-row gap-2 justify-between flex-wrap">

                    <div className="transition-all opacity-90 hover:opacity-100 hover:scale-100 scale-90 bg-primary dark:bg-secondary text-gray-100 dark:text-gray-900 py-6 px-12 rounded-lg flex flex-row text-center gap-2">
                        <p className="text-lg font-bold">Features</p>
                        <p className="text-xl font-bold">5</p>
                    </div>

                    <div className="transition-all opacity-90 hover:opacity-100 hover:scale-100 scale-90 bg-primary dark:bg-secondary text-gray-100 dark:text-gray-900 py-6 px-12 rounded-lg flex flex-row text-center gap-2">
                        <p className="text-lg font-bold">Bugs</p>
                        <p className="text-xl font-bold">3</p>
                    </div>

                    <div className="transition-all opacity-90 hover:opacity-100 hover:scale-100 scale-90 bg-primary dark:bg-secondary text-gray-100 dark:text-gray-900 py-6 px-12 rounded-lg flex flex-row text-center gap-2">
                        <p className="text-lg font-bold">Members</p>
                        <p className="text-xl font-bold">10</p>
                    </div>

                </div>


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

                <div className="flex flex-row justify-between my-4 ml-10">
                    <div className="flex justify-center items-center w-[400px] h-fit rounded-md p-4 shadow-lg bg-white dark:bg-black">
                        <Pie data={data} />
                    </div>

                    <div className="flex justify-center items-center w-[800px] h-fit rounded-md p-4 shadow-lg bg-white dark:bg-black">
                        <Line data={Linedata} options={options} />
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
