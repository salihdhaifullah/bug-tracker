import { BiItalic } from "react-icons/bi";
import { findWordBoundaries, setRange, useTextarea } from "./util";

const UNDER_SCORE = "_";

const Italic = () => {

    const textarea = useTextarea();

    const insertItalic = () => {
        const text = textarea.value;
        let start = textarea.selectionStart;
        let end = textarea.selectionEnd;

        if (start === end) {
          const {boundaryStart, boundaryEnd} = findWordBoundaries(text, start);
          start = boundaryStart;
          end = boundaryEnd + 1;
        }

        setRange(textarea, start);
        document.execCommand("insertText", false, UNDER_SCORE);
        setRange(textarea, end);
        document.execCommand("insertText", false, UNDER_SCORE);

        setRange(textarea, end);
    };

    return (
        <div title="Italic" className="flex justify-center items-center"
            onClick={() => insertItalic()}>
            <BiItalic className="text-gray-700 dark:text-gray-300 dark:hover:bg-slate-800 hover:bg-slate-200 hover:text-primary dark:hover:text-secondary text-xl rounded-sm cursor-pointer" />
        </div>
    )
}

export default Italic;
