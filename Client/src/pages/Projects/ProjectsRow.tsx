import { IProject } from '.'
import { Link } from 'react-router-dom'
import Tag from '../../components/utils/Tag'
import rolesColors from '../../utils/rolesColors'
import formatDate from '../../utils/formatDate'
import { FiUsers } from 'react-icons/fi'
import { BiTask } from 'react-icons/bi'

const ProjectsRow = (props: IProject) => {
  return (
    <div className="flex w-full max-w-xl rounded-md shadow-md dark:shadow-secondary/40 p-4 bg-white dark:bg-black flex-row gap-2 items-center justify-between">

      <div className="flex flex-col gap-2 justify-start">
        <Link className="link text-2xl" to={`/project/${props.id}`}>{props.name}</Link>

        <div className="flex justify-start gap-2 items-center">

          <div className={`font-bold px-1 py-px rounded-xl shadow-md dark:shadow-secondary/40 ${(rolesColors as any)[props.role]}`}>
            <span title="your role in this project"> {props.role} </span>
          </div>

          <Tag name={props.isPrivate ? "private" : "public"} />
          {props.isReadOnly ? <Tag name="archived" /> : null}

          <div className="flex text-sm flex-row justify-end gap-2">
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
  )
}

export default ProjectsRow;
