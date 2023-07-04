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
          end = boundaryEnd + 2;
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
            <BiItalic className="text-gray-700 text-xl rounded-sm hover:bg-gray-200 hover:text-secondary cursor-pointer" />
        </div>
    )
}

export default Italic;
