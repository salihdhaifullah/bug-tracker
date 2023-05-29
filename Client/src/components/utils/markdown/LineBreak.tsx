import { AiOutlineLine } from "react-icons/ai"
import { setRange } from ".";

interface ILineBreakProps {
    textarea: HTMLTextAreaElement
    setMdAndSaveChanges: (md: string) => void
}

const LINE_BREAK = "___\n";

const LineBreak = (props: ILineBreakProps) => {
    const insertLineBreak = () => {
        let text = props.textarea.value;
        const start = props.textarea.selectionStart;
        const end = props.textarea.selectionEnd;

        const part1 = text.slice(0, start);
        const part2 = text.slice(end);
        const currentLines = part1.split("\n");
        const currentLine = currentLines[currentLines.length - 1];
        const isAddNewLine = currentLine.trim().length >= 1;

        text = `${part1}${isAddNewLine ? "\n" : ""} ${LINE_BREAK} ${part2}`;

        props.textarea.value = text;
        props.setMdAndSaveChanges(text);

        setRange(props.textarea, (isAddNewLine ? 1 : 0) + start + 2 + LINE_BREAK.length);
    }

    return (
        <div className="flex justify-center items-center"
            onClick={() => insertLineBreak()}>
            <AiOutlineLine className="text-gray-700 text-xl rounded-sm hover:bg-gray-200 hover:text-secondary cursor-pointer" />
        </div>
    )
}

export default LineBreak
