import { useParams } from "react-router-dom"
import { useEffect } from "react";
import useFetchApi from "../../utils/hooks/useFetchApi";

const Project = () => {
  const { projectId } = useParams();
  const [projectsPayload, callProjects] = useFetchApi<any>("GET", `project/${projectId}`, []);

  useEffect(() => { callProjects() }, [])
  useEffect(() => { console.log(projectsPayload) }, [projectsPayload])

  return (
    <div>Project Id {projectId}</div>
  )
}

export default Project
