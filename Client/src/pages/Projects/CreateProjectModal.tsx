import { FormEvent, useState } from "react";
import useFetchApi from "../../utils/hooks/useFetchApi";
import TextFiled from "../../components/utils/TextFiled";
import CheckBox from "../../components/utils/CheckBox";
import { BiBookBookmark } from "react-icons/bi";
import { FiLock } from "react-icons/fi";
import Button from "../../components/utils/Button";
import { MdOutlineCreateNewFolder, MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { useParams } from "react-router-dom";
import { useModalDispatch } from "../../utils/context/modal";


const CreateProjectModal = () => {
    const { userId } = useParams();
    const dispatchModal = useModalDispatch();
    const [name, setName] = useState("");
    const [projectState, setProjectState] = useState("public");
    const [isValidName, setIsValidName] = useState(false);

    const [payload, call] = useFetchApi<unknown, { name: string, isPrivate: boolean }>("POST", `users/${userId}/projects`, [], () => {
        dispatchModal({ type: "close", payload: null })
    });

    const handelSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        call({ name, isPrivate: projectState === "private" });
    }

    return (
        <div className="rounded-xl bg-white dark:bg-black flex flex-col gap-4 w-80 p-2 items-center justify-center">

            <form className="flex-col flex w-full justify-center items-center" onSubmit={handelSubmit}>

                <h1 className="text-primary dark:text-secondary font-bold text-3xl text-center mb-4">Create Project</h1>
                <div className="flex w-full justify-center items-center mb-4">
                    <MdOutlineCreateNewFolder className="text-3xl text-gray-800 dark:text-gray-200 font-extrabold" />
                </div>

                <TextFiled
                    validation={[
                        { validate: (str: string) => str.length > 0, massage: "name is required" },
                        { validate: (str: string) => str.length <= 100, massage: "max length of name is 100 character" }
                    ]}
                    icon={MdOutlineDriveFileRenameOutline}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    label="name"
                    setIsValid={setIsValidName}
                />

                <CheckBox
                    state={projectState}
                    setState={setProjectState}
                    options={[
                        {
                            name: "public",
                            icon: BiBookBookmark,
                            description: "anyone on the internet can see this project"
                        },
                        {
                            name: "private",
                            icon: FiLock,
                            description: "you choose who can see this project"
                        }
                    ]}
                />

                <div className="flex flex-col justify-center items-center w-full my-1">
                    <Button
                        buttonProps={{ type: "submit" }}
                        isLoading={payload.isLoading}
                        isValid={isValidName}
                    >submit</Button>
                </div>

            </form>
        </div>
    );
}

export default CreateProjectModal;
