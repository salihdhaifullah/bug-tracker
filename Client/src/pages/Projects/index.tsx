import { useEffect, useState } from "react"
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

export interface IProject {
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
  const [CountPayload, callCount] = useFetchApi<number>("GET", `project/count/?take=${take}&userId=${userId}&search=${search}&role=${role}&status=${status}&type=${type}`, [take, userId, search, role, type, status]);

  useEffect(() => { callProjects() }, [page, take, role, type, status])
  useEffect(() => { callCount() }, [take, role, type, status])

  const handelSearch = () => {
    callProjects()
    callCount()
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
            {projectsPayload.result.map((item, index) => (
              <ProjectsRow key={index} {...item} />
            ))}
          </div>
        )
      )}

      <Pagination
        currentPage={page}
        pages={CountPayload.result ? Math.ceil(CountPayload.result/take) : 0}
        handelOnChange={(newPage) => setPage(newPage)}
      />

    </section>
  )
}

export default Projects;
