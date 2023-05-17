import { FormEvent, useEffect, useState } from "react";
import useFetchApi from "../../utils/hooks/useFetchApi";
import TextFiled from "../../components/utils/TextFiled";
import { FaUserCircle } from "react-icons/fa";
import CircleProgress from "../../components/utils/CircleProgress";
import Select from "../../components/utils/Select";

interface IOption {
    id: number;
    fullName: string
}

const CreateProject = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [projectMangerId, setProjectMangerId] = useState("");
    const [projectMangers, setProjectMangers] = useState<IOption[]>([]);

    const [isValidName, setIsValidName] = useState(false);
    const [isValidDescription, setIsValidDescription] = useState(false);
    const [isValidProjectManger, setIsValidProjectManger] = useState(false);

    const [payload2, call2] = useFetchApi<IOption[]>("GET", "user/project-mangers", []);

    useEffect(() => { call2() }, [])

    useEffect(() => {
            if (payload2.result) setProjectMangers(payload2.result);
     }, [payload2.result])

    const [payload1, call1] = useFetchApi("POST", "project", [name, description, projectMangerId], { name, description, projectMangerId });

    const handelSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        call1();
    }

    return (
        <section className="flex flex-col justify-center items-center flex-grow my-6 ">
            <div className="rounded-xl bg-white flex flex-col gap-4 w-80 p-2 items-center justify-center shadow-xl">

                <form className="flex-col flex w-full justify-center items-center" onSubmit={handelSubmit}>

                    <h1 className="text-primary font-bold text-2xl text-center">Create Project</h1>

                    <TextFiled
                        validation={[
                            { validate: (str: string) => str.length > 0, massage: "name is required" },
                            { validate: (str: string) => str.length <= 50, massage: "max length of name is 50 character" }
                        ]}
                        icon={FaUserCircle}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        label="name"
                        setIsValid={setIsValidName}
                    />

                    <TextFiled
                        validation={[
                            { validate: (str: string) => str.length > 0, massage: "description is required" },
                            { validate: (str: string) => str.length <= 50, massage: "max length of description is 50 character" }
                        ]}
                        icon={FaUserCircle}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        label="description"
                        setIsValid={setIsValidDescription}
                    />

                    <Select
                        validation={[
                            { validate: (str: string) => str.length > 0, massage: "description is required" },
                            { validate: (str: string) => str.length <= 50, massage: "max length of description is 50 character" }
                        ]}
                        icon={FaUserCircle}
                        value={projectMangerId}
                        setValue={setProjectMangerId}
                        options={projectMangers}
                        label="project manger"
                        setIsValid={setIsValidProjectManger}
                    />

                    <div className="flex justify-center">
                        {(payload1.isLoading || !isValidName || !isValidDescription || !isValidProjectManger) ? (
                            <button disabled
                                className="text-primary bg-gray-300 min-w-[50px] text-center p-2 cursor-not-allowed rounded-md border-0 text-base font-bold shadow-md">
                                {payload1.isLoading ? <CircleProgress size="md" /> : "submit"}
                            </button>
                        ) : (
                            <button type="submit"
                                className="text-primary bg-secondary text-center p-2 rounded-md border-0 text-base font-bold cursor-pointer transition-all  ease-in-out shadow-lg hover:shadow-xl hover:border-gray-600 hover:text-white">
                                submit
                            </button>
                        )}
                    </div>

                </form>
            </div>
        </section>
    )
}

export default CreateProject
