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
        <div className="flex justify-center items-center"
            onClick={() => insertCodeBlock()}>
            <BiCodeAlt className="text-gray-700 text-xl rounded-sm hover:bg-gray-200 hover:text-secondary cursor-pointer" />
        </div>
    )
}

export default CodeBlock;
