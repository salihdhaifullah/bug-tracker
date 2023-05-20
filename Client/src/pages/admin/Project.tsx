import { useParams } from "react-router-dom"
import MarkdownEditor from "../../components/utils/MarkdownEditor";
import { useState } from "react";

const Project = () => {
  const { page } = useParams();
  const [files, setFiles] = useState<Record<string, Blob | null>>({})
  const [md, setMd] = useState("")

  return (
    <div>
      <MarkdownEditor setMd={setMd} setFiles={setFiles} />
      Project Id {page}
    </div>
  )
}

export default Project
