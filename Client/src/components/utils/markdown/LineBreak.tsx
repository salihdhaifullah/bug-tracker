import { AiOutlineLine } from "react-icons/ai"
import { setRange, useTextarea } from "./util";

const LINE_BREAK = "___";

const LineBreak = () => {
    const textarea = useTextarea();

    const insertLineBreak = () => {
        const start = textarea.selectionStart;
        setRange(textarea, start);
        document.execCommand("insertText", false, `\n${LINE_BREAK}\n`);
        setRange(textarea, start + 5);
    }

    return (
        <div title="Line break" className="flex justify-center items-center"
            onClick={() => insertLineBreak()}>
            <AiOutlineLine className="text-gray-700 dark:text-gray-300 dark:hover:bg-slate-800 hover:bg-slate-200 hover:text-primary dark:hover:text-secondary text-xl rounded-sm cursor-pointer" />
        </div>
    )
}

export default LineBreak
