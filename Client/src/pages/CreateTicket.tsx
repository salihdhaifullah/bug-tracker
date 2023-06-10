import { useParams } from "react-router-dom"
import { FormEvent, useState } from "react";
import TextFiled from "../components/utils/TextFiled"
import useFetchApi from "../utils/hooks/useFetchApi";
import Button from "../components/utils/Button";
import Select from "../components/utils/Select";

const typeOptions = ["bug", "feature"];
const priorityOptions = ["low", "medium", "high", "critical"];
const statusOptions = ["review", "active", "in_progress", "resolved", "closed"];

const CreateTicket = () => {
  const [name, setName] = useState("");
  const [type, setType] = useState(typeOptions[0]);
  const [priority, setPriority] = useState(priorityOptions[1]);
  const [status, setStatus] = useState(statusOptions[0]);
  const [assignedToEmail, setAssignedToEmail] = useState("");

  const { projectId } = useParams()

  const [isValidName, setIsValidName] = useState(false);
  const [isValidAssignedToEmail, setIsValidAssignedToEmail] = useState(true);

  const [payload, call] = useFetchApi<unknown, { name: string, type: string, priority: string, status: string, assignedToEmail?: string }>("POST", `ticket/${projectId}`, []);

  const handelSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    call({ name, type, priority, status, assignedToEmail: !assignedToEmail.length ? undefined : assignedToEmail })
  }


  return (
    <section className="flex flex-col  justify-center items-center flex-grow">
      <div className="rounded-xl bg-white flex flex-col gap-4 w-80 p-2 pt-6 items-center justify-center shadow-xl">

        <h1 className="text-primary font-bold text-2xl text-center">create ticket</h1>

        <form className="flex-col flex w-full justify-center items-center" onSubmit={handelSubmit}>

          <TextFiled
            validation={[
              { validate: (str: string) => str.length <= 100, massage: "max length of ticket name is 100 characters" },
              { validate: (str: string) => str.length >= 3, massage: "min length of ticket name is 3 characters" }
            ]}
            value={name}
            onChange={(e) => setName(e.target.value)}
            label="ticket name"
            setIsValid={setIsValidName}
          />

          <Select
            value={type}
            options={typeOptions}
            setValue={setType}
            label="ticket type"
          />

          <Select
            value={priority}
            options={priorityOptions}
            setValue={setPriority}
            label="ticket priority"
          />

          <Select
            value={status}
            options={statusOptions}
            setValue={setStatus}
            label="ticket status"
          />

          <TextFiled
            validation={[
              { validate: (str: string) => (!str.length) || /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(str), massage: "un-valid email address" },
              { validate: (str: string) => (!str.length) || str.length <= 100, massage: "max length of email address is 100 character" }
            ]}
            value={assignedToEmail}
            onChange={(e) => setAssignedToEmail(e.target.value)}
            label="ticket assigned to email"
            setIsValid={setIsValidAssignedToEmail}
          />


          <div className="flex flex-col justify-center items-center w-full my-1">
            <Button
              buttonProps={{ type: "submit" }}
              isLoading={payload.isLoading}
              isValid={isValidName && isValidAssignedToEmail}
            >submit</Button>
          </div>

        </form>

      </div>
    </section>

  )
}

export default CreateTicket;
