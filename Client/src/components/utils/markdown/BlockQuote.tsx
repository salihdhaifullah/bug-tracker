import { BsQuote } from "react-icons/bs";
import { setRange } from ".";

interface IQuoteProps {
    textarea: HTMLTextAreaElement
    setMdAndSaveChanges: (md: string) => void
}

const BLOCK_QUOTE = ">";
const NEWLINE = "\n";
const SPACE = " ";

const BlockQuote = (props: IQuoteProps) => {

    const findWordBoundaries = (text: string, index: number): { boundaryStart: number, boundaryEnd: number } => {
        let boundaryStart = index > 0 ? index - 1 : 0;
        let boundaryEnd = index + 1;

        while (boundaryStart > 0) {
            const char = text[boundaryStart];
            if (char === SPACE || char === NEWLINE || !char) break;
            boundaryStart--;
        }

        while (boundaryEnd < text.length) {
            const char = text[boundaryEnd];
            if (char === SPACE || char === NEWLINE || !char) break;
            boundaryEnd++;
        }

        return { boundaryStart, boundaryEnd };
    };


    const insertBlockQuote = () => {
        let text = props.textarea.value;
        const start = props.textarea.selectionStart;
        const end = props.textarea.selectionEnd;

        if (end !== start) {
            const part1 = text.slice(0, start);
            const part2 = text.slice(end);
            const selectedText = text.slice(start, end);

            text = `${part1} ${BLOCK_QUOTE} ${selectedText} ${part2}`;

            props.textarea.value = text;
            props.setMdAndSaveChanges(text);
            setRange(props.textarea, end + 4, end + 4);
        } else {
            const { boundaryStart, boundaryEnd } = findWordBoundaries(text, start);

            const part1 = text.slice(0, boundaryStart);
            const word = text.slice(boundaryStart, boundaryEnd);
            const part2 = text.slice(boundaryEnd, text.length);

            const range = (part1.trim().length ? 2 : 0) + 4 + boundaryEnd;

            text = `${part1}${part1.trim().length ? "\n\n" : ""} ${BLOCK_QUOTE} ${word} ${part2}`;

            props.textarea.value = text;
            props.setMdAndSaveChanges(text);
            setRange(props.textarea, range, range);
        }
    };


    return (
        <div className="flex justify-center items-center"
            onClick={() => insertBlockQuote()}>
            <BsQuote className="text-gray-700 text-xl rounded-sm hover:bg-gray-200 hover:text-secondary cursor-pointer" />
        </div>
    )
}

export default BlockQuote;
