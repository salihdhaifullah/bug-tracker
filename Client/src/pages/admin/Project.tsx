import { useParams } from "react-router-dom"
import MarkdownEditor from "../../components/utils/MarkdownEditor";
import { useEffect, useState } from "react";
import useFetchApi from "../../utils/hooks/useFetchApi";

const Project = () => {
  const { projectId } = useParams();
  const [files, setFiles] = useState<Record<string, Blob | null>>({})
  const [md, setMd] = useState("")
  const [projectsPayload, callProjects] = useFetchApi<any>("GET", `project/${projectId}`, []);

  useEffect(() => { callProjects() }, [])
  useEffect(() => { console.log(projectsPayload) }, [projectsPayload])

  return (
    <div>
      <MarkdownEditor setMd={setMd} setFiles={setFiles} />
      Project Id {projectId}
    </div>
  )
}

export default Project
