import { useParams } from "react-router-dom"
import { FormEvent, useState } from "react";
import TextFiled from "../components/utils/TextFiled"
import useFetchApi from "../utils/hooks/useFetchApi";
import Button from "../components/utils/Button";
import Select from "../components/utils/Select";
import SelectUser from "../components/utils/SelectUser";

const typeOptions = ["bug", "feature"];
const priorityOptions = ["low", "medium", "high", "critical"];
const statusOptions = ["review", "active", "in_progress", "resolved", "closed"];

const CreateTicket = () => {
  const [name, setName] = useState("");
  const [type, setType] = useState(typeOptions[0]);
  const [priority, setPriority] = useState(priorityOptions[1]);
  const [status, setStatus] = useState(statusOptions[0]);
  const [memberId, setMemberId] = useState("");

  const { projectId } = useParams()

  const [isValidName, setIsValidName] = useState(false);
  const [isValidType, setIsValidType] = useState(true);
  const [isValidPriority, setIsValidPriority] = useState(true);
  const [isValidStatus, setIsValidStatus] = useState(true);

  const [payload, call] = useFetchApi<unknown, { name: string, type: string, priority: string, status: string, memberId?: string }>("POST", `ticket/${projectId}`, []);

  const handelSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    call({ name, type, priority, status, memberId: !memberId.length ? undefined : memberId })
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
            validation={[
              { validate: (str: string) => typeOptions.includes(str), massage: "un-valid ticket type" }
            ]}
            setIsValid={setIsValidType}
            setValue={setType}
            label="ticket type"
          />

          <Select
            value={priority}
            options={priorityOptions}
            validation={[
              { validate: (str: string) => priorityOptions.includes(str), massage: "un-valid ticket priority" }
            ]}
            setValue={setPriority}
            setIsValid={setIsValidPriority}
            label="ticket priority"
          />

          <Select
            value={status}
            options={statusOptions}
            validation={[
              { validate: (str: string) => statusOptions.includes(str), massage: "un-valid ticket status" }
            ]}
            setValue={setStatus}
            setIsValid={setIsValidStatus}
            label="ticket status"
          />

          <SelectUser label="chose user to assign this ticket to" route={`members/${projectId}`} setId={setMemberId} id={memberId} />

          <div className="flex flex-col justify-center items-center w-full my-1">
            <Button
              buttonProps={{ type: "submit" }}
              isLoading={payload.isLoading}
              isValid={isValidName && isValidType && isValidStatus && isValidPriority}
            >submit</Button>
          </div>

        </form>

      </div>
    </section>

  )
}

export default CreateTicket;
