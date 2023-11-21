import { BsFillEyeSlashFill, BsFillEyeFill } from "react-icons/bs";

const PasswordEye = ({ setType, type }: { setType: (type: string) => void, type: string }) => {

    return (
        <div className="absolute text-gray-500 dark:text-white text-bold text-3xl right-1 top-[15%]">
            {type === "password"
                ? <BsFillEyeFill
                    className="rounded-md  hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer p-1"
                    onClick={() => setType("text")} />
                : <BsFillEyeSlashFill
                    className="rounded-md  hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer p-1"
                    onClick={() => setType("password")} />
            }
        </div>
    )
}

export default PasswordEye;
