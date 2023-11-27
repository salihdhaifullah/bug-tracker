import { Fragment, useEffect, useState } from "react"
import useFetchApi from "../utils/hooks/useFetchApi"
import CircleProgress from "../components/utils/CircleProgress"
import { Link } from "react-router-dom";
import Tag from "../components/utils/Tag";
import formatDate from "../utils/formatDate";
import Pagination from "../components/utils/Pagination";
import { BiTask } from "react-icons/bi";
import { FiUsers } from "react-icons/fi";
import rolesColors from "../utils/rolesColors";

interface IProject {
  id: number;
  createdAt: string
  name: string
  isPrivate: boolean
  members: number
  role: string;
  tickets: number;
}

const take = 10;

const Projects = () => {
  const [page, setPage] = useState(1)
  const [projectsPayload, callProjects] = useFetchApi<IProject[]>("GET", `project/projects/${page}/?take=${take}`, [page, take]);
  const [PagesCountPayload, callPagesCount] = useFetchApi<number>("GET", `project/count/?take=${take}`, [take]);

  useEffect(() => { callProjects() }, [page, take])
  useEffect(() => { callPagesCount() }, [take])

  return (
    <div className="flex flex-col justify-center items-center w-full gap-2">
      {projectsPayload.isLoading ? (
        <CircleProgress size="lg" />
      ) : (
        (!projectsPayload.result || projectsPayload.result.length === 0) ? (
          <h1> Sorry No Project Found </h1>
        ) : (
          <>
            <h1 className="text-lg text-primary font-bold"> Your Projects </h1>

            {projectsPayload.result.map((item) => (
              <Fragment key={item.id}>
                <div className="flex w-full max-w-xl rounded-md shadow-md p-4 bg-white flex-row gap-2 items-center justify-between">

                  <div className="flex flex-col gap-2 justify-start">
                    <Link className="link text-2xl" to={`/project/${item.id}`}>{item.name}</Link>

                    <div className="flex justify-start gap-2 items-center">

                      <div className={`font-bold px-1 py-px rounded-xl shadow-md  ${(rolesColors as any)[item.role]}`}>
                        <span title="your role in this project"> {item.role} </span>
                      </div>

                      <Tag name={item.isPrivate ? "private" : "public"} />

                      <div className="flex text-sm flex-row justify-end gap-2">
                        <p className="text-primary font-bold">{formatDate(item.createdAt)}</p>
                      </div>

                    </div>

                  </div>

                  <div className="flex flex-col justify-center h-full items-center">
                    <div className="flex flex-col gap-1">

                      <span className="text-gray-500 text-center justify-center items-center flex flex-row gap-1 hover:text-primary text-lg" title="tickets">
                        <BiTask />
                        <span>{item.tickets}</span>
                      </span>

                      <span className="text-gray-500 text-center justify-center items-center flex flex-row gap-1 hover:text-primary text-lg" title="members">
                        <FiUsers />
                        <span>{item.members}</span>
                      </span>

                    </div>
                  </div>

                </div>
              </ Fragment>
            ))}
          </>
        )
      )}

      <Pagination
        currentPage={page}
        pages={PagesCountPayload.result || 0}
        handelOnChange={(newPage) => setPage(newPage)}
      />
    </div>
  )
}

export default Projects;

