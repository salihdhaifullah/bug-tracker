import { Link, useParams } from "react-router-dom"
import { useEffect } from "react";
import useFetchApi from "../utils/hooks/useFetchApi";
import formatDate from "../utils/formatDate";
import CircleProgress from "../components/utils/CircleProgress";
import Content from "../components/profile/Content";
import Button from "../components/utils/Button";
import { useUser } from "../utils/context/user";

interface IUser {
  firstName: string;
  lastName: string;
  imageUrl: string;
  id: string;
}

interface IMember extends IUser {
  joinedAt: string;
}

interface ITicket {
  createdAt: string;
  creator: IUser;
  assignedTo: IUser | null;
  title: string;
  priority: string;
  status: string;
  type: string;
}

interface IActivity {
  createdAt: string;
  markdown: string;
}

interface IProject {
  id: string;
  createdAt: string;
  name: string;
  descriptionMarkdown: string;
  owner: IUser;
  tickets: ITicket[]
  activities: IActivity[];
  members: IMember[]
  contentId: string;
}



const User = ({ user }: { user: IUser }) => {
  return (
    <div className="flex items-center">
      <img
        className="rounded-full shadow-md w-10 h-10 object-contain"
        src={user.imageUrl}
        alt={`${user.firstName} ${user.lastName}`}
      />
      <span className="ml-2 font-medium">{user.firstName} {user.lastName}</span>
    </div>
  );
};

const Ticket = ({ ticket }: { ticket: ITicket }) => {
  return (
    <div className="p-4 border rounded-lg shadow-sm">

      <h3 className="text-lg font-bold">{ticket.title}</h3>
      <div className="flex flex-row gap-2">
        <p className="text-sm text-gray-600">Created by: </p>
        <User user={ticket.creator} />
      </div>
      <div className="flex flex-row gap-2">
        <p className="text-sm text-gray-600">Assigned to: </p>
        {ticket.assignedTo ? <User user={ticket.assignedTo} /> : 'None'}
      </div>

      <p className="text-sm text-gray-600">Created at: {formatDate(ticket.createdAt)}</p>
      <p className="text-sm text-gray-600">Priority: {ticket.priority}</p>
      <p className="text-sm text-gray-600">Status: {ticket.status}</p>
      <p className="text-sm text-gray-600">Type: {ticket.type}</p>

    </div>
  );
};

const Project = () => {
  const { projectId } = useParams();
  const [projectsPayload, callProjects] = useFetchApi<IProject, unknown>("GET", `project/${projectId}`, []);

  useEffect(() => { callProjects() }, [])
  useEffect(() => { console.log(projectsPayload.result) }, [projectsPayload])
  const user = useUser();
  return (projectsPayload.isLoading || !projectsPayload.result) ? <CircleProgress size="lg" /> : (
    <section className="flex flex-col w-full h-full my-10 p-2 flex-grow">
      <div className="bg-white mb-4 rounded-md shadow-md p-4 gap-2 flex flex-col">

        <h1 className="text-2xl font-bold">{projectsPayload.result.name}</h1>

        <Content contentId={projectsPayload.result.contentId} isAllowedToEdit={user?.id === projectsPayload.result.owner.id}/>

        <p className="text-lg text-gray-700">{projectsPayload.result.descriptionMarkdown}</p>

        <div className="flex flex-col gap-2 justify-center items-start">
          <p className="text-sm text-gray-600">owner: </p>
          <Link to={`/profile/${projectsPayload.result.owner.id}`}>
            <User user={projectsPayload.result.owner} />
          </Link>
        </div>

        <p className="text-sm mt-4 text-gray-600">Created at: {formatDate(projectsPayload.result.createdAt)}</p>

        <div className="flex flex-row gap-4 mt-4 items-center">
          <h2 className="text-xl font-bold">Tickets</h2>
          <Link to={`/project/${projectsPayload.result.id}/create-ticket`}>
              <Button size="sm">create ticket</Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {projectsPayload.result.tickets.map((ticket) => (
            <Ticket key={ticket.title} ticket={ticket} />
          ))}
        </div>

        <h2 className="mt-4 text-xl font-bold"></h2>

        <div className="flex flex-row gap-4 mt-4 items-center">
          <h2 className="text-xl font-bold">Members</h2>
          <button className="bg-secondary text-primary shadow-md rounded-md px-1 p-[2px]">invite member</button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {projectsPayload.result.members.map((member) => (
            <div key={member.id} className="flex flex-col items-center p-4 border rounded-lg shadow-sm">
              <User user={member} />
              <p className="text-sm text-gray-600">Joined at: {formatDate(member.joinedAt)}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-4 text-xl font-bold">Activities</h2>

        <div className="space-y-4">
          {projectsPayload.result.activities.map((activity) => (
            <div key={activity.createdAt} className="p-4 border rounded-lg shadow-sm">
              <p className="text-lg">{activity.markdown}</p>
              <p className="text-sm text-gray-600">Created at: {formatDate(activity.createdAt)}</p>
            </div>
          ))}
        </div>



      </div>
    </section>
  );
};


export default Project;
