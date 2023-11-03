import { useState } from "react";
import Select from "../components/utils/Select";
import Button from "../components/utils/Button";
import useFetchApi from "../utils/hooks/useFetchApi";
import { useNavigate, useParams } from "react-router-dom";
import SelectUser from "../components/utils/SelectUser";

export const roles = ["tester", "project_manger", "developer"];

const Invent = () => {
    const [inventedId, setInventedId] = useState("");
    const [role, setRole] = useState("developer");
    const { projectId } = useParams();
    const navigate = useNavigate();

    const [isValidRole, setIsValidRole] = useState(true);
    const [isValidId, setIsValidId] = useState(true);

    const [_, call] = useFetchApi<any, { inventedId: string, role: string }>("POST", `member/invent/${projectId}`, [projectId]);

    const handelInvent = () => {
        call({ inventedId, role });
        navigate(`/project/${projectId}`);
    }

    return (
        <section className="flex flex-col justify-center items-center flex-grow">
            <div className="rounded-xl bg-white flex flex-col gap-4 py-6 w-80 p-2 items-center justify-center shadow-xl">
                <h1 className="text-primary font-bold text-2xl text-center">invent member</h1>
                <SelectUser setIsValid={setIsValidId} required label="chose user to invent to this project" route={`not-members/${projectId}`} setId={setInventedId} id={inventedId} />
                <Select
                    label="role for user to invent"
                    validation={[{ validate: (str) => roles.includes(str), massage: "un-valid role" }]}
                    options={roles}
                    value={role}
                    setValue={setRole}
                    setIsValid={setIsValidRole}
                />
                <div className="flex flex-col justify-center items-end w-full  mr-16">
                    <Button isValid={isValidRole && isValidId} onClick={handelInvent}>Invent</Button>
                </div>
            </div>
        </section>
    )
}

export default Invent;
