import { useEffect, useState } from "react"
import useFetchApi from "../utils/hooks/useFetchApi"
import CircleProgress from "../components/utils/CircleProgress"
import { Link, useParams } from "react-router-dom";
import Tag from "../components/utils/Tag";
import formatDate from "../utils/formatDate";
import Pagination from "../components/utils/Pagination";
import { BiTask } from "react-icons/bi";
import { FiUsers } from "react-icons/fi";
import rolesColors from "../utils/rolesColors";
import Button from "../components/utils/Button";
import { MdOutlineCreateNewFolder } from "react-icons/md";
import SelectButton from "../components/utils/SelectButton";
import SearchFiled from "../components/utils/SearchFiled";
import CreateProjectModal from "../components/CreateProjectModal";
import roles from "../utils/roles";

interface IProject {
  id: number;
  createdAt: string
  name: string
  isPrivate: boolean;
  isReadOnly: boolean;
  members: number
  role: string;
  tickets: number;
}

const take = 10;

const Projects = () => {
  const { userId } = useParams();
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");

  const [projectsPayload, callProjects] = useFetchApi<IProject[]>("GET", `project/projects/${page}/?take=${take}&userId=${userId}&search=${search}&role=${role}&status=${status}&type=${type}`, [page, take, userId, search, role, type, status]);
  const [PagesCountPayload, callPagesCount] = useFetchApi<number>("GET", `project/count/?take=${take}&userId=${userId}&search=${search}&role=${role}&status=${status}&type=${type}`, [take, userId, search, role, type, status]);

  useEffect(() => { callProjects() }, [page, take, role, type, status])
  useEffect(() => { callPagesCount() }, [take, role, type, status])

  const handelSearch = () => {
    callProjects()
    callPagesCount()
  }

  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);

  return (
    <section className="flex flex-col justify-center items-center w-full gap-8 my-10">

      <div className="flex flex-row gap-4 w-full flex-wrap items-center justify-between px-4">

        <div className="flex items-center justify-center">

          <div className="max-w-[400px]">
            <SearchFiled onClick={handelSearch} label="Search for projects" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>

          <div className="flex gap-1 flex-row flex-wrap">
            <SelectButton value={role} setValue={setRole} label="role" options={["all", ...roles, "owner"]} />
            <SelectButton value={status} setValue={setStatus} label="status" options={["all", "archived", "unarchive"]} />
            <SelectButton value={type} setValue={setType} label="type" options={["all", "private", "public"]} />
          </div>

        </div>

        <CreateProjectModal isOpenModal={isOpenCreateModal} setIsOpenModal={setIsOpenCreateModal} />

        <div className="flex items-center justify-center">
            <Button size="lg" onClick={() => setIsOpenCreateModal((prev) => !prev)} className="flex-row flex justify-center items-center gap-1">
              <MdOutlineCreateNewFolder />
              <p>create projects</p>
            </Button>
        </div>

      </div>

      {projectsPayload.isLoading ? (
        <CircleProgress size="lg" />
      ) : (
        (!projectsPayload.result || projectsPayload.result.length === 0) ? (
          <h1> No Project Found </h1>
        ) : (
          <div className="gap-2 flex flex-col justify-center items-center w-full p-4">


            {projectsPayload.result.map((item) => (
              <div key={item.id} className="flex w-full max-w-xl rounded-md shadow-md dark:shadow-secondary/40 p-4 bg-white dark:bg-black flex-row gap-2 items-center justify-between">

                <div className="flex flex-col gap-2 justify-start">
                  <Link className="link text-2xl" to={`/project/${item.id}`}>{item.name}</Link>

                  <div className="flex justify-start gap-2 items-center">

                    <div className={`font-bold px-1 py-px rounded-xl shadow-md dark:shadow-secondary/40 ${(rolesColors as any)[item.role]}`}>
                      <span title="your role in this project"> {item.role} </span>
                    </div>

                    <Tag name={item.isPrivate ? "private" : "public"} />
                    {item.isReadOnly ? <Tag name="archived" /> : null}

                    <div className="flex text-sm flex-row justify-end gap-2">
                      <p className="text-primary dark:text-secondary font-bold">{formatDate(item.createdAt)}</p>
                    </div>

                  </div>

                </div>

                <div className="flex flex-col justify-center h-full items-center">
                  <div className="flex flex-col gap-1">

                    <span className="text-gray-500 text-center justify-center items-center flex flex-row gap-1 dark:hover:text-secondary hover:text-primary text-lg" title="tickets">
                      <BiTask />
                      <span>{item.tickets}</span>
                    </span>

                    <span className="text-gray-500 text-center justify-center items-center flex flex-row gap-1 dark:hover:text-secondary hover:text-primary text-lg" title="members">
                      <FiUsers />
                      <span>{item.members}</span>
                    </span>

                  </div>
                </div>

              </div>
            ))}
          </div>
        )
      )}

      <Pagination
        currentPage={page}
        pages={PagesCountPayload.result || 0}
        handelOnChange={(newPage) => setPage(newPage)}
      />

    </section>
  )
}

export default Projects;
