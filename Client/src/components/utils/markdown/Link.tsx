import { BiLink } from "react-icons/bi";
import { setRange, useTextarea } from "./util";

const LINK = "[](https://)";

const Link = () => {
    const textarea = useTextarea();

    const insertLink = () => {
        const start = textarea.selectionStart;
        setRange(textarea, start);
        document.execCommand("insertText", false, ` ${LINK} `);
        setRange(textarea, start + 2);
    }

    return (
        <div title="Link" className="flex justify-center items-center"
            onClick={() => insertLink()}>
            <BiLink className="text-gray-700 dark:text-gray-300 dark:hover:bg-slate-800 hover:bg-slate-200 hover:text-primary dark:hover:text-secondary text-xl rounded-sm cursor-pointer" />
        </div>
    )
}


export default Link;
