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
import Modal from "../components/utils/Model";
import TextFiled from "../components/utils/TextFiled";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { useUser } from "../utils/context/user";

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

    const targetRef = useRef<HTMLDivElement>(null);

    useOnClickOutside(targetRef, () => setIsOpen(false));

    const [payload, call] = useFetchApi<unknown, { projectId: string, name: string }>("PATCH", "project/name", [], () => {
        props.call()
    });

    return (
        <div ref={targetRef} className="flex w-fit relative">
            <div onClick={() => setIsOpen(!isOpen)} className="p-1 font-normal text-lg dark:text-gray-400 hover:dark:text-gray-200 text-gray-600 hover:text-gray-800 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer">
                <FiMoreVertical />
            </div>

            <div className={`${isOpen ? "scale-100" : "scale-0"} transition-all flex flex-col gap-2 py-2 px-4 bg-white dark:bg-black justify-center items-center absolute right-[80%] -bottom-[50%] rounded shadow-md dark:shadow-secondary/40`}>
                <Button onClick={() => setIsOpenUpdateModal(true)} size="xs" className="w-full">update</Button>
            </div>

            <Modal isOpen={isOpenUpdateModal} setIsOpen={setIsOpenUpdateModal}>
                <div className="flex flex-col justify-center items-center pt-4 pb-2 px-4 w-[400px] text-center h-full gap-4">
                    <h1 className="text-2xl font-bold text-primary dark:text-secondary">update name</h1>

                    <TextFiled
                        validation={[
                            { validate: (str: string) => str.length > 0, massage: "name is required" },
                            { validate: (str: string) => str.length <= 100, massage: "max length of name is 100 character" }
                        ]}
                        icon={MdOutlineDriveFileRenameOutline}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        label="project name"
                        setIsValid={setIsValidName}
                    />

                    <div className="flex flex-row items-center mt-4  justify-between w-full px-4">
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

                {Boolean(isOwnerPayload.result) ? <DangerZone {...payload.result} /> : null}


            </section >
        );
};


export default Project;
