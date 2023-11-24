import { BsQuote } from "react-icons/bs";
import { findWordBoundaries, setRange, useTextarea } from "./util";

const BLOCK_QUOTE = ">";

const BlockQuote = () => {
    const textarea = useTextarea();

    const insertBlockQuote = () => {
        const text = textarea.value;
        let start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        if (start === end) start = findWordBoundaries(text, start).boundaryStart;

        setRange(textarea, start);
        document.execCommand("insertText", false, `\n${BLOCK_QUOTE} `);
        setRange(textarea,  end + 3);
    };

    return (
        <div title="Block quote" className="flex justify-center items-center"
            onClick={() => insertBlockQuote()}>
            <BsQuote className="text-gray-700 dark:text-gray-300 dark:hover:bg-slate-800 hover:bg-slate-200 hover:text-primary dark:hover:text-secondary text-xl rounded-sm cursor-pointer" />
        </div>
    )
}

export default BlockQuote;
