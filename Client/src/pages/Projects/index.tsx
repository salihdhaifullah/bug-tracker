import { useLayoutEffect, useMemo, useState } from "react"
import useFetchApi from "../../utils/hooks/useFetchApi"
import CircleProgress from "../../components/utils/CircleProgress"
import { useParams } from "react-router-dom";
import Pagination from "../../components/utils/Pagination";
import Button from "../../components/utils/Button";
import { MdOutlineCreateNewFolder } from "react-icons/md";
import SelectButton from "../../components/utils/SelectButton";
import SearchFiled from "../../components/utils/SearchFiled";
import CreateProjectModal from "./CreateProjectModal";
import roles from "../../utils/roles";
import ProjectsRow from "./ProjectsRow";
import { useModalDispatch } from "../../utils/context/modal";
import { Role } from "../MyTasks";
import { useUser } from "../../utils/context/user";

export interface IProject {
  id: number;
  createdAt: string
  name: string
  isPrivate: boolean;
  isReadOnly: boolean;
  members: number
  role: Role;
  tickets: number;
  ownerId: string;
}

const take = 10;

const Projects = () => {
  const { userId } = useParams();
  const user = useUser()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");

  const [projectsPayload, callProjects] = useFetchApi<IProject[]>("GET", `users/${userId}/projects/?take=${take}&page=${page}&search=${search}&role=${role}&status=${status}`, [page, take, userId, search, role, status]);
  const [CountPayload, callCount] = useFetchApi<number>("GET", `users/${userId}/projects/count/?take=${take}&search=${search}&role=${role}&status=${status}`, [take, userId, search, role, status]);

  useLayoutEffect(() => { callProjects() }, [page, role, status, callProjects])
  useLayoutEffect(() => { callCount() }, [role, status, callCount])

  const handelSearch = () => {
    callProjects()
    callCount()
  }

  const isOwner = useMemo(() => (
    user !== null
    && user.id === userId
  ), [user, userId])

  const dispatchModal = useModalDispatch();

  const handelOpenModal = () => {
    dispatchModal({ type: "open", payload: <CreateProjectModal /> })
  }

  return (
    <section className="flex flex-col justify-center items-center w-full gap-8 my-10">

      <div className="flex flex-row gap-6 w-full flex-wrap items-center justify-between px-4">

        <div className="flex w-full items-center sm:justify-between justify-center flex-row flex-wrap-reverse sm:flex-nowrap gap-6">

          <div className="max-w-[400px]">
            <SearchFiled onClick={handelSearch} label="Search for projects" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>

          <div className="flex gap-1 flex-row flex-wrap">
            <SelectButton value={role} setValue={setRole} label="role" options={["all", ...roles, "owner"]} />
            <SelectButton value={status} setValue={setStatus} label="status" options={["all", "archived", "unarchive"]} />
          </div>

        </div>

        <div className="flex items-center justify-center">
          {isOwner ? (
            <Button size="md" onClick={handelOpenModal} className="flex-row flex justify-center items-center gap-1">
              <MdOutlineCreateNewFolder />
              <p>create projects</p>
            </Button>
          ) : null}

        </div>

      </div>

      {projectsPayload.isLoading ? (
        <CircleProgress size="lg" className="my-20" />
      ) : (
        (!projectsPayload.result || projectsPayload.result.length === 0) ? (
          <h1 className="my-20 dark:text-white text-3xl"> no project found </h1>
        ) : (
          <div className="gap-2 flex flex-col justify-center items-center w-full p-4">
            {projectsPayload.result.map((item, index) => (
              <ProjectsRow key={index} {...item} />
            ))}
          </div>
        )
      )}

      <Pagination
        currentPage={page}
        pages={CountPayload.result ? Math.ceil(CountPayload.result / take) : 0}
        handelOnChange={(newPage) => setPage(newPage)}
      />

    </section>
  )
}

export default Projects;
