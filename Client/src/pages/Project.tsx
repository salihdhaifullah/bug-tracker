import { Link, useParams } from "react-router-dom"
import { useLayoutEffect } from "react";
import useFetchApi from "../utils/hooks/useFetchApi";
import formatDate from "../utils/formatDate";
import CircleProgress from "../components/utils/CircleProgress";
import Content from "../components/utils/Content";
import { IProject } from "../components/project";
import Members from "../components/project/Members";
import Tickets from "../components/project/Tickets";
import Activities from "../components/project/Activities";


const Project = () => {
  const { projectId } = useParams();
  const [projectPayload, callProjects] = useFetchApi<IProject>("GET", `project/${projectId}`, []);

  useLayoutEffect(() => { callProjects() }, [])

  const isEditable = () => {
    // TODO make a request to the server to check if the user can edit this project content or not
    return false;
  }

  return projectPayload.isLoading || !projectPayload.result
    ? <CircleProgress size="lg" />
    : (<section className="flex flex-col w-full h-full my-10 p-2 flex-grow">
      <div className="bg-white mb-4 rounded-md shadow-md p-4 gap-2 flex flex-col">

        <h1 className="text-2xl font-bold">{projectPayload.result.name}</h1>

        <Content editable={isEditable()} url={`project/content/${projectId}`} />

        <div className="flex flex-col gap-2 justify-center items-start">
          <p className="text-sm text-gray-600">owner: </p>
          <Link to={`/profile/${projectPayload.result.owner.id}`}>
            <div className="flex items-center">
              <img
                className="rounded-full shadow-md w-10 h-10 object-contain"
                src={projectPayload.result.owner.imageUrl}
                alt={`${projectPayload.result.owner.name}`}
              />
              <span className="ml-2 font-medium">{projectPayload.result.owner.name}</span>
            </div>
          </Link>
        </div>

        <p className="text-sm mt-4 text-gray-600">Created at: {formatDate(projectPayload.result.createdAt)}</p>
      </div>
      <Members />
      <Tickets />
      <Activities />
    </section >
    );
};


export default Project;
