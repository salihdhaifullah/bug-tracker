import { useEffect, useState } from "react";
import Modal from "../utils/Model";
import Select from "../utils/Select";
import SelectToInvent from "./SelectToInvent";
import Button from "../utils/Button";
import useFetchApi from "../../utils/hooks/useFetchApi";
import { useParams } from "react-router-dom";

interface IInventProps {
    openInvite: boolean;
    setOpenInvite: (bool: boolean) => void;
}

const Invent = (props: IInventProps) => {
    const [inventedId, setInventedId] = useState("");
    const [role, setRole] = useState("developer");
    const roles = ["tester", "project_manger", "developer"];
    const { projectId } = useParams();

    const [isValidRole, setIsValidRole] = useState(true);

    const [_, call] = useFetchApi<any, { inventedId: string, role: string }>("POST", `member/invent/${projectId}`, [projectId]);

    const handelInvent = () => {
        call({ inventedId, role });
        props.setOpenInvite(false)
    }

    useEffect(() => {
        setRole("developer");
        setInventedId("");
    }, [props.openInvite])

    return (
        <Modal isOpen={props.openInvite} setIsOpen={props.setOpenInvite}>
            <div className="w-[350px] flex justify-center items-center gap-2 p-2 flex-col">
                <SelectToInvent setId={setInventedId} id={inventedId} />
                <Select
                    label="role for user to invent"
                    validation={[{ validate: (str) => roles.includes(str), massage: "un-valid role" }]}
                    options={roles}
                    value={role}
                    setValue={setRole}
                    setIsValid={setIsValidRole}
                />
                <div className="flex flex-col justify-center items-end w-full  mr-16">
                    <Button isValid={isValidRole && inventedId.length === 26} onClick={handelInvent}>Invent</Button>
                </div>
            </div>
        </Modal>
    )
}

export default Invent;
