import { Link, useParams } from "react-router-dom"
import { useLayoutEffect } from "react";
import useFetchApi from "../utils/hooks/useFetchApi";
import formatDate from "../utils/formatDate";
import CircleProgress from "../components/utils/CircleProgress";
import Content from "../components/utils/Content";
import Button from "../components/utils/Button";
import { useUser } from "../utils/context/user";
import { IProject } from "../components/project";
import Ticket from "../components/project/Ticket";
import User from "../components/project/User";
import Members from "../components/project/Members";


const Project = () => {
  const { projectId } = useParams();
  const [projectPayload, callProjects] = useFetchApi<IProject>("GET", `project/${projectId}`, []);

  useLayoutEffect(() => { callProjects() }, [])

  const user = useUser();

  const isEditable = () => {
    if (!projectPayload.result) return false;

    let isAllowed = false;
    for (let i = 0; i < projectPayload.result.members.length; i++) {
      const member = projectPayload.result.members[i];
      if (user?.id === member.id && (member.role === "owner" || member.role === "project_manger")) {
        isAllowed = true;
        break;
      }
    }

    return isAllowed;
  }


  return projectPayload.isLoading || !projectPayload.result
    ? <CircleProgress size="lg" />
    : (<section className="flex flex-col w-full h-full my-10 p-2 flex-grow">
      <div className="bg-white mb-4 rounded-md shadow-md p-4 gap-2 flex flex-col">

        <h1 className="text-2xl font-bold">{projectPayload.result.name}</h1>

        <Content editable={isEditable()} url={`project/content/${projectId}`} />

        <div className="flex flex-col gap-2 justify-center items-start">
          <p className="text-sm text-gray-600">owner: </p>
          <User user={projectPayload.result.owner} />
        </div>

        <p className="text-sm mt-4 text-gray-600">Created at: {formatDate(projectPayload.result.createdAt)}</p>

        <div className="flex flex-row gap-4 mt-4 items-center">
          <h2 className="text-xl font-bold">Tickets</h2>
          <Link to={`/project/${projectPayload.result.id}/create-ticket`}>
            <Button size="sm">create ticket</Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {projectPayload.result.tickets.map((ticket, index) => (
            <Ticket key={index} ticket={ticket} />
          ))}
        </div>

        <h2 className="mt-4 text-xl font-bold"></h2>

        <h2 className="mt-4 text-xl font-bold">Activities</h2>

        <div className="space-y-4">
          {projectPayload.result.activities.map((activity) => (
            <div key={activity.createdAt} className="p-4 border rounded-lg shadow-sm">
              <p className="text-lg">{activity.markdown}</p>
              <p className="text-sm text-gray-600">Created at: {formatDate(activity.createdAt)}</p>
            </div>
          ))}
        </div>

      </div>
      <Members members={projectPayload.result.members} ownerId={projectPayload.result.owner.id} />
    </section >
    );
};


export default Project;
