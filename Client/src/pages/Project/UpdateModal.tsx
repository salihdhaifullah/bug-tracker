import { FormEvent, useState } from "react";
import { useParams } from "react-router-dom";
import useFetchApi from "../../utils/hooks/useFetchApi";
import { useModalDispatch } from "../../utils/context/modal";
import TextFiled from "../../components/utils/TextFiled";
import Button from "../../components/utils/Button";

const UpdateModal = (props: { name: string, call: () => void }) => {
    const { projectId } = useParams();
    const [name, setName] = useState(props.name);
    const [isValidName, setIsValidName] = useState(false);
    const dispatchModal = useModalDispatch();

    const [payload, call] = useFetchApi<unknown, { projectId: string, name: string }>("PATCH", `projects/${projectId}`, [], () => {
        props.call()
        dispatchModal({ type: "close", payload: null })
    });

    const handelSubmit = (e: FormEvent) => {
        e.preventDefault();
        call({ projectId: projectId as string, name })
    }

    return (
        <form onSubmit={handelSubmit} className="flex flex-col justify-center items-center pb-2 px-4 text-center h-full gap-4">
            <h1 className="text-3xl py-8 font-bold text-primary dark:text-secondary">change name</h1>

            <TextFiled
                validation={[
                    { validate: (str: string) => str.length > 0, massage: "name is required" },
                    { validate: (str: string) => str.length <= 100, massage: "max length of name is 100 character" }
                ]}
                value={name}
                onChange={(e) => setName(e.target.value)}
                label="project name"
                setIsValid={setIsValidName}
            />

            <div className="flex flex-row items-center mt-4 justify-center w-full px-4">
                <Button
                    isLoading={payload.isLoading}
                    buttonProps={{ type: "submit" }}
                    isValid={isValidName}>change</Button>
            </div>
        </form>
    )
}

export default UpdateModal;
