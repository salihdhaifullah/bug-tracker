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
        <div className="flex justify-center items-center"
            onClick={() => insertLineBreak()}>
            <AiOutlineLine className="text-gray-700 text-xl rounded-sm hover:bg-gray-200 hover:text-secondary cursor-pointer" />
        </div>
    )
}

export default LineBreak
