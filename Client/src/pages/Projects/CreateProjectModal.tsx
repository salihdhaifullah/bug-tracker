import { Dispatch, FormEvent, useEffect, useState } from "react";
import useFetchApi from "../../utils/hooks/useFetchApi";
import TextFiled from "../../components/utils/TextFiled";
import CheckBox from "../../components/utils/CheckBox";
import { BiBookBookmark } from "react-icons/bi";
import { FiLock } from "react-icons/fi";
import Button from "../../components/utils/Button";
import { MdOutlineCreateNewFolder, MdOutlineDriveFileRenameOutline } from "react-icons/md";
import Modal from "../../components/utils/Modal";

interface ICreateProjectModal {
    isOpenModal: boolean;
    setIsOpenModal: Dispatch<React.SetStateAction<boolean>>;
}

const CreateProjectModal = (props: ICreateProjectModal) => {
    const [name, setName] = useState("");
    const [projectState, setProjectState] = useState("public");
    const [isValidName, setIsValidName] = useState(false);

    const [payload, call] = useFetchApi<unknown, { name: string, isPrivate: boolean }>("POST", "project", [], () => {
        props.setIsOpenModal(false);
        setName("");
        setProjectState("public");
    });

    useEffect(() => {
        if (!props.isOpenModal) {
            setName("");
            setProjectState("public");
        }
    }, [props.isOpenModal])

    const handelSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        call({ name, isPrivate: projectState === "private" });
    }

    return (
        <Modal isOpen={props.isOpenModal} setIsOpen={props.setIsOpenModal}>
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
        </Modal>
    )
}

export default CreateProjectModal;
