import { Link } from "react-router-dom";
import Tag from "../../components/utils/Tag";
import formatDate from "../../utils/formatDate";
import { BiTask } from "react-icons/bi";
import { FiUsers } from "react-icons/fi";
import useMarkdown from "../../components/utils/markdown/useMarkdown";
import { IProject } from ".";

const ProjectRow = (props: IProject) => {
    const jsx = useMarkdown(props.content);

    return (
        <div className="flex flex-row h-auto w-full gap-3">
            <Link to={`/profile/${props.owner.id}`} className="hidden sm:flex w-12 h-12">
                <img
                    title="owner"
                    className="rounded-full bg-white dark:shadow-secondary/40 shadow-md dark:bg-black w-10 h-10 object-contain"
                    src={props.owner.avatarUrl}
                    alt={`${props.owner.name}`}
                />
            </Link>

            <div className="flex w-full rounded-md shadow-md dark:shadow-secondary/40 bg-white dark:bg-black p-4 flex-col gap-4 sm:left-arrow">


                <Link to={`/profile/${props.owner.id}`} className="sm:hidden flex w-12 h-12">
                    <img
                        title="owner"
                        className="rounded-full bg-white dark:shadow-secondary/40 shadow-md dark:bg-black w-10 h-10 object-contain"
                        src={props.owner.avatarUrl}
                        alt={`${props.owner.name}`}
                    />
                </Link>

                <div className="flex w-full flex-row gap-2 items-center justify-between">

                    <div className="flex flex-col gap-2 justify-start">
                        <Link className="link text-4xl" to={`/project/${props.id}`}>{props.name}</Link>

                        <div className="flex justify-start gap-2 items-center">

                            {props.isReadOnly ? <Tag name="archived" /> : null}

                            <div className="flex text-base flex-row justify-end gap-2">
                                <p className="text-primary dark:text-secondary font-bold">{formatDate(props.createdAt)}</p>
                            </div>

                        </div>

                    </div>

                    <div className="flex flex-col justify-center h-full items-center">
                        <div className="flex flex-col gap-1">

                            <span className="text-gray-500 text-center justify-center items-center flex flex-row gap-1 dark:hover:text-secondary hover:text-primary text-lg" title="tickets">
                                <BiTask />
                                <span>{props.tickets}</span>
                            </span>

                            <span className="text-gray-500 text-center justify-center items-center flex flex-row gap-1 dark:hover:text-secondary hover:text-primary text-lg" title="members">
                                <FiUsers />
                                <span>{props.members}</span>
                            </span>

                        </div>
                    </div>

                </div>

                <div>
                    {jsx}
                </div>

            </div>
        </div>
    )
}

export default ProjectRow;
