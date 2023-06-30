import { Fragment, useLayoutEffect, useState } from "react"
import useFetchApi from "../utils/hooks/useFetchApi"
import CircleProgress from "../components/utils/CircleProgress"
import { Link } from "react-router-dom";
import Tag from "../components/utils/Tag";
import formatDate from "../utils/formatDate";
import Pagination from "../components/utils/Pagination";
import { BiTask } from "react-icons/bi";
import { FiUsers } from "react-icons/fi";

interface IProject {
  id: number;
  createdAt: string
  name: string
  isPrivate: boolean
  members: number
  tickets: number
}

const take = 10;

const Projects = () => {
  const [page, setPage] = useState(1)
  const [projectsPayload, callProjects] = useFetchApi<IProject[]>("GET", `project/projects/${page}/?take=${take}`, [page, take]);
  const [PagesCountPayload, callPagesCount] = useFetchApi<number>("GET", `project/count/?take=${take}`, [take]);

  useLayoutEffect(() => { callProjects() }, [page, take])
  useLayoutEffect(() => { callPagesCount() }, [take])

  return (
    <section className="flex flex-col w-full h-full my-10 p-2 flex-grow">
      {projectsPayload.isLoading ? (
        <CircleProgress size="lg" />
      ) : (
        <div className="bg-white mb-4 rounded-md shadow-md p-4 gap-2 flex flex-col">
          {(!projectsPayload.result || projectsPayload.result.length === 0) ? (
            <h1> Sorry No Project Found  </h1>
          ) : projectsPayload.result.map((item, index) => (
            <Fragment key={item.id}>
              <div className="flex w-full flex-row gap-2 items-center justify-between" >

                <div className="flex flex-col gap-2 justify-start">
                  <Link className="link text-2xl" to={`/project/${item.id}`}>{item.name}</Link>

                  <div className="flex justify-start gap-2 items-center">
                    <Tag name={item.isPrivate ? "private" : "public"} />

                    <div className="flex text-sm flex-row justify-end gap-2">
                      <p className="text-primary font-bold">{formatDate(item.createdAt)}</p>
                    </div>
                  </div>

                </div>

                <div className="flex flex-col justify-center h-full items-center">
                  <div className="flex flex-row gap-1">
                    <Tag name={`members ${!Number(item.members) ? "none" : Number(item.members)}`} icon={FiUsers} />
                    <Tag name={`tickets ${!Number(item.tickets) ? "none" : Number(item.tickets)}`} icon={BiTask} />
                  </div>
                </div>

              </div>
              {index !== ((projectsPayload.result?.length as number) - 1) && <hr className="flex my-2" />}
            </ Fragment>
          ))}
        </div>
      )}

      <Pagination
        currentPage={page}
        pages={PagesCountPayload.result || 0}
        handelOnChange={(newPage) => setPage(newPage)}
      />

    </section>
  )
}

export default Projects

