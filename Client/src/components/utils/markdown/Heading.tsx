import { BiHeading } from "react-icons/bi";
import { setRange } from ".";

const NEWLINE = "\n";
const SPACE = " ";

interface IHeadingProps {
    textarea: HTMLTextAreaElement;
    setMdAndSaveChanges: (md: string) => void;
}

const Heading = (props: IHeadingProps) => {

    const findWordBoundaries = (text: string, index: number): { boundaryStart: number, boundaryEnd: number } => {
        let boundaryStart = index > 0 ? (text[index - 1] !== NEWLINE ? index - 1 : index) : index;
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


    const insertHeading = (headingType: number) => {
        let text = props.textarea.value;
        const start = props.textarea.selectionStart;
        const end = props.textarea.selectionEnd;

        if (end !== start) {
            const part1 = text.slice(0, start);
            const part2 = text.slice(end);
            const selectedText = text.slice(start, end);

            text = `${part1} ${"#".repeat(headingType)} ${selectedText} ${part2}`;

            props.textarea.value = text;
            props.setMdAndSaveChanges(text);

            setRange(props.textarea, headingType + end + 3);
        } else {
            const { boundaryStart, boundaryEnd } = findWordBoundaries(text, start);

            const part1 = text.slice(0, boundaryStart);
            const word = text.slice(boundaryStart, boundaryEnd);
            const part2 = text.slice(boundaryEnd, text.length);

            text = `${part1} ${"#".repeat(headingType)} ${word} ${part2}`;

            props.textarea.value = text;
            props.setMdAndSaveChanges(text);

            setRange(props.textarea, headingType + end + 3);
        }
    };

    return (
        <div className="flex group flex-row gap-2 items-center relative">
            <BiHeading className="text-gray-700 text-xl rounded-sm hover:bg-gray-200 hover:text-secondary cursor-pointer" />

            <div className="group-hover:h-auto group-hover:w-auto w-0 h-0 max-h-40 -left-8 top-4 absolute transition-all ease-in-out bg-white group-hover:p-2 rounded-md group-hover:shadow-md">
                {["text-2xl", "text-xl", "text-lg", "text-base", "text-sm", "text-xs"].map(
                    (textType, index) => (
                        <p key={index}
                            className={`text-gray-700 p-1 flex justify-center items-center rounded-sm hover:bg-gray-200 hover:text-secondary cursor-pointer ${textType} `}
                            onClick={() => insertHeading(index + 1)}>
                            <BiHeading />
                        </p>
                    )
                )}
            </div>
        </div>
    );
};

export default Heading;
