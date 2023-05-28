import { BiItalic } from "react-icons/bi";
import { setRange } from ".";

interface IItalicProps {
    textarea: HTMLTextAreaElement
    setMdAndSaveChanges: (md: string) => void
}

const UNDER_SCORE = "_";
const SPACE = " ";
const NEWLINE = "\n";

const Italic = (props: IItalicProps) => {

    const isWrappedWithUnderScores = (str: string) => {
        return str.startsWith(UNDER_SCORE) && str.endsWith(UNDER_SCORE);
    };

    const findWordBoundaries = (text: string, index: number) => {
        let boundaryStart = index === 0 ? 0 : index - 1;
        let boundaryEnd = index + 1;

        while (boundaryStart >= 0) {
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

    const insertItalic = () => {
        let text = props.textarea.value;
        const start = props.textarea.selectionStart;
        const end = props.textarea.selectionEnd;

        if (start !== end) {
            const part1 = text.slice(0, start);
            const part2 = text.slice(end);
            const selectedText = text.slice(start, end);

            let isUndo = true;

            if (isWrappedWithUnderScores(selectedText)) {
                text = `${part1}${selectedText.slice(1, -1)}${part2}`;
            } else if (text[start - 1] === UNDER_SCORE && text[end] === UNDER_SCORE) {
                text = `${part1.slice(0, -1)}${selectedText}${part2.slice(1)}`;
            } else {
                isUndo = false;
                text = `${part1}${UNDER_SCORE}${selectedText}${UNDER_SCORE}${part2}`;
            }

            props.textarea.value = text;
            props.setMdAndSaveChanges(text);

            const rangeStart = isUndo ? start - 1 : start + 1;
            const rangeEnd = isUndo ? end - 1 : end + 1;

            setRange(props.textarea, rangeStart, rangeEnd);
        } else {
            let word = "";

            const { boundaryStart, boundaryEnd } = findWordBoundaries(text, start);

            word = text.slice(boundaryStart + 1, boundaryEnd);

            let newWord = word;
            let isUndo = false;
            if (isWrappedWithUnderScores(newWord)) {
                newWord = newWord.slice(1, -1);
                isUndo = true;
            } else {
                newWord = `${UNDER_SCORE}${newWord}${UNDER_SCORE}`;
            }

            let part1 = text.slice(0, boundaryStart + 1);
            let part2 = text.slice(boundaryEnd);

            text = `${part1}${newWord}${part2}`;

            props.textarea.value = text;
            props.setMdAndSaveChanges(text);

            const rangeStart = isUndo ? part1.length : part1.length + 1;
            const rangeEnd = isUndo ? part1.length + newWord.length : part1.length + newWord.length - 1;

            setRange(props.textarea, rangeStart, rangeEnd);
        }
    };

    return (
        <div className="flex justify-center items-center"
            onClick={() => insertItalic()}>
            <BiItalic className="text-gray-700 text-xl rounded-sm hover:bg-gray-200 hover:text-secondary cursor-pointer" />
        </div>
    )
}

export default Italic;
