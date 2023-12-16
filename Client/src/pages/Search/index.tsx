import { useEffect, useState } from "react"
import useFetchApi from "../../utils/hooks/useFetchApi"
import CircleProgress from "../../components/utils/CircleProgress"
import Pagination from "../../components/utils/Pagination";
import useQuery from "../../utils/hooks/useQuery";
import ProjectRow from "./ProjectRow";

export interface IProject {
  id: number;
  createdAt: string
  name: string
  isReadOnly: boolean;
  members: number
  tickets: number;
  content: string;
  owner: {
    id: string;
    avatarUrl: string;
    name: string;
  }
}

const take = 10;

const Search = () => {
  const query = useQuery();
  const [page, setPage] = useState(1)

  const [projectsPayload, callProjects] = useFetchApi<IProject[]>("GET", `project/projects/explore/${page}/?take=${take}&search=${query.get("search") || ""}`, [page, take, query.get("search")]);
  const [CountPayload, callCount] = useFetchApi<number>("GET", `project/count/explore/?take=${take}&search=${query.get("search") || ""}`, [take, query.get("search")]);

  useEffect(() => { callProjects() }, [page, take, query.get("search")])
  useEffect(() => { callCount() }, [take, query.get("search")])

  return (
    <section className="flex flex-col justify-center items-center w-full gap-8 my-10">

      {projectsPayload.isLoading ? (
        <CircleProgress size="lg" />
      ) : (
        (!projectsPayload.result || projectsPayload.result.length === 0) ? (
          <h1> Sorry No Project Found </h1>
        ) : (
          <div className="gap-6 flex flex-col justify-center items-center w-full p-4">
            {projectsPayload.result.map((item, index) => (
              <ProjectRow {...item} key={index} />
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

export default Search;





