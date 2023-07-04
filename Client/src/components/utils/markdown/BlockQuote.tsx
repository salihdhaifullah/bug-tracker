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
        <div className="flex justify-center items-center"
            onClick={() => insertBlockQuote()}>
            <BsQuote className="text-gray-700 text-xl rounded-sm hover:bg-gray-200 hover:text-secondary cursor-pointer" />
        </div>
    )
}

export default BlockQuote;
