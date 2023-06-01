import { Fragment, useEffect, useState } from "react"
import useFetchApi from "../../utils/hooks/useFetchApi"
import CircleProgress from "../../components/utils/CircleProgress"
import { Link } from "react-router-dom";
import Tag from "../../components/utils/Tag";
import { dateFormat } from "../../utils";
import Pagination from "../../components/utils/Pagination";
import { BiTask } from "react-icons/bi";
import { FiDelete, FiEdit, FiUsers } from "react-icons/fi";
import Modal from "../../components/utils/Model";

interface IProject {
  id: number;
  createdAt: string
  name: string
  isPrivate: boolean
  members: number
  tickets: number
}

const Projects = () => {
  const [page, setPage] = useState(1)
  const [isDeleting, setIsDeleting] = useState(false)
  const [take, _] = useState(10)

  const [projectsPayload, callProjects] = useFetchApi<IProject[]>("GET", `project/projects/${page}/?take=${take}`, [page, take]);
  const [PagesCountPayload, callPagesCount] = useFetchApi<number>("GET", `project/count/?take=${take}`, [take]);

  useEffect(() => { callProjects() }, [page, take])
  useEffect(() => { callPagesCount() }, [take])

  const handelDeleteProject = (id: number) => {
    console.warn("deleting project, id: " + id);
    setIsDeleting(false);
  }

  return (
    <div className="flex flex-col w-full h-full my-10 p-2 flex-grow">
      {projectsPayload.isLoading ? (
        <CircleProgress size="2xl" />
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
                      <p className="text-primary font-bold">{dateFormat(item.createdAt)}</p>
                    </div>
                  </div>

                </div>

                <div className="flex flex-col justify-center h-full gap-2 items-center">
                  <div className="flex flex-row gap-3 justify-end items-center mb-2 h-full w-full">
                  <FiDelete onClick={() => setIsDeleting(true)} className="text-red-600 text-[25px] font-bold p-1 rounded-md cursor-pointer hover:bg-slate-100" title="delete project" />
                  <Modal setIsOpen={setIsDeleting} isOpen={isDeleting}>
                      <h1>Are you sure you want to delete {item.name}</h1>
                      <button onClick={() => handelDeleteProject(item.id)}>delete</button>
                      <button onClick={() => setIsDeleting(false)}>cancel</button>
                  </Modal>
                  <FiEdit className="text-primary text-[25px] font-bold p-1 rounded-md cursor-pointer hover:bg-slate-100" title="edit project" />
                  </div>
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

    </div>
  )
}

export default Projects

