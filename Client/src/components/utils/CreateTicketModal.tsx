import { useParams } from "react-router-dom"
import { FormEvent, useState } from "react";
import TextFiled from "./TextFiled"
import useFetchApi from "../../utils/hooks/useFetchApi";
import Button from "./Button";
import Select from "./Select";
import SelectUser from "./SelectUser";
import { FaClipboardList } from "react-icons/fa";
import { useModalDispatch } from "../../utils/context/modal";

export const typeOptions = ["bug", "feature"];
export const priorityOptions = ["low", "medium", "high", "critical"];
export const statusOptions = ["review", "active", "in_progress", "resolved", "closed"];

interface ICreateTicket {
  name: string;
  type: string;
  priority: string;
  status: string;
  memberId?: string;
}

const CreateTicketModal = () => {
  const [name, setName] = useState("");
  const [type, setType] = useState(typeOptions[0]);
  const [priority, setPriority] = useState(priorityOptions[1]);
  const [status, setStatus] = useState(statusOptions[0]);
  const [memberId, setMemberId] = useState("");

  const { projectId } = useParams()

  const [isValidName, setIsValidName] = useState(false);

  const dispatchModal = useModalDispatch();

  const [payload, call] = useFetchApi<unknown, ICreateTicket>("POST", `projects/${projectId}/tickets`, [], () => {
    dispatchModal({ type: "close", payload: null })
  });

  const handelSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    call({ name, type, priority, status, memberId: !memberId.length ? undefined : memberId })
  }

  return (
      <div className="rounded-xl bg-white dark:bg-black flex flex-col gap-4 w-80 p-2 items-center justify-center">

        <form className="flex-col flex w-full justify-center items-center" onSubmit={handelSubmit}>

          <h1 className="text-primary dark:text-secondary font-bold text-3xl text-center mb-4">Create Ticket</h1>
          <div className="flex w-full justify-center items-center mb-4">
            <FaClipboardList className="text-3xl text-primary dark:text-secondary font-extrabold" />
          </div>

          <TextFiled
            validation={[
              { validate: (str: string) => str.length <= 100, massage: "max length of ticket name is 100 characters" },
              { validate: (str: string) => str.length >= 3, massage: "min length of ticket name is 3 characters" }
            ]}
            value={name}
            onChange={(e) => setName(e.target.value)}
            label="ticket name"
            isValid={isValidName}
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

          <SelectUser label="assign to" members={true} setId={setMemberId} id={memberId} />

          <div className="flex flex-row justify-center items-center w-full mt-2">
            <Button
              buttonProps={{ type: "submit" }}
              isLoading={payload.isLoading}
              isValid={isValidName}
            >submit</Button>
          </div>

        </form>

      </div>
  )
}

export default CreateTicketModal;
