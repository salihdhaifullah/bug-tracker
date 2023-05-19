import { FormEvent, useState } from "react";
import useFetchApi from "../../utils/hooks/useFetchApi";
import TextFiled from "../../components/utils/TextFiled";
import CheckBox from "../../components/utils/CheckBox";
import { BiBookBookmark } from "react-icons/bi";
import { FiLock } from "react-icons/fi";
import SubmitButton from "../../components/utils/SubmitButton";
import { MdOutlineCreateNewFolder, MdOutlineDriveFileRenameOutline } from "react-icons/md";

const CreateProject = () => {
    const [name, setName] = useState("");
    const [projectState, setProjectState] = useState("public");

    const [isValidName, setIsValidName] = useState(false);

    const [payload, call] = useFetchApi("POST", "project", [name, projectState], { name,  isPrivate: projectState === "private" });

    const handelSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        call();
    }

    return (
        <section className="flex flex-col justify-center items-center flex-grow my-6 ">
            <div className="rounded-xl bg-white flex flex-col gap-4 w-80 p-2 items-center justify-center shadow-xl">

                <form className="flex-col flex w-full justify-center items-center" onSubmit={handelSubmit}>

                    <h1 className="text-primary font-bold text-2xl text-center mt-4 mb-1">Create Project</h1>
                    <div className="flex w-full justify-center items-center mb-4">
                        <MdOutlineCreateNewFolder className="text-3xl text-gray-800 font-extrabold"/>
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

                        <SubmitButton
                        isLoading={payload.isLoading}
                        isValid={isValidName}
                        />

                </form>
            </div>
        </section>
    )
}

export default CreateProject
