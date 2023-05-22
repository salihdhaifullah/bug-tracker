import { Fragment, useEffect, useState } from "react"
import useFetchApi from "../../utils/hooks/useFetchApi"
import CircleProgress from "../../components/utils/CircleProgress"
import { Link } from "react-router-dom";
import Tag from "../../components/utils/Tag";
import { dateFormat } from "../../utils";
import Pagination from "../../components/utils/Pagination";
import { FaTasks } from "react-icons/fa";

interface IProject {
  id: number;
  createdAt: string
  name: string
  isPrivate: boolean
}

const Projects = () => {
  const [page, setPage] = useState(1)
  const [take, _] = useState(10)

  const [projectsPayload, callProjects] = useFetchApi<IProject[]>("GET", `project/projects/${page}/?take=${take}`, [page, take]);
  const [PagesCountPayload, callPagesCount] = useFetchApi<number>("GET", `project/count/?take=${take}`, [take]);

  useEffect(() => { callProjects() }, [page, take])
  useEffect(() => { callPagesCount() }, [take])

  return projectsPayload.isLoading ? (
    <div className="flex flex-grow w-full h-full">
      <CircleProgress size="2xl" />
    </div>
  ) : (
    <div className="flex flex-col w-full h-full my-10 p-2 flex-grow">
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
                    <p className="text-primary font-bold">{dateFormat(item.createdAt)}</p>
                  </div>
                </div>

              </div>

              <div className="flex flex-row ">
                <Tag name={`tickets ${2}`} icon={FaTasks} />
                <Tag name={`members ${2}`} icon={FaTasks} />
              </div>

            </div>
            {index !== ((projectsPayload.result?.length as number) - 1) && <hr className="flex my-2" />}
          </ Fragment>
        ))}
      </div>

      <Pagination
        currentPage={page}
        pages={PagesCountPayload.result || 0}
        handelOnChange={(newPage) => setPage(newPage)}
      />

    </div>
  )
}

export default Projects

