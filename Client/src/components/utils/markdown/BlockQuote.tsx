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
        let boundaryStart = index > 0 ? (text[index - 1] !== NEWLINE ? index - 1 : index) : index;
        let boundaryEnd = text[index] !== NEWLINE ? index + 1 : index;

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
            const currentLines = part1.split("\n");

            const spaces = `\n${currentLines[currentLines.length - 1] ? "\n" : ""}`
            text = `${part1}${spaces}${BLOCK_QUOTE} ${selectedText}\n${part2}`;

            props.textarea.value = text;
            props.setMdAndSaveChanges(text);
            setRange(props.textarea, end + 2 + spaces.length);
        } else {
            const { boundaryStart, boundaryEnd } = findWordBoundaries(text, start);

            const part1 = text.slice(0, boundaryStart);
            const word = text.slice(boundaryStart, boundaryEnd);
            const part2 = text.slice(boundaryEnd, text.length);
            const text1 = text;

            const spaces = part1.trim().length ? "\n\n" : "";

            text = `${part1}${spaces}${BLOCK_QUOTE} ${word} \n${part2}`;

            console.table({
                text1: `"${text1}"`,
                word: `"${word}"`,
                part1: `"${part1}"`,
                part2: `"${part2}"`,
                text: `"${text}"`
            })

            props.textarea.value = text;
            props.setMdAndSaveChanges(text);
            setRange(props.textarea, start + spaces.length + (word.length ? 2 : -2));
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
