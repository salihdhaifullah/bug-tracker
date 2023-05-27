import { BiHeading } from "react-icons/bi";
import { setRange } from ".";

// constant for newline character
const NEWLINE = "\n";
const SPACE = " ";

interface IHeadingProps {
    textarea: HTMLTextAreaElement;
    setMdAndSaveChanges: (md: string) => void;
}

const Heading = (props: IHeadingProps) => {

    // helper function to find the boundaries of a word in a text
    const findWordBoundaries = (text: string, index: number): { boundaryStart: number, boundaryEnd: number } => {
        let boundaryStart = index > 0 ? index - 1 : 0;
        let boundaryEnd = index + 1;

        // find the left boundary by moving backwards until a space or newline is encountered
        while (boundaryStart > 0) {
            const char = text[boundaryStart];
            if (char === SPACE || char === NEWLINE || !char) break;
            boundaryStart--;
        }

        // find the right boundary by moving forward until a space or newline is encountered
        while (boundaryEnd < text.length) {
            const char = text[boundaryEnd];
            if (char === SPACE || char === NEWLINE || !char) break;
            boundaryEnd++;
        }

        return { boundaryStart, boundaryEnd };
    };


    // function to insert heading formatting to the current line
    const insertHeading = (headingType: number) => {
        let text = props.textarea.value;
        const start = props.textarea.selectionStart;
        const end = props.textarea.selectionEnd;

        if (end !== start) {
            // get the parts of the text before and after the selection
            const part1 = text.slice(0, start);
            const part2 = text.slice(end);
            // get the selected text
            const selectedText = text.slice(start, end);

            text = `${part1} ${"#".repeat(headingType)} ${selectedText} ${part2}`;

            props.textarea.value = text;
            props.setMdAndSaveChanges(text);
            setRange(props.textarea, end + 4, end + 4);
        } else {
            // find the boundaries
            const { boundaryStart, boundaryEnd } = findWordBoundaries(text, start);

            // get the parts of the text before and after the current line
            const part1 = text.slice(0, boundaryStart);
            const word = text.slice(boundaryStart, boundaryEnd);
            const part2 = text.slice(boundaryEnd, text.length);

            // add hashes and a space to the current line
            text = `${part1} ${"#".repeat(headingType)} ${word} ${part2}`;

            props.textarea.value = text;
            props.setMdAndSaveChanges(text);
            setRange(props.textarea, boundaryEnd + 4, boundaryEnd + 4);
        }
    };

    return (
        <div className="flex group flex-row gap-2 items-center relative">
            <BiHeading className="text-gray-700 text-xl rounded-sm hover:bg-gray-200 hover:text-secondary cursor-pointer" />

            <div className="group-hover:h-auto group-hover:w-auto w-0 h-0 max-h-40 -left-8 top-4 absolute transition-all ease-in-out bg-white group-hover:p-2 rounded-md group-hover:shadow-md">
                {["text-2xl", "text-xl", "text-lg", "text-base", "text-sm", "text-xs"].map(
                    (textType, index) => (
                        <p
                            key={index}
                            className={`text-gray-700 p-1 flex justify-center items-center rounded-sm hover:bg-gray-200 hover:text-secondary cursor-pointer ${textType} `}
                            onClick={() => insertHeading(index + 1)}
                        >
                            <BiHeading />
                        </p>
                    )
                )}
            </div>
        </div>
    );
};

export default Heading;
