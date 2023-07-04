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
        <div className="flex justify-center items-center"
            onClick={() => insertLink()}>
            <BiLink className="text-gray-700 text-xl rounded-sm hover:bg-gray-200 hover:text-secondary cursor-pointer" />
        </div>
    )
}


export default Link;
