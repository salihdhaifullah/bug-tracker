import { useParams } from "react-router-dom"

const CreateTicket = () => {
    const { projectId } = useParams()
    return (
        <div>CreateTicket projectId is {projectId}</div>
    )
}

export default CreateTicket
