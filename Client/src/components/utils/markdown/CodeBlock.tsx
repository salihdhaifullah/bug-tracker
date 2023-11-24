import { BiCodeAlt } from "react-icons/bi";
import { findWordBoundaries, setRange, useTextarea } from "./util";

const BACK_TICK = "`";

const CodeBlock = () => {
    const textarea = useTextarea();

    const insertCodeBlock = () => {
        const text = textarea.value;
        let start = textarea.selectionStart;
        let end = textarea.selectionEnd;

        if (start === end) {
          const {boundaryStart, boundaryEnd} = findWordBoundaries(text, start);
          start = boundaryStart;
          end = boundaryEnd + 1;
        }

        setRange(textarea, start);
        document.execCommand("insertText", false, BACK_TICK);
        setRange(textarea, end);
        document.execCommand("insertText", false, BACK_TICK);

        setRange(textarea, end);
    };

    return (
        <div title="Code block" className="flex justify-center items-center"
            onClick={() => insertCodeBlock()}>
            <BiCodeAlt className="text-gray-700 dark:text-gray-300 dark:hover:bg-slate-800 hover:bg-slate-200 hover:text-primary dark:hover:text-secondary text-xl rounded-sm cursor-pointer" />
        </div>
    )
}

export default CodeBlock;
